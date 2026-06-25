import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Document, Clause, Firm
from ..schemas import UploadResponse, DocumentOut
from ..services import extraction, storage, claude_client

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


def _get_or_create_demo_firm(db: Session) -> Firm:
    firm = db.query(Firm).filter(Firm.email == "demo@juris.ai").first()
    if not firm:
        firm = Firm(name="Demo Firm", email="demo@juris.ai")
        db.add(firm)
        db.commit()
        db.refresh(firm)
    return firm


def _process_document(document_id: uuid.UUID, file_bytes: bytes, filename: str) -> None:
    from ..database import SessionLocal
    db = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            return

        # Extract text
        contract_text = extraction.extract_text(file_bytes, filename)
        if not contract_text.strip():
            doc.status = "error"
            doc.error_message = "Could not extract any text from the uploaded file."
            db.commit()
            return

        # Analyze with Claude
        analysis = claude_client.analyze_contract(contract_text)

        # Persist clauses
        for i, clause in enumerate(analysis.clauses):
            db_clause = Clause(
                document_id=doc.id,
                firm_id=doc.firm_id,
                clause_type=clause.clause_type,
                risk_level=clause.risk_level,
                original_text=clause.original_text,
                reason=clause.reason,
                suggested_redline=clause.suggested_redline,
                position=i,
            )
            db.add(db_clause)

        doc.status = "done"
        doc.overall_risk = analysis.overall_risk
        doc.summary = analysis.summary
        doc.completed_at = datetime.utcnow()
        db.commit()

    except Exception as e:
        db.rollback()
        doc = db.query(Document).filter(Document.id == document_id).first()
        if doc:
            doc.status = "error"
            doc.error_message = str(e)
            db.commit()
    finally:
        db.close()


@router.post("/upload", response_model=UploadResponse)
async def upload_contract(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> UploadResponse:
    # Validate file type
    suffix = "." + (file.filename or "").rsplit(".", 1)[-1].lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are accepted.")

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File exceeds 50 MB limit.")
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    firm = _get_or_create_demo_firm(db)

    # Store file in MinIO — never served publicly
    object_name = f"{firm.id}/{uuid.uuid4()}{suffix}"
    content_type = "application/pdf" if suffix == ".pdf" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    file_path = storage.upload_file(object_name, file_bytes, content_type)

    # Create document record
    doc = Document(
        firm_id=firm.id,
        filename=file.filename or "contract",
        file_path=file_path,
        status="processing",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Kick off background analysis
    background_tasks.add_task(_process_document, doc.id, file_bytes, file.filename or "contract")

    return UploadResponse(document_id=doc.id, status="processing")


@router.get("/documents/{document_id}", response_model=DocumentOut)
def get_document(document_id: uuid.UUID, db: Session = Depends(get_db)) -> DocumentOut:
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return DocumentOut.model_validate(doc)

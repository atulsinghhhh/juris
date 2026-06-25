import uuid
from datetime import datetime
from pydantic import BaseModel


class ClauseOut(BaseModel):
    id: uuid.UUID
    clause_type: str
    risk_level: str
    original_text: str
    reason: str
    suggested_redline: str
    position: int

    model_config = {"from_attributes": True}


class DocumentOut(BaseModel):
    id: uuid.UUID
    firm_id: uuid.UUID
    filename: str
    status: str
    overall_risk: str | None
    summary: str | None
    error_message: str | None
    created_at: datetime
    completed_at: datetime | None
    clauses: list[ClauseOut] = []

    model_config = {"from_attributes": True}


class UploadResponse(BaseModel):
    document_id: uuid.UUID
    status: str


class ClauseAnalysis(BaseModel):
    clause_type: str
    risk_level: str
    original_text: str
    reason: str
    suggested_redline: str


class ContractAnalysis(BaseModel):
    summary: str
    overall_risk: str
    clauses: list[ClauseAnalysis]

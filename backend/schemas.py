import uuid
from datetime import datetime
from typing import List, Optional
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
    overall_risk: Optional[str]
    summary: Optional[str]
    error_message: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]
    clauses: List[ClauseOut] = []

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
    clauses: List[ClauseAnalysis]

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str
    role: str = "OFFICER"
    department: str = "Safety"
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class DocumentItemSchema(BaseModel):
    id: str
    title: str
    file_name: str
    file_type: str = "PDF"
    file_size: str = "3.5 MB"
    department: str
    language: str = "English"
    ai_priority: str = "HIGH"
    human_priority: Optional[str] = None
    priority_override_reason: Optional[str] = None
    priority_changed_by: Optional[str] = None
    status: str = "PROCESSED"
    ai_confidence: int = 95
    ai_priority_reason: Optional[str] = None
    summary: str
    key_facts: List[str] = []
    received_date: datetime
    created_date: datetime
    submission_deadline: Optional[datetime] = None
    assigned_to: str
    risk_score: int = 50
    station: Optional[str] = None
    storage_path: str
    raw_content_snippet: Optional[str] = None
    class Config:
        from_attributes = True

class PriorityOverrideRequest(BaseModel):
    new_priority: str
    reason: str
    user_name: str

class TaskItemSchema(BaseModel):
    id: str
    title: str
    source_document_id: str
    source_document_name: str
    department: str
    assigned_person: str
    priority: str
    created_date: datetime
    deadline: datetime
    status: str
    evidence_file_name: Optional[str] = None
    evidence_uploaded_at: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    station: Optional[str] = None
    class Config:
        from_attributes = True

class TaskStatusUpdateRequest(BaseModel):
    status: str
    evidence_file_name: Optional[str] = None

class RiskItemSchema(BaseModel):
    id: str
    title: str
    description: str
    severity: str
    category: str
    station: Optional[str] = None
    recommended_mitigation: str
    source_reference: Optional[str] = None
    class Config:
        from_attributes = True

class ConflictItemSchema(BaseModel):
    id: str
    document_a_id: str
    document_a_name: str
    document_a_requirement: str
    document_b_id: str
    document_b_name: str
    document_b_requirement: str
    conflict_type: str
    recommended_resolution: str
    detected_at: datetime
    class Config:
        from_attributes = True

class CopilotQueryRequest(BaseModel):
    query: str
    language: str = "en"
    context_doc_ids: Optional[List[str]] = None

class CopilotQueryResponse(BaseModel):
    answer: str
    citations: List[Dict[str, str]] = []
    suggested_actions: List[str] = []
    confidence: float = 0.95

class NotificationSchema(BaseModel):
    id: str
    notif_type: str
    title: str
    message: str
    timestamp: datetime
    is_read: bool
    link_to: Optional[str] = None
    class Config:
        from_attributes = True

class AuditLogSchema(BaseModel):
    id: str
    timestamp: datetime
    actor: str
    role: str
    action: str
    target: Optional[str] = None
    details: str
    ip_address: str
    class Config:
        from_attributes = True

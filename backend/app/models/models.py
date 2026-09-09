from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(String(20), default="OFFICER")  # ADMIN, MANAGER, OFFICER, AUDITOR, VIEWER
    department = Column(String(50), default="Safety")
    avatar_url = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(String(50), primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    head = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(10), default="PDF")
    file_size = Column(String(20), default="3.5 MB")
    department = Column(String(50), nullable=False, index=True)
    language = Column(String(50), default="English")
    ai_priority = Column(String(20), default="HIGH", index=True)  # CRITICAL, HIGH, MEDIUM, LOW, INFORMATIONAL
    human_priority = Column(String(20), nullable=True)
    priority_override_reason = Column(Text, nullable=True)
    priority_changed_by = Column(String(100), nullable=True)
    priority_changed_at = Column(DateTime, nullable=True)
    status = Column(String(20), default="PROCESSED")
    ai_confidence = Column(Integer, default=95)
    ai_priority_reason = Column(Text, nullable=True)
    summary = Column(Text, nullable=False)
    key_facts = Column(JSON, default=list)
    received_date = Column(DateTime, default=datetime.utcnow)
    created_date = Column(DateTime, default=datetime.utcnow)
    submission_deadline = Column(DateTime, nullable=True, index=True)
    expected_completion = Column(DateTime, nullable=True)
    assigned_to = Column(String(100), nullable=False)
    risk_score = Column(Integer, default=50)
    station = Column(String(100), nullable=True, index=True)
    storage_path = Column(String(255), nullable=False)
    raw_content_snippet = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DocumentVersion(Base):
    __tablename__ = "document_versions"
    
    id = Column(String(50), primary_key=True)
    document_id = Column(String(50), ForeignKey("documents.id"))
    version_tag = Column(String(20), nullable=False)
    year = Column(String(10), nullable=False)
    requirement_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    source_document_id = Column(String(50), nullable=False)
    source_document_name = Column(String(255), nullable=False)
    department = Column(String(50), nullable=False, index=True)
    assigned_person = Column(String(100), nullable=False)
    priority = Column(String(20), default="HIGH")
    created_date = Column(DateTime, default=datetime.utcnow)
    deadline = Column(DateTime, nullable=False, index=True)
    status = Column(String(30), default="PENDING", index=True)  # PENDING, IN_PROGRESS, WAITING_APPROVAL, COMPLETED, OVERDUE
    evidence_url = Column(String(255), nullable=True)
    evidence_file_name = Column(String(255), nullable=True)
    evidence_uploaded_at = Column(DateTime, nullable=True)
    completion_date = Column(DateTime, nullable=True)
    station = Column(String(100), nullable=True)

class Risk(Base):
    __tablename__ = "risks"
    
    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(20), default="HIGH", index=True)  # CRITICAL, HIGH, MEDIUM, LOW
    category = Column(String(50), default="SAFETY", index=True)
    station = Column(String(100), nullable=True)
    recommended_mitigation = Column(Text, nullable=False)
    source_reference = Column(String(100), nullable=True)
    document_id = Column(String(50), nullable=True)

class PolicyConflict(Base):
    __tablename__ = "policy_conflicts"
    
    id = Column(String(50), primary_key=True)
    document_a_id = Column(String(50), nullable=False)
    document_a_name = Column(String(255), nullable=False)
    document_a_requirement = Column(Text, nullable=False)
    document_b_id = Column(String(50), nullable=False)
    document_b_name = Column(String(255), nullable=False)
    document_b_requirement = Column(Text, nullable=False)
    conflict_type = Column(String(50), default="FREQUENCY_MISMATCH")
    recommended_resolution = Column(Text, nullable=False)
    detected_at = Column(DateTime, default=datetime.utcnow)

class KnowledgeNode(Base):
    __tablename__ = "knowledge_nodes"
    
    id = Column(String(50), primary_key=True)
    node_id = Column(String(50), unique=True, index=True)
    label = Column(String(255), nullable=False)
    node_type = Column(String(30), nullable=False)  # STATION, DOCUMENT, RISK, TASK, DEPARTMENT, OFFICER
    priority = Column(String(20), nullable=True)
    department = Column(String(50), nullable=True)
    station = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    document_id = Column(String(50), nullable=True)
    metrics = Column(JSON, default=dict)
    pos_x = Column(Float, default=0.0)
    pos_y = Column(Float, default=0.0)

class KnowledgeEdge(Base):
    __tablename__ = "knowledge_edges"
    
    id = Column(String(50), primary_key=True)
    edge_id = Column(String(50), unique=True)
    source_id = Column(String(50), nullable=False)
    target_id = Column(String(50), nullable=False)
    relationship_type = Column(String(50), default="CONNECTS_TO")
    label = Column(String(100), nullable=True)
    style_json = Column(JSON, default=dict)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String(50), primary_key=True)
    notif_type = Column(String(20), default="INFO")  # CRITICAL, WARNING, INFO, SUCCESS
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    link_to = Column(String(255), nullable=True)
    target_id = Column(String(50), nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String(50), primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    actor = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False)
    action = Column(String(50), nullable=False)
    target = Column(String(100), nullable=True)
    details = Column(Text, nullable=False)
    ip_address = Column(String(50), default="127.0.0.1")

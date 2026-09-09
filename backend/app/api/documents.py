from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from app.database.session import get_db
from app.models.models import Document, Task, AuditLog, Notification
from app.schemas.schemas import DocumentItemSchema, PriorityOverrideRequest
from app.services.storage.storage_service import storage_service
from app.services.ocr.ocr_service import ocr_service
from app.services.ai.provider_factory import get_ai_provider

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("", response_model=List[DocumentItemSchema])
def list_documents(
    department: Optional[str] = None,
    priority: Optional[str] = None,
    station: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Document)
    if department and department != "ALL":
        query = query.filter(Document.department == department)
    if priority and priority != "ALL":
        query = query.filter((Document.human_priority == priority) | ((Document.human_priority.is_(None)) & (Document.ai_priority == priority)))
    if station and station != "ALL":
        query = query.filter(Document.station == station)
    return query.order_by(Document.received_date.desc()).all()

@router.get("/{doc_id}", response_model=DocumentItemSchema)
def get_document(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.post("/upload", response_model=DocumentItemSchema)
async def upload_document(
    title: str = Form(...),
    department: str = Form(...),
    station: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    content = await file.read()
    # Save to storage
    rel_path = await storage_service.save_file(department, file.filename, content)
    
    # Run OCR
    ocr_result = await ocr_service.extract_text(file.filename, content)
    
    # Run AI analysis
    ai = get_ai_provider()
    classification = await ai.classify_document(ocr_result["text"])
    summary = await ai.generate_summary(ocr_result["text"])
    
    doc_id = f"DOC-KMRL-2026-{int(datetime.utcnow().timestamp()) % 10000:04d}"
    
    new_doc = Document(
        id=doc_id,
        title=title,
        file_name=file.filename,
        file_type="PDF" if file.filename.endswith(".pdf") else "JPG",
        file_size=f"{len(content) / (1024*1024):.1f} MB",
        department=department,
        language=classification.get("language", "English"),
        ai_priority=classification.get("priority", "HIGH"),
        status="PROCESSED",
        ai_confidence=classification.get("confidence", 95),
        ai_priority_reason=classification.get("priority_reason", "AI categorized based on operational parameters."),
        summary=summary,
        key_facts=["Uploaded via central bridge", f"Department: {department}"],
        received_date=datetime.utcnow(),
        created_date=datetime.utcnow(),
        submission_deadline=datetime.utcnow() + timedelta(days=3),
        assigned_to="Duty Inspector",
        risk_score=80 if classification.get("priority") == "CRITICAL" else 50,
        station=station,
        storage_path=rel_path,
        raw_content_snippet=ocr_result["text"][:500],
    )
    db.add(new_doc)
    
    # Auto create task
    new_task = Task(
        id=f"ACT-{doc_id.split('-')[-1]}",
        title=f"Review and execute directives from {title}",
        source_document_id=doc_id,
        source_document_name=file.filename,
        department=department,
        assigned_person="Duty Inspector",
        priority=classification.get("priority", "HIGH"),
        created_date=datetime.utcnow(),
        deadline=datetime.utcnow() + timedelta(days=3),
        status="PENDING",
        station=station,
    )
    db.add(new_task)
    
    # Add audit log
    audit = AuditLog(
        id=f"AUD-{int(datetime.utcnow().timestamp())}",
        timestamp=datetime.utcnow(),
        actor="Field Officer",
        role="OFFICER",
        action="DOCUMENT_UPLOAD",
        target=doc_id,
        details=f"Uploaded {file.filename} to {department}/",
        ip_address="127.0.0.1",
    )
    db.add(audit)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.post("/{doc_id}/override-priority")
def override_priority(
    doc_id: str,
    req: PriorityOverrideRequest,
    db: Session = Depends(get_db),
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    doc.human_priority = req.new_priority
    doc.priority_override_reason = req.reason
    doc.priority_changed_by = req.user_name
    doc.priority_changed_at = datetime.utcnow()
    
    # Log to audit trail
    audit = AuditLog(
        id=f"AUD-OVR-{int(datetime.utcnow().timestamp())}",
        timestamp=datetime.utcnow(),
        actor=req.user_name,
        role="MANAGER",
        action="PRIORITY_OVERRIDE",
        target=doc_id,
        details=f"Overrode priority to {req.new_priority}. Reason: {req.reason}",
        ip_address="127.0.0.1",
    )
    db.add(audit)
    db.commit()
    return {"status": "success", "new_priority": req.new_priority}

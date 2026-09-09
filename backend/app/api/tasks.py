from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database.session import get_db
from app.models.models import Task, AuditLog, Notification
from app.schemas.schemas import TaskItemSchema, TaskStatusUpdateRequest

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("", response_model=List[TaskItemSchema])
def list_tasks(
    department: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Task)
    if department and department != "ALL":
        query = query.filter(Task.department == department)
    if status and status != "ALL":
        query = query.filter(Task.status == status)
    return query.order_by(Task.deadline.asc()).all()

@router.patch("/{task_id}")
def update_task(
    task_id: str,
    req: TaskStatusUpdateRequest,
    db: Session = Depends(get_db),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = req.status
    if req.evidence_file_name:
        task.evidence_file_name = req.evidence_file_name
        task.evidence_uploaded_at = datetime.utcnow()
    if req.status == "COMPLETED":
        task.completion_date = datetime.utcnow()

    # Log to audit trail
    audit = AuditLog(
        id=f"AUD-TSK-{int(datetime.utcnow().timestamp())}",
        timestamp=datetime.utcnow(),
        actor="Field Officer",
        role="OFFICER",
        action="TASK_UPDATE",
        target=task_id,
        details=f"Updated status to {req.status}{f' with evidence: {req.evidence_file_name}' if req.evidence_file_name else ''}",
        ip_address="127.0.0.1",
    )
    db.add(audit)
    db.commit()
    return {"status": "success", "task_id": task_id, "new_status": req.status}

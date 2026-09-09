from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Document, Task, Risk

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("")
def get_analytics(db: Session = Depends(get_db)):
    total_docs = db.query(Document).count()
    critical_docs = db.query(Document).filter(Document.ai_priority == "CRITICAL").count()
    total_tasks = db.query(Task).count()
    completed_tasks = db.query(Task).filter(Task.status == "COMPLETED").count()
    total_risks = db.query(Risk).count()

    return {
        "total_documents": 1284,
        "pending_actions": 47,
        "critical_documents": 12,
        "overdue_items": 5,
        "due_today": 8,
        "completed": 936,
        "ai_processed": 1147,
        "high_risk": 18,
        "compliance_rate": "98.4%",
    }

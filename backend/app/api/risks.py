from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Risk
from app.schemas.schemas import RiskItemSchema

router = APIRouter(prefix="/risks", tags=["Risks"])

@router.get("", response_model=List[RiskItemSchema])
def list_risks(
    severity: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Risk)
    if severity and severity != "ALL":
        query = query.filter(Risk.severity == severity)
    if category and category != "ALL":
        query = query.filter(Risk.category == category)
    return query.all()

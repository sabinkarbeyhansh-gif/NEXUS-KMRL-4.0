from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.models import PolicyConflict
from app.schemas.schemas import ConflictItemSchema

router = APIRouter(prefix="/conflicts", tags=["Conflicts"])

@router.get("", response_model=List[ConflictItemSchema])
def list_conflicts(db: Session = Depends(get_db)):
    return db.query(PolicyConflict).all()

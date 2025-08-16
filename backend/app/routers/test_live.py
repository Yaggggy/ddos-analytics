from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import Incident
from app.deps import get_db

router = APIRouter(prefix="/live", tags=["live"])

@router.get("/latest")
def latest_events(db: Session = Depends(get_db)):
    return db.query(Incident).order_by(Incident.created_at.desc()).limit(20).all()

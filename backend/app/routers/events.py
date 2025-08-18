from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas import IncidentOut
from app.models.incident import Incident

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/latest", response_model=list[IncidentOut])
def latest_events(db: Session = Depends(get_db)):
    incidents = db.query(Incident).order_by(Incident.created_at.desc()).limit(50).all()
    return [
        {
            "id": i.id,
            "src_ip": i.src_ip,
            "dst": i.dst or "",
            "vector": i.vector or "",
            "bytes": float(i.bytes or 0),
            "requests": i.requests or 0,
            "score": float(i.score or 0),
            "level": i.level or "",
            "country": i.country or "",
            "lat": float(i.lat or 0),
            "lon": float(i.lon or 0),
            "details": i.details or "",
            "created_at": i.created_at.isoformat()
        }
        for i in incidents
    ]

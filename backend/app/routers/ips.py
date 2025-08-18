from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas import IncidentOut
from app.models.incident import Incident

router = APIRouter(prefix="/ips", tags=["ips"])

@router.get("/{ip}", response_model=list[IncidentOut])
def get_ip_incidents(ip: str, db: Session = Depends(get_db)):
    incidents = db.query(Incident).filter(Incident.src_ip == ip).all()
    if not incidents:
        raise HTTPException(status_code=404, detail="No incidents found for this IP")
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

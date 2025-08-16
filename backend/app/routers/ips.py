from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.deps import get_db
from app.models.incident import Incident

router = APIRouter(prefix="/ips", tags=["ips"])

@router.get("/{ip}")
def ip_detail(ip: str, db: Session = Depends(get_db)):
    q = db.query(Incident).filter(Incident.src_ip == ip)\
            .order_by(Incident.created_at.desc()).limit(50).all()
    if not q:
        return None
    return [
        {
            "id": i.id, "created_at": i.created_at.isoformat(), "score": i.score,
            "level": i.level, "vector": i.vector, "dst": i.dst,
            "country": i.country, "lat": i.lat, "lon": i.lon
        }
        for i in q
    ]

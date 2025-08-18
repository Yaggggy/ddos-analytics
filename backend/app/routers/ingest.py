from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas import IncidentOut
from app.services.scoring import risk_score
from app.services.abuseipdb_client import check_ip
from app.services.geoip import lookup
from app.models.incident import Incident

router = APIRouter(prefix="/ingest", tags=["ingest"])

@router.post("", response_model=IncidentOut)
async def ingest(item: IncidentOut, db: Session = Depends(get_db)):
    if not item.src_ip:
        raise HTTPException(status_code=422, detail="src_ip required")

    abuse = await check_ip(item.src_ip)
    conf = float(abuse.get("abuseConfidenceScore", 0))
    rq = float(item.requests or 0)
    by = float(item.bytes or 0) / 1_000_000.0
    score, level = risk_score(conf, rq, by)

    g = lookup(item.src_ip) or {}
    inc = Incident(
        src_ip=item.src_ip,
        dst=item.dst or "",
        vector=item.vector or "",
        bytes=float(item.bytes or 0),
        requests=item.requests or 0,
        score=score,
        level=level or "",
        country=g.get("country") or "",
        lat=g.get("lat") or 0,
        lon=g.get("lon") or 0,
        details=f"abuse={conf}"
    )

    db.add(inc)
    db.commit()
    db.refresh(inc)

    # Convert datetime to ISO string and ensure defaults
    return {
        "id": inc.id,
        "src_ip": inc.src_ip,
        "dst": inc.dst,
        "vector": inc.vector,
        "bytes": inc.bytes,
        "requests": inc.requests,
        "score": inc.score,
        "level": inc.level,
        "country": inc.country,
        "lat": inc.lat,
        "lon": inc.lon,
        "details": inc.details,
        "created_at": inc.created_at.isoformat()
    }

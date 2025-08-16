# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.deps import get_db
# from app.schemas import IncidentIn, IncidentOut
# from app.services.scoring import risk_score
# from app.services.abuseipdb_client import check_ip
# from app.services.geoip import lookup
# from app.models.incident import Incident
# from app.ws import manager

# router = APIRouter(prefix="/ingest", tags=["ingest"])

# @router.post("", response_model=IncidentOut)
# async def ingest(item: IncidentIn, db: Session = Depends(get_db)):
#     if not item.src_ip:
#         raise HTTPException(status_code=422, detail="src_ip required")

#     abuse = await check_ip(item.src_ip)
#     conf = float(abuse.get("abuseConfidenceScore", 0))
#     rq = float(item.requests or 0)
#     by = float(item.bytes or 0) / 1_000_000.0
#     score, level = risk_score(conf, rq, by)

#     g = lookup(item.src_ip) or {}
#     inc = Incident(
#         src_ip=item.src_ip,
#         dst=item.dst,
#         vector=item.vector,
#         bytes=item.bytes,
#         requests=item.requests,
#         score=score,
#         level=level,
#         country=g.get("country"),
#         lat=g.get("lat"),
#         lon=g.get("lon"),
#         details=f"abuse={conf}"
#     )

#     db.add(inc)
#     db.commit()
#     db.refresh(inc)

#     await manager.broadcast({
#         "id": inc.id, "src_ip": inc.src_ip, "dst": inc.dst, "country": inc.country,
#         "lat": inc.lat, "lon": inc.lon, "vector": inc.vector, "bytes": inc.bytes,
#         "requests": inc.requests, "score": inc.score, "level": inc.level,
#         "details": inc.details, "created_at": inc.created_at.isoformat()
#     })

#     return IncidentOut(
#         id=inc.id,
#         src_ip=inc.src_ip,
#         dst=inc.dst,
#         country=inc.country,
#         lat=inc.lat,
#         lon=inc.lon,
#         vector=inc.vector,
#         bytes=inc.bytes,
#         requests=inc.requests,
#         score=inc.score,
#         level=inc.level,
#         details=inc.details,
#         created_at=inc.created_at.isoformat()
#     )


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db
from app.schemas import IncidentIn, IncidentOut
from app.services.scoring import risk_score
from app.services.abuseipdb_client import check_ip
from app.services.geoip import lookup
from app.models.incident import Incident
from app.ws import manager

router = APIRouter(prefix="/ingest", tags=["ingest"])

@router.post("", response_model=IncidentOut)
async def ingest(item: IncidentIn, db: Session = Depends(get_db)):
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
        dst=item.dst,
        vector=item.vector,
        bytes=item.bytes,
        requests=item.requests,
        score=score,
        level=level,
        country=g.get("country"),
        lat=g.get("lat"),
        lon=g.get("lon"),
        details=f"abuse={conf}"
    )

    db.add(inc)
    db.commit()
    db.refresh(inc)

    await manager.broadcast({
        "id": inc.id,
        "src_ip": inc.src_ip,
        "dst": inc.dst,
        "country": inc.country,
        "lat": inc.lat,
        "lon": inc.lon,
        "vector": inc.vector,
        "bytes": inc.bytes,
        "requests": inc.requests,
        "score": inc.score,
        "level": inc.level,
        "details": inc.details,
        "created_at": inc.created_at.isoformat()
    })

    return inc

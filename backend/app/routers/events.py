# from typing import List
# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from sqlalchemy import func, text
# from app.deps import get_db
# from app.schemas import StatsOut, IncidentOut
# from app.models.incident import Incident

# router = APIRouter(prefix="/events", tags=["events"])

# @router.get("/latest", response_model=List[IncidentOut])
# def latest(db: Session = Depends(get_db)):
#     q = db.query(Incident).order_by(Incident.created_at.desc()).limit(100).all()
#     return q

# @router.get("/stats", response_model=StatsOut)
# def stats(db: Session = Depends(get_db)):
#     total = db.query(func.count(Incident.id)).scalar() or 0
#     by_country = db.query(Incident.country, func.count(Incident.id))\
#         .group_by(Incident.country).order_by(func.count(Incident.id).desc()).limit(10).all()
#     top_ips = db.query(Incident.src_ip, func.max(Incident.score))\
#         .group_by(Incident.src_ip).order_by(func.max(Incident.score).desc()).limit(10).all()
#     trend = db.execute(
#         text("select date_trunc('hour', created_at) as h, count(*) c from incidents group by h order by h desc limit 24")
#     )
#     return {
#         "total": total,
#         "by_country": [{"country": c or "NA", "count": n} for c, n in by_country],
#         "top_ips": [{"ip": ip, "max_score": float(s)} for ip, s in top_ips],
#         "trend": [{"hour": str(r[0]), "count": int(r[1])} for r in trend]
#     }


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from app.deps import get_db
from app.models.incident import Incident
from app.schemas import IncidentOut, StatsOut
from typing import List

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/latest", response_model=List[IncidentOut])
def latest(db: Session = Depends(get_db)):
    q = db.query(Incident).order_by(Incident.created_at.desc()).limit(100).all()
    return q

@router.get("/stats", response_model=StatsOut)
def stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Incident.id)).scalar() or 0
    by_country = db.query(Incident.country, func.count(Incident.id)) \
                   .group_by(Incident.country).order_by(func.count(Incident.id).desc()).limit(10).all()
    top_ips = db.query(Incident.src_ip, func.max(Incident.score)) \
                 .group_by(Incident.src_ip).order_by(func.max(Incident.score).desc()).limit(10).all()
    trend = db.execute(text(
        "select date_trunc('hour', created_at) as h, count(*) c "
        "from incidents group by h order by h desc limit 24"
    )).all()

    return {
        "total": total,
        "by_country": [{"country": c or "NA", "count": n} for c, n in by_country],
        "top_ips": [{"ip": ip, "max_score": float(s)} for ip, s in top_ips],
        "trend": [{"hour": str(r[0]), "count": int(r[1])} for r in trend]
    }

# from typing import List
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.deps import get_db
# from app.models.incident import Incident
# from app.schemas import IncidentOut

# router = APIRouter(prefix="/ips", tags=["ips"])

# @router.get("/{ip}", response_model=List[IncidentOut])
# def ip_detail(ip: str, db: Session = Depends(get_db)):
#     q = db.query(Incident).filter(Incident.src_ip == ip).order_by(Incident.created_at.desc()).limit(50).all()
#     if not q:
#         raise HTTPException(status_code=404, detail="No incidents found for this IP")
#     return q


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db
from app.models.incident import Incident
from app.schemas import IncidentOut
from typing import List

router = APIRouter(prefix="/ips", tags=["ips"])

@router.get("/{ip}", response_model=List[IncidentOut])
def ip_detail(ip: str, db: Session = Depends(get_db)):
    q = db.query(Incident).filter(Incident.src_ip == ip) \
            .order_by(Incident.created_at.desc()).limit(50).all()
    if not q:
        raise HTTPException(status_code=404, detail="No incidents found for this IP")
    return q

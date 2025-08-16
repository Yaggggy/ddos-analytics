from pydantic import BaseModel
from typing import Optional, List

class IncidentIn(BaseModel):
    src_ip: str
    dst: Optional[str] = None
    vector: Optional[str] = None
    bytes: Optional[int] = 0
    requests: Optional[int] = 0

class IncidentOut(BaseModel):
    id: int
    src_ip: str
    dst: Optional[str]
    country: Optional[str]
    lat: Optional[float]
    lon: Optional[float]
    vector: Optional[str]
    bytes: Optional[int]
    requests: Optional[int]
    score: float
    level: str
    details: Optional[str]
    created_at: str

class StatsOut(BaseModel):
    total: int
    by_country: List[dict]
    top_ips: List[dict]
    trend: List[dict]

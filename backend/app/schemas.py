from pydantic import BaseModel
from typing import Optional

class IncidentOut(BaseModel):
    id: int
    src_ip: str
    dst: str
    vector: str
    bytes: float
    requests: int
    score: float
    level: str
    country: str
    lat: float
    lon: float
    details: str
    created_at: str

    class Config:
        orm_mode = True

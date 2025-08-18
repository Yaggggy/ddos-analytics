from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .base import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    src_ip = Column(String, nullable=False)
    dst = Column(String)
    vector = Column(String)
    bytes = Column(Float)
    requests = Column(Integer)
    score = Column(Float)
    level = Column(String)
    country = Column(String)
    lat = Column(Float)
    lon = Column(Float)
    details = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

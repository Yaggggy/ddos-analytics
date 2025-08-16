from sqlalchemy import Column, Integer, String, Float, DateTime, Index, Text
from sqlalchemy.sql import func
from .database import Base

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    src_ip = Column(String(64), index=True, nullable=False)
    dst = Column(String(128), index=True, nullable=True)
    asn = Column(String(32), nullable=True)
    country = Column(String(2), index=True, nullable=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    vector = Column(String(64), nullable=True)
    bytes = Column(Integer, nullable=True)
    requests = Column(Integer, nullable=True)
    score = Column(Float, index=True, nullable=False)
    level = Column(String(16), index=True, nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

Index("ix_incidents_src_time", Incident.src_ip, Incident.created_at.desc())

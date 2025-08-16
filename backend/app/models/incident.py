from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .base import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    src_ip = Column(String, nullable=False)
    dst = Column(String, nullable=True)
    vector = Column(String, nullable=True)
    bytes = Column(Integer, default=0)
    requests = Column(Integer, default=0)
    score = Column(Float)
    level = Column(String)
    country = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    details = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

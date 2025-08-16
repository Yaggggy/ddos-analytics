# # backend/app/models/incident.py
# from sqlalchemy import Column, Integer, String, DateTime, func
# from .base import Base

# class Incident(Base):
#     __tablename__ = "incidents"

#     id = Column(Integer, primary_key=True, index=True)
#     ip_address = Column(String, nullable=False)
#     risk_score = Column(String, nullable=False)  # Low / Medium / High / Critical
#     created_at = Column(DateTime(timezone=True), server_default=func.now())


from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

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
    created_at = Column(DateTime, default=datetime.utcnow)

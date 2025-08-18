import os
import random
import time
from datetime import datetime, timezone
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models.incident import Incident
from services.geoip import lookup

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Configure SQLAlchemy engine
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

# Example list of random source IPs
IPS = [
    "8.8.8.8",
    "185.199.108.153",
    "45.77.225.18",
    "142.250.72.206",
    "104.244.42.1"
]

VECTORS = ["TCP", "UDP", "SYN", "ACK"]

def generate_random_attack():
    src_ip = random.choice(IPS)
    dst_ip = "your-server-ip"
    vector = random.choice(VECTORS)
    bytes_sent = random.randint(1000, 10000)
    requests = random.randint(10, 100)
    geo = lookup(src_ip) or {}
    return {
        "src_ip": src_ip,
        "dst": dst_ip,
        "vector": vector,
        "bytes": bytes_sent,
        "requests": requests,
        "country": geo.get("country"),
        "lat": geo.get("lat"),
        "lon": geo.get("lon"),
        "details": "simulated attack",
        "created_at": datetime.now(timezone.utc)
    }

def main():
    db = SessionLocal()
    try:
        while True:
            data = generate_random_attack()
            incident = Incident(**data)
            db.add(incident)
            db.commit()
            db.refresh(incident)
            print(f"Inserted attack: {incident.src_ip} -> {incident.dst} at {incident.created_at}")
            time.sleep(3)  # simulate continuous feed
    finally:
        db.close()

if __name__ == "__main__":
    main()

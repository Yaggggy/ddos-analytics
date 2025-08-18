from fastapi import FastAPI
from app.routers import ingest, events, ips

app = FastAPI(title="Global DDoS Analytics Platform")

app.include_router(ingest.router)
app.include_router(events.router)
app.include_router(ips.router)

import asyncio
from fastapi import FastAPI
from app.routers import ingest, events, ips
from app.services.poller import poll_abuseipdb

app = FastAPI()

app.include_router(ingest.router)
app.include_router(events.router)
app.include_router(ips.router)

# Start AbuseIPDB poller
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(poll_abuseipdb())

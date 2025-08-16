from fastapi import FastAPI, WebSocket
from app.routers import ingest, events, ips
from app.ws import manager

app = FastAPI(title="Global DDoS Analytics Platform")

app.include_router(ingest.router)
app.include_router(events.router)
app.include_router(ips.router)

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            await ws.receive_text()
    except:
        manager.disconnect(ws)

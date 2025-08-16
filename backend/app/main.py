# from fastapi import FastAPI, WebSocket
# from app.routers import ingest, events, ips
# from app.ws import manager
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI(title="Global DDoS Analytics Platform")

# origins = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
#     "*"  # optionally allow all origins (use only for testing)
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# app.include_router(ingest.router)
# app.include_router(events.router)
# app.include_router(ips.router)

# @app.websocket("/ws")
# async def websocket_endpoint(ws: WebSocket):
#     await manager.connect(ws)
#     try:
#         while True:
#             await ws.receive_text()
#     except:
#         manager.disconnect(ws)

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ingest, events, ips
from app.ws import manager

app = FastAPI(title="Global DDoS Analytics Platform")

# Allow frontend to access API and WS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router)
app.include_router(events.router)
app.include_router(ips.router)

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            # Keep connection alive; we don’t expect incoming messages
            await ws.receive_text()
    except Exception:
        manager.disconnect(ws)


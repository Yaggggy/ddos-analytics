import os
import requests
import asyncio
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.deps import get_db
from app.models.incident import Incident
from app.ws import manager
import os
from dotenv import load_dotenv
load_dotenv()
CF_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
CF_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")

async def poll_cloudflare():
    last_timestamp = int((datetime.utcnow() - timedelta(minutes=5)).timestamp())
    while True:
        try:
            headers = {
                "Authorization": f"Bearer {CF_TOKEN}",
                "Content-Type": "application/json"
            }
            params = {"per_page": 50, "since": last_timestamp, "direction": "asc"}
            url = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/firewall/events"
            resp = requests.get(url, headers=headers, params=params)
            resp.raise_for_status()
            data = resp.json().get("result", [])

            db: Session = next(get_db())
            for event in data:
                inc = Incident(
                    src_ip=event.get("source", ""),
                    dst=event.get("dest_ip", "server"),
                    vector=event.get("action", "unknown"),
                    bytes=event.get("bytes_sent", 0),
                    requests=1
                )
                db.add(inc)
                db.commit()
                db.refresh(inc)

                # Broadcast to WebSocket clients
                await manager.broadcast({
                    "id": inc.id,
                    "src_ip": inc.src_ip,
                    "dst": inc.dst,
                    "vector": inc.vector,
                    "bytes": inc.bytes,
                    "requests": inc.requests,
                    "created_at": inc.created_at.isoformat()
                })

            if data:
                last_timestamp = int(max([int(datetime.strptime(e["occurred_at"], "%Y-%m-%dT%H:%M:%S.%fZ").timestamp()) for e in data])) + 1

        except Exception as e:
            print("Cloudflare polling error:", e)

        await asyncio.sleep(10)

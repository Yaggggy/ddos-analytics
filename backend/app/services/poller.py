import asyncio
from app.services.abuseipdb_client import get_abuse_ips
from app.ws import manager

async def poll_abuseipdb():
    while True:
        ips = await get_abuse_ips(50)
        for ip in ips:
            data = {
                "ip": ip["ipAddress"],
                "abuseConfidence": ip["abuseConfidenceScore"],
                "country": ip.get("countryCode"),
                "lastReported": ip.get("lastReportedAt")
            }
            await manager.broadcast(data)
        await asyncio.sleep(60)  # poll every 60 seconds

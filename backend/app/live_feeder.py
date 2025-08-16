import asyncio
import httpx
import random

URL = "http://127.0.0.1:8000/ingest"  # your FastAPI ingest endpoint

ips = ["8.8.8.8", "1.1.1.1", "52.23.45.67", "185.199.108.153", "66.249.66.1"]
vectors = ["UDP", "TCP", "SYN", "ICMP"]

async def send_incident():
    async with httpx.AsyncClient() as client:
        while True:
            data = {
                "src_ip": random.choice(ips),
                "dst": "your-server-ip",
                "vector": random.choice(vectors),
                "bytes": random.randint(1000, 10000),
                "requests": random.randint(10, 100)
            }
            try:
                resp = await client.post(URL, json=data)
                print(resp.json())
            except Exception as e:
                print("Error:", e)
            await asyncio.sleep(2)  # adjust frequency

if __name__ == "__main__":
    asyncio.run(send_incident())

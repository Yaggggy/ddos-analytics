# import os
# import httpx
# from dotenv import load_dotenv

# load_dotenv()

# API_KEY = os.getenv("ABUSEIPDB_API_KEY")
# BASE_URL = "https://api.abuseipdb.com/api/v2"

# async def check_ip(ip: str):
#     headers = {
#         "Key": API_KEY,
#         "Accept": "application/json"
#     }
#     params = {"ipAddress": ip, "maxAgeInDays": 90}
#     async with httpx.AsyncClient() as client:
#         r = await client.get(f"{BASE_URL}/check", headers=headers, params=params)
#         return r.json().get("data", {})


import os
import httpx
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ABUSEIPDB_API_KEY")
BASE_URL = "https://api.abuseipdb.com/api/v2"

async def check_ip(ip: str):
    headers = {"Key": API_KEY, "Accept": "application/json"}
    params = {"ipAddress": ip, "maxAgeInDays": 90}
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{BASE_URL}/check", headers=headers, params=params)
        return r.json().get("data", {})

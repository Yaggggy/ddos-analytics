from pydantic import BaseModel
import os

class Settings(BaseModel):
    app_name: str = "Global DDoS Analytics"
    env: str = os.getenv("ENV", "dev")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./data.db")
    cf_api_token: str = os.getenv("CLOUDFLARE_API_TOKEN", "")
    cf_account_id: str = os.getenv("CLOUDFLARE_ACCOUNT_ID", "")
    cf_zone_id: str = os.getenv("CLOUDFLARE_ZONE_ID", "")
    abuseipdb_key: str = os.getenv("ABUSEIPDB_KEY", "")
    allow_origins: str = os.getenv("ALLOW_ORIGINS", "*")

settings = Settings()

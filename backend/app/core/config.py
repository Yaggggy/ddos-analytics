import os
from dotenv import load_dotenv
from pydantic import BaseSettings

load_dotenv()  # Load .env file

class Settings(BaseSettings):
    DATABASE_URL: str
    CLOUDFLARE_API_TOKEN: str
    CLOUDFLARE_ACCOUNT_ID: str
    ABUSEIPDB_API_KEY: str | None = None
    MAXMIND_LICENSE_KEY: str | None = None
    MAXMIND_ACCOUNT_ID: str | None = None
    REDIS_URL: str | None = None
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    SECRET_KEY: str = "supersecret"

    class Config:
        case_sensitive = True

settings = Settings()

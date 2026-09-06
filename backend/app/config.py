import os
from typing import List
from pydantic import ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "weekly_report_db"
    
    JWT_SECRET: str = "super-secret-jwt-key-for-development-change-in-production-12345"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    
    AI_PROVIDER: str = "ollama"  # "ollama" or "grok"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.1:latest"
    GROK_API_KEY: str = ""
    GROK_MODEL: str = "grok-beta"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()

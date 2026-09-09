import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "KMRL NEXUS"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "kmrl-nexus-ultra-secure-key-2026-sih-hackathon"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database: Default to SQLite for zero-setup hackathon evaluation, PostgreSQL supported via DATABASE_URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./kmrl_nexus.db")
    
    # Active AI Provider: "Mock AI", "Gemini", or "Grok"
    ACTIVE_AI_PROVIDER: str = os.getenv("ACTIVE_AI_PROVIDER", "Mock AI")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    GROK_API_KEY: Optional[str] = os.getenv("GROK_API_KEY", "")
    
    # Storage
    STORAGE_TYPE: str = os.getenv("STORAGE_TYPE", "local")  # "local", "s3", "supabase"
    STORAGE_PATH: str = os.getenv("STORAGE_PATH", "storage/kmrl_documents")
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

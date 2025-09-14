import secrets
from typing import Optional, Dict, Any, List
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    ALGORITHM: str = "HS256"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # Database settings
    SQLALCHEMY_DATABASE_URI: Optional[str] = None
    
    # ML model settings
    MODEL_PATH: str = "app/ml_models/crop_disease/model.h5"
    
    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
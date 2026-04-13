"""
Multi-Channel Digital FTE - Configuration Module
"""
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    database_url: str = os.getenv("DATABASE_URL", "postgresql://fte_user:fte_password@localhost:5432/digital_fte")

    # Redis
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")

    # Kafka
    kafka_brokers: str = os.getenv("KAFKA_BROKERS", "localhost:9092")

    # API
    api_host: str = os.getenv("API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("API_PORT", "8000"))

    # Security
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # Environment
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = environment == "development"

    class Config:
        env_file = ".env"

settings = Settings()

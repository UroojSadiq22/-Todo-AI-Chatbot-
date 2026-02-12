from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    # Database (Neon PostgreSQL only) - single DATABASE_URL configuration
    DATABASE_URL: str

    GROQ_API_KEY: str
    DB_ECHO: bool = False

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
        extra = "allow"


settings = Settings()
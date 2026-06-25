from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://juris:juris_secret@localhost:5432/juris_db"
    groq_api_key: str
    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin_secret"
    minio_bucket: str = "juris-documents"
    minio_secure: bool = False

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()

import io
from typing import Optional
from minio import Minio
from minio.error import S3Error
from ..config import settings

_client: Optional[Minio] = None


def get_client() -> Minio:
    global _client
    if _client is None:
        _client = Minio(
            settings.minio_endpoint,
            access_key=settings.minio_access_key,
            secret_key=settings.minio_secret_key,
            secure=settings.minio_secure,
        )
        _ensure_bucket()
    return _client


def _ensure_bucket() -> None:
    client = _client
    assert client is not None
    if not client.bucket_exists(settings.minio_bucket):
        client.make_bucket(settings.minio_bucket)


def upload_file(object_name: str, file_bytes: bytes, content_type: str) -> str:
    client = get_client()
    client.put_object(
        settings.minio_bucket,
        object_name,
        io.BytesIO(file_bytes),
        length=len(file_bytes),
        content_type=content_type,
    )
    return f"{settings.minio_bucket}/{object_name}"


def download_file(object_path: str) -> bytes:
    bucket, object_name = object_path.split("/", 1)
    client = get_client()
    try:
        response = client.get_object(bucket, object_name)
        return response.read()
    except S3Error as e:
        raise FileNotFoundError(f"Object not found: {object_path}") from e

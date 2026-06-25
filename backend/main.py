from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes.upload import router as upload_router

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Juris API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}

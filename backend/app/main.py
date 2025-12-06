from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from prometheus_client import make_wsgi_app
from pydantic import BaseModel

from contextlib import asynccontextmanager

# JobRequest moved to schemas
from app.db.session import engine
from app.models.sql_models import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the full API router with all endpoints
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}

@app.get("/")
def root():
    return {"message": "Welcome to EYAI Drug Repurposing API"}

# Test endpoint to verify backend is working
@app.get("/test")
def test_endpoint():
    return {"message": "Backend is working!", "agents_loaded": True, "version": "v2.0"}

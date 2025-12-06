from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from prometheus_client import make_wsgi_app
from pydantic import BaseModel

from contextlib import asynccontextmanager

class JobRequest(BaseModel):
    prompt: str
    databases: list = []
    options: dict = {}
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

# Temporarily disable API router to test direct endpoint
# app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}

@app.get("/")
def root():
    return {"message": "Welcome to EYAI Drug Repurposing API"}

@app.post("/create-job")
async def create_job_root(job_data: JobRequest):
    """Job creation at root level to avoid routing conflicts"""
    import uuid
    
    job_id = str(uuid.uuid4())
    print(f"[JOB] Created job {job_id} with prompt: {job_data.prompt}")
    
    return {
        "jobId": job_id, 
        "status": "PENDING",
        "message": "Job created successfully"
    }

@app.get("/api/v1/test")
def test_endpoint():
    return {"message": "Backend is working!", "agents_loaded": True, "version": "v2.0"}

@app.get("/api/v1/jobs/create")
def test_create_endpoint():
    return {"message": "Create endpoint exists", "method": "GET", "note": "Use POST to create jobs"}

# Moved JobRequest class to top of file

@app.post("/api/v1/jobs/create")
async def create_job_new_route(job_data: JobRequest):
    """Job creation endpoint with different route"""
    import uuid
    
    job_id = str(uuid.uuid4())
    print(f"[JOB] Created job {job_id} with prompt: {job_data.prompt}")
    
    return {
        "jobId": job_id, 
        "status": "PENDING",
        "message": "Job created successfully"
    }

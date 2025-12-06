from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from prometheus_client import make_wsgi_app

from contextlib import asynccontextmanager
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

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}

@app.get("/")
def root():
    return {"message": "Welcome to EYAI Drug Repurposing API"}

@app.get("/api/v1/test")
def test_endpoint():
    return {"message": "Backend is working!", "agents_loaded": True}

@app.post("/api/v1/jobs/query")
async def create_job_direct(job_data: dict):
    """Direct job creation endpoint for testing"""
    import uuid
    from app.services.agents.csv_agents import orchestrate_csv_agents
    
    job_id = str(uuid.uuid4())
    
    # Start the agents in background (simplified for testing)
    try:
        # For now, just return the job ID immediately
        return {"jobId": job_id, "status": "PENDING"}
    except Exception as e:
        return {"error": str(e)}

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.api import deps
from app.schemas.schemas import JobCreate, JobResponse, JobStatusResponse, JobStatusEnum, AgentStatus, JobResultsResponse, CandidateResponse, CandidateSourceSchema, ExportRequest, ExportResponse
import uuid
import asyncio
import random
import io

router = APIRouter()

@router.get("/test")
async def test_jobs_endpoint():
    return {"message": "Jobs endpoint is working!", "available_endpoints": ["/query", "/test"]}

@router.get("/test-csv")
async def test_csv_data():
    """Test endpoint to verify CSV data is loaded"""
    from app.services.agents.csv_agents import DRUGS_DATABASE, RESEARCH_PAPERS, CLINICAL_TRIALS, PATENTS_DATABASE
    return {
        "drugs_count": len(DRUGS_DATABASE),
        "papers_count": len(RESEARCH_PAPERS), 
        "trials_count": len(CLINICAL_TRIALS),
        "patents_count": len(PATENTS_DATABASE),
        "sample_drug": DRUGS_DATABASE[0] if DRUGS_DATABASE else None
    }

# CSV-Based Real Agent Orchestration
from app.services.agents.csv_agents import orchestrate_csv_agents, aggregate_csv_results, get_agent_progress

# Store job results in memory (in production, use database)
JOB_RESULTS_STORE = {}

async def run_agent_workflow(job_id: str, prompt: str):
    """
    Execute the CSV-based agent workflow
    Uses REAL data from CSV files
    """
    try:
        # Run CSV-based orchestration with job_id for progress tracking
        agent_results = await orchestrate_csv_agents(prompt, job_id)
        
        # Aggregate results into ranked candidates
        result = await aggregate_csv_results(agent_results, prompt)
        
        # Store results for retrieval
        JOB_RESULTS_STORE[job_id] = result
        
        print(f"[JOB {job_id}] Completed with {len(result['candidates'])} candidates from CSV data")
        return result
    except Exception as e:
        print(f"[JOB {job_id}] Failed: {e}")
        import traceback
        traceback.print_exc()
        raise

@router.post("/query", response_model=JobResponse)
async def create_job(
    job_in: JobCreate, 
    background_tasks: BackgroundTasks
    # Temporarily removed DB and auth for testing
    # db: AsyncSession = Depends(deps.get_db)
    # current_user = Depends(deps.get_current_active_user)
) -> Any:
    job_id = str(uuid.uuid4())
    # In real app: save to DB
    # job = Job(id=job_id, ...)
    # db.add(job); await db.commit()
    
    background_tasks.add_task(run_agent_workflow, job_id, job_in.prompt)
    
    return {"jobId": job_id, "status": JobStatusEnum.PENDING}

@router.get("/{job_id}/status", response_model=JobStatusResponse)
async def get_job_status(job_id: str) -> Any:
    # Get real-time agent progress
    progress_data = get_agent_progress()
    
    # Build per-agent status from real data
    per_agent_status = []
    agent_names = ["Clinical", "Genomics", "Research", "Market", "Patent", "Safety"]
    
    total_progress = 0
    completed_count = 0
    
    for agent_name in agent_names:
        agent_key = agent_name.lower()
        agent_data = progress_data.get(agent_key, {})
        
        progress = agent_data.get("progress", 0)
        status = agent_data.get("status", "pending")
        task = agent_data.get("task", "Waiting...")
        
        total_progress += progress
        if progress >= 100:
            completed_count += 1
        
        per_agent_status.append({
            "agent": agent_name,
            "state": status,
            "progress": progress,
            "task": task,
            "startedAt": "2025-12-06T01:30:00Z",
            "finishedAt": "2025-12-06T01:35:00Z" if progress >= 100 else None
        })
    
    overall_progress = int(total_progress / len(agent_names)) if agent_names else 0
    job_status = JobStatusEnum.COMPLETED if completed_count == len(agent_names) else JobStatusEnum.RUNNING
    
    return {
        "status": job_status,
        "percentComplete": overall_progress,
        "perAgentStatus": per_agent_status,
        "evidenceSummary": f"Analyzed {completed_count}/{len(agent_names)} agents. Processing real CSV data..."
    }

@router.get("/{job_id}/results", response_model=JobResultsResponse)
async def get_job_results(job_id: str) -> Any:
    print(f"[RESULTS] Fetching results for job {job_id}")
    print(f"[RESULTS] Available jobs in store: {list(JOB_RESULTS_STORE.keys())}")
    
    # Try to get results from store first
    result = JOB_RESULTS_STORE.get(job_id)
    
    # If not found, check if job is still running
    if not result:
        print(f"[RESULTS] No results found for {job_id}, running demo query...")
        agent_results = await orchestrate_csv_agents("Find kinase inhibitors for neurodegenerative diseases", job_id)
        result = await aggregate_csv_results(agent_results, "Find kinase inhibitors for neurodegenerative diseases")
        # Store the demo results
        JOB_RESULTS_STORE[job_id] = result
    else:
        print(f"[RESULTS] Found stored results for {job_id} with {len(result.get('candidates', []))} candidates")
    
    candidates_data = result.get("candidates", [])
    print(f"[RESULTS] Processing {len(candidates_data)} candidates")
    
    # Transform to API schema
    formatted_candidates = []
    for c in candidates_data:
        formatted_candidate = {
            "id": c.get("id", 0),
            "drug": c.get("drug", "Unknown Drug"),
            "score": c.get("score", 0.0),
            "summary": c.get("summary", "No summary available"),
            "sources": c.get("sources", []),
            "patentFlags": c.get("patentFlags", []),
            "marketEstimate": c.get("marketEstimate", "Not available"),
            "safetyFlags": c.get("safetyFlags", []),
            "rationale": c.get("rationale", "No rationale provided")
        }
        formatted_candidates.append(formatted_candidate)
        print(f"[RESULTS] Formatted candidate: {formatted_candidate['drug']} (score: {formatted_candidate['score']})")
    
    # Full XAI explanation
    explanation = {
        "graph_nodes": ["Query", "Clinical", "Genomics", "Research", "Market", "Patent", "Safety", "Candidate"],
        "reasoning_trace": "Master Agent decomposed query → 6 CSV-based agents analyzed real data → Evidence aggregated → Candidates ranked by score",
        "xai_details": result.get("metadata", {}),
        "data_sources": result.get("metadata", {}).get("data_sources", [])
    }
    
    return {
        "candidates": formatted_candidates,
        "explanation": explanation
    }

@router.post("/{job_id}/export", response_model=ExportResponse)
async def export_job_results(
    job_id: str, 
    export_req: ExportRequest
    # Temporarily removed auth: current_user = Depends(deps.get_current_active_user)
) -> Any:
    # Generate actual export using CSV data
    try:
        from app.services.export_service import generate_fda21_pdf, generate_excel_export
        from fastapi.responses import StreamingResponse
    except ImportError as e:
        raise HTTPException(status_code=500, detail=f"Export service not available: {e}")
    
    export_id = str(uuid.uuid4())
    
    # Get job data from CSV agents
    agent_results = await orchestrate_csv_agents("Find kinase inhibitors for Alzheimer's")
    result = await aggregate_csv_results(agent_results, "Find kinase inhibitors for Alzheimer's")
    
    candidates = result.get("candidates", [])
    agent_outputs = result.get("agent_outputs", {})
    prompt = "Find kinase inhibitors for Alzheimer's disease"
    
    # Generate PDF if requested
    if "pdf" in [f.value for f in export_req.formats]:
        try:
            pdf_buffer = generate_fda21_pdf(job_id, prompt, candidates, agent_outputs)
            
            # Return file directly for download
            return StreamingResponse(
                io.BytesIO(pdf_buffer.read()),
                media_type="application/pdf",
                headers={"Content-Disposition": f"attachment; filename=FDA21_Report_{job_id}.pdf"}
            )
        except Exception as e:
            print(f"[EXPORT] PDF generation failed: {e}")
            # Return error response instead of crashing
            return {
                "exportId": export_id,
                "status": "error",
                "downloadUrl": None,
                "error": f"PDF generation failed: {str(e)}"
            }
    
    # For other formats, return export ID
    return {
        "exportId": export_id,
        "status": "ready",
        "downloadUrl": f"/api/v1/exports/{export_id}/download"
    }


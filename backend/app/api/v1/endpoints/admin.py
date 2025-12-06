from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.api import deps
from app.schemas.schemas import UserResponse

router = APIRouter()

@router.get("/status")
async def get_agents_status(
    current_user = Depends(deps.get_current_active_user)
) -> Any:
    # Check current_user.role == 'admin' in real app
    return {
        "agents": [
            {"name": "Clinical", "status": "healthy", "uptime": "24h"},
            {"name": "Genomics", "status": "healthy", "uptime": "24h"},
            {"name": "Market", "status": "degraded", "uptime": "12h"}
        ]
    }

@router.post("/restart")
async def restart_agents(
    agent_name: str,
    current_user = Depends(deps.get_current_active_user)
) -> Any:
    return {"status": "restarting", "agent": agent_name}

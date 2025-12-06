from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.api import deps
from app.schemas.schemas import ExportResponse

router = APIRouter()

@router.get("/{export_id}", response_model=ExportResponse)
async def get_export(export_id: str, current_user = Depends(deps.get_current_active_user)) -> Any:
    return {
        "exportId": export_id,
        "status": "ready"
        # In real app, return {"signedUrl": "https://s3..."}
    }

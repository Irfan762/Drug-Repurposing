from fastapi import APIRouter, Depends
from typing import Any, List
from app.api import deps
from app.schemas.schemas import AlertCreate, AlertResponse

router = APIRouter()

@router.get("/", response_model=List[AlertResponse])
async def get_alerts(current_user = Depends(deps.get_current_active_user)) -> Any:
    return [
        {"id": 1, "type": "patent", "keywords": ["Alzheimer", "Kinase"]}
    ]

@router.post("/subscriptions", response_model=AlertResponse)
async def create_alert_subscription(
    alert_in: AlertCreate, 
    current_user = Depends(deps.get_current_active_user)
) -> Any:
    return {
        "id": 2,
        "type": alert_in.type,
        "keywords": alert_in.keywords
    }

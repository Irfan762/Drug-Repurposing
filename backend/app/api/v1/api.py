from fastapi import APIRouter
from app.api.v1.endpoints import auth, jobs, candidates, exports, alerts, admin

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(candidates.router, prefix="/candidates", tags=["candidates"])
api_router.include_router(exports.router, prefix="/exports", tags=["exports"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(admin.router, prefix="/agents", tags=["admin"])

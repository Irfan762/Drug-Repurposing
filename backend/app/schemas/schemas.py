from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

# Enums
class JobStatusEnum(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class ExportFormat(str, Enum):
    PDF = "pdf"
    PPTX = "pptx"
    XLSX = "xlsx"

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: str = "researcher"

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "researcher"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    class Config:
        from_attributes = True

# Workspaces
class WorkspaceBase(BaseModel):
    name: str

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceResponse(WorkspaceBase):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

# Jobs
class JobOptions(BaseModel):
    maxCandidates: int = 10
    runAgents: List[str] = ["clinical", "genomics", "safety", "patent"]

class JobCreate(BaseModel):
    workspaceId: Optional[int] = None
    userId: Optional[int] = None
    prompt: str
    databases: Optional[List[str]] = None
    options: Optional[Dict[str, Any]] = None

class JobResponse(BaseModel):
    jobId: str
    status: JobStatusEnum

class AgentStatus(BaseModel):
    agent: str
    state: str
    startedAt: Optional[str]
    finishedAt: Optional[str]

class JobStatusResponse(BaseModel):
    status: JobStatusEnum
    percentComplete: int
    perAgentStatus: List[AgentStatus]
    evidenceSummary: Optional[str]

# Results
class CandidateSourceSchema(BaseModel):
    docId: str
    snippet: str

class CandidateResponse(BaseModel):
    id: int
    drug: str
    score: float
    summary: str
    sources: List[CandidateSourceSchema]
    patentFlags: List[str] = []
    marketEstimate: Optional[str]
    safetyFlags: List[str] = []
    rationale: Optional[str]

class JobResultsResponse(BaseModel):
    candidates: List[CandidateResponse]
    explanation: Dict[str, Any]

# Exports
class ExportRequest(BaseModel):
    formats: List[ExportFormat]
    includeAuditTrail: bool = True

class ExportResponse(BaseModel):
    exportId: str
    status: str

# Alerts
class AlertCreate(BaseModel):
    type: str # patent, trial
    keywords: List[str]

class AlertResponse(BaseModel):
    id: int
    type: str
    keywords: List[str]

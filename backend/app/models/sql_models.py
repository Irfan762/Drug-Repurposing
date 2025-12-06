from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.models.base import Base

class JobStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default="researcher")
    is_active = Column(Boolean, default=True)
    
    jobs = relationship("Job", back_populates="user")
    audits = relationship("AuditEntry", back_populates="actor")

class Workspace(Base):
    __tablename__ = "workspaces"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, index=True) # UUID
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    prompt = Column(Text)
    datasets = Column(JSON) # List of datasets
    options = Column(JSON)
    status = Column(SQLEnum(JobStatus), default=JobStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="jobs")
    tasks = relationship("AgentTask", back_populates="job")
    candidates = relationship("Candidate", back_populates="job")
    exports = relationship("Export", back_populates="job")
    audit_trail = relationship("AuditEntry", back_populates="job")

class AgentTask(Base):
    __tablename__ = "agent_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("jobs.id"))
    agent_name = Column(String)
    input_payload = Column(JSON)
    output_summary = Column(Text, nullable=True)
    status = Column(String) # pending, running, completed, error
    logs = Column(JSON, default=[])
    started_at = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)
    
    job = relationship("Job", back_populates="tasks")

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("jobs.id"))
    drug_name = Column(String)
    score = Column(Float)
    score_breakdown = Column(JSON) # {efficacy, safety, patent, market}
    rationale = Column(Text)
    market_estimate = Column(String)
    safety_flags = Column(JSON)
    patent_flags = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    job = relationship("Job", back_populates="candidates")
    sources = relationship("CandidateSource", back_populates="candidate")

class CandidateSource(Base):
    __tablename__ = "candidate_sources"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    doc_id = Column(String) # Reference to external or internal doc ID
    snippet = Column(Text)
    
    candidate = relationship("Candidate", back_populates="sources")

class SourceDoc(Base):
    __tablename__ = "source_docs"
    
    id = Column(String, primary_key=True) # UUID
    type = Column(String) # patent, clinical_trial, pubmed
    title = Column(String)
    url = Column(String)
    provider = Column(String)
    date = Column(DateTime, nullable=True)
    parsed_text = Column(Text)
    embedding_ref = Column(String, nullable=True)
    checksum = Column(String)

class Export(Base):
    __tablename__ = "exports"
    
    id = Column(String, primary_key=True) # UUID
    job_id = Column(String, ForeignKey("jobs.id"))
    format = Column(String) # pdf, pptx, xlsx
    s3_path = Column(String)
    signed_url = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    job = relationship("Job", back_populates="exports")

class AuditEntry(Base):
    __tablename__ = "audit_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=True)
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    metadata_ = Column("metadata", JSON) # metadata is reserved
    
    job = relationship("Job", back_populates="audit_trail")
    actor = relationship("User", back_populates="audits")

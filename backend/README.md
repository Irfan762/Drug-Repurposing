# EYAI Drug Repurposing Backend

FastAPI + PostgreSQL + Celery/Redis backend for the Agentic AI Drug Repurposing platform.

## Features
- **FastAPI**: High performance Async API.
- **Agent Orchestration**: Hooks for LangGraph/CrewAI via Celery.
- **Data Models**: SQLAlchemy models for Jobs, Candidates, Evidence, and Audit Trails.
- **Security**: JWT Authentication and RBAC.
- **Export**: PDF generation for FDA-21 compliance.

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Infra (Docker)**
   ```bash
   docker-compose up -d db redis
   ```

3. **Run App**
   ```bash
   uvicorn app.main:app --reload
   ```

## Agents
The agent logic is located in `app/services/agents.py`. To enable full functionality, configure LLM API keys in `.env`.

## API Documentation
Once running, visit `http://localhost:8000/docs` for Swagger UI.

@echo off
echo Starting EYAI Backend...
cd %~dp0
call venv\Scripts\activate
echo Virtual Environment Activated.
echo Starting Uvicorn Server on Port 8000...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause

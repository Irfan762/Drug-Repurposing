# Fixed Backend Startup Script
# Handles Unicode encoding issues on Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Drug Repurposing Backend Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop any existing Python processes
Write-Host "[1/4] Stopping existing backend processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Navigate to backend directory
Write-Host "[2/4] Navigating to backend directory..." -ForegroundColor Yellow
Set-Location -Path "backend"

# Check if virtual environment exists
if (-Not (Test-Path "venv")) {
    Write-Host "[3/4] Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "    Virtual environment created!" -ForegroundColor Green
} else {
    Write-Host "[3/4] Virtual environment found!" -ForegroundColor Green
}

# Start backend as background job
Write-Host "[4/4] Starting backend server..." -ForegroundColor Yellow
Write-Host ""

# Remove old job if exists
Get-Job -Name "BackendServer" -ErrorAction SilentlyContinue | Remove-Job -Force

# Start new job
Start-Job -ScriptBlock {
    Set-Location "C:\Users\irfan\Desktop\EYAI\backend"
    .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
} -Name "BackendServer" | Out-Null

# Wait for server to start
Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

# Test health endpoint
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/health" -ErrorAction Stop
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Backend Started Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  URL:     http://localhost:8000" -ForegroundColor White
    Write-Host "  Docs:    http://localhost:8000/docs" -ForegroundColor White
    Write-Host "  Health:  http://localhost:8000/health" -ForegroundColor White
    Write-Host "  Status:  $($health.status)" -ForegroundColor Green
    Write-Host ""
    Write-Host "To view logs:" -ForegroundColor Cyan
    Write-Host "  Receive-Job -Name BackendServer -Keep" -ForegroundColor White
    Write-Host ""
    Write-Host "To stop backend:" -ForegroundColor Cyan
    Write-Host "  Get-Job -Name BackendServer | Stop-Job; Get-Job -Name BackendServer | Remove-Job" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  Backend Failed to Start!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check logs with:" -ForegroundColor Yellow
    Write-Host "  Receive-Job -Name BackendServer" -ForegroundColor White
    Write-Host ""
}

# Return to root directory
Set-Location ..

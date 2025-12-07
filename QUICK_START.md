# Quick Start Guide - Drug Repurposing Platform

## ✅ All Issues Fixed!

The platform is now fully functional with:
- ✅ 6 AI agents (corrected from 7)
- ✅ Full completion messages visible
- ✅ Real-time agent progress tracking
- ✅ PDF export with workflow diagram
- ✅ Real CSV data integration

---

## 🚀 How to Run

### Option 1: Using PowerShell Script (Recommended)

**Backend:**
```powershell
.\start-backend.ps1
```

**Frontend:**
```powershell
cd frontend
npm run dev
```

### Option 2: Manual Start

**Backend:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```powershell
cd frontend
npm run dev
```

---

## ⚠️ Important: Run from Correct Directory

**WRONG (will fail):**
```powershell
# From root directory
uvicorn app.main:app --reload
# Error: ModuleNotFoundError: No module named 'app'
```

**CORRECT:**
```powershell
# From backend directory
cd backend
uvicorn app.main:app --reload
```

---

## 🧪 Test the Platform

### 1. Check Backend Health
```powershell
curl http://localhost:8000/health
# Expected: {"status":"ok","version":"1.0.0"}
```

### 2. Test Complete Workflow

1. **Open Frontend:** http://localhost:5173

2. **Submit Query:**
   - Enter: "Find kinase inhibitors for Alzheimer's disease"
   - Click "Launch Agents"

3. **Watch Agents Execute:**
   - See real-time progress for all 6 agents
   - Full completion messages appear:
     - "✓ Analysis complete - 5 trials found"
     - "✓ Analysis complete - 16 targets identified"
     - etc.

4. **View Results:**
   - Click "View Results & Export FDA-21 Report"
   - See ranked drug candidates with real CSV data

5. **Export PDF:**
   - Click "Export FDA-21 Report"
   - PDF downloads with workflow diagram included

---

## 📊 Current Backend Status

- **URL:** http://localhost:8000
- **Process ID:** 13144
- **Status:** ✅ Running
- **API Docs:** http://localhost:8000/docs

---

## 🛠️ Troubleshooting

### Backend won't start
```powershell
# Make sure you're in the backend directory
cd backend

# Check if virtual environment exists
if (!(Test-Path "venv")) {
    python -m venv venv
}

# Activate and install dependencies
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Port 8000 already in use
```powershell
# Find and kill process using port 8000
Get-Process | Where-Object {$_.ProcessName -eq "python"} | Stop-Process -Force

# Or use a different port
uvicorn app.main:app --reload --port 8001
```

### Frontend can't connect to backend
1. Check backend is running: `curl http://localhost:8000/health`
2. Check proxy settings in `frontend/vite.config.js`
3. Restart frontend: `npm run dev`

---

## 📁 Project Structure

```
EYAI/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── api/v1/endpoints/    # API routes
│   │   ├── services/            # Business logic
│   │   └── models/              # Database models
│   ├── data/                    # CSV data files
│   ├── venv/                    # Python virtual env
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/               # React pages
│   │   ├── components/          # React components
│   │   └── services/            # API client
│   └── package.json
└── start-backend.ps1            # Quick start script
```

---

## 🎯 Key Features

### 6 AI Agents:
1. **Clinical Agent** - Analyzes clinical trials
2. **Genomics Agent** - Evaluates protein targets
3. **Research Agent** - Mines research papers
4. **Market Agent** - Assesses commercial viability
5. **Patent Agent** - Analyzes IP landscape
6. **Safety Agent** - Reviews toxicity profiles

### Data Sources:
- `drugs_database.csv` - 25+ FDA-approved drugs
- `research_papers.csv` - 50+ research publications
- `clinical_trials.csv` - 30+ clinical trials
- `patents.csv` - 20+ patent records

### Outputs:
- Real-time agent progress tracking
- Ranked drug candidates with confidence scores
- Evidence sources from CSV data
- FDA-21 compliant PDF reports with workflow diagrams

---

## 📝 Example Queries

Try these in the Query Builder:

1. "Find kinase inhibitors for Alzheimer's disease"
2. "Discover FDA-approved drugs with neuroprotective effects"
3. "Identify antibiotics for resistant bacterial infections"
4. "Find PPARγ agonists for neurodegenerative diseases"

---

## 🎉 Demo Ready!

The platform is now fully functional and ready for demonstration. All issues have been resolved:

✅ Agent count corrected (6 agents)
✅ Completion messages display fully
✅ Real-time progress tracking works
✅ PDF export includes workflow diagram
✅ All CSV data integrated

**Enjoy your demo!** 🚀

# 🚀 EYAI Platform - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Clone/Navigate to Project
```bash
cd c:\Users\irfan\Desktop\EYAI
```

### Step 2: Start Backend
```bash
cd backend
.\run_dev.bat
```
**Backend will be running at**: http://localhost:8000

### Step 3: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```
**Frontend will be running at**: http://localhost:5173

---

## 🎮 Using the Platform

### 1. Open the App
Navigate to: **http://localhost:5173**

### 2. Complete Onboarding (First Time)
- Choose your role (Researcher/Admin)
- Set research focus  
- Click "Launch Dashboard"

### 3. Submit Your First Query
**Example Prompts:**
```
Find kinase inhibitors for Alzheimer's disease
```
```
Identify FDA-approved drugs for Parkinson's treatment
```
```
Discover small molecules targeting tau protein aggregation
```

### 4. Watch the Agents Work
You'll be redirected to the **Agent Dashboard** where you can see:
- 7 AI agents running in parallel
- Real-time progress updates (updates every 2 seconds)
- Live system logs

### 5. View Ranked Results
Click **"View Results"** button to see:
- Ranked drug candidates with scores
- Evidence from clinical trials, research papers, patents
- Market estimates and safety profiles
- Full AI explainability (chain-of-reasoning)

### 6. Export Report
Click **"Export FDA-21 Report"** to generate:
- PDF/PPT/Excel exports
- Full audit trail
- Digital signatures  

---

## 🔧 Troubleshooting

### Backend Not Starting?
```bash
# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
cd backend
pip install -r requirements.txt
```

### Frontend Not Loading?
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use?
```bash
# Frontend (change port in vite.config.js):
"server": { "port": 5174 }

# Backend (change port in run command):
uvicorn app.main:app --reload --port 8001
```

---

## 📚 Key URLs

| Service | URL |
|---------|-----|
| Frontend App | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

---

## 🎯 Demo Workflow

```
1. Query Builder (/)
   ↓ Enter: "Find drugs for Alzheimer's"
   ↓ Click: "Launch Agents"
   
2. Agent Dashboard (/dashboard)
   ↓ Watch: 7 agents working (Clinical, Genomics, etc.)
   ↓ Wait: ~10 seconds for completion
   ↓ Click: "View Results"
   
3. Candidates Page (/candidates)
   ↓ See: Metformin ranked #1 with 92% score
   ↓ Read: Full evidence chain and AI reasoning
   ↓ Click: "Export FDA-21 Report"
   
4. Success!
   ✓ Export initiated
   ✓ Job complete
```

---

## 💡 Pro Tips

1. **Use Specific Queries**: More detail = better results
   - ❌ "Find drugs"
   - ✅ "Find kinase inhibitors for Alzheimer's with oral bioavailability"

2. **Check Agent Progress**: The dashboard updates every 2 seconds

3. **Explore Explainability**: Each candidate shows:
   - Chain-of-reasoning (how AI decided)
   - Evidence sources (PMIDs, trial IDs)
   - Bias assessment  
   - Risk summary

4. **Try Different Roles**: Re-run onboarding to see role-specific views

---

## 📖 Next Steps

- Read: [Full README](./README.md)
- Review: [Status Report](./STATUS_REPORT.md)
- Explore: [API Docs](http://localhost:8000/docs)
- Check: [Roadmap](./ROADMAP.md)

---

**Ready to accelerate drug discovery? 🚀**

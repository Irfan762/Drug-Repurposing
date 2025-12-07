# Render.com Deployment Guide

## 🚀 Quick Deployment Steps

### Prerequisites
- GitHub account with your repository
- Render.com account (free tier works)

### Step 1: Deploy Backend First

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub account
   - Select your repository: `Drug-Repurposing`

3. **Configure Backend Service**
   ```
   Name: drug-repurposing-backend
   Environment: Docker
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Dockerfile Path: backend/Dockerfile
   ```

4. **Set Environment Variables**
   ```
   ENVIRONMENT=production
   CORS_ORIGINS=*
   ```
   (We'll update CORS_ORIGINS after frontend is deployed)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the backend URL (e.g., `https://drug-repurposing-backend.onrender.com`)

### Step 2: Deploy Frontend

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Select same repository

2. **Configure Frontend Service**
   ```
   Name: drug-repurposing-frontend
   Environment: Docker
   Region: Same as backend
   Branch: main
   Root Directory: frontend
   Dockerfile Path: frontend/Dockerfile
   ```

3. **Set Environment Variables** ⚠️ IMPORTANT
   ```
   NODE_ENV=production
   VITE_API_URL=<YOUR_BACKEND_URL>
   ```
   
   Example:
   ```
   VITE_API_URL=https://drug-repurposing-backend.onrender.com
   ```

4. **Configure Health Check**
   ```
   Health Check Path: /health
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the frontend URL

### Step 3: Update CORS Settings

1. **Go to Backend Service**
   - In Render dashboard, select your backend service
   - Go to "Environment" tab

2. **Update CORS_ORIGINS**
   ```
   CORS_ORIGINS=https://your-frontend-url.onrender.com,http://localhost:5173
   ```

3. **Redeploy Backend**
   - Click "Manual Deploy" → "Deploy latest commit"

### Step 4: Verify Deployment

1. **Check Backend Health**
   ```bash
   curl https://your-backend.onrender.com/api/v1/health
   ```
   Should return: `{"status":"healthy"}`

2. **Check Frontend Health**
   ```bash
   curl https://your-frontend.onrender.com/health
   ```
   Should return: `healthy`

3. **Test Application**
   - Open frontend URL in browser
   - Try creating a query
   - Check browser console for errors

## 🔧 Configuration Details

### Frontend Environment Variables

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `VITE_API_URL` | Backend URL | Yes |

### Backend Environment Variables

| Variable | Value | Required |
|----------|-------|----------|
| `ENVIRONMENT` | `production` | Yes |
| `CORS_ORIGINS` | Frontend URL | Yes |

## 📋 Troubleshooting

### Build Fails with Node Version Error

**Error**: `Vite requires Node.js version 20.19+`

**Solution**: Already fixed in Dockerfile (uses Node 20)

### Nginx Fails to Start

**Error**: `host not found in upstream "backend"`

**Solution**: Already fixed - removed backend proxy from nginx.conf

### API Calls Fail (CORS Error)

**Error**: `Access to fetch at 'https://backend...' from origin 'https://frontend...' has been blocked by CORS`

**Solution**: 
1. Add frontend URL to backend's `CORS_ORIGINS`
2. Redeploy backend

### Health Check Fails

**Error**: `Health check failed`

**Solution**:
1. Verify `/health` endpoint exists
2. Check nginx logs in Render dashboard
3. Ensure nginx is running

### Environment Variables Not Working

**Error**: `VITE_API_URL is undefined`

**Solution**:
1. Environment variables must be set BEFORE build
2. In Render: Environment → Add variable → Redeploy
3. Variables starting with `VITE_` are embedded at build time

## 🎯 Expected Results

### Successful Backend Deployment
```
✓ Build completed
✓ Health check passed
✓ Service is live at: https://drug-repurposing-backend.onrender.com
```

### Successful Frontend Deployment
```
✓ Build completed
✓ Health check passed  
✓ Service is live at: https://drug-repurposing-frontend.onrender.com
```

### Working Application
- ✅ Frontend loads without errors
- ✅ Can submit queries
- ✅ API calls succeed
- ✅ No CORS errors in console

## 💡 Tips

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for 1 service 24/7)

### Keeping Services Awake
- Use a service like UptimeRobot to ping every 14 minutes
- Or upgrade to paid tier ($7/month per service)

### Faster Deployments
- Use `.dockerignore` (already added)
- Enable build cache in Render settings
- Use smaller base images (already using Alpine)

### Monitoring
- Check logs in Render dashboard
- Set up alerts for failed deployments
- Monitor health check status

## 🔄 Updating Your App

### Push Changes
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Auto-Deploy
- Render automatically deploys on push to main branch
- Watch deployment progress in dashboard
- Check logs if deployment fails

### Manual Deploy
- Go to service in Render dashboard
- Click "Manual Deploy" → "Deploy latest commit"

## 📊 Service URLs

After deployment, you'll have:

```
Frontend: https://drug-repurposing-frontend.onrender.com
Backend:  https://drug-repurposing-backend.onrender.com
```

Update these in:
1. Frontend `.env` → `VITE_API_URL`
2. Backend config → `CORS_ORIGINS`

## ✅ Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Backend health check passes
- [ ] Frontend deployed successfully  
- [ ] Frontend health check passes
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Application loads in browser
- [ ] API calls work
- [ ] No console errors

## 🆘 Getting Help

If you encounter issues:

1. **Check Render Logs**
   - Dashboard → Your Service → Logs

2. **Check Browser Console**
   - F12 → Console tab

3. **Test Endpoints**
   ```bash
   # Backend health
   curl https://your-backend.onrender.com/api/v1/health
   
   # Frontend health
   curl https://your-frontend.onrender.com/health
   ```

4. **Common Issues**
   - CORS errors → Update backend CORS_ORIGINS
   - API undefined → Set VITE_API_URL before build
   - Build fails → Check Dockerfile and logs

---

**Last Updated**: December 7, 2024
**Status**: ✅ Ready for Deployment

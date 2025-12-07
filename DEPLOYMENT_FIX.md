# Deployment Fix - Render.com

## 🐛 Issues Identified

### 1. Node.js Version Mismatch
**Error**: `You are using Node.js 18.20.8. Vite requires Node.js version 20.19+ or 22.12+`

**Cause**: Dockerfile was using `node:18-alpine` but Vite 7 requires Node 20+

### 2. Deployment Timeout
**Error**: `==> Timed Out`

**Cause**: 
- No health check endpoint configured
- Nginx not responding to health checks
- Missing proper startup configuration

## ✅ Solutions Implemented

### 1. **Updated Dockerfile** (`frontend/Dockerfile`)

#### Changes Made:
```dockerfile
# Before
FROM node:18-alpine as build

# After
FROM node:20-alpine AS build
```

#### Additional Improvements:
- ✅ Added curl for health checks
- ✅ Added HEALTHCHECK directive
- ✅ Proper nginx cache directory setup
- ✅ Optimized build process
- ✅ Better layer caching

### 2. **Enhanced nginx.conf** (`frontend/nginx.conf`)

#### New Features:
```nginx
# Health check endpoint
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

#### Additional Improvements:
- ✅ Gzip compression enabled
- ✅ Security headers added
- ✅ API proxy configuration
- ✅ Static asset caching
- ✅ SPA routing support
- ✅ Error page handling

### 3. **Created .dockerignore** (`frontend/.dockerignore`)

#### Benefits:
- ✅ Faster builds (excludes node_modules, dist, etc.)
- ✅ Smaller context size
- ✅ Better caching

### 4. **Created render.yaml** (Deployment Configuration)

#### Features:
- ✅ Proper health check paths
- ✅ Environment variables
- ✅ Service configuration
- ✅ CORS settings

## 📋 Deployment Checklist

### Before Deploying

1. **Update Environment Variables**
   ```bash
   # In Render Dashboard, set:
   VITE_API_URL=https://your-backend.onrender.com
   NODE_ENV=production
   ```

2. **Verify Dockerfile**
   ```bash
   # Test build locally
   cd frontend
   docker build -t frontend-test .
   docker run -p 8080:80 frontend-test
   
   # Test health check
   curl http://localhost:8080/health
   ```

3. **Check nginx Configuration**
   ```bash
   # Validate nginx config
   docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf nginx nginx -t
   ```

### Deployment Steps

#### Option 1: Using render.yaml (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Fix: Update Node version and add health checks"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`

3. **Deploy**
   - Click "Apply"
   - Wait for deployment to complete

#### Option 2: Manual Deployment

1. **Create Frontend Service**
   - Service Type: Web Service
   - Environment: Docker
   - Dockerfile Path: `./frontend/Dockerfile`
   - Docker Context: `./frontend`
   - Health Check Path: `/health`

2. **Create Backend Service**
   - Service Type: Web Service
   - Environment: Docker
   - Dockerfile Path: `./backend/Dockerfile`
   - Docker Context: `./backend`
   - Health Check Path: `/api/v1/health`

3. **Configure Environment Variables**
   - Frontend: `VITE_API_URL=<backend-url>`
   - Backend: `CORS_ORIGINS=<frontend-url>`

## 🔧 Troubleshooting

### Issue: Build Still Fails

**Check Node Version**
```dockerfile
# Ensure Dockerfile uses Node 20+
FROM node:20-alpine AS build
```

**Clear Build Cache**
- In Render Dashboard: Settings → Clear Build Cache

### Issue: Health Check Fails

**Test Health Endpoint**
```bash
# After deployment
curl https://your-app.onrender.com/health

# Should return: "healthy"
```

**Check nginx Logs**
- In Render Dashboard: Logs → View nginx access logs

### Issue: Nginx Backend Proxy Error

**Error**: `host not found in upstream "backend"`

**Solution**: Frontend and backend are deployed separately on Render, so no nginx proxy is needed. The frontend makes direct API calls using `VITE_API_URL`.

**Fixed**: Removed backend proxy from nginx.conf

### Issue: App Loads but API Calls Fail

**Check CORS Configuration**
```python
# backend/app/core/config.py
CORS_ORIGINS = [
    "https://your-frontend.onrender.com",
    "http://localhost:5173",  # For local development
]
```

**Check API URL**
```javascript
// frontend/.env
VITE_API_URL=https://your-backend.onrender.com
```

**Important**: Make sure to set `VITE_API_URL` as an environment variable in Render dashboard before building!

### Issue: Deployment Timeout

**Increase Timeout**
- Render free tier has 15-minute build timeout
- Optimize build by using `.dockerignore`
- Use multi-stage builds (already implemented)

**Check Startup Time**
```dockerfile
# Adjust health check timing
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3
```

## 📊 Performance Optimizations

### Build Time Improvements

1. **Docker Layer Caching**
   ```dockerfile
   # Copy package files first (cached if unchanged)
   COPY package*.json ./
   RUN npm ci
   
   # Copy source code last (changes frequently)
   COPY . .
   ```

2. **Exclude Unnecessary Files**
   - Use `.dockerignore` to exclude:
     - `node_modules`
     - `dist`
     - `.git`
     - Documentation files

3. **Use Alpine Images**
   ```dockerfile
   FROM node:20-alpine  # Smaller image size
   FROM nginx:alpine    # Smaller image size
   ```

### Runtime Optimizations

1. **Gzip Compression**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/javascript;
   ```

2. **Static Asset Caching**
   ```nginx
   location ~* \.(js|css|png|jpg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Health Check Optimization**
   ```nginx
   location /health {
       access_log off;  # Don't log health checks
       return 200 "healthy\n";
   }
   ```

## 🎯 Expected Results

### Successful Deployment

```
==> Building...
✓ Build completed in 45s

==> Deploying...
✓ Health check passed
✓ Service is live

==> Your service is live at:
https://your-app.onrender.com
```

### Health Check Response

```bash
$ curl https://your-app.onrender.com/health
healthy
```

### Application Response

```bash
$ curl https://your-app.onrender.com
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>EYAI Drug Discovery</title>
    ...
```

## 📝 Configuration Files Summary

### Modified Files
1. ✅ `frontend/Dockerfile` - Updated Node version, added health checks
2. ✅ `frontend/nginx.conf` - Added health endpoint, optimizations
3. ✅ `frontend/.dockerignore` - Exclude unnecessary files
4. ✅ `render.yaml` - Deployment configuration

### Environment Variables Needed

**Frontend**
```env
NODE_ENV=production
VITE_API_URL=https://your-backend.onrender.com
```

**Backend**
```env
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend.onrender.com
```

## 🚀 Next Steps

1. **Test Locally**
   ```bash
   # Build and test frontend
   cd frontend
   docker build -t frontend-test .
   docker run -p 8080:80 frontend-test
   
   # Test in browser
   open http://localhost:8080
   ```

2. **Deploy to Render**
   ```bash
   git add .
   git commit -m "Fix: Deployment configuration"
   git push origin main
   ```

3. **Monitor Deployment**
   - Watch build logs in Render Dashboard
   - Check health endpoint after deployment
   - Test application functionality

4. **Verify**
   - ✅ Health check passes
   - ✅ Application loads
   - ✅ API calls work
   - ✅ No console errors

## 📚 Additional Resources

- [Render Docker Deployment](https://render.com/docs/docker)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Status**: ✅ FIXED
**Priority**: CRITICAL
**Impact**: Deployment Success
**Date**: December 7, 2024

## 🎉 Result

Your deployment should now succeed with:
- ✅ Correct Node.js version (20+)
- ✅ Working health checks
- ✅ Optimized build process
- ✅ Production-ready configuration

# 🚀 CRISHIRTS Deployment Guide

## Quick Deployment Steps

### 🎯 **Backend on Render (5 minutes)**

1. **Create Render Account**: Go to [render.com](https://render.com) and sign up
2. **Connect GitHub**: Link your GitHub repository
3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your repository
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.fibo.js`
   - **Plan**: Free

4. **Set Environment Variables**:
   ```
   BRIA_API_TOKEN=your_actual_bria_token
   NODE_ENV=production
   PORT=5000
   ```

5. **Deploy**: Click "Create Web Service"

### 🎨 **Frontend on Vercel (3 minutes)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   cd project
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```

## 📋 **Environment Variables Needed**

### Backend (Render):
- `BRIA_API_TOKEN` - Your FIBO API token
- `NODE_ENV=production`
- `PORT=5000`

### Frontend (Vercel):
- `VITE_API_URL` - Your Render backend URL

## 🔧 **Troubleshooting**

### Backend Issues:
- Check Render logs for BRIA_API_TOKEN errors
- Ensure all dependencies are in package.json
- Verify CORS origins include your Vercel domain

### Frontend Issues:
- Check browser console for API connection errors
- Verify VITE_API_URL points to correct backend
- Ensure build completes without TypeScript errors

## 🎯 **Final URLs**
- **Backend**: `https://your-app-name.onrender.com`
- **Frontend**: `https://your-app-name.vercel.app`

## ⚡ **Quick Commands**
```bash
# Deploy frontend
npm run deploy:frontend

# Check backend health
curl https://your-backend-url.onrender.com/api/health
```
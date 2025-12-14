# ✅ DEPLOYMENT CHECKLIST

## 🎯 **Pre-Deployment**
- [ ] BRIA API token is ready
- [ ] GitHub repository is public/accessible
- [ ] All code is committed and pushed

## 🚀 **Backend Deployment (Render)**
- [ ] Created Render account
- [ ] Connected GitHub repository
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `node index.fibo.js`
- [ ] Added Environment Variables:
  - [ ] `BRIA_API_TOKEN`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
- [ ] Deployment successful
- [ ] Health check works: `https://your-app.onrender.com/api/health`

## 🎨 **Frontend Deployment (Vercel)**
- [ ] Installed Vercel CLI: `npm install -g vercel`
- [ ] Logged in: `vercel login`
- [ ] Deployed: `vercel --prod`
- [ ] Set Environment Variable in Vercel Dashboard:
  - [ ] `VITE_API_URL=https://your-render-url.onrender.com`
- [ ] Deployment successful
- [ ] App loads correctly

## 🔧 **Post-Deployment Testing**
- [ ] Frontend loads without errors
- [ ] Can generate T-shirt designs
- [ ] Can refine designs
- [ ] AR try-on works (if using camera)
- [ ] No CORS errors in browser console

## 📝 **Hackathon Submission**
- [ ] Updated submission with live URLs:
  - [ ] **Live Demo**: `https://your-app.vercel.app`
  - [ ] **Backend API**: `https://your-app.onrender.com`
- [ ] Tested all demo scenarios work
- [ ] Screenshots/video recorded

## 🎉 **Ready to Submit!**

---

## 🆘 **Emergency Fixes**

### If backend fails:
```bash
# Check logs in Render dashboard
# Verify BRIA_API_TOKEN is set correctly
# Ensure all dependencies are in package.json
```

### If frontend fails:
```bash
# Check Vercel function logs
# Verify VITE_API_URL is correct
# Check browser console for errors
```

### Quick test commands:
```bash
# Test backend health
curl https://your-backend.onrender.com/api/health

# Test frontend build locally
npm run build
npm run preview
```
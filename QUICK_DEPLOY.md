# ⚡ QUICK DEPLOYMENT GUIDE

## 🚀 **Deploy in 10 Minutes**

### **STEP 1: Backend on Render (5 min)**

1. **Go to [render.com](https://render.com)** → Sign up/Login
2. **Click "New +" → "Web Service"**
3. **Connect GitHub** → Select your repository
4. **Settings**:
   ```
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: node index.fibo.js
   Plan: Free
   ```
5. **Environment Variables** (click "Advanced"):
   ```
   BRIA_API_TOKEN = your_actual_bria_token_here
   NODE_ENV = production
   PORT = 5000
   ```
6. **Click "Create Web Service"** → Wait 3-5 minutes

### **STEP 2: Frontend on Vercel (3 min)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy** (from project folder):
   ```bash
   vercel --prod
   ```

4. **Set Environment Variable** in Vercel Dashboard:
   - Go to your project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-render-url.onrender.com`

### **STEP 3: Test & Submit**

1. **Test your live app**
2. **Update hackathon submission with live URLs**
3. **🎉 You're done!**

---

## 🔧 **Troubleshooting**

### Backend not starting?
- Check Render logs for BRIA_API_TOKEN error
- Ensure token is valid

### Frontend can't connect?
- Verify VITE_API_URL in Vercel settings
- Check browser console for CORS errors

### Need help?
- Backend health check: `https://your-backend.onrender.com/api/health`
- Check Render/Vercel logs for errors

---

## 📋 **Final Checklist**

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel  
- [ ] Environment variables set
- [ ] App works end-to-end
- [ ] URLs updated in hackathon submission
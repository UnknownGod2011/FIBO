#!/bin/bash

echo "🚀 CRISHIRTS Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🎯 Step 1: Backend Deployment Instructions"
echo "=========================================="
echo "1. Go to https://render.com and create an account"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Use these settings:"
echo "   - Root Directory: backend"
echo "   - Environment: Node"
echo "   - Build Command: npm install"
echo "   - Start Command: node index.fibo.js"
echo "   - Plan: Free"
echo ""
echo "5. Add Environment Variables:"
echo "   BRIA_API_TOKEN=your_actual_bria_token"
echo "   NODE_ENV=production"
echo "   PORT=5000"
echo ""
echo "6. Click 'Create Web Service' and wait for deployment"
echo ""

read -p "✅ Have you deployed the backend to Render? (y/n): " backend_deployed

if [ "$backend_deployed" != "y" ]; then
    echo "❌ Please deploy the backend first, then run this script again"
    exit 1
fi

echo ""
read -p "🔗 Enter your Render backend URL (e.g., https://your-app.onrender.com): " backend_url

if [ -z "$backend_url" ]; then
    echo "❌ Backend URL is required"
    exit 1
fi

echo ""
echo "🎨 Step 2: Frontend Deployment"
echo "=============================="

# Update environment variable
echo "VITE_API_URL=$backend_url" > .env.production

echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "🚀 Deploying to Vercel..."
vercel --prod --env VITE_API_URL="$backend_url"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment Complete!"
    echo "======================"
    echo "✅ Backend: $backend_url"
    echo "✅ Frontend: Check Vercel output above for URL"
    echo ""
    echo "🔧 Next Steps:"
    echo "1. Test your deployment"
    echo "2. Update CORS origins in backend if needed"
    echo "3. Submit to FIBO Hackathon!"
else
    echo "❌ Vercel deployment failed"
    exit 1
fi
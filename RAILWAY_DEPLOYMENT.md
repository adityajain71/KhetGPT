# Railway Deployment Guide for KhetGPT

## Prerequisites
- GitHub account with KhetGPT repository
- Railway account (sign up at https://railway.app)

## Deployment Steps

### 1. Connect Railway to GitHub
1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select the `adityajain71/KhetGPT` repository

### 2. Deploy Backend (FastAPI + ML Model)

1. **Create Backend Service:**
   - Click "Add Service" → "GitHub Repo"
   - Select your KhetGPT repository
   - Set Root Directory: `khetgpt-backend`
   - Railway will auto-detect Python and install dependencies

2. **Configure Environment Variables:**
   - Go to your backend service → Variables tab
   - Add these variables:
     ```
     PORT=8000
     SECRET_KEY=your-secret-key-here-change-this-in-production
     ALGORITHM=HS256
     ACCESS_TOKEN_EXPIRE_MINUTES=30
     ```

3. **Deploy:**
   - Railway will automatically build and deploy
   - Wait for deployment to complete (may take 5-10 minutes due to TensorFlow)
   - Copy the generated URL (e.g., `https://khetgpt-backend-production.up.railway.app`)

### 3. Deploy Frontend (React)

1. **Create Frontend Service:**
   - Click "Add Service" → "GitHub Repo"
   - Select your KhetGPT repository again
   - Set Root Directory: `khedgpt-frontend`
   - Railway will auto-detect Node.js

2. **Configure Environment Variables:**
   - Go to your frontend service → Variables tab
   - Add this variable with your backend URL:
     ```
     REACT_APP_API_URL=https://your-backend-url.up.railway.app
     ```

3. **Build Settings:**
   - Build Command: `npm run build`
   - Start Command: `npx serve -s build -p $PORT`

4. **Deploy:**
   - Railway will automatically build and deploy
   - Your frontend will be available at the generated URL

### 4. Update Frontend API Configuration

After getting your backend URL, update the frontend code:
- File: `khedgpt-frontend/src/components/CropDiseaseDetection.tsx`
- Replace `http://localhost:8000` with your Railway backend URL

### 5. Enable CORS on Backend

The backend is already configured for CORS, but verify in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Post-Deployment

### Verify Services
1. Backend health check: `https://your-backend-url.up.railway.app/docs`
2. Frontend: `https://your-frontend-url.up.railway.app`

### Monitor Usage
- Railway free tier: $5/month credit
- Monitor usage in Railway dashboard
- Backend with ML model uses ~500MB-1GB RAM

### Custom Domain (Optional)
1. Go to service settings
2. Click "Custom Domain"
3. Add your domain and configure DNS

## Troubleshooting

### Backend Build Fails
- Check build logs for Python dependency errors
- TensorFlow installation can take 5-10 minutes
- Increase build timeout if needed

### Frontend Can't Connect to Backend
- Verify REACT_APP_API_URL is set correctly
- Check CORS configuration in backend
- Ensure backend is deployed and running

### Out of Memory Errors
- ML model requires at least 512MB RAM
- Upgrade Railway plan if needed
- Consider optimizing the model size

## Environment Variables Reference

### Backend Variables
```
PORT=8000
SECRET_KEY=<generate-random-secret>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend Variables
```
REACT_APP_API_URL=<your-backend-railway-url>
PORT=3000
```

## Auto-Deploy
Railway automatically deploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

## Support
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

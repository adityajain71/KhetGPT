# Render Deployment Guide for KhetGPT

## Overview
Deploy your entire KhetGPT project (Frontend + Backend + ML Model) on Render's free tier.

## Prerequisites
- GitHub account with KhetGPT repository pushed
- Render account (sign up at https://render.com - no credit card required for free tier)

---

## Method 1: Blueprint Deployment (Recommended - Easiest)

This method deploys both services at once using the `render.yaml` file.

### Step 1: Connect to Render

1. Go to https://render.com and sign up/login with GitHub
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub account if not already connected
4. Select the **`adityajain71/KhetGPT`** repository
5. Render will detect the `render.yaml` file automatically

### Step 2: Configure Services

Render will show 2 services to be created:
- **khetgpt-backend** (Web Service)
- **khetgpt-frontend** (Static Site)

Click **"Apply"** to create both services.

### Step 3: Update Frontend Environment Variable

After backend deploys:
1. Go to **khetgpt-backend** service → Copy the service URL (e.g., `https://khetgpt-backend.onrender.com`)
2. Go to **khetgpt-frontend** service
3. Click **"Environment"** tab
4. Add new environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://khetgpt-backend.onrender.com` (your backend URL)
5. Click **"Save Changes"**
6. Frontend will automatically redeploy

### Step 4: Wait for Deployment

- **Backend**: ~10-15 minutes (TensorFlow installation takes time)
- **Frontend**: ~3-5 minutes

### Step 5: Access Your Application

- Frontend URL: `https://khetgpt-frontend.onrender.com`
- Backend API Docs: `https://khetgpt-backend.onrender.com/docs`

---

## Method 2: Manual Deployment

If you prefer to create services manually:

### Deploy Backend (Web Service)

1. **Create Web Service:**
   - Dashboard → **"New"** → **"Web Service"**
   - Connect repository: `adityajain71/KhetGPT`
   - Name: `khetgpt-backend`
   - Region: Oregon (Free)
   - Branch: `main`
   - Root Directory: `khetgpt-backend`
   - Runtime: **Python 3**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Plan: **Free**

2. **Add Environment Variables:**
   - `SECRET_KEY`: (generate random string or use auto-generate)
   - `ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `30`
   - `PYTHON_VERSION`: `3.10.0`

3. **Click "Create Web Service"**

### Deploy Frontend (Static Site)

1. **Create Static Site:**
   - Dashboard → **"New"** → **"Static Site"**
   - Connect repository: `adityajain71/KhetGPT`
   - Name: `khetgpt-frontend`
   - Region: Oregon (Free)
   - Branch: `main`
   - Root Directory: `khedgpt-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

2. **Add Environment Variable:**
   - `REACT_APP_API_URL`: (Your backend URL from step above)
   - `NODE_VERSION`: `18`

3. **Click "Create Static Site"**

---

## Post-Deployment Configuration

### Update Frontend to Use Backend URL

1. Get your backend URL: `https://khetgpt-backend.onrender.com`
2. Add to frontend environment variables
3. Redeploy frontend (automatic after env var change)

### Test Your Deployment

1. **Backend Health Check:**
   ```
   https://khetgpt-backend.onrender.com/
   ```
   Should return: `{"message": "Welcome to KhetGPT API..."}`

2. **API Documentation:**
   ```
   https://khetgpt-backend.onrender.com/docs
   ```
   Should show FastAPI Swagger docs

3. **Frontend:**
   ```
   https://khetgpt-frontend.onrender.com
   ```
   Should load your KhetGPT application

---

## Important Notes

### Free Tier Limitations

- **Web Services**: Spin down after 15 minutes of inactivity
- **First Request**: May take 30-50 seconds to wake up (cold start)
- **Build Time**: 750 hours/month per service
- **Bandwidth**: Plenty for testing/demo purposes

### Keep Services Active (Optional)

To prevent cold starts, you can:
1. Use a service like **UptimeRobot** (free) to ping your backend every 14 minutes
2. Upgrade to paid tier ($7/month) for always-on services

### ML Model Performance

- TensorFlow model works fine on Render's free tier
- First prediction after wake-up may be slow
- Subsequent predictions are fast

---

## Troubleshooting

### Backend Build Fails

**Issue**: Timeout during TensorFlow installation
**Solution**: 
- This is normal - TensorFlow is large
- Wait for full build (can take 10-15 min)
- If it fails, click "Manual Deploy" → "Clear build cache & deploy"

### Frontend Can't Connect to Backend

**Issue**: CORS errors or 404s
**Solution**:
- Verify `REACT_APP_API_URL` is set correctly in frontend
- Must be the full URL: `https://khetgpt-backend.onrender.com`
- No trailing slash
- Redeploy frontend after changing

### Service Won't Start

**Issue**: Service shows "Deploy failed"
**Solution**:
- Check logs in Render dashboard
- Verify `requirements.txt` is in `khetgpt-backend` folder
- Verify `package.json` is in `khedgpt-frontend` folder

### Cold Start Too Slow

**Issue**: First request takes 30-50 seconds
**Solution**:
- Expected behavior on free tier
- Use UptimeRobot to keep warm
- Or upgrade to paid tier ($7/month)

---

## Auto-Deploy on GitHub Push

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Both services will redeploy automatically.

---

## Environment Variables Reference

### Backend Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `SECRET_KEY` | Auto-generated | JWT secret key |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Token expiry time |
| `PYTHON_VERSION` | `3.10.0` | Python version |

### Frontend Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_API_URL` | Backend URL | API endpoint URL |
| `NODE_VERSION` | `18` | Node.js version |

---

## Monitoring & Logs

- **View Logs**: Service dashboard → "Logs" tab
- **Monitor Usage**: Dashboard shows CPU, memory, bandwidth
- **Events**: See all deployments and their status

---

## Custom Domain (Optional)

1. Go to service settings
2. Click "Custom Domain"
3. Add your domain
4. Configure DNS:
   - Type: `CNAME`
   - Name: `www` or `@`
   - Value: Your Render URL

---

## Upgrade Options

If you need more:
- **Starter Plan**: $7/month
  - Always on (no sleep)
  - Faster builds
  - More resources
- **Standard Plan**: $25/month
  - Autoscaling
  - Higher limits

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Community**: https://community.render.com
- **Status**: https://status.render.com

---

## Quick Reference

### Service URLs
- Frontend: `https://khetgpt-frontend.onrender.com`
- Backend: `https://khetgpt-backend.onrender.com`
- API Docs: `https://khetgpt-backend.onrender.com/docs`

### Important Files
- `render.yaml` - Blueprint configuration
- `khetgpt-backend/requirements.txt` - Python dependencies
- `khedgpt-frontend/package.json` - Node dependencies

### Common Commands
```bash
# View service logs
render logs <service-name>

# Manual redeploy
# Use dashboard → "Manual Deploy" button

# Update environment variables
# Use dashboard → "Environment" tab
```

---

## Next Steps After Deployment

1. ✅ Test all features on deployed app
2. ✅ Share frontend URL with users/demo
3. ✅ Set up UptimeRobot to keep services warm
4. ✅ Monitor usage in Render dashboard
5. ✅ Consider custom domain for production

---

## Demo Credentials

Default credentials (from your code):
- Email: `demo@khetgpt.com`
- Password: `password`

---

**Your KhetGPT application is now live on Render! 🚀**

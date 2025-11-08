# 🚀 Deployment Guide for Varuna

This guide covers deploying Varuna to GitHub Pages and setting up the backend.

## 📋 Table of Contents

1. [Frontend Deployment (GitHub Pages)](#frontend-deployment)
2. [Backend Deployment Options](#backend-deployment)
3. [Environment Configuration](#environment-configuration)
4. [Troubleshooting](#troubleshooting)

## 🌐 Frontend Deployment (GitHub Pages)

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### Step 2: Configure Repository Name

If your repository is NOT named `Varuna`:

1. Open `frontend/vite.config.js`
2. Update the base path:
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/YourRepoName/' : '/',
   ```
3. Also update `frontend/src/App.jsx` if needed (it should use `import.meta.env.BASE_URL` automatically)

### Step 3: Set Backend URLs (GitHub Secrets)

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:

   **VITE_API_URL**
   - Name: `VITE_API_URL`
   - Value: Your deployed backend URL (e.g., `https://varuna-backend.herokuapp.com`)

   **VITE_SOCKET_URL**
   - Name: `VITE_SOCKET_URL`
   - Value: Same as above (e.g., `https://varuna-backend.herokuapp.com`)

### Step 4: Deploy

1. Push your code to the `main` branch:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. GitHub Actions will automatically:
   - Build the frontend
   - Deploy to GitHub Pages
   - Check the **Actions** tab for progress

3. Your site will be live at:
   ```
   https://yourusername.github.io/Varuna/
   ```

## 🔧 Backend Deployment

The frontend requires a backend API. Here are deployment options:

### Option 1: Heroku (Recommended for Python)

1. **Install Heroku CLI:**
   ```bash
   # Visit https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create Heroku App:**
   ```bash
   cd python_ai
   heroku create varuna-backend
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set WEATHER_API_KEY=your_weather_api_key
   heroku config:set GROQ_API_KEY=your_groq_api_key
   ```

5. **Deploy:**
   ```bash
   git subtree push --prefix python_ai heroku main
   # Or use Heroku Git:
   heroku git:remote -a varuna-backend
   git push heroku main
   ```

6. **Get Your Backend URL:**
   ```
   https://varuna-backend.herokuapp.com
   ```
   Use this URL in GitHub Secrets (Step 3 above)

### Option 2: Railway

1. Go to [railway.app](https://railway.app/)
2. Create a new project
3. Connect your GitHub repository
4. Select the `python_ai` directory
5. Add environment variables in Railway dashboard
6. Deploy automatically

### Option 3: Render

1. Go to [render.com](https://render.com/)
2. Create a new **Web Service**
3. Connect your repository
4. Set:
   - **Root Directory:** `python_ai`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python app.py`
5. Add environment variables
6. Deploy

### Option 4: Fly.io

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Initialize:**
   ```bash
   cd python_ai
   fly launch
   ```

4. **Set Secrets:**
   ```bash
   fly secrets set MONGODB_URI=your_uri
   fly secrets set WEATHER_API_KEY=your_key
   fly secrets set GROQ_API_KEY=your_key
   ```

5. **Deploy:**
   ```bash
   fly deploy
   ```

## ⚙️ Environment Configuration

### Frontend Environment Variables

Create `frontend/.env.production` for local builds:

```env
VITE_API_URL=https://your-backend.herokuapp.com
VITE_SOCKET_URL=https://your-backend.herokuapp.com
```

For GitHub Actions, use **Secrets** (see Step 3 above).

### Backend Environment Variables

All backend services need:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
WEATHER_API_KEY=your_weatherapi_key
GROQ_API_KEY=your_groq_api_key
```

### CORS Configuration

Make sure your backend allows requests from your GitHub Pages domain:

In `python_ai/app.py`, ensure CORS is configured:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://yourusername.github.io",
            "http://localhost:5173"  # For local development
        ]
    }
})
```

## 🔍 Troubleshooting

### Issue: 404 Errors on GitHub Pages

**Solution:**
- Check that `vite.config.js` has the correct base path
- Ensure `App.jsx` uses `basename={import.meta.env.BASE_URL}`
- Clear browser cache and try again

### Issue: API Calls Failing

**Solution:**
- Verify `VITE_API_URL` is set correctly in GitHub Secrets
- Check that your backend is deployed and running
- Ensure CORS is configured to allow your GitHub Pages domain
- Check browser console for CORS errors

### Issue: Socket.IO Not Connecting

**Solution:**
- Verify `VITE_SOCKET_URL` is set correctly
- Check that your backend supports Socket.IO
- Ensure WebSocket connections are allowed by your hosting provider

### Issue: Build Fails in GitHub Actions

**Solution:**
- Check the **Actions** tab for error details
- Ensure all dependencies are in `package.json`
- Verify Node.js version in workflow file matches your local version

### Issue: Backend Not Starting

**Solution:**
- Check environment variables are set correctly
- Verify MongoDB connection string is valid
- Check logs in your hosting provider's dashboard
- Ensure all Python dependencies are in `requirements.txt`

## 📝 Quick Checklist

Before deploying, ensure:

- [ ] Repository name matches base path in `vite.config.js`
- [ ] GitHub Pages is enabled with GitHub Actions source
- [ ] Backend is deployed and accessible
- [ ] `VITE_API_URL` and `VITE_SOCKET_URL` are set in GitHub Secrets
- [ ] CORS is configured on backend to allow GitHub Pages domain
- [ ] All environment variables are set on backend hosting
- [ ] MongoDB connection is working
- [ ] API keys are valid

## 🎉 Success!

Once deployed, your Varuna dashboard will be live at:
```
https://yourusername.github.io/Varuna/
```

The frontend will automatically connect to your deployed backend API.

---

**Need Help?** Open an issue on GitHub or check the main [README.md](./README.md) for more information.


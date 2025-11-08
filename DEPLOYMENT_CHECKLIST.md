# ✅ Deployment Checklist for GitHub Pages

Use this checklist to ensure everything is ready for deployment.

## Pre-Deployment Checklist

### Frontend Configuration
- [ ] Repository name matches base path in `frontend/vite.config.js`
  - Current: `/Varuna/` (update if your repo has a different name)
- [ ] `frontend/src/App.jsx` uses `basename={import.meta.env.BASE_URL}`
- [ ] All API calls use environment variables (`VITE_API_URL`, `VITE_SOCKET_URL`)
- [ ] No hardcoded `localhost` URLs in production code

### GitHub Repository Setup
- [ ] Repository exists on GitHub
- [ ] Code is pushed to `main` branch
- [ ] GitHub Pages is enabled:
  - Settings → Pages → Source: **GitHub Actions**
- [ ] GitHub Secrets are configured (if using deployed backend):
  - [ ] `VITE_API_URL` (your backend URL)
  - [ ] `VITE_SOCKET_URL` (your backend URL)

### Backend Deployment (Required)
- [ ] Backend is deployed to a hosting service:
  - [ ] Heroku / Railway / Render / Fly.io
  - [ ] Backend URL is accessible
  - [ ] Environment variables are set on backend:
    - [ ] `MONGODB_URI`
    - [ ] `WEATHER_API_KEY`
    - [ ] `GROQ_API_KEY`
  - [ ] CORS is configured to allow GitHub Pages domain

### Testing
- [ ] Frontend builds successfully locally:
  ```bash
  cd frontend
  npm run build
  ```
- [ ] No build errors or warnings
- [ ] `dist` folder is created successfully

## Deployment Steps

1. [ ] Push code to `main` branch:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. [ ] Check GitHub Actions:
   - Go to **Actions** tab
   - Verify workflow runs successfully
   - Check for any errors

3. [ ] Verify Deployment:
   - Wait for deployment to complete (usually 2-5 minutes)
   - Visit: `https://yourusername.github.io/Varuna/`
   - Test the application:
     - [ ] Landing page loads
     - [ ] Dashboard loads
     - [ ] API calls work (if backend is deployed)
     - [ ] Socket.IO connects (if backend is deployed)

## Post-Deployment Verification

- [ ] Site is accessible at GitHub Pages URL
- [ ] No console errors in browser
- [ ] All routes work correctly (no 404s)
- [ ] API calls succeed (if backend is deployed)
- [ ] Socket.IO connects (if backend is deployed)
- [ ] Responsive design works on mobile
- [ ] Animations and interactions work

## Troubleshooting

If something doesn't work:

1. **Check GitHub Actions logs** for build errors
2. **Check browser console** for runtime errors
3. **Verify GitHub Secrets** are set correctly
4. **Check backend logs** if API calls fail
5. **Verify CORS settings** on backend
6. **Clear browser cache** and try again

## Quick Commands

```bash
# Test build locally
cd frontend
npm run build

# Check build output
ls -la dist/

# View deployment status
# Go to: https://github.com/yourusername/Varuna/actions
```

---

**Ready to deploy?** Follow the steps in [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.


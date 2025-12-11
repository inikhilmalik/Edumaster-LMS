# 🚀 Render Deployment Guide - EduMaster LMS Backend

## ✅ Changes Made

Fixed the port binding issue for Render deployment:

1. ✅ Created `render.yaml` configuration file
2. ✅ Updated `package.json` with build:server and start:server scripts
3. ✅ Modified server to bind to `0.0.0.0` (required by Render)
4. ✅ Added graceful shutdown handling

## 📋 Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Commit and push your changes:**
```bash
cd /Users/kogotechlabspvt.ltd./Desktop/LB/edumaster-lms
git add .
git commit -m "Add Render deployment configuration"
git push
```

2. **Go to Render Dashboard:**
   - Visit https://dashboard.render.com/
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository: `inikhilmalik/Edumaster-LMS`
   - Render will automatically detect `render.yaml`

3. **Add Environment Variables:**
   - `MONGODB_URI` = `mongodb+srv://inikhilmalik30:malik@cluster1.mfdgzko.mongodb.net/?appName=Cluster1`
   - `JWT_SECRET` = `learnhub1234`
   - `OPENAI_API_KEY` = (optional, for AI features)
   - `NODE_ENV` = `production`

4. **Deploy!**
   - Click "Apply" and wait 3-5 minutes
   - Your backend will be live at: `https://edumaster-lms-backend.onrender.com`

### Option 2: Manual Setup

1. **Go to Render Dashboard:**
   - Visit https://dashboard.render.com/
   - Click "New +" → "Web Service"

2. **Connect Repository:**
   - Connect GitHub: `inikhilmalik/Edumaster-LMS`
   - Branch: `main`

3. **Configure Build Settings:**
   - **Name:** `edumaster-lms-backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build:server`
   - **Start Command:** `npm run start:server`
   - **Plan:** Free

4. **Add Environment Variables:**
   - `MONGODB_URI` = `mongodb+srv://inikhilmalik30:malik@cluster1.mfdgzko.mongodb.net/?appName=Cluster1`
   - `JWT_SECRET` = `learnhub1234`
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render sets this automatically)

5. **Deploy!**

## 🧪 Test Your Backend

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-app.onrender.com/api/health

# Should return:
# {"status":"OK","message":"EduMaster LMS API is running"}
```

## 🌐 Frontend Deployment (Separate)

**Deploy the frontend to Vercel:**

```bash
# Navigate to your frontend project
cd /Users/kogotechlabspvt.ltd./Desktop/LB/edumaster-lms-nextjs

# Update API base URL in lib/api.ts
# Change from: http://localhost:4000
# To: https://your-backend.onrender.com

# Deploy to Vercel
vercel
```

Or deploy the Next.js frontend from this project to Vercel separately.

## ⚠️ Important Notes

1. **Free Tier Limitations:**
   - Render free tier spins down after 15 minutes of inactivity
   - First request after spin-down takes ~30 seconds
   - Consider upgrading for production use

2. **CORS Configuration:**
   - Backend already has CORS enabled for all origins
   - Update if you need specific origin restrictions

3. **Port Binding:**
   - Server now binds to `0.0.0.0:${PORT}`
   - Render automatically sets the PORT environment variable
   - Don't hardcode the port!

4. **Two Deployment Strategy:**
   - **Backend:** Render (Node.js/Express API)
   - **Frontend:** Vercel (Next.js app)
   - Update frontend API URL to point to Render backend

## 🔧 Troubleshooting

**If deployment still fails:**

1. Check Render logs for specific errors
2. Ensure MongoDB connection string is correct
3. Verify all environment variables are set
4. Check that TypeScript compiles successfully:
   ```bash
   npm run build:server
   ```

**Test build locally:**
```bash
cd /Users/kogotechlabspvt.ltd./Desktop/LB/edumaster-lms
npm run build:server
npm run start:server
```

## 📱 After Deployment

Your backend API will be available at:
- `https://your-app.onrender.com/api/health`
- `https://your-app.onrender.com/api/auth/*`
- `https://your-app.onrender.com/api/courses/*`
- `https://your-app.onrender.com/api/progress/*`

Update your frontend to use this URL!

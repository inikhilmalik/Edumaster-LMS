# 🚀 EduMaster LMS - Complete Deployment Guide

This guide will help you deploy the EduMaster LMS application to production.

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB database (local or Atlas) configured
- [ ] Environment variables set up
- [ ] All dependencies installed (`npm install`)
- [ ] Application tested locally
- [ ] GitHub repository created (optional but recommended)

---

## 🗄️ Database Setup - MongoDB Atlas (Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new organization and project

### Step 2: Create Database Cluster
1. Click "Build a Database"
2. Choose **FREE** M0 cluster
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "edumaster-cluster")
5. Click "Create Cluster"

### Step 3: Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create username and strong password (save these!)
4. Grant "Read and write to any database" role
5. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - *For production, restrict to specific IPs*
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" → Click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `edumaster-lms`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/edumaster-lms?retryWrites=true&w=majority
```

---

## 🖥️ Backend Deployment - Railway

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Initialize Project
```bash
cd /path/to/edumaster-lms
railway init
```

### Step 4: Set Environment Variables
```bash
railway variables set MONGODB_URI="your-mongodb-atlas-connection-string"
railway variables set JWT_SECRET="your-super-secret-jwt-key-change-this"
railway variables set PORT=4000
railway variables set OPENAI_API_KEY="your-openai-key-optional"
```

### Step 5: Deploy Backend
```bash
railway up
```

### Step 6: Get Your Railway URL
```bash
railway open
```
Copy the URL (e.g., `https://your-app.railway.app`)

---

## 🌐 Frontend Deployment - Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd /path/to/edumaster-lms
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **edumaster-lms**
- In which directory? **./  (root)**
- Override settings? **No**

### Step 4: Set Environment Variables

#### Via Vercel CLI:
```bash
vercel env add NEXT_PUBLIC_API_URL
# Enter value: https://your-railway-backend.railway.app
```

#### Via Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add the following:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-railway-backend.railway.app` | Production |
| `MONGODB_URI` | Your MongoDB connection string | Production |
| `JWT_SECRET` | Your JWT secret | Production |
| `OPENAI_API_KEY` | Your OpenAI key (optional) | Production |

### Step 5: Redeploy
```bash
vercel --prod
```

---

## 🔧 Alternative: Deploy Both on Single Server (AWS/DigitalOcean)

### Prerequisites
- Ubuntu Server 20.04+
- Root or sudo access
- Domain name (optional)

### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install MongoDB (if using local DB)
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Step 2: Clone and Setup
```bash
# Clone your repository
git clone https://github.com/yourusername/edumaster-lms.git
cd edumaster-lms

# Install dependencies
npm install

# Create .env.local
nano .env.local
# Add your environment variables and save (Ctrl+X, Y, Enter)
```

### Step 3: Build Application
```bash
# Build Next.js
npm run build
```

### Step 4: Start with PM2
```bash
# Start backend
pm2 start server/index.ts --name edumaster-backend --interpreter tsx

# Start frontend
pm2 start npm --name edumaster-frontend -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 5: Configure Nginx (Optional)
```bash
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/edumaster

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/edumaster /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔐 SSL Certificate (HTTPS)

### Using Certbot (Free SSL)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## ✅ Post-Deployment Verification

### 1. Test Backend API
```bash
curl https://your-backend-url.railway.app/api/health
# Should return: {"status":"OK","message":"EduMaster LMS API is running"}
```

### 2. Test Frontend
- Visit your Vercel URL
- Try registering a new account
- Login
- Browse courses

### 3. Test Database Connection
- Register a user
- Create a course (as instructor)
- Enroll in a course
- Check MongoDB Atlas to verify data

---

## 📊 Monitoring & Maintenance

### Railway Dashboard
- View logs: `railway logs`
- Monitor metrics: Railway dashboard
- Restart: `railway service restart`

### Vercel Dashboard
- View deployment logs
- Monitor analytics
- Check function invocations

### PM2 (Self-hosted)
```bash
pm2 status          # Check status
pm2 logs            # View logs
pm2 restart all     # Restart all apps
pm2 monit           # Monitor resources
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:**
1. Check MongoDB Atlas Network Access (whitelist IP)
2. Verify connection string is correct
3. Ensure database user has proper permissions

### Issue: "CORS Error"
**Solution:**
1. Update CORS settings in `server/index.ts`
2. Add your frontend URL to allowed origins
3. Ensure `NEXT_PUBLIC_API_URL` is set correctly

### Issue: "API requests failing"
**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` points to backend
2. Check backend is running and accessible
3. Review browser console for error details

### Issue: "JWT Authentication not working"
**Solution:**
1. Ensure `JWT_SECRET` is same on both environments
2. Check token is being stored in localStorage
3. Verify Authorization header is being sent

---

## 🔄 Updating the Application

### Vercel (Auto-deploy from Git)
```bash
git add .
git commit -m "Update features"
git push origin main
# Vercel will auto-deploy
```

### Railway
```bash
railway up  # Deploy latest changes
```

### PM2 (Self-hosted)
```bash
git pull origin main
npm install
npm run build
pm2 restart all
```

---

## 🎯 Performance Optimization

### 1. Enable Caching
```javascript
// In server/index.ts
import compression from 'compression';
app.use(compression());
```

### 2. Database Indexing
```javascript
// Add indexes to frequently queried fields
UserSchema.index({ email: 1 });
CourseSchema.index({ category: 1, level: 1 });
```

### 3. Image Optimization
- Use Next.js Image component
- Upload images to CDN (Cloudinary, AWS S3)

---

## 📧 Support

If you encounter issues during deployment:
1. Check the logs for error messages
2. Review this guide for troubleshooting steps
3. Verify all environment variables are set correctly
4. Contact via GitHub issues or LinkedIn

---

## 🎉 Congratulations!

Your EduMaster LMS is now live! Share the URL with House of EdTech evaluators.

**Deployment Checklist:**
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] Environment variables configured
- [ ] HTTPS enabled (optional but recommended)
- [ ] Test user registration
- [ ] Test course creation
- [ ] Test enrollment and progress tracking

---

**Built by Nikhil for House of EdTech Assignment**

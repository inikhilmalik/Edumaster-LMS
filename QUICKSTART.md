# ⚡ EduMaster LMS - Quick Start Guide

Get up and running in **5 minutes**! 🚀

---

## 🎯 Prerequisites

Before you begin, ensure you have:
- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **MongoDB** installed locally OR MongoDB Atlas account ([Get Atlas](https://www.mongodb.com/cloud/atlas))
- ✅ **Git** installed

---

## 🚀 Option 1: Automated Setup (Recommended)

### One-Command Setup

```bash
# Navigate to project
cd edumaster-lms

# Run the automated setup script
./start.sh
```

The script will:
1. Check Node.js installation
2. Check/start MongoDB
3. Create `.env.local` from example
4. Install dependencies
5. Start both frontend and backend servers

**That's it!** 🎉

---

## 🔧 Option 2: Manual Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your settings
# Minimum required: MongoDB connection string
```

### Step 3: Start MongoDB

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
# MongoDB should start automatically
# Or use MongoDB Compass
```

**MongoDB Atlas (Cloud):**
- Use your Atlas connection string in `.env.local`

### Step 4: Start the Application

**Both servers together:**
```bash
npm run dev:all
```

**Or separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

---

## 🌐 Access the Application

Once started, open your browser:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:4000](http://localhost:4000)
- **API Health:** [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 👤 Create Your First Account

1. Go to [http://localhost:3000/register](http://localhost:3000/register)
2. Fill in the registration form:
   - **Name:** Your Name
   - **Email:** your@email.com
   - **Role:** Choose "Learn (Student)" or "Teach (Instructor)"
   - **Password:** At least 6 characters
3. Click "Create Account"
4. You'll be logged in automatically! ✨

---

## 📚 Try These Features

### As a Student:
1. **Browse Courses** → Go to "Courses" in navbar
2. **Enroll in a Course** → Click a course, then "Enroll Now"
3. **Track Progress** → Go to "My Learning"

### As an Instructor:
1. **Create a Course** → Go to "Instructor" → "Create Course"
2. **Add Course Details** → Fill in title, description, category
3. **Manage Courses** → View your instructor dashboard

---

## 🔑 Environment Variables Explained

```env
# Required - MongoDB connection
MONGODB_URI=mongodb://localhost:27017/edumaster-lms

# Required - JWT secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Required - Backend URL
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000

# Optional - For AI features
OPENAI_API_KEY=sk-...
```

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
**Solution:**
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# If not, start it:
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Linux
```

### "Port 3000 already in use"
**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### "Port 4000 already in use"
**Solution:**
```bash
# Kill the process using port 4000
lsof -ti:4000 | xargs kill -9
```

### "Module not found" errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Next Steps

Now that you're up and running:

1. **Read the Full README** → [README.md](./README.md)
2. **Test All Features** → [TESTING.md](./TESTING.md)
3. **Deploy to Production** → [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Review Project Details** → [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

---

## 🎯 Quick Commands Reference

```bash
# Development
npm run dev              # Start Next.js (frontend only)
npm run dev:server       # Start Express (backend only)
npm run dev:all          # Start both servers

# Production Build
npm run build            # Build Next.js for production
npm run start            # Start Next.js production server
npm run start:server     # Start Express production server

# Utilities
npm run lint             # Run ESLint
./start.sh               # Automated setup and start
```

---

## 💡 Pro Tips

1. **Use Multiple Terminals**
   - Terminal 1: Frontend logs
   - Terminal 2: Backend logs
   - Terminal 3: MongoDB/commands

2. **Install MongoDB Compass**
   - Visual interface for MongoDB
   - Easy to view and edit data
   - [Download here](https://www.mongodb.com/products/compass)

3. **Use Browser DevTools**
   - Network tab to debug API calls
   - Console for frontend errors
   - Application tab to check localStorage (token)

4. **Test with Different Roles**
   - Create multiple accounts (student, instructor)
   - Test different permissions
   - See how data flows

---

## 🎓 Demo Accounts (After Setup)

Create these accounts for testing:

**Instructor Account:**
```
Email: instructor@demo.com
Password: demo123
Role: Instructor
```

**Student Account:**
```
Email: student@demo.com
Password: demo123
Role: Student
```

---

## 📞 Need Help?

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section above
2. Review [TESTING.md](./TESTING.md) for detailed testing procedures
3. Check server logs for error messages
4. Verify all environment variables are set correctly

---

## ✅ Verification Checklist

Before you start development, verify:

- [ ] Node.js 18+ installed (`node -v`)
- [ ] MongoDB running (`mongosh` connects successfully)
- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] `.env.local` file created and configured
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend API accessible at http://localhost:4000
- [ ] Can register and login successfully
- [ ] Can create and view courses

---

## 🎉 You're All Set!

Your EduMaster LMS is now running! Start exploring the features and building amazing learning experiences. 🚀

**Happy Coding! 💻**

---

**Built by Nikhil for House of EdTech**  
**GitHub:** [github.com/nikhil](https://github.com/nikhil)  
**LinkedIn:** [linkedin.com/in/nikhil](https://linkedin.com/in/nikhil)

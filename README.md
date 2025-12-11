# EduMaster LMS - Full-Stack Learning Management System

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)

A modern, AI-powered Learning Management System built with Next.js 16, Express.js, MongoDB, and featuring secure JWT authentication.

**Built by:** Nikhil  
**GitHub:** [github.com/nikhil](https://github.com/nikhil)  
**LinkedIn:** [linkedin.com/in/nikhil](https://linkedin.com/in/nikhil)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 3. Start MongoDB (if using locally)
brew services start mongodb-community  # macOS
# or
mongod --config /usr/local/etc/mongod.conf

# 4. Run the application
npm run dev:all
# Or run separately:
# Terminal 1: npm run dev
# Terminal 2: npm run dev:server
```

### Access
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000

---

## ✨ Features

### Core Functionality
- ✅ Complete CRUD Operations for courses, lessons, users
- 🔐 Secure JWT Authentication
- 👥 Role-Based Access (Student, Instructor, Admin)
- 📚 Comprehensive Course Management
- 📊 Real-time Progress Tracking
- 🎓 Enrollment System
- ⭐ Reviews & Ratings

### Technical Highlights
- 🤖 AI-Powered Content Generation (Optional)
- 🔍 Advanced Search & Filters
- 📱 Fully Responsive Design
- 🎨 Modern UI with Tailwind CSS + shadcn/ui
- ⚡ Real-time Updates
- 🛡️ Data Validation & Sanitization
- 🔄 Robust Error Handling

---

## 🛠️ Tech Stack

**Frontend:** Next.js 16, TypeScript, Tailwind CSS, shadcn/ui  
**Backend:** Express.js, Node.js, MongoDB, Mongoose  
**Auth:** JWT, bcryptjs  
**AI:** OpenAI (optional)

---

## 📦 Project Structure

```
edumaster-lms/
├── app/                    # Next.js pages
├── components/             # React components
├── lib/                    # Utilities & API
├── server/                 # Express backend
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   └── middleware/        # Auth & validation
└── .env.local             # Environment config
```

---

## 🔑 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/edumaster-lms
JWT_SECRET=your-secret-key-here
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000
OPENAI_API_KEY=optional-for-ai-features
```

---

## 🚀 Deployment

### Vercel (Frontend)
```bash
vercel --prod
```

### Railway (Backend)
```bash
railway login
railway up
```

**Don't forget to set environment variables in your hosting platform!**

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile

### Courses
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course (instructor)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course

### Progress
- `GET /api/progress` - Get all progress
- `GET /api/progress/:courseId` - Get course progress
- `PUT /api/progress/:courseId` - Update progress

---

## 🎯 Key Features Demo

1. **Authentication** - Secure signup/login with JWT
2. **Course Creation** - Instructors can create rich courses
3. **Browse & Filter** - Search courses by category/level
4. **Enrollment** - One-click course enrollment
5. **Progress Tracking** - Real-time learning analytics
6. **AI Content** - Generate course content with AI

---

## 🧪 Testing

Create test accounts:

**Instructor:**
```
Email: instructor@test.com
Password: test123
Role: instructor
```

**Student:**
```
Email: student@test.com
Password: test123
Role: student
```

---

## 👨‍💻 Developer

**Nikhil**  
- GitHub: [github.com/nikhil](https://github.com/nikhil)
- LinkedIn: [linkedin.com/in/nikhil](https://linkedin.com/in/nikhil)

---

## 📄 License

Built for House of EdTech Full-Stack Developer Assignment - December 2025

---

**Built with ❤️ using Next.js, Express, MongoDB, and AI**

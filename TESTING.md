# 🧪 EduMaster LMS - Testing Guide

This guide provides comprehensive testing instructions to verify all features are working correctly.

---

## 🚀 Quick Start Testing

### 1. Start the Application
```bash
# Terminal 1: Start both servers
npm run dev:all

# Or separately:
# Terminal 1: npm run dev (Next.js frontend)
# Terminal 2: npm run dev:server (Express backend)
```

### 2. Access the Application
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

---

## ✅ Feature Testing Checklist

### 1. Authentication & Authorization

#### Register New User (Student)
- [ ] Go to http://localhost:3000/register
- [ ] Fill in the form:
  - Name: "John Student"
  - Email: "student@test.com"
  - Role: "Learn (Student)"
  - Password: "test123"
  - Confirm Password: "test123"
- [ ] Click "Create Account"
- [ ] Verify redirect to /courses
- [ ] Check navbar shows user avatar

#### Register Instructor
- [ ] Logout (click avatar → Logout)
- [ ] Go to /register
- [ ] Create account with:
  - Name: "Jane Instructor"
  - Email: "instructor@test.com"
  - Role: "Teach (Instructor)"
  - Password: "test123"
- [ ] Verify "Instructor" link appears in navbar

#### Login
- [ ] Logout
- [ ] Go to /login
- [ ] Login with instructor@test.com / test123
- [ ] Verify successful login

#### Authorization
- [ ] As student: Verify no access to /instructor
- [ ] As instructor: Verify access to /instructor
- [ ] As instructor: Verify access to course creation

---

### 2. Course Management (Instructor)

#### Create Course
- [ ] Login as instructor
- [ ] Go to /instructor
- [ ] Click "Create Course"
- [ ] Fill in course details:
  - Title: "Complete Web Development Bootcamp"
  - Description: "Learn HTML, CSS, JavaScript, React, and Next.js"
  - Category: "Web Development"
  - Level: "Beginner"
  - Price: 0 (Free)
  - Tags: web, javascript, react
- [ ] Click "Create Course"
- [ ] Verify course appears in instructor dashboard

#### Add Lessons (via API test)
Since lesson UI might be simplified, test via API:
```bash
# Get your auth token from localStorage (browser console)
# localStorage.getItem('token')

# Add lesson
curl -X POST http://localhost:4000/api/courses/COURSE_ID/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Introduction to Web Development",
    "content": "Welcome to the course! In this lesson, we will cover the basics.",
    "duration": 30,
    "order": 0
  }'
```

#### Update Course
- [ ] Go to instructor dashboard
- [ ] Click "Edit" on a course
- [ ] Modify course details
- [ ] Click "Save"
- [ ] Verify changes are reflected

#### Publish Course
- [ ] Toggle course publish status
- [ ] Verify course appears in public course list

---

### 3. Course Discovery (Student)

#### Browse Courses
- [ ] Go to /courses
- [ ] Verify courses are displayed
- [ ] Check course cards show:
  - Title
  - Description
  - Category badge
  - Level badge
  - Student count
  - Lesson count
  - Rating
  - Price

#### Search & Filter
- [ ] Test search: Enter "web" in search box
- [ ] Click "Apply Filters"
- [ ] Verify results match search
- [ ] Filter by Category: Select "Web Development"
- [ ] Filter by Level: Select "Beginner"
- [ ] Click "Reset" to clear filters

#### View Course Details
- [ ] Click on a course card
- [ ] Verify course detail page shows:
  - Course information
  - Instructor details
  - Lesson list
  - Enroll button

---

### 4. Enrollment & Progress

#### Enroll in Course
- [ ] Login as student
- [ ] Go to course detail page
- [ ] Click "Enroll Now"
- [ ] Verify success message
- [ ] Verify "Enrolled" badge appears

#### View My Learning
- [ ] Go to /my-learning
- [ ] Verify enrolled course appears
- [ ] Check progress bar shows 0%

#### Update Progress (via API)
```bash
# Mark lesson as completed
curl -X PUT http://localhost:4000/api/progress/COURSE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "lessonIndex": 0,
    "completed": true
  }'
```

- [ ] Refresh /my-learning
- [ ] Verify progress bar updated

---

### 5. User Interface Testing

#### Responsive Design
- [ ] Open browser DevTools (F12)
- [ ] Toggle device toolbar
- [ ] Test on:
  - Mobile (375px)
  - Tablet (768px)
  - Desktop (1920px)
- [ ] Verify layout adapts correctly
- [ ] Check mobile menu works

#### Navigation
- [ ] Test all navbar links
- [ ] Verify dropdown menu works
- [ ] Test mobile hamburger menu
- [ ] Check footer links

#### Visual Elements
- [ ] Verify gradients render correctly
- [ ] Check badges have proper colors
- [ ] Test hover effects on cards
- [ ] Verify icons display properly

---

### 6. API Testing

#### Health Check
```bash
curl http://localhost:4000/api/health
# Expected: {"status":"OK","message":"EduMaster LMS API is running"}
```

#### Public Endpoints
```bash
# Get all courses
curl http://localhost:4000/api/courses

# Get course by ID
curl http://localhost:4000/api/courses/COURSE_ID
```

#### Protected Endpoints
```bash
# Get profile (requires auth)
curl http://localhost:4000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get my courses
curl http://localhost:4000/api/courses/my/enrolled \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. AI Features (Optional)

If you have OPENAI_API_KEY set:

```bash
# Generate course content
curl -X POST http://localhost:4000/api/ai/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a brief introduction for a web development course",
    "type": "lesson_content"
  }'
```

Without API key:
- [ ] Verify graceful fallback message
- [ ] Check app doesn't crash

---

### 8. Error Handling

#### Validation Errors
- [ ] Try registering with existing email
- [ ] Try login with wrong password
- [ ] Try creating course without title
- [ ] Verify error messages are user-friendly

#### Network Errors
- [ ] Stop backend server
- [ ] Try API call from frontend
- [ ] Verify error handling works
- [ ] Restart backend

#### Authorization Errors
- [ ] Try accessing /instructor as student
- [ ] Try editing someone else's course
- [ ] Verify proper error messages

---

### 9. Data Persistence

#### Database Verification
```bash
# Connect to MongoDB
mongosh edumaster-lms

# Check users
db.users.find().pretty()

# Check courses
db.courses.find().pretty()

# Check progress
db.progresses.find().pretty()

# Exit
exit
```

- [ ] Verify data is saved correctly
- [ ] Check relationships are maintained

---

### 10. Performance Testing

#### Load Time
- [ ] Open DevTools → Network tab
- [ ] Clear cache
- [ ] Reload homepage
- [ ] Verify page loads < 3 seconds

#### Bundle Size
```bash
npm run build
```
- [ ] Check build output
- [ ] Verify no excessive bundle sizes

---

## 🎯 Test Scenarios

### Scenario 1: Complete User Journey (Student)
1. Register as student
2. Browse courses
3. Search for specific course
4. View course details
5. Enroll in course
6. Go to My Learning
7. Start learning (mark lessons complete)
8. Track progress

### Scenario 2: Instructor Workflow
1. Register as instructor
2. Create new course
3. Add course details
4. Add lessons
5. Publish course
6. View course in catalog
7. Edit course information
8. View enrolled students

### Scenario 3: Multi-User Interaction
1. Instructor creates course
2. Student enrolls in course
3. Student completes lessons
4. Instructor sees enrollment count
5. Student leaves review (future)

---

## 🐛 Known Issues & Limitations

### Current Limitations
- No real-time notifications
- No video upload (only URLs)
- No payment integration
- Quiz functionality placeholder
- Basic review system

### Future Enhancements
- Video upload to cloud storage
- Payment integration (Stripe)
- Advanced quiz system
- Live chat support
- Certificates on completion
- Mobile app

---

## 📊 Test Results Template

Use this template to document your test results:

```
Test Date: __________
Tester: __________

Authentication ✓ / ✗
Course Creation ✓ / ✗
Course Discovery ✓ / ✗
Enrollment ✓ / ✗
Progress Tracking ✓ / ✗
UI/UX ✓ / ✗
API Endpoints ✓ / ✗
Error Handling ✓ / ✗

Notes:
_____________________
_____________________
```

---

## 🎉 Testing Complete!

Once all tests pass, your EduMaster LMS is ready for deployment!

**Next Steps:**
1. Review DEPLOYMENT.md for deployment instructions
2. Set up production environment variables
3. Deploy to Vercel and Railway
4. Perform final production testing
5. Submit to House of EdTech

---

**Questions or Issues?**
- Check README.md for documentation
- Review DEPLOYMENT.md for deployment help
- Contact developer via GitHub or LinkedIn

**Built by Nikhil for House of EdTech Assignment**

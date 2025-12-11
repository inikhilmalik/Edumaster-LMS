import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  enrollCourse,
  getMyCourses,
  getInstructorCourses,
} from '../controllers/courseController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Protected routes (must come before /:id to avoid route conflicts)
router.get('/my/enrolled', authenticate, getMyCourses);
router.get('/my/instructor', authenticate, authorize('instructor', 'admin'), getInstructorCourses);

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', authenticate, authorize('instructor', 'admin'), createCourse);
router.put('/:id', authenticate, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteCourse);
router.post('/:id/lessons', authenticate, authorize('instructor', 'admin'), addLesson);
router.post('/:id/enroll', authenticate, enrollCourse);

export default router;

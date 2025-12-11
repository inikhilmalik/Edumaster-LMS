import express from 'express';
import { getProgress, updateProgress, getAllProgress } from '../controllers/progressController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticate, getAllProgress);
router.get('/:courseId', authenticate, getProgress);
router.put('/:courseId', authenticate, updateProgress);

export default router;

import { Response } from 'express';
import Progress from '../models/Progress';
import Course from '../models/Course';
import { AuthRequest } from '../middleware/auth';

export const getProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const progress = await Progress.findOne({
      user: req.userId,
      course: courseId,
    }).populate('course', 'title lessons');

    if (!progress) {
      res.status(404).json({ error: 'Progress not found' });
      return;
    }

    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { lessonIndex, completed } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    let progress = await Progress.findOne({
      user: req.userId,
      course: courseId,
    });

    if (!progress) {
      res.status(404).json({ error: 'Progress not found. Please enroll first.' });
      return;
    }

    // Update completed lessons
    if (completed && !progress.completedLessons.includes(lessonIndex)) {
      progress.completedLessons.push(lessonIndex);
    } else if (!completed) {
      progress.completedLessons = progress.completedLessons.filter(
        (l: number) => l !== lessonIndex
      );
    }

    // Update last accessed lesson
    progress.lastAccessedLesson = lessonIndex;
    progress.lastAccessed = new Date();

    // Calculate progress percentage
    const totalLessons = course.lessons.length;
    progress.progress = totalLessons > 0 
      ? Math.round((progress.completedLessons.length / totalLessons) * 100)
      : 0;

    // Check if course is completed
    if (progress.progress === 100 && !progress.completed) {
      progress.completed = true;
      progress.completedAt = new Date();
    } else if (progress.progress < 100) {
      progress.completed = false;
      progress.completedAt = undefined;
    }

    await progress.save();

    res.json({ message: 'Progress updated successfully', progress });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const progressList = await Progress.find({ user: req.userId })
      .populate('course', 'title thumbnail instructor')
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name email',
        },
      });

    res.json({ progress: progressList });
  } catch (error) {
    console.error('Get all progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

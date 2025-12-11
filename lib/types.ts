export interface User {
  id: string;
  _id?: string; // MongoDB _id (optional for compatibility)
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  bio?: string;
  enrolledCourses?: string[];
}

export interface Lesson {
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
  resources?: {
    title: string;
    url: string;
    type: string;
  }[];
  _id?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  thumbnail?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  lessons: Lesson[];
  enrolledStudents: string[];
  rating: number;
  reviews: {
    user: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  published: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  progress?: number;
  lastAccessed?: Date;
}

export interface Progress {
  _id: string;
  user: string;
  course: string | Course;
  completedLessons: number[];
  lastAccessedLesson: number;
  progress: number;
  quizScores: {
    lessonIndex: number;
    score: number;
    totalQuestions: number;
    completedAt: Date;
  }[];
  enrolledAt: Date;
  lastAccessed: Date;
  completed: boolean;
  completedAt?: Date;
}

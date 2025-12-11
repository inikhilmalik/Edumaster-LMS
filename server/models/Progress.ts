import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  completedLessons: number[];
  lastAccessedLesson: number;
  progress: number; // percentage
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

const ProgressSchema = new Schema<IProgress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedLessons: [
      {
        type: Number,
      },
    ],
    lastAccessedLesson: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    quizScores: [
      {
        lessonIndex: Number,
        score: Number,
        totalQuestions: Number,
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Create compound index for user and course
ProgressSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);

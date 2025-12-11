import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson {
  title: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  resources?: {
    title: string;
    url: string;
    type: string;
  }[];
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  thumbnail?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  lessons: ILesson[];
  enrolledStudents: mongoose.Types.ObjectId[];
  rating: number;
  reviews: {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  published: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  videoUrl: String,
  duration: {
    type: Number,
    required: true,
    default: 0,
  },
  order: {
    type: Number,
    required: true,
  },
  resources: [
    {
      title: String,
      url: String,
      type: String,
    },
  ],
});

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    lessons: [LessonSchema],
    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    published: {
      type: Boolean,
      default: true,
      required: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

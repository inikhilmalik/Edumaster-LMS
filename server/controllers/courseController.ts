import { Response } from "express";
import Course from "../models/Course";
import User from "../models/User";
import Progress from "../models/Progress";
import { AuthRequest } from "../middleware/auth";

export const getAllCourses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { category, level, search } = req.query;
    console.log("Received filters:", { category, level, search }); // Debug log

    let query: any = { published: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search as string, "i")] } },
      ];
    }

    console.log("MongoDB query:", JSON.stringify(query)); // Debug log
    const courses = await Course.find(query)
      .populate("instructor", "name email avatar")
      .sort({ createdAt: -1 });

    console.log(`Found ${courses.length} courses`); // Debug log
    res.json({ courses });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCourseById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate(
      "instructor",
      "name email avatar bio"
    );

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    res.json({ course });
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const createCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      category,
      level,
      price,
      thumbnail,
      tags,
      published,
    } = req.body;

    if (!title || !description || !category) {
      res.status(400).json({ error: "Please provide all required fields" });
      return;
    }

    const course = await Course.create({
      title,
      description,
      category,
      level: level || "beginner",
      price: price || 0,
      thumbnail,
      tags: tags || [],
      instructor: req.userId,
      lessons: [],
    //   published: true,
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    // Check if user is the instructor or admin
    if (
      course.instructor.toString() !== req.userId &&
      req.userRole !== "admin"
    ) {
      res.status(403).json({ error: "Not authorized to update this course" });
      return;
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    // Check if user is the instructor or admin
    if (
      course.instructor.toString() !== req.userId &&
      req.userRole !== "admin"
    ) {
      res.status(403).json({ error: "Not authorized to delete this course" });
      return;
    }

    await Course.findByIdAndDelete(id);
    await Progress.deleteMany({ course: id });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const addLesson = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, videoUrl, duration, resources } = req.body;

    const course = await Course.findById(id);

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    if (
      course.instructor.toString() !== req.userId &&
      req.userRole !== "admin"
    ) {
      res.status(403).json({ error: "Not authorized" });
      return;
    }

    const lesson = {
      title,
      content,
      videoUrl,
      duration: duration || 0,
      order: course.lessons.length,
      resources: resources || [],
    };

    course.lessons.push(lesson);
    await course.save();

    res.status(201).json({ message: "Lesson added successfully", course });
  } catch (error) {
    console.error("Add lesson error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const enrollCourse = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    // Prevent instructor from enrolling in their own course
    if (course.instructor.toString() === req.userId) {
      res
        .status(400)
        .json({ error: "Instructors cannot enroll in their own courses" });
      return;
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.userId as any)) {
      res.status(400).json({ error: "Already enrolled in this course" });
      return;
    }

    // Add to course enrolled students
    course.enrolledStudents.push(req.userId as any);
    await course.save();

    // Add to user enrolled courses
    await User.findByIdAndUpdate(req.userId, {
      $push: { enrolledCourses: course._id },
    });

    // Create progress tracker
    await Progress.create({
      user: req.userId,
      course: course._id,
      completedLessons: [],
      progress: 0,
    });

    res.json({ message: "Successfully enrolled in course" });
  } catch (error) {
    console.error("Enroll course error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyCourses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "enrolledCourses",
      populate: {
        path: "instructor",
        select: "name email avatar",
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      user.enrolledCourses.map(async (course: any) => {
        const progress = await Progress.findOne({
          user: req.userId,
          course: course._id,
        });

        return {
          ...course.toObject(),
          progress: progress?.progress || 0,
          lastAccessed: progress?.lastAccessed,
        };
      })
    );

    res.json({ courses: coursesWithProgress });
  } catch (error) {
    console.error("Get my courses error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getInstructorCourses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const courses = await Course.find({ instructor: req.userId });
    res.json({ courses });
  } catch (error) {
    console.error("Get instructor courses error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

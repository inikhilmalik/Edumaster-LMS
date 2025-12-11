'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { courseApi } from '@/lib/api';
import { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Award } from 'lucide-react';

export default function MyLearningPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCourses();
  }, [user, authLoading]);

  const fetchCourses = async () => {
    const response = await courseApi.getMyCourses();
    if (response.data?.courses) {
      setCourses(response.data.courses);
    }
    setLoading(false);
  };

  // Show loading spinner while auth is initializing
  if (authLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">My Learning</h1>
        <p className="text-lg text-muted-foreground">
          Continue your learning journey and track your progress
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted" />
              <CardHeader>
                <div className="h-6 bg-muted rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course._id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600" />
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription>
                  By {course.instructor?.name || 'Unknown Instructor'}
                </CardDescription>
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {course.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{course.progress || 0}%</span>
                  </div>
                  <Progress value={course.progress || 0} className="h-2" />
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course.lessons?.length || 0} lessons
                  </span>
                  {course.progress === 100 && (
                    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                      <Award className="mr-1 h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                </div>
                <Link href={`/courses/${course._id}`} className="block">
                  <Button className="w-full">
                    {(course.progress ?? 0) > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold">No enrolled courses yet</h3>
          <p className="mb-6 text-muted-foreground">
            Start your learning journey by enrolling in a course
          </p>
          <Link href="/courses">
            <Button size="lg">Browse Courses</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

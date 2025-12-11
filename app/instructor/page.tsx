'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { courseApi } from '@/lib/api';
import { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Users, Edit, Trash2 } from 'lucide-react';

export default function InstructorPage() {
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
    if (user.role !== 'instructor' && user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchCourses();
  }, [user, authLoading]);

  const fetchCourses = async () => {
    const response = await courseApi.getInstructorCourses();
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses and track student progress</p>
        </div>
        <Link href="/instructor/create">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Course
          </Button>
        </Link>
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
            <Card key={course._id} className="overflow-hidden">
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
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.enrolledStudents?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.lessons?.length || 0}
                        </span>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge variant={course.published ? 'default' : 'secondary'}>
                    {course.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Link href={`/instructor/courses/${course._id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/courses/${course._id}`} className="flex-1">
                  <Button className="w-full">View</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold">No courses yet</h3>
          <p className="mb-6 text-muted-foreground">
            Create your first course to start teaching
          </p>
          <Link href="/instructor/create">
            <Button>
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Course
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

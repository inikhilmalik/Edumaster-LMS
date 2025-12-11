'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { courseApi } from '@/lib/api';
import { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  PlayCircle,
  FileText,
  CheckCircle,
  ArrowLeft,
  Loader2,
  GraduationCap,
} from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchCourse();
    }
  }, [params.id, user]);

  const fetchCourse = async () => {
    try {
      const response = await courseApi.getCourseById(params.id as string);
      if (response.data?.course) {
        setCourse(response.data.course);
        // Check if user is enrolled
        if (user && response.data.course.enrolledStudents) {
          setEnrolled(response.data.course.enrolledStudents.includes(user.id));
        }
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setEnrolling(true);
    setError('');

    try {
      const response = await courseApi.enrollCourse(params.id as string);
      if (response.error) {
        setError(response.error);
      } else {
        setEnrolled(true);
        // Refresh course data
        fetchCourse();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const levelColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  };

  if (loading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center px-4 py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container px-4 py-12">
        <Card className="p-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Course Not Found</h2>
          <p className="mb-6 text-muted-foreground">
            {error || 'The course you are looking for does not exist.'}
          </p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const totalDuration = course.lessons.reduce((acc, lesson) => acc + lesson.duration, 0);
  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 py-8">
        {/* Back button */}
        <Link href="/courses" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Course header */}
            <div className="mb-6">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge className={levelColors[course.level]}>{course.level}</Badge>
                {course.price === 0 && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Free
                  </Badge>
                )}
              </div>

              <h1 className="mb-4 text-4xl font-bold leading-tight">{course.title}</h1>
              <p className="text-lg text-muted-foreground">{course.description}</p>

              {/* Course stats */}
              <div className="mt-6 flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({course.reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <span>{course.enrolledStudents.length} students enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>
                    {totalHours > 0 && `${totalHours}h `}
                    {totalMinutes}m total
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-5 w-5" />
                  <span>{course.lessons.length} lessons</span>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Instructor info */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Instructor</h2>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={course.instructor.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-lg font-semibold text-primary-foreground">
                    {course.instructor.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{course.instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.instructor.email}</p>
                  {course.instructor.bio && (
                    <p className="mt-2 text-sm">{course.instructor.bio}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Course content */}
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Course Content</h2>
              {course.lessons.length > 0 ? (
                <div className="space-y-3">
                  {course.lessons.map((lesson, index) => (
                    <Card key={index} className="overflow-hidden transition-shadow hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <span className="text-sm font-semibold text-primary">{index + 1}</span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{lesson.title}</CardTitle>
                              {lesson.content && (
                                <CardDescription className="mt-1 line-clamp-2">
                                  {lesson.content}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{lesson.duration}m</span>
                          </div>
                        </div>
                      </CardHeader>
                      {lesson.videoUrl && (
                        <CardContent className="pt-0">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <PlayCircle className="h-4 w-4" />
                            <span>Video included</span>
                          </div>
                        </CardContent>
                      )}
                      {lesson.resources && lesson.resources.length > 0 && (
                        <CardContent className="pt-0">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>{lesson.resources.length} resource(s)</span>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No lessons added yet</p>
                </Card>
              )}
            </div>

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <>
                <Separator className="my-8" />
                <div>
                  <h2 className="mb-4 text-2xl font-bold">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="overflow-hidden">
                {course.thumbnail && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="mb-4 text-center">
                    {course.price > 0 ? (
                      <div>
                        <span className="text-4xl font-bold">${course.price}</span>
                        <span className="text-muted-foreground"> USD</span>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-green-600">Free</div>
                    )}
                  </div>

                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {enrolled ? (
                    <div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => router.push('/my-learning')}
                      >
                        <GraduationCap className="mr-2 h-5 w-5" />
                        Go to My Learning
                      </Button>
                      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>You are enrolled</span>
                      </div>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleEnroll}
                      disabled={enrolling || !user}
                    >
                      {enrolling ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <BookOpen className="mr-2 h-5 w-5" />
                          {user ? 'Enroll Now' : 'Login to Enroll'}
                        </>
                      )}
                    </Button>
                  )}
                </CardHeader>

                <Separator />

                <CardContent className="pt-6">
                  <h3 className="mb-3 font-semibold">This course includes:</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <BookOpen className="h-5 w-5 flex-shrink-0" />
                      <span>{course.lessons.length} comprehensive lessons</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="h-5 w-5 flex-shrink-0" />
                      <span>
                        {totalHours > 0 && `${totalHours} hours `}
                        {totalMinutes} minutes of content
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <PlayCircle className="h-5 w-5 flex-shrink-0" />
                      <span>Video lectures</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <FileText className="h-5 w-5 flex-shrink-0" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span>Track your progress</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <GraduationCap className="h-5 w-5 flex-shrink-0" />
                      <span>Certificate on completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional info */}
              {user && user.role === 'instructor' && course.instructor._id === user.id && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Instructor Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/instructor`}>Edit Course</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

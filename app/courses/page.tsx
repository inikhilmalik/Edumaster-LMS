'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { courseApi } from '@/lib/api';
import { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Clock, Users, Star, Filter } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (filters?: any) => {
    setLoading(true);
    try {
      const response = await courseApi.getAllCourses(filters);
      console.log('Courses API response:', response); // Debug log
      if (response.data?.courses) {
        setCourses(response.data.courses);
      } else if (response.error) {
        console.error('Error fetching courses:', response.error);
      }
    } catch (error) {
      console.error('Exception fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    const filters: any = {};
    if (search) filters.search = search;
    if (category && category !== 'all') filters.category = category;
    if (level && level !== 'all') filters.level = level;
    console.log('Applying filters:', filters); // Debug log
    fetchCourses(filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  const levelColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="container px-4 py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Explore Courses</h1>
        <p className="text-lg text-muted-foreground">
          Discover and enroll in courses that match your learning goals
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleFilter} className="flex-1">Apply Filters</Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setCategory('all');
                setLevel('all');
                fetchCourses();
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted" />
              <CardHeader>
                <div className="h-6 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course._id} className="flex flex-col transition-all hover:shadow-lg">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
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
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge className={levelColors[course.level]}>
                    {course.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolledStudents?.length || 0} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.lessons?.length || 0} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating.toFixed(1)} rating</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="flex w-full items-center justify-between">
                  <span className="text-2xl font-bold">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>
                </div>
                <Link href={`/courses/${course._id}`} className="w-full">
                  <Button className="w-full">View Course</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query</p>
        </Card>
      )}
    </div>
  );
}

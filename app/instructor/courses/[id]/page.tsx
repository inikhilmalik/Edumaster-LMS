'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { courseApi } from '@/lib/api';
import { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, Save, Trash2, Plus } from 'lucide-react';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'beginner',
    price: 0,
    thumbnail: '',
    tags: '',
    published: true,
  });

  useEffect(() => {
    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      const response = await courseApi.getCourseById(params.id as string);
      if (response.data?.course) {
        const courseData = response.data.course;
        setCourse(courseData);
        setFormData({
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          level: courseData.level,
          price: courseData.price,
          thumbnail: courseData.thumbnail || '',
          tags: courseData.tags.join(', '),
          published: courseData.published,
        });
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const updateData = {
        ...formData,
        tags: tagsArray,
        price: Number(formData.price),
      };

      const response = await courseApi.updateCourse(params.id as string, updateData);

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Course updated successfully!');
        setTimeout(() => {
          router.push('/instructor');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    try {
      const response = await courseApi.deleteCourse(params.id as string);
      if (response.error) {
        setError(response.error);
        setSaving(false);
      } else {
        router.push('/instructor');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete course');
      setSaving(false);
    }
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

  if (!course || error) {
    return (
      <div className="container px-4 py-12">
        <Card className="p-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Course Not Found</h2>
          <p className="mb-6 text-muted-foreground">
            {error || 'The course you are looking for does not exist.'}
          </p>
          <Link href="/instructor">
            <Button>Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
    return (
      <div className="container px-4 py-12">
        <Card className="p-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Access Denied</h2>
          <p className="mb-6 text-muted-foreground">
            You need to be an instructor to edit courses.
          </p>
          <Link href="/instructor">
            <Button>Go to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/instructor">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Course</h1>
            <p className="text-muted-foreground">Update your course information</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>
              Modify the details of your course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500 bg-green-50 text-green-700">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete Web Development Bootcamp"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn in this course..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    disabled={saving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                    disabled={saving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  disabled={saving}
                />
                <p className="text-sm text-muted-foreground">Set to 0 for free courses</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL (Optional)</Label>
                <Input
                  id="thumbnail"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Optional)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., javascript, react, nextjs (comma-separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  disabled={saving}
                />
                <p className="text-sm text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="published" className="text-base">
                      Course Status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.published ? 'Course is visible to students' : 'Course is hidden (draft mode)'}
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                    disabled={saving}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Link href="/instructor" className="flex-1">
                  <Button type="button" variant="outline" className="w-full" disabled={saving}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete this course</p>
                <p className="text-sm text-muted-foreground">
                  Once you delete a course, there is no going back. Please be certain.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={saving}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Course
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Course Lessons</CardTitle>
            <CardDescription>
              Manage lessons for this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {index + 1}. {lesson.title}
                        </CardTitle>
                        <span className="text-sm text-muted-foreground">
                          {lesson.duration} min
                        </span>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No lessons added yet</p>
                <p className="mt-2 text-sm">Use the API to add lessons to this course</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

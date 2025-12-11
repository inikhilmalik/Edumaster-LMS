'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Brain, Award, Users, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Courses',
      description: 'Access a wide range of expertly crafted courses across multiple domains',
    },
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Get personalized recommendations and AI-generated content to enhance your learning',
    },
    {
      icon: Award,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics and progress tracking',
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and experienced educators',
    },
    {
      icon: Sparkles,
      title: 'Interactive Content',
      description: 'Engage with quizzes, assignments, and hands-on projects',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Acquire skills that propel your career forward in the digital age',
    },
  ];

  const categories = [
    { name: 'Web Development', count: 45, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    { name: 'Data Science', count: 32, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
    { name: 'AI & Machine Learning', count: 28, color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
    { name: 'Business', count: 21, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
    { name: 'Design', count: 18, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300' },
    { name: 'Marketing', count: 15, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  ];

  const stats = [
    { label: 'Active Learners', value: '50,000+' },
    { label: 'Expert Instructors', value: '500+' },
    { label: 'Courses Available', value: '200+' },
    { label: 'Success Rate', value: '95%' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="container px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
              ✨ Powered by AI Technology
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transform Your Future with Expert-Led Learning
            </h1>
            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              Access world-class courses, learn from industry experts, and accelerate your career growth with
              our AI-powered Learning Management System.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href={user ? '/courses' : '/register'}>
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  {user ? 'Browse Courses' : 'Get Started Free'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-0 top-0 -z-10 h-full w-full">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-purple-400/10 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 h-64 w-64 rounded-full bg-pink-400/10 blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-background py-12">
        <div className="container px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary sm:text-4xl">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose EduMaster LMS?
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover what makes our platform the best choice for your learning journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 transition-all hover:border-primary hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Popular Categories
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore courses across diverse fields and industries
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Card key={index} className="cursor-pointer transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge className={category.color}>{category.count} courses</Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/courses">
              <Button size="lg" variant="outline">
                View All Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20 text-white">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Join thousands of learners worldwide and unlock your potential today
            </p>
            <Link href={user ? '/courses' : '/register'}>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                {user ? 'Browse Courses' : 'Create Free Account'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

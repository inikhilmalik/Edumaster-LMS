'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EduMaster LMS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link 
            href="/courses" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/courses' ? 'text-primary font-semibold' : 'text-muted-foreground'
            }`}
          >
            Courses
          </Link>
          {user && (
            <>
              <Link 
                href="/my-learning" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/my-learning' ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                My Learning
              </Link>
              {(user.role === 'instructor' || user.role === 'admin') && (
                <Link 
                  href="/instructor" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname?.startsWith('/instructor') ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  Instructor
                </Link>
              )}
            </>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-4 md:flex">
          {authLoading ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-learning">My Learning</Link>
                </DropdownMenuItem>
                {(user.role === 'instructor' || user.role === 'admin') && (
                  <DropdownMenuItem asChild>
                    <Link href="/instructor">Instructor Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container space-y-1 px-4 py-4">
            <Link
              href="/courses"
              className={`block rounded-md px-3 py-2 text-base font-medium hover:bg-accent ${
                pathname === '/courses' ? 'bg-accent text-primary font-semibold' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>
            {user && (
              <>
                <Link
                  href="/my-learning"
                  className={`block rounded-md px-3 py-2 text-base font-medium hover:bg-accent ${
                    pathname === '/my-learning' ? 'bg-accent text-primary font-semibold' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Learning
                </Link>
                {(user.role === 'instructor' || user.role === 'admin') && (
                  <Link
                    href="/instructor"
                    className={`block rounded-md px-3 py-2 text-base font-medium hover:bg-accent ${
                      pathname?.startsWith('/instructor') ? 'bg-accent text-primary font-semibold' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Instructor
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-accent"
                >
                  Logout
                </button>
              </>
            )}
            {!authLoading && !user && (
              <>
                <Link
                  href="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

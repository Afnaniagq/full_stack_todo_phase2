'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '../utils/auth';

export default function HomePage() {
  const router = useRouter();

  // Check if user is already authenticated and redirect to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">TodoApp</h1>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Master Your Day,</span>
              <span className="block text-indigo-600 mt-2">One Task at a Time</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
              The simplest way to organize your life. Track your tasks, categorize them, and recover what matters.
            </p>
            <div className="mt-10">
              <Link
                href="/login"
                className="inline-block bg-indigo-600 text-white px-8 py-3 border border-transparent text-base font-medium rounded-md hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Tracking Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg transform transition duration-500 hover:scale-105">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center">Task Tracking</h3>
                <div className="mt-2">
                  <p className="text-base text-gray-500 text-center">
                    Easily track your daily tasks and monitor progress toward your goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Categories Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg transform transition duration-500 hover:scale-105">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center">Categories</h3>
                <div className="mt-2">
                  <p className="text-base text-gray-500 text-center">
                    Organize your tasks into categories for better focus and productivity.
                  </p>
                </div>
              </div>
            </div>

            {/* Trash Recovery Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg transform transition duration-500 hover:scale-105">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center">Trash Recovery</h3>
                <div className="mt-2">
                  <p className="text-base text-gray-500 text-center">
                    Safely recover accidentally deleted tasks with our trash functionality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-base text-gray-400">&copy; 2026 TodoApp. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
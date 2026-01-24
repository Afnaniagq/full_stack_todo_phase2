import React from 'react';
import Head from 'next/head';
import DashboardComponent from '../components/Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Task Dashboard | Todo App</title>
        <meta name="description" content="Manage your tasks efficiently" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a href="/dashboard" className="text-blue-600 font-medium">Dashboard</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Profile</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Trash Bin</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Logout</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <DashboardComponent />
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Todo App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { isAuthenticated } from '../utils/auth';

interface DeletedTask {
  id: string;
  original_task_data: {
    id: string;
    title: string;
    description?: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  deleted_at: string;
  restorable_until: string;
}

export default function TrashPage() {
  const [deletedTasks, setDeletedTasks] = useState<DeletedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchDeletedTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/trash/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setDeletedTasks(response.data.items || []);
      } catch (err: any) {
        console.error('Error fetching deleted tasks:', err);
        if (err.response?.status === 401) {
          // Token might be expired, redirect to login
          localStorage.removeItem('auth_token');
          router.push('/login');
        } else {
          setError(err.response?.data?.detail || 'Failed to fetch deleted tasks');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedTasks();
  }, [router]);

  const handleRestore = async (taskId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/trash/${taskId}/restore/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Refresh the list
      setDeletedTasks(deletedTasks.filter(task => task.id !== taskId));
    } catch (err: any) {
      console.error('Error restoring task:', err);
      alert(err.response?.data?.detail || 'Failed to restore task');
    }
  };

  const handleDeletePermanently = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this task? This cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/trash/${taskId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Refresh the list
      setDeletedTasks(deletedTasks.filter(task => task.id !== taskId));
    } catch (err: any) {
      console.error('Error deleting task permanently:', err);
      alert(err.response?.data?.detail || 'Failed to delete task permanently');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Trash</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Tasks that have been deleted can be restored or permanently deleted here
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {deletedTasks.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No deleted tasks</h3>
                <p className="mt-1 text-sm text-gray-500">Tasks you delete will appear here until you restore or permanently delete them.</p>
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Task
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Deleted Date
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Expires
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {deletedTasks.map((task) => (
                      <tr key={task.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {task.original_task_data.title}
                          {task.original_task_data.description && (
                            <div className="text-gray-500 text-sm mt-1">{task.original_task_data.description}</div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(task.deleted_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(task.restorable_until).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleRestore(task.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => handleDeletePermanently(task.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete Permanently
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
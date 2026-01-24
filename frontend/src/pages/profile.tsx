'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile, updateUserProfile, logoutUser } from '../services/auth';
import { isAuthenticated } from '../utils/auth';

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        if (response.data) {
          setUser(response.data);
          setName(response.data.name);
          setEmail(response.data.email);
        } else {
          setError(response.error || 'Failed to load profile');
        }
      } catch (err) {
        setError('An error occurred while loading profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await updateUserProfile({ name, email });
      if (response.data) {
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setEditing(false);
        setMessage('Profile updated successfully!');
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Link href="/login" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your account settings</p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {message && (
              <div className="mb-4 rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">{message}</div>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                {editing ? (
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                ) : (
                  <div className="mt-1 text-sm text-gray-900">{name}</div>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                {editing ? (
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                ) : (
                  <div className="mt-1 text-sm text-gray-900">{email}</div>
                )}
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Account ID</label>
                <div className="mt-1 text-sm text-gray-900 font-mono">{user.id}</div>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      // Reset to original values
                      setName(user.name);
                      setEmail(user.email);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Profile
                </button>
              )}

              <button
                onClick={handleLogout}
                className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
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
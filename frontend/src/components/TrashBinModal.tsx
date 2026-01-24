import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Trash2 } from 'lucide-react';
import { taskApi } from '@/services/task_api';
import { Task } from '@/types/task';

interface TrashBinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrashBinModal: React.FC<TrashBinModalProps> = ({ isOpen, onClose }) => {
  const [trashItems, setTrashItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTrashItems();
    }
  }, [isOpen]);

  const fetchTrashItems = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getTrashItems();
      setTrashItems(response.trash_items);
      setError(null);
    } catch (err) {
      console.error('Error fetching trash items:', err);
      setError('Failed to load trash items. Please try again later.');
      setTrashItems([]);
    } finally {
      setLoading(false);
    }
  };

  const restoreItem = async (taskId: string) => {
    try {
      await taskApi.restoreFromTrash([taskId]);
      // Refresh the list
      fetchTrashItems();
    } catch (err) {
      console.error('Error restoring item:', err);
      alert('Failed to restore item. Please try again.');
    }
  };

  const deletePermanently = async (taskId: string) => {
    if (confirm('Are you sure you want to permanently delete this item? This action cannot be undone.')) {
      try {
        // Note: Our API currently doesn't have a permanent delete endpoint
        // We'll implement this as needed, but for now we'll just show a message
        alert('Permanent deletion is not yet implemented in this demo.');
      } catch (err) {
        console.error('Error with permanent deletion:', err);
        alert('Failed to permanently delete item. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Trash Bin</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading trash items...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : trashItems.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Trash is empty</h3>
              <p className="mt-1 text-sm text-gray-500">Items you delete will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trashItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 line-through">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-through">
                      Deleted: {new Date(item.deleted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => restoreItem(item.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Restore
                    </button>
                    <button
                      onClick={() => deletePermanently(item.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Permanently
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-6 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrashBinModal;
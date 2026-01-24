import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw, CheckSquare, Square } from 'lucide-react';
import BulkOperationService from '@/services/bulk_operation_service';

interface BulkOperationsBarProps {
  selectedTaskIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBulkOperationComplete: () => void;
  onCancelSelection: () => void;
}

const BulkOperationsBar: React.FC<BulkOperationsBarProps> = ({
  selectedTaskIds,
  onSelectionChange,
  onBulkOperationComplete,
  onCancelSelection
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [operationType, setOperationType] = useState<'delete' | 'complete' | 'incomplete' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBulkOperation = async () => {
    if (selectedTaskIds.length === 0) return;

    setIsLoading(true);

    try {
      if (operationType === 'delete') {
        await BulkOperationService.bulkDelete({
          task_ids: selectedTaskIds
        });
      } else if (operationType === 'complete' || operationType === 'incomplete') {
        await BulkOperationService.bulkUpdate({
          task_ids: selectedTaskIds,
          update_type: 'status',
          params: { status: operationType === 'complete' }
        });
      }

      onBulkOperationComplete();
      setShowConfirmDialog(false);
      setOperationType(null);
    } catch (error) {
      console.error('Bulk operation failed:', error);
      alert('Bulk operation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setOperationType('delete');
    setShowConfirmDialog(true);
  };

  const handleCompleteClick = () => {
    setOperationType('complete');
    setShowConfirmDialog(true);
  };

  const handleIncompleteClick = () => {
    setOperationType('incomplete');
    setShowConfirmDialog(true);
  };

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-300 ${
      selectedTaskIds.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
    }`}>
      <div className="flex items-center px-4 py-3 space-x-3">
        <span className="text-sm font-medium text-gray-700">
          {selectedTaskIds.length} selected
        </span>

        <button
          onClick={handleCompleteClick}
          disabled={isLoading}
          className="flex items-center px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          <CheckSquare className="w-4 h-4 mr-1" />
          Complete
        </button>

        <button
          onClick={handleIncompleteClick}
          disabled={isLoading}
          className="flex items-center px-3 py-1.5 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          <Square className="w-4 h-4 mr-1" />
          Incomplete
        </button>

        <button
          onClick={handleDeleteClick}
          disabled={isLoading}
          className="flex items-center px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </button>

        <button
          onClick={onCancelSelection}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && operationType && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="bg-white p-4 rounded-lg m-4 max-w-md w-full">
            <h3 className="font-semibold mb-2">Confirm Bulk Operation</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to {operationType === 'delete' ? 'delete' :
              operationType === 'complete' ? 'mark as complete' : 'mark as incomplete'}
              {selectedTaskIds.length} task(s)?
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setOperationType(null);
                }}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleBulkOperation}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkOperationsBar;
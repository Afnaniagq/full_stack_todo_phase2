import React, { useState } from 'react';
import { Task } from '../types/task';
import { taskApi } from '../services/task_api';

interface TaskCardProps {
  task: Task;
  onUpdate?: (updatedTask: Task) => void;
  onDelete?: (taskId: string) => void;
  isSelected?: boolean;
  onSelectionChange?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete, isSelected, onSelectionChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localTask, setLocalTask] = useState<Task>(task);

  const handleToggleCompletion = async () => {
    try {
      const updatedTask = await taskApi.toggleTaskCompletion(task.id);
      setLocalTask(updatedTask);
      onUpdate?.(updatedTask);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await taskApi.deleteTask(task.id);
      onDelete?.(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Determine the priority class for styling
  const getPriorityClass = () => {
    switch (task.priority) {
      case 'High':
        return 'border-l-red-500 bg-red-50';
      case 'Medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'Low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`border-l-4 p-4 rounded shadow-sm mb-2 ${getPriorityClass()} ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          {onSelectionChange && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectionChange(task.id)}
              className="mr-3 mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-label={`Select task: ${task.title}`}
            />
          )}
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>

            {task.description && (
              <p className={`mt-1 text-gray-600 ${task.is_completed ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              {task.category && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {task.category}
                </span>
              )}

              <span className={`px-2 py-1 rounded ${
                task.priority === 'High' ? 'bg-red-100 text-red-800' :
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>

              {task.due_date && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Due: {formatDate(task.due_date)}
                </span>
              )}
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Created: {formatDate(task.created_at)}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 ml-2">
          <button
            onClick={handleToggleCompletion}
            className={`p-2 rounded-full ${
              task.is_completed
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={task.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.is_completed ? '✓' : '○'}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`p-2 rounded-full ${
              isDeleting
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
            title="Delete task"
          >
            {isDeleting ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
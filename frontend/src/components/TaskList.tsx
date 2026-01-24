import React, { useEffect, useState } from 'react';
import { Task, TaskFilters } from '../types/task';
import TaskCard from './TaskCard';
import { taskApi } from '../services/task_api';

interface TaskListProps {
  userId?: string; // User ID if needed for filtering
  filters?: TaskFilters;
  onTaskUpdate?: (updatedTask: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  selectedTaskIds?: string[];
  onSelectionChange?: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ filters, onTaskUpdate, onTaskDelete, selectedTaskIds, onSelectionChange }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskApi.getTasks(filters);
        setTasks(response.tasks);
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
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
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isSelected={selectedTaskIds?.includes(task.id)}
          onSelectionChange={onSelectionChange}
          onUpdate={(updatedTask) => {
            setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            onTaskUpdate?.(updatedTask);
          }}
          onDelete={(deletedTaskId) => {
            setTasks(tasks.filter(t => t.id !== deletedTaskId));
            onTaskDelete?.(deletedTaskId);
          }}
        />
      ))}
    </div>
  );
};

export default TaskList;
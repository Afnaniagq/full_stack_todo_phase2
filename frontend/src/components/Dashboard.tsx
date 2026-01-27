import React, { useState, useEffect } from 'react';
import { TaskFilters } from '../types/task';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import BulkOperationsBar from './BulkOperationsBar';
import useBulkSelection from '../hooks/useBulkSelection';
import { taskApi } from '../services/task_api';

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  // Bulk selection functionality
  const {
    selectedIds,
    isSelected,
    toggleSelection,
    selectAll,
    deselectAll,
    toggleSelectAll,
    selectionCount
  } = useBulkSelection();

  // Load stats when filters change
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get all tasks to calculate stats
        const allTasksResponse = await taskApi.getTasks({});
        const allTasks = allTasksResponse.tasks;

        const completed = allTasks.filter(t => t.is_completed).length;
        const pending = allTasks.filter(t => !t.is_completed).length;

        setStats({
          total: allTasks.length,
          completed,
          pending
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  // Fetch all tasks for select-all functionality
  const [allTaskIds, setAllTaskIds] = useState<string[]>([]);
  useEffect(() => {
    const fetchAllTaskIds = async () => {
      try {
        const allTasksResponse = await taskApi.getTasks({});
        const ids = allTasksResponse.tasks.map(task => task.id);
        setAllTaskIds(ids);
      } catch (error) {
        console.error('Error fetching all task IDs:', error);
      }
    };

    fetchAllTaskIds();
  }, [filters]);

  const handleApplyFilters = () => {
    // Update filters state to trigger re-render of TaskList
    setFilters({
      priority: filters.priority || undefined,
      category: filters.category || undefined,
      is_completed: filters.is_completed !== undefined ? filters.is_completed : undefined
    });
  };

  const handleResetFilters = () => {
    setFilters({});
    // Reset form controls
    const prioritySelect = document.getElementById('filter-priority') as HTMLSelectElement;
    const categoryInput = document.getElementById('filter-category') as HTMLInputElement;
    const completedCheckbox = document.getElementById('filter-completed') as HTMLInputElement;

    if (prioritySelect) prioritySelect.value = '';
    if (categoryInput) categoryInput.value = '';
    if (completedCheckbox) completedCheckbox.checked = false;
  };

  const handleTaskUpdate = (updatedTask: any) => {
    // Refresh stats after task update
    setTimeout(() => {
      const loadStats = async () => {
        try {
          const allTasksResponse = await taskApi.getTasks({});
          const allTasks = allTasksResponse.tasks;

          const completed = allTasks.filter(t => t.is_completed).length;
          const pending = allTasks.filter(t => !t.is_completed).length;

          setStats({
            total: allTasks.length,
            completed,
            pending
          });
        } catch (error) {
          console.error('Error refreshing stats:', error);
        }
      };

      loadStats();
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Dashboard</h1>
        <p className="text-gray-600">Manage your tasks efficiently</p>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">Total Tasks</h2>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">Completed</h2>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending</h2>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {showForm ? 'Cancel' : 'Create Task'}
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="filter-priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="filter-priority"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue=""
                onChange={(e) => setFilters({...filters, priority: (e.target.value as 'Low' | 'Medium' | 'High') || undefined})}
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                id="filter-category"
                placeholder="Filter by category"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                onChange={(e) => setFilters({...filters, category: e.target.value || undefined})}
              />
            </div>

            <div>
              <label htmlFor="filter-completed" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="filter-completed"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue=""
                onChange={(e) => setFilters({
                  ...filters,
                  is_completed: e.target.value === "" ? undefined : e.target.value === "completed"
                })}
              >
                <option value="">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleApplyFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply
            </button>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Task Creation Form */}
      {showForm && (
        <div className="mb-8">
          <TaskForm onSubmit={() => { setShowForm(false); }} />
        </div>
      )}

      {/* Task List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectionCount > 0 && selectionCount === allTaskIds.length}
              onChange={() => toggleSelectAll(allTaskIds)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              aria-label="Select all tasks"
            />
            <span className="ml-2 text-sm text-gray-600">
              {selectionCount > 0 ? `${selectionCount} selected` : 'Select all'}
            </span>
          </div>
        </div>
        <TaskList
          filters={filters}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={() => {
            // Refresh stats after task deletion
            setTimeout(async () => {
              try {
                const allTasksResponse = await taskApi.getTasks({});
                const allTasks = allTasksResponse.tasks;

                const completed = allTasks.filter(t => t.is_completed).length;
                const pending = allTasks.filter(t => !t.is_completed).length;

                setStats({
                  total: allTasks.length,
                  completed,
                  pending
                });

                // Refresh all task IDs for select-all functionality
                const ids = allTasks.map(task => task.id);
                setAllTaskIds(ids);
              } catch (error) {
                console.error('Error refreshing stats:', error);
              }
            }, 100);
          }}
          selectedTaskIds={selectedIds}
          onSelectionChange={toggleSelection}
        />
      </div>

      {/* Bulk Operations Bar */}
      <BulkOperationsBar
        selectedTaskIds={selectedIds}
        onBulkOperationComplete={() => {
          // Refresh stats and task list after bulk operation
          setTimeout(async () => {
            try {
              const allTasksResponse = await taskApi.getTasks({});
              const allTasks = allTasksResponse.tasks;

              const completed = allTasks.filter(t => t.is_completed).length;
              const pending = allTasks.filter(t => !t.is_completed).length;

              setStats({
                total: allTasks.length,
                completed,
                pending
              });

              // Refresh all task IDs for select-all functionality
              const ids = allTasks.map(task => task.id);
              setAllTaskIds(ids);

              // Deselect all after operation
              deselectAll();
            } catch (error) {
              console.error('Error refreshing after bulk operation:', error);
            }
          }, 100);
        }}
        onCancelSelection={deselectAll}
      />
    </div>
  );
};

export default Dashboard;
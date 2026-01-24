export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High';
  category?: string;
  due_date?: string; // ISO date string
  is_completed: boolean;
  user_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at?: string; // ISO date string
  soft_deleted: boolean; // Flag for soft delete status
}

export interface TaskCreateData {
  title: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  category?: string;
  due_date?: string; // ISO date string
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  category?: string;
  due_date?: string; // ISO date string
  is_completed?: boolean;
}

export interface TaskFilters {
  priority?: 'Low' | 'Medium' | 'High';
  category?: string;
  is_completed?: boolean;
  limit?: number;
  offset?: number;
}

export interface TaskApiResponse {
  tasks: Task[];
  total: number;
  offset: number;
}

// Types for bulk operations
export interface BulkUpdateRequest {
  task_ids: string[];
  update_type: 'status' | 'category' | 'priority';
  params: {
    status?: boolean;
    category?: string;
    priority?: 'Low' | 'Medium' | 'High';
  };
}

export interface BulkDeleteRequest {
  task_ids: string[];
}

export interface BulkOperationResponse {
  success: boolean;
  updated_count?: number;
  deleted_count?: number;
  failed_count: number;
  errors?: Array<{
    task_id: string;
    error: string;
  }>;
}

// Types for trash functionality
export interface TrashItem {
  id: string;
  original_task_data: Task;
  task_id: string;
  user_id: string;
  deleted_at: string; // ISO date string
  scheduled_purge_at: string; // ISO date string
  is_restored: boolean;
}

export interface TrashApiResponse {
  trash_items: Task[]; // Using Task interface since soft-deleted tasks still follow the same structure
  total: number;
}

export interface TrashRestoreRequest {
  task_ids: string[];
}
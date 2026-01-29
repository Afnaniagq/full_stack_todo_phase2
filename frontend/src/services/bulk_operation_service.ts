import { apiClient } from './auth';

interface BulkUpdateParams {
  status?: boolean;
  category?: string;
  priority?: string;
}

interface BulkUpdateRequest {
  task_ids: string[];
  update_type: 'status' | 'category' | 'priority';
  params: BulkUpdateParams;
}

interface BulkDeleteRequest {
  task_ids: string[];
}

interface BulkOperationResponse {
  success: boolean;
  updated_count?: number;
  deleted_count?: number;
  failed_count: number;
  errors?: Array<{
    task_id: string;
    error: string;
  }>;
}

class BulkOperationService {
  /**
   * Perform bulk update operations on multiple tasks
   */
  static async bulkUpdate(request: BulkUpdateRequest): Promise<BulkOperationResponse> {
    try {
      const response = await apiClient.post('/tasks/bulk/update/', request);
      return response.data;
    } catch (error) {
      console.error('Bulk update error:', error);
      throw error;
    }
  }

  /**
   * Perform bulk delete operations on multiple tasks
   */
  static async bulkDelete(request: BulkDeleteRequest): Promise<BulkOperationResponse> {
    try {
      const response = await apiClient.post('/tasks/bulk/delete/', request);
      return response.data;
    } catch (error) {
      console.error('Bulk delete error:', error);
      throw error;
    }
  }
}

export default BulkOperationService;
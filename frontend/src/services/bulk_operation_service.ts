import { authClient } from '@/lib/auth';

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
      const response = await authClient.api('/api/tasks/bulk/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Bulk update failed: ${response.statusText}`);
      }

      return await response.json();
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
      const response = await authClient.api('/api/tasks/bulk/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Bulk delete failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Bulk delete error:', error);
      throw error;
    }
  }
}

export default BulkOperationService;
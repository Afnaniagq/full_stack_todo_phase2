# Data Model: Advanced User Workflows & System Resilience

## BulkOperation Entity

### Fields
- **id**: UUID (primary key) - Unique identifier for the bulk operation
- **operation_type**: Enum (MarkComplete, MarkIncomplete, ChangeCategory, ChangePriority) - Type of operation
- **task_ids**: Array[UUID] - List of task IDs affected by the operation
- **params**: JSON - Additional parameters for the operation (new category, new priority, etc.)
- **user_id**: UUID (foreign key) - Reference to the user initiating the operation
- **status**: Enum (Pending, Processing, Completed, Failed) - Current status of the bulk operation
- **created_at**: DateTime - Timestamp when operation was initiated
- **completed_at**: DateTime (optional) - Timestamp when operation was completed

### Relationships
- **User**: Many-to-One (BulkOperation belongs to one User)
  - BulkOperation.user_id → User.id

### Validation Rules
- Operation type must be one of the allowed values
- Task IDs array must contain valid UUIDs that belong to the user
- User ID must reference an existing user
- Status transitions follow specific patterns (Pending → Processing → Completed/Failed)
- Created_at is automatically managed by the system

## TrashBin Entity (Soft Delete Recovery)

### Fields
- **id**: UUID (primary key) - Unique identifier for the trash bin entry
- **original_task_data**: JSON - Serialized copy of the original task before deletion
- **task_id**: UUID - Original ID of the deleted task
- **user_id**: UUID (foreign key) - Reference to the user who owned the task
- **deleted_at**: DateTime - Timestamp when task was soft-deleted
- **scheduled_purge_at**: DateTime - Timestamp when task will be permanently purged
- **is_restored**: Boolean - Whether the task has been restored (default: false)

### Relationships
- **User**: Many-to-One (TrashBin belongs to one User)
  - TrashBin.user_id → User.id

### Validation Rules
- Original task data must be a valid serialized task object
- User ID must reference the same user who owned the original task
- Scheduled purge time is configurable (e.g., 30 days after deletion)
- Is_restored is set to true when task is recovered
- Created_at and deleted_at are automatically managed by the system

## Task Entity (Extended)

### Additional Fields for Advanced Workflows
- **selected_for_bulk**: Boolean (transient) - Whether task is selected for bulk operation (not stored in DB)

### Extended Validation Rules
- Existing validation rules continue to apply
- Bulk selection is limited to user's own tasks
- Bulk operations are validated against user permissions

## OptimisticUpdate Entity (Client-Side State)

### Fields (Client-side only, not stored in database)
- **id**: UUID - Unique identifier for the optimistic update
- **original_state**: JSON - Snapshot of the task state before the update
- **pending_state**: JSON - The state the task will have if the API call succeeds
- **operation_type**: String - Type of operation (e.g., "toggle", "update", "delete")
- **timestamp**: DateTime - When the optimistic update was initiated
- **rollback_fn**: Function (client-side) - Function to revert the update if API call fails

### Validation Rules
- Exists only in client-side state management
- Automatically cleaned up when API call completes
- Rollback function is executed if API call fails

## Bulk Operation Parameters

### For Category Change
- **new_category**: String - The new category to assign to selected tasks

### For Priority Change
- **new_priority**: Enum (Low, Medium, High) - The new priority level

### For Status Change
- **new_status**: Boolean - Whether tasks should be marked as complete (true) or incomplete (false)

## User Entity (Referenced from Previous Features)
- **id**: UUID (primary key) - Unique identifier for the user
- **email**: String (unique, indexed) - User's email address for authentication
- **name**: String - User's display name
- **created_at**: DateTime - Timestamp when user account was created
- **updated_at**: DateTime - Timestamp when user account was last updated
- **is_active**: Boolean - Whether the user account is active (default: true)

### Bulk Operation Constraints
- All bulk operations must be filtered by authenticated user's ID
- No user can perform bulk operations on tasks belonging to other users
- Cascade behaviors: When user is deleted, their tasks and trash bin entries are handled appropriately
- Foreign key constraints ensure referential integrity between operations and users
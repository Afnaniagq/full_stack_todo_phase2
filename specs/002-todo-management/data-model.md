# Data Model: Multi-User Todo Management System

## Task Entity

### Fields
- **id**: UUID (primary key) - Unique identifier for the task (UUID format for security)
- **title**: String (required, indexed) - Title of the task
- **description**: String (optional) - Detailed description of the task
- **priority**: Enum (Low/Medium/High) - Priority level of the task
- **category**: String (optional, indexed) - Category for organizing tasks
- **due_date**: DateTime (optional) - Deadline for the task
- **is_completed**: Boolean - Whether the task is completed (default: false)
- **user_id**: UUID (foreign key, indexed) - Reference to the owning user
- **created_at**: DateTime - Timestamp when task was created
- **updated_at**: DateTime - Timestamp when task was last updated
- **deleted_at**: DateTime (optional) - Timestamp when task was soft-deleted

### Relationships
- **User**: Many-to-One (Task belongs to one User)
  - Task.user_id → User.id

### Validation Rules
- Title must be provided and not exceed 255 characters
- Priority must be one of: Low, Medium, High
- Category must not exceed 100 characters if provided
- Due date must be a valid future date if provided
- User ID must reference an existing user
- Created_at and updated_at are automatically managed by the system
- Task ID is automatically generated as UUID

### State Transitions
- Pending ↔ Completed: Tasks can be toggled between pending and completed states
- Active ↔ Deleted: Tasks can be soft-deleted (moved to trash) but not permanently removed

## Category Entity

### Fields
- **id**: UUID (primary key) - Unique identifier for the category
- **name**: String (required, unique, indexed) - Name of the category
- **color**: String (optional) - Color code for UI representation
- **user_id**: UUID (foreign key, indexed) - Reference to the owning user
- **created_at**: DateTime - Timestamp when category was created
- **updated_at**: DateTime - Timestamp when category was last updated

### Relationships
- **User**: Many-to-One (Category belongs to one User)
  - Category.user_id → User.id
- **Tasks**: One-to-Many (Category can have many Tasks)
  - Category.id → Task.category_id (if we implement this relationship)

### Validation Rules
- Name must be provided and unique per user
- Name must not exceed 50 characters
- Color must be a valid hex color code if provided
- User ID must reference an existing user

## Priority Enum Values
- **Low**: Lower priority tasks
- **Medium**: Normal priority tasks
- **High**: Higher priority tasks

## User Entity (Referenced from Spec-001)
- **id**: UUID (primary key) - Unique identifier for the user
- **email**: String (unique, indexed) - User's email address for authentication
- **name**: String - User's display name
- **created_at**: DateTime - Timestamp when user account was created
- **updated_at**: DateTime - Timestamp when user account was last updated
- **is_active**: Boolean - Whether the user account is active (default: true)

### Task-User Relationship Constraints
- All task operations must be filtered by authenticated user's ID
- No user can access, modify, or delete tasks belonging to other users
- Cascade behaviors: When user is deleted, their tasks are soft-deleted
- Foreign key constraints ensure referential integrity between tasks and users
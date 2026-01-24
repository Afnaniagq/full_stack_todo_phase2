# Data Model: Full-Stack Authentication and UI Bridge

## Authentication Token Entity

### Attributes
- **token_value**: String (JWT token string)
- **user_id**: UUID/String (reference to user)
- **expires_at**: DateTime (expiration timestamp)
- **created_at**: DateTime (issue timestamp)
- **is_active**: Boolean (validity status)

### Relationships
- Belongs to: User (one-to-many with users table)
- Purpose: Authenticate user sessions

### Validation Rules
- token_value: Required, properly formatted JWT
- expires_at: Must be in the future
- is_active: Cannot be used if false

## User Session Entity

### Attributes
- **user_id**: UUID/String (reference to user)
- **last_login**: DateTime (timestamp of last authentication)
- **ip_address**: String (optional, for security tracking)
- **user_agent**: String (optional, for security tracking)
- **is_authenticated**: Boolean (current authentication status)

### Relationships
- Belongs to: User (one-to-one relationship)
- Purpose: Track authentication state

## Deleted Task Entity

### Attributes
- **original_task_id**: UUID/String (reference to original task)
- **task_data**: JSON/Object (serialized original task data)
- **deleted_by_user_id**: UUID/String (who deleted the task)
- **deleted_at**: DateTime (timestamp of deletion)
- **restorable_until**: DateTime (expiration for restoration)

### Relationships
- Belongs to: User (who owned the original task)
- Purpose: Temporary storage for tasks that can be restored

### State Transitions
- Active Task → Deleted Task (via soft delete)
- Deleted Task → Active Task (via restore)
- Deleted Task → Permanently Deleted (via hard delete after retention period)

## Integration with Existing User Model

The authentication system will integrate with the existing User model by:
1. Using the existing user_id for authentication
2. Adding authentication-specific validation where needed
3. Ensuring JWT payloads contain user identity information
4. Maintaining strict user isolation through user_id verification

## Security Considerations

- JWT tokens will be signed with HS256 algorithm
- Token expiration times will be configurable
- Refresh token mechanisms will be considered for extended sessions
- Password hashing will leverage existing Better Auth mechanisms
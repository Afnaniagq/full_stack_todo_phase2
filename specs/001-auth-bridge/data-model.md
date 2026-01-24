# Data Model: Foundation: Infrastructure & Authentication Bridge

## User Entity

### Fields
- **id**: UUID (primary key) - Unique identifier for the user (UUID format for security)
- **email**: String (unique, indexed) - User's email address for authentication
- **name**: String - User's display name
- **created_at**: DateTime - Timestamp when user account was created
- **updated_at**: DateTime - Timestamp when user account was last updated
- **is_active**: Boolean - Whether the user account is active (default: true)

### Relationships
- No direct relationships defined in this initial schema (future task for user permissions)

### Validation Rules
- Email must be a valid email format
- Email must be unique across all users
- Name must not exceed 255 characters
- Created_at and updated_at are automatically managed by the system
- User ID is automatically generated as UUID

### State Transitions
- Active/Inactive: User accounts can be deactivated but not deleted (soft deletion)

## Authentication Token Structure

### JWT Claims (used by both frontend and backend)
- **sub**: Subject (user ID) - UUID of the authenticated user
- **exp**: Expiration - Unix timestamp when token expires
- **iat**: Issued At - Unix timestamp when token was issued
- **jti**: JWT ID - Unique identifier for the token (optional, for advanced scenarios)

### Token Validation Requirements
- Both frontend (Better Auth) and backend (PyJWT) must recognize the same claims
- Token expiration must be validated on both sides
- Signature verification must use the shared `BETTER_AUTH_SECRET`

## Environment Configuration Schema

### Shared Variables
- **BETTER_AUTH_SECRET**: String - Shared secret for JWT signing/verification
- **DATABASE_URL**: String - Neon PostgreSQL connection string with sslmode=require
- **NEXT_PUBLIC_BETTER_AUTH_URL**: String - Base URL for Better Auth (frontend)
- **AUTH_API_BASE_URL**: String - Base URL for authentication API (backend)

### Security Requirements
- Secrets must not be exposed to client-side code (except public URLs)
- Database URL must include SSL parameters
- All sensitive configuration must come from environment variables
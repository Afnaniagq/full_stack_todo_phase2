# Multi-User Todo Full-Stack Web Application (Phase II)

This is a full-stack todo application with authentication bridge between Next.js frontend and FastAPI backend services.

## Features

- **Authentication Bridge**: JWT cross-verification between frontend and backend
- **Secure Database**: Neon PostgreSQL with SSL enforcement
- **Environment Synchronization**: Shared configuration between services
- **Health Monitoring**: Comprehensive health check endpoints
- **User Isolation**: Strict data separation between users
- **Task Management**: Multi-user todo management system with priorities, categories, and due dates
- **Responsive Dashboard**: Mobile and desktop-friendly task management interface

## Tech Stack

- **Frontend**: Next.js 16+ (App Router)
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth + PyJWT
- **Spec-Driven**: Claude Code + Spec-Kit Plus

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.11+
- Access to Neon PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Set up the backend:
```bash
cd backend
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Configure environment variables:
```bash
cp .env.example .env  # if you have an example file
# Or edit the existing .env file to match your configuration
```

### Environment Variables

The following environment variables must be configured in the root `.env` file:

- `BETTER_AUTH_SECRET`: Secret key for JWT signing/verification (use a strong, random value)
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Base URL for Better Auth (frontend)
- `AUTH_API_BASE_URL`: Base URL for authentication API (backend)
- `DATABASE_URL`: Neon PostgreSQL connection string with `sslmode=require`

## API Documentation

### Health Check Endpoints

- `GET /api/health` - Basic health check
- `GET /api/health/auth` - Authentication configuration check
- `GET /api/health/database` - Database connectivity and SSL check (returns 200 only when both DB connectivity and SSL are active)
- `GET /api/health/full` - Full system health check

### Configuration Endpoints

- `GET /api/config/secret-status` - Check authentication secret configuration

### Task Management Endpoints

- `GET /api/tasks` - List user's tasks with optional filters (priority, category, is_completed)
- `POST /api/tasks` - Create a new task (requires title, optional: description, priority, category, due_date)
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a specific task
- `PATCH /api/tasks/{id}/toggle` - Toggle task completion status
- `DELETE /api/tasks/{id}` - Delete a task (soft delete)

#### Task Request Body Examples:

```json
{
  "title": "Sample Task",
  "description": "Task description",
  "priority": "Medium",
  "category": "Work",
  "due_date": "2023-12-31T23:59:59Z",
  "is_completed": false
}
```

#### Query Parameters for GET /api/tasks:
- `priority`: Low, Medium, or High
- `category`: Category name to filter by
- `is_completed`: true or false
- `limit`: Number of tasks to return (default: 20)
- `offset`: Number of tasks to skip (default: 0)

## Running the Application

### Backend

```bash
cd backend
uvicorn src.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm run dev
```

## Architecture

### Monorepo Structure

```
├── backend/
│   ├── src/
│   │   ├── models/      # SQLModel definitions
│   │   ├── services/    # Business logic
│   │   └── api/         # API routes
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Next.js pages
│   │   ├── services/    # API services
│   │   └── types/       # TypeScript types
│   ├── tests/
│   └── package.json
├── .env                 # Shared environment variables
└── specs/               # Feature specifications
```

### Authentication Flow

1. User authenticates on the frontend using Better Auth
2. Frontend generates JWT token with shared secret
3. Backend verifies JWT token using PyJWT with same shared secret
4. Token claims ('sub', 'exp') are validated on both sides

## Security Features

- SSL enforcement for all database connections
- Strict user isolation (no cross-user data access)
- Stateless authentication with JWT tokens
- Environment variable validation
- Input validation and sanitization
- Soft deletes for data integrity
- Foreign key constraints for referential integrity

## Testing

### Backend Tests

Run backend tests:
```bash
cd backend
pytest tests/
```

Integration tests for JWT cross-verification:
```bash
cd backend
pytest tests/integration/test_jwt_cross_verification.py
```

## Deployment

1. Ensure all environment variables are properly configured
2. Set `DEBUG=False` in production
3. Use a strong, unique `BETTER_AUTH_SECRET`
4. Ensure SSL is enforced for database connections

## Health Checks

The application provides several health check endpoints:
- Basic health: `/api/health`
- Authentication: `/api/health/auth`
- Database: `/api/health/database` (returns 200 only when both DB connectivity and SSL are active)
- Full system: `/api/health/full`

## Troubleshooting

### Common Issues

1. **500 Internal Server Error**: Check that `BETTER_AUTH_SECRET` and `DATABASE_URL` are properly configured in `.env`
2. **Database Connection Issues**: Ensure `sslmode=require` is set in the database URL
3. **JWT Verification Failure**: Verify that both frontend and backend use the same `BETTER_AUTH_SECRET`
4. **Task Access Issues**: Ensure JWT tokens are properly included in API requests

### Logs

Authentication events are logged to `auth_events.log` in the backend directory.

## Development

This project follows a spec-driven development approach using Claude Code and Spec-Kit Plus. Feature specifications are stored in the `specs/` directory.

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Follow the security best practices outlined in the constitution

## License

[Specify license here]
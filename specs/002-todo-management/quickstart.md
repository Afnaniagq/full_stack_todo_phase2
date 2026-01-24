# Quickstart Guide: Multi-User Todo Management System

## Prerequisites
- Node.js 18+ for frontend development
- Python 3.11+ for backend development
- Access to Neon PostgreSQL database (with SSL)
- Working authentication bridge from Spec-001
- Git for version control

## Setup Instructions

### 1. Clone and Initialize Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup (FastAPI)
Navigate to the backend directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Ensure the authentication bridge from Spec-001 is properly configured with valid JWT secret and database connection.

### 3. Frontend Setup (Next.js)
Navigate to the frontend directory and install dependencies:

```bash
cd frontend  # or return to root and use appropriate path
npm install
```

Ensure the frontend is configured to use the authentication bridge from Spec-001.

## Key Features

### Task Management
- Create tasks with title, description, priority, category, and due date
- View and filter tasks by priority and category
- Toggle tasks between complete/incomplete states
- Edit and delete existing tasks

### User Isolation
- Users can only access their own tasks
- JWT tokens verify user identity on all task endpoints
- Database queries are filtered by authenticated user ID

### Responsive Dashboard
- Mobile and desktop responsive task management interface
- Filter tasks by priority and category
- Visual indicators for task completion status

## API Endpoints

### Task Endpoints
```
GET    /api/tasks          # List user's tasks with optional filters
POST   /api/tasks          # Create a new task
GET    /api/tasks/{id}     # Get a specific task
PUT    /api/tasks/{id}     # Update a specific task
PATCH  /api/tasks/{id}/toggle  # Toggle task completion status
DELETE /api/tasks/{id}     # Delete a specific task
```

### Expected Request Bodies
```
POST /api/tasks:
{
  "title": "Task title",
  "description": "Task description",
  "priority": "Low|Medium|High",
  "category": "Work|Personal|Shopping",
  "due_date": "2023-12-31T23:59:59Z",
  "is_completed": false
}

PUT /api/tasks/{id}:
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "High",
  "category": "Work",
  "due_date": "2023-12-31T23:59:59Z",
  "is_completed": true
}
```

## Testing the System

### Integration Tests
Run the integration tests to verify user isolation:
```bash
# From backend directory
pytest tests/integration/test_user_isolation.py
```

### Priority and Category Validation Tests
Run validation tests:
```bash
# From backend directory
pytest tests/unit/test_task_validation.py
```

### Performance Tests
Run performance checks under task-heavy loads:
```bash
# From backend directory
pytest tests/performance/test_neon_performance.py
```

## Development Workflow

### Backend Development
1. Start the backend server:
```bash
cd backend
uvicorn src.main:app --reload --port 8000
```

2. The task endpoints will be available at http://localhost:8000/api/tasks

### Frontend Development
1. Start the frontend server:
```bash
cd frontend
npm run dev
```

2. The dashboard will be available at http://localhost:3000/dashboard
# Quickstart Guide: Foundation: Infrastructure & Authentication Bridge

## Prerequisites
- Node.js 18+ for frontend development
- Python 3.11+ for backend development
- Access to Neon PostgreSQL database
- Git for version control

## Setup Instructions

### 1. Clone and Initialize Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Authentication
BETTER_AUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000/api/auth"
AUTH_API_BASE_URL="http://localhost:8000"

# Database
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
```

**Important**: The `BETTER_AUTH_SECRET` must be identical for both frontend and backend services.

### 3. Backend Setup (FastAPI)
Navigate to the backend directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Initialize the database:
```bash
# This will create User tables with proper schema
python -m src.main init_db
```

Start the backend:
```bash
uvicorn src.main:app --reload --port 8000
```

### 4. Frontend Setup (Next.js)
Navigate to the frontend directory and install dependencies:

```bash
cd frontend  # or return to root and use appropriate path
npm install
```

Start the frontend:
```bash
npm run dev
```

## Key Features

### JWT Cross-Verification
- Frontend generates JWT tokens using Better Auth
- Backend verifies tokens using PyJWT with the same shared secret
- Both services validate the same token claims ('sub', 'exp')

### Database Connectivity
- SSL-enforced connections to Neon PostgreSQL
- SQLModel manages User table creation and schema
- Health check endpoint validates DB connectivity

### Health Check
Access the health check endpoint to verify system status:
```
GET http://localhost:8000/api/health
```

Returns 200 OK only when database connectivity and SSL are active.

## Testing the Authentication Bridge

### Manual Verification
1. Authenticate a user on the frontend
2. Extract the JWT token from the frontend
3. Verify the token can be validated by the backend using the shared secret

### Automated Tests
Run the cross-service verification script:
```bash
# From root directory
python scripts/verify_jwt_handshake.py
```

This script will:
- Generate a test JWT using Better Auth patterns
- Attempt to verify it with PyJWT
- Confirm that token claims match expected structure
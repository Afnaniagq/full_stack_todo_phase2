# Quickstart Guide: Full-Stack Authentication and UI Bridge

## Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.11+
- PostgreSQL (or Neon Serverless PostgreSQL)
- Better Auth configured

## Setup Instructions

### 1. Backend Setup
1. Install Python dependencies:
   ```bash
   pip install fastapi sqlmodel pydantic python-multipart python-jose[cryptography] passlib[bcrypt] python-dotenv
   ```

2. Configure environment variables in `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost/dbname
   JWT_SECRET_KEY=your-super-secret-jwt-key
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
   BETTER_AUTH_SECRET=your-better-auth-secret
   ```

3. Create the auth API module at `backend/src/api/auth.py` with JWT registration and login endpoints

4. Register the auth routes in `backend/src/api/main.py`

### 2. Frontend Setup
1. Install frontend dependencies:
   ```bash
   npm install axios react-icons
   ```

2. Create the following pages:
   - `frontend/src/pages/index.tsx` - Landing page with headline and feature cards
   - `frontend/src/pages/login.tsx` - Login form with JWT handling
   - `frontend/src/pages/profile.tsx` - Profile management with logout
   - `frontend/src/pages/trash.tsx` - Trash management with restore/delete

### 3. Authentication Flow
1. User registers/logs in via JWT endpoints
2. JWT token received is stored in localStorage as 'auth_token'
3. Token is attached to all authenticated API requests as 'Authorization: Bearer <token>'
4. User is redirected to dashboard after successful authentication

### 4. Key Features
- Landing page with "Master Your Day, One Task at a Time" headline
- 3-card feature grid showing Tracking, Categories, Trash Recovery
- Secure JWT-based authentication
- Trash functionality with restore/delete options
- Responsive design using Tailwind CSS

## Running the Application
1. Start the backend: `uvicorn backend.src.api.main:app --reload`
2. Start the frontend: `npm run dev`
3. Access the application at `http://localhost:3000`

## Testing
- Verify registration and login work with JWT tokens
- Check that protected routes require authentication
- Test that profile and trash pages work as expected
- Ensure dashboard functionality remains unchanged
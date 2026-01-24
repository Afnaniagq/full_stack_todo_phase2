---
name: api-engineering-fastapi
description: Design, build, and maintain high-performance APIs using FastAPI with modern Python standards.
---

# API Engineering (FastAPI)

## Instructions

1. **API structure**
   - Organize routes by feature/module
   - Use FastAPI routers for scalability
   - Apply clear URL and versioning conventions

2. **Request & response modeling**
   - Define schemas with Pydantic models
   - Validate input data automatically
   - Return consistent, typed responses

3. **Performance & async**
   - Use async endpoints for I/O-bound tasks
   - Leverage dependency injection
   - Optimize database and external service calls

4. **Security & reliability**
   - Implement authentication and authorization
   - Handle errors with standardized responses
   - Add rate limiting and logging

## Best Practices
- Keep endpoints small and single-purpose
- Use OpenAPI docs as a contract
- Validate everything at the boundary
- Return proper HTTP status codes
- Version APIs from day one
- Write tests for critical endpoints

## Example Structure
```python
from fastapi import FastAPI, APIRouter
from pydantic import BaseModel

app = FastAPI()
router = APIRouter(prefix="/users", tags=["users"])

class UserCreate(BaseModel):
    email: str
    password: str

@router.post("/", status_code=201)
async def create_user(user: UserCreate):
    return {"id": 1, "email": user.email}

app.include_router(router)

"""
JWT dependency functions for API routes with enhanced logging
"""
from fastapi import Depends, HTTPException, status, Request
from typing import Dict, Any
from src.services.auth import verify_jwt_token, validate_token_claims
import logging

# Create a FastAPI router for dependencies
from fastapi import APIRouter
router = APIRouter()

# Set up logging
logger = logging.getLogger(__name__)

def get_current_user(request: Request) -> Dict[str, Any]:
    """
    Dependency to get current user from JWT token in Authorization header
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid format"
        )

    token = auth_header.split(" ")[1]

    # Log the request for monitoring
    logger.info(f"Processing request for user with token: {token[:10]}..." if token else "No token")

    # Verify the token
    payload = verify_jwt_token(token)
    if not payload:
        logger.warning(f"Invalid or expired token for request: {request.method} {request.url}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    # Validate the token claims
    if not validate_token_claims(payload):
        logger.warning(f"Token missing required claims for user: {payload.get('sub', 'unknown')}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing required claims"
        )

    # Log successful authentication
    user_id = payload.get('sub')
    logger.info(f"Successful JWT validation for user: {user_id}")

    return payload

def require_jwt_token(request: Request) -> Dict[str, Any]:
    """
    Dependency to require a valid JWT token for protected endpoints
    """
    return get_current_user(request)

# Alternative dependency that returns user info
async def get_current_user_id(request: Request) -> str:
    """
    Dependency to get current user ID from JWT token
    """
    payload = get_current_user(request)
    user_id = payload.get('sub')

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID not found in token"
        )

    return user_id

def log_bulk_operation(user_id: str, operation_type: str, affected_count: int):
    """
    Log bulk operations for monitoring and audit purposes
    """
    logger.info(f"BULK OPERATION: User {user_id} performed {operation_type} on {affected_count} items")
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from sqlmodel import Session, select

from .models.user import User
from .services.auth import verify_jwt_token, extract_user_id_from_token
from .database import get_session

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    """
    Get current user from JWT token
    """
    token = credentials.credentials

    # Verify the token
    payload = verify_jwt_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract user ID from token
    user_id = extract_user_id_from_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user from database
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    session: Session = Depends(get_session)
) -> Optional[User]:
    """
    Get current user from JWT token, but don't require authentication
    """
    if not credentials:
        return None

    token = credentials.credentials

    # Verify the token
    payload = verify_jwt_token(token)
    if not payload:
        return None

    # Extract user ID from token
    user_id = extract_user_id_from_token(token)
    if not user_id:
        return None

    # Get user from database
    user = session.exec(select(User).where(User.id == user_id)).first()
    return user
from fastapi import APIRouter, Depends, HTTPException, status, Body
from datetime import timedelta
from typing import Dict, Any, Optional
from sqlmodel import Session, select
from pydantic import BaseModel, EmailStr

from ..models.user import User
from ..services.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    verify_token,
    verify_jwt_token,
    extract_user_id_from_token
)
from ..database import get_session
from .deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

# Pydantic models for request/response
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: str
    email: str
    name: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class LogoutResponse(BaseModel):
    message: str

@router.post("/register/", response_model=TokenResponse)
def register(user_data: UserCreate = Body(...), session: Session = Depends(get_session)):
    """
    Register a new user with email, password, and name
    """
    try:
        # Check if user already exists
        existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        # Hash the password
        hashed_password = get_password_hash(user_data.password)

        # Create new user
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            name=user_data.name
        )
        session.add(db_user)
        session.commit()
        session.refresh(db_user)

        # Create access token
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": str(db_user.id), "email": db_user.email},
            expires_delta=access_token_expires
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(db_user.id),
                "email": db_user.email,
                "name": db_user.name
            }
        }
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Error during registration: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration"
        )

@router.post("/login/", response_model=LoginResponse)
def login(user_credentials: UserLogin = Body(...), session: Session = Depends(get_session)):
    """
    Authenticate user and return JWT token
    """
    try:
        # Find user by email
        user = session.exec(select(User).where(User.email == user_credentials.email)).first()
        if not user or not verify_password(user_credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect email or password"
            )

        # Create access token
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=access_token_expires
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse(
                id=str(user.id),
                email=user.email,
                name=user.name
            )
        }
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )

@router.get("/profile/", response_model=UserResponse)
def get_profile(current_user: Any = Depends(get_current_user)):
    """
    Get current user's profile information
    """
    # 1. Extract values with safety defaults (empty strings) to satisfy Pydantic
    if isinstance(current_user, dict):
        user_id = current_user.get("id") or current_user.get("sub")
        user_email = current_user.get("email") or ""
        user_name = current_user.get("name") or "User"  # Fallback to "User" if None
    else:
        user_id = getattr(current_user, "id", None)
        user_email = getattr(current_user, "email", "")
        user_name = getattr(current_user, "name", "User")

    # 2. Final check: if user_id is still None, something is wrong with the token
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user information in token"
        )

    return UserResponse(
        id=str(user_id),
        email=user_email or "no-email@provided.com",
        name=user_name or "Anonymous"
    )


@router.put("/profile/", response_model=UserResponse)
def update_profile(
    user_update: UserUpdate,
    current_user: Any = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update current user's profile information
    """
    try:
        # 1. Get the actual User object from DB (since current_user might just be a token dict)
        u_id = current_user.get("id") if isinstance(current_user, dict) else current_user.id
        db_user = session.get(User, u_id)
        
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        # 2. Update fields
        if user_update.name is not None:
            db_user.name = user_update.name
        if user_update.email is not None:
            # Check for email conflict
            existing_user = session.exec(
                select(User).where(User.email == user_update.email)
            ).first()
            if existing_user and existing_user.id != db_user.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use"
                )
            db_user.email = user_update.email

        session.add(db_user)
        session.commit()
        session.refresh(db_user)

        return UserResponse(
            id=str(db_user.id),
            email=db_user.email,
            name=db_user.name
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error during profile update: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )

@router.post("/logout/")
def logout():
    """
    Logout user (client-side token clearing is sufficient)
    """
    return {"message": "Successfully logged out"}

# Additional endpoint for token validation (optional)
@router.post("/validate-token/")
def validate_token(token: Dict[str, str] = Body(...)):
    """
    Validate if a token is still valid
    """
    token_str = token.get("token")
    if not token_str:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token is required"
        )

    payload = verify_token(token_str)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    return {"valid": True, "user_id": payload.get("sub")}
import jwt
import os
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from dotenv import load_dotenv
from fastapi import HTTPException, status
from passlib.context import CryptContext

# Load environment variables
load_dotenv()

# Configuration
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-fallback-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Token Creation
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Token Verification
def verify_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def validate_token_claims(payload: Dict[str, Any]) -> bool:
    return "sub" in payload and "exp" in payload

def extract_user_id_from_token(token: str) -> Optional[str]:
    payload = verify_jwt_token(token)
    return payload.get("sub") if payload else None

verify_token = verify_jwt_token
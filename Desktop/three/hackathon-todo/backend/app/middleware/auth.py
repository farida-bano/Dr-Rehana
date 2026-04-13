from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlmodel import Session
from .database import get_session
from .models import User
import os
from typing import Optional

# Secret key for JWT (should come from environment)
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

security = HTTPBearer()

def verify_token(token: str, session: Session) -> User:
    """Verify JWT token and return user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = session.get(User, username)
    if user is None:
        raise credentials_exception
    return user

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    """Get current user from JWT token"""
    token = credentials.credentials
    user = verify_token(token, session)
    return user
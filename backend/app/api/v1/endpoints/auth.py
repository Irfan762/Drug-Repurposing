from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings

from app.schemas.schemas import Token

router = APIRouter()

# Mock security utils in this file for simplicity as we didn't create app/core/security.py yet
# But usually it's there. I'll define creating token here or create security.py.
from jose import jwt
from datetime import datetime, timezone

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=Token)
async def login_access_token(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    # Prototype: accept any credentials, return mock user
    # In production: verify user in DB
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # Mocking role based on username for demo
    role = "admin" if form_data.username == "admin" else "researcher"
    
    access_token = create_access_token(
        data={"sub": form_data.username, "role": role}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": "mock_refresh_token"
    }

@router.post("/refresh", response_model=Token)
async def refresh_token(token: str) -> Any:
    return {
        "access_token": "new_mock_token",
        "token_type": "bearer",
        "refresh_token": "new_mock_refresh_token"
    }

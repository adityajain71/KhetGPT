from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.api.endpoints.auth import get_current_active_user, fake_users_db
from app.schemas.user import User, UserInDB

router = APIRouter()


@router.get("/me", response_model=User)
async def read_users_me(current_user = Depends(get_current_active_user)):
    """
    Get current authenticated user
    """
    return current_user


@router.get("/{user_id}", response_model=User)
async def read_user(user_id: str, current_user = Depends(get_current_active_user)):
    """
    Get a specific user by ID
    """
    for email, user_data in fake_users_db.items():
        if user_data["id"] == user_id:
            return user_data
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )
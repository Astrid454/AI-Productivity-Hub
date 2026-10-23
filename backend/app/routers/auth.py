from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin, TokenResponse
from app.security.jwt import create_access_token
from app.services import auth_service

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@router.post("/register",response_model=UserResponse, status_code=201)
def register(
        user_data: UserCreate,
        db: Session = Depends(get_db),
):
    try:
        return auth_service.register_user(user_data, db)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e


@router.post("/login", response_model=TokenResponse)
def login(
        credentials: UserLogin,
        db: Session = Depends(get_db)
):
    user = auth_service.authenticate_user(credentials, db)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(user.id)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
    )

from app.database.models import User
from app.security.dependencies import get_current_user


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user
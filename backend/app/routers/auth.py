from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin, TokenResponse
from app.security.jwt import create_access_token
from app.services import auth_service
from app.services.refresh_session_service import create_refresh_session
from app.services.refresh_session_service import (
    rotate_refresh_token,
    get_valid_refresh_session,
    InvalidRefreshTokenError,
    revoke_refresh_session,
    RevocationReason
)

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
        response: Response,
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

    refresh_token = create_refresh_session(
        db=db,
        user_id=user.id
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/auth"
    )

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


@router.post("/refresh", response_model=TokenResponse)
def refresh_access_token(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    if refresh_token is None:
        raise HTTPException(
            status_code=401,
            detail="Missing refresh token"
        )

    try:
        new_refresh_token = rotate_refresh_token(db, refresh_token)
    except InvalidRefreshTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token"
        )

    new_session = get_valid_refresh_session(db, new_refresh_token)

    if new_session is None:
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve new refresh session"
        )

    access_token = create_access_token(new_session.user_id)

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/auth"
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer"
    )


@router.post("/logout", status_code=204)
def logout(
    response: Response,
    refresh_token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    if refresh_token is not None:
        session = get_valid_refresh_session(db, refresh_token)

        if session is not None:
            revoke_refresh_session(
                db,
                session,
                RevocationReason.LOGOUT
            )

    response.delete_cookie(
        key="refresh_token",
        path="/auth",
        samesite="lax"
    )
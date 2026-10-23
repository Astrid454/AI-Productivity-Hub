from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database.models import User
from app.schemas.user import UserCreate, UserLogin
from app.security.password import hash_password, verify_password


def register_user(user_data: UserCreate, db: Session):
    statement = select(User).where(User.email == user_data.email)
    existing_user = db.scalar(statement)

    if existing_user is not None:
        raise ValueError("Email is already registered")

    new_user = User(
        email = user_data.email,
        password_hash = hash_password(user_data.password)
    )

    db.add(new_user)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError("Email is already registered")

    db.refresh(new_user)

    return new_user

def authenticate_user(credentials: UserLogin, db: Session):
    statement = select(User).where(User.email == credentials.email)
    user = db.scalar(statement)

    if user is None:
        return None

    if not verify_password(credentials.password, user.password_hash):
        return None

    return user
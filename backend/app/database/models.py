from datetime import datetime
from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(500))
    priority: Mapped[str] = mapped_column(String(20))
    status: Mapped[str] = mapped_column(String(20), default = "pending")
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable = False
    )

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(255),
        unique = True,
        index = True
    )
    password_hash: Mapped[str] = mapped_column(String(255))

class RefreshSession(Base):
    __tablename__ = "refresh_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable = False,
        index = True
    )

    token_hash: Mapped[str] = mapped_column(
        String(64),
        unique = True,
        nullable = False,
        index = True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable = False
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    revoked_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    family_id: Mapped[str] = mapped_column(
        String(36),
        nullable=False,
        index=True
    )

    revocation_reason: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True
    )
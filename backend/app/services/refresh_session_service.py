from datetime import datetime, timedelta, timezone
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from uuid import uuid4
from enum import StrEnum

from app.database.models import RefreshSession, User
from app.security.refresh_token import (
    generate_refresh_token,
    hash_refresh_token,
)

REFRESH_TOKEN_EXPIRE_DAYS = 7

class RevocationReason(StrEnum):
    LOGOUT = "logout"
    ROTATION = "rotation"
    COMPROMISED = "compromised"

def prepare_refresh_session(
    db: Session,
    user_id: int,
    family_id: str | None = None
) -> str:
    refresh_token = generate_refresh_token()
    now = datetime.now(timezone.utc)

    if family_id is None:
        family_id = str(uuid4())

    refresh_session = RefreshSession(
        user_id=user_id,
        token_hash=hash_refresh_token(refresh_token),
        family_id=family_id,
        created_at=now,
        expires_at=now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        revoked_at=None,
        revocation_reason=None
    )

    db.add(refresh_session)

    return refresh_token


def create_refresh_session(
    db: Session,
    user_id: int,
    family_id: str | None = None
) -> str:
    refresh_token = prepare_refresh_session(
        db,
        user_id,
        family_id
    )

    db.commit()

    return refresh_token


def get_valid_refresh_session(
    db: Session,
    refresh_token: str
) -> RefreshSession | None:

    token_hash = hash_refresh_token(refresh_token)

    session = db.scalar(
        select(RefreshSession).where(
            RefreshSession.token_hash == token_hash
        )
    )

    if session is None:
        return None

    if session.revoked_at is not None:
        return None

    if session.expires_at <= datetime.now(timezone.utc):
        return None

    return session


def prepare_refresh_revocation(
    session: RefreshSession,
    reason: RevocationReason
) -> None:
    session.revoked_at = datetime.now(timezone.utc)
    session.revocation_reason = reason.value


def revoke_refresh_session(
    db: Session,
    session: RefreshSession,
    reason: RevocationReason
) -> None:
    prepare_refresh_revocation(session, reason)
    db.commit()


def get_refresh_session_for_update(
    db: Session,
    refresh_token: str
) -> RefreshSession | None:

    token_hash = hash_refresh_token(refresh_token)

    return db.scalar(
        select(RefreshSession)
        .where(RefreshSession.token_hash == token_hash)
        .with_for_update()
    )


class InvalidRefreshTokenError(Exception):
    pass


def rotate_refresh_token(
    db: Session,
    refresh_token: str
) -> str:

    try:
        token_hash = hash_refresh_token(refresh_token)

        existing_session = db.scalar(
            select(RefreshSession).where(
                RefreshSession.token_hash == token_hash
            )
        )

        if existing_session is None:
            raise InvalidRefreshTokenError()

        user = db.scalar(
            select(User)
            .where(User.id == existing_session.user_id)
            .with_for_update()
        )

        if user is None:
            raise InvalidRefreshTokenError()

        session = db.scalar(
            select(RefreshSession)
            .where(RefreshSession.id == existing_session.id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )

        if session is None:
            raise InvalidRefreshTokenError()

        now = datetime.now(timezone.utc)

        if session.revoked_at is not None:

            if session.revocation_reason == RevocationReason.ROTATION.value:
                db.execute(
                    update(RefreshSession)
                    .where(
                        RefreshSession.family_id == session.family_id,
                        RefreshSession.revoked_at.is_(None)
                    )
                    .values(
                        revoked_at=now,
                        revocation_reason=RevocationReason.COMPROMISED.value
                    )
                )

                db.commit()

            raise InvalidRefreshTokenError()

        if session.expires_at <= now:
            raise InvalidRefreshTokenError()

        prepare_refresh_revocation(
            session,
            RevocationReason.ROTATION
        )

        new_refresh_token = prepare_refresh_session(
            db,
            user_id=session.user_id,
            family_id=session.family_id
        )

        db.commit()

        return new_refresh_token

    except Exception:
        db.rollback()
        raise
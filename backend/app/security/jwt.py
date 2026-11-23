import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parents[2] / '.env'
load_dotenv(env_path)

SECRET_KEY = os.environ["JWT_SECRET_KEY"]
ALGORITHM = "HS256"
EXPIRE_MINUTES = int(os.environ["JWT_EXPIRE_MINUTES"])


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MINUTES)

    payload = {
        "sub": str(user_id),
        "exp": expire,
        "type": "access"
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

def decode_access_token(token: str ) -> dict:
    payload =  jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM],
        options={"require": ["sub", "exp", "type"]}
    )


    if payload["type"] != "access":
        raise jwt.InvalidTokenError("Invalid token type")

    return payload
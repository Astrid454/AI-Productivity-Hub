import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy import create_engine


env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(env_path)

DATABASE_URL = URL.create(
    drivername = "postgresql+psycopg",
    username = os.environ["DB_USER"],
    password = os.environ["DB_PASSWORD"],
    host = os.environ["DB_HOST"],
    port = int(os.environ["DB_PORT"]),
    database = os.environ["DB_NAME"],
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    bind = engine,
    autoflush = False,
    expire_on_commit = False,
)

class Base(DeclarativeBase):
    pass

def get_db():
    db  = SessionLocal()
    try:
        yield db
    finally:
        db.close()
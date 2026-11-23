from fastapi import FastAPI, Path, Query, HTTPException
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware

from app.schemas.task import (
    Priority, TaskCreate, TaskUpdate, TaskStatus, TaskResponse
)

from app.routers.tasks import router as tasks_router
from app.routers.auth import router as auth_router
from app.ai.router import router as ai_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks_router)
app.include_router(auth_router)
app.include_router(ai_router)
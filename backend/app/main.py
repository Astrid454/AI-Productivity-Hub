from fastapi import FastAPI, Path, Query, HTTPException
from typing import Literal

from app.schemas.task import (
    Priority, TaskCreate, TaskUpdate, TaskStatus, TaskResponse
)

from app.routers.tasks import router as tasks_router
from app.routers.auth import router as auth_router

app = FastAPI()
app.include_router(tasks_router)
app.include_router(auth_router)
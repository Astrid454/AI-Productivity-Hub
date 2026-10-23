from typing import Literal

from fastapi import APIRouter, Path, HTTPException, Query

from app.schemas.task import TaskResponse, TaskCreate, TaskUpdate
from app.database.models import User
from app.security.dependencies import get_current_user
from app.services import task_service
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)

@router.get("/{task_id}", response_model=TaskResponse)
def read_task(
        task_id: int = Path(gt=0),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    try:
        return task_service.get_task(task_id, db, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e


@router.get("",  response_model=list[TaskResponse])
def read_tasks(
        status: Literal["all", "pending", "in_progress", "completed"] = "all",
        limit: int = Query(default=10, ge=1, le=100),
        offset: int = Query(default=0, ge=0),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
    ):
    return task_service.get_tasks(db, current_user.id, status, limit, offset)

@router.post("", response_model=TaskResponse, status_code=201)
def create_task(
        task: TaskCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    return task_service.create_task(task, db, current_user.id)

@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
        task_update: TaskUpdate,
        task_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    try:
        return task_service.update_task(task_update, task_id, db, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e

@router.delete("/{task_id}")
def delete_task(
        task_id: int = Path(gt = 0),
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    try:
        task_service.delete_task(task_id, db, current_user.id)
        return {
            "message": f"Task {task_id} deleted"
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e

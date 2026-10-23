from app.schemas.task import TaskCreate, TaskUpdate
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database.models import Task


def get_user_task(db: Session, task_id: int, user_id: int):
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)

    task = db.scalar(statement)

    if task is None:
        raise ValueError("Task not found")

    return task


def get_task(task_id: int, db: Session, user_id: int):
    return get_user_task(db, task_id, user_id)


def get_tasks(db: Session, user_id: int, status: str = 'all', limit: int = 10, offset: int = 0):
    statement = select(Task).where(Task.user_id == user_id)

    if status != 'all':
        statement = statement.where(Task.status == status)

    statement = statement.order_by(Task.id).limit(limit).offset(offset)

    return db.scalars(statement).all()


def create_task(task: TaskCreate, db: Session, user_id: int):
    new_task = Task(
        title=task.title,
        description=task.description,
        priority=task.priority.value,
        status="pending",
        user_id=user_id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


def update_task(
        task_update: TaskUpdate,
        task_id: int,
        db: Session,
        user_id: int
):
    task = get_user_task(db, task_id, user_id)

    updates = task_update.model_dump(exclude_unset=True)

    for field, value in updates.items():
        if field in ("priority", "status"):
            value = value.value

        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


def delete_task(task_id: int, db: Session, user_id: int):
    task = get_user_task(db, task_id, user_id)
    db.delete(task)
    db.commit()
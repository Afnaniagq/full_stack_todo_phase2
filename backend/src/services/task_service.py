from sqlmodel import Session, select
from src.models.task import Task, TaskCreate, TaskUpdate, TaskToggle
from src.models.user import User
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from fastapi import HTTPException, status

def create_task(*, session: Session, task_create: TaskCreate, user_id: UUID) -> Task:
    """
    Create a new task for a specific user.
    """
    # Convert Pydantic model to dict
    task_data = task_create.dict()
    
    # Remove user_id from the dict so it doesn't clash with the explicit user_id argument
    # This prevents the "got multiple values for keyword argument 'user_id'" error.
    task_data.pop('user_id', None) 

    db_task = Task(
        **task_data,
        user_id=user_id
    )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task

def get_tasks(*, session: Session, user_id: UUID,
              priority: Optional[str] = None,
              category: Optional[str] = None,
              is_completed: Optional[bool] = None,
              limit: int = 20,
              offset: int = 0) -> tuple[List[Task], int]:
    query = select(Task).where(Task.user_id == user_id, Task.deleted_at.is_(None))

    if priority:
        query = query.where(Task.priority == priority.capitalize())
    if category:
        query = query.where(Task.category == category)
    if is_completed is not None:
        query = query.where(Task.is_completed == is_completed)

    count_query = select(Task).where(Task.user_id == user_id, Task.deleted_at.is_(None))
    if priority:
        count_query = count_query.where(Task.priority == priority.capitalize())
    if category:
        count_query = count_query.where(Task.category == category)
    if is_completed is not None:
        count_query = count_query.where(Task.is_completed == is_completed)

    total_count = len(session.exec(count_query).all())    

    query = query.order_by(Task.created_at.desc()).offset(offset).limit(limit)
    tasks = session.exec(query).all()

    return tasks, total_count

def get_task(*, session: Session, task_id: UUID, user_id: UUID) -> Optional[Task]:
    task = session.get(Task, task_id)
    if task and task.user_id == user_id and task.deleted_at is None:
        return task
    return None

def update_task(*, session: Session, task_id: UUID, task_update: TaskUpdate, user_id: UUID) -> Optional[Task]:
    db_task = session.get(Task, task_id)
    if not db_task or db_task.user_id != user_id or db_task.deleted_at is not None:
        return None

    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def toggle_task_completion(*, session: Session, task_id: UUID, user_id: UUID) -> Optional[Task]:
    db_task = session.get(Task, task_id)
    if not db_task or db_task.user_id != user_id or db_task.deleted_at is not None:
        return None

    db_task.is_completed = not db_task.is_completed
    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def delete_task(*, session: Session, task_id: UUID, user_id: UUID) -> bool:
    db_task = session.get(Task, task_id)
    if not db_task or db_task.user_id != user_id or db_task.deleted_at is not None:
        return False

    # --- THE FIX IS HERE ---
    db_task.deleted_at = datetime.utcnow()
    db_task.updated_at = datetime.utcnow()
    db_task.soft_deleted = True  # Add this line!
    # -----------------------

    session.add(db_task)
    session.commit()
    return True    
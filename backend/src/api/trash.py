from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from typing import List, Dict, Any
from sqlmodel import Session, select

from src.database import get_session
from src.api.deps import get_current_user_id, log_bulk_operation
from src.services.bulk_service import BulkService
from src.models.task import Task
from src.models.trash_bin import TrashBin, TrashBinRead, TrashBinRestore
from pydantic import BaseModel

# Create a FastAPI router for trash endpoints
router = APIRouter(redirect_slashes=False)

class TrashListRequest(BaseModel):
    limit: int = 20
    offset: int = 0


@router.get("", response_model=Dict[str, Any])
def list_trash_items(
    request: TrashListRequest = Depends(),
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
) -> Dict[str, Any]:
    """
    List soft-deleted tasks for the current user
    """
    user_uuid = UUID(current_user_id)

    # Query for soft-deleted tasks
    statement = (
        select(Task)
        .where(Task.user_id == user_uuid, Task.soft_deleted == True)
        .offset(request.offset)
        .limit(request.limit)
    )

    soft_deleted_tasks = session.exec(statement).all()

    # Calculate total count
    count_statement = select(Task).where(Task.user_id == user_uuid, Task.soft_deleted == True)
    total = len(session.exec(count_statement).all())

    # Convert to a format that matches what the frontend expects
    trash_items = []
    for task in soft_deleted_tasks:
        trash_item = {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "category": task.category,
            "due_date": task.due_date,
            "is_completed": task.is_completed,
            "user_id": task.user_id,
            "created_at": task.created_at,
            "updated_at": task.updated_at,
            "deleted_at": task.deleted_at,
            "soft_deleted": task.soft_deleted
        }
        trash_items.append(trash_item)

    return {
        "tasks": trash_items,
        "total": total
    }


@router.post("/restore", status_code=status.HTTP_200_OK)
def restore_from_trash(
    request: TrashBinRestore,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
) -> Dict[str, Any]:
    """
    Restore one or more tasks from the trash bin
    """
    user_uuid = UUID(current_user_id)

    # Perform bulk restore
    result = BulkService.bulk_restore_tasks(
        task_ids=request.task_ids,
        user_id=user_uuid,
        db_session=session
    )

    # Log the bulk operation
    log_bulk_operation(current_user_id, "bulk_restore", result.get("restored_count", 0))

    return result


@router.delete("/cleanup", status_code=status.HTTP_200_OK)
def cleanup_old_trash_items(
    current_user_id: str = Depends(get_current_user_id),
    older_than_days: int = 30,  # Default to 30 days
    session: Session = Depends(get_session)
) -> Dict[str, Any]:
    """
    Permanently delete old trash items that are past their retention period
    """
    from datetime import datetime, timedelta
    from sqlmodel import delete

    user_uuid = UUID(current_user_id)

    # Calculate the cutoff date
    cutoff_date = datetime.utcnow() - timedelta(days=older_than_days)

    # Find trash items that are older than the cutoff and not yet restored
    statement = (
        delete(Task)
        .where(
            Task.user_id == user_uuid,
            Task.soft_deleted == True,
            Task.deleted_at < cutoff_date
        )
    )

    result = session.exec(statement)
    session.commit()

    return {
        "success": True,
        "purged_count": result.rowcount
    }
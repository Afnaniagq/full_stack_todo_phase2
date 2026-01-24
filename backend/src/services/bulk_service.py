from typing import List, Optional, Dict, Any
from sqlmodel import Session, select, update
from src.models.task import Task, TaskUpdate
from src.models.user import User
from uuid import UUID
from datetime import datetime
from enum import Enum


class BulkOperationType(str, Enum):
    STATUS_UPDATE = "status"
    CATEGORY_UPDATE = "category"
    PRIORITY_UPDATE = "priority"


class BulkOperationParams:
    def __init__(self, **kwargs):
        self.status = kwargs.get('status')
        self.category = kwargs.get('category')
        self.priority = kwargs.get('priority')


class BulkService:
    """Service class for handling bulk operations on tasks"""

    @staticmethod
    def validate_bulk_operation(task_ids: List[UUID], user_id: UUID, db_session: Session) -> bool:
        """
        Validates that all tasks belong to the user before performing bulk operation
        """
        # Get all tasks that belong to the user
        statement = select(Task).where(
            Task.id.in_(task_ids),
            Task.user_id == user_id
        )

        result = db_session.exec(statement).all()

        # Check if all requested task IDs are owned by the user
        result_ids = [task.id for task in result]
        invalid_ids = set(task_ids) - set(result_ids)

        if invalid_ids:
            raise ValueError(f"User does not own the following tasks: {invalid_ids}")

        return True

    @staticmethod
    def bulk_update_tasks(
        task_ids: List[UUID],
        update_type: BulkOperationType,
        params: BulkOperationParams,
        user_id: UUID,
        db_session: Session
    ) -> Dict[str, Any]:
        """
        Performs atomic bulk update of tasks based on update type
        """
        # Validate that user owns all tasks
        BulkService.validate_bulk_operation(task_ids, user_id, db_session)

        # Prepare update data based on update type
        update_data = {}

        if update_type == BulkOperationType.STATUS_UPDATE:
            if params.status is not None:
                update_data['is_completed'] = params.status
        elif update_type == BulkOperationType.CATEGORY_UPDATE:
            if params.category is not None:
                update_data['category'] = params.category
        elif update_type == BulkOperationType.PRIORITY_UPDATE:
            if params.priority is not None:
                update_data['priority'] = params.priority

        # Perform bulk update
        statement = (
            update(Task)
            .where(Task.id.in_(task_ids))
            .values(**update_data, updated_at=datetime.utcnow())
        )

        result = db_session.exec(statement)
        db_session.commit()

        return {
            "success": True,
            "updated_count": result.rowcount,
            "failed_count": len(task_ids) - result.rowcount,
            "errors": []  # Could be extended to include specific error details
        }

    @staticmethod
    def bulk_delete_tasks(
        task_ids: List[UUID],
        user_id: UUID,
        db_session: Session
    ) -> Dict[str, Any]:
        """
        Performs bulk soft delete of tasks
        """
        # Validate that user owns all tasks
        BulkService.validate_bulk_operation(task_ids, user_id, db_session)

        # Update tasks to mark as soft deleted
        statement = (
            update(Task)
            .where(Task.id.in_(task_ids))
            .values(
                soft_deleted=True,
                deleted_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
        )

        result = db_session.exec(statement)
        db_session.commit()

        return {
            "success": True,
            "deleted_count": result.rowcount,
            "failed_count": len(task_ids) - result.rowcount
        }

    @staticmethod
    def bulk_restore_tasks(
        task_ids: List[UUID],
        user_id: UUID,
        db_session: Session
    ) -> Dict[str, Any]:
        """
        Performs bulk restore of soft deleted tasks
        """
        # Validate that user owns all tasks (even if soft deleted)
        statement = select(Task).where(
            Task.id.in_(task_ids),
            Task.user_id == user_id,
            Task.soft_deleted == True
        )

        result = db_session.exec(statement).all()

        # Check if all requested task IDs are owned by the user and soft deleted
        result_ids = [task.id for task in result]
        invalid_ids = set(task_ids) - set(result_ids)

        if invalid_ids:
            raise ValueError(f"User does not own or tasks are not soft deleted: {invalid_ids}")

        # Update tasks to mark as not soft deleted
        statement = (
            update(Task)
            .where(Task.id.in_(task_ids))
            .values(
                soft_deleted=False,
                deleted_at=None,
                updated_at=datetime.utcnow()
            )
        )

        result = db_session.exec(statement)
        db_session.commit()

        return {
            "success": True,
            "restored_count": result.rowcount,
            "failed_count": len(task_ids) - result.rowcount
        }
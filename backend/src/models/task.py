from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import TYPE_CHECKING, Optional
from enum import Enum
from sqlalchemy import Index

if TYPE_CHECKING:
    from src.models.user import User

class PriorityEnum(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"

class TaskBase(SQLModel):
    """Base model for Task with common fields"""
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: PriorityEnum = Field(default=PriorityEnum.medium)
    category: Optional[str] = Field(default=None, max_length=100, index=True)
    due_date: Optional[datetime] = Field(default=None)
    is_completed: bool = Field(default=False)
    user_id: UUID = Field(foreign_key="user.id", index=True)


class Task(TaskBase, table=True):
    """
    Task model for the database
    Uses UUID for security and proper relationship with User
    """
    id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    deleted_at: Optional[datetime] = Field(default=None)  # For soft deletes
    soft_deleted: bool = Field(default=False)  # Flag for soft delete status

    # Relationship to User
    user: "User" = Relationship(back_populates="tasks")

    # Add indexes for efficient queries
    __table_args__ = (
        Index("idx_task_user_id", "user_id"),
        Index("idx_task_priority", "priority"),
        Index("idx_task_category", "category"),
        Index("idx_task_completed", "is_completed"),
        Index("idx_task_due_date", "due_date"),
        Index("idx_task_soft_deleted", "soft_deleted"),  # Index for soft delete queries
    )


class TaskRead(TaskBase):
    """Response model for reading task data"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None


class TaskReadWithUser(TaskRead):
    """Response model for reading task data with user information"""
    user: "User"  # type: ignore


class TaskCreate(TaskBase):
    """Request model for creating a task"""
    title: str = Field(min_length=1, max_length=255)
    priority: PriorityEnum = Field(default=PriorityEnum.medium)


class TaskUpdate(SQLModel):
    """Request model for updating a task"""
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    priority: Optional[PriorityEnum] = Field(default=None)
    category: Optional[str] = Field(default=None, max_length=100)
    due_date: Optional[datetime] = Field(default=None)
    is_completed: Optional[bool] = Field(default=None)


class TaskToggle(SQLModel):
    """Request model for toggling task completion status"""
    is_completed: bool
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import TYPE_CHECKING, Optional, Dict, Any
from sqlalchemy import Index
import json

if TYPE_CHECKING:
    from src.models.user import User
    from src.models.task import Task

class TrashBinBase(SQLModel):
    """Base model for TrashBin with common fields"""
    # ADDED foreign_key="task.id" HERE:
    task_id: UUID = Field(foreign_key="task.id", index=True)  
    user_id: UUID = Field(foreign_key="user.id", index=True)
    deleted_at: datetime = Field(default_factory=datetime.utcnow)
    scheduled_purge_at: datetime = Field(default_factory=lambda: datetime.utcnow().replace(day=datetime.utcnow().day + 30))
    is_restored: bool = Field(default=False)
    original_task_data: str = Field(max_length=5000)

class TrashBin(TrashBinBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationships
    user: "User" = Relationship(back_populates="trash_items")
    # Simplified this relationship to stop the error
    task: Optional["Task"] = Relationship()

#class TrashBinBase(SQLModel):
    #"""Base model for TrashBin with common fields"""
    #task_id: UUID = Field(index=True)  # Reference to the original task ID
    #user_id: UUID = Field(foreign_key="user.id", index=True)  # Reference to the user who owned the task
    #deleted_at: datetime = Field(default_factory=datetime.utcnow)  # Timestamp when task was soft-deleted
    #scheduled_purge_at: datetime = Field(default_factory=lambda: datetime.utcnow().replace(day=datetime.utcnow().day + 30))  # Default: 30 days retention
    #is_restored: bool = Field(default=False)  # Whether the task has been restored
    #original_task_data: str = Field(max_length=5000)  # JSON string of the original task data

#class TrashBin(TrashBinBase, table=True):
   # """
    #TrashBin model for storing soft-deleted tasks
    #Maintains references to original task data for recovery
    #"""
    #id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False)
    #created_at: datetime = Field(default_factory=datetime.utcnow)
    #updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationships
    #user: "User" = Relationship(back_populates="trash_items")
   # task: Optional["Task"] = Relationship()

    # Add indexes for efficient queries
    __table_args__ = (
        Index("idx_trashbin_user_id", "user_id"),
        Index("idx_trashbin_task_id", "task_id"),
        Index("idx_trashbin_deleted_at", "deleted_at"),
        Index("idx_trashbin_scheduled_purge_at", "scheduled_purge_at"),
        Index("idx_trashbin_is_restored", "is_restored"),
    )

class TrashBinRead(TrashBinBase):
    """Response model for reading trash bin data"""
    id: UUID
    created_at: datetime
    updated_at: datetime

class TrashBinCreate(TrashBinBase):
    """Request model for creating a trash bin entry"""
    task_id: UUID
    user_id: UUID
    original_task_data: str

class TrashBinRestore(SQLModel):
    """Request model for restoring items from trash"""
    task_ids: list[UUID]
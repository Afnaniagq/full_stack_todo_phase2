from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from backend.src.models.user import User

class CategoryBase(SQLModel):
    """Base model for Category with common fields"""
    name: str = Field(min_length=1, max_length=50, index=True)
    color: Optional[str] = Field(default=None, max_length=7)  # Hex color code
    user_id: UUID = Field(foreign_key="user.id", index=True)


class Category(CategoryBase, table=True):
    """
    Category model for the database
    Used for organizing tasks by category
    """
    id: UUID = Field(default_factory=uuid4, primary_key=True, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship to User
    user: "User" = Relationship(back_populates="categories")


class CategoryRead(CategoryBase):
    """Response model for reading category data"""
    id: UUID
    created_at: datetime
    updated_at: datetime


class CategoryCreate(CategoryBase):
    """Request model for creating a category"""
    name: str = Field(min_length=1, max_length=50)


class CategoryUpdate(SQLModel):
    """Request model for updating a category"""
    name: Optional[str] = Field(default=None, min_length=1, max_length=50)
    color: Optional[str] = Field(default=None, max_length=7)
---
name: data-modeling-sqlmodel
description: Design and implement clean, scalable database models using SQLModel for Python applications.
---

# Data Modeling with SQLModel

## Instructions

1. **Model structure**
   - Define models using Python classes
   - Use `SQLModel` as the base class
   - Separate domain models and database tables when needed

2. **Fields & types**
   - Use explicit Python type hints
   - Define primary keys and indexes
   - Apply constraints (nullable, unique, default)

3. **Relationships**
   - Model one-to-one, one-to-many, and many-to-many relationships
   - Use `Relationship()` for ORM mappings
   - Avoid circular dependencies

4. **Schema management**
   - Enable table creation with `table=True`
   - Use migrations for schema evolution
   - Keep models backward-compatible

## Best Practices
- Keep models small and focused
- Use descriptive field names
- Prefer composition over inheritance
- Align models with business concepts
- Validate data at the model level

## Example Structure
```python
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    is_active: bool = Field(default=True)

    items: List["Item"] = Relationship(back_populates="owner")

class Item(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")

    owner: Optional[User] = Relationship(back_populates="items")

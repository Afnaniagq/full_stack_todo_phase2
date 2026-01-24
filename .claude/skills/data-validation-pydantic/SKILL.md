---
name: data-validation-pydantic
description: Validate, parse, and serialize data reliably using Pydantic with Python type hints.
---

# Data Validation (Pydantic)

## Instructions

1. **Model definition**
   - Define schemas using `BaseModel`
   - Use Python type hints for all fields
   - Set defaults and optional values clearly

2. **Validation rules**
   - Apply field constraints (min/max, regex, length)
   - Use custom validators for complex logic
   - Normalize and transform input data

3. **Serialization & parsing**
   - Convert raw data into typed objects
   - Serialize models to JSON safely
   - Handle nested and complex data structures

4. **Error handling**
   - Leverage structured validation errors
   - Return clear, user-friendly error messages
   - Integrate validation at system boundaries

## Best Practices
- Validate data as early as possible
- Keep models small and reusable
- Avoid business logic in validators
- Use strict types where applicable
- Document schemas clearly
- Reuse models across API and data layers

## Example Structure
```python
from pydantic import BaseModel, EmailStr, Field

class UserInput(BaseModel):
    email: EmailStr
    age: int = Field(gt=0, lt=120)
    is_active: bool = True


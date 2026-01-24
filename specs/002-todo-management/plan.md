# Implementation Plan: Multi-User Todo Management System

**Branch**: `002-todo-management` | **Date**: 2026-01-10 | **Spec**: [link](./spec.md)
**Input**: Feature specification from `/specs/[002-todo-management]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a multi-user todo management system with secure, user-isolated CRUD operations for tasks. The system includes priority levels, categories, due dates, and complete/incomplete toggling. Built upon the existing authentication bridge (Spec-001) for JWT verification and Neon PostgreSQL for data persistence.

## Technical Context

**Language/Version**: Python 3.11, TypeScript/JavaScript (Node.js), SQL
**Primary Dependencies**: FastAPI, Next.js 16+, SQLModel, PyJWT, Neon PostgreSQL driver, existing auth bridge components
**Storage**: Neon Serverless PostgreSQL with mandatory SSL (sslmode=require) - leveraging existing connection from Spec-001
**Testing**: pytest for backend, Jest/Vitest for frontend, integration tests for user isolation
**Target Platform**: Web application (Linux/Mac/Windows compatible)
**Project Type**: Web (monorepo with separate frontend/backend services)
**Performance Goals**: Sub-200ms task CRUD operations, sub-500ms database connection with SSL
**Constraints**: Must enforce user isolation (no cross-user data access), JWT required for all task endpoints, SSL required for all DB connections
**Scale/Scope**: Multi-user support with proper data isolation, focus on task management functionality

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Strict User Isolation**: Implementation must ensure no user sees/modifies another user's tasks via user_id validation
- **Stateless Authentication**: All task API requests must be verified via JWT tokens with no session state on backend
- **Schema Integrity**: SQLModel schema must be single source of truth for both database and API validation
- **Responsive Excellence**: UI must be functional on mobile/desktop
- **Data Privacy Protection**: Pydantic schemas must exclude internal database IDs from public responses

## Project Structure

### Documentation (this feature)

```text
specs/002-todo-management/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (building on existing structure)

```text
backend/
├── src/
│   ├── models/
│   │   ├── user.py              # From Spec-001 (extended if needed)
│   │   ├── task.py              # New: Task model with User relationship
│   │   └── category.py          # New: Category model
│   ├── services/
│   │   ├── auth.py              # From Spec-001 (reuse JWT verification)
│   │   ├── task_service.py      # New: Task CRUD operations
│   │   └── user_service.py      # New: User-related operations
│   ├── api/
│   │   ├── deps.py              # From Spec-001 (reuse JWT dependency)
│   │   ├── tasks.py             # New: Task API endpoints
│   │   └── users.py             # New: User API endpoints
│   └── main.py                  # Existing: FastAPI app entry point (extend with new routes)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── contract/
└── requirements.txt             # Existing: Extended with new dependencies if needed

frontend/
├── src/
│   ├── lib/
│   │   └── auth.js              # From Spec-001 (reuse auth client)
│   ├── components/
│   │   ├── TaskCard.tsx         # New: Individual task display
│   │   ├── TaskList.tsx         # New: List of tasks
│   │   ├── TaskForm.tsx         # New: Task creation/editing form
│   │   └── Dashboard.tsx        # New: Main dashboard component
│   ├── pages/
│   │   └── dashboard.tsx        # New: Main dashboard page
│   └── services/
│       └── task_api.ts          # New: Task API service
├── tests/
└── package.json                 # Existing: Extended with new dependencies if needed
```

**Structure Decision**: Extending the existing monorepo structure from Spec-001 with new task-specific components while reusing the authentication bridge components. This leverages existing infrastructure while maintaining separation of concerns.

## Architecture Sketch

### Task-User Relationship Architecture
```
User (1) ←→ (Many) Task
- User.id (UUID) → Task.user_id (UUID, foreign key)
- Task.user_id is indexed for efficient queries
- All task operations filtered by authenticated user's ID
```

### Backend Service Structure
```
API Layer (FastAPI)
├── Authentication Middleware/Dependency (reuse from Spec-001)
├── Task Routes (tasks.py)
│   ├── GET /tasks (list user's tasks)
│   ├── POST /tasks (create task)
│   ├── GET /tasks/{id} (get specific task)
│   ├── PUT /tasks/{id} (update task)
│   ├── PATCH /tasks/{id}/toggle (toggle completion)
│   └── DELETE /tasks/{id} (delete task)
└── User Routes (users.py)
    └── GET /users/profile (get user info)

Service Layer
├── TaskService
│   ├── create_task(task_data, user_id)
│   ├── get_tasks(user_id, filters)
│   ├── get_task(task_id, user_id)
│   ├── update_task(task_id, update_data, user_id)
│   ├── toggle_task_completion(task_id, user_id)
│   └── delete_task(task_id, user_id)
└── UserService
    └── get_user_profile(user_id)

Data Layer (SQLModel)
├── User model (from Spec-001)
├── Task model (new)
└── Category model (new)
```

### Frontend Dashboard Layout
```
Dashboard Page
├── Header (user info, logout)
├── Sidebar (filters: priority, category, due date)
├── Main Content Area
│   ├── Task Creation Form (expandable/collapsible)
│   ├── Task List (filtered by sidebar selections)
│   │   ├── Task Card (title, description, priority, category, due date, completion toggle)
│   │   └── Pagination/Infinite scroll
│   └── Stats Panel (completed vs pending, overdue tasks)
└── Footer (app info)
```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multi-layer architecture | Required by constraints to maintain separation of concerns | Single-file approach would violate service organization standards |
| JWT verification reuse | Required by constraints to leverage existing Spec-001 auth bridge | Implementing duplicate auth logic would violate DRY principle |

## Phase 0: Research Decisions

### JWT Extraction Method Decision
- **Decision**: Dependency Injection vs. Middleware
- **Rationale**: Dependency Injection using FastAPI's Depends() system as implemented in Spec-001 for consistency
- **Tradeoff**: Leverages existing patterns from Spec-001 vs. implementing new middleware approach

### Soft Deletes vs. Hard Deletes Decision
- **Decision**: Soft Deletes for tasks
- **Rationale**: Provides user safety net and audit trail; aligns with typical task management expectations
- **Alternative**: Hard deletes considered but rejected for user experience reasons

### Frontend State Management Decision
- **Decision**: Optimistic UI updates
- **Rationale**: Provides better user experience with immediate feedback; backend validation ensures correctness
- **Alternative**: Standard loading states considered but optimistic updates preferred for UX
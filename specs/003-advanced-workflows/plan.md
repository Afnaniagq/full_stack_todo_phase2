# Implementation Plan: Advanced User Workflows & System Resilience for Multi-User Todo App

**Branch**: `003-advanced-workflows` | **Date**: 2026-01-10 | **Spec**: [link](./spec.md)
**Input**: Feature specification from `/specs/[003-advanced-workflows]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of advanced user workflows with bulk operations, optimistic UI updates, and system resilience for the multi-user todo application. The system will handle 500+ tasks per user efficiently while maintaining sub-150ms response times and 100% test coverage for user isolation. Includes keyboard-accessible UI and soft delete functionality with recovery mechanisms.

## Technical Context

**Language/Version**: Python 3.11, TypeScript/JavaScript (Node.js), SQL
**Primary Dependencies**: FastAPI, Next.js 16+, SQLModel, PyJWT, Neon PostgreSQL driver, existing auth bridge components, TanStack Query for state management
**Storage**: Neon Serverless PostgreSQL with mandatory SSL (sslmode=require) - leveraging existing connection from previous features
**Testing**: pytest for backend, Jest/Vitest for frontend, integration tests for user isolation, performance testing with custom benchmarks
**Target Platform**: Web application (Linux/Mac/Windows compatible)
**Project Type**: Web (monorepo with separate frontend/backend services)
**Performance Goals**: Sub-150ms API response times for filtering, sub-100ms perceived response time for optimistic UI
**Constraints**: Must maintain user isolation (no cross-user data access), JWT required for all endpoints, SSL required for all DB connections, maintain WCAG accessibility standards
**Scale/Scope**: Multi-user support with proper data isolation, optimized for 500+ tasks per user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Strict User Isolation**: Implementation must ensure no user sees/modifies another user's tasks via user_id validation
- **Stateless Authentication**: All API requests must be verified via JWT tokens with no session state on backend
- **Schema Integrity**: SQLModel schema must be single source of truth for both database and API validation
- **Responsive Excellence**: UI must be functional on mobile/desktop and fully keyboard navigable
- **Data Privacy Protection**: Pydantic schemas must exclude internal database IDs from public responses

## Project Structure

### Documentation (this feature)

```text
specs/003-advanced-workflows/
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
│   │   ├── task.py              # Extended: Bulk operation support
│   │   └── trash_bin.py         # New: Soft delete recovery model
│   ├── services/
│   │   ├── task_service.py      # Enhanced: Bulk operations, optimistic updates
│   │   ├── bulk_service.py      # New: Batch processing logic
│   │   └── trash_service.py     # New: Soft delete recovery logic
│   ├── api/
│   │   ├── tasks.py             # Extended: Bulk operation endpoints
│   │   └── trash.py             # New: Soft delete endpoints
│   └── main.py                  # Extended: New routes
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── performance/             # New: Performance benchmarking
│   └── accessibility/           # New: WCAG compliance tests
└── requirements.txt             # Extended: Performance testing dependencies

frontend/
├── src/
│   ├── lib/
│   │   └── auth.js              # From existing (unchanged)
│   ├── components/
│   │   ├── TaskCard.tsx         # Enhanced: Selection support
│   │   ├── TaskList.tsx         # Enhanced: Virtualized rendering
│   │   ├── TaskForm.tsx         # Enhanced: Bulk operations
│   │   ├── Dashboard.tsx        # Enhanced: Keyboard navigation
│   │   ├── BulkOperationsBar.tsx # New: Bulk action UI
│   │   └── TrashBinModal.tsx    # New: Soft delete recovery UI
│   ├── pages/
│   │   └── dashboard.tsx        # Enhanced: Keyboard navigation
│   ├── services/
│   │   └── task_api.ts          # Enhanced: Optimistic updates
│   ├── hooks/
│   │   ├── useBulkSelection.ts  # New: Multi-select state management
│   │   ├── useOptimisticUpdate.ts # New: Optimistic UI hook
│   │   └── useKeyboardNav.ts    # New: Keyboard navigation hook
│   └── utils/
│       ├── performance.ts       # New: Performance utilities
│       └── accessibility.ts     # New: Accessibility utilities
├── tests/
└── package.json                 # Extended: TanStack Query, performance dependencies
```

**Structure Decision**: Extending the existing monorepo structure from previous features with new components for advanced workflows while reusing the authentication bridge components. This leverages existing infrastructure while maintaining separation of concerns.

## Architecture Sketch

### Bulk Operations Architecture
```
User Action → Frontend State → Optimistic Update → API Call → Backend Processing → Database Transaction
    ↑                                    ↓                     ↓                    ↓
    └───── Rollback on Failure ←─────────┴─────────────────────┴───────────────────┘
```

### Optimistic UI Update Flow
```
1. User triggers action (e.g., mark complete)
2. Frontend immediately updates UI with new state
3. API call runs in background
4. If API succeeds → UI stays updated
5. If API fails → UI reverts to previous state with error notification
```

### Virtualized List Rendering
```
Large Task List (500+ items)
├── Viewport Container (visible area)
├── Rendered Items (currently visible)
├── Buffer Items (above/below viewport)
└── Measurement Cache (item heights)
```

### Soft Delete Recovery Architecture
```
Task Deletion
├── Immediate: Mark as deleted (deleted_at timestamp)
├── Temporary Storage: Available for recovery
├── Cleanup Worker: Periodic purging of old deleted items
└── Recovery Interface: Restore functionality for recent deletions
```

## Research Decisions

### Bulk Update Strategy Decision
- **Decision**: Atomic database transactions vs. individual row updates
- **Rationale**: Atomic transactions for data consistency and performance - ensures all operations in a batch succeed or fail together
- **Alternative**: Individual updates considered but rejected for consistency and performance reasons

### State Management Decision
- **Decision**: Implementation of Optimistic UI rollbacks using TanStack Query vs. custom Context
- **Rationale**: TanStack Query for robust optimistic update handling and built-in rollback mechanisms
- **Alternative**: Custom context considered but TanStack Query offers better error handling and caching

### Rendering Strategy Decision
- **Decision**: Standard mapping vs. Virtualized lists for 500+ tasks
- **Rationale**: Virtualized lists for performance with large datasets - only render visible items
- **Alternative**: Standard mapping would cause performance issues with 500+ tasks

### Soft Delete Strategy Decision
- **Decision**: Periodic cleanup worker vs. manual "Empty Trash" functionality
- **Rationale**: Hybrid approach - configurable retention period with both automatic cleanup and manual empty option
- **Alternative**: Pure automatic or pure manual - hybrid provides flexibility

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Complex state management | Required by constraints for optimistic UI | Simple state updates would not meet zero-latency feel requirement |
| Virtualized rendering | Required by performance constraints for 500+ tasks | Standard rendering would cause UI lag with large datasets |
| Atomic bulk operations | Required by data integrity constraints | Individual operations would be slower and less consistent |

## Phase 0: Research Outline

### Performance Research
- Investigate virtual scrolling libraries for React (react-window, react-virtual, etc.)
- Benchmark different approaches for handling 500+ items efficiently
- Research best practices for optimistic UI with TanStack Query

### Bulk Operations Research
- Study atomic transaction patterns in SQLModel/PostgreSQL
- Investigate batch processing strategies for improved performance
- Review best practices for bulk operation validation and error handling

### Accessibility Research
- Research WCAG 2.1 AA compliance requirements for keyboard navigation
- Study best practices for accessible selection controls and bulk operations
- Investigate screen reader compatibility for dynamic UI updates
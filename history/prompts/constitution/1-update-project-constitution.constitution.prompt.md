---
id: 1
title: "Update Project Constitution"
stage: constitution
date_iso: "2026-01-10"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "master"
user: "user"
command: "/sp.constitution"
labels: ["constitution", "setup", "requirements"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - ".specify/memory/constitution.md"
  - "history/prompts/constitution/1-update-project-constitution.constitution.prompt.md"
tests_yaml: []
---

# Prompt History Record

## Outcome
Successfully updated the project constitution for the Multi-User Todo Full-Stack Web Application (Phase II) with specific principles, standards, constraints, and success criteria.

## Evaluation
The constitution file was successfully updated with all required elements from the user input, replacing all placeholder tokens with concrete values reflecting the project requirements.

## Prompt Text
```
Project: Multi-User Todo Full-Stack Web Application (Phase II)

Core Principles:
- Strict User Isolation: No user shall ever see, modify, or delete data belonging to another user_id.
- Stateless Authentication: All API requests must be verified via JWT tokens; no session state on the backend.
- Schema Integrity: The SQLModel schema is the single source of truth for both the database and API validation.
- Responsive Excellence: The UI must be fully functional on mobile and desktop without layout breakage.

Key Standards:
- Auth: Better Auth (TS) + FastAPI (Python) using shared HS256 JWT signing.
- Security: "Authorization: Bearer <token>" required for all /api/ paths.
- Database: Neon Serverless PostgreSQL with mandatory SSL (sslmode=require).
- Code Style: Follow frontend/CLAUDE.md and backend/CLAUDE.md naming conventions.
- Error Handling: Standardized JSON error responses with appropriate HTTP status codes (401, 403, 404, 422).

Constraints:
- Stack: Next.js 16 (App Router), FastAPI, SQLModel, Tailwind CSS, Shadcn/UI.
- Data Privacy: Pydantic schemas must exclude internal database IDs or sensitive user fields from public responses.
- Environment: All secrets (BETTER_AUTH_SECRET, DATABASE_URL) must reside in .env files.

Success Criteria:
- 100% User Isolation: Verification that cross-user data access is impossible.
- Performance: Optimized database queries using indexes on user_id and task status.
- UI/UX: Zero-config deployment readiness and mobile-responsive task management cockpit.
- Security: All tests pass for "Unauthorized" (401) and "Forbidden" (403) scenarios.
```

## Response Text
Updated the constitution file with all specified principles, standards, constraints, and success criteria for the Multi-User Todo Full-Stack Web Application. The file now contains concrete values instead of placeholders, with specific guidance for user isolation, authentication, schema integrity, responsive design, and other key requirements.
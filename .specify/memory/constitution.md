<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.0.0 (initial population of template)
- Modified principles: [PRINCIPLE_1_NAME] → Strict User Isolation, [PRINCIPLE_2_NAME] → Stateless Authentication, [PRINCIPLE_3_NAME] → Schema Integrity, [PRINCIPLE_4_NAME] → Responsive Excellence
- Added sections: Core Principles (5 total), Key Standards, Constraints, Success Criteria
- Removed sections: None (template populated)
- Templates requiring updates: N/A (initial setup)
- Follow-up TODOs: None
-->

# Multi-User Todo Full-Stack Web Application (Phase II) Constitution

## Core Principles

### Strict User Isolation
No user shall ever see, modify, or delete data belonging to another user_id. This principle ensures data privacy and security across all user accounts.
<!-- Every API endpoint must verify that the requesting user owns the data being accessed -->

### Stateless Authentication
All API requests must be verified via JWT tokens; no session state on the backend. This enables horizontal scaling and reduces server-side complexity.
<!-- Authentication tokens must be validated on every request without relying on server-side session storage -->

### Schema Integrity
The SQLModel schema is the single source of truth for both the database and API validation. This ensures consistency between data storage and API contracts.
<!-- Database migrations must align with schema definitions; API validation must use the same models -->

### Responsive Excellence
The UI must be fully functional on mobile and desktop without layout breakage. This ensures accessibility across all device types.
<!-- All components must implement responsive design principles using Tailwind CSS -->

### Data Privacy Protection
Pydantic schemas must exclude internal database IDs or sensitive user fields from public responses. This prevents exposure of internal implementation details.
<!-- Response models must explicitly define which fields are safe for public consumption -->

## Key Standards

### Authentication
Better Auth (TS) + FastAPI (Python) using shared HS256 JWT signing. This provides consistent authentication across frontend and backend.
<!-- JWT tokens must be verified using the same secret key across services -->

### Security
"Authorization: Bearer <token>" required for all /api/ paths. This enforces consistent authentication headers across all protected endpoints.
<!-- All API routes must validate the presence and validity of JWT tokens -->

### Database
Neon Serverless PostgreSQL with mandatory SSL (sslmode=require). This ensures secure and scalable database connectivity.
<!-- All database connections must use SSL encryption -->

### Code Style
Follow frontend/CLAUDE.md and backend/CLAUDE.md naming conventions. This maintains consistency across the full-stack application.
<!-- Naming conventions must be consistent between frontend and backend components -->

### Error Handling
Standardized JSON error responses with appropriate HTTP status codes (401, 403, 404, 422). This provides predictable error handling for clients.
<!-- All error responses must follow the same JSON structure -->

## Constraints

### Stack Requirements
Stack: Next.js 16 (App Router), FastAPI, SQLModel, Tailwind CSS, Shadcn/UI. This defines the core technology stack for the application.
<!-- No additional frameworks should be introduced without explicit approval -->

### Data Privacy
Pydantic schemas must exclude internal database IDs or sensitive user fields from public responses. This prevents data leakage.
<!-- Response models must be explicitly designed to exclude sensitive information -->

### Environment
All secrets (BETTER_AUTH_SECRET, DATABASE_URL) must reside in .env files. This ensures secure handling of sensitive configuration.
<!-- No hardcoded secrets should exist in the source code -->

## Success Criteria

### 100% User Isolation
Verification that cross-user data access is impossible. This ensures the security and privacy of user data.
<!-- Tests must verify that users cannot access data belonging to other users -->

### Performance
Optimized database queries using indexes on user_id and task status. This ensures efficient data retrieval and application responsiveness.
<!-- All queries must utilize appropriate database indexes -->

### UI/UX
Zero-config deployment readiness and mobile-responsive task management cockpit. This ensures easy deployment and excellent user experience.
<!-- The application must be deployable without configuration changes -->

### Security
All tests pass for "Unauthorized" (401) and "Forbidden" (403) scenarios. This ensures proper access control implementation.
<!-- Security tests must validate that unauthorized access is properly blocked -->

## Governance

All code must comply with these constitutional principles. Changes to these principles require explicit approval and must be documented with clear rationale. Code reviews must verify compliance with all principles before merging. The constitution serves as the ultimate authority for technical decisions in this project.

**Version**: 1.0.0 | **Ratified**: 2026-01-10 | **Last Amended**: 2026-01-10

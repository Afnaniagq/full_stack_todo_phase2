---
name: cloud-db-management-neon
description: Manage and scale cloud-native PostgreSQL databases using Neon with branching, autoscaling, and serverless workflows.
---

# Cloud DB Management (Neon)

## Instructions

1. **Database setup**
   - Create serverless PostgreSQL databases
   - Configure projects, branches, and roles
   - Secure connections with environment variables

2. **Branching workflows**
   - Use branches for development, staging, and production
   - Isolate schema and data changes
   - Merge or discard branches safely

3. **Scaling & performance**
   - Leverage autoscaling compute
   - Monitor connection usage
   - Optimize queries for serverless execution

4. **Operations & maintenance**
   - Manage connection strings and pooling
   - Apply schema migrations safely
   - Monitor database health and usage metrics

## Best Practices
- Use separate branches per environment
- Rotate credentials regularly
- Enable connection pooling for high traffic
- Avoid long-lived transactions
- Automate migrations in CI/CD pipelines

## Example Structure
```bash
# Set Neon database connection
export DATABASE_URL="postgresql://user:password@ep-host.neon.tech/dbname"

# Run migrations
alembic upgrade head

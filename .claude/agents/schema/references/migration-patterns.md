# Migration Patterns

## Safe Migration Decision Tree

```
Schema Change Needed
├── Adding new?
│   ├── New table → CREATE TABLE (safe)
│   ├── New column (nullable) → ALTER TABLE ADD COLUMN (safe)
│   ├── New column (NOT NULL) → Expand-Contract pattern
│   └── New index → CREATE INDEX CONCURRENTLY (PG)
├── Modifying existing?
│   ├── Rename column → Expand-Contract (3 phases)
│   ├── Change type → Check conversion safety
│   ├── Add constraint → Validate existing data first
│   └── Change default → Usually safe
└── Removing?
    ├── Drop column → Backup first, Expand-Contract
    ├── Drop table → Backup required, irreversible
    ├── Drop index → Safe, check query performance
    └── Drop constraint → Safe, check data integrity
```

## Expand-Contract Pattern

### Phase 1: Expand
- Add new column (always nullable)
- Create sync trigger for both columns
- Deploy application writing to both

### Phase 2: Migrate
- Backfill existing data (batch for large tables)
- Add NOT NULL constraint after backfill

### Phase 3: Contract
- Drop sync trigger
- Drop old column (after verification)
- Rename new column if needed

## Zero-Downtime Index Creation

```sql
-- PostgreSQL: Non-blocking
CREATE INDEX CONCURRENTLY idx_name ON table(column);

-- MySQL 8.0+: Online DDL
ALTER TABLE t ADD INDEX idx_name (col), ALGORITHM=INPLACE, LOCK=NONE;
```

## Framework Migration Commands

| Framework | Create | Run | Rollback |
|-----------|--------|-----|----------|
| Prisma | `prisma migrate dev --name [n]` | `prisma migrate deploy` | Manual |
| TypeORM | `typeorm migration:generate -n [N]` | `typeorm migration:run` | `typeorm migration:revert` |
| Drizzle | `drizzle-kit generate:pg` | `drizzle-kit push:pg` | Manual |
| Knex | `knex migrate:make [n]` | `knex migrate:latest` | `knex migrate:rollback` |

## Pre-Migration Checklist

- [ ] Backup production database
- [ ] Test on staging with production-like data
- [ ] Verify rollback works
- [ ] Estimate lock duration
- [ ] Check disk space
- [ ] Schedule low-traffic window if locking
- [ ] Prepare post-migration monitoring

# Normalization & Denormalization Guide

## Normal Forms

### 1NF: Atomic values, no repeating groups
Violation: `tags VARCHAR(500)` with "a,b,c" → Fix: Junction table

### 2NF: No partial dependencies
Violation: `product_name` in order_items depends only on `product_id` → Fix: Move to products table

### 3NF: No transitive dependencies
Violation: `city` depends on `zip_code` not `user_id` → Fix: Separate zip_codes table

## When to Denormalize

| Factor | Normalize | Denormalize |
|--------|-----------|-------------|
| Write frequency | High | Low |
| Read frequency | Low | High |
| Consistency | Critical | Eventually OK |
| Query complexity | Simple joins OK | Complex joins slow |

## Denormalization Patterns

### 1. Materialized Views
```sql
CREATE MATERIALIZED VIEW mv_summary AS SELECT ...;
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_summary;
```

### 2. Snapshot Columns (Audit)
Store product_name/price at time of purchase in order_items.

### 3. Counter Cache
```sql
ALTER TABLE posts ADD COLUMN comment_count INT DEFAULT 0;
-- Update via trigger on comments INSERT/DELETE
```

### 4. JSON Aggregation
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  attributes JSONB DEFAULT '{}'
);
CREATE INDEX ON products USING GIN (attributes);
```

## Audit Checklist
- [ ] No comma-separated values (1NF)
- [ ] No repeating column groups (1NF)
- [ ] All non-key columns depend on entire PK (2NF)
- [ ] No transitive dependencies (3NF)
- [ ] Denormalization documented with rationale

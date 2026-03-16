# Index Strategy Guide

## Index Type Selection

| Query Pattern | PostgreSQL | MySQL |
|--------------|-----------|-------|
| Exact match (`=`) | B-tree | B-tree |
| Range (`>`, `<`) | B-tree | B-tree |
| Full-text search | GIN (tsvector) | FULLTEXT |
| JSON field | GIN (jsonb) | Virtual col + B-tree |
| Array contains | GIN (array_ops) | N/A |
| Geospatial | GiST | SPATIAL |

## Composite Index Rules

```
Order: Equality → Range → Sort

WHERE status = 'active' AND created_at > '2024-01-01' ORDER BY name
Optimal: (status, created_at, name)
```

## Partial Indexes (PostgreSQL)

```sql
CREATE INDEX idx_active_users ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_recent_orders ON orders(created_at) WHERE created_at > '2024-01-01';
```

## Covering Index (Index-Only Scan)

```sql
CREATE INDEX idx_covering ON users(status) INCLUDE (name, email);
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|-------------|---------|----------|
| Index every column | Slow writes | Index only queried columns |
| Duplicate indexes | Wasted space | Remove overlapping |
| Unused indexes | Write overhead | Monitor and drop |
| Low-cardinality index | Full scan faster | Skip for booleans |

## Monitoring Queries

```sql
-- Unused indexes (PostgreSQL)
SELECT indexrelname, idx_scan, pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes WHERE NOT indisunique AND idx_scan < 50;

-- Missing index hints
SELECT relname, seq_scan - idx_scan as too_much_seq
FROM pg_stat_user_tables WHERE seq_scan - idx_scan > 100;
```

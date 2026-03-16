# Query Optimization Patterns

## Common Rewrites

### N+1 → JOIN
```sql
-- Before (N+1)
SELECT * FROM orders WHERE user_id = ?; -- repeated N times

-- After (JOIN)
SELECT o.*, u.name FROM orders o JOIN users u ON o.user_id = u.id;
```

### Subquery → CTE
```sql
-- Before
SELECT * FROM orders WHERE user_id IN (SELECT id FROM users WHERE active);

-- After
WITH active_users AS (SELECT id FROM users WHERE active)
SELECT o.* FROM orders o JOIN active_users au ON o.user_id = au.id;
```

### OFFSET → Cursor Pagination
```sql
-- Before (slow for large offsets)
SELECT * FROM items ORDER BY id LIMIT 20 OFFSET 10000;

-- After (cursor-based)
SELECT * FROM items WHERE id > last_seen_id ORDER BY id LIMIT 20;
```

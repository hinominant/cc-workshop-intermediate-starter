# tuner — DB最適化リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## MATERIALIZED VIEWS

### When to Use Materialized Views

| Scenario | Use MV? | Reason |
|----------|---------|--------|
| Complex aggregation (daily/weekly) | ✅ Yes | Avoid repeated computation |
| Dashboard queries | ✅ Yes | Predictable, cacheable results |
| Real-time data | ❌ No | Staleness unacceptable |
| Infrequent queries | ❌ No | Storage overhead not justified |
| High-write tables | ⚠️ Depends | Refresh cost vs query benefit |

### PostgreSQL Materialized Views

```sql
-- Create materialized view for daily sales summary
CREATE MATERIALIZED VIEW mv_daily_sales AS
SELECT
    DATE(created_at) AS sale_date,
    product_id,
    SUM(quantity) AS total_quantity,
    SUM(amount) AS total_amount,
    COUNT(*) AS order_count
FROM orders
GROUP BY DATE(created_at), product_id
WITH DATA;

-- Create index on materialized view
CREATE INDEX idx_mv_daily_sales_date ON mv_daily_sales(sale_date);

-- Refresh strategies
-- Full refresh (blocks reads during refresh)
REFRESH MATERIALIZED VIEW mv_daily_sales;

-- Concurrent refresh (requires unique index)
CREATE UNIQUE INDEX idx_mv_daily_sales_pk ON mv_daily_sales(sale_date, product_id);
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales;

-- Check last refresh time (PostgreSQL 14+)
SELECT schemaname, matviewname,
       pg_catalog.pg_size_pretty(pg_relation_size(matviewname::regclass)) AS size
FROM pg_matviews
WHERE matviewname = 'mv_daily_sales';
```

### Refresh Strategies

| Strategy | Command | Use Case |
|----------|---------|----------|
| **Manual** | `REFRESH MATERIALIZED VIEW` | On-demand, after ETL |
| **Scheduled** | cron + psql | Regular intervals (hourly/daily) |
| **Trigger-based** | Custom function | Near real-time (complex) |
| **Concurrent** | `REFRESH CONCURRENTLY` | Zero-downtime refresh |

### Refresh Scheduling Example

```bash
# cron job for hourly refresh
0 * * * * psql -d mydb -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales;"

# With logging
0 * * * * /usr/bin/psql -d mydb -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales;" >> /var/log/mv_refresh.log 2>&1
```

### MySQL Alternative (Summary Tables)

```sql
-- MySQL doesn't have native materialized views
-- Use summary tables with scheduled refresh

CREATE TABLE summary_daily_sales (
    sale_date DATE PRIMARY KEY,
    product_id INT,
    total_quantity INT,
    total_amount DECIMAL(10,2),
    order_count INT,
    refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (sale_date, product_id)
);

-- Refresh procedure
DELIMITER //
CREATE PROCEDURE refresh_daily_sales()
BEGIN
    TRUNCATE TABLE summary_daily_sales;
    INSERT INTO summary_daily_sales (sale_date, product_id, total_quantity, total_amount, order_count)
    SELECT
        DATE(created_at),
        product_id,
        SUM(quantity),
        SUM(amount),
        COUNT(*)
    FROM orders
    GROUP BY DATE(created_at), product_id;
END //
DELIMITER ;

-- Schedule with MySQL Event Scheduler
CREATE EVENT refresh_daily_sales_event
ON SCHEDULE EVERY 1 HOUR
DO CALL refresh_daily_sales();
```

---

## TABLE PARTITIONING

### Partitioning Decision Matrix

| Table Size | Query Pattern | Partition? | Strategy |
|------------|---------------|------------|----------|
| < 10M rows | Any | ❌ No | Index optimization sufficient |
| 10M-100M | Time-based queries | ✅ Yes | Range by date |
| 10M-100M | Category-based queries | ✅ Yes | List by category |
| > 100M | Mixed patterns | ✅ Yes | Composite (range + list) |
| Any | Full table scans | ❌ No | Partitioning won't help |

### PostgreSQL Partitioning

```sql
-- Range partitioning by date (most common)
CREATE TABLE orders (
    id BIGSERIAL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    amount DECIMAL(10,2),
    status VARCHAR(20)
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE orders_2024_q1 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

CREATE TABLE orders_2024_q3 PARTITION OF orders
    FOR VALUES FROM ('2024-07-01') TO ('2024-10-01');

CREATE TABLE orders_2024_q4 PARTITION OF orders
    FOR VALUES FROM ('2024-10-01') TO ('2025-01-01');

-- Default partition for overflow
CREATE TABLE orders_default PARTITION OF orders DEFAULT;

-- Index on partitioned table (automatically created on each partition)
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- List partitioning by category
CREATE TABLE products (
    id BIGSERIAL,
    name VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2)
) PARTITION BY LIST (category);

CREATE TABLE products_electronics PARTITION OF products
    FOR VALUES IN ('electronics', 'computers', 'phones');

CREATE TABLE products_clothing PARTITION OF products
    FOR VALUES IN ('clothing', 'shoes', 'accessories');

CREATE TABLE products_other PARTITION OF products DEFAULT;
```

### Partition Maintenance

```sql
-- Create new partition before it's needed
CREATE TABLE orders_2025_q1 PARTITION OF orders
    FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');

-- Detach old partition (for archiving)
ALTER TABLE orders DETACH PARTITION orders_2023_q1;

-- Archive to cold storage
-- (Move to slower/cheaper storage, compress, etc.)

-- Drop old partition (careful!)
DROP TABLE orders_2023_q1;

-- Check partition pruning in EXPLAIN
EXPLAIN (ANALYZE, COSTS)
SELECT * FROM orders
WHERE created_at >= '2024-07-01' AND created_at < '2024-08-01';
-- Should show only orders_2024_q3 partition being scanned
```

### MySQL Partitioning

```sql
-- Range partitioning in MySQL
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    amount DECIMAL(10,2),
    PRIMARY KEY (id, created_at)  -- Partition key must be in PK
) PARTITION BY RANGE (YEAR(created_at) * 100 + MONTH(created_at)) (
    PARTITION p202401 VALUES LESS THAN (202402),
    PARTITION p202402 VALUES LESS THAN (202403),
    PARTITION p202403 VALUES LESS THAN (202404),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);

-- Add new partition
ALTER TABLE orders ADD PARTITION (
    PARTITION p202404 VALUES LESS THAN (202405)
);

-- Reorganize default partition
ALTER TABLE orders REORGANIZE PARTITION pmax INTO (
    PARTITION p202404 VALUES LESS THAN (202405),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);

-- Drop old partition
ALTER TABLE orders DROP PARTITION p202301;
```

### Partition Pruning Verification

```sql
-- PostgreSQL: Check partition pruning
EXPLAIN (ANALYZE)
SELECT COUNT(*) FROM orders
WHERE created_at BETWEEN '2024-07-01' AND '2024-07-31';

-- Look for:
-- "Append" node with only relevant partitions
-- NOT "Seq Scan on orders" (full table scan)

-- MySQL: Check partition pruning
EXPLAIN SELECT COUNT(*) FROM orders
WHERE created_at BETWEEN '2024-07-01' AND '2024-07-31';
-- Check 'partitions' column shows only relevant partitions
```

### Automated Partition Management

```sql
-- PostgreSQL: pg_partman extension (recommended)
-- Installation: CREATE EXTENSION pg_partman;

SELECT partman.create_parent(
    p_parent_table => 'public.orders',
    p_control => 'created_at',
    p_type => 'native',
    p_interval => 'monthly',
    p_premake => 3  -- Create 3 months ahead
);

-- Configure retention (auto-drop old partitions)
UPDATE partman.part_config
SET retention = '12 months',
    retention_keep_table = false
WHERE parent_table = 'public.orders';

-- Run maintenance (schedule via cron)
SELECT partman.run_maintenance();
```

---

## EXPLAIN ANALYZE GUIDE

### PostgreSQL

```sql
-- Basic EXPLAIN
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- With execution statistics
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Detailed output (recommended for analysis)
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM users WHERE email = 'test@example.com';

-- Without actually executing (for dangerous queries)
EXPLAIN (COSTS, VERBOSE)
SELECT * FROM users WHERE email = 'test@example.com';
```

### MySQL

```sql
-- Basic EXPLAIN
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- Extended format
EXPLAIN FORMAT=JSON SELECT * FROM users WHERE email = 'test@example.com';

-- With actual execution (MySQL 8.0.18+)
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Show warnings after EXPLAIN
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
SHOW WARNINGS;
```

### SQLite

```sql
-- Query plan
EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'test@example.com';

-- Detailed bytecode (advanced)
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

---

## EXECUTION PLAN ANALYSIS

### Key Metrics to Examine

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| **Seq Scan** | Small tables (<1K rows) | Medium tables | Large tables |
| **Index Scan** | Always preferred | - | - |
| **Nested Loop** | Small inner tables | Medium tables | Large tables both |
| **Hash Join** | Equal-sized tables | Very large hash | Memory exceeded |
| **Sort** | Uses index | Disk sort | Very large sort |
| **Rows** | Close to actual | 10x difference | 100x+ difference |

### Plan Node Types (PostgreSQL)

```markdown
## Sequential Scan (Seq Scan)
- Full table scan
- Warning: Table > 10K rows
- Fix: Add appropriate index

## Index Scan
- Uses index to find rows
- Best for selective queries
- Check: Index actually being used

## Index Only Scan
- Data retrieved from index alone
- Best possible scenario
- Requires VACUUM for visibility map

## Bitmap Index Scan
- Creates bitmap from index
- Good for: OR conditions, multiple indexes
- Watch: Recheck condition

## Nested Loop
- For each outer row, scan inner
- Good when: Inner is small/indexed
- Bad when: Both sides large

## Hash Join
- Builds hash table from one side
- Good for: Large equal joins
- Watch: work_mem usage

## Merge Join
- Both sides sorted, merge
- Good for: Large sorted datasets
- Requires: Both sides sorted
```

### Red Flags in Execution Plans

```markdown
## 🚨 CRITICAL
- Seq Scan on table > 100K rows
- Nested Loop with large tables
- "Sort Method: external merge Disk"
- Rows estimate off by 100x+

## ⚠️ WARNING
- Bitmap Heap Scan with high "Recheck Cond" rows
- Hash Join with "Batches: X" (spilling to disk)
- Filter removing > 90% of rows
- Multiple sequential scans in one query

## ✅ GOOD SIGNS
- Index Only Scan
- Rows actual ≈ Rows estimated
- "Heap Fetches: 0" for Index Only Scan
- Small actual time values
```

---

## COMMON OPTIMIZATION PATTERNS

### N+1 Query Detection

```markdown
## Pattern Detection
Look for:
- Multiple similar queries in sequence
- Loop-generated queries
- ORM lazy loading patterns

## Example (Bad)
\`\`\`sql
-- Query 1: Get all orders
SELECT * FROM orders WHERE user_id = 1;

-- Query 2-N: Get items for each order (N times!)
SELECT * FROM order_items WHERE order_id = 101;
SELECT * FROM order_items WHERE order_id = 102;
SELECT * FROM order_items WHERE order_id = 103;
-- ... repeated N times
\`\`\`

## Solution
\`\`\`sql
-- Single query with JOIN
SELECT o.*, oi.*
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = 1;

-- Or with IN clause
SELECT * FROM order_items
WHERE order_id IN (101, 102, 103, ...);
\`\`\`
```

### Missing Index Detection

```sql
-- PostgreSQL: Find missing indexes
SELECT
    schemaname || '.' || relname AS table,
    seq_scan,
    seq_tup_read,
    idx_scan,
    CASE
        WHEN seq_scan > 0
        THEN round(seq_tup_read::numeric / seq_scan, 2)
        ELSE 0
    END AS avg_seq_tup_read
FROM pg_stat_user_tables
WHERE seq_scan > 100  -- Tables with many seq scans
AND seq_tup_read / GREATEST(seq_scan, 1) > 1000  -- Reading many rows per scan
ORDER BY seq_tup_read DESC
LIMIT 20;

-- MySQL: Tables without indexes being used
SELECT
    t.TABLE_SCHEMA,
    t.TABLE_NAME,
    t.TABLE_ROWS,
    IFNULL(i.index_count, 0) AS index_count
FROM information_schema.TABLES t
LEFT JOIN (
    SELECT TABLE_SCHEMA, TABLE_NAME, COUNT(*) AS index_count
    FROM information_schema.STATISTICS
    GROUP BY TABLE_SCHEMA, TABLE_NAME
) i ON t.TABLE_SCHEMA = i.TABLE_SCHEMA AND t.TABLE_NAME = i.TABLE_NAME
WHERE t.TABLE_TYPE = 'BASE TABLE'
AND t.TABLE_ROWS > 10000
AND IFNULL(i.index_count, 0) < 2
ORDER BY t.TABLE_ROWS DESC;
```

### Unused Index Detection

```sql
-- PostgreSQL: Find unused indexes
SELECT
    schemaname || '.' || relname AS table,
    indexrelname AS index,
    pg_size_pretty(pg_relation_size(indexrelid)) AS size,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexrelname NOT LIKE '%_pkey'  -- Exclude primary keys
ORDER BY pg_relation_size(indexrelid) DESC;

-- MySQL: Unused indexes (requires performance_schema)
SELECT
    object_schema,
    object_name AS table_name,
    index_name,
    count_read,
    count_write
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE index_name IS NOT NULL
AND count_read = 0
AND object_schema NOT IN ('mysql', 'performance_schema')
ORDER BY count_write DESC;
```

---

## INDEX RECOMMENDATION TEMPLATE

```markdown
## Index Recommendation: [Table].[Column(s)]

### Problem
- Query: `SELECT ... FROM table WHERE column = ?`
- Current plan: Sequential Scan
- Rows scanned: 1,000,000
- Execution time: 2.5s

### Proposed Index
\`\`\`sql
CREATE INDEX CONCURRENTLY idx_table_column
ON table (column);
\`\`\`

### Expected Improvement
- Plan change: Seq Scan → Index Scan
- Estimated rows scanned: 100
- Expected execution time: 5ms

### Trade-offs
- Disk space: ~50MB
- Write overhead: ~5% on INSERT/UPDATE
- Maintenance: Included in regular VACUUM

### Validation Query
\`\`\`sql
EXPLAIN ANALYZE
SELECT ... FROM table WHERE column = ?;
-- Verify Index Scan is used
\`\`\`
```

---

## SLOW QUERY ANALYSIS

### PostgreSQL Slow Query Log

```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = '1000';  -- Log queries > 1s
ALTER SYSTEM SET log_statement = 'none';  -- Only slow queries
SELECT pg_reload_conf();

-- Query pg_stat_statements (if enabled)
SELECT
    query,
    calls,
    round(total_exec_time::numeric, 2) AS total_ms,
    round(mean_exec_time::numeric, 2) AS mean_ms,
    round(stddev_exec_time::numeric, 2) AS stddev_ms,
    rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
```

### MySQL Slow Query Log

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- Queries > 1s
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- Query performance_schema
SELECT
    DIGEST_TEXT,
    COUNT_STAR,
    ROUND(SUM_TIMER_WAIT/1000000000000, 3) AS total_sec,
    ROUND(AVG_TIMER_WAIT/1000000000000, 3) AS avg_sec,
    SUM_ROWS_EXAMINED,
    SUM_ROWS_SENT
FROM performance_schema.events_statements_summary_by_digest
ORDER BY SUM_TIMER_WAIT DESC
LIMIT 20;
```

### Slow Query Report Template

```markdown
## Slow Query Analysis Report

### Query Profile

| Metric | Value |
|--------|-------|
| Query | `SELECT ...` |
| Avg Execution Time | 2.5s |
| Calls per Day | 1,000 |
| Total Time per Day | 41 minutes |
| Rows Examined | 1,000,000 |
| Rows Returned | 10 |

### Execution Plan Analysis

\`\`\`
Seq Scan on users  (cost=0.00..50000.00 rows=1000000 width=100)
  Filter: (status = 'active')
  Rows Removed by Filter: 999990
\`\`\`

### Root Cause
- No index on `status` column
- Filter removes 99.999% of rows (extremely low selectivity after scan)

### Recommendations

1. **Add index** (High Impact)
   \`\`\`sql
   CREATE INDEX CONCURRENTLY idx_users_status ON users(status);
   \`\`\`

2. **Consider partial index** (If status='active' is common query)
   \`\`\`sql
   CREATE INDEX CONCURRENTLY idx_users_active
   ON users(id) WHERE status = 'active';
   \`\`\`

### Expected Improvement
- Execution time: 2.5s → 5ms (500x faster)
- Rows examined: 1M → 10 (100,000x fewer)
```

---

## DATABASE-SPECIFIC OPTIMIZATIONS

### PostgreSQL

```markdown
## Configuration Tuning
- `shared_buffers`: 25% of RAM
- `work_mem`: RAM / max_connections / 4
- `effective_cache_size`: 75% of RAM
- `random_page_cost`: 1.1 for SSD, 4.0 for HDD

## Maintenance
- Regular VACUUM ANALYZE
- Consider VACUUM FREEZE for old data
- Monitor bloat with pg_stat_user_tables

## Advanced Features
- Partial indexes for common filters
- Covering indexes (INCLUDE clause)
- BRIN indexes for time-series data
- Expression indexes for computed columns
```

### MySQL

```markdown
## Configuration Tuning
- `innodb_buffer_pool_size`: 70% of RAM
- `innodb_log_file_size`: 256M - 2G
- `query_cache_size`: 0 (disabled in MySQL 8.0)
- `tmp_table_size` / `max_heap_table_size`: 64M-256M

## Maintenance
- ANALYZE TABLE for statistics
- OPTIMIZE TABLE for fragmentation
- pt-online-schema-change for live DDL

## Advanced Features
- Invisible indexes for testing
- Descending indexes (8.0+)
- Functional indexes (8.0+)
- JSON indexes
```

### SQLite

```markdown
## Configuration
- PRAGMA journal_mode = WAL;
- PRAGMA synchronous = NORMAL;
- PRAGMA cache_size = -64000;  -- 64MB
- PRAGMA temp_store = MEMORY;

## Optimization
- ANALYZE after bulk operations
- VACUUM to defragment
- Use covering indexes for read-heavy queries

## Limitations
- No parallel query execution
- Limited concurrent writes
- No partial indexes before 3.8.0
```

---

## QUERY PLAN VISUALIZATION (Canvas Integration)

### Mermaid Output for EXPLAIN

Tunerはクエリ実行計画をMermaid図として出力し、Canvasと連携できます。

**Request to Canvas:**
```markdown
/Canvas visualize query plan

Query: SELECT * FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE u.status = 'active'
       ORDER BY o.created_at DESC
       LIMIT 10;

Plan nodes:
1. Limit (10 rows)
2. Sort (created_at DESC) - 500ms
3. Hash Join - 200ms
4. Seq Scan users (filter: status='active') - 800ms ← BOTTLENECK
5. Index Scan orders (user_id) - 50ms
```

**Canvas Output (Mermaid):**
```mermaid
graph TD
    subgraph Query Plan
        A[Limit: 10 rows<br/>0.1ms] --> B[Sort: created_at DESC<br/>500ms]
        B --> C[Hash Join<br/>200ms]
        C --> D[Seq Scan: users<br/>filter: status='active'<br/>🔴 800ms]
        C --> E[Index Scan: orders<br/>idx_orders_user_id<br/>✅ 50ms]
    end

    style D fill:#ff6b6b,color:#fff
    style E fill:#51cf66,color:#fff
```

### Execution Plan Comparison (Before/After)

```mermaid
graph LR
    subgraph Before [Before: 1550ms]
        B1[Seq Scan users] --> B2[Hash Join]
        B2 --> B3[Sort]
    end

    subgraph After [After: 55ms]
        A1[Index Scan users] --> A2[Nested Loop]
        A2 --> A3[Index Scan orders]
    end

    Before -->|Add Index| After
```

---

## N+1 QUERY AUTO-DETECTION

### Log Pattern Analysis

**Rails ActiveRecord:**
```
# N+1 Pattern in logs
Started GET "/orders" for 127.0.0.1
Processing by OrdersController#index
  Order Load (0.5ms)  SELECT "orders".* FROM "orders"
  User Load (0.3ms)  SELECT "users".* FROM "users" WHERE "users"."id" = 1
  User Load (0.3ms)  SELECT "users".* FROM "users" WHERE "users"."id" = 2
  User Load (0.3ms)  SELECT "users".* FROM "users" WHERE "users"."id" = 3
  # ... repeated N times
Completed 200 OK in 2500ms
```

**Detection Command:**
```bash
# Find repeated SELECT patterns
grep -oP 'SELECT.*FROM.*WHERE.*id = \d+' rails.log | \
  sed 's/id = [0-9]*/id = ?/' | \
  sort | uniq -c | sort -rn | head -20

# Output interpretation:
#  50 SELECT "users".* FROM "users" WHERE "users"."id" = ?
#     ↑ N+1 detected: 50 identical queries with different IDs
```

**Prisma/TypeORM:**
```
# Enable query logging
prisma:query SELECT * FROM Order WHERE userId = ?
prisma:query SELECT * FROM User WHERE id = 1
prisma:query SELECT * FROM User WHERE id = 2
prisma:query SELECT * FROM User WHERE id = 3
```

### N+1 Detection Checklist

```markdown
## N+1 Detection Report

### Symptoms
- [ ] Page load > 1s with multiple DB queries
- [ ] Similar queries repeated with different IDs
- [ ] Query count scales with data size (N records = N+1 queries)

### Identified Patterns

| Location | Pattern | Query Count | Impact |
|----------|---------|-------------|--------|
| OrderService.list() | User lookup per order | 50/page | HIGH |
| ProductController.show() | Review fetch per product | 20/product | MEDIUM |

### Fix Recommendations

| Pattern | Current | Recommended | ORM Example |
|---------|---------|-------------|-------------|
| Lazy load | N+1 queries | Eager load | `include: { user: true }` |
| Loop query | N queries | Batch query | `WHERE id IN (...)` |
| Nested load | N*M queries | JOIN | `leftJoinAndSelect()` |
```

### Automated N+1 Detection Script

```javascript
// Middleware to detect N+1 in development
const queryLog = [];
const N1_THRESHOLD = 5;

prisma.$use(async (params, next) => {
  const key = `${params.model}.${params.action}`;
  queryLog.push({ key, timestamp: Date.now() });

  // Detect repeated queries in 100ms window
  const recent = queryLog.filter(q =>
    q.key === key && Date.now() - q.timestamp < 100
  );

  if (recent.length >= N1_THRESHOLD) {
    console.warn(`⚠️ N+1 detected: ${key} called ${recent.length} times`);
  }

  return next(params);
});
```

---

## BENCHMARK TEMPLATES

### PostgreSQL (pgbench)

```bash
# Initialize benchmark tables
pgbench -i -s 10 mydb

# Run read-only benchmark
pgbench -c 10 -j 2 -T 60 -S mydb

# Run custom query benchmark
pgbench -c 10 -j 2 -t 1000 -f custom_query.sql mydb

# custom_query.sql
\set user_id random(1, 100000)
SELECT * FROM orders WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 10;
```

### MySQL (sysbench)

```bash
# Prepare
sysbench oltp_read_write \
  --mysql-host=localhost \
  --mysql-db=mydb \
  --mysql-user=root \
  --tables=10 \
  --table-size=100000 \
  prepare

# Run
sysbench oltp_read_write \
  --mysql-host=localhost \
  --mysql-db=mydb \
  --mysql-user=root \
  --threads=4 \
  --time=60 \
  run

# Cleanup
sysbench oltp_read_write cleanup
```

### Benchmark Report Template

```markdown
## Benchmark Results: [Test Name]

### Environment
| Item | Value |
|------|-------|
| Database | PostgreSQL 15 |
| CPU | 4 cores |
| RAM | 16GB |
| Storage | SSD |
| Data Size | 1M rows |

### Results

| Metric | Before | After | Δ |
|--------|--------|-------|---|
| TPS | 100 | 500 | +400% |
| Avg Latency | 50ms | 10ms | -80% |
| P99 Latency | 200ms | 30ms | -85% |
| CPU Usage | 80% | 40% | -50% |

### Observations
- Index on `user_id` improved TPS by 400%
- P99 latency reduced significantly
- CPU usage dropped due to fewer full table scans
```

---

## CACHE INTEGRATION STRATEGY

### Cache Decision Matrix

| Query Type | Frequency | Volatility | Recommended Cache |
|------------|-----------|------------|-------------------|
| User profile | High | Low | Redis (TTL: 1hr) |
| Product catalog | High | Medium | Redis (TTL: 10min) |
| Search results | High | High | Application (TTL: 1min) |
| Analytics | Low | Low | Materialized view |
| Real-time data | High | High | No cache |

### Redis Cache Pattern

```typescript
// Cache-aside pattern
async function getUserWithCache(userId: string): Promise<User> {
  const cacheKey = `user:${userId}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fallback to database
  const user = await db.user.findUnique({ where: { id: userId } });

  // Store in cache
  await redis.setex(cacheKey, 3600, JSON.stringify(user));

  return user;
}

// Cache invalidation
async function updateUser(userId: string, data: UpdateUserDto) {
  await db.user.update({ where: { id: userId }, data });
  await redis.del(`user:${userId}`);  // Invalidate cache
}
```

### Query Result Caching with ORM

```typescript
// Prisma with Redis cache
import { createPrismaRedisCache } from 'prisma-redis-middleware';

const cacheMiddleware = createPrismaRedisCache({
  models: [
    { model: 'User', cacheTime: 3600 },
    { model: 'Product', cacheTime: 600 },
  ],
  storage: { type: 'redis', options: { client: redisClient } },
});

prisma.$use(cacheMiddleware);
```

---

## ORM OPTIMIZATION PATTERNS

### Common ORM Issues

```markdown
## N+1 Problem
**Symptom**: Many small queries in loop
**Fix**: Eager loading / JOIN fetch

## Over-fetching
**Symptom**: SELECT * when only few columns needed
**Fix**: Select specific columns

## Under-indexed
**Symptom**: WHERE on non-indexed columns
**Fix**: Add indexes for query patterns

## Implicit Type Conversion
**Symptom**: Index not used due to type mismatch
**Fix**: Ensure consistent types
```

### ORM-Specific Recommendations

```typescript
// Prisma - Use include for eager loading
const users = await prisma.user.findMany({
  include: {
    posts: true,  // Eager load posts
  },
});

// TypeORM - Use relations or QueryBuilder
const users = await userRepository.find({
  relations: ['posts'],
});

// Drizzle - Use with for joins
const result = await db.query.users.findMany({
  with: {
    posts: true,
  },
});
```

---

## PERFORMANCE REPORT TEMPLATE

```markdown
## Database Performance Report

### Executive Summary

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Avg Query Time | 500ms | 50ms | 90% |
| Slow Queries/hr | 100 | 5 | 95% |
| Index Usage | 60% | 95% | 58% |
| Disk I/O | 80% | 30% | 62% |

### Top Issues Identified

1. **Missing index on users.email** - 40% of slow queries
2. **N+1 in orders listing** - 100+ queries per page
3. **Full table scan on logs** - 10M+ rows scanned

### Changes Applied

#### Index Additions
\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);
\`\`\`

#### Query Rewrites
- Converted lazy loading to eager loading in OrderService
- Added pagination to log queries

### Validation Results

| Query | Before | After | Status |
|-------|--------|-------|--------|
| User lookup | 200ms | 2ms | ✅ |
| Order listing | 5s | 100ms | ✅ |
| Log search | 30s | 500ms | ✅ |

### Recommendations for Future

1. Set up slow query monitoring
2. Regular index usage review
3. Query pattern analysis before new features
```

---


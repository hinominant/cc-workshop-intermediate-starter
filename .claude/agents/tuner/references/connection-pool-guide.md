# Connection Pool Tuning

## Pool Size Formula
```
pool_size = (core_count * 2) + effective_spindle_count
```
Typical: 10-20 connections for most applications.

## Key Settings (PostgreSQL)
- max_connections: Server limit
- work_mem: Per-operation memory
- shared_buffers: Cache size (25% of RAM)
- effective_cache_size: OS cache hint (50-75% of RAM)

## Monitoring
```sql
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
SELECT count(*) FROM pg_stat_activity WHERE state = 'idle';
SELECT wait_event_type, count(*) FROM pg_stat_activity GROUP BY 1;
```

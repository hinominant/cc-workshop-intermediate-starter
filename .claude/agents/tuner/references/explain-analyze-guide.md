# EXPLAIN ANALYZE Guide

## Reading Execution Plans

Key metrics:
- **Actual Time:** Real execution time (ms)
- **Rows:** Actual vs estimated rows
- **Loops:** Number of iterations
- **Buffers:** Shared hit/read counts

## Common Node Types

| Node | Meaning | Concern |
|------|---------|---------|
| Seq Scan | Full table scan | Missing index |
| Index Scan | Index lookup | Good |
| Index Only Scan | Covered by index | Best |
| Nested Loop | Row-by-row join | OK for small sets |
| Hash Join | Hash-based join | Good for large sets |
| Sort | In-memory/disk sort | Check work_mem |

## Red Flags
- Seq Scan on large tables
- Estimated vs actual rows differ > 10x
- Sort using disk (external merge)
- Nested Loop with large outer set

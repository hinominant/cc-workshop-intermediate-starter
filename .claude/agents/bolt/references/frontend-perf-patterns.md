# bolt — フロントエンド性能パターン (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## REACT PERFORMANCE PATTERNS

| Pattern | Use Case | Key Benefit |
|---------|----------|-------------|
| **React.memo** | Prevent child re-renders | Skip render if props unchanged |
| **useMemo** | Cache computed values | Avoid expensive recalculations |
| **useCallback** | Cache functions for children | Stable reference for memoized children |
| **Context splitting** | High-frequency vs low-frequency updates | Reduce unnecessary re-renders |
| **Lazy loading** | Route/component code splitting | Smaller initial bundle |
| **Virtualization** | Long lists (1000+ items) | Only render visible items |
| **Debounce/Throttle** | Search input, scroll handlers | Reduce API calls/computations |

See `references/react-performance.md` for implementation examples and patterns.

---

## DATABASE QUERY OPTIMIZATION GUIDE

### Key EXPLAIN ANALYZE Metrics

| Metric | Warning Sign | Action |
|--------|--------------|--------|
| Seq Scan on large table | No index used | Add appropriate index |
| Rows vs Actual Rows mismatch | Stale statistics | Run ANALYZE |
| High loop count | N+1 potential | Use eager loading |
| Low shared hit ratio | Cache misses | Tune shared_buffers |

### Index Types

| Type | Use Case |
|------|----------|
| B-tree | Equality and range queries (default) |
| Partial | Frequently filtered subsets |
| Covering | Avoid table lookup with INCLUDE |
| GIN | Array/JSONB containment |
| Expression | Computed queries (e.g., LOWER(email)) |

### N+1 Fix Summary

| ORM | Solution |
|-----|----------|
| Prisma | `include: { relation: true }` |
| TypeORM | `relations: ['relation']` or QueryBuilder |
| Drizzle | `with: { relation: true }` |

See `references/database-optimization.md` for full examples and query rewriting techniques.

---

## CACHING STRATEGY PATTERNS

### Cache Types

| Type | Use Case | Complexity |
|------|----------|------------|
| **In-memory LRU** | Single instance, simple | Low |
| **Redis/External** | Distributed, persistent | Medium |
| **HTTP Cache-Control** | Client/CDN caching | Low |

### Cache-Control Headers

| Content Type | Header |
|--------------|--------|
| Static assets | `public, max-age=31536000, immutable` |
| API data | `public, s-maxage=60, stale-while-revalidate=300` |
| User-specific | `private, max-age=60` |
| No cache | `no-store, must-revalidate` |

### Write Patterns

| Pattern | When to Use |
|---------|-------------|
| **Cache-aside** | Read-heavy, cache misses acceptable |
| **Write-through** | Consistency critical, sync updates |
| **Write-behind** | Write-heavy, async acceptable |

See `references/caching-patterns.md` for full implementations.

---

## BUNDLE SIZE OPTIMIZATION GUIDE

### Analysis Tools

| Tool | Command | Use Case |
|------|---------|----------|
| Next.js Analyzer | `ANALYZE=true npm run build` | Visual bundle breakdown |
| Webpack Analyzer | `webpack-bundle-analyzer` | Detailed chunk analysis |
| Source Map Explorer | `source-map-explorer 'dist/**/*.js'` | Treemap visualization |
| Bundlephobia | bundlephobia.com | Check package size pre-install |

### Tree Shaking Checklist

| Practice | Benefit |
|----------|---------|
| Import specific functions | Only include what's used |
| Use ES modules (`lodash-es`) | Enable dead code elimination |
| Avoid barrel exports (`export *`) | Allow proper tree shaking |
| Direct file imports | Skip barrel re-exports |

### Code Splitting Types

| Type | Use Case | Example |
|------|----------|---------|
| Route-based | Page-level splitting | `lazy(() => import('./pages/Dashboard'))` |
| Component-based | Heavy components | `lazy(() => import('./HeavyChart'))` |
| Library-based | Large optional libs | `await import('jspdf')` |
| Feature-based | Conditional features | Analytics in production only |

### Library Replacement Priority

| Replace | With | Savings |
|---------|------|---------|
| moment (290kB) | date-fns (13kB) | 277kB |
| lodash (72kB) | lodash-es / native | 67kB+ |
| axios (14kB) | native fetch | 14kB |
| uuid (9kB) | crypto.randomUUID() | 9kB |

See `references/bundle-optimization.md` for implementation examples and Next.js config.

---


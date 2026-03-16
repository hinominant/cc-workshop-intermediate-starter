# Caching Strategy Reference for Harvest

Caching strategies to improve performance and reduce API load during PR data collection.

---

## Cache Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Harvest Agent                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐    ┌──────────────┐              │
│  │  Request     │───▶│  Cache       │              │
│  │  Handler     │    │  Layer       │              │
│  └──────────────┘    └──────┬───────┘              │
│                             │                       │
│         ┌───────────────────┼───────────────────┐  │
│         ▼                   ▼                   ▼  │
│  ┌────────────┐     ┌────────────┐     ┌────────────┐
│  │  PR Cache  │     │ User Cache │     │Query Cache │
│  │  TTL: 5min │     │ TTL: 1hr   │     │ TTL: 15min │
│  └────────────┘     └────────────┘     └────────────┘
│         │                   │                   │   │
│         └───────────────────┼───────────────────┘   │
│                             ▼                       │
│                    ┌──────────────┐                 │
│                    │ File-based   │                 │
│                    │ Storage      │                 │
│                    │ .harvest/    │                 │
│                    └──────────────┘                 │
└─────────────────────────────────────────────────────┘
```

---

## Cache Types and TTL Configuration

| Cache Type | TTL | Storage | Use Case |
|------------|:---:|---------|----------|
| **PR List** | 5 min | File | Recent PR queries |
| **PR Details** | 15 min | File | Individual PR metadata |
| **User Stats** | 1 hour | File | Author contribution data |
| **Repository Info** | 24 hours | File | Repo metadata (rarely changes) |
| **Query Results** | 15 min | File | Aggregated query results |
| **Rate Limit** | 1 min | Memory | API quota tracking |

---

## Cache Key Structure

### PR List Cache

```bash
# Key format: {repo}:{state}:{limit}:{filters_hash}
# Example: org/project:merged:100:a1b2c3d4

generate_pr_list_cache_key() {
  local repo="$1"
  local state="${2:-all}"
  local limit="${3:-100}"
  local filters="$4"

  local filters_hash=$(echo "$filters" | md5sum | cut -c1-8)
  echo "${repo//\//_}:${state}:${limit}:${filters_hash}"
}
```

### Query Result Cache

```bash
# Key format: {repo}:{query_type}:{date_range}:{hash}
# Example: org_project:weekly_summary:2024-01-08_2024-01-15:f5e6d7c8

generate_query_cache_key() {
  local repo="$1"
  local query_type="$2"
  local start_date="$3"
  local end_date="$4"

  echo "${repo//\//_}:${query_type}:${start_date}_${end_date}"
}
```

---

## Storage Implementation

### Directory Structure

```
.harvest/
├── cache/
│   ├── pr-lists/
│   │   ├── org_project-merged-100-a1b2c3d4.json
│   │   └── org_project-all-200-b2c3d4e5.json
│   ├── pr-details/
│   │   ├── org_project-123.json
│   │   └── org_project-124.json
│   ├── users/
│   │   └── org_project-contributors.json
│   ├── queries/
│   │   └── org_project-weekly_summary-2024-01-08_2024-01-15.json
│   └── meta/
│       └── cache-index.json
└── last-sync.json
```

### Cache Index Format

```json
{
  "version": "1.0",
  "entries": [
    {
      "key": "org_project:merged:100:a1b2c3d4",
      "file": "pr-lists/org_project-merged-100-a1b2c3d4.json",
      "created_at": "2024-01-15T10:00:00Z",
      "expires_at": "2024-01-15T10:05:00Z",
      "size_bytes": 45678,
      "hit_count": 3
    }
  ],
  "stats": {
    "total_entries": 15,
    "total_size_bytes": 234567,
    "hit_rate": 0.72,
    "last_cleanup": "2024-01-15T09:00:00Z"
  }
}
```

---

## Cache Operations

### Write to Cache

```bash
# Write data to cache with TTL
cache_write() {
  local cache_dir="${HARVEST_CACHE_DIR:-.harvest/cache}"
  local category="$1"  # pr-lists, pr-details, users, queries
  local key="$2"
  local data="$3"
  local ttl_seconds="${4:-300}"  # Default 5 minutes

  local cache_path="$cache_dir/$category"
  mkdir -p "$cache_path"

  local file_path="$cache_path/${key}.json"
  local expires_at=$(date -u -d "+${ttl_seconds} seconds" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || \
                     date -u -v+${ttl_seconds}S +%Y-%m-%dT%H:%M:%SZ)

  # Write with metadata wrapper
  jq -n --arg data "$data" --arg expires "$expires_at" \
    '{meta: {expires_at: $expires, cached_at: now | strftime("%Y-%m-%dT%H:%M:%SZ")}, data: ($data | fromjson)}' \
    > "$file_path"

  echo "$file_path"
}
```

### Read from Cache

```bash
# Read from cache if valid
cache_read() {
  local cache_dir="${HARVEST_CACHE_DIR:-.harvest/cache}"
  local category="$1"
  local key="$2"

  local file_path="$cache_dir/$category/${key}.json"

  if [ ! -f "$file_path" ]; then
    return 1  # Cache miss
  fi

  # Check expiration
  local expires_at=$(jq -r '.meta.expires_at' "$file_path" 2>/dev/null)
  local now=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  if [[ "$now" > "$expires_at" ]]; then
    rm -f "$file_path"  # Clean up expired
    return 1  # Cache expired
  fi

  # Return cached data
  jq '.data' "$file_path"
  return 0
}
```

### Cache-Aware Fetch

```bash
# Fetch with cache support
fetch_prs_cached() {
  local repo="$1"
  local state="${2:-merged}"
  local limit="${3:-100}"
  local filters="$4"

  local cache_key=$(generate_pr_list_cache_key "$repo" "$state" "$limit" "$filters")

  # Try cache first
  local cached_data
  if cached_data=$(cache_read "pr-lists" "$cache_key"); then
    echo "CACHE_HIT: $cache_key" >&2
    echo "$cached_data"
    return 0
  fi

  echo "CACHE_MISS: $cache_key, fetching from API..." >&2

  # Fetch from API
  local api_data
  api_data=$(gh pr list -R "$repo" --state "$state" --limit "$limit" \
    --json number,title,state,author,createdAt,mergedAt,additions,deletions)

  if [ $? -ne 0 ]; then
    return 1
  fi

  # Write to cache (5 min TTL for PR lists)
  cache_write "pr-lists" "$cache_key" "$api_data" 300

  echo "$api_data"
}
```

---

## TTL Configuration by Data Type

### PR List Cache (5 minutes)

Short TTL because PR state changes frequently (new PRs, merges).

```bash
PR_LIST_TTL=300  # 5 minutes

# For merged-only queries, can use longer TTL
MERGED_PR_LIST_TTL=900  # 15 minutes (merged state is immutable)
```

### PR Details Cache (15 minutes)

Individual PR details change less frequently after initial creation.

```bash
PR_DETAILS_TTL=900  # 15 minutes

# For closed/merged PRs, use longer TTL
CLOSED_PR_DETAILS_TTL=3600  # 1 hour (state is final)
```

### User Statistics Cache (1 hour)

Contributor stats aggregate data, rarely needs real-time accuracy.

```bash
USER_STATS_TTL=3600  # 1 hour
```

### Repository Info Cache (24 hours)

Repository metadata (name, description, visibility) rarely changes.

```bash
REPO_INFO_TTL=86400  # 24 hours
```

---

## Cache Invalidation Triggers

| Trigger | Invalidation Scope | Reason |
|---------|-------------------|--------|
| **PR merged** | PR list cache for repo | New merged PR available |
| **PR created** | Open PR list cache | New PR to include |
| **Manual refresh** | All caches for query | User requested fresh data |
| **Report generation** | None (read-only) | Use cached data if valid |
| **Date range change** | Query result cache | Different data set needed |
| **TTL expiration** | Specific entry | Natural expiration |

### Invalidation Implementation

```bash
# Invalidate specific cache entries
cache_invalidate() {
  local cache_dir="${HARVEST_CACHE_DIR:-.harvest/cache}"
  local pattern="$1"  # glob pattern

  find "$cache_dir" -name "$pattern" -type f -delete
  echo "Invalidated caches matching: $pattern"
}

# Invalidate all caches for a repository
invalidate_repo_cache() {
  local repo="$1"
  local repo_key="${repo//\//_}"

  cache_invalidate "${repo_key}*.json"
}

# Force refresh (invalidate + fetch)
force_refresh_prs() {
  local repo="$1"
  local state="$2"

  invalidate_repo_cache "$repo"
  fetch_prs_cached "$repo" "$state"
}
```

---

## Incremental Collection

Track last sync time to fetch only new/updated PRs.

### Last Sync Tracking

```json
// .harvest/last-sync.json
{
  "org/project": {
    "all_prs": {
      "last_sync": "2024-01-15T10:00:00Z",
      "last_pr_number": 150,
      "total_count": 245
    },
    "merged_prs": {
      "last_sync": "2024-01-15T10:00:00Z",
      "last_merged_at": "2024-01-15T09:45:00Z"
    }
  }
}
```

### Incremental Fetch

```bash
# Fetch only PRs since last sync
fetch_incremental_prs() {
  local repo="$1"
  local sync_file="${HARVEST_CACHE_DIR:-.harvest}/last-sync.json"

  # Get last sync time
  local last_sync=$(jq -r --arg repo "$repo" '.[$repo].all_prs.last_sync // "1970-01-01T00:00:00Z"' "$sync_file" 2>/dev/null)

  echo "Fetching PRs updated since $last_sync..." >&2

  # Fetch only updated PRs
  local new_prs
  new_prs=$(gh pr list -R "$repo" --state all --limit 500 \
    --json number,title,state,author,createdAt,updatedAt,mergedAt,additions,deletions | \
    jq --arg since "$last_sync" '[.[] | select(.updatedAt >= $since)]')

  local count=$(echo "$new_prs" | jq 'length')
  echo "Found $count updated PRs" >&2

  # Update sync time
  local now=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  jq --arg repo "$repo" --arg now "$now" \
    '.[$repo].all_prs.last_sync = $now' "$sync_file" > "${sync_file}.tmp" && \
    mv "${sync_file}.tmp" "$sync_file"

  echo "$new_prs"
}
```

---

## Cache Size Management

### Size Limits

```bash
CACHE_MAX_SIZE_MB=100
CACHE_MAX_ENTRIES=1000
CACHE_MAX_AGE_DAYS=7
```

### Cleanup Strategy

```bash
# Clean up old and oversized cache
cache_cleanup() {
  local cache_dir="${HARVEST_CACHE_DIR:-.harvest/cache}"
  local max_age_days="${1:-7}"
  local max_size_mb="${2:-100}"

  echo "Running cache cleanup..."

  # Remove entries older than max age
  find "$cache_dir" -type f -name "*.json" -mtime +$max_age_days -delete
  echo "Removed files older than $max_age_days days"

  # Check total size
  local total_size=$(du -sm "$cache_dir" 2>/dev/null | cut -f1)

  if [ "$total_size" -gt "$max_size_mb" ]; then
    echo "Cache size ($total_size MB) exceeds limit ($max_size_mb MB)"

    # Remove oldest files until under limit
    while [ "$total_size" -gt "$max_size_mb" ]; do
      local oldest=$(find "$cache_dir" -type f -name "*.json" -printf '%T+ %p\n' | sort | head -1 | cut -d' ' -f2-)
      if [ -n "$oldest" ]; then
        rm -f "$oldest"
        total_size=$(du -sm "$cache_dir" 2>/dev/null | cut -f1)
      else
        break
      fi
    done

    echo "Cache size reduced to $total_size MB"
  fi
}
```

---

## Performance Metrics

### Cache Hit Rate Tracking

```bash
# Track cache performance
track_cache_metrics() {
  local cache_dir="${HARVEST_CACHE_DIR:-.harvest/cache}"
  local metrics_file="$cache_dir/meta/metrics.json"

  mkdir -p "$(dirname "$metrics_file")"

  # Initialize if missing
  if [ ! -f "$metrics_file" ]; then
    echo '{"hits": 0, "misses": 0, "total_requests": 0}' > "$metrics_file"
  fi

  local event="$1"  # "hit" or "miss"

  if [ "$event" = "hit" ]; then
    jq '.hits += 1 | .total_requests += 1' "$metrics_file" > "${metrics_file}.tmp"
  else
    jq '.misses += 1 | .total_requests += 1' "$metrics_file" > "${metrics_file}.tmp"
  fi

  mv "${metrics_file}.tmp" "$metrics_file"
}

# Get cache statistics
get_cache_stats() {
  local cache_dir="${HARVEST_CACHE_DIR:-.harvest/cache}"
  local metrics_file="$cache_dir/meta/metrics.json"

  if [ -f "$metrics_file" ]; then
    jq '{
      hits: .hits,
      misses: .misses,
      hit_rate: (if .total_requests > 0 then (.hits / .total_requests * 100 | floor) else 0 end),
      total_requests: .total_requests
    }' "$metrics_file"
  else
    echo '{"hits": 0, "misses": 0, "hit_rate": 0, "total_requests": 0}'
  fi
}
```

---

## Integration with Guardian Queries

When Guardian requests data, leverage caching:

```yaml
GUARDIAN_TO_HARVEST_HANDOFF:
  request: "release_notes"
  tag_range:
    from: "v1.1.0"
    to: "v1.2.0"
  cache_policy: "prefer_cache"  # Options: prefer_cache, force_refresh, cache_only
```

### Cache Policy Options

| Policy | Behavior |
|--------|----------|
| `prefer_cache` | Use cache if valid, fetch if miss (default) |
| `force_refresh` | Invalidate and fetch fresh data |
| `cache_only` | Return only cached data, fail if miss |
| `no_cache` | Always fetch, don't write to cache |

---

## Expected Performance Impact

| Scenario | Without Cache | With Cache | Improvement |
|----------|:-------------:|:----------:|:-----------:|
| Weekly report (same day) | 5s | 0.5s | **90%** |
| Multiple queries, same repo | 15s total | 5s first + 0.5s each | **60%** |
| Guardian release notes | 3s | 0.5s (cached PRs) | **83%** |
| Large repo (500+ PRs) | 10s | 1s (incremental) | **90%** |
| API rate limit risk | High | Low | **80% reduction** |

# Debugging Strategies

Practical debugging techniques for Scout's investigations. Choose the strategy based on bug characteristics.

---

## Strategy Selection Guide

| Bug Characteristic | Best Strategy |
|-------------------|--------------|
| "It used to work" (regression) | Git Bisect |
| Complex system, unclear which component fails | Divide and Conquer |
| Reproducible with a large input but unclear which part triggers it | Delta Debugging |
| Need to trace data flow through the system | Print/Log Debugging |
| Frontend visual/interaction bug | Browser DevTools |
| Slow query or wrong data returned | Database Query Debugging |
| API integration issue | Network Debugging |

---

## Binary Search Debugging (Git Bisect)

Find the exact commit that introduced a bug by binary-searching through history.

### When to Use
- Bug is a regression (worked at some known-good point)
- Can write a test or script that detects the bug's presence

### Process

```bash
# Start bisect
git bisect start

# Mark current (broken) commit as bad
git bisect bad

# Mark a known-good commit (e.g., last release tag)
git bisect good v2.3.0

# Git checks out a middle commit. Test it.
# If the bug exists:
git bisect bad
# If the bug does not exist:
git bisect good

# Repeat until git identifies the first bad commit.
# Git will output: "<hash> is the first bad commit"

# Automate with a test script:
git bisect run npm test -- --grep "specific test name"

# When done:
git bisect reset
```

### Tips
- Choose a known-good point as far back as practical (100 commits = ~7 steps)
- If a bisect step cannot be tested (build failure), use `git bisect skip`
- For flaky bugs, run the test multiple times in the bisect script

---

## Divide and Conquer

Isolate the failing component by systematically eliminating possibilities.

### Process

1. Identify the full system path from input to failure
2. Split the path in half
3. Test: does the midpoint produce correct output?
4. If midpoint is correct: bug is in the second half
5. If midpoint is wrong: bug is in the first half
6. Repeat on the failing half

### Example: API returns wrong data

```
Full path:
  Client Request -> Router -> Controller -> Service -> Repository -> Database

Step 1: Check at Service layer
  - Call service function directly with known input
  - If service returns correct data: bug is in Controller/Router
  - If service returns wrong data: bug is in Service/Repository/Database

Step 2: Check at Repository layer
  - Query repository directly
  - If repository returns correct data: bug is in Service logic
  - If repository returns wrong data: bug is in Repository/Database

Step 3: Check Database directly
  - Run the SQL query manually
  - If query returns correct data: bug is in Repository mapping
  - If query returns wrong data: bug is in data or query construction
```

---

## Delta Debugging

Minimize the reproduction case to isolate the trigger.

### When to Use
- Bug triggers on a specific input but the input is large/complex
- Need to find the minimal input that triggers the bug

### Process

1. Start with the full failing input
2. Remove half the input. Does it still fail?
   - Yes: keep the smaller input, repeat
   - No: the removed part contains something necessary. Add it back, remove the other half
3. Continue until you find the minimal input that triggers the bug

### Example: JSON payload causes 500 error

```
Original payload: 15 fields
Remove fields 8-15: Still fails -> fields 1-7 sufficient
Remove fields 4-7: Still fails -> fields 1-3 sufficient
Remove field 2: No longer fails -> field 2 is necessary
Remove field 3: Still fails -> fields 1,2 sufficient
Remove field 1: Still fails -> field 2 alone triggers the bug

Result: The bug triggers when field "metadata" contains nested null values.
```

---

## Print/Log Debugging

Adding strategic log statements to trace execution flow and data state.

### Best Practices

```typescript
// BAD: Meaningless log
console.log("here");
console.log(data);

// GOOD: Context-rich log
console.log('[DEBUG][PaymentService.charge] Input:', {
  userId,
  amount,
  currency,
  idempotencyKey,
  timestamp: new Date().toISOString()
});

// GOOD: Before/after state comparison
console.log('[DEBUG][OrderService.update] Before:', JSON.stringify(order));
await updateOrder(order, changes);
console.log('[DEBUG][OrderService.update] After:', JSON.stringify(order));

// GOOD: Decision point logging
console.log('[DEBUG][Router.dispatch] Route match:', {
  path: req.path,
  matchedRoute: route.pattern,
  params: route.params,
  middleware: route.middleware.map(m => m.name)
});
```

### Log Placement Strategy

| Placement | What It Reveals |
|-----------|----------------|
| Function entry/exit | Whether the function is called and returns |
| Before/after transformation | What the data looks like at each step |
| Branch points (if/else, switch) | Which path the code takes |
| Error catch blocks | Whether errors are thrown and what they contain |
| External calls (DB, API, file) | What is sent and what is received |
| Loop iterations | Counter, current element, accumulator state |

### Cleanup

After investigation, remove ALL debug logs. Verify with:
```bash
git diff --cached | grep -n "console.log\|console.debug\|\[DEBUG\]"
```

---

## Git Bisect Usage Guide

### Automated Bisect with Custom Script

```bash
#!/bin/bash
# bisect-test.sh -- returns 0 (good) or 1 (bad)

# Build the project (skip if build fails)
npm run build 2>/dev/null || exit 125  # 125 = skip this commit

# Run the specific test
npm test -- --grep "payment charge should handle null metadata" 2>/dev/null
exit $?  # 0 = test passes (good), 1 = test fails (bad)
```

```bash
git bisect start HEAD v2.3.0
git bisect run ./bisect-test.sh
# Wait for result...
git bisect reset
```

### Bisect on Specific Paths

```bash
# Only consider commits that touched specific files
git bisect start HEAD v2.3.0 -- src/services/payment.ts src/models/order.ts
```

---

## Browser DevTools Techniques

### Console

```javascript
// Monitor function calls
debug(functionName);  // Pauses when functionName is called

// Monitor events on an element
monitorEvents(document.querySelector('#submit-btn'), 'click');

// Trace function execution
console.trace('checkpoint');  // Prints call stack without stopping
```

### Network Tab

| Check | What to Look For |
|-------|-----------------|
| Request payload | Is the client sending the correct data? |
| Response status | 200/201/204 expected vs actual error codes |
| Response body | Does the response contain expected fields? |
| Timing | Is a request taking abnormally long? (waterfall view) |
| Headers | Auth token present? Content-type correct? CORS headers? |
| WebSocket frames | Messages sent/received in correct order? |

### Application Tab

| Check | What to Look For |
|-------|-----------------|
| LocalStorage/SessionStorage | Stale or corrupted cached data |
| Cookies | Expired session, wrong domain, missing SameSite |
| IndexedDB | Corrupt local database state |
| Service Worker | Cached response serving stale data |

### Performance Tab

- Record a reproduction of the bug
- Look for long tasks (> 50ms) on the main thread
- Check for layout thrashing (repeated forced reflows)
- Identify memory leaks (heap snapshot comparison)

---

## Database Query Debugging

### EXPLAIN ANALYZE (PostgreSQL)

```sql
-- Show execution plan with actual timings
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT o.id, o.total, u.name
FROM orders o
JOIN users u ON u.id = o.user_id
WHERE o.status = 'pending'
  AND o.created_at > '2026-01-01';
```

### What to Look For

| Signal | Meaning | Action |
|--------|---------|--------|
| `Seq Scan` on large table | Missing index | Check if WHERE/JOIN columns are indexed |
| `Rows Removed by Filter: 999000` | Index not selective | Index exists but not useful for this query |
| `Nested Loop` with high row counts | O(n*m) join | Consider `Hash Join` via better statistics or query rewrite |
| `Sort` with `external merge Disk` | Not enough work_mem | Increase work_mem or reduce result set before sorting |
| Actual rows >> Estimated rows | Stale statistics | Run `ANALYZE tablename` |

### Data State Verification

```sql
-- Check for the specific data condition causing the bug
SELECT id, status, created_at, updated_at
FROM orders
WHERE id = '<affected_order_id>';

-- Check for data inconsistency
SELECT o.id, o.user_id, u.id as found_user
FROM orders o
LEFT JOIN users u ON u.id = o.user_id
WHERE u.id IS NULL;  -- orphaned orders

-- Check for the race condition evidence
SELECT id, status, updated_at
FROM orders
WHERE id = '<order_id>'
ORDER BY updated_at DESC;  -- multiple updates in rapid succession?
```

---

## Network Debugging

### Request/Response Inspection

```bash
# Verbose curl to see full request/response
curl -v https://api.example.com/endpoint \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'

# Show timing breakdown
curl -o /dev/null -s -w "
  DNS:        %{time_namelookup}s
  Connect:    %{time_connect}s
  TLS:        %{time_appconnect}s
  First byte: %{time_starttransfer}s
  Total:      %{time_total}s
  HTTP Code:  %{http_code}
" https://api.example.com/endpoint
```

### Common Network Bug Patterns

| Pattern | Symptom | Investigation |
|---------|---------|--------------|
| DNS resolution failure | Intermittent connection refused | Check DNS TTL, resolver config |
| TLS certificate mismatch | Works in browser, fails in code | Compare cert chain, check SNI |
| Connection timeout | Requests hang then fail | Check firewall rules, security groups |
| Request body truncation | Partial data received by server | Check Content-Length, chunked encoding |
| Keep-alive mismatch | Intermittent "connection reset" | Server closes idle connections before client timeout |
| Proxy interference | Different behavior with/without proxy | Check proxy headers (X-Forwarded-For, etc.) |

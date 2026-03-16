# Usage Examples & Report Samples

Specterの使用例とレポート出力サンプル。

---

## Invocation Examples

### Example 1: Vague Symptom Report

**User Input:**
```
アプリを使っていると段々重くなってきます
```

**Specter's Interpretation:**
```
Symptom Analysis:
- Pattern: "重くなっていく" → Progressive performance degradation
- Primary Hypothesis: Memory Leak (Event listeners, timers, closures)
- Secondary Hypothesis: Resource Leak (Connections, handles)
- Scan Priority: Components with useEffect, global event handlers, timers

Starting scan for Memory Leak patterns...
```

**Specter's Response:**
```markdown
## Specter Detection Report

### Summary
**Ghost Category:** Memory Leak
**Issues Found:** 2 CRITICAL, 3 HIGH, 5 MEDIUM
**Confidence:** HIGH
**Scan Scope:** src/components/**/*.tsx, src/hooks/**/*.ts

### Critical Issues

#### SPECTER-001: Event Listener Leak in Modal Component
**Location:** `src/components/Modal.tsx:45`
**Risk Score:** 8.7/10 (CRITICAL)
**Category:** Event Listener Leak

**Evidence:**
```typescript
// Line 45-48: Current code
useEffect(() => {
  window.addEventListener('keydown', handleEscape);
  document.addEventListener('click', handleOutsideClick);
  // Missing cleanup - listeners accumulate on each modal open
}, []);
```

**Remediation:**
```typescript
useEffect(() => {
  window.addEventListener('keydown', handleEscape);
  document.addEventListener('click', handleOutsideClick);
  return () => {
    window.removeEventListener('keydown', handleEscape);
    document.removeEventListener('click', handleOutsideClick);
  };
}, []);
```

**Risk Breakdown:**
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Detectability | 9 | Silent accumulation, no visible error |
| Impact | 8 | Gradual memory growth, eventual crash |
| Frequency | 9 | Every modal open/close cycle |
| Recovery | 7 | Requires page refresh |
| Data Risk | 2 | No data corruption |

**Suggested Tests:**
- Open/close modal 50 times, measure memory growth
- Verify listener count in DevTools

---

#### SPECTER-002: setInterval Leak in Dashboard
**Location:** `src/components/Dashboard.tsx:78`
**Risk Score:** 8.5/10 (CRITICAL)
**Category:** Timer Leak

[... additional findings ...]
```

---

### Example 2: Specific Race Condition Report

**User Input:**
```
チェックアウト処理で時々在庫数がおかしくなります。同時に複数のユーザーが注文すると起きるようです。
```

**Specter's Interpretation:**
```
Symptom Analysis:
- Pattern: "同時実行でおかしい" + "在庫数" → Race Condition
- Primary Hypothesis: Shared state mutation without synchronization
- Secondary Hypothesis: Read-modify-write without atomicity
- Scan Priority: Checkout flow, inventory management, order processing

Starting scan for Race Condition patterns...
```

**Specter's Response:**
```markdown
## Specter Detection Report

### Summary
**Ghost Category:** Race Condition
**Issues Found:** 1 CRITICAL, 2 HIGH
**Confidence:** HIGH
**Scan Scope:** src/services/checkout.ts, src/services/inventory.ts

### Critical Issues

#### SPECTER-001: Race Condition in Inventory Update
**Location:** `src/services/inventory.ts:34`
**Risk Score:** 9.2/10 (CRITICAL)
**Category:** Read-Modify-Write Race

**Evidence:**
```typescript
// Line 34-40: Current code
async function decrementStock(productId: string, quantity: number) {
  const product = await db.products.findOne({ id: productId });
  if (product.stock >= quantity) {
    await db.products.update(
      { id: productId },
      { stock: product.stock - quantity }  // Race: stock may have changed
    );
    return true;
  }
  return false;
}
```

**Race Scenario:**
```
Time T1: User A reads stock = 5
Time T2: User B reads stock = 5
Time T3: User A writes stock = 5 - 3 = 2
Time T4: User B writes stock = 5 - 3 = 2  // Should be -1 (oversold!)
```

**Remediation:**
```typescript
async function decrementStock(productId: string, quantity: number) {
  // Atomic update with condition
  const result = await db.products.updateOne(
    { id: productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } }
  );
  return result.modifiedCount > 0;
}
```

**Alternative (with optimistic locking):**
```typescript
async function decrementStock(productId: string, quantity: number) {
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    const product = await db.products.findOne({ id: productId });
    if (product.stock < quantity) return false;

    const result = await db.products.updateOne(
      { id: productId, version: product.version },
      {
        $inc: { stock: -quantity },
        $inc: { version: 1 }
      }
    );
    if (result.modifiedCount > 0) return true;
    // Retry on conflict
  }
  throw new Error('Concurrent update conflict');
}
```

**Risk Breakdown:**
| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Detectability | 10 | No error, silently wrong data |
| Impact | 10 | Financial loss, overselling |
| Frequency | 7 | During concurrent orders |
| Recovery | 8 | Manual inventory correction |
| Data Risk | 10 | Data integrity compromised |

**Suggested Tests:**
- Simulate 100 concurrent orders for item with stock=1
- Verify final stock is never negative
- Load test with parallel requests
```

---

### Example 3: Full Category Scan

**User Input:**
```
/specter scan全体
```

**Specter's Response:**
```markdown
## Specter Full Scan Report

### Summary
**Scan Scope:** All ghost categories
**Total Issues:** 5 CRITICAL, 12 HIGH, 23 MEDIUM, 8 LOW

### By Category

#### Memory Leaks (12 issues)
- 2 CRITICAL: Event listener accumulation
- 4 HIGH: Timer leaks
- 6 MEDIUM: Subscription cleanup missing

#### Race Conditions (8 issues)
- 2 CRITICAL: Shared state mutation
- 3 HIGH: Async initialization races
- 3 MEDIUM: State update timing

#### Resource Leaks (6 issues)
- 1 CRITICAL: Database connection leak
- 2 HIGH: WebSocket cleanup missing
- 3 MEDIUM: Stream handles

#### Async Issues (22 issues)
- 0 CRITICAL
- 3 HIGH: Unhandled promise rejections
- 11 MEDIUM: Missing await
- 8 LOW: Cleanup patterns

### Top 5 Critical Issues

1. **SPECTER-001** - Event Listener Leak in Modal (`Modal.tsx:45`) - 8.7/10
2. **SPECTER-002** - Race Condition in Inventory (`inventory.ts:34`) - 9.2/10
3. **SPECTER-003** - setInterval Leak in Dashboard (`Dashboard.tsx:78`) - 8.5/10
4. **SPECTER-004** - DB Connection Leak (`database.ts:112`) - 8.8/10
5. **SPECTER-005** - Event Listener in Infinite Scroll (`InfiniteList.tsx:23`) - 8.3/10

### Recommended Fix Order

1. SPECTER-002 (Race Condition) - Highest data risk
2. SPECTER-004 (DB Connection) - Resource exhaustion risk
3. SPECTER-001 (Event Listener) - Memory accumulation
4. SPECTER-003 (Timer) - Memory accumulation
5. SPECTER-005 (Event Listener) - Memory accumulation

### Next Steps
- [ ] Hand off to Builder for SPECTER-002, SPECTER-004 fixes
- [ ] Request Radar to add concurrency tests
- [ ] Schedule memory profiling session
```

---

## Report Format Templates

### Minimal Report (Single Issue)

```markdown
## Specter Finding

**Issue:** [Brief description]
**Location:** `path/to/file.ts:123`
**Risk:** X/10 ([LEVEL])
**Category:** [Ghost type]

**Bad:**
```code
// Current problematic code
```

**Good:**
```code
// Fixed code
```

**Action:** [Who should fix and how]
```

---

### Standard Report (Multiple Issues)

```markdown
## Specter Detection Report

### Summary
**Ghost Category:** [Category]
**Issues Found:** X CRITICAL, Y HIGH, Z MEDIUM
**Confidence:** [HIGH/MEDIUM/LOW]

### Critical Issues
[Details for each CRITICAL issue]

### High Priority Issues
[Details for each HIGH issue]

### Recommendations
1. [Priority fix order]
2. [Test requirements]
3. [Monitoring suggestions]
```

---

### Comprehensive Report (Full Scan)

```markdown
## Specter Full Scan Report

### Executive Summary
[Overview paragraph]

### Statistics
| Category | CRITICAL | HIGH | MEDIUM | LOW |
|----------|----------|------|--------|-----|
| Memory Leaks | X | X | X | X |
| Race Conditions | X | X | X | X |
| Resource Leaks | X | X | X | X |
| Async Issues | X | X | X | X |

### Detailed Findings
[Categorized detailed findings]

### Risk Heat Map
[Visual representation of risk areas]

### Action Plan
[Prioritized fix recommendations]

### Test Requirements
[Test cases for Radar]
```

---

## Confidence Assessment Examples

### HIGH Confidence

```markdown
**Confidence:** HIGH

**Rationale:**
- Pattern match: Clear addEventListener without cleanup
- Context confirmed: Inside React useEffect
- No visible cleanup in file
- Similar pattern caused issues before in this codebase
```

### MEDIUM Confidence

```markdown
**Confidence:** MEDIUM

**Rationale:**
- Pattern match: Promise without catch
- Context unclear: May be caught at call site
- Need to verify error handling strategy
- Recommend manual verification
```

### LOW Confidence

```markdown
**Confidence:** LOW

**Rationale:**
- Pattern match: Async function without try-catch
- Context suggests: Global error boundary handles
- Likely false positive given architecture
- Listed for completeness, low priority
```

---

## Edge Case Handling

### Intentional Patterns

Some detected patterns may be intentional:

```markdown
**Note:** This appears to be an intentional fire-and-forget pattern.

```typescript
// Intentional: Analytics doesn't need error handling
analytics.track('page_view');  // No await by design
```

**Assessment:** False positive. Marked as intentional in codebase comments.
```

### Framework-Specific Patterns

```markdown
**Note:** Framework handles cleanup automatically.

```typescript
// React Query handles subscription cleanup
const { data } = useQuery('key', fetchData);
// No manual cleanup needed
```

**Assessment:** False positive. React Query manages lifecycle.
```

---

## AUTORUN Mode Output

### Abbreviated Format

```yaml
_STEP_COMPLETE:
  Agent: Specter
  Status: SUCCESS
  Output:
    ghost_category: Memory Leak
    issues_found:
      critical: 2
      high: 3
      medium: 5
      low: 1
    confidence: HIGH
    top_issue:
      location: src/components/Modal.tsx:45
      risk_score: 8.7
      category: Event Listener Leak
  Handoff:
    Format: SPECTER_TO_BUILDER
    Content: |
      ## Fix Request: Event Listener Leak

      **Location:** src/components/Modal.tsx:45
      **Issue:** addEventListener without cleanup
      **Fix:** Add removeEventListener in useEffect return

      **Bad:**
      ```typescript
      useEffect(() => {
        window.addEventListener('keydown', handleEscape);
      }, []);
      ```

      **Good:**
      ```typescript
      useEffect(() => {
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
      }, []);
      ```
  Artifacts:
    - Detection report
    - Pattern matches log
  Next: Builder
  Reason: Critical memory leak requires immediate fix
```

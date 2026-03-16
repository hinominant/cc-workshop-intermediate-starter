# Handoff Templates

Specterから他のエージェントへのハンドオフテンプレート集。

---

## SPECTER_TO_BUILDER

### Purpose
検出された問題をBuilderに修正依頼する際のフォーマット。

### Template

```markdown
## SPECTER_TO_BUILDER_HANDOFF

### Issue Summary
**ID:** SPECTER-XXX
**Category:** [Memory Leak / Race Condition / Resource Leak / Async Issue]
**Risk Score:** X.X/10 ([CRITICAL / HIGH / MEDIUM])
**Location:** `path/to/file.ts:line`

### Problem Description
[1-2 sentence description of the issue]

### Evidence

**Current Code (Bad):**
```typescript
// Line numbers and file path
[problematic code]
```

**Why This Is Bad:**
- [Reason 1]
- [Reason 2]
- [Impact description]

### Recommended Fix

**Fixed Code (Good):**
```typescript
[corrected code]
```

**Fix Rationale:**
- [Why this approach]
- [What it prevents]

### Risk Assessment

| Dimension | Score | Notes |
|-----------|-------|-------|
| Detectability | X | [Brief explanation] |
| Impact | X | [Brief explanation] |
| Frequency | X | [Brief explanation] |
| Recovery | X | [Brief explanation] |
| Data Risk | X | [Brief explanation] |

### Implementation Notes
- [ ] [Specific implementation consideration 1]
- [ ] [Specific implementation consideration 2]
- [ ] [Testing requirement]

### Breaking Changes
[None / List of breaking changes if any]

### Related Issues
- SPECTER-YYY: [Related issue if any]
```

### Example

```markdown
## SPECTER_TO_BUILDER_HANDOFF

### Issue Summary
**ID:** SPECTER-001
**Category:** Memory Leak
**Risk Score:** 8.7/10 (CRITICAL)
**Location:** `src/components/Modal.tsx:45`

### Problem Description
Event listeners are added in useEffect but never removed, causing memory accumulation with each modal open/close cycle.

### Evidence

**Current Code (Bad):**
```typescript
// src/components/Modal.tsx:45-48
useEffect(() => {
  window.addEventListener('keydown', handleEscape);
  document.addEventListener('click', handleOutsideClick);
}, []);
```

**Why This Is Bad:**
- Listeners accumulate on every modal mount
- No cleanup on unmount
- Memory grows linearly with modal opens

### Recommended Fix

**Fixed Code (Good):**
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

**Fix Rationale:**
- Cleanup function removes listeners on unmount
- Matches React lifecycle best practices
- Prevents memory accumulation

### Risk Assessment

| Dimension | Score | Notes |
|-----------|-------|-------|
| Detectability | 9 | No visible errors, silent growth |
| Impact | 8 | Memory exhaustion over time |
| Frequency | 9 | Every modal open/close |
| Recovery | 7 | Page refresh required |
| Data Risk | 2 | No data corruption |

### Implementation Notes
- [ ] Ensure handleEscape and handleOutsideClick are stable references
- [ ] Consider using useCallback for handlers
- [ ] Add memory profiling test

### Breaking Changes
None

### Related Issues
- SPECTER-005: Similar pattern in InfiniteList.tsx
```

---

## SPECTER_TO_RADAR

### Purpose
検出された問題に対するテストケース作成を依頼する際のフォーマット。

### Template

```markdown
## SPECTER_TO_RADAR_HANDOFF

### Test Request Summary
**Related Issues:** SPECTER-XXX, SPECTER-YYY
**Category:** [Memory Leak / Race Condition / Resource Leak / Async Issue]
**Priority:** [HIGH / MEDIUM / LOW]

### Test Requirements

#### Test Case 1: [Name]
**Type:** [Unit / Integration / E2E]
**Purpose:** [What this test verifies]

**Test Scenario:**
```typescript
// Pseudocode or test structure
describe('Component memory management', () => {
  it('should not leak event listeners on unmount', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

**Expected Behavior:**
- [Expected outcome 1]
- [Expected outcome 2]

**Failure Criteria:**
- [What indicates the bug is present]

#### Test Case 2: [Name]
[Additional test case...]

### Reproduction Steps
1. [Step 1]
2. [Step 2]
3. [Observe: What to verify]

### Edge Cases to Cover
- [ ] [Edge case 1]
- [ ] [Edge case 2]
- [ ] [Edge case 3]

### Test Data Requirements
[Any specific test data or fixtures needed]

### Coverage Goals
- [ ] All affected code paths covered
- [ ] Race condition timing variations
- [ ] Cleanup verification
```

### Example (Memory Leak)

```markdown
## SPECTER_TO_RADAR_HANDOFF

### Test Request Summary
**Related Issues:** SPECTER-001
**Category:** Memory Leak
**Priority:** HIGH

### Test Requirements

#### Test Case 1: Event Listener Cleanup
**Type:** Unit
**Purpose:** Verify listeners are removed on unmount

**Test Scenario:**
```typescript
describe('Modal', () => {
  it('should remove event listeners on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<Modal isOpen={true} />);

    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
```

**Expected Behavior:**
- addEventListener called on mount
- removeEventListener called on unmount
- Same handler function used in both calls

**Failure Criteria:**
- removeEventListener not called
- Different handler references

#### Test Case 2: Memory Growth Test
**Type:** Integration
**Purpose:** Verify no memory accumulation over multiple mount/unmount cycles

**Test Scenario:**
```typescript
describe('Modal memory management', () => {
  it('should not increase listener count over cycles', async () => {
    const initialListeners = getEventListenerCount(window);

    for (let i = 0; i < 100; i++) {
      const { unmount } = render(<Modal isOpen={true} />);
      unmount();
    }

    const finalListeners = getEventListenerCount(window);
    expect(finalListeners).toBe(initialListeners);
  });
});
```

### Edge Cases to Cover
- [ ] Modal opened/closed rapidly
- [ ] Modal unmounted while animation in progress
- [ ] Multiple modals opened simultaneously

### Coverage Goals
- [ ] useEffect cleanup path covered
- [ ] All event types verified
- [ ] Unmount during async operations
```

### Example (Race Condition)

```markdown
## SPECTER_TO_RADAR_HANDOFF

### Test Request Summary
**Related Issues:** SPECTER-002
**Category:** Race Condition
**Priority:** CRITICAL

### Test Requirements

#### Test Case 1: Concurrent Stock Decrement
**Type:** Integration
**Purpose:** Verify inventory doesn't go negative under concurrent access

**Test Scenario:**
```typescript
describe('Inventory concurrent access', () => {
  it('should not oversell under concurrent orders', async () => {
    // Setup: Product with stock = 5
    await db.products.insert({ id: 'test', stock: 5 });

    // Simulate 10 concurrent orders for 1 item each
    const orders = Array(10).fill(null).map(() =>
      decrementStock('test', 1)
    );

    const results = await Promise.all(orders);

    // Verify: Only 5 should succeed
    const successCount = results.filter(r => r === true).length;
    expect(successCount).toBe(5);

    // Verify: Stock should be 0, not negative
    const product = await db.products.findOne({ id: 'test' });
    expect(product.stock).toBe(0);
  });
});
```

**Expected Behavior:**
- Exactly 5 orders succeed
- Exactly 5 orders fail (insufficient stock)
- Final stock is 0, never negative

**Failure Criteria:**
- More than 5 orders succeed
- Stock becomes negative
- Inconsistent final state

#### Test Case 2: Rapid Sequential Orders
**Type:** Integration
**Purpose:** Verify race condition doesn't occur in rapid sequence

**Test Scenario:**
```typescript
it('should handle rapid sequential orders', async () => {
  await db.products.insert({ id: 'test', stock: 1 });

  // Two orders hitting at nearly the same time
  const [order1, order2] = await Promise.all([
    decrementStock('test', 1),
    decrementStock('test', 1)
  ]);

  // One should succeed, one should fail
  expect(order1 !== order2).toBe(true);

  const product = await db.products.findOne({ id: 'test' });
  expect(product.stock).toBe(0);
});
```

### Reproduction Steps
1. Set up product with stock = N
2. Send N+X concurrent decrement requests
3. Verify only N succeed
4. Verify final stock = 0

### Edge Cases to Cover
- [ ] Stock exactly 0
- [ ] Stock equals request quantity
- [ ] Multiple products concurrent updates
- [ ] Network latency variations

### Coverage Goals
- [ ] Atomic update path tested
- [ ] Optimistic locking retry logic
- [ ] Failure path handling
```

---

## SPECTER_TO_SCOUT

### Purpose
より深い調査が必要な場合にScoutへ依頼する際のフォーマット。

### Template

```markdown
## SPECTER_TO_SCOUT_HANDOFF

### Investigation Request
**Related Issue:** SPECTER-XXX
**Category:** [Ghost category]
**Request Type:** Deep investigation

### Context
**What Specter Found:**
- Pattern detected at [location]
- Risk score: X/10
- Confidence: [Level]

**Why Scout Is Needed:**
- [Reason: e.g., root cause unclear, reproduction needed, complex flow]

### Investigation Questions
1. [Specific question 1]
2. [Specific question 2]
3. [What to verify]

### Provided Evidence
- Pattern match at [location]
- [Any stack traces, logs, or symptoms]

### Expected Investigation Output
- Root cause identification
- Reproduction steps
- Severity confirmation
```

---

## SPECTER_TO_CANVAS

### Purpose
フロー図や依存関係の可視化をCanvasに依頼する際のフォーマット。

### Template

```markdown
## SPECTER_TO_CANVAS_HANDOFF

### Visualization Request
**Type:** [Async Flow / Resource Lifecycle / Race Timeline / Memory Graph]
**Related Issue:** SPECTER-XXX

### Diagram Specification

**Title:** [Diagram title]

**Elements to Include:**
- [Element 1: e.g., Component mount]
- [Element 2: e.g., API call start]
- [Element 3: e.g., State update]

**Flows to Show:**
- [Flow 1: e.g., Normal path]
- [Flow 2: e.g., Race condition path]

**Highlight:**
- [What to emphasize: e.g., problematic state]

### Example Structure
```
[ASCII or Mermaid draft if helpful]
```

### Purpose
[How this diagram helps understand the issue]
```

### Example

```markdown
## SPECTER_TO_CANVAS_HANDOFF

### Visualization Request
**Type:** Race Timeline
**Related Issue:** SPECTER-002

### Diagram Specification

**Title:** Inventory Race Condition Timeline

**Elements to Include:**
- User A request
- User B request
- Database read (stock = 5)
- Database write (stock = 2)
- Final state

**Flows to Show:**
- Normal sequential flow (correct)
- Concurrent flow (race condition)

**Highlight:**
- Point where race occurs
- Incorrect final state

### Example Structure
```
Timeline:
User A: Read(5) -------- Write(2)
User B:      Read(5) -------- Write(2)  ← Race!
Stock:   5    5     5    2       2      ← Should be -1
```

### Purpose
Illustrate how concurrent reads lead to incorrect inventory state.
```

---

## Incoming Handoff Formats

### SCOUT_TO_SPECTER

When Scout identifies a potential concurrency/resource issue:

```markdown
## SCOUT_TO_SPECTER_HANDOFF

### Investigation Context
**Bug Report:** [Original issue]
**Scout Finding:** Potential [ghost category]

### Evidence
- [Symptom 1]
- [Symptom 2]
- [Intermittent behavior pattern]

### Request
Please scan for [specific ghost type] in [scope].

### Related Files
- [File 1]: [Reason for suspicion]
- [File 2]: [Reason for suspicion]
```

### RIPPLE_TO_SPECTER

When Ripple identifies areas at risk during change planning:

```markdown
## RIPPLE_TO_SPECTER_HANDOFF

### Change Context
**Proposed Change:** [Description]
**Risk Areas:** Concurrency-sensitive code identified

### Scan Request
Please verify no ghost issues in:
- [File 1]: [Why flagged]
- [File 2]: [Why flagged]

### Specific Concerns
- Shared state at [location]
- Async operations at [location]
- Resource handling at [location]
```

### TRIAGE_TO_SPECTER

When Triage identifies incident with concurrency symptoms:

```markdown
## TRIAGE_TO_SPECTER_HANDOFF

### Incident Context
**Incident ID:** [ID]
**Symptoms:** [Intermittent/timing-related issues]
**Impact:** [Current impact]

### Specter Task
Identify root cause ghost in:
- [Suspected area 1]
- [Suspected area 2]

### Time Sensitivity
[Urgency level]
```

---

## Handoff Quality Checklist

### Before Sending to Builder
- [ ] Location is specific (file:line)
- [ ] Risk score is calculated and justified
- [ ] Bad code example is complete
- [ ] Good code example is tested/verified
- [ ] Breaking changes are documented
- [ ] Implementation notes are actionable

### Before Sending to Radar
- [ ] Test scenarios are concrete
- [ ] Expected behavior is clear
- [ ] Failure criteria are specific
- [ ] Edge cases are listed
- [ ] Test data requirements are noted

### Before Sending to Scout
- [ ] Investigation questions are specific
- [ ] Evidence is provided
- [ ] Context is sufficient
- [ ] Expected output is clear

### Before Sending to Canvas
- [ ] Diagram type is specified
- [ ] Elements are listed
- [ ] Flows are described
- [ ] Purpose is clear

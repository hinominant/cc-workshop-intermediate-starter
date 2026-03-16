# PDCA Patterns Reference

Detailed patterns for each PDCA phase in Hone's quality improvement cycles.

---

## PLAN Phase Patterns

### Pattern P1: Full Quality Scan

Use when starting a new improvement session with unknown quality state.

```
PLAN-P1:
  1. Run Judge in analysis mode (no fixes)
  2. Run Zen complexity analysis
  3. Run Radar coverage check
  4. Run Quill documentation audit
  5. (If UI) Run Warden V.A.I.R.E. check
  6. Calculate baseline UQS
  7. Identify top 3 improvement priorities
```

**When to use:** New sessions, unknown codebase, comprehensive improvement requests.

### Pattern P2: Targeted Quality Scan

Use when focusing on specific quality domains.

```
PLAN-P2:
  1. Identify target domain(s) from user request
  2. Run only domain-relevant agents
  3. Calculate domain-specific UQS
  4. Set realistic per-domain targets
```

**Domain-to-agent mapping:**
- Code quality → Judge + Zen
- Test quality → Radar (+ Judge for test code)
- Documentation → Quill (+ Canvas for diagrams)
- UX quality → Warden + Palette
- Security → Sentinel + Probe

### Pattern P3: Delta-Based Scan

Use in cycles 2+ when baseline is established.

```
PLAN-P3:
  1. Load previous cycle's measurements
  2. Re-run only agents that had improvements in previous cycle
  3. Skip unchanged domains (delta = 0)
  4. Focus on domains still below target
```

**Optimization:** Skip Quill if documentation was 100% in cycle 1.

### Pattern P4: Risk-Prioritized Scan

Use when time is limited or QUICK mode is active.

```
PLAN-P4:
  1. Run Judge only (highest impact, fastest)
  2. If CRITICAL/HIGH issues found → prioritize fixes
  3. If no critical issues → run Radar for coverage
  4. Skip Zen and Quill in QUICK mode
```

---

## DO Phase Patterns

### Pattern D1: Sequential Execution

Default pattern for safe, predictable improvement.

```
DO-D1:
  Judge (analyze)
    ↓
  Builder (fix critical/high)
    ↓
  Sentinel (if security issues)
    ↓
  Zen (simplify)
    ↓
  Radar (add tests)
    ↓
  Quill (document)
```

**Rationale:** Each agent benefits from previous agent's work.
- Builder needs Judge findings to know what to fix
- Zen works better on correct code (post-Builder)
- Radar tests cleaner code (post-Zen)
- Quill documents final state

### Pattern D2: Parallel Analysis, Sequential Fix

Use when analysis is time-consuming but independent.

```
DO-D2:
  ┌─ Judge (analyze) ─┐
  │                    │
  ├─ Zen (analyze) ───┼──▶ Merge findings ──▶ Builder (fix all)
  │                    │                           ↓
  └─ Radar (analyze) ─┘                       Radar (add tests)
                                                   ↓
                                              Quill (document)
```

**When to use:** Large codebases, multi-file analysis.

### Pattern D3: Fix-Verify Loop

Use when fixing complex issues that might introduce regressions.

```
DO-D3:
  Judge (find issue)
    ↓
  Builder (fix attempt 1)
    ↓
  Radar (run tests) ──┐
    │                 │
    ├── PASS ────────▶ Continue to next issue
    │                 │
    └── FAIL ────────▶ Builder (fix attempt 2) ──▶ Radar
                            │
                            └── Still FAIL ──▶ Report as blocker
```

**Max retries:** 2 attempts per issue before reporting as blocker.

### Pattern D4: Domain-Isolated Execution

Use when focusing on single domain to avoid interference.

```
DO-D4 (Test-focused):
  Radar (analyze gaps)
    ↓
  Radar (add tests)
    ↓
  Judge (verify test quality)
    ↓
  [No Zen - avoid changing code under test]
```

**Isolation rule:** Don't run Zen during test-focused sessions to prevent
test breakage from code structure changes.

### Pattern D5: Security-First Execution

Use when Sentinel found critical security issues.

```
DO-D5:
  Sentinel (deep scan)
    ↓
  Builder (security fixes)
    ↓
  Probe (DAST verification)
    ↓
  [Only then proceed to regular quality]
  Judge → Zen → Radar
```

**Rationale:** Security issues must be fixed before any other improvements.

---

## CHECK Phase Patterns

### Pattern C1: Full Re-measurement

Standard pattern for comprehensive comparison.

```
CHECK-C1:
  1. Re-run all agents used in PLAN
  2. Calculate new scores for each domain
  3. Calculate delta for each domain
  4. Calculate new UQS
  5. Compare against cycle targets
```

### Pattern C2: Delta-Only Measurement

Use when focused on specific improvements.

```
CHECK-C2:
  1. Re-run only agents for domains that were targeted in DO
  2. Keep unchanged domain scores from PLAN
  3. Calculate partial UQS update
```

**Efficiency:** Faster than full re-measurement for focused sessions.

### Pattern C3: Diminishing Returns Detection

Pattern for identifying when to stop.

```
CHECK-C3:
  history = load_cycle_history()

  current_delta = new_uqs - previous_uqs
  threshold = 5  # percentage points

  if current_delta < threshold:
    increment diminishing_counter
  else:
    reset diminishing_counter

  if diminishing_counter >= 2:
    recommend TERMINATE with DIMINISHING_RETURNS
```

### Pattern C4: Goal Achievement Check

Pattern for checking if targets are met.

```
CHECK-C4:
  for each domain:
    if domain.score >= domain.target:
      mark domain as ACHIEVED
    else:
      mark domain as PENDING

  if all domains ACHIEVED:
    recommend TERMINATE with GOAL_ACHIEVED

  if UQS >= target_uqs:
    recommend TERMINATE with GOAL_ACHIEVED
```

---

## ACT Phase Patterns

### Pattern A1: Standard Learning

Default pattern for recording and deciding.

```
ACT-A1:
  1. Record cycle metrics to .agents/hone.md
  2. Analyze which agents had most impact
  3. Note patterns discovered
  4. Make continue/terminate decision
  5. If continuing, adjust strategy:
     - Prioritize high-delta agents
     - Skip zero-delta agents
     - Consider different agent order
```

### Pattern A2: Strategy Adjustment

Use when current strategy isn't producing results.

```
ACT-A2:
  if delta < expected_delta:
    1. Analyze why improvement was limited
    2. Consider:
       - Different agent order
       - Parallel vs sequential
       - Domain scope change
       - Escalation to deeper analysis
    3. Record adjustment rationale
    4. Apply new strategy in next cycle
```

**Adjustment triggers:**
- Delta < 50% of previous cycle's delta
- Specific domain shows no improvement
- Agent reported blockers

### Pattern A3: Escalation Decision

Use when iterative improvement is insufficient.

```
ACT-A3:
  if (cycles >= 3 AND UQS < 70):
    recommend escalation:
      - Atlas: architectural analysis needed
      - Builder: major refactoring required
      - Scout: deeper investigation needed

  Record:
    - "Iterative improvement insufficient"
    - "Root cause may be architectural"
    - "Recommend deep analysis"
```

### Pattern A4: Success Recording

Use when terminating with goal achieved.

```
ACT-A4:
  1. Generate success summary
  2. Record total improvements by domain
  3. Note effective patterns for future use
  4. Recommend next steps (Guardian for PR, etc.)
  5. Archive session to .agents/hone.md
```

---

## Combined Patterns

### Pattern PDCA-QUICK

Complete quick session pattern.

```
PDCA-QUICK:
  PLAN: P4 (risk-prioritized scan)
  DO:   D3 (fix-verify loop, critical only)
  CHECK: C4 (goal check only)
  ACT:  A4 or immediate terminate

  Max cycles: 2
  Focus: Critical issues only
  Skip: Zen, Quill, Warden
```

### Pattern PDCA-STANDARD

Balanced improvement session.

```
PDCA-STANDARD:
  PLAN: P1 (full scan) or P3 (delta-based if cycle 2+)
  DO:   D1 (sequential execution)
  CHECK: C1 (full measurement) + C3 (diminishing detection)
  ACT:  A1 (standard learning)

  Max cycles: 3
  All domains included
  Standard thresholds
```

### Pattern PDCA-INTENSIVE

Thorough improvement session.

```
PDCA-INTENSIVE:
  PLAN: P1 (full scan, all domains)
  DO:   D2 (parallel analysis) or D5 (security-first if needed)
  CHECK: C1 + C3 + C4
  ACT:  A1 + A2 (with strategy adjustment)

  Max cycles: 5
  All domains included
  Lower diminishing threshold (3%)
  Includes A3 escalation if needed
```

### Pattern PDCA-FOCUSED

Single-domain deep improvement.

```
PDCA-FOCUSED:
  PLAN: P2 (targeted scan, one domain)
  DO:   D4 (domain-isolated)
  CHECK: C2 (delta-only) + C4
  ACT:  A1 (domain-specific learning)

  Max cycles: 3
  Single domain only
  Domain-specific UQS weights
```

---

## Pattern Selection Guide

| User Request | Pattern | Rationale |
|-------------|---------|-----------|
| "Improve this code" | PDCA-STANDARD | Balanced approach |
| "Quick check" | PDCA-QUICK | Time-limited |
| "Make it production-ready" | PDCA-INTENSIVE | High bar |
| "Just focus on tests" | PDCA-FOCUSED (tests) | Specific domain |
| "Fix security issues" | PDCA-FOCUSED + D5 | Security priority |
| "Keep improving" | PDCA-INTENSIVE | Open-ended |

---

## Anti-Patterns (Avoid)

### Anti-Pattern: Blind Cycling

```
BAD:
  DO → DO → DO (without CHECK between)

PROBLEM:
  No measurement means no learning, no progress tracking.
```

### Anti-Pattern: Over-Parallelization

```
BAD:
  [Judge | Builder | Zen | Radar] all parallel

PROBLEM:
  Agents conflict. Builder changes code Zen is analyzing.
  Radar tests code Builder is changing.
```

### Anti-Pattern: Ignoring Diminishing Returns

```
BAD:
  Cycle 5: delta +1
  Cycle 6: delta +0.5
  Cycle 7: delta +0.2
  Continue...

PROBLEM:
  Wasting effort. Stop when delta < threshold.
```

### Anti-Pattern: Domain Mixing

```
BAD:
  Cycle 1: Code focus (Judge, Zen)
  Cycle 2: UX focus (Warden, Palette)
  Cycle 3: Code focus again

PROBLEM:
  Inconsistent measurement. Can't compare UQS across cycles
  with different domain weights.
```

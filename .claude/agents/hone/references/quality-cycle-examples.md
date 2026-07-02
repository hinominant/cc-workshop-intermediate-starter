# hone — 品質サイクル 事例 (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## Examples

### Example 1: Standard Improvement Session

```
User: "Improve the quality of the auth module"

Hone:
  PLAN (Cycle 1):
    - Run Judge on src/auth/ → Found 1 CRITICAL, 2 HIGH
    - Run Radar analysis → Coverage at 45%
    - Run Zen analysis → avgCC = 18
    - Initial UQS: 52 (Poor)
    - Target: 80 (STANDARD mode)

  DO (Cycle 1):
    - Route to Builder: Fix CRITICAL null check
    - Route to Builder: Fix HIGH validation issues
    - Route to Radar: Add tests for auth flows
    - Route to Zen: Simplify complex functions

  CHECK (Cycle 1):
    - Judge: 0 CRITICAL, 0 HIGH (fixed)
    - Coverage: 67% (+22%)
    - avgCC: 12 (-33%)
    - UQS: 71 (+19)
    - Delta: +19 (significant improvement)

  ACT (Cycle 1):
    - Continue: 71 < 80, delta is meaningful

  [Cycle 2...]

  CHECK (Cycle 2):
    - UQS: 82 (+11)

  ACT (Cycle 2):
    - TERMINATE: Goal achieved (82 >= 80)
```

### Example 2: Diminishing Returns Detection

```
User: "Keep improving until perfect"

Hone:
  Mode: INTENSIVE (max 5 cycles, target 90)

  Cycle 1: 60 → 75 (+15) - Continue
  Cycle 2: 75 → 83 (+8) - Continue
  Cycle 3: 83 → 86 (+3) - Warning: delta < 5%
  Cycle 4: 86 → 87 (+1) - Diminishing returns detected

  TERMINATE: 2 consecutive cycles with delta < 5%
  Final UQS: 87 (Good)

  Recommendation: Further improvement requires architectural
  changes beyond iterative refinement. Consider Atlas for
  structural analysis.
```

### Example 3: Domain-Focused Session

```
User: "Focus only on test coverage"

Hone:
  Mode: STANDARD (test-focused weights)
  Domains: [tests]

  UQS Weights (adjusted):
    - Radar: 0.70
    - Judge: 0.20
    - Quill: 0.10

  PLAN:
    - Current coverage: 55%
    - Target coverage: 80%
    - Agents: Radar (primary), Judge (verify test quality)

  [Execute focused improvement...]

  Result:
    - Coverage: 55% → 82%
    - Test-focused UQS: 64 → 85
```

---


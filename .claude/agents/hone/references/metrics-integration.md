# Metrics Integration Reference

Detailed specifications for UQS calculation, score normalization, and quality measurement integration.

---

## Unified Quality Score (UQS)

### Overview

UQS provides a single 0-100 number representing overall quality by normalizing and weighting scores from multiple quality agents.

### Formula

```
UQS = Σ (normalized_score[i] × weight[i])

where:
  - normalized_score[i] ∈ [0, 100]
  - weight[i] ∈ [0, 1]
  - Σ weight[i] = 1.0
```

---

## Agent Score Normalization

### Judge (Code Correctness)

**Original output:** Issue counts by severity

| Severity | Impact Score |
|----------|-------------|
| CRITICAL | 25 points |
| HIGH | 15 points |
| MEDIUM | 5 points |
| LOW | 2 points |
| INFO | 0 points |

**Normalization formula:**

```
total_impact = (CRITICAL × 25) + (HIGH × 15) + (MEDIUM × 5) + (LOW × 2)
judge_score = max(0, 100 - total_impact)
```

**Examples:**

| Issues | Calculation | Score |
|--------|-------------|-------|
| 0 issues | 100 - 0 | 100 |
| 1 HIGH | 100 - 15 | 85 |
| 1 CRITICAL, 2 HIGH | 100 - (25 + 30) | 45 |
| 3 MEDIUM, 5 LOW | 100 - (15 + 10) | 75 |

**Cap:** Score cannot go below 0.

### Zen (Complexity)

**Original output:** Cyclomatic Complexity metrics

| Metric | Ideal | Threshold |
|--------|-------|-----------|
| Average CC | < 10 | > 20 is poor |
| Max CC | < 15 | > 30 is poor |
| Files > CC 10 | 0 | > 20% is poor |

**Normalization formula (using average CC):**

```
if avgCC <= 10:
  zen_score = 100
elif avgCC >= 30:
  zen_score = 0
else:
  zen_score = max(0, 100 - (avgCC - 10) × 5)
```

**Alternative: Cognitive Complexity:**

```
if cogCC <= 15:
  zen_score = 100
elif cogCC >= 50:
  zen_score = 0
else:
  zen_score = max(0, 100 - (cogCC - 15) × 2.86)
```

**Examples:**

| Avg CC | Calculation | Score |
|--------|-------------|-------|
| 8 | 100 (ideal) | 100 |
| 12 | 100 - (12-10)×5 | 90 |
| 18 | 100 - (18-10)×5 | 60 |
| 25 | 100 - (25-10)×5 | 25 |

### Radar (Test Coverage)

**Original output:** Coverage percentage

**Normalization formula:**

```
radar_score = coverage_percentage
```

**No transformation needed** - coverage is already 0-100.

**Adjustments for granularity:**

| Metric | Weight in composite |
|--------|---------------------|
| Line coverage | 0.4 |
| Branch coverage | 0.4 |
| Function coverage | 0.2 |

```
radar_score = (line × 0.4) + (branch × 0.4) + (function × 0.2)
```

### Warden (UX Quality)

**Original output:** 0-3 score per V.A.I.R.E. dimension

| Dimension | Score Range |
|-----------|-------------|
| Value | 0-3 |
| Agency | 0-3 |
| Identity | 0-3 |
| Resilience | 0-3 |
| Echo | 0-3 |

**Normalization formula:**

```
avg_dimension = (V + A + I + R + E) / 5
warden_score = (avg_dimension / 3) × 100
```

**Examples:**

| V | A | I | R | E | Avg | Score |
|---|---|---|---|---|-----|-------|
| 3 | 3 | 3 | 3 | 3 | 3.0 | 100 |
| 2 | 2 | 2 | 2 | 2 | 2.0 | 67 |
| 3 | 2 | 2 | 3 | 2 | 2.4 | 80 |
| 1 | 1 | 2 | 1 | 1 | 1.2 | 40 |

**Minimum threshold:** All dimensions must be ≥ 2 for release approval.

### Quill (Documentation)

**Original output:** Checklist pass rate

**Documentation checklist:**

| Item | Weight |
|------|--------|
| Public API documented | 0.25 |
| README up to date | 0.20 |
| Complex logic commented | 0.20 |
| Types properly defined | 0.20 |
| No broken links | 0.15 |

**Normalization formula:**

```
quill_score = (passed_items / total_items) × 100
```

Or with weights:

```
quill_score = Σ (item_passed[i] × weight[i]) × 100
```

### Consistency (Cross-File Pattern Uniformity)

**Original output:** Violation counts by severity from Judge consistency detection

| Severity | Impact Score |
|----------|-------------|
| HIGH | 15 points |
| MEDIUM | 5 points |
| LOW | 2 points |

**Normalization formula:**

```
violation_impact = (HIGH × 15) + (MEDIUM × 5) + (LOW × 2)
consistency_score = max(0, 100 - violation_impact)
```

**Examples:**

| Violations | Calculation | Score |
|-----------|-------------|-------|
| 0 violations | 100 - 0 | 100 |
| 2 HIGH | 100 - 30 | 70 |
| 1 HIGH, 3 MEDIUM | 100 - (15 + 15) | 70 |
| 5 MEDIUM, 10 LOW | 100 - (25 + 20) | 55 |

**Cap:** Score cannot go below 0.

**Note:** Only violations detected by Judge's consistency pattern analysis are counted. Framework-required variations and legacy migration zones are excluded.

### Test Quality (Test Suite Reliability)

**Original output:** Per-file test quality scores from Judge test quality assessment

| Dimension | Weight in Composite |
|-----------|---------------------|
| Isolation | 0.25 |
| Flakiness-free | 0.25 |
| Edge cases | 0.20 |
| Mock quality | 0.15 |
| Readability | 0.15 |

**Normalization formula:**

```
test_quality_score = (
    isolation × 0.25 +
    flakiness_free × 0.25 +
    edge_cases × 0.20 +
    mock_quality × 0.15 +
    readability × 0.15
) × 100
```

Each dimension is scored 0.0 to 1.0 by Judge, then weighted.

**Examples:**

| Isolation | Flaky-free | Edge | Mock | Read | Score |
|-----------|-----------|------|------|------|-------|
| 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 100 |
| 0.8 | 0.6 | 0.7 | 0.5 | 0.8 | 69.5 |
| 0.5 | 0.3 | 0.4 | 0.6 | 0.4 | 42.0 |

**Minimum threshold:** test_quality_score ≥ 60 for CI release approval.

---

## Weight Configurations

### Standard Weights (7-Dimension Default)

```yaml
weights:
  judge:         0.25  # Code correctness (was 0.30)
  consistency:   0.10  # Cross-file pattern uniformity (NEW)
  test_quality:  0.10  # Test suite reliability (NEW)
  zen:           0.15  # Maintainability (was 0.20)
  radar:         0.20  # Test coverage (was 0.25)
  warden:        0.12  # UX quality (was 0.15)
  quill:         0.08  # Documentation (was 0.10)
```

### Legacy Standard Weights (5-Dimension)

For backward compatibility with existing session reports:

```yaml
legacy_standard:
  judge: 0.30
  zen: 0.20
  radar: 0.25
  warden: 0.15
  quill: 0.10
```

**Migration note:** 5-dimension and 7-dimension UQS scores are not directly comparable. Always note the UQS version in session reports.

### Code-Focused Weights

Use when focusing on implementation quality.

```yaml
weights:
  judge: 0.35
  consistency: 0.15
  test_quality: 0.00
  zen: 0.30
  radar: 0.20
  warden: 0.00
  quill: 0.00
```

### Test-Focused Weights

Use when focusing on test quality and coverage.

```yaml
weights:
  judge: 0.15
  consistency: 0.00
  test_quality: 0.25  # Test reliability primary
  zen: 0.00
  radar: 0.50          # Coverage primary
  warden: 0.00
  quill: 0.10
```

### UX-Focused Weights

Use when focusing on user experience.

```yaml
weights:
  judge: 0.00
  consistency: 0.00
  test_quality: 0.00
  zen: 0.00
  radar: 0.00
  warden: 0.70  # V.A.I.R.E. is primary
  quill: 0.30   # UX documentation
```

### Documentation-Focused Weights

Use when focusing on documentation completeness.

```yaml
weights:
  judge: 0.10
  consistency: 0.00
  test_quality: 0.00
  zen: 0.00
  radar: 0.00
  warden: 0.00
  quill: 0.90
```

### Security-Focused Weights

Use when focusing on security quality.

```yaml
weights:
  sentinel: 0.50  # Security scan
  judge: 0.25     # Code review
  radar: 0.15     # Security test coverage
  probe: 0.10     # DAST results
```

See `references/quality-profiles.md` for domain-specific profiles (API-Heavy, UI-Heavy, Data-Pipeline, Library/SDK, etc.).

---

## UQS Interpretation

### Grade Thresholds

| Range | Grade | Meaning | Action |
|-------|-------|---------|--------|
| 90-100 | A (Excellent) | Production-ready | Ship with confidence |
| 80-89 | B (Good) | Solid quality | Minor improvements optional |
| 70-79 | C (Acceptable) | Meets baseline | Improvements recommended |
| 60-69 | D (Fair) | Below standard | Improvements needed |
| < 60 | F (Poor) | Quality issues | Do not ship |

### Domain-Specific Thresholds

| Domain | Minimum | Target | Excellent |
|--------|---------|--------|-----------|
| Judge | 70 | 85 | 95 |
| Zen | 60 | 80 | 90 |
| Radar | 60 | 75 | 90 |
| Warden | 67 (all ≥2) | 80 | 100 |
| Quill | 70 | 85 | 95 |

---

## Delta Calculation

### Per-Cycle Delta

```
delta = new_uqs - previous_uqs

Example:
  Cycle 1: UQS went from 65 to 78
  Delta: +13 points
```

### Per-Domain Delta

```
domain_delta[i] = new_score[i] - previous_score[i]

Example:
  Judge: 70 → 85 = +15
  Zen: 60 → 75 = +15
  Radar: 55 → 70 = +15
```

### Weighted Delta

```
weighted_delta = Σ (domain_delta[i] × weight[i])
```

### Diminishing Returns Detection

```python
def is_diminishing(deltas, threshold=5, count=2):
    """
    Returns True if last 'count' deltas are all below 'threshold'.
    """
    if len(deltas) < count:
        return False

    recent = deltas[-count:]
    return all(d < threshold for d in recent)
```

**Default thresholds:**

| Mode | Threshold | Count |
|------|-----------|-------|
| QUICK | 5% | 1 |
| STANDARD | 5% | 2 |
| INTENSIVE | 3% | 2 |

---

## Measurement Timing

### When to Measure

| Phase | What to Measure | Purpose |
|-------|----------------|---------|
| Session start | Full UQS | Baseline |
| Cycle start | Full or delta UQS | Cycle baseline |
| After each agent | Agent-specific score | Progress tracking |
| Cycle end | Full UQS | Delta calculation |
| Session end | Full UQS | Final report |

### Measurement Consistency

**Rule:** Use the same measurement method throughout a session.

| If you start with... | Continue with... |
|---------------------|------------------|
| Full Judge scan | Full Judge scan |
| Specific file coverage | Same file coverage |
| Weighted UQS | Same weights |

**Don't:** Change weights or scope mid-session.

---

## Tool Integration

### Judge Integration

```bash
# Run Judge for analysis
codex review --uncommitted --json > judge_output.json

# Parse output
{
  "issues": [
    {"severity": "HIGH", "file": "...", "line": 42, "message": "..."},
    ...
  ]
}

# Calculate score
critical = count(issues where severity == "CRITICAL")
high = count(issues where severity == "HIGH")
...
```

### Coverage Integration

```bash
# Run tests with coverage
pnpm test --coverage --json > coverage.json

# Parse output
{
  "total": {
    "lines": {"pct": 75.5},
    "branches": {"pct": 68.2},
    "functions": {"pct": 82.1}
  }
}

# Calculate composite
radar_score = (75.5 × 0.4) + (68.2 × 0.4) + (82.1 × 0.2)
            = 30.2 + 27.3 + 16.4
            = 73.9
```

### Complexity Integration

```bash
# Use available complexity tool
npx complexity-report src/ --format json > complexity.json

# Or TypeScript-specific
npx ts-complexity src/ > complexity.json

# Parse for average CC
```

---

## Fallback Scoring

When measurement tools are unavailable:

### No Coverage Tool

```
Fallback: File-level heuristics
- Check for test files matching source files
- Estimate: (test_files / source_files) × 100
- Mark as "estimated" in report
```

### No Complexity Tool

```
Fallback: Line-based heuristics
- Count lines per function
- Functions > 50 lines: +5 to estimated CC
- Nested loops/conditions: +2 each
- Mark as "estimated" in report
```

### No Judge Available

```
Fallback: Basic lint
- Run ESLint/TSLint
- Map lint errors to severity
- error → HIGH
- warning → MEDIUM
- Mark as "lint-based" in report
```

---

## Reporting Format

### UQS Report Block

```markdown
### UQS Summary

| Domain | Score | Weight | Contribution |
|--------|-------|--------|--------------|
| Judge | 85 | 0.30 | 25.5 |
| Zen | 78 | 0.20 | 15.6 |
| Radar | 72 | 0.25 | 18.0 |
| Warden | 80 | 0.15 | 12.0 |
| Quill | 90 | 0.10 | 9.0 |
| **Total** | | **1.00** | **80.1** |

**Grade:** B (Good)
**Interpretation:** Solid quality, minor improvements optional
```

### Delta Report Block

```markdown
### Cycle Delta

| Domain | Before | After | Delta | Status |
|--------|--------|-------|-------|--------|
| Judge | 70 | 85 | +15 | Improved |
| Zen | 65 | 78 | +13 | Improved |
| Radar | 55 | 72 | +17 | Improved |
| Warden | 80 | 80 | 0 | Unchanged |
| Quill | 85 | 90 | +5 | Improved |

**UQS Delta:** 67.5 → 80.1 (+12.6)
**Diminishing:** No (delta > 5%)
```

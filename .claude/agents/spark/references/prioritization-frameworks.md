# Spark Prioritization Frameworks Reference

Detailed frameworks for feature prioritization and hypothesis validation.

## IMPACT-EFFORT MATRIX

Use this 2x2 matrix to prioritize features objectively.

### Matrix Definition

```
                    HIGH IMPACT
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    │   BIG BETS         │   QUICK WINS       │
    │   High Impact      │   High Impact      │
    │   High Effort      │   Low Effort       │
    │   → Consider       │   → Do First       │
    │                    │                    │
HIGH├────────────────────┼────────────────────┤LOW
EFFORT                   │                  EFFORT
    │                    │                    │
    │   TIME SINKS       │   FILL-INS         │
    │   Low Impact       │   Low Impact       │
    │   High Effort      │   Low Effort       │
    │   → Avoid          │   → Do If Time     │
    │                    │                    │
    └────────────────────┼────────────────────┘
                         │
                    LOW IMPACT
```

### Impact Assessment (1-5)

| Score | Description | Example |
|-------|-------------|---------|
| 5 | Core user workflow improvement | Reduces daily task time by 50% |
| 4 | Significant time savings | Automates repetitive 10-min task |
| 3 | Nice-to-have enhancement | Better visual feedback |
| 2 | Minor improvement | Slightly easier navigation |
| 1 | Negligible benefit | Cosmetic change only |

### Effort Assessment (1-5)

| Score | Description | Scope |
|-------|-------------|-------|
| 5 | Major architectural change | Multiple weeks, many files |
| 4 | Multiple components affected | Several days, cross-cutting |
| 3 | Single component change | 1-2 days, isolated |
| 2 | Minor code change | Hours, single file |
| 1 | Configuration or copy change | Minutes, trivial |

### Priority Matrix Output

```markdown
### Feature Priority Matrix

| Feature | Impact | Effort | Quadrant | Priority |
|---------|--------|--------|----------|----------|
| [Feature A] | 5 | 2 | Quick Win | P1 |
| [Feature B] | 4 | 4 | Big Bet | P2 |
| [Feature C] | 2 | 4 | Time Sink | Skip |
| [Feature D] | 2 | 1 | Fill-In | P3 |

**Recommendation**: Start with Quick Wins, evaluate Big Bets carefully.
```

---

## RICE PRIORITIZATION

Calculate objective priority scores for features.

### RICE Formula

```
RICE Score = (Reach × Impact × Confidence) / Effort
```

### Factor Definitions

**Reach** (number per quarter)
- How many users/customers will this affect?
- Use actual data when available
- Example: 500 users affected per quarter

**Impact** (multiplier: 0.25 - 3)
| Score | Meaning |
|-------|---------|
| 3 | Massive impact (game-changer) |
| 2 | High impact (significant improvement) |
| 1 | Medium impact (noticeable improvement) |
| 0.5 | Low impact (minor improvement) |
| 0.25 | Minimal impact (barely noticeable) |

**Confidence** (percentage: 0-100%)
| Score | Meaning |
|-------|---------|
| 100% | High confidence (data-backed, validated) |
| 80% | Medium confidence (strong intuition, some data) |
| 50% | Low confidence (speculation, gut feeling) |

**Effort** (person-months)
- Estimate total work in person-months
- Include design, development, testing, deployment
- Example: 0.5 = two weeks of work

### RICE Evaluation Template

```markdown
### RICE Evaluation: [Feature Name]

| Factor | Value | Reasoning |
|--------|-------|-----------|
| Reach | [X] users/quarter | [How you estimated this] |
| Impact | [X] (0.25-3) | [Why this impact level] |
| Confidence | [X]% | [What supports this confidence] |
| Effort | [X] person-months | [Breakdown of work] |

**Calculation**: ([Reach] × [Impact] × [Confidence]) / [Effort]

**RICE Score**: **[Final Score]**

**Interpretation**:
- Score > 100: High priority
- Score 50-100: Medium priority
- Score < 50: Low priority
```

### RICE Comparison Table

```markdown
### Feature Prioritization by RICE

| Rank | Feature | Reach | Impact | Conf | Effort | Score |
|------|---------|-------|--------|------|--------|-------|
| 1 | Feature A | 1000 | 2 | 80% | 1 | 1600 |
| 2 | Feature B | 500 | 3 | 50% | 0.5 | 1500 |
| 3 | Feature C | 200 | 1 | 100% | 0.25 | 800 |
```

---

## HYPOTHESIS VALIDATION

Write testable hypotheses using Lean methodology.

### Lean Hypothesis Format

```markdown
## Hypothesis: [Feature Name]

### We believe that
[Building this feature / Making this change]

### For
[Target persona / user segment]

### Will achieve
[Expected outcome / behavior change / metric improvement]

### We will know we are successful when
[Specific, measurable success criteria]

### We will validate this by
[Validation method: A/B test, user interviews, analytics, prototype, etc.]

### Timeline
[When we expect to have validation results]
```

### Hypothesis Card

```markdown
### Hypothesis Card

| Field | Value |
|-------|-------|
| ID | H-[XXX] |
| Feature | [Feature name] |
| Status | Draft / Testing / Validated / Invalidated |
| Target Persona | [Primary persona] |
| Target Metric | [Primary metric to move] |
| Current Baseline | [Current metric value] |
| Target Goal | [Expected metric after launch] |
| Validation Method | [A/B test / Survey / Prototype / Analytics] |
| Sample Size | [Required participants/data points] |
| Timeline | [Start date → Decision date] |

**Key Assumptions** (things that must be true):
1. [Assumption 1]
2. [Assumption 2]
3. [Assumption 3]

**Risks**:
- [What could invalidate this hypothesis]

**Minimum Success Criteria**:
- [Metric] changes from [baseline] to [target] (Δ [X]%)
```

### Hypothesis Status Tracking

```markdown
### Hypothesis Tracker

| ID | Feature | Status | Metric | Result |
|----|---------|--------|--------|--------|
| H-001 | Search | Validated | Time to find | -40% |
| H-002 | Export | Testing | Usage rate | Pending |
| H-003 | Dashboard | Invalidated | Engagement | No change |
```

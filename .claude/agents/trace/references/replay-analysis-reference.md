# trace — リプレイ分析 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## Frustration Signal Detection

### Primary Signals

| Signal | Definition | Severity |
|--------|------------|----------|
| **Rage Click** | 3+ rapid clicks on same element | 🔴 High |
| **Back Loop** | Return to previous page within 5s, 2+ times | 🔴 High |
| **Scroll Thrash** | Rapid up/down scrolling without stopping | 🟡 Medium |
| **Form Abandonment** | Started form but left incomplete | 🟡 Medium |
| **Dead Click** | Click on non-interactive element | 🟡 Medium |
| **Long Pause** | 30s+ inactivity on interactive page | 🟢 Low |
| **Help Seek** | Opened help/FAQ/support during flow | 🟢 Low |

### Signal Aggregation

```yaml
FRUSTRATION_SCORE:
  formula: "(rage_clicks * 3) + (back_loops * 3) + (scroll_thrash * 2) + (dead_clicks * 1)"
  thresholds:
    low: 0-5
    medium: 6-15
    high: 16+
  action:
    low: "Monitor"
    medium: "Investigate"
    high: "Immediate attention"
```

---

## Persona Integration Patterns

### Pattern A: Researcher → Trace (Persona Segmentation)

```yaml
INPUT_FROM_RESEARCHER:
  persona:
    name: "Mobile-first Millennial"
    characteristics:
      - device: mobile
      - age_range: 25-35
      - behavior: quick_decision_maker
    expected_behavior:
      - fast_navigation
      - minimal_scrolling
      - mobile_gestures

TRACE_ANALYSIS:
  segment_by: persona.characteristics
  compare_with: expected_behavior
  output: behavior_gap_report
```

### Pattern B: Trace → Researcher (Persona Validation)

```yaml
TRACE_FINDINGS:
  persona: "Mobile-first Millennial"
  expected: "fast_navigation"
  actual:
    - 40% show expected behavior
    - 35% show extensive comparison behavior
    - 25% show desktop-like scrolling patterns
  recommendation: "Consider splitting into sub-personas"

HANDOFF_TO_RESEARCHER:
  type: PERSONA_VALIDATION
  action: "Review and update persona definition"
```

### Pattern C: Trace → Echo (Problem Handoff)

```yaml
TRACE_DISCOVERY:
  problem: "High abandonment at payment step"
  evidence:
    - rage_click_rate: "23% on submit button"
    - back_loop_rate: "45% return to cart"
    - sessions_analyzed: 1247
  hypothesis: "Trust signals insufficient"

HANDOFF_TO_ECHO:
  type: SIMULATION_REQUEST
  action: "Simulate payment flow as anxious first-time buyer"
  focus: "Trust perception at payment step"
```

### Pattern D: Echo → Trace (Prediction Validation)

```yaml
ECHO_PREDICTION:
  persona: "Senior user"
  predicted_friction: "Font size too small on mobile"
  confidence: 0.8

TRACE_VALIDATION:
  segment: "Users 60+ on mobile"
  metrics_checked:
    - zoom_gestures: "67% of sessions (vs 12% average)"
    - time_on_page: "2.3x average"
  validation_result: "CONFIRMED"
  additional_finding: "Also high rage clicks on small buttons"
```

---

## Analysis Report Template

```markdown
# Session Analysis Report

## Executive Summary
- **Analysis Period:** [Date range]
- **Sessions Analyzed:** [Count]
- **Persona Segments:** [List]
- **Key Finding:** [One sentence]

## Frustration Hotspots

| Location | Signal Type | Frequency | Severity | Affected Personas |
|----------|-------------|-----------|----------|-------------------|
| [Page/Element] | [Signal] | [%] | [🔴/🟡/🟢] | [Personas] |

## Persona Behavior Comparison

### [Persona Name]
- **Expected Behavior:** [Description]
- **Actual Behavior:** [Description]
- **Gap:** [Description]
- **Evidence:** [Session examples]

## User Journey Reconstruction

### Happy Path (Expected)
```
[Step 1] → [Step 2] → [Step 3] → [Conversion]
```

### Actual Common Paths
```
Path A (45%): [Step 1] → [Step 2] ↔ [Back] → [Step 2] → [Abandonment]
Path B (30%): [Step 1] → [Step 2] → [Step 3] → [Conversion]
Path C (25%): [Step 1] → [Help] → [Step 2] → [Conversion]
```

## Recommendations

| Priority | Issue | Evidence | Recommendation | Handoff To |
|----------|-------|----------|----------------|------------|
| P0 | [Issue] | [Data] | [Action] | [Agent] |

## Appendix: Session Examples
- Session #[ID]: [Anonymized description]
```

---


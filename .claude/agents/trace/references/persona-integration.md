# Persona Integration Patterns

Detailed collaboration patterns with Researcher and Echo.

---

## Integration Overview

```
┌──────────────────────────────────────────────────────────┐
│                    PERSONA LIFECYCLE                      │
│                                                          │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐     │
│  │ Researcher │ →  │   Trace    │ →  │   Echo     │     │
│  │  Creates   │    │ Validates  │    │ Simulates  │     │
│  └────────────┘    └────────────┘    └────────────┘     │
│        ↑                  │                  │           │
│        └──────────────────┴──────────────────┘           │
│                    Feedback Loop                         │
└──────────────────────────────────────────────────────────┘
```

---

## Pattern A: Researcher → Trace (Segmentation)

Use Researcher-defined personas to segment sessions for analysis.

### Input Format

```yaml
PERSONA_DEFINITION:
  source: Researcher
  persona:
    name: "Cautious Comparison Shopper"
    id: "CCS-001"

    # Identifiable characteristics
    behavioral_markers:
      - views_multiple_products: ">3 products before cart"
      - compares_prices: "Visits competitor sites"
      - reads_reviews: "Scrolls to review section"
      - long_consideration: ">5 min on product page"

    # Technical markers (for filtering)
    technical_markers:
      device: "any"
      session_duration: ">10 min"
      pages_per_session: ">5"

    # Expected behavior
    expected_journey:
      - Search/Browse
      - Product view (multiple)
      - Review reading
      - Cart (may abandon)
      - Return visit
      - Purchase
```

### Trace Processing

```yaml
SEGMENTATION_PROCESS:
  1. Filter sessions by technical_markers
  2. Score sessions against behavioral_markers
  3. Classify sessions with confidence score

  output:
    persona: "Cautious Comparison Shopper"
    sessions_matched: 1247
    confidence_distribution:
      high: 45%    # 4/4 markers match
      medium: 35%  # 3/4 markers match
      low: 20%     # 2/4 markers match
```

### Output Format

```yaml
SEGMENT_ANALYSIS:
  persona: "Cautious Comparison Shopper"
  analysis_period: "2025-01-01 to 2025-01-31"
  sessions_analyzed: 1247

  behavior_patterns:
    expected_vs_actual:
      - marker: "views_multiple_products"
        expected: ">3 products"
        actual_average: 4.7
        match: true

      - marker: "reads_reviews"
        expected: "Scrolls to review section"
        actual_rate: 67%
        match: partial
        note: "33% skip reviews entirely"

  frustration_by_persona:
    overall_score: 12.3
    hotspots:
      - location: "Product comparison"
        score: 18.7
        signal: "Rage clicks on compare button"
```

---

## Pattern B: Trace → Researcher (Validation)

Validate and update persona definitions based on real data analysis.

### Validation Report Format

```yaml
PERSONA_VALIDATION_REPORT:
  persona: "Cautious Comparison Shopper"
  validation_date: "2025-01-31"
  sessions_analyzed: 1247

  validation_results:
    overall_match: 72%

    by_marker:
      - marker: "views_multiple_products"
        expected: ">3 products"
        actual_match: 89%
        status: "VALIDATED"

      - marker: "compares_prices"
        expected: "Visits competitor sites"
        actual_match: 34%
        status: "NEEDS_REVIEW"
        finding: "Most comparison happens within site"

      - marker: "reads_reviews"
        expected: "Scrolls to review section"
        actual_match: 67%
        status: "PARTIAL"
        finding: "Video reviews more popular than text"

  discovered_sub_segments:
    - name: "Quick Decider (subset)"
      percentage: 28%
      distinguishing_behavior: "Decides within 2 product views"
      suggestion: "Consider separate persona"

    - name: "Review Dependent"
      percentage: 45%
      distinguishing_behavior: "Won't add to cart without reviews"
      suggestion: "Add as variant"

  recommendations:
    - priority: high
      action: "Update 'compares_prices' marker definition"
      reason: "Behavior changed - internal comparison dominant"

    - priority: medium
      action: "Consider splitting persona"
      reason: "Significant behavioral variance detected"
```

### Handoff to Researcher

```markdown
## RESEARCHER_HANDOFF (from Trace)

### Persona Validation: Cautious Comparison Shopper

**Analysis Period:** 2025-01-01 to 2025-01-31
**Sessions Analyzed:** 1,247

### Validation Summary

| Marker | Expected | Match Rate | Status |
|--------|----------|------------|--------|
| Multiple product views | >3 products | 89% | ✅ Validated |
| Compares prices | Competitor visits | 34% | ⚠️ Needs review |
| Reads reviews | Scrolls to reviews | 67% | 🔶 Partial |

### Key Finding

The "competitor site visits" marker does not match actual behavior.
Users primarily use **internal comparison features** (78%).

### Discovered Sub-segments

1. **Quick Decider (28%)**: Decides within 2 product views
2. **Review Dependent (45%)**: Won't purchase without reviews

### Recommended Actions

1. 🔴 Update "price comparison" marker definition
2. 🟡 Consider persona split

Suggested command: `/Researcher update persona CCS-001 based on Trace findings`
```

---

## Pattern C: Trace → Echo (Problem Handoff)

Hand off discovered problems to Echo for simulation verification.

### Problem Discovery Format

```yaml
PROBLEM_DISCOVERY:
  id: "PROB-2025-0131-001"
  discovery_date: "2025-01-31"

  location:
    page: "/checkout/payment"
    element: "#submit-payment-btn"

  evidence:
    sessions_analyzed: 3421
    frustration_score: 23.7 (High)

    signals:
      rage_clicks:
        rate: 18%
        detail: "Average 4.2 clicks before success"
      back_loops:
        rate: 34%
        detail: "Return to cart, re-add items"
      abandonment:
        rate: 28%
        detail: "Exit after 2+ submit attempts"

  affected_personas:
    - persona: "Mobile-first Millennial"
      impact: "HIGH (45% affected)"
    - persona: "Cautious Comparison Shopper"
      impact: "MEDIUM (23% affected)"
    - persona: "Senior User"
      impact: "LOW (12% affected)"

  hypothesis:
    primary: "Submit button state unclear after click"
    supporting_evidence:
      - "67% of rage clicks occur within 2s of first click"
      - "Mobile users 3x more affected than desktop"
      - "No loading indicator visible on mobile"
```

### Handoff to Echo

```markdown
## ECHO_HANDOFF (from Trace)

### Problem: Payment Submit Button Frustration

**Frustration Score:** 23.7 (High)
**Sessions Analyzed:** 3,421

### Evidence

| Signal | Rate | Detail |
|--------|------|--------|
| Rage clicks | 18% | Average 4.2 clicks before success |
| Back loops | 34% | Return to cart, re-add items |
| Abandonment | 28% | Exit after 2+ submit attempts |

### Most Affected Personas

1. **Mobile-first Millennial** - 45% affected (HIGH)
2. **Cautious Comparison Shopper** - 23% affected (MEDIUM)

### Simulation Request

**Persona:** Mobile-first Millennial
**Flow:** Payment submission
**Focus:** Button state feedback after tap
**Hypothesis:** Users can't tell if the button responded

### Questions for Echo

1. Is the tap feedback sufficient?
2. Is it clear that processing is happening?
3. Do you feel the urge to tap again?

Suggested command: `/Echo simulate payment flow as Mobile-first Millennial, focus on submit button feedback`
```

---

## Pattern D: Echo → Trace (Prediction Validation)

Validate Echo's simulation predictions with real session data.

### Prediction Input

```yaml
ECHO_PREDICTION:
  prediction_id: "ECHO-PRED-001"
  prediction_date: "2025-01-25"

  persona: "Senior User"
  flow: "Account settings"

  predicted_friction:
    - location: "Password change form"
      issue: "Font size too small"
      confidence: 0.85
      expected_signals:
        - zoom_gestures
        - long_form_completion_time

    - location: "Save button"
      issue: "Low color contrast"
      confidence: 0.72
      expected_signals:
        - dead_clicks_nearby
        - help_seeking
```

### Validation Process

```yaml
TRACE_VALIDATION:
  prediction_id: "ECHO-PRED-001"
  validation_date: "2025-01-31"

  segment_criteria:
    age_group: "60+"
    flow: "Account settings"

  sessions_analyzed: 234

  validation_results:
    - prediction: "Font size too small"
      status: "CONFIRMED"
      confidence_delta: +0.10  # Higher than predicted
      evidence:
        zoom_gestures: 78% (vs 12% average)
        form_completion_time: 3.2x average
        additional_finding: "42% increase text size in browser"

    - prediction: "Low color contrast"
      status: "PARTIAL"
      confidence_delta: -0.15  # Lower than predicted
      evidence:
        dead_clicks_nearby: 8% (expected 15%+)
        help_seeking: 3%
        note: "Button works but hesitation observed"
```

### Validation Report

```markdown
## Echo Prediction Validation Report

**Prediction ID:** ECHO-PRED-001
**Persona:** Senior User
**Flow:** Account settings
**Sessions Analyzed:** 234

### Results

| Prediction | Confidence | Status | Evidence |
|------------|------------|--------|----------|
| Font size too small | 0.85 → 0.95 | ✅ CONFIRMED | 78% zoom, 3.2x time |
| Low color contrast | 0.72 → 0.57 | 🔶 PARTIAL | 8% dead clicks |

### Confirmed: Font Size Issue

Echo's prediction was confirmed by real data.
- Zoom gestures: 78% (vs 12% average)
- Form completion time: 3.2x average
- Additional finding: 42% increase text size in browser

### Partial: Contrast Issue

Impact is lower than predicted, but problem exists.
- Dead clicks: 8% (expected 15%+)
- Observation: Hesitation observed before clicking

### Recommendation

1. Font size issue is **P0** - immediate attention recommended
2. Contrast issue is **P2** - continue monitoring
```

---

## Persona Segment Mapping

### Default Segment Mappings

| Researcher Persona | Trace Technical Filters | Behavioral Markers |
|-------------------|-------------------------|-------------------|
| Mobile-first Millennial | device=mobile, age=25-35 | fast_navigation, gesture_heavy |
| Cautious Shopper | session_duration>10min | multiple_product_views, review_reader |
| Senior User | age=60+ | slow_pace, zoom_gestures |
| Power User | visits>10/month | keyboard_shortcuts, direct_navigation |
| First-time Visitor | visit_count=1 | help_seeking, exploration_pattern |

### Custom Segment Definition

```yaml
CUSTOM_SEGMENT:
  name: "[Persona Name]"

  technical_filters:
    # Demographic
    age_range: "[min]-[max]"
    location: "[region/country]"

    # Device
    device_type: "[mobile/desktop/tablet/any]"
    browser: "[specific or any]"

    # Behavioral (quantitative)
    session_duration: "[operator] [value]"
    pages_per_session: "[operator] [value]"
    visit_frequency: "[operator] [value]"

  behavioral_markers:
    # Actions to look for
    - marker_name: "[description]"
      detection_rule: "[how to identify]"
      weight: [1-5]  # Importance for classification
```

# Report Templates

Collection of output report templates for Trace.

---

## 1. Standard Analysis Report

```markdown
# Session Analysis Report

## Executive Summary

| Item | Value |
|------|-------|
| Analysis Period | [YYYY-MM-DD] to [YYYY-MM-DD] |
| Sessions Analyzed | [n] sessions |
| Target Flow | [Flow name] |
| Target Personas | [Persona list] |
| Overall Frustration Score | [Score] ([Low/Medium/High/Critical]) |

### Key Findings

1. **[Finding 1 Title]**: [One sentence description]
2. **[Finding 2 Title]**: [One sentence description]
3. **[Finding 3 Title]**: [One sentence description]

---

## Frustration Hotspots

### By Priority

| Priority | Location | Signal | Affected Sessions | Score |
|----------|----------|--------|-------------------|-------|
| P0 | [Page/Element] | [Signal type] | [n] ([%]) | [Score] |
| P1 | [Page/Element] | [Signal type] | [n] ([%]) | [Score] |
| P2 | [Page/Element] | [Signal type] | [n] ([%]) | [Score] |

### P0: [Problem Title]

**Location:** [Page URL] → [Element]
**Detected Signal:** [Signal type]
**Impact:** [n] sessions ([%] of total)

**Evidence:**
- [Specific data point 1]
- [Specific data point 2]
- [Specific data point 3]

**Session Examples:**
- Session #[ID]: [Anonymized description]

**Hypothesis:** [Why this problem is occurring]

**Recommended Action:** [Specific remediation]
**Handoff To:** [Echo/Palette/etc.]

---

## Persona Behavior Analysis

### [Persona Name]

| Metric | Expected | Actual | Delta |
|--------|----------|--------|-------|
| [Behavior metric 1] | [Expected] | [Actual] | [+/-] |
| [Behavior metric 2] | [Expected] | [Actual] | [+/-] |

**Characteristic Behavior Patterns:**
- [Pattern 1 description]
- [Pattern 2 description]

**Persona-Specific Issues:**
- [Issue 1]: [Details]

---

## User Journey Analysis

### Expected Flow
```
[Step 1] → [Step 2] → [Step 3] → [Conversion]
```

### Actual Common Paths

**Path A ([%]):** Success pattern
```
[Step 1] → [Step 2] → [Step 3] → [Conversion]
```

**Path B ([%]):** Abandonment pattern
```
[Step 1] → [Step 2] ↔ [Back] → [Exit]
```
- Estimated reason: [Reason]

**Path C ([%]):** Help-dependent pattern
```
[Step 1] → [Help] → [Step 2] → [Conversion]
```
- Observation: [Insight]

---

## Recommended Actions

| Priority | Action | Evidence | Handoff To | Expected Impact |
|----------|--------|----------|------------|-----------------|
| P0 | [Action] | [Data] | [Agent] | [Impact] |
| P1 | [Action] | [Data] | [Agent] | [Impact] |
| P2 | [Action] | [Data] | [Agent] | [Impact] |

---

## Appendix

### A. Methodology
- Data source: [Source]
- Filter criteria: [Criteria]
- Statistical significance: [p-value/confidence interval]

### B. Session Samples
| Session ID | Persona | Notes |
|------------|---------|-------|
| #[ID] | [Persona] | [Description] |

### C. Data Limitations
- [Limitation 1]
- [Limitation 2]
```

---

## 2. Persona Validation Report

```markdown
# Persona Validation Report

## Validation Summary

| Item | Value |
|------|-------|
| Target Persona | [Persona name] |
| Persona ID | [ID] |
| Validation Period | [Period] |
| Sessions Analyzed | [n] |
| Overall Match Rate | [%] |

### Validation Conclusion

**[✅ VALIDATED / ⚠️ NEEDS_UPDATE / ❌ INVALID]**

[1-2 sentence conclusion explanation]

---

## Marker-by-Marker Validation

### ✅ Validated Markers

| Marker | Expected | Actual | Match Rate |
|--------|----------|--------|------------|
| [Marker 1] | [Expected] | [Actual] | [%] |

### ⚠️ Markers Needing Update

| Marker | Expected | Actual | Match Rate | Suggested Update |
|--------|----------|--------|------------|------------------|
| [Marker] | [Expected] | [Actual] | [%] | [Update suggestion] |

**Evidence:**
- [Data point 1]
- [Data point 2]

**Reason for Update Recommendation:**
[Explanation]

### ❌ Invalid Markers

| Marker | Expected | Actual | Match Rate |
|--------|----------|--------|------------|
| [Marker] | [Expected] | [Actual] | [%] |

**Observation:**
[Why this marker is invalid]

---

## Discovered Sub-segments

### Sub-segment 1: [Name]

**Proportion:** [%] of [Persona] sessions

**Distinguishing Characteristics:**
- [Characteristic 1]
- [Characteristic 2]

**Key Behavioral Differences:**
| Behavior | Parent Persona | This Sub-segment |
|----------|---------------|------------------|
| [Behavior 1] | [Value] | [Value] |

**Recommendation:**
- [ ] Split into separate persona
- [ ] Add as variant
- [ ] Keep as-is (continue monitoring)

---

## Handoff to Researcher

### Recommended Updates

1. **[Marker name] update**
   - Current: [Current definition]
   - Recommended: [New definition]
   - Evidence: [Data]

2. **New sub-segment consideration**
   - Proposed name: [Name]
   - Evidence: [Data]

### Additional Research Recommendations

- [Research question 1]
- [Research question 2]
```

---

## 3. Problem Investigation Report

```markdown
# Problem Investigation Report

## Investigation Overview

| Item | Value |
|------|-------|
| Investigation Trigger | [Pulse anomaly / Echo prediction / User report] |
| Problem Area | [Page/Flow] |
| Investigation Date | [Date] |
| Sessions Analyzed | [n] |

---

## Problem Identification

### Primary Problem

**Location:** [Page URL] → [Element/Section]

**Symptoms:**
- [Symptom 1]
- [Symptom 2]

**Impact Scale:**
- Affected sessions: [n] ([%])
- Estimated conversion loss: [%]
- Affected personas: [List]

---

## Evidence Analysis

### Quantitative Data

| Metric | Before | During | Change |
|--------|--------|--------|--------|
| [Metric 1] | [Value] | [Value] | [+/-] |
| [Metric 2] | [Value] | [Value] | [+/-] |

### Frustration Signals

| Signal | Count | Affected Sessions | Severity |
|--------|-------|-------------------|----------|
| [Signal 1] | [n] | [%] | [High/Med/Low] |

### Session Analysis

**Typical Problem Session:**
```
[User actions described chronologically]
1. [Time] - [Action]
2. [Time] - [Action] ← Problem occurs here
3. [Time] - [Frustration behavior]
4. [Time] - [Outcome (exit/success)]
```

**Session Examples:**
- Session #[ID]: [Description]
- Session #[ID]: [Description]

---

## Root Cause Analysis

### Hypotheses

| Hypothesis | Supporting Evidence | Contradicting Evidence | Confidence |
|------------|---------------------|------------------------|------------|
| [Hypothesis 1] | [Evidence] | [Evidence] | [High/Med/Low] |
| [Hypothesis 2] | [Evidence] | [Evidence] | [High/Med/Low] |

### Most Likely Cause

**[Cause description]**

Supporting evidence:
1. [Evidence 1]
2. [Evidence 2]
3. [Evidence 3]

---

## Recommended Response

### Immediate Action (P0)

**Action:** [Specific action]
**Owner:** [Palette/Builder/etc.]
**Expected Impact:** [Impact]

### Verification Recommendation

**Echo Simulation Verification:**
- Persona: [Persona]
- Focus: [Verification point]

### Monitoring

**Pulse Continuous Monitoring:**
- Metric: [Metric to monitor]
- Threshold: [Alert condition]

---

## Next Steps

- [ ] Request Echo simulation
- [ ] Request Palette fix
- [ ] Set up Pulse monitoring
- [ ] Measure impact after [period]
```

---

## 4. Quick Analysis Summary

Short report template for quick analysis.

```markdown
# Quick Analysis Summary

**Target:** [Flow/Page]
**Period:** [Period]
**Sessions:** [n]

## Top 3 Findings

1. 🔴 **[Finding 1]**: [One sentence] → [Recommended action]
2. 🟡 **[Finding 2]**: [One sentence] → [Recommended action]
3. 🟢 **[Finding 3]**: [One sentence] → [Recommended action]

## Frustration Scores

| Location | Score | Primary Signal |
|----------|-------|----------------|
| [Location 1] | [Score] | [Signal] |
| [Location 2] | [Score] | [Signal] |

## Next Actions

- [ ] [Action] → [Owner agent]
```

---

## 5. Comparison Report

For A/B tests or before/after release comparisons.

```markdown
# Comparison Analysis Report

## Comparison Overview

| Item | Group A | Group B |
|------|---------|---------|
| Period | [Period] | [Period] |
| Sessions | [n] | [n] |
| Description | [Description] | [Description] |

---

## Key Metrics Comparison

| Metric | Group A | Group B | Difference | Significance |
|--------|---------|---------|------------|--------------|
| Frustration Score | [Value] | [Value] | [+/-] | [p-value] |
| Completion Rate | [%] | [%] | [+/-] | [p-value] |
| Average Duration | [Time] | [Time] | [+/-] | [p-value] |

---

## Behavior Pattern Comparison

### [Location/Flow]

**Group A:**
- [Pattern description]
- Frustration signals: [List]

**Group B:**
- [Pattern description]
- Frustration signals: [List]

**Interpretation:** [Difference interpretation]

---

## Conclusion

**[Group A/B] performs better**

Reasons:
1. [Reason 1]
2. [Reason 2]

**Caveats:**
- [Caveat]

## Recommendation

- [Recommended action]
```

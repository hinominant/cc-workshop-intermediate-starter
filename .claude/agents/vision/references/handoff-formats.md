# Handoff Formats

Standardized handoff templates for Vision's agent collaboration.

---

## Input Handoffs (→ Vision)

### NEXUS_TO_VISION_HANDOFF

```markdown
## NEXUS_TO_VISION_HANDOFF

**Task**: [Redesign / New product design / Design review / Trend application]
**Target**: [Repository path or application description]
**Framework**: [React / Vue / Svelte / HTML / auto-detect]
**Scope**: [Full redesign / Component-level / Page-level / Token-level]

**Context**:
- Brand assets: [Existing brand guidelines path or "none"]
- Current design system: [Existing tokens/styles path or "none"]
- Target audience: [Description]
- Business objectives: [Key goals]

**Request**: [Specific deliverable expected]
```

### RESEARCHER_TO_VISION_HANDOFF

```markdown
## RESEARCHER_TO_VISION_HANDOFF

**Research Summary**:
- Target Users: [Persona descriptions]
- Key Insights: [User behavior findings]
- Pain Points: [Identified UX issues]
- Competitor Analysis: [Competitive landscape]

**Design Implications**:
| Finding | Design Impact | Priority |
|---------|--------------|----------|
| [Finding] | [How it affects design] | [High/Med/Low] |

**Request**: Define design direction informed by these research findings
```

### SCOUT_TO_VISION_HANDOFF

```markdown
## SCOUT_TO_VISION_HANDOFF

**Design-Related Bugs**:
| Bug | Component | UX Impact | Severity |
|-----|-----------|-----------|----------|
| [Bug] | [Component] | [Impact] | [High/Med/Low] |

**Request**: Review design patterns causing recurring issues
```

---

## Output Handoffs (Vision →)

### VISION_TO_MUSE_HANDOFF

```markdown
## VISION_TO_MUSE_HANDOFF

### Design Direction Summary
- Visual Style: [Modern/Classic/Playful]
- Color Scheme: [Primary/Secondary tokens]
- Typography: [Font stack + scale]

### Token Specifications
[CSS variable definitions from Style Guide]

### Priority Components
1. [Component]: [Specific token application notes]
2. [Component]: [Specific token application notes]

### Dark Mode Requirements
- [Specific color adjustments]
- [Contrast requirements]

### Success Criteria
- [ ] All hardcoded values replaced with tokens
- [ ] Dark mode fully supported
- [ ] Spacing follows 8px grid
- [ ] Typography scale applied consistently
```

### VISION_TO_PALETTE_HANDOFF

```markdown
## VISION_TO_PALETTE_HANDOFF

### Heuristic Findings Summary
| Heuristic | Score | Primary Issue |
|-----------|-------|---------------|
| [Heuristic] | [1-5] | [Issue] |

### Priority Improvements
1. [Issue]: [Expected outcome]
2. [Issue]: [Expected outcome]

### Interaction Patterns to Apply
- [Pattern]: [Where to apply]
- [Pattern]: [Where to apply]

### Success Criteria
- [ ] Heuristic scores improved
- [ ] Feedback quality enhanced
- [ ] Error handling improved
```

### VISION_TO_FLOW_HANDOFF

```markdown
## VISION_TO_FLOW_HANDOFF

### Motion Philosophy
- Overall Feel: [Snappy/Smooth/Playful]
- Timing Convention: Fast (100-200ms), Normal (200-300ms), Slow (300-500ms)

### Priority Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| [Element] | [Trigger] | [Type] | [ms] | [easing] |

### Reduced Motion Requirements
- All animations must respect `prefers-reduced-motion`
- Alternative static states required

### Success Criteria
- [ ] Animations feel cohesive
- [ ] No layout thrashing
- [ ] Reduced motion supported
```

### VISION_TO_FORGE_HANDOFF

```markdown
## VISION_TO_FORGE_HANDOFF

### Prototype Scope
- Pages: [List of pages]
- Key Interactions: [List]

### Design Assets
- Moodboard: [Reference]
- Wireframes: [Reference]
- Token CSS: [Reference]

### Priority Features
1. [Feature]: [Functionality]
2. [Feature]: [Functionality]

### Success Criteria
- [ ] Core user flow functional
- [ ] Design tokens applied
- [ ] Responsive breakpoints working
```

### VISION_TO_ECHO_HANDOFF

```markdown
## VISION_TO_ECHO_HANDOFF

### Design Direction Summary
[Brief description of chosen direction]

### Validation Questions
1. [Question about user perception]
2. [Question about usability]
3. [Question about brand alignment]

### Test Scenarios
| Scenario | Expected Behavior | Persona |
|----------|-------------------|---------|
| [Scenario] | [Expected] | [Persona] |

### Success Criteria
- [ ] Positive user perception of direction
- [ ] Task completion rates maintained or improved
- [ ] Brand alignment confirmed
```

---

## Bridge ↔ Vision Handoffs

### BRIDGE_TO_VISION_HANDOFF

Business constraints and stakeholder expectations provided by Bridge to inform design direction.

```yaml
BRIDGE_TO_VISION_HANDOFF:
  Context:
    project: "[Project name]"
    business_goals:
      - "[Business goal 1]"
      - "[Business goal 2]"
    target_audience: "[Primary user segment]"
  Constraints:
    budget:
      development_hours: "[Available hours or team size]"
      external_tools: "[Budget for design tools/libraries]"
    timeline:
      deadline: "[Target date]"
      milestones: ["[Milestone 1]", "[Milestone 2]"]
    scope:
      pages_in_scope: ["[Page 1]", "[Page 2]"]
      out_of_scope: ["[Excluded area 1]"]
    technical:
      stack: "[Framework/tech stack]"
      limitations: ["[Limitation 1]", "[Limitation 2]"]
  Stakeholder_Expectations:
    - stakeholder: "[Role/name]"
      expectation: "[What they expect from the redesign]"
      priority: "[high | medium | low]"
  Brand_Requirements:
    preserve: ["[Brand element to keep]"]
    flexible: ["[Brand element open to evolution]"]
  Requested_Output: "Design direction options with business impact assessment"
```

---

### VISION_TO_BRIDGE_HANDOFF

Design direction business impact assessment request from Vision to Bridge.

```yaml
VISION_TO_BRIDGE_HANDOFF:
  Design_Direction:
    name: "[Direction name]"
    summary: "[1-2 sentence description]"
    key_changes:
      - "[Change 1]"
      - "[Change 2]"
    token_impact:
      new_tokens: [count]
      modified_tokens: [count]
      deprecated_tokens: [count]
  Implementation_Estimate:
    agents_needed: ["Muse", "Palette", "Flow"]
    complexity: "[low | medium | high]"
    estimated_phases: [count]
  Assessment_Requested:
    - "Does this direction align with stated business goals?"
    - "Is the implementation effort within budget/timeline?"
    - "Will stakeholders accept this direction?"
    - "Are there business risks not addressed?"
  Alternatives_Considered:
    - name: "[Alternative direction]"
      reason_not_selected: "[Why this was deprioritized]"
```

---

## Vision ↔ Warden Handoffs

### VISION_TO_WARDEN_PRECHECK

Design direction V.A.I.R.E. pre-check request from Vision to Warden.

```yaml
VISION_TO_WARDEN_PRECHECK:
  Request_Type: design_direction_precheck
  Design_Direction:
    name: "[Direction name]"
    mode: "[redesign | new_product | review | trend_application]"
    summary: "[2-3 sentence description of the design direction]"
    key_principles:
      - "[Principle 1]"
      - "[Principle 2]"
    target_audience: "[Primary user segment]"
  Token_Strategy:
    color_system: "[Summary of color approach]"
    typography: "[Summary of typography approach]"
    spacing: "[Summary of spacing approach]"
    dark_mode: "[yes | no | planned]"
  Component_Priorities:
    - component: "[Component 1]"
      change_type: "[new | redesign | refine]"
      impact: "[high | medium | low]"
  Accessibility_Baseline:
    wcag_level: "[AA | AAA]"
    known_tradeoffs: ["[Tradeoff 1 if any]"]
  Delegation_Plan:
    - agent: "Muse"
      task: "[Token implementation scope]"
    - agent: "Palette"
      task: "[UX improvement scope]"
    - agent: "Flow"
      task: "[Animation scope]"
  Pre_Check_Scope: "full | value_agency_only | identity_resilience_only"
```

---

### WARDEN_TO_VISION_FEEDBACK

V.A.I.R.E. pre-check results from Warden to Vision.

```yaml
WARDEN_TO_VISION_FEEDBACK:
  Result: "PASS | CONDITIONAL | FAIL"
  Direction_Reviewed: "[Direction name]"
  V_A_I_R_E_Assessment:
    Value:
      score: [0-3]
      status: "pass | conditional | fail"
      finding: "[Assessment of user value delivery]"
      recommendation: "[Adjustment if needed]"
    Agency:
      score: [0-3]
      status: "pass | conditional | fail"
      finding: "[Assessment of user control preservation]"
      recommendation: "[Adjustment if needed]"
    Identity:
      score: [0-3]
      status: "pass | conditional | fail"
      finding: "[Assessment of brand coherence]"
      recommendation: "[Adjustment if needed]"
    Resilience:
      score: [0-3]
      status: "pass | conditional | fail"
      finding: "[Assessment of edge case handling]"
      recommendation: "[Adjustment if needed]"
    Echo:
      score: [0-3]
      status: "pass | conditional | fail"
      finding: "[Assessment of persona alignment]"
      recommendation: "[Adjustment if needed]"
  Overall_Score: "[Sum of dimension scores, 0-15]"
  Pass_Threshold: "All dimensions >= 2 (minimum 10/15)"
  Critical_Issues:
    - dimension: "[Dimension with score < 2]"
      issue: "[Description of critical issue]"
      required_action: "[What must change]"
  Conditional_Items:
    - dimension: "[Dimension with score = 2]"
      concern: "[What could be improved]"
      suggested_mitigation: "[How to address]"
  Iteration_Count: "[1 | 2]"
  Next_Action: "proceed | revise_and_resubmit | escalate_to_user"
```

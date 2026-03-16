# Spark Proposal Templates Reference

Templates and examples for feature proposals.

## Enhanced Spark Proposal Template

```markdown
# Feature: User Activity Dashboard

## Input Sources
<!-- Check which sources informed this proposal -->
- [x] Scout (Technical investigation)
- [x] Echo (Latent needs from persona walkthrough)
- [ ] Researcher (User research insights)
- [ ] Voice (Aggregated user feedback)
- [ ] Compete (Competitive gap analysis)
- [ ] Pulse (Funnel/metric data)

## JTBD Foundation

**Job Statement**: When I notice unfamiliar activity on my account,
I want to verify my login history, so I can confirm my account is secure.

**Functional Job**: Review past access events quickly and completely
**Emotional Job**: Feel confident and in control of account security
**Social Job**: Appear security-conscious to team/organization

**Force Balance**:
| Force | Current State | Design Response |
|-------|---------------|-----------------|
| Push | No visibility = anxiety | Surface activity proactively |
| Pull | Imagined peace of mind | Clear, scannable history |
| Anxiety | "What if I see something bad?" | Clear next steps for issues |
| Inertia | "Current login works fine" | Zero-friction access |

## Proposal Details

**Persona**: Power User (daily active, efficiency-focused)

**Priority**: Quick Win (Impact: 5, Effort: 2)

**RICE Score**: (500 × 2 × 80%) / 0.5 = 1600

**User Story**: As a user, I want to see my past login history
so that I can feel secure and track my activity.

**Hypothesis**: We believe that showing login history will
increase user trust and reduce support tickets about
"suspicious activity" by 30%.

**Feasibility**: High. We already store `last_login` and
`ip_address` in the `User` table.

**Requirements**:
- [ ] Create API endpoint `/api/activity/history`
- [ ] UI Component `ActivityTable`
- [ ] Read-only view, no write operations
- [ ] Paginated results (20 per page)

**Acceptance Criteria**:
- [ ] User can see last 50 login events
- [ ] Each event shows: date, time, IP, device
- [ ] Page loads in < 2 seconds

## Validation Plan

**Pre-Implementation**:
- [ ] Echo validation with target persona
- [ ] Scout technical feasibility confirmed

**Post-Implementation**:
- [ ] A/B test with Experiment (2 weeks)
- [ ] Success metric: Support ticket reduction ≥30%
- [ ] Secondary metric: Feature adoption ≥40%

**Decision Criteria**:
- Ship if: Ticket reduction ≥30%
- Iterate if: Ticket reduction 15-30%
- Kill if: Ticket reduction <15%

## Next Steps

**Handoff to**: Sherpa (task breakdown) → Forge (prototype) → Builder
```

---

## Minimal Proposal Template

For simpler proposals, a minimal format is acceptable:

```markdown
# Feature: User Activity Dashboard

**Persona**: Power User (daily active, efficiency-focused)

**Priority**: Quick Win (Impact: 5, Effort: 2)

**RICE Score**: (500 × 2 × 80%) / 0.5 = 1600

**User Story**: As a user, I want to see my past login history
so that I can feel secure and track my activity.

**Hypothesis**: We believe that showing login history will
increase user trust and reduce support tickets about
"suspicious activity" by 30%.

**Feasibility**: High. We already store `last_login` and
`ip_address` in the `User` table.

**Requirements**:
- [ ] Create API endpoint `/api/activity/history`
- [ ] UI Component `ActivityTable`
- [ ] Read-only view, no write operations
- [ ] Paginated results (20 per page)

**Acceptance Criteria**:
- [ ] User can see last 50 login events
- [ ] Each event shows: date, time, IP, device
- [ ] Page loads in < 2 seconds
```

---

## Bad Proposal Example

Avoid proposals like this:

```markdown
# Idea: Add Blockchain

Let's put everything on the blockchain to make it secure.
(Why? How? What data? No persona, no hypothesis, no metrics.)
```

**Issues**:
- No target persona
- No testable hypothesis
- No feasibility assessment
- No acceptance criteria
- Vague scope without specifics

---

## Interaction Trigger Question Templates

### BEFORE_FEATURE_SCOPE

```yaml
questions:
  - question: "What level of feature proposal do you need?"
    header: "Scope"
    options:
      - label: "Small improvement (Recommended)"
        description: "Extend existing functionality or improve UX"
      - label: "New feature"
        description: "Add new capability or workflow"
      - label: "Feature set"
        description: "Multiple related features as a package"
    multiSelect: false
```

### ON_PRIORITY_ASSESSMENT

```yaml
questions:
  - question: "How should we prioritize these features?"
    header: "Priority"
    options:
      - label: "Impact-Effort Matrix (Recommended)"
        description: "Quick visual quadrant analysis"
      - label: "RICE Score"
        description: "Detailed quantitative scoring"
      - label: "Persona Alignment"
        description: "Prioritize by target user needs"
      - label: "All frameworks"
        description: "Comprehensive analysis using all methods"
    multiSelect: false
```

### ON_PERSONA_SELECTION

```yaml
questions:
  - question: "Which user persona should this feature primarily target?"
    header: "Target"
    options:
      - label: "Power User"
        description: "Daily users seeking efficiency and advanced features"
      - label: "Casual User"
        description: "Occasional users needing simplicity"
      - label: "Admin/Manager"
        description: "Users with oversight and control needs"
      - label: "New User"
        description: "First-time users in onboarding phase"
    multiSelect: false
```

### ON_SCOUT_INVESTIGATION

```yaml
questions:
  - question: "Technical investigation needed. How should we proceed?"
    header: "Investigation"
    options:
      - label: "Request Scout investigation (Recommended)"
        description: "Have Scout analyze codebase for feasibility"
      - label: "Assume feasibility"
        description: "Proceed with proposal, note assumptions"
      - label: "Scope down"
        description: "Reduce feature scope to known-feasible parts"
    multiSelect: false
```

### ON_EXPERIMENT_REQUEST

```yaml
questions:
  - question: "How should we validate this hypothesis before full implementation?"
    header: "Validation"
    options:
      - label: "A/B test with Experiment (Recommended)"
        description: "Statistical validation with control group"
      - label: "Prototype with Forge first"
        description: "Quick prototype before A/B test"
      - label: "Validate with Echo personas"
        description: "Persona walkthrough instead of A/B test"
      - label: "Skip validation, proceed to implementation"
        description: "High confidence, validation not needed"
    multiSelect: false
```

### ON_EXPERIMENT_RESULT

```yaml
questions:
  - question: "Experiment returned results. What should we do with this hypothesis?"
    header: "Result Action"
    options:
      - label: "Proceed based on verdict (Recommended)"
        description: "Ship if validated, iterate if inconclusive, kill if invalidated"
      - label: "Request deeper analysis"
        description: "Need more data or segment breakdown"
      - label: "Iterate and re-test"
        description: "Modify hypothesis and run new test"
      - label: "Override verdict with justification"
        description: "Proceed despite results (document reasoning)"
    multiSelect: false
```

### ON_VALIDATION_LOOP

```yaml
questions:
  - question: "Echo validated the proposal. What's the next step?"
    header: "Next Step"
    options:
      - label: "Hand off to Sherpa for breakdown (Recommended)"
        description: "Proposal approved, ready for implementation planning"
      - label: "Request Experiment validation"
        description: "Need A/B test before implementation"
      - label: "Iterate on proposal"
        description: "Echo found issues, revise proposal"
      - label: "Hand off to Forge for prototype"
        description: "Need prototype before full implementation"
    multiSelect: false
```

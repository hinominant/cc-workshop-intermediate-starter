# Warden Handoff Templates

Collection of handoff formats between Warden and other agents.

---

## Incoming Handoffs (→ Warden)

### FORGE_TO_WARDEN_HANDOFF

Quality evaluation request for prototypes.

```markdown
## FORGE_TO_WARDEN_HANDOFF

**Prototype ID**: [ID or name]
**Type**: [UI Prototype / Flow Prototype / Full MVP]
**Created**: YYYY-MM-DD

**Prototype Scope**:
| Page/Flow | Components | Interactions |
|-----------|------------|--------------|
| [Page 1] | [count] | [count] |
| [Page 2] | [count] | [count] |

**Design Decisions Made**:
1. [Decision 1 - e.g., "Used tabs instead of accordion"]
2. [Decision 2 - e.g., "Error states show inline"]

**Known Limitations**:
- [Limitation 1 - e.g., "Offline not implemented"]
- [Limitation 2 - e.g., "Loading states are placeholder"]

**Evaluation Focus**:
- [Area 1 - e.g., "Agency: consent flow"]
- [Area 2 - e.g., "Resilience: error handling"]

**Files/URLs**:
- Prototype: [URL or path]
- Design specs: [path]

**Request**: V.A.I.R.E. evaluation at [L0 / L1 / L2] level
```

---

### BUILDER_TO_WARDEN_HANDOFF

Pre-release evaluation request after implementation complete.

```markdown
## BUILDER_TO_WARDEN_HANDOFF

**Implementation ID**: [PR# or feature name]
**Type**: [New Feature / Enhancement / Bug Fix]
**Completed**: YYYY-MM-DD

**Implementation Summary**:
| Aspect | Detail |
|--------|--------|
| Changed Files | [count] |
| New Components | [list] |
| Modified Flows | [list] |
| Test Coverage | [%] |

**V.A.I.R.E. Relevant Changes**:
- **Value**: [Changes affecting time-to-value]
- **Agency**: [Changes affecting user control]
- **Identity**: [Changes affecting personalization]
- **Resilience**: [Changes affecting error handling/states]
- **Echo**: [Changes affecting completion experience]

**Pre-Implementation Review**:
- Echo evaluation: [Available / Not done / N/A]
- Palette review: [Available / Not done / N/A]
- Judge code review: [Passed / Issues noted]

**Files**:
- Changed files: [list]
- Test files: [list]
- Related docs: [list]

**Request**: Pre-release V.A.I.R.E. gate evaluation
```

---

### ECHO_TO_WARDEN_HANDOFF

Quality judgment request based on persona evaluation results.

```markdown
## ECHO_TO_WARDEN_HANDOFF

**Echo Report ID**: [ID]
**Flow Evaluated**: [Flow name]
**Persona Used**: [Persona name]
**Date**: YYYY-MM-DD

**Emotion Score Summary**:
| Step | Action | Score | Emotion |
|------|--------|-------|---------|
| 1 | [action] | [score] | [emoji] |
| 2 | [action] | [score] | [emoji] |
| 3 | [action] | [score] | [emoji] |

**Average Score**: [X.X]
**Lowest Point**: Step [N] ([score])

**Friction Points Identified**:
1. **[Location]**: [Description] - Emotion: [score]
2. **[Location]**: [Description] - Emotion: [score]

**Dark Pattern Flags**:
- [Pattern]: [Location] - [Severity]

**Persona Quotes**:
- "[Quote 1]"
- "[Quote 2]"

**Request**: Convert Echo findings to V.A.I.R.E. scorecard evaluation
```

---

### PULSE_TO_WARDEN_HANDOFF

Guardrail check request for metrics definitions.

```markdown
## PULSE_TO_WARDEN_HANDOFF

**Metrics ID**: [ID or feature name]
**Type**: [KPI Design / Guardrail Review / A/B Metrics]
**Date**: YYYY-MM-DD

**Proposed KPIs**:
| KPI | Definition | Target | Optimization Direction |
|-----|------------|--------|----------------------|
| [KPI 1] | [definition] | [target] | Increase/Decrease |
| [KPI 2] | [definition] | [target] | Increase/Decrease |

**Proposed Guardrails**:
| Guardrail | Threshold | If Breached |
|-----------|-----------|-------------|
| [Guardrail 1] | [value] | [action] |
| [Guardrail 2] | [value] | [action] |

**V.A.I.R.E. Alignment Check Needed**:
- [ ] KPIs don't incentivize dark patterns
- [ ] Guardrails protect user Agency
- [ ] Echo dimension metrics included (churn, regret proxies)

**Request**: Verify metrics align with V.A.I.R.E. principles
```

---

## Outgoing Handoffs (Warden →)

### WARDEN_TO_LAUNCH_HANDOFF

Release approval signal.

```markdown
## WARDEN_TO_LAUNCH_HANDOFF

**Target**: [Feature/flow name]
**Evaluation ID**: [ID]
**Date**: YYYY-MM-DD
**Verdict**: ✅ **PASS**

**V.A.I.R.E. Certification**:
| Dimension | Score | Status |
|-----------|-------|--------|
| Value | [X]/3 | ✅ |
| Agency | [X]/3 | ✅ |
| Identity | [X]/3 | ✅ |
| Resilience | [X]/3 | ✅ |
| Echo | [X]/3 | ✅ |

**Total**: [X]/15 (minimum [X]/3)

**Quality Checklist**:
- [x] All dimensions >= 2
- [x] No dark patterns detected
- [x] All states designed (loading/empty/error/offline/success)
- [x] Agency requirements met (consent, undo, transparency)
- [x] Echo dimension reviewed (completion experience)

**Anti-Pattern Scan**: CLEAR

**Release Approval**: ✅ GRANTED

**Notes**:
- [Optional improvement 1 for future iteration]
- [Optional improvement 2 for future iteration]

**Certificate**:
```
╔══════════════════════════════════════════════════════╗
║  V.A.I.R.E. QUALITY CERTIFICATION                   ║
║  Target: [Feature name]                             ║
║  Score: [X]/15 | Minimum: [X]/3                     ║
║  Verdict: PASS                                      ║
║  Date: YYYY-MM-DD                                   ║
║  Certified by: Warden                               ║
╚══════════════════════════════════════════════════════╝
```
```

---

### WARDEN_TO_PALETTE_HANDOFF

UX fix request (V/A/I/E related issues).

```markdown
## WARDEN_TO_PALETTE_HANDOFF

**Target**: [Feature/flow name]
**Evaluation ID**: [ID]
**Date**: YYYY-MM-DD
**Verdict**: ❌ **FAIL**

**Failed Dimensions**:
| Dimension | Score | Required |
|-----------|-------|----------|
| [Dimension] | [X]/3 | >= 2 |

**Blocking Issues for Palette**:

### [BLOCK-001] [Dimension]: [Issue Title]

| Aspect | Detail |
|--------|--------|
| **Location** | [File:line or Screen/Component] |
| **Current State** | [What's wrong - specific description] |
| **User Impact** | [How this affects users] |
| **Required State** | [What it should be] |
| **V.A.I.R.E. Violation** | [Which principle is violated] |
| **Priority** | CRITICAL / HIGH |

**Visual Reference** (if applicable):
```
Current:                     Required:
┌─────────────────┐         ┌─────────────────┐
│ [Current state] │   →     │ [Target state]  │
└─────────────────┘         └─────────────────┘
```

### [BLOCK-002] [Dimension]: [Issue Title]

[Same format as above]

---

**Fix Requirements**:
1. [Specific requirement 1]
2. [Specific requirement 2]

**After Fix**:
- [ ] Request Warden re-evaluation
- [ ] Expected outcome: [Dimension] score >= 2

**Re-Evaluation Trigger**:
When Palette completes fixes, use command:
`/Warden re-evaluate [feature] --fixes [BLOCK-001, BLOCK-002]`
```

---

### WARDEN_TO_BUILDER_HANDOFF

Implementation fix request (primarily Resilience related).

```markdown
## WARDEN_TO_BUILDER_HANDOFF

**Target**: [Feature/flow name]
**Evaluation ID**: [ID]
**Date**: YYYY-MM-DD
**Verdict**: ❌ **FAIL**

**Failed Dimensions**:
| Dimension | Score | Required |
|-----------|-------|----------|
| Resilience | [X]/3 | >= 2 |

**Blocking Issues for Builder**:

### [BLOCK-001] Resilience: Missing State Design

| Aspect | Detail |
|--------|--------|
| **Location** | [File:line] |
| **Missing States** | [loading / empty / error / offline / partial] |
| **Current Implementation** | [What exists now] |
| **Required Implementation** | [What's needed] |

**State Design Specification**:

| State | Trigger | Display | User Action |
|-------|---------|---------|-------------|
| loading | [when] | [what to show] | [available actions] |
| empty | [when] | [what to show] | [available actions] |
| error | [when] | [what to show] | [available actions] |
| offline | [when] | [what to show] | [available actions] |
| success | [when] | [what to show] | [available actions] |

### [BLOCK-002] Resilience: Error Message Quality

| Aspect | Detail |
|--------|--------|
| **Location** | [File:line] |
| **Current Error** | "[Current error message]" |
| **Required Format** | "[Cause] + [Impact] + [Next step]" |
| **Suggested Message** | "[Suggested error message]" |

---

**Fix Requirements**:
1. Implement all 5 states for [component]
2. Update error messages to include cause + action
3. Add retry mechanism for [operation]

**After Fix**:
- [ ] Request Warden re-evaluation
- [ ] Expected outcome: Resilience score >= 2

**Related References**:
- Error message guidelines: `references/patterns.md#resilience-evaluation-pattern`
- State design examples: `references/examples.md`
```

---

### WARDEN_TO_SENTINEL_HANDOFF

Escalation for security/privacy issues.

```markdown
## WARDEN_TO_SENTINEL_HANDOFF

**Target**: [Feature/flow name]
**Evaluation ID**: [ID]
**Date**: YYYY-MM-DD
**Referral Reason**: Agency violation with security/privacy implications

**Agency Violation Detected**:

### [VIOLATION-001] [Type]: [Title]

| Aspect | Detail |
|--------|--------|
| **Location** | [File:line or Screen] |
| **Violation Type** | [Consent / Transparency / Data Collection] |
| **Current Behavior** | [What's happening] |
| **User Impact** | [Privacy/security risk to users] |
| **Regulatory Risk** | [GDPR / CCPA / Other] |

**Evidence**:
```
[Code snippet or behavior description]
```

**V.A.I.R.E. Context**:
- Agency Score: [X]/3 (failed due to this issue)
- Related Non-Negotiable: "[Principle text]"

**Request**:
- Deep security/privacy analysis
- Compliance risk assessment
- Remediation guidance with security best practices

**After Sentinel Review**:
- Incorporate findings into Warden final verdict
- If security fix required, loop back through Warden for re-evaluation
```

---

### WARDEN_TO_RADAR_HANDOFF

Test addition request (Resilience state coverage).

```markdown
## WARDEN_TO_RADAR_HANDOFF

**Target**: [Feature/flow name]
**Evaluation ID**: [ID]
**Date**: YYYY-MM-DD
**Referral Reason**: Resilience state coverage insufficient

**Test Coverage Gaps Identified**:

### State Tests Needed

| Component | State | Test Exists? | Required Test |
|-----------|-------|--------------|---------------|
| [Component] | loading | ❌ | Render loading indicator |
| [Component] | empty | ❌ | Show empty state with guidance |
| [Component] | error | ❌ | Display error with retry |
| [Component] | offline | ❌ | Handle offline gracefully |
| [Component] | success | ✅ | - |

### Edge Case Tests Needed

| Scenario | Test Exists? | Priority |
|----------|--------------|----------|
| Network disconnect during operation | ❌ | HIGH |
| Double-click prevention | ❌ | MEDIUM |
| Browser back button handling | ❌ | HIGH |
| Session timeout during form | ❌ | MEDIUM |

**Request**:
- Add state tests for all missing states
- Add edge case tests for identified scenarios
- Ensure tests verify V.A.I.R.E. Resilience requirements

**Test Acceptance Criteria**:
- [ ] All 5 states have test coverage
- [ ] Edge cases have explicit tests
- [ ] Tests verify user-facing behavior (not just code paths)
```

---

## Bi-Directional Pattern Examples

### Pattern A: Pre-Release Gate

```
Builder implements feature
         ↓
BUILDER_TO_WARDEN_HANDOFF
         ↓
┌─────────────────────────────────────────┐
│ Warden evaluates V.A.I.R.E.             │
│ - All 5 dimensions                      │
│ - Anti-pattern scan                     │
│ - State audit                           │
└────────────────┬────────────────────────┘
                 ↓
        [Score >= 2 all dimensions?]
                 │
      ┌──────────┴──────────┐
      ↓ YES                  ↓ NO
WARDEN_TO_LAUNCH       WARDEN_TO_PALETTE
HANDOFF                or WARDEN_TO_BUILDER
      ↓                HANDOFF
  Launch                     ↓
                       Agent fixes
                             ↓
                       Re-evaluation
```

### Pattern B: Design Validation

```
Forge creates prototype
         ↓
FORGE_TO_WARDEN_HANDOFF
         ↓
┌─────────────────────────────────────────┐
│ Warden evaluates prototype              │
│ - Early detection of V.A.I.R.E. issues  │
│ - Before implementation investment      │
└────────────────┬────────────────────────┘
                 ↓
        [Prototype passes?]
                 │
      ┌──────────┴──────────┐
      ↓ YES                  ↓ NO
Proceed to             WARDEN_TO_PALETTE
Builder                HANDOFF (design fixes)
                             ↓
                       Forge re-prototypes
                             ↓
                       Re-evaluation
```

### Pattern C: Quality Loop

```
Echo completes persona walkthrough
         ↓
ECHO_TO_WARDEN_HANDOFF
         ↓
┌─────────────────────────────────────────┐
│ Warden converts Echo findings to        │
│ V.A.I.R.E. scorecard                    │
│ - Friction points → dimension scores    │
│ - Dark pattern flags → Agency violations│
└────────────────┬────────────────────────┘
                 ↓
        [Findings warrant FAIL?]
                 │
      ┌──────────┴──────────┐
      ↓ NO                   ↓ YES
Document as           WARDEN_TO_PALETTE
optional              HANDOFF
improvements                ↓
                       Palette fixes
                             ↓
                       Echo re-validates
                             ↓
                       Warden re-evaluates
```

---

## Handoff Best Practices

### When Creating Handoffs

1. **Be specific about locations** - File:line, not "somewhere in the code"
2. **Include visual references** - ASCII diagrams, screenshots, or descriptions
3. **State the V.A.I.R.E. violation** - Which principle, which dimension
4. **Define acceptance criteria** - What does "fixed" look like?
5. **Set priority clearly** - CRITICAL blocks release, HIGH should fix before release

### When Receiving Handoffs

1. **Acknowledge receipt** - Log in Activity Log
2. **Clarify if unclear** - Ask before starting work
3. **Fix in order of priority** - CRITICAL first
4. **Request re-evaluation explicitly** - Don't assume auto-approval

### Common Handoff Mistakes

| Mistake | Correct Approach |
|---------|------------------|
| "Fix the UX" (vague) | "Fix consent flow: add decline button at equal prominence to accept" |
| Skipping priority | Always mark CRITICAL/HIGH/MEDIUM |
| No re-evaluation trigger | Always specify how to request re-evaluation |
| Multiple agents for one fix | One owner per blocking issue |

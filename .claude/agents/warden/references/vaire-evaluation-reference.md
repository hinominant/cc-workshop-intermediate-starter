# warden — V.A.I.R.E.評価 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## V.A.I.R.E. SCORECARD

### Score Definitions

| Score | Level | Description | Release Decision |
|-------|-------|-------------|------------------|
| **3** | Exemplary | Exceeds best practices. Source of differentiation | ✅ PASS |
| **2** | Sufficient | Meets standards. No issues | ✅ PASS |
| **1** | Partial | Has gaps. Needs improvement | ❌ FAIL |
| **0** | Not considered | Will cause incidents. Not designed | ❌ FAIL |

**Release decision**: All 5 dimensions >= 2 → PASS, any dimension <= 1 → FAIL

### Scorecard Template

```markdown
## V.A.I.R.E. Scorecard

| Dimension | Score | Evidence | Issues |
|-----------|-------|----------|--------|
| **V**alue | ?/3 | [Specific evidence] | [Issues if any] |
| **A**gency | ?/3 | [Specific evidence] | [Issues if any] |
| **I**dentity | ?/3 | [Specific evidence] | [Issues if any] |
| **R**esilience | ?/3 | [Specific evidence] | [Issues if any] |
| **E**cho | ?/3 | [Specific evidence] | [Issues if any] |

**Total**: ?/15
**Minimum Score**: ?/3
**Verdict**: PASS / FAIL

### Blocking Issues (Score < 2)
1. [Dimension]: [Issue] @ [Location]
   - **Impact**: [What happens to users]
   - **Remediation**: [How to fix]
   - **Owner**: [Which agent should fix]
```

---

## EVALUATION CRITERIA BY DIMENSION

### V: Value (Immediate Value Delivery)

**Evaluation Points**:
- Time-to-Value: Can user achieve "small success" in first 30 seconds to few minutes?
- Information priority: Is the main task front and center?
- Default design: Does it eliminate confusion?
- Feedback: Is action→response→result consistent?

**Checklist**:
```
[ ] Entry to core task within 3 steps
[ ] Primary button/next action is visually prioritized
[ ] Empty state explains "what will happen/what to do next"
[ ] Loading shows reason and progress
```

**Anti-patterns**:
- Empty landing page (looks impressive but does nothing)
- Too many choices (user bears the burden of thinking)
- On failure: cause unknown, next step unclear

**Score 2 criteria**:
- Main task reachable within 3 steps
- First-time user reaches first success without confusion

**Score 3 criteria**:
- Onboarding designed as "learn by doing"
- Skeleton/progressive display optimizes perceived speed

---

### A: Agency (User Control & Autonomy)

**Evaluation Points**:
- Consent design: Are purpose, benefit, alternative, and revocation method presented?
- Reversibility: Are Undo, drafts, restore, rollback available?
- Transparency: Are fees/conditions/limits/automation scope not revealed later?
- Ease of cancellation: Can user end as easily as they started?

**Checklist**:
```
[ ] Important actions have preview and cancel path
[ ] Permission requests explain reason in context first
[ ] Personalization allows OFF/weak/strong choice
[ ] Decline button is findable and equally visible
```

**Anti-patterns (Prohibited)**:
- Decline button unfindable/extremely weak
- Consent fatigue from excessive requests
- Cancellation unnaturally difficult
- Guilt-tripping language (Confirmshaming)

**Score 2 criteria**:
- All important actions have Undo/Cancel
- Permission requests include reason
- Decline path is not hidden

**Score 3 criteria**:
- Settings center allows fine-grained AI/notification/privacy control
- Cancellation/suspension as easy as signup

---

### I: Identity (Self, Context, Belonging)

**Evaluation Points**:
- Self-expression: At least one of profile, theme, sorting, etc.
- Language personality: Tone & manner, respect, no shaming
- Context adaptation: Modes for beginner/expert, work/personal

**Checklist**:
```
[ ] At least one "make it my own" setting exists
[ ] System messages don't attack user's character on failure
[ ] Sharing/publishing defaults to private or has clear boundaries
```

**Anti-patterns**:
- Forcing identity (real name required, excessive social integration forced)
- Strong belonging pressure in design
- Superficial use of cultural elements (cringeworthy execution)

**Score 2 criteria**:
- At least one personalization setting exists
- Error messages don't attack user's character

**Score 3 criteria**:
- Mode switching based on context
- Design where user can say "this is my tool"

---

### R: Resilience (Recovery & Inclusion)

**Evaluation Points**:
- State design: Are loading/empty/error/offline/partial success all defined?
- Retry: Are retry, queue, backoff available?
- Data protection: Drafts, auto-save, idempotency
- Accessibility: Keyboard, contrast, screen reader

**Checklist**:
```
[ ] Main flows have "connection failure branch" designed
[ ] If dropped mid-input, can resume on return
[ ] Errors show cause/impact/next step in human language
[ ] Main operations completable by keyboard only
```

**Anti-patterns**:
- Infinite loading spinner
- Success or failure unknown
- "Back" erases data
- Double charge/double post

**Score 2 criteria**:
- All 5 states (loading/empty/error/offline/success) designed
- Error messages have next step
- Auto-save or draft save exists

**Score 3 criteria**:
- Offline support, Optimistic UI
- WCAG AA compliant
- Recovery UX designed (2FA loss, device change, etc.)

---

### E: Echo (Aftermath & Endings)

**Evaluation Points**:
- Ending design: completion → confirmation → next choices → permission to rest
- Summary: Crystallize what was achieved briefly
- Stopping point: Infinite scroll/binge has natural breaks
- Reminder ethics: Don't motivate through guilt

**Checklist**:
```
[ ] Core task completion shows both "result confirmation" and "next actions"
[ ] No forced flow to next after completion
[ ] Notifications/reminders have frequency adjust/stop/snooze
[ ] Don't exhaust with excessive celebration
```

**Anti-patterns**:
- Excessive celebration
- Design that never ends (no stopping point)
- "You'll miss out/You're falling behind" pressure

**Score 2 criteria**:
- Result confirmation on completion
- Next action is optional (not forced)
- Notifications can be stopped

**Score 3 criteria**:
- Achievement summary remains as "receipt"
- Infinite content has natural breaks
- User feels "settled" at the end

---

## ANTI-PATTERN CATALOG

### Dark Patterns (Automatic FAIL)

| Pattern | Description | Detection Sign |
|---------|-------------|----------------|
| **Confirmshaming** | Guilting user on decline | "No, I'll miss out on savings" |
| **Roach Motel** | Easy to enter, hard to leave | 2 clicks to sign up, 10 steps to cancel |
| **Hidden Costs** | Fees revealed later | Fees shown only at payment screen |
| **Trick Questions** | Confusing double negatives | "Uncheck to not receive notifications" |
| **Forced Continuity** | Hidden auto-renewal | Trial→billing without notice |
| **Misdirection** | Visual manipulation of choice | Decline button extremely small |
| **Privacy Zuckering** | Data public by default | "Share" is default ON |

### Agency Violations

| Violation | Description | Severity |
|-----------|-------------|----------|
| Cannot refuse | Design requires permission to proceed | CRITICAL |
| Hidden automation | What AI did is opaque | HIGH |
| Cannot revoke | Cannot withdraw after consent | HIGH |
| Unknown impact scope | Operation result unpredictable | MEDIUM |

### Resilience Failures

| Failure | Description | Detection |
|---------|-------------|-----------|
| Infinite loading | No distinction between complete/fail | Loading state over 30 seconds |
| Silent error | Error not displayed | Nothing changes after operation |
| State loss | Back erases data | Pressing back on input form |
| Double execution | Same operation causes double processing | Rapid clicks cause multiple API calls |

---

## EVALUATION PROCESS

### 1. SCOPE - Confirm Evaluation Target

```
1. Identify evaluation target (feature/flow/page/release)
2. Determine application level (L0/L1/L2)
3. Collect related code/design documents
4. Check existing Echo reports/Palette evaluations
```

### 2. AUDIT - Evaluate Each Dimension

```
For each dimension (V, A, I, R, E):
  1. Execute checklist
  2. Collect evidence
  3. Detect anti-patterns
  4. Determine score (0-3)
  5. Record details if issues found
```

### 3. SYNTHESIZE - Create Scorecard

```
1. Integrate 5 dimension scores
2. Check minimum score
3. Identify blocking issues
4. Assign fix owner for each issue
```

### 4. VERDICT - Issue Judgment

```
If min(scores) >= 2:
  VERDICT: PASS
  → Send approval signal to Launch
Else:
  VERDICT: FAIL
  → Send fix request (Palette/Builder/etc.)
```

### 5. HANDOFF - Next Action

```
PASS:
  → Launch: Release approval
FAIL:
  → Palette: UX fix request
  → Builder: Implementation fix request
  → Sentinel: Security issues
  → Radar: Test addition request
```

---

## REPORT FORMAT

### Warden Evaluation Report

```markdown
## Warden V.A.I.R.E. Evaluation Report

### Summary
| Metric | Value |
|--------|-------|
| Target | [Feature/flow name] |
| Level | L0 / L1 / L2 |
| Date | YYYY-MM-DD |
| Verdict | **PASS** / **FAIL** |
| Total Score | X/15 |
| Minimum Dimension | [Dimension]: X/3 |

### Evaluation Context
- **Scope**: [Description of evaluation scope]
- **Input Sources**: [Echo report, Palette evaluation, etc.]
- **Evaluator Notes**: [Special notes]

---

## V.A.I.R.E. Scorecard

| Dimension | Score | Evidence | Issues |
|-----------|-------|----------|--------|
| **V** Value | X/3 | [Evidence] | [Issues] |
| **A** Agency | X/3 | [Evidence] | [Issues] |
| **I** Identity | X/3 | [Evidence] | [Issues] |
| **R** Resilience | X/3 | [Evidence] | [Issues] |
| **E** Echo | X/3 | [Evidence] | [Issues] |

---

## Blocking Issues

### [BLOCK-001] [Dimension]: [Issue Title]
| Aspect | Detail |
|--------|--------|
| Location | [File/Screen/Flow] |
| Current State | [What's wrong] |
| Impact | [User impact] |
| Remediation | [How to fix] |
| Owner | [Agent: Palette/Builder/etc.] |
| Priority | CRITICAL / HIGH |

---

## Anti-Pattern Detection

| Pattern | Found | Location | Severity |
|---------|-------|----------|----------|
| Confirmshaming | ❌/✅ | [location] | - |
| Roach Motel | ❌/✅ | [location] | - |
| Hidden Costs | ❌/✅ | [location] | - |
| [etc.] | | | |

---

## State Audit (Resilience)

| State | Designed | Evidence |
|-------|----------|----------|
| loading | ✅/❌ | [location] |
| empty | ✅/❌ | [location] |
| error | ✅/❌ | [location] |
| offline | ✅/❌ | [location] |
| success | ✅/❌ | [location] |

---

## Recommendations

### For PASS
1. [Optional improvement 1]
2. [Optional improvement 2]

### For FAIL
1. **[Owner]**: [Mandatory fix 1]
2. **[Owner]**: [Mandatory fix 2]

---

## Re-Evaluation Criteria

After fixes are implemented:
- [ ] All CRITICAL issues resolved
- [ ] All HIGH issues resolved or documented exceptions
- [ ] Re-run Warden evaluation
- [ ] Minimum score >= 2 on all dimensions
```

---


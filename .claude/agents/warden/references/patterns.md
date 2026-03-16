# V.A.I.R.E. Evaluation Patterns

Collection of evaluation patterns and best practices.

---

## Evaluation Patterns by Dimension

### Value Evaluation Pattern

**Quick Assessment (5 minutes)**

```markdown
## Value Quick Check

1. **Entry Point Test**
   - [ ] Can reach core task in ≤3 steps?
   - [ ] Is primary CTA visually prominent?
   - [ ] Is the value proposition clear in first viewport?

2. **Empty State Test**
   - [ ] Does empty state explain what will happen?
   - [ ] Does empty state guide next action?

3. **Feedback Test**
   - [ ] Action → Response → Result is consistent?
   - [ ] Loading state shows reason and progress?

**Score Guide**:
- 3/3 checks pass = Score 3
- 2/3 checks pass = Score 2
- 1/3 checks pass = Score 1
- 0/3 checks pass = Score 0
```

**Deep Assessment (30 minutes)**

```markdown
## Value Deep Analysis

### Time-to-Value Measurement
1. Count clicks from landing to first success
2. Estimate cognitive load at each step
3. Identify decision points that cause hesitation

### Information Architecture Review
1. Map primary vs secondary actions
2. Verify visual hierarchy matches importance
3. Check progressive disclosure implementation

### Onboarding Evaluation
1. "Learn by doing" vs "Read instructions"
2. Default values reduce decisions?
3. Examples/templates provided?

### Speed Perception
1. Skeleton screens implemented?
2. Optimistic UI for quick feedback?
3. Progress indicators for long operations?
```

---

### Agency Evaluation Pattern

**Consent Audit**

```markdown
## Agency Consent Audit

For each permission request:
| Question | Answer |
|----------|--------|
| Purpose explained? | Y/N |
| Benefit to user explained? | Y/N |
| Alternative if declined? | Y/N |
| How to revoke? | Y/N |
| Context-appropriate timing? | Y/N |

**Red Flags**:
- [ ] Pre-checked boxes
- [ ] Bundled consents
- [ ] No decline option
- [ ] Decline harder than accept
```

**Reversibility Audit**

```markdown
## Agency Reversibility Audit

For each important action:
| Action | Undo Available | Confirmation | Preview |
|--------|---------------|--------------|---------|
| Delete | Y/N | Y/N | Y/N |
| Purchase | Y/N | Y/N | Y/N |
| Publish | Y/N | Y/N | Y/N |
| [Custom] | Y/N | Y/N | Y/N |

**Score Calculation**:
- All Y = Score 3
- Mostly Y = Score 2
- Mixed = Score 1
- Mostly N = Score 0
```

**Dark Pattern Scanner**

```markdown
## Dark Pattern Detection

| Pattern | Present? | Location | Severity |
|---------|----------|----------|----------|
| Confirmshaming | | | |
| Roach Motel | | | |
| Hidden Costs | | | |
| Trick Questions | | | |
| Forced Continuity | | | |
| Misdirection | | | |
| Privacy Zuckering | | | |
| Bait and Switch | | | |

**Any present = automatic FAIL on Agency**
```

---

### Identity Evaluation Pattern

**Personalization Check**

```markdown
## Identity Personalization Check

| Feature | Available? | Default |
|---------|-----------|---------|
| Display name | Y/N | [value] |
| Avatar/icon | Y/N | [value] |
| Theme/color | Y/N | [value] |
| Layout/sorting | Y/N | [value] |
| Notification prefs | Y/N | [value] |

**Minimum for Score 2**: At least 1 personalization option
```

**Language Audit**

```markdown
## Identity Language Audit

Check system messages for:
| Message Type | Found | Respectful? | Example |
|--------------|-------|-------------|---------|
| Error | Y/N | Y/N | [text] |
| Validation | Y/N | Y/N | [text] |
| Empty state | Y/N | Y/N | [text] |
| Success | Y/N | Y/N | [text] |

**Red Flags**:
- "Invalid input" (blames user)
- "You failed to..." (shaming)
- Sarcastic or condescending tone
```

---

### Resilience Evaluation Pattern

**State Coverage Matrix**

```markdown
## Resilience State Matrix

| Flow/Component | loading | empty | error | offline | success |
|----------------|---------|-------|-------|---------|---------|
| [Component 1] | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| [Component 2] | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| [Component 3] | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |

**Score Guide**:
- All 5 states for all components = Score 3
- 4+ states for all components = Score 2
- 3 states = Score 1
- <3 states = Score 0
```

**Error Message Quality**

```markdown
## Resilience Error Message Audit

| Error | Cause Shown? | Impact Shown? | Next Step? | Human Language? |
|-------|--------------|---------------|------------|-----------------|
| [Error 1] | Y/N | Y/N | Y/N | Y/N |
| [Error 2] | Y/N | Y/N | Y/N | Y/N |

**Good Example**:
"Could not connect. Please check your network and try again."
(Cause: connection failed, Action: check network → retry)

**Bad Example**:
"Error 500: Internal Server Error"
(No cause, no action, technical jargon)
```

**Recovery Path Test**

```markdown
## Resilience Recovery Scenarios

Test each scenario:
| Scenario | Recoverable? | Data Lost? | User Guidance? |
|----------|--------------|------------|----------------|
| Network disconnect mid-form | Y/N | Y/N | Y/N |
| Browser back on multi-step | Y/N | Y/N | Y/N |
| Session timeout | Y/N | Y/N | Y/N |
| Double-click submit | Y/N (idempotent?) | Y/N | Y/N |
| Refresh during action | Y/N | Y/N | Y/N |
```

---

### Echo Evaluation Pattern

**Completion Experience Check**

```markdown
## Echo Completion Check

For each core task completion:
| Aspect | Present? | Notes |
|--------|----------|-------|
| Result confirmation | Y/N | [what's shown] |
| Achievement summary | Y/N | [format] |
| Next action options | Y/N | [choices] |
| "Done" or rest option | Y/N | [can user stop?] |
| Forced next flow | Y/N (bad if Y) | [what's forced] |

**Score Guide**:
- Confirmation + Summary + Options + Rest = Score 3
- Confirmation + Options = Score 2
- Confirmation only = Score 1
- No completion experience = Score 0
```

**Notification Ethics Check**

```markdown
## Echo Notification Ethics

| Notification | Dismissible? | Frequency Adjust? | FOMO Language? |
|--------------|--------------|-------------------|----------------|
| [Type 1] | Y/N | Y/N | Y/N (bad if Y) |
| [Type 2] | Y/N | Y/N | Y/N (bad if Y) |

**Red Flags**:
- "Don't miss out!"
- "Others are doing X"
- "Last chance!"
- Undismissible banners
- No snooze option
```

---

## Scoring Decision Trees

### Value Score Decision Tree

```
START
  │
  ├─ Can user complete core task in ≤3 steps?
  │   ├─ NO → Score 0-1 (depending on other factors)
  │   └─ YES
  │       │
  │       ├─ Is primary CTA immediately visible?
  │       │   ├─ NO → Score 1
  │       │   └─ YES
  │       │       │
  │       │       ├─ Loading states show progress/reason?
  │       │       │   ├─ NO → Score 1-2
  │       │       │   └─ YES
  │       │       │       │
  │       │       │       ├─ Onboarding is "learn by doing"?
  │       │       │       │   ├─ NO → Score 2
  │       │       │       │   └─ YES → Score 3
```

### Agency Score Decision Tree

```
START
  │
  ├─ Any dark patterns detected?
  │   ├─ YES → Score 0-1 (FAIL regardless of other factors)
  │   └─ NO
  │       │
  │       ├─ All important actions have Undo/confirmation?
  │       │   ├─ NO → Score 1
  │       │   └─ YES
  │       │       │
  │       │       ├─ Consent requests explain purpose & allow decline?
  │       │       │   ├─ NO → Score 1-2
  │       │       │   └─ YES
  │       │       │       │
  │       │       │       ├─ Settings allow fine-grained control?
  │       │       │       │   ├─ NO → Score 2
  │       │       │       │   └─ YES → Score 3
```

### Resilience Score Decision Tree

```
START
  │
  ├─ All 5 states (loading/empty/error/offline/success) designed?
  │   ├─ NO → Score 0-1
  │   └─ YES
  │       │
  │       ├─ Error messages have cause + action?
  │       │   ├─ NO → Score 1
  │       │   └─ YES
  │       │       │
  │       │       ├─ Auto-save or draft preservation?
  │       │       │   ├─ NO → Score 2
  │       │       │   └─ YES
  │       │       │       │
  │       │       │       ├─ Offline support + WCAG AA?
  │       │       │       │   ├─ NO → Score 2
  │       │       │       │   └─ YES → Score 3
```

---

## Cross-Dimension Patterns

### The "Frustrated User" Pattern

When a user experiences multiple dimension failures:

```
Value ↓ (can't find feature)
  → Agency ↓ (can't go back)
    → Resilience ↓ (error with no guidance)
      → Echo ↓ (no recovery, just stuck)

This cascade is common. Fix upstream (Value) first.
```

### The "Dark Funnel" Pattern

Business optimization that harms users:

```
Value ↑ (fast to conversion)
  BUT Agency ↓ (hidden costs, forced consent)
  AND Echo ↓ (hard to cancel)

High conversion + high churn = Dark Funnel.
Warden blocks this pattern.
```

### The "Missing Middle" Pattern

Good start and end, broken middle:

```
Value: Score 3 (great onboarding)
Agency: Score 1 (no settings, no undo) ← BLOCKED
Identity: Score 2 (basic personalization)
Resilience: Score 1 (errors show stack traces) ← BLOCKED
Echo: Score 3 (nice completion screens)

"Impressive demo, breaks in real use."
Warden catches this.
```

---

## Evaluation Shortcuts

### When to Deep Dive

| Signal | Deep Dive Area |
|--------|----------------|
| High bounce rate | Value |
| Support tickets about "can't find" | Value |
| Complaints about dark patterns | Agency |
| GDPR/privacy concerns | Agency |
| "It's not for me" feedback | Identity |
| Crash reports, timeout issues | Resilience |
| Quick uninstalls post-purchase | Echo |

### Quick Fail Indicators

These indicate likely FAIL without full evaluation:

| Indicator | Likely Dimension |
|-----------|------------------|
| No loading states visible | Resilience |
| Decline button is gray/tiny | Agency |
| "Error occurred" with no details | Resilience |
| Can't find settings | Agency |
| Auto-play with no stop | Echo |
| Form loses data on back | Resilience |
| "You're missing out!" text | Echo |

---

## Re-Evaluation Triggers

When to request Warden re-evaluation:

| Trigger | Scope |
|---------|-------|
| Palette completed UX fixes | Affected dimensions |
| Builder completed state implementation | Resilience |
| New consent flow added | Agency |
| Onboarding redesigned | Value |
| Completion screens updated | Echo |
| Major refactor | Full V.A.I.R.E. |

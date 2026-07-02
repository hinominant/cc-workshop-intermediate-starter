# palette — UX改善 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## HEURISTIC EVALUATION

When analyzing a UI, perform a heuristic evaluation using this scoring system.

### Score Definitions

| Score | Rating | Description |
|-------|--------|-------------|
| 5 | Excellent | Best practices fully implemented, delightful experience |
| 4 | Good | Mostly appropriate, minor room for improvement |
| 3 | Acceptable | Meets basics but improvement recommended |
| 2 | Poor | Clear problems exist, improvement needed |
| 1 | Critical | Severe issues, immediate action required |

### Evaluation Output Format

```markdown
### UX Heuristic Evaluation: [Component/Flow Name]

| # | Heuristic | Score | Issues | Priority |
|---|-----------|-------|--------|----------|
| 1 | Visibility of System Status | X/5 | [specific issue] | High/Med/Low |
| 2 | Match User's Mental Model | X/5 | [specific issue] | High/Med/Low |
| 3 | User Control & Freedom | X/5 | [specific issue] | High/Med/Low |
| 4 | Consistency & Standards | X/5 | [specific issue] | High/Med/Low |
| 5 | Error Prevention | X/5 | [specific issue] | High/Med/Low |
| 6 | Recognition over Recall | X/5 | [specific issue] | High/Med/Low |
| 7 | Flexibility & Efficiency | X/5 | [specific issue] | High/Med/Low |
| 8 | Minimalist Design | X/5 | [specific issue] | High/Med/Low |
| 9 | Error Recovery | X/5 | [specific issue] | High/Med/Low |
| 10 | Contextual Help | X/5 | [specific issue] | High/Med/Low |

**Overall Score**: X.X/5
**Critical Areas**: #X, #X (scores ≤ 2)
**Quick Wins**: [low-effort, high-impact improvements]
```

### Priority Guidelines

```
High Priority: Score 1-2, affects critical user flows
Medium Priority: Score 3, noticeable friction but workaround exists
Low Priority: Score 4, polish improvements
```

---

## MICROINTERACTION PATTERNS

Use these patterns when implementing UX improvements. Each pattern includes when to use it and implementation guidance.

### Button Feedback Pattern

```
States: idle → hover → pressed → loading → success/error → idle

Use when: Any async operation triggered by button click
```

```tsx
// Pattern: Button with loading + success feedback
<Button
  onClick={handleSubmit}
  disabled={isLoading}
  aria-busy={isLoading}
  className={cn(
    "transition-all duration-200",
    isSuccess && "bg-green-500",
    isError && "bg-red-500 animate-shake"
  )}
>
  {isLoading && <Spinner className="mr-2" aria-hidden />}
  {isSuccess && <CheckIcon className="mr-2" aria-hidden />}
  {isError && <XIcon className="mr-2" aria-hidden />}
  {isLoading ? "Processing..." : isSuccess ? "Done!" : "Submit"}
</Button>
```

### Form Validation Patterns

(→ see `references/form-patterns.md` for comprehensive form patterns including multi-step forms, field affordances, and inline help)

**Real-time Validation** (recommended for formats)
```tsx
// Use when: Email, phone, URL, password strength
<Input
  type="email"
  onChange={(e) => {
    setValue(e.target.value);
    setError(validateEmail(e.target.value) ? null : "Invalid email");
  }}
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && <p id="email-error" role="alert">{error}</p>}
```

**On-blur Validation** (recommended for most fields)
```tsx
// Use when: Name, address, general text inputs
<Input
  onBlur={() => setTouched(true)}
  aria-invalid={touched && !!error}
/>
{touched && error && <p role="alert">{error}</p>}
```

**Submit-time Validation** (use sparingly)
```tsx
// Use when: Cross-field validation, complex rules
// Always scroll to first error and focus it
```

### Loading State Patterns

**Skeleton Screen** (recommended for content loading)
```tsx
// Use when: Loading known content structure
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
  <div className="h-4 bg-gray-200 rounded w-1/2" />
</div>
```

**Spinner** (use for actions)
```tsx
// Use when: Button actions, form submissions
// Place spinner where content will appear
<div className="flex items-center justify-center">
  <Spinner aria-label="Loading..." />
</div>
```

**Progressive Loading** (use for large lists)
```tsx
// Use when: Infinite scroll, paginated content
// Show skeleton for incoming items only
```

**Optimistic Update** (use for fast feedback)
```tsx
// Use when: Toggle, like, bookmark actions
// Update UI immediately, rollback on error
const handleLike = async () => {
  setLiked(true); // Optimistic
  try {
    await api.like(id);
  } catch {
    setLiked(false); // Rollback
    toast.error("Failed to like");
  }
};
```

### Notification Patterns

| Type | Duration | Use When |
|------|----------|----------|
| Toast (success) | 3s auto-dismiss | Action completed successfully |
| Toast (error) | 5s or manual | Action failed, needs attention |
| Toast (undo) | 5s with action | Destructive action completed |
| Inline alert | Persistent | Form errors, field warnings |
| Banner | Until dismissed | System-wide announcements |

```tsx
// Toast with undo action
<Toast duration={5000}>
  Item deleted.
  <Button variant="link" onClick={handleUndo}>Undo</Button>
</Toast>
```

### Destructive Action Patterns

**Confirmation Dialog** (recommended)
```tsx
// Use when: Delete, permanent changes
<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Delete this item?</AlertDialogTitle>
    <AlertDialogDescription>
      This action cannot be undone.
    </AlertDialogDescription>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction onClick={handleDelete}>
      Delete
    </AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>
```

**Soft Delete with Undo** (preferred when possible)
```tsx
// Use when: Items can be recovered
const handleDelete = () => {
  hideItem(id); // Visual removal
  toast({
    message: "Item deleted",
    action: { label: "Undo", onClick: () => restoreItem(id) },
    onClose: () => permanentDelete(id), // After toast dismissed
  });
};
```

---

## UX METRICS

Use these metrics to measure UX improvement impact.

### Core Metrics

| Metric | Definition | Target | How to Measure |
|--------|------------|--------|----------------|
| Task Success Rate | % of users completing target task | >95% critical flows | Analytics / User testing |
| Time on Task | Time from start to completion | Varies by complexity | Timestamp tracking |
| Error Rate | % of tasks with errors encountered | <5% common flows | Error event tracking |
| Abandonment Rate | % of users leaving mid-task | <10% critical flows | Funnel analysis |

### System Usability Scale (SUS) - Quick Version

Use this 5-question assessment for rapid UX evaluation:

```markdown
### Quick SUS Assessment

Rate each statement 1-5 (1=Strongly Disagree, 5=Strongly Agree):

1. I can complete my task without help: [ ]
2. The interface feels consistent: [ ]
3. Error messages help me fix problems: [ ]
4. I always know what's happening: [ ]
5. I can undo mistakes easily: [ ]

**SUS Score**: (sum × 4) = ___/100

Interpretation:
- 80+: Excellent
- 68-79: Good
- 51-67: Needs improvement
- <51: Poor
```

### Measurement Guidelines

```
Before implementing:
1. Identify which metrics apply to your change
2. Establish baseline if possible
3. Define expected improvement

After implementing:
1. Describe expected metric impact in PR
2. Suggest how to validate (manual test / analytics)
```

---

## BEFORE/AFTER TEMPLATE

Use this template to document UX improvements clearly.

```markdown
### UX Improvement: [Title]

#### Before
**Problem**: [Describe user friction in plain language]
**Evidence**: [Where this happens - file:line or user flow]

\`\`\`tsx
// Current problematic code
\`\`\`

#### After
**Solution**: [What changes and why it helps]
**Benefit**: [Expected user experience improvement]

\`\`\`tsx
// Improved code
\`\`\`

#### Impact Assessment

| Metric | Before | After (Expected) |
|--------|--------|------------------|
| Task completion | X% | Y% |
| Error rate | X% | <Y% |
| User confidence | Low/Med/High | Low/Med/High |

#### Heuristics Improved
- [#X: Heuristic name] - from X/5 to Y/5

#### Implementation
- **Files**: [list of files to change]
- **Effort**: S / M / L
- **Risk**: Low / Medium / High
```

---

## ECHO INTEGRATION

Palette can request Echo validation for UX improvements to test with user personas.

### When to Request Echo Validation

- Major interaction pattern changes
- New user flows
- Changes affecting multiple user types
- Uncertainty about user perception

### Echo Request Template

After proposing a UX improvement, output:

```markdown
### Echo Validation Request

The following UX improvement needs persona testing:

**Improvement**: [Brief description]
**Target Flow**: [User journey affected]
**Hypothesis**: [Expected user reaction]

Suggested Echo test:
`/Echo test [flow] as [Newbie|Mobile User|Senior|Accessibility User]`

Validation checklist:
- [ ] User notices the improvement
- [ ] Friction point is resolved
- [ ] No new confusion introduced
- [ ] Accessible to all user types
```

### Interpreting Echo Results

```
Echo Score +2 to +3: Improvement validated, proceed
Echo Score 0 to +1: Minor benefit, consider effort vs impact
Echo Score -1 to -3: Reconsider approach, may cause new friction
```

---

## FLOW INTEGRATION

Palette can hand off animation specifications to Flow for implementation.

### When to Use Flow Handoff

- Microinteractions requiring custom animation
- State transitions needing visual polish
- Complex feedback sequences

### Flow Handoff Template

```markdown
### Flow Handoff: Animation Specification

**Interaction**: [e.g., Button press feedback]
**Trigger**: [e.g., onClick, onHover, onLoad]
**States**: [e.g., idle → active → loading → success]

**Timing Requirements**:
- Transition duration: Xms
- Easing: [ease-out, ease-in-out, spring]
- Delay (if any): Xms

**Visual Requirements**:
- Transform: [scale, translate, rotate]
- Opacity: [fade in/out values]
- Color: [from → to]

**Accessibility**:
- Respects prefers-reduced-motion: Yes/No
- Duration < 5s for non-essential: Yes/No

Suggested Flow command:
`/Flow implement [interaction] animation`
```

---

## CANVAS INTEGRATION

Palette can hand off visualization requests to Canvas for Before/After documentation.

### When to Use Canvas Handoff

- Documenting UX improvements for stakeholders
- Visualizing heuristic score changes
- Creating interaction flow diagrams
- Before/After comparison documentation

### Canvas Request Template

```markdown
### Canvas Visualization Request

**Type**: Before/After Comparison | Heuristic Radar Chart | Interaction Flow

**Improvement**: [Description of UX improvement]
**Target**: [Component/flow name]

**Data for Visualization**:
| Aspect | Before | After |
|--------|--------|-------|
| Heuristic Score | X.X/5 | Y.Y/5 |
| Key Friction | [description] | [resolution] |

**Heuristic Score Comparison**:
| # | Heuristic | Before | After |
|---|-----------|--------|-------|
| 1 | Visibility | 2/5 | 4/5 |
| 5 | Error Prevention | 1/5 | 4/5 |

**Requested Output**:
- [ ] Radar chart (before vs after)
- [ ] Side-by-side comparison
- [ ] State transition diagram

Suggested command:
`/Canvas visualize UX improvement`
```

### Interpreting Canvas Output

Canvas will generate diagrams that can be:
- Embedded in PRs for review
- Used in stakeholder presentations
- Added to project documentation

For detailed handoff formats, see `references/collaboration-patterns.md`.

---

## Sample Commands (Discover repo-specific commands first)

Run tests: `pnpm test` | Lint: `pnpm lint` | Format: `pnpm format` | Build: `pnpm build`

These are illustrative. Always discover the actual commands for each repository.

---

## UX Coding Standards

### Good UX Code:

```tsx
// GOOD: Clear feedback states + accessible
<button
  aria-label="Delete project"
  className="hover:bg-red-50 focus-visible:ring-2"
  disabled={isDeleting}
>
  {isDeleting ? <Spinner /> : <TrashIcon />}
</button>

// GOOD: Inline validation with helpful guidance
<div>
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    aria-describedby="password-hint"
  />
  <p id="password-hint" className="text-sm text-muted">
    At least 8 characters with one number
  </p>
</div>

// GOOD: Confirmation for destructive action
const handleDelete = () => {
  if (confirm("Delete this item? This cannot be undone.")) {
    deleteItem();
  }
};

// GOOD: Optimistic UI with undo option
<Toast>
  Item archived. <button onClick={undo}>Undo</button>
</Toast>
```

### Bad UX Code:

```tsx
// BAD: No loading state, no disabled state, no feedback
<button onClick={handleDelete}>
  <TrashIcon />
</button>

// BAD: Silent failure, user doesn't know what happened
try {
  await saveData();
} catch (e) {
  console.error(e); // User sees nothing!
}

// BAD: Destructive action with no confirmation
<button onClick={() => deleteAllData()}>Reset</button>

// BAD: Form validates only on submit, user fills everything wrong
<form onSubmit={validateAndSubmit}>...</form>
```

---


# Muse Handoff Formats

Standardized handoff templates for agent collaboration.

---

## Input Handoffs (→ Muse)

### FORGE_TO_MUSE_HANDOFF

```markdown
## FORGE_TO_MUSE_HANDOFF

**Prototype Created**: [Component/page description]
**Prototype Location**: [File path]
**Visual State**: [Has styling / Unstyled / Partial]

**Token Needs**:
- Colors: [brand colors used / hardcoded values present]
- Spacing: [consistent / inconsistent / magic numbers]
- Typography: [follows scale / ad-hoc sizes]

**Request**: Apply design tokens to prototype, ensure design system compliance
```

### VISION_TO_MUSE_HANDOFF

```markdown
## VISION_TO_MUSE_HANDOFF

**Creative Direction**: [Design brief description]
**Brand Guidelines**: [File path or description]
**Color Palette**: [Primary, secondary, accent colors]
**Typography Direction**: [Font families, scale preference]

**Token Requirements**:
- New tokens needed: [list]
- Existing tokens to update: [list]
- Dark mode: [required / optional]

**Request**: Implement design direction as design tokens
```

### ARTISAN_TO_MUSE_HANDOFF

```markdown
## ARTISAN_TO_MUSE_HANDOFF

**Component Built**: [Component name]
**Component Location**: [File path]
**Styling Approach**: [Tailwind / CSS Modules / styled-components]

**Token Issues Found**:
- Hardcoded values: [count and examples]
- Missing tokens: [tokens that should exist]
- Inconsistencies: [description]

**Request**: Audit and tokenize component styles
```

### NEXUS_TO_MUSE_HANDOFF

```markdown
## NEXUS_TO_MUSE_HANDOFF

**Design Task**: [Description]
**Type**: [Token audit / Dark mode / System construction / Token application]
**Target**: [Specific files or components]

**Context**:
- Project: [project description]
- Framework: [Tailwind / CSS variables / Panda CSS / etc.]
- Dark mode: [required / existing / not needed]
- Existing tokens: [path to token files if any]

**Request**: [Specific design system deliverable]
```

---

## Output Handoffs (Muse →)

### MUSE_TO_PALETTE_HANDOFF

```markdown
## MUSE_TO_PALETTE_HANDOFF

**Visual Change**: [Description of token/color change]
**Files Changed**:
| File | Change |
|------|--------|
| [path] | [what changed] |

**Colors Involved**:
- Background: [token or value]
- Foreground: [token or value]
- Interactive: [token or value]

**A11y Checks Required**:
- [ ] Contrast ratio meets WCAG AA (4.5:1 text, 3:1 UI)
- [ ] Focus states visible on all backgrounds
- [ ] Color is not sole indicator of state
- [ ] Works in both light and dark modes

**Request**: Verify accessibility compliance for color changes
```

### MUSE_TO_FLOW_HANDOFF

```markdown
## MUSE_TO_FLOW_HANDOFF

**Tokens Created**: [Animation/transition related tokens]
**Token Values**:
| Token | Value | Purpose |
|-------|-------|---------|
| --duration-fast | 150ms | Micro-interactions |
| --duration-normal | 300ms | Standard transitions |
| --duration-slow | 500ms | Page transitions |
| --easing-default | cubic-bezier(0.4, 0, 0.2, 1) | Standard ease |

**Request**: Apply motion tokens to component transitions
```

### MUSE_TO_CANVAS_HANDOFF

```markdown
## MUSE_TO_CANVAS_HANDOFF

**Design System Created**: [System name or scope]
**Visualization Needed**:
- [ ] Color palette diagram (primitive + semantic)
- [ ] Typography scale visualization
- [ ] Spacing system grid
- [ ] Token dependency graph

**Token Data**:
| Category | Count | Key Tokens |
|----------|-------|------------|
| Colors | [N] | primary, neutral, semantic |
| Spacing | [N] | 8px grid scale |
| Typography | [N] | Major third scale |

**Request**: Create design system visualization diagrams
```

### MUSE_TO_SHOWCASE_HANDOFF

```markdown
## MUSE_TO_SHOWCASE_HANDOFF

**Tokens Updated**: [Description of changes]
**Token Files**:
| File | Purpose |
|------|---------|
| [path] | [description] |

**Storybook Updates Needed**:
- [ ] Token documentation stories
- [ ] Color palette story
- [ ] Typography scale story
- [ ] Spacing reference story
- [ ] Dark mode toggle decorator

**Request**: Update Storybook token documentation
```

### MUSE_TO_JUDGE_HANDOFF

```markdown
## MUSE_TO_JUDGE_HANDOFF

**Design System Code Written**: [Description]
**Files Changed**:
| File | Lines | Change |
|------|-------|--------|
| [path] | [N] | [what changed] |

**Review Focus Areas**:
- Token naming: [consistent with conventions?]
- Dark mode: [all tokens have dark variants?]
- No hardcoded values: [magic numbers eliminated?]
- Framework compat: [works with project's CSS framework?]

**Request**: Review design system code quality
```

---

## Collaboration Patterns

### Pattern A: Prototype Tokenization
```
Forge (prototype) → FORGE_TO_MUSE → Muse (tokenize) → MUSE_TO_PALETTE → Palette (a11y)
```

### Pattern B: Creative Direction Implementation
```
Vision (direction) → VISION_TO_MUSE → Muse (tokens) → MUSE_TO_SHOWCASE → Showcase (docs)
```

### Pattern C: Component Audit
```
Artisan (component) → ARTISAN_TO_MUSE → Muse (audit + fix) → MUSE_TO_JUDGE → Judge (review)
```

### Pattern D: Full Design System Pipeline
```
Vision → Muse (tokens) → MUSE_TO_PALETTE → Palette (a11y) → MUSE_TO_FLOW → Flow (motion) → MUSE_TO_SHOWCASE → Showcase (docs)
```

### Pattern E: Dark Mode Implementation
```
Muse (dark mode) → MUSE_TO_PALETTE → Palette (contrast check) → Muse (adjust) → MUSE_TO_JUDGE → Judge (review)
```

### Pattern F: Token Sync
```
Figma → Muse (sync + transform) → MUSE_TO_SHOWCASE → Showcase (update stories)
```

### Pattern G: Design System Visualization
```
Muse (system created) → MUSE_TO_CANVAS → Canvas (diagrams) → MUSE_TO_SHOWCASE → Showcase (catalog)
```

---

## Reverse Feedback Handoffs (Receiving)

Downstream agents can report token issues back to Muse via these templates.

### PALETTE_TO_MUSE_FEEDBACK

When Palette discovers contrast or accessibility issues with Muse's tokens.

```yaml
PALETTE_TO_MUSE_FEEDBACK:
  Feedback_Type: contrast_failure | color_accessibility | dark_mode_issue
  Source_Agent: Palette
  Priority: high | medium | low
  Issue:
    token_name: "--{token that failed}"
    current_value: "{current token value}"
    context: "[Where the issue was found]"
    failure_detail:
      test: "[WCAG AA contrast | color blindness sim | dark mode check]"
      required: "[Required ratio or standard]"
      actual: "[Measured result]"
  Suggested_Fix:
    new_value: "{suggested replacement value}"
    rationale: "[Why this value passes]"
  Affected_Components:
    - "[Component 1]"
    - "[Component 2]"
```

---

### FLOW_TO_MUSE_FEEDBACK

When Flow needs motion token adjustments for animation quality.

```yaml
FLOW_TO_MUSE_FEEDBACK:
  Feedback_Type: duration_adjustment | easing_change | new_motion_token
  Source_Agent: Flow
  Priority: high | medium | low
  Issue:
    token_name: "--{motion token}"
    current_value: "{current value}"
    context: "[Animation or transition where issue occurs]"
    problem: "[Too fast | too slow | wrong easing | missing token]"
  Suggested_Fix:
    new_value: "{suggested value}"
    rationale: "[Why this improves the animation]"
    performance_impact: "[fps improvement or CLS reduction if measurable]"
  Affected_Animations:
    - "[Animation 1]"
    - "[Animation 2]"
```

---

### SHOWCASE_TO_MUSE_FEEDBACK

When Showcase discovers hardcoded values in component stories.

```yaml
SHOWCASE_TO_MUSE_FEEDBACK:
  Feedback_Type: hardcoded_value | missing_token | stale_token
  Source_Agent: Showcase
  Priority: high | medium | low
  Issue:
    file: "[File path where hardcoded value found]"
    line: [line number]
    hardcoded_value: "{the raw value, e.g., #f0f2f5}"
    context: "[Property where it's used, e.g., background-color]"
  Suggested_Token:
    existing_token: "--{existing token if one fits}"
    new_token_needed: true | false
    suggested_name: "--{suggested name if new token needed}"
  Component:
    name: "[Component name]"
    story: "[Storybook story path]"
```

---

### JUDGE_TO_MUSE_FEEDBACK

When Judge finds token inconsistencies during code review.

```yaml
JUDGE_TO_MUSE_FEEDBACK:
  Feedback_Type: token_inconsistency | naming_violation | duplicate_token | deprecated_usage
  Source_Agent: Judge
  Priority: high | medium | low
  Issue:
    files:
      - file: "[File path]"
        line: [line number]
        description: "[What inconsistency was found]"
    pattern: "[Recurring pattern if detected across multiple files]"
  Suggested_Action:
    action: "tokenize | rename | consolidate | deprecate"
    detail: "[Specific fix recommendation]"
  Scope:
    files_affected: [count]
    components_affected: [count]
```

---

## Output Handoffs (Token Lifecycle)

### MUSE_TO_RIPPLE_HANDOFF

Request impact analysis before token deprecation or removal.

```yaml
MUSE_TO_RIPPLE_HANDOFF:
  Request_Type: token_impact_analysis
  Context:
    action: "deprecate | remove | rename | modify"
    tokens:
      - token_name: "--{token}"
        current_value: "{value}"
        new_token: "--{replacement if any}"
    migration_id: "MIGRATION-{YYYY}-{NNN}"
  Scope:
    search_patterns:
      - "var(--{token})"
      - "@apply {utility-class}"
    directories:
      - "src/"
      - "styles/"
  Expected_Output:
    - "List of affected files and line numbers"
    - "Component dependency tree"
    - "Risk assessment (high/medium/low)"
  Urgency: "[low | medium | high]"
```

---

## Reverse Feedback Processing Workflow

When Muse receives reverse feedback:

```
1. RECEIVE    → Parse feedback template, identify priority
2. VALIDATE   → Confirm the reported issue is reproducible
3. ASSESS     → Determine scope (single token vs systemic)
4. ACT        → Fix token value, or propose lifecycle transition
5. NOTIFY     → Inform source agent of resolution
6. AUDIT      → Run token audit on affected area
```

### Priority Handling

| Priority | Response Time | Action |
|----------|--------------|--------|
| **High** | Immediate | Fix in current session, notify source agent |
| **Medium** | Next cycle | Add to scan backlog, fix in next SCAN phase |
| **Low** | Scheduled | Document for next design system review |

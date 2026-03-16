# Token Lifecycle Management

Defines the lifecycle process for design tokens — from proposal through adoption, stabilization, deprecation, and removal.

---

## Lifecycle State Machine

```
PROPOSE ──→ ADOPT ──→ STABLE ──→ DEPRECATE ──→ REMOVE
   │           │         │            │
   └── REJECT  └── WITHDRAW  │       └── REINSTATE (rare)
                              │
                              └── FREEZE (indefinite hold)
```

### Phase Definitions

| Phase | Description | Duration | Entry Criteria | Exit Criteria |
|-------|-------------|----------|----------------|---------------|
| **PROPOSE** | New token with rationale, under review | 1 sprint | Token request submitted | Approved or rejected |
| **ADOPT** | Token available, usage encouraged, old coexists | 1-2 sprints | Proposal approved | Usage in 3+ components |
| **STABLE** | Token is standard, documented, fully integrated | Ongoing | Adoption threshold met | Deprecation decision |
| **DEPRECATE** | Token marked deprecated, migration guide issued | 2 sprints | Replacement defined | Usage drops to 0% |
| **REMOVE** | Token deleted from codebase | — | Zero usage confirmed | — |

### Transition Rules

| Transition | Trigger | Required Actions |
|------------|---------|-----------------|
| PROPOSE → ADOPT | Stakeholder approval | Add to token file with `/* @status: adopt */` |
| PROPOSE → REJECT | Does not meet criteria | Document rejection reason |
| ADOPT → STABLE | Usage in 3+ components | Remove status comment, add to documentation |
| ADOPT → WITHDRAW | Token not gaining adoption | Remove token, notify early adopters |
| STABLE → DEPRECATE | Replacement available | Issue migration guide, add deprecation warning |
| DEPRECATE → REMOVE | 0% usage confirmed | Delete token, update documentation |
| DEPRECATE → REINSTATE | Deprecation reversed | Remove deprecation warning, document reason |
| Any → FREEZE | External blocker | Document blocker, set review date |

---

## Token Proposal Template

When proposing a new token or token change:

```yaml
TOKEN_PROPOSAL:
  token_name: "--{category}-{property}-{variant}"
  type: "new | rename | modify | split | merge"
  category: "color | spacing | typography | shadow | radius | motion"
  layer: "primitive | semantic | component"

  rationale:
    problem: "What inconsistency or gap this addresses"
    evidence: "Where hardcoded values or misuse were found"
    usage_estimate: "Expected number of consumers"

  definition:
    value: "Token value (e.g., #2563eb, 16px, 0.2s)"
    dark_variant: "Dark mode value if applicable"
    responsive: "Responsive adaptation if applicable"

  impact:
    replaces: "Token(s) being replaced, if any"
    affected_components: ["Component list"]
    affected_files: ["File list"]
    breaking_change: true | false

  governance:
    approver: "Muse | Muse + Vision | Muse + Palette"
    review_required: true | false
    review_reason: "Why review is needed"
```

---

## Deprecation Announcement Template

When deprecating a token:

```markdown
## Token Deprecation Notice

**Token:** `--{old-token-name}`
**Status:** DEPRECATED as of {date}
**Replacement:** `--{new-token-name}`
**Removal Target:** {date or sprint}

### Migration Guide

| Old Token | New Token | Notes |
|-----------|-----------|-------|
| `--{old}` | `--{new}` | {Any value changes} |

### Migration Steps

1. Search codebase: `grep -r "var(--{old-token})" src/`
2. Replace with new token: `--{old-token}` → `--{new-token}`
3. Verify dark mode compatibility
4. Run token audit to confirm 0% old usage

### Deprecation Warning (CSS)

```css
/* @deprecated Use --{new-token} instead. Will be removed in {sprint}. */
--{old-token}: var(--{new-token});
```

### Deprecation Warning (Tailwind)

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      // @deprecated Use 'brand' instead. Will be removed in {sprint}.
      'primary-old': 'var(--{new-token})',
    }
  }
}
```
```

---

## Migration Guide Template

For bulk token migrations (e.g., renaming a category):

```yaml
TOKEN_MIGRATION:
  id: "MIGRATION-{YYYY}-{NNN}"
  title: "{Migration description}"
  date: "{YYYY-MM-DD}"
  author: "Muse"

  scope:
    tokens_affected: [{list}]
    files_affected: [{list}]
    components_affected: [{list}]

  mapping:
    - old: "--color-primary"
      new: "--color-brand"
      value_change: false
    - old: "--color-primary-light"
      new: "--color-brand-light"
      value_change: false

  steps:
    - description: "Add new tokens alongside old"
      phase: ADOPT
    - description: "Update components to use new tokens"
      phase: ADOPT
    - description: "Mark old tokens as deprecated"
      phase: DEPRECATE
    - description: "Run impact analysis (Ripple)"
      phase: DEPRECATE
    - description: "Remove old tokens after 0% usage"
      phase: REMOVE

  rollback:
    strategy: "Revert token file to pre-migration state"
    risk: "Low — old tokens preserved during ADOPT phase"

  validation:
    - "Token audit shows 0% old token usage"
    - "Dark mode verification passes"
    - "Palette a11y check passes"
    - "Visual regression (Showcase) passes"
```

---

## Impact Analysis Checklist

Before any token state transition, assess impact:

### PROPOSE → ADOPT

- [ ] Token name follows naming convention (`--{category}-{property}-{variant}-{state}`)
- [ ] No naming conflict with existing tokens
- [ ] Dark mode variant defined (if color/shadow token)
- [ ] Value aligns with existing scale (spacing grid, type scale)

### STABLE → DEPRECATE

- [ ] Replacement token is defined and in STABLE state
- [ ] Migration guide written with old → new mapping
- [ ] Ripple impact scan completed (affected files identified)
- [ ] Deprecation warning added to token definition
- [ ] Timeline communicated (2 sprint removal window)

### DEPRECATE → REMOVE

- [ ] Token audit confirms 0% usage in codebase
- [ ] No references in Storybook stories (Showcase)
- [ ] No references in documentation
- [ ] Removal PR reviewed

---

## Integration with Other Agents

| Agent | Role in Token Lifecycle |
|-------|------------------------|
| **Vision** | Approves new semantic/brand tokens; initiates large-scale migrations |
| **Palette** | Validates a11y compliance for new/changed color tokens |
| **Ripple** | Scans impact of deprecation/removal across codebase |
| **Showcase** | Updates Storybook stories when tokens change; reports stale token usage |
| **Judge** | Reviews token migration PRs for correctness |
| **Flow** | Validates motion token changes don't break animations |

---

## Version Tagging Convention

Token sets can be versioned for tracking major changes:

```
tokens/v1.0.0  — Initial token system
tokens/v1.1.0  — Added motion tokens
tokens/v1.2.0  — Dark mode semantic layer
tokens/v2.0.0  — Brand refresh (breaking: primary → brand rename)
```

**Versioning rules:**
- **Patch** (x.x.1): Token value adjustment (non-breaking)
- **Minor** (x.1.0): New tokens added (non-breaking)
- **Major** (1.0.0): Token rename, removal, or structural change (breaking)

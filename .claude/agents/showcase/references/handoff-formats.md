# Showcase Handoff Formats

Standardized handoff templates for agent collaboration.

---

## Input Handoffs (→ Showcase)

### FORGE_TO_SHOWCASE_HANDOFF

```markdown
## FORGE_TO_SHOWCASE_HANDOFF

**Prototype**: [Component name and path]
**Framework**: [React/Vue/Svelte]
**Preview Story**: [Path to preview story if exists]

**Story Requirements**:
- Cover all variants: [list]
- States to document: [default, hover, focus, disabled, error, loading]
- Dark mode verification: [yes/no]

**Component Props**:
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| variant | string | 'primary' | Required variants |
| size | string | 'md' | Size options |

**Notes**: [Special considerations from prototyping]

**Request**: Create full story coverage with interactions, a11y, and MDX docs
```

### ARTISAN_TO_SHOWCASE_HANDOFF

```markdown
## ARTISAN_TO_SHOWCASE_HANDOFF

**Component**: [Component name and path]
**Framework**: [React/Vue/Svelte]
**Production Status**: [Ready / In Progress]

**Story Needs**:
- Document all production variants and states
- Add interaction tests for: [user flows]
- Verify a11y compliance

**Integration Points**:
- State management: [how state is managed]
- Data fetching: [how data is loaded]
- Theme support: [light/dark/custom]

**Request**: Create production-quality stories matching implementation
```

### FLOW_TO_SHOWCASE_HANDOFF

```markdown
## FLOW_TO_SHOWCASE_HANDOFF

**Component**: [Component with animation]
**Animation States to Capture**:
- Default (idle)
- Hover
- Active/Pressed
- Loading
- Success/Error

**Storybook Considerations**:
- Use `play` function to trigger animations
- Add `parameters.chromatic.delay` for visual regression timing
- Create `prefers-reduced-motion` variant story

**Request**: Create Storybook stories showcasing animation states
```

### VISION_TO_SHOWCASE_HANDOFF

```markdown
## VISION_TO_SHOWCASE_HANDOFF

**Design Direction**: [Overall design language]
**Component Catalog Scope**: [Which components to document]

**Documentation Requirements**:
- Design guidelines per component
- Usage examples (do's and don'ts)
- Visual comparison (light/dark, sizes, states)

**Organization**:
- Hierarchy: [Atoms/Molecules/Organisms structure]
- Naming: [Component naming conventions]

**Request**: Build component catalog reflecting design direction
```

### DIRECTOR_TO_SHOWCASE_HANDOFF

```markdown
## DIRECTOR_TO_SHOWCASE_HANDOFF

**Demo Completed**: [Feature/component demoed]
**Key Interactions Captured**: [List of interactions]

**Story Suggestions**:
| Interaction | Story Name | Play Function Needed |
|-------------|------------|---------------------|
| Button click | WithClick | Yes |
| Form submit | SubmitFlow | Yes |
| Modal open/close | ModalInteraction | Yes |

**Request**: Create stories that reproduce the demonstrated interactions
```

### PALETTE_TO_SHOWCASE_HANDOFF

```markdown
## PALETTE_TO_SHOWCASE_HANDOFF

**UX Review Findings**: [Summary of UX review]
**Components Reviewed**: [List of components]

**Story Gaps Identified**:
| Component | Missing State | Priority |
|-----------|--------------|----------|
| Button | Focus visible | High |
| Input | Error + disabled | Medium |
| Modal | Keyboard trap | High |

**A11y Issues**:
- [Issue 1]: [Component] - [Description]
- [Issue 2]: [Component] - [Description]

**Request**: Add missing state stories and a11y test coverage
```

---

## Output Handoffs (Showcase →)

### SHOWCASE_TO_MUSE_HANDOFF

```markdown
## SHOWCASE_TO_MUSE_HANDOFF

**Stories Audited**: [Number of stories]
**Token Issues Detected**:

| File | Issue | Recommendation |
|------|-------|----------------|
| Button.stories.tsx | Hardcoded `#3498db` | Use `var(--color-primary)` |
| Card.stories.tsx | `padding: 15px` | Use `var(--space-4)` |
| Modal.stories.tsx | `font-size: 14px` | Use `var(--text-sm)` |

**Inconsistencies Found**:
- [Component A] uses different spacing than [Component B]
- Color usage not aligned with token system

**Request**: Apply design tokens to production components, then update stories
```

### SHOWCASE_TO_RADAR_HANDOFF

```markdown
## SHOWCASE_TO_RADAR_HANDOFF

**Story Coverage Report**:
| Component | Stories | Play Tests | A11y |
|-----------|---------|------------|------|
| Button | 5 | 3 | Pass |
| Input | 4 | 2 | Warn |
| Modal | 3 | 1 | Fail |

**Gap Analysis**:
- Play functions cover: [user interactions]
- Unit tests should cover: [business logic, edge cases]
- Missing test scenarios: [specific suggestions]

**Flaky Test Warning**:
- Animation timing may affect snapshot tests
- prefers-reduced-motion variant should be tested
- Viewport-dependent components need responsive tests

**Request**: Verify no visual regression, add component-level tests
```

### SHOWCASE_TO_VOYAGER_HANDOFF

```markdown
## SHOWCASE_TO_VOYAGER_HANDOFF

**Play Function Coverage**:
Stories cover these single-component interactions:
- Button click → focus state
- Form validation → error display
- Modal open/close
- Dropdown selection

**E2E Handoff** (multi-page journeys):
The following user journeys need full E2E coverage:
1. Complete checkout flow (multi-page)
2. Authentication flow (login → dashboard)
3. Complex form wizard (multi-step)

**Boundary**:
- Showcase: Single component interactions (play functions)
- Voyager: Multi-page user journeys (Playwright E2E)

**Request**: Create E2E tests for the listed user journeys
```

### SHOWCASE_TO_VISION_HANDOFF

```markdown
## SHOWCASE_TO_VISION_HANDOFF

**Component Catalog Status**:
| Category | Components | Coverage | Quality |
|----------|-----------|----------|---------|
| Atoms | 12 | 92% | A |
| Molecules | 8 | 75% | B |
| Organisms | 5 | 60% | C |

**Design Consistency Issues**:
- [Issue 1]: Inconsistent spacing across card components
- [Issue 2]: Button hover states vary between contexts

**Stories URL**: [Storybook deployment URL]

**Request**: Review component catalog for design consistency
```

### SHOWCASE_TO_QUILL_HANDOFF

```markdown
## SHOWCASE_TO_QUILL_HANDOFF

**Documentation Generated**:
| Component | MDX Doc | Autodocs | Usage Examples |
|-----------|---------|----------|----------------|
| Button | Yes | Yes | 3 |
| Input | Yes | Yes | 2 |
| Modal | No | Yes | 1 |

**Documentation Gaps**:
- Missing MDX docs for: [Component list]
- Incomplete usage examples for: [Component list]
- API documentation needs update for: [Component list]

**Request**: Enhance component documentation with usage guidelines
```

### SHOWCASE_TO_FLOW_HANDOFF

```markdown
## SHOWCASE_TO_FLOW_HANDOFF

**Components Needing Animation**:
| Component | Current State | Desired Animation |
|-----------|--------------|-------------------|
| Modal | Instant show/hide | Fade + scale entry/exit |
| Tooltip | Instant show/hide | Fade + slide entry |
| Dropdown | Instant show/hide | Slide down + fade |

**Story Infrastructure Ready**:
- Play functions can trigger state changes
- Chromatic delay configured for animation capture
- prefers-reduced-motion story variant prepared

**Request**: Implement animations, then update stories with animation states
```

---

## Collaboration Patterns

### Pattern A: Prototype to Documentation
```
Forge (prototype) → FORGE_TO_SHOWCASE → Showcase (full stories) → SHOWCASE_TO_QUILL → Quill (docs)
```

### Pattern B: Design to Catalog
```
Vision (direction) → VISION_TO_SHOWCASE → Showcase (catalog) → SHOWCASE_TO_VISION → Vision (review)
```

### Pattern C: Story to Test Sync
```
Showcase (stories) → SHOWCASE_TO_RADAR → Radar (unit tests)
                   → SHOWCASE_TO_VOYAGER → Voyager (E2E tests)
```

### Pattern D: Token Audit Loop
```
Showcase (audit) → SHOWCASE_TO_MUSE → Muse (apply tokens) → Showcase (update stories)
```

### Pattern E: Animation Enhancement
```
Flow (animations) → FLOW_TO_SHOWCASE → Showcase (animation stories) → SHOWCASE_TO_FLOW → Flow (refinement)
```

### Pattern F: UX Review Cycle
```
Palette (UX review) → PALETTE_TO_SHOWCASE → Showcase (add coverage) → SHOWCASE_TO_VISION → Vision (validate)
```

### Pattern G: Demo to Story
```
Director (demo) → DIRECTOR_TO_SHOWCASE → Showcase (interaction stories) → SHOWCASE_TO_RADAR → Radar (tests)
```

### Pattern H: Production Polish
```
Artisan (component) → ARTISAN_TO_SHOWCASE → Showcase (production stories) → SHOWCASE_TO_MUSE → Muse (tokens)
```

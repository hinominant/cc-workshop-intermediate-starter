# Flow Handoff Formats

Standardized handoff templates for agent collaboration.

---

## Input Handoffs (→ Flow)

### PALETTE_TO_FLOW_HANDOFF

```markdown
## PALETTE_TO_FLOW_HANDOFF

**Interaction**: [Description of the interaction to animate]
**Trigger**: [Event type: onClick, onHover, onMount, onScroll]
**States**: [State flow, e.g., idle → active → loading → success]

**Timing Requirements**:
- Transition: [duration] [easing]
- Loading: [determinate/indeterminate]
- Success/Error: [duration], then [next state]

**Visual Requirements**:
- Transform: [scale, translate, rotate values]
- Color: [color transitions if any]
- Other: [opacity, blur, clip-path]

**Accessibility**:
- prefers-reduced-motion: [required handling]
- Focus visibility: [requirements]

**Request**: Implement animation per specification
```

### VISION_TO_FLOW_HANDOFF

```markdown
## VISION_TO_FLOW_HANDOFF

**Design Direction**: [Overall motion language]
**Personality**: [e.g., "minimal and precise" or "playful and bouncy"]

**Motion Guidelines**:
| Element | Enter | Exit | State Change |
|---------|-------|------|-------------|
| [Element 1] | [animation] | [animation] | [animation] |
| [Element 2] | [animation] | [animation] | [animation] |

**Easing Preference**: [e.g., "ease-out for entries, spring for interactions"]
**Duration Range**: [e.g., "100-300ms, nothing longer"]

**Request**: Implement motion system per design direction
```

### FORGE_TO_FLOW_HANDOFF

```markdown
## FORGE_TO_FLOW_HANDOFF

**Prototype**: [Component/page reference]
**Current State**: [What exists in the prototype]

**Animation Gaps**:
| Element | Current | Desired |
|---------|---------|---------|
| [Element] | No animation | [Desired animation] |

**Priority**:
1. [Most important animation]
2. [Second priority]

**Request**: Polish prototype with production-quality animations
```

### ARTISAN_TO_FLOW_HANDOFF

```markdown
## ARTISAN_TO_FLOW_HANDOFF

**Component**: [Component name and path]
**Framework**: [React/Vue/Svelte]

**Animation Needed**:
- [Description of animation requirement]
- Performance budget: [frame budget]

**Integration Points**:
- State management: [how state drives animation]
- Lifecycle: [mount/unmount/update triggers]

**Request**: Add animation layer to production component
```

---

## Output Handoffs (Flow →)

### FLOW_TO_PALETTE_HANDOFF

```markdown
## FLOW_TO_PALETTE_HANDOFF

**Implementation**: [What was animated]
**Method**: [CSS / Framer Motion / GSAP / Web Animations API]

**Performance Report**:
| Metric | Value | Status |
|--------|-------|--------|
| Frame budget | X/16ms | OK/Warning |
| Properties animated | transform, opacity | GPU-safe |
| CLS impact | 0 | OK |

**Accessibility**:
- prefers-reduced-motion: [How handled]
- Focus management: [Any changes]

**Feedback**:
- [Any UX observations during implementation]
- [Suggested improvements to the interaction spec]

**Request**: Review animation in context of overall UX
```

### FLOW_TO_RADAR_HANDOFF

```markdown
## FLOW_TO_RADAR_HANDOFF

**Animation Added**: [Description]
**Files Changed**:
| File | Change |
|------|--------|
| `path/to/file` | [What changed] |

**Test Considerations**:
- Animation timing may affect snapshot tests
- prefers-reduced-motion variant should be tested
- Visual regression: compare with/without animation

**Potential Flaky Points**:
- [Timing-dependent assertions]
- [Viewport-dependent animations]

**Request**: Verify no visual regression, add animation-aware tests if needed
```

### FLOW_TO_CANVAS_HANDOFF

```markdown
## FLOW_TO_CANVAS_HANDOFF

**Visualization Type**: [State Diagram / Timing Chart / Flow Diagram]

**Animation Flow**:
| State | Trigger | Next State | Duration | Easing |
|-------|---------|------------|----------|--------|
| idle | mouseenter | hover | 200ms | ease-out |
| hover | mouseleave | idle | 150ms | ease-in |
| hover | click | active | 100ms | ease-out |

**Timing Data** (for timing chart):
```
Timeline (ms):  0    100   200   300   400
                |-----|-----|-----|-----|
Element 1:      [====]......................
Element 2:      .....[====]................
Element 3:      ..........[====]...........
```

**Request**: Generate visual documentation of animation flow
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

---

## Collaboration Patterns

### Pattern A: UX Friction Fix
```
Palette (identifies friction) → PALETTE_TO_FLOW_HANDOFF → Flow (implements) → FLOW_TO_RADAR_HANDOFF → Radar (verifies)
```

### Pattern B: Design Direction
```
Vision (motion language) → VISION_TO_FLOW_HANDOFF → Flow (implements system) → FLOW_TO_PALETTE_HANDOFF → Palette (validates UX)
```

### Pattern C: Prototype Enhancement
```
Forge (prototype) → FORGE_TO_FLOW_HANDOFF → Flow (polishes) → FLOW_TO_SHOWCASE_HANDOFF → Showcase (documents)
```

### Pattern D: Production Polish
```
Artisan (component) → ARTISAN_TO_FLOW_HANDOFF → Flow (animates) → FLOW_TO_RADAR_HANDOFF → Radar (tests)
```

### Pattern E: Token Alignment
```
Muse (design tokens) → Flow (aligns motion tokens) → Muse (validates consistency)
```

### Pattern F: Animation Documentation
```
Flow (complex animation) → FLOW_TO_CANVAS_HANDOFF → Canvas (visualizes) → Quill (documents)
```

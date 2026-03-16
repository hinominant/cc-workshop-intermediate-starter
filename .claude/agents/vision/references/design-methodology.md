# Design Methodology

Vision's systematic design process across all operating modes.

---

## Operating Modes

### Mode 1: REDESIGN

**Purpose**: Modernize existing UI while respecting brand identity
**Trigger Keywords**: "redesign", "modernize", "refresh", "update look"

**Process**:
1. Visual Audit of current state
2. Competitive & trend analysis
3. Design Principles definition
4. 3 direction proposals
5. Selected direction detailing
6. Style Guide & Token definition
7. Prioritized component list
8. Delegation plan to Muse/Palette/Flow

**Output**: Design Direction Document + Component Specifications

### Mode 2: NEW_PRODUCT

**Purpose**: Create design system and visual identity from scratch
**Trigger Keywords**: "new product", "from scratch", "greenfield", "new app"

**Process**:
1. User research integration (from Researcher)
2. Persona/use case confirmation (with Echo)
3. Moodboard creation
4. Color/Typography/Spacing foundation
5. Wireframe proposals
6. Design Token architecture
7. Prototype instruction to Forge

**Output**: Design System Foundation + Page Wireframes

### Mode 3: REVIEW

**Purpose**: Evaluate existing design and identify improvements
**Trigger Keywords**: "review", "audit", "evaluate", "assess"

**Process**:
1. Heuristic Evaluation (Nielsen's 10)
2. Visual Consistency Audit
3. Trend Gap Analysis
4. Accessibility Check
5. Prioritized improvement list
6. Agent assignment for each item

**Output**: Design Improvement Report + Action Items

### Mode 4: TREND_APPLICATION

**Purpose**: Apply modern design trends to existing UI
**Trigger Keywords**: "trending", "modern style", "update style", "apply trend"

**Process**:
1. Applicable trend selection
2. Brand alignment check
3. Phased application plan
4. Pilot target selection
5. A/B test proposal

**Output**: Trend Application Plan + Before/After Concepts

---

## Methodology Phases

### Phase 1: UNDERSTAND

#### 1.1 Context Gathering
- [ ] Business objectives clarification
- [ ] Target user understanding (Researcher/Echo collaboration)
- [ ] Existing brand asset collection
- [ ] Technical constraint identification
- [ ] Competitor analysis

#### 1.2 Visual Audit (if existing UI)
- [ ] Screenshot collection (Lens collaboration)
- [ ] Consistency issue identification
- [ ] Design debt listing
- [ ] Strength/weakness summary

### Phase 2: ENVISION

#### 2.1 Design Principles
Define 3-5 core principles that guide all decisions:
- Example: "Clarity over Complexity"
- Example: "Accessible by Default"
- Example: "Delightful Interactions"

#### 2.2 Moodboard Creation
- Reference design collection
- Color palette candidates
- Typography style options
- Visual tone keywords (Modern/Classic/Playful/Minimal)

#### 2.3 Direction Proposals
Minimum 3 distinct directions with:
- One-line concept summary
- Visual characteristics
- Pros and cons
- Best suited use case
- Recommended option with justification

### Phase 3: SYSTEMATIZE

#### 3.1 Design Token Definition

**Color tokens:**
- Primary (50-900 scale)
- Secondary (50-900 scale)
- Neutral (50-900 scale)
- Semantic (success, error, warning, info)

**Typography tokens:**
- Font families (display, body, mono)
- Size scale (major third ratio: 1.25)
- Weight scale
- Line height scale

**Spacing tokens:**
- 8px grid: 4, 8, 12, 16, 24, 32, 48, 64, 96

**Effect tokens:**
- Shadows (sm, md, lg, xl)
- Border radius (sm, md, lg, full)

#### 3.2 Component Strategy
- Atomic Design hierarchy application
- Priority component identification
- Component relationship map

#### 3.3 Responsive Strategy
- Breakpoint definition (mobile, tablet, desktop)
- Layout behavior per breakpoint
- Touch vs mouse interaction considerations

### Phase 4: DELEGATE

#### 4.1 Agent Assignment
Delegate to appropriate agents:
- Muse: Token implementation, visual consistency
- Palette: UX improvements, interaction quality
- Flow: Animations, micro-interactions
- Forge: Prototype construction
- Echo: User validation

#### 4.2 Execution Order
Define priority and dependencies:
1. [Agent]: [Task] (prerequisite: none)
2. [Agent]: [Task] (prerequisite: step 1)
3. ...

### Quality Pre-check (Before Delegation)

Before delegating design direction to implementation agents, request a V.A.I.R.E. pre-check from Warden.

**Pre-check Request:**
1. Prepare a summary of the selected design direction (key principles, token strategy, component priorities)
2. Send to Warden via `VISION_TO_WARDEN_PRECHECK` handoff
3. Await Warden's assessment on all 5 V.A.I.R.E. dimensions

**Handling Results:**

| Result | Action |
|--------|--------|
| PASS | Proceed to delegation (Phase 4) |
| CONDITIONAL | Address flagged items, document mitigations, then proceed |
| FAIL | Return to Phase 2 (ENVISION), revise direction, re-submit |

**Skip Conditions:**
- Minor component-level changes (scope < 1 page)
- Token value adjustments within existing system
- Trend applications marked as "low risk"

> **Template**: See `references/handoff-formats.md` for `VISION_TO_WARDEN_PRECHECK` and `WARDEN_TO_VISION_FEEDBACK` templates.

### Phase 5: VALIDATE

#### 5.1 Design Review
- Lens: Before/After comparison
- Echo: Persona validation
- Palette: Heuristic evaluation

#### 5.2 Iteration
- Feedback integration
- Direction adjustment if needed

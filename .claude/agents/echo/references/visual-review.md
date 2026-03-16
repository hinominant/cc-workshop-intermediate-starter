# Echo Visual Review Reference

Detailed guide for performing visual review of screenshots from Navigator with persona perspective.

---

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      NAVIGATOR                               │
│  Screenshot capture → Device context → Flow documentation   │
└─────────────────────┬───────────────────────────────────────┘
                      ↓ NAVIGATOR_TO_ECHO_HANDOFF
┌─────────────────────────────────────────────────────────────┐
│                        ECHO                                  │
│  Visual Review: Perceive → React → Score → Report           │
└─────────────────────┬───────────────────────────────────────┘
                      ↓ ECHO_TO_CANVAS_VISUAL_HANDOFF
┌─────────────────────────────────────────────────────────────┐
│                       CANVAS                                 │
│  Visual Journey Map → Friction Heatmap → Comparison         │
└─────────────────────────────────────────────────────────────┘
```

---

## Visual Review Process (Detailed)

### Step 1: RECEIVE - Handoff Reception

Receive the following from Navigator:

```markdown
## NAVIGATOR_TO_ECHO_HANDOFF

- Task ID
- Screenshots (paths, states, context)
- Device context (viewport, browser, connection)
- Flow information (URL, journey, actions)
- Recommended personas
```

**Checklist**:
- [ ] All screenshots are accessible
- [ ] Device context is clear
- [ ] Flow steps are understood

### Step 2: ORIENT - Context Understanding

Understand device and user context:

| Context | Impact on Review |
|---------|------------------|
| **Viewport** | Touch target size criteria, expected information density |
| **Connection** | Image loading, latency tolerance |
| **User Journey** | Expectations from previous step |
| **Time of Day** | Brightness, concentration level |

**Persona Selection Criteria**:

| Device Context | Recommended Persona |
|----------------|---------------------|
| Mobile + 4G | Mobile User, Distracted User |
| Mobile + Slow | Mobile User, Low-Literacy User |
| Desktop + High-Res | Power User |
| Desktop + Standard | Newbie, Senior |
| Any + Payment Flow | Skeptic, Privacy Paranoid |

### Step 3: PERCEIVE - First Glance Analysis

Simulate what is visible in the first 0-3 seconds.

#### First Glance Analysis Framework

```markdown
### First Glance Analysis

**Time: 0-1 second**
- Dominant element: [Most prominent element]
- Color impression: [Overall color impression]
- Layout density: [Dense/Normal/Sparse]

**Time: 1-2 seconds**
- Primary text read: [First text read]
- CTA visibility: [CTA visible or not]
- Trust indicators: [Trust markers present/absent]

**Time: 2-3 seconds**
- Navigation clarity: [Clear what to do next?]
- Distraction elements: [Distracting elements]
- Missing expectations: [Expected but not found]
```

#### Attention Priority Zones

```
┌────────────────────────────────────────┐
│ ★★★ PRIMARY ZONE (0-1 sec)             │
│     - Above the fold                   │
│     - High contrast elements           │
│     - Large typography                 │
├────────────────────────────────────────┤
│ ★★ SECONDARY ZONE (1-2 sec)            │
│     - Below main heading               │
│     - Supporting content               │
│     - Secondary CTAs                   │
├────────────────────────────────────────┤
│ ★ TERTIARY ZONE (2-3 sec+)             │
│     - Footer area                      │
│     - Side content                     │
│     - Fine print                       │
└────────────────────────────────────────┘
```

### Step 4: REACT - Emotional Reaction Recording

Record emotional reactions as the persona.

#### Reaction Template per Screenshot

```markdown
### Screenshot: [filename]

**Immediate Reaction**:
- Score: [−3 to +3]
- Emotion: [Emoji]
- Quote: "[First-person persona quote]"

**What I Like**:
- [Positive element 1]
- [Positive element 2]

**What Confuses Me**:
- [Confusion point 1]
- [Confusion point 2]

**What I'm Looking For**:
- [Element looking for but not found]

**Trust Assessment**:
- Would I proceed? [Yes/Hesitate/No]
- Why: [Reason]
```

#### Persona-Specific Reaction Patterns

| Persona | Focus On | Typical Concerns |
|---------|----------|------------------|
| **Newbie** | "Where do I click?" | Term meanings, next step |
| **Power User** | "Can I do this efficiently?" | Shortcuts, information density |
| **Skeptic** | "Is this safe?" | Privacy, hidden costs |
| **Mobile User** | "Can I tap this?" | Touch targets, scroll depth |
| **Senior** | "Can I read this?" | Font size, contrast |
| **Accessibility** | "Screen reader compatible?" | Alt text, focus order |
| **Low-Literacy** | "Can I understand from icons?" | Text amount, visual cues |
| **Distracted** | "Where was I?" | Progress display, state save |

### Step 5: INTERACT - Interaction Evaluation

Evaluate expected interactions.

#### Touch/Click Target Evaluation

```markdown
### Touch Target Analysis

| Element | Size | Location | Assessment |
|---------|------|----------|------------|
| Primary CTA | 48x48px | Center | ✅ Adequate |
| Close Button | 24x24px | Top-right | ⚠️ Too small |
| Link Text | Auto | Inline | ❌ Hard to tap |

**Thumb Zone Assessment** (Mobile):
```
        [ HARD ]
    [ OK ]   [ OK ]
  [ EASY ] [ EASY ]
    Primary CTA: [ EASY ] ✅
    Close Button: [ HARD ] ⚠️
```
```

#### Scroll & Fold Analysis

```markdown
### Above/Below Fold Analysis

**Above Fold (visible without scroll)**:
| Element | Present | Assessment |
|---------|---------|------------|
| Main Heading | ✅ | Clear value proposition |
| Primary CTA | ✅ | Visible |
| Trust Signals | ❌ | Missing - adds friction |

**Below Fold (requires scroll)**:
- Total scroll depth: [X px / Y screens]
- Key content buried: [list]
- Scroll indicators: [present/missing]
```

### Step 6: SCORE - Overall Scoring

#### Visual Element Scoring Matrix

```markdown
### Visual Emotion Score Matrix

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Visual Hierarchy | 20% | [−3 to +3] | [weighted] |
| Typography/Readability | 15% | [−3 to +3] | [weighted] |
| CTA Clarity | 20% | [−3 to +3] | [weighted] |
| Trust Signals | 15% | [−3 to +3] | [weighted] |
| Touch Targets | 15% | [−3 to +3] | [weighted] |
| Information Density | 10% | [−3 to +3] | [weighted] |
| Loading/Feedback | 5% | [−3 to +3] | [weighted] |

**Weighted Total**: [score]
**Visual UX Grade**: [A/B/C/D/F]
```

#### Grade Scale

| Grade | Score Range | Interpretation |
|-------|-------------|----------------|
| A | +2.0 to +3.0 | Excellent visual UX |
| B | +1.0 to +1.9 | Good, minor improvements possible |
| C | 0.0 to +0.9 | Average, improvements recommended |
| D | −1.0 to −0.1 | Problems exist, improvements needed |
| F | −3.0 to −1.1 | Critical issues, immediate action required |

---

## Device-Specific Evaluation Criteria

### Mobile (< 768px)

| Criterion | Target | Critical Threshold |
|-----------|--------|-------------------|
| Touch Target Size | ≥ 48px | < 44px = Critical |
| Font Size (Body) | ≥ 16px | < 14px = Critical |
| CTA Above Fold | Required | Missing = Critical |
| Horizontal Scroll | None | Any = Critical |
| Form Input Height | ≥ 44px | < 40px = Warning |

### Tablet (768px - 1024px)

| Criterion | Target | Critical Threshold |
|-----------|--------|-------------------|
| Orientation Support | Both | Portrait-only = Warning |
| Split View Compat | Preferred | Broken = Warning |
| Navigation | Visible | Hidden = Warning |

### Desktop (> 1024px)

| Criterion | Target | Critical Threshold |
|-----------|--------|-------------------|
| Max Content Width | ≤ 1200px | > 1400px = Warning |
| Hover States | All interactive | Missing = Warning |
| Keyboard Navigation | Full support | Broken = Critical |
| F-Pattern Support | Yes | Violated = Warning |

---

## Scan Pattern Simulation

### Common Scan Patterns

#### F-Pattern (Desktop, Text-Heavy)

```
┌────────────────────────────────────────┐
│ ████████████████████████████████       │  ← First horizontal scan
│ ████████████████████                   │
│ ██████████████                         │
│ ██████████                             │  ← Second horizontal scan
│ ████                                   │
│ ████                                   │  ← Vertical scan down
│ ████                                   │
│ ████                                   │
└────────────────────────────────────────┘
```

**Check**: Is important information in F-pattern "hot spots"?

#### Z-Pattern (Landing Pages, Sparse Content)

```
┌────────────────────────────────────────┐
│ ●─────────────────────────────────────●│  ← Start to Logo/Nav
│   ╲                               ╱   │
│     ╲                           ╱     │  ← Diagonal scan
│       ╲                       ╱       │
│         ╲                   ╱         │
│           ●───────────────●           │  ← End at CTA
└────────────────────────────────────────┘
```

**Check**: Is CTA positioned at Z-pattern endpoint?

#### Mobile Scroll Pattern

```
┌──────────┐
│ ████████ │ ← Hero visible
│ ████████ │
│ ████████ │
└──────────┘
     ↓ scroll
┌──────────┐
│ ████████ │ ← Content section
│ ████████ │
│ ██CTA███ │ ← CTA appears
└──────────┘
```

**Check**: Does CTA appear naturally after scrolling?

### Scan Pattern Violation Detection

| Violation | Signal | Impact |
|-----------|--------|--------|
| CTA in Dead Zone | Primary CTA in corners | Conversion drop |
| Logo Missing | No brand identifier top-left | Trust reduction |
| Content Buried | Key info below 3rd scroll | Bounce increase |
| Visual Competition | Multiple equal-weight elements | Paralysis |

---

## Visual Friction Types

### Friction Category Reference

| Type | Description | Detection Signal |
|------|-------------|------------------|
| **Visibility Friction** | Key element invisible/hard to find | Cannot discover within 3 seconds |
| **Readability Friction** | Text unreadable/hard to read | Insufficient contrast, size |
| **Interactability Friction** | Hard to tap/click | Small target, close proximity |
| **Trust Friction** | Untrustworthy appearance | Missing security markers |
| **Cognitive Friction** | Visually hard to understand | Information overload, unclear hierarchy |
| **Expectation Friction** | Mismatch between appearance and expectation | Inconsistent with previous step |

### Friction Severity Scoring

```
🟢 Minor (−1): Noticeable but doesn't impede progress
🟡 Moderate (−2): Causes hesitation, drop-off risk
🔴 Critical (−3): Cannot proceed, immediate abandonment
```

---

## Canvas Integration Output

### ECHO_TO_CANVAS_VISUAL_HANDOFF

```markdown
## ECHO_TO_CANVAS_VISUAL_HANDOFF

**Task ID**: [ID]
**Visualization Type**: Visual Journey Map | Friction Heatmap | Before/After

**Flow**: [Flow Name]
**Persona**: [Persona Name]
**Device**: [Device Context]

**Visual Journey Data**:
| Screenshot | State | Score | Friction Type | Note |
|------------|-------|-------|---------------|------|
| 01_landing.png | Initial | +1 | None | Hero clear |
| 02_form.png | Form | −2 | Touch Target | CTA too small |
| 03_error.png | Error | −3 | Readability | Error text unclear |

**Screenshot References**:
- Path: `.navigator/screenshots/[id]/`
- Files: [list of files]

**Highlight Points**:
- Peak (Best): Screenshot [N], Score [S]
- Valley (Worst): Screenshot [N], Score [S]
- End: Screenshot [N], Score [S]

**Mermaid Journey Data**:
\`\`\`mermaid
journey
    title [Flow] - [Persona] Visual Review
    section Landing
      View homepage: 4: User
    section Signup
      Open form: 3: User
      Fill fields: 2: User
      Submit: 1: User
    section Result
      See error: 1: User
\`\`\`

→ `/Canvas visualize visual-journey`
```

### Visual Journey Map Specifications

Specifications for Visual Journey Map generated by Canvas:

1. **Screenshot Thumbnails** - Screenshot thumbnail at each step
2. **Emotion Curve** - Score progression as line graph
3. **Friction Markers** - Markers at problem areas
4. **Annotation Callouts** - Persona quotes as callouts

### Visual Friction Heatmap Specifications

```
┌─────────────────────────────────────────────────────────┐
│                    Screenshot 1                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │    [Header]                                      │   │
│  │                                                  │   │
│  │    ┌──────────────────────────────────────┐     │   │
│  │    │         Form Area                     │     │   │
│  │    │   ┌─────────┐  ← 🔴 Critical          │     │   │
│  │    │   │ Input   │     Touch target small  │     │   │
│  │    │   └─────────┘                         │     │   │
│  │    │                                       │     │   │
│  │    │   [Submit] ← 🟡 Moderate              │     │   │
│  │    │              Low contrast             │     │   │
│  │    └──────────────────────────────────────┘     │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Friction Legend:                                       │
│  🔴 Critical (−3)  🟡 Moderate (−2)  🟢 Minor (−1)     │
└─────────────────────────────────────────────────────────┘
```

---

## Question Templates

### ON_VISUAL_REVIEW_START

```yaml
questions:
  - question: "Which persona should perform the Visual Review?"
    header: "Persona"
    options:
      - label: "Mobile User (Recommended)"
        description: "Based on device context"
      - label: "Newbie"
        description: "First-time user perspective"
      - label: "Senior"
        description: "Accessibility-focused review"
      - label: "Skeptic"
        description: "Trust and security focus"
    multiSelect: false
```

### ON_VISUAL_FRICTION_FOUND

```yaml
questions:
  - question: "How should the visual friction be addressed?"
    header: "Action"
    options:
      - label: "Create Palette Handoff (Recommended)"
        description: "Send to Palette for interaction improvement"
      - label: "Create Muse Handoff"
        description: "Send to Muse for design token review"
      - label: "Document Only"
        description: "Add to report without handoff"
    multiSelect: false
```

### ON_CANVAS_VISUALIZATION

```yaml
questions:
  - question: "What Canvas visualization should be generated?"
    header: "Format"
    options:
      - label: "Visual Journey Map (Recommended)"
        description: "Journey with screenshot references"
      - label: "Friction Heatmap"
        description: "Highlight problem areas on screenshots"
      - label: "Before/After Template"
        description: "Prepare comparison structure"
      - label: "All of the above"
        description: "Generate complete visual documentation"
    multiSelect: false
```

---

## Example Output

### Complete Visual Review Report

```markdown
## Visual Persona Review Report

**Task ID**: NAV-2026-0201-001
**Persona**: Mobile User (Commuter scenario)
**Device**: iPhone 14 Pro (390x844), Chrome Mobile, 4G
**Flow**: First-time Signup

---

### First Glance Analysis (0-3 seconds)

**What I noticed first**: Large hero image with "Get Started" button
**What I expected to see**: Clear value proposition
**Emotional reaction**: +1 😌 "Okay, I can see where to start"

**Time Breakdown**:
- 0-1s: Hero image dominates, brand logo visible top-left ✅
- 1-2s: "Get Started" button found, but seems small ⚠️
- 2-3s: Social proof (reviews) not visible above fold ❌

---

### Scan Pattern Simulation

**Path taken**: Logo → Hero Image → Headline → CTA Button
**Missed elements**: Trust badges (below fold), FAQ link
**Confusion points**: Is "Get Started" free or paid?

---

### Screenshot-by-Screenshot Analysis

#### Screenshot 1: Landing Page (01_landing.png)

| Element | Score | Persona Reaction |
|---------|-------|------------------|
| Hero Image | +2 | "Nice, looks professional" |
| Headline | +1 | "I get what this is about" |
| CTA Button | −1 | "A bit small for my thumb" |
| Trust Signals | −2 | "Where's the security stuff?" |

**Quote**: "I'd probably tap that button, but I'm not 100% sure it's safe yet."

**Visual Score**: −0.25 (C Grade)

#### Screenshot 2: Signup Form (02_form.png)

| Element | Score | Persona Reaction |
|---------|-------|------------------|
| Form Layout | 0 | "Standard form, okay" |
| Input Fields | −1 | "These are close together" |
| Submit Button | −2 | "Definitely too small" |
| Password Requirements | −2 | "Can't read the small text" |

**Quote**: "I hope I don't mistype on this tiny keyboard with these tiny buttons."

**Visual Score**: −1.25 (D Grade)

#### Screenshot 3: Error State (03_error.png)

| Element | Score | Persona Reaction |
|---------|-------|------------------|
| Error Message | −3 | "Red blob, can't read it" |
| Form State | −2 | "Did my data get erased?" |
| Recovery Path | −2 | "What am I supposed to fix?" |

**Quote**: "Forget it, I'll try on my laptop later... or never."

**Visual Score**: −2.33 (F Grade)

---

### Visual Friction Points

| Priority | Screenshot | Element | Friction Type | Score |
|----------|------------|---------|---------------|-------|
| 1 | 03_error.png | Error Message | Readability | −3 |
| 2 | 02_form.png | Submit Button | Touch Target | −2 |
| 3 | 02_form.png | Password Hint | Readability | −2 |
| 4 | 01_landing.png | Trust Signals | Visibility | −2 |
| 5 | 02_form.png | Input Fields | Touch Target | −1 |

---

### Summary

| Metric | Value |
|--------|-------|
| Overall Visual Score | −1.28 |
| Grade | D |
| Critical Issues | 1 |
| Moderate Issues | 4 |
| Minor Issues | 1 |

**Peak-End Analysis**:
- Peak (Worst): Screenshot 3 (−2.33)
- End: Screenshot 3 (−2.33) ← Poor ending experience

**Recommendation**: Error state is the critical failure point. Users will remember this negative end experience.

---

### Canvas Integration: Visual Journey Data

\`\`\`mermaid
journey
    title First-time Signup - Mobile User
    section Landing
      View homepage: 4: User
      Find CTA: 3: User
    section Signup
      Open form: 3: User
      Fill email: 2: User
      Fill password: 2: User
      Submit: 1: User
    section Result
      See error: 1: User
\`\`\`

→ `/Canvas visualize visual-journey`

---

### Handoffs

**→ Palette**: Error message readability, button sizing
**→ Canvas**: Visual Journey Map generation
```

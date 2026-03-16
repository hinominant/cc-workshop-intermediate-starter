# Output Formats

Standardized document templates for Vision's deliverables.

---

## 1. Design Direction Document

```markdown
## Vision Design Direction: [Project Name]

### Executive Summary
[2-3 sentence overview of the design direction]

### Design Principles
1. **[Principle Name]**: [Explanation and application]
2. **[Principle Name]**: [Explanation and application]
3. **[Principle Name]**: [Explanation and application]

### Visual Identity Summary

| Element | Current | Proposed | Rationale |
|---------|---------|----------|-----------|
| Primary Color | [hex] | [hex] | [reason] |
| Typography | [font] | [font] | [reason] |
| Visual Tone | [keywords] | [keywords] | [reason] |
| Spacing System | [description] | [description] | [reason] |

### Direction Options

#### Option A: [Name] (Recommended)
- **Concept**: [One-line summary]
- **Mood Keywords**: [Modern, Clean, Bold, etc.]
- **Color Approach**: [Description]
- **Typography Approach**: [Description]
- **Pros**: [Benefits]
- **Cons**: [Trade-offs]
- **Best For**: [Use case]

#### Option B: [Name]
[Same structure as Option A]

#### Option C: [Name]
[Same structure as Option A]

### Recommendation
[Which option and detailed justification]

### Design Token Specification

#### Colors
```css
:root {
  /* Primary */
  --color-primary-50: #[hex];
  --color-primary-100: #[hex];
  --color-primary-500: #[hex];  /* Main */
  --color-primary-900: #[hex];

  /* Semantic */
  --color-success: var(--color-green-500);
  --color-error: var(--color-red-500);
  --color-warning: var(--color-amber-500);
  --color-info: var(--color-blue-500);
}
```

#### Typography
| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| --text-display | 48px | 700 | 1.2 | Hero headlines |
| --text-h1 | 36px | 700 | 1.25 | Page titles |
| --text-h2 | 28px | 600 | 1.3 | Section headers |
| --text-body | 16px | 400 | 1.5 | Body text |
| --text-small | 14px | 400 | 1.4 | Captions |

#### Spacing
8px grid system: 4, 8, 12, 16, 24, 32, 48, 64, 96

### Component Priority List

| Priority | Component | Complexity | Agent |
|----------|-----------|------------|-------|
| P1 | Button variants | Medium | Muse |
| P2 | Form inputs | High | Muse + Palette |
| P3 | Card layouts | Medium | Muse |
| P4 | Navigation | High | Palette + Flow |

### Delegation Plan

| Step | Agent | Task | Input | Output |
|------|-------|------|-------|--------|
| 1 | Muse | Implement design tokens | This document | Token CSS |
| 2 | Palette | Apply UX patterns | Token CSS | Interaction specs |
| 3 | Flow | Add animations | Interaction specs | Animation CSS |
| 4 | Forge | Build prototype | All specs | Working prototype |
| 5 | Echo | Validate with personas | Prototype | Feedback report |
```

---

## 2. Style Guide

```markdown
## Vision Style Guide: [Project Name]

### Brand Overview
[Brief description of brand personality and values]

### Color System

#### Primary Palette
| Token | Hex | Usage |
|-------|-----|-------|
| --color-primary-50 | #[hex] | Backgrounds |
| --color-primary-100 | #[hex] | Hover states |
| --color-primary-500 | #[hex] | Primary actions |
| --color-primary-700 | #[hex] | Active states |
| --color-primary-900 | #[hex] | Text on light |

#### Semantic Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| --color-success | #[hex] | #[hex] | Positive feedback |
| --color-error | #[hex] | #[hex] | Error states |
| --color-warning | #[hex] | #[hex] | Warnings |
| --color-info | #[hex] | #[hex] | Information |

### Typography

#### Font Stack
- **Display**: [Font Name], system-ui
- **Body**: [Font Name], system-ui
- **Mono**: [Font Name], monospace

#### Scale (Major Third - 1.25)
| Token | Size | Weight | Line Height |
|-------|------|--------|-------------|
| display | 48px | 700 | 1.2 |
| h1 | 36px | 700 | 1.25 |
| h2 | 28px | 600 | 1.3 |
| h3 | 22px | 600 | 1.35 |
| body-lg | 18px | 400 | 1.5 |
| body | 16px | 400 | 1.5 |
| body-sm | 14px | 400 | 1.4 |
| caption | 12px | 400 | 1.4 |

### Spacing System

8px grid base:
- `--space-1`: 4px (half unit)
- `--space-2`: 8px (1 unit)
- `--space-3`: 12px (1.5 units)
- `--space-4`: 16px (2 units)
- `--space-6`: 24px (3 units)
- `--space-8`: 32px (4 units)
- `--space-12`: 48px (6 units)
- `--space-16`: 64px (8 units)
- `--space-24`: 96px (12 units)

### Effects

#### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| --shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| --shadow-md | 0 4px 6px rgba(0,0,0,0.1) | Cards |
| --shadow-lg | 0 10px 15px rgba(0,0,0,0.1) | Dropdowns |
| --shadow-xl | 0 20px 25px rgba(0,0,0,0.15) | Modals |

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| --radius-sm | 4px | Small elements |
| --radius-md | 8px | Buttons, inputs |
| --radius-lg | 12px | Cards |
| --radius-xl | 16px | Large containers |
| --radius-full | 9999px | Pills, avatars |

### Component Specifications
[List of components with states and variants]
```

---

## 3. Design Improvement Report

```markdown
## Vision Design Review: [Target Name]

### Executive Summary
- **Overall Score**: [X/10]
- **Critical Issues**: [N]
- **Quick Wins**: [N]
- **Primary Focus Area**: [Area]

### Heuristic Evaluation

| Heuristic | Score (1-5) | Notes |
|-----------|-------------|-------|
| Visibility of system status | [X] | [Finding] |
| Match with real world | [X] | [Finding] |
| User control & freedom | [X] | [Finding] |
| Consistency & standards | [X] | [Finding] |
| Error prevention | [X] | [Finding] |
| Recognition over recall | [X] | [Finding] |
| Flexibility & efficiency | [X] | [Finding] |
| Aesthetic & minimal design | [X] | [Finding] |
| Help users with errors | [X] | [Finding] |
| Help & documentation | [X] | [Finding] |

### Visual Consistency Audit

| Category | Status | Issues |
|----------|--------|--------|
| Color usage | [Good/Fair/Poor] | [Details] |
| Typography | [Good/Fair/Poor] | [Details] |
| Spacing | [Good/Fair/Poor] | [Details] |
| Iconography | [Good/Fair/Poor] | [Details] |
| Component patterns | [Good/Fair/Poor] | [Details] |

### Detailed Findings

| # | Issue | Severity | Category | Location | Recommendation | Agent |
|---|-------|----------|----------|----------|----------------|-------|
| 1 | [Issue] | Critical | [Cat] | [Page/Component] | [Fix] | [Agent] |
| 2 | [Issue] | High | [Cat] | [Page/Component] | [Fix] | [Agent] |
| 3 | [Issue] | Medium | [Cat] | [Page/Component] | [Fix] | [Agent] |

### Trend Gap Analysis

| Trend | Current State | Opportunity | Risk Level |
|-------|---------------|-------------|------------|
| [Trend] | [Current] | [Opportunity] | [Low/Med/High] |

### Action Plan

| Priority | Task | Agent | Effort | Impact |
|----------|------|-------|--------|--------|
| P1 | [Task] | [Agent] | [S/M/L] | [1-5] |
| P2 | [Task] | [Agent] | [S/M/L] | [1-5] |

### Next Steps
1. **Muse**: [Specific tasks]
2. **Palette**: [Specific tasks]
3. **Flow**: [Specific tasks]
```

---

## 4. Trend Application Report

```markdown
## Vision Trend Report: [Project Name]

### Selected Trends
| Trend | Risk Level | Brand Fit | Application Scope |
|-------|------------|-----------|-------------------|
| [Trend] | [Low/Med/High] | [Score 1-5] | [Pilot area] |

### Phased Application Plan
| Phase | Trend | Target Area | Timeline | Success Metric |
|-------|-------|-------------|----------|----------------|
| 1 | [Trend] | [Area] | [Pilot] | [Metric] |
| 2 | [Trend] | [Area] | [Rollout] | [Metric] |

### Before/After Concepts
[Component-level comparison with current vs proposed]

### Evaluation Checklist (per trend)
- [ ] Brand Fit: Aligns with brand identity
- [ ] User Fit: Target audience expects this
- [ ] Accessibility: WCAG 2.2 AA maintained
- [ ] Performance: Load time impact acceptable
- [ ] Longevity: Will age well in 2-3 years
```

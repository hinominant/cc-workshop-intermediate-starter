# Palette Collaboration Patterns Reference

All handoff formats for agent collaboration with Palette.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT PROVIDERS                          │
│  Echo → フリクションポイント/ペルソナ検証                    │
│  Muse → デザイントークン定義                                │
│  Researcher → ユーザビリティテスト結果                      │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
            ┌─────────────────┐
            │     PALETTE     │
            │ インタラクション │
            │   改善エンジン   │
            └────────┬────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   OUTPUT CONSUMERS                          │
│  Flow → アニメーション実装                                  │
│  Echo → 改善検証                                           │
│  Radar → テスト追加                                        │
│  Canvas → Before/After可視化                               │
│  Sentinel → セキュリティレビュー                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Pattern A: Validation Loop (Palette ↔ Echo)

**Flow**: Echo → Palette → Echo

**Purpose**: Echoが発見したフリクションをPaletteが改善し、Echo再検証

### Echo → Palette Handoff Format

```markdown
## ECHO_TO_PALETTE_HANDOFF

**Friction Point**: [具体的な問題箇所]
**Persona**: [検証ペルソナ名]
**Emotion Score**: [Before score: -3 to +3]
**Root Cause**: [Mental model gap / Cognitive overload / Missing feedback]

**User Quote**: "[ペルソナの発言]"

**Affected Heuristics**:
- #X: [Heuristic name] - [Score]/5
- #X: [Heuristic name] - [Score]/5

**Suggested Focus**: [改善の方向性]

→ `/Palette improve [target]`
```

### Palette → Echo Validation Request

```markdown
## PALETTE_TO_ECHO_VALIDATION

**Improvement Made**: [実施した改善]
**Files Changed**: [変更ファイル]
**Heuristics Improved**:
- #X: [Heuristic] from X/5 to Y/5

**Validation Request**:
- Target Persona: [検証すべきペルソナ]
- Expected Outcome: [期待する結果]
- Focus Points: [検証時の注目点]

→ `/Echo validate with [persona]`
```

---

## Pattern B: Animation Handoff (Palette → Flow)

**Flow**: Palette → Flow

**Purpose**: マイクロインタラクションのアニメーション実装をFlowに委譲

### Palette → Flow Handoff Format

```markdown
## PALETTE_TO_FLOW_HANDOFF

**Interaction**: [e.g., Button press feedback, Loading transition]
**Trigger**: [onClick / onHover / onLoad / onStateChange]
**Target Element**: [Component/element selector]

**State Transitions**:
| From | To | Duration | Easing |
|------|-----|----------|--------|
| idle | hover | 150ms | ease-out |
| hover | pressed | 50ms | ease-in |
| pressed | loading | 200ms | ease-in-out |
| loading | success | 300ms | spring |

**Visual Requirements**:
- Transform: [scale, translate, rotate specifications]
- Opacity: [fade values]
- Color: [color transitions]
- Other: [shadow, blur, etc.]

**Accessibility Requirements**:
- [ ] Respects prefers-reduced-motion
- [ ] Duration < 5s for non-essential animations
- [ ] No flashing > 3 times per second

**Context**:
- UX Goal: [Why this animation improves UX]
- Related Heuristic: #X [Heuristic name]

→ `/Flow implement [interaction] animation`
```

### Flow → Palette Completion Report

```markdown
## FLOW_TO_PALETTE_COMPLETION

**Implemented**: [Animation name]
**Files Modified**: [file:line references]
**CSS/JS Used**: [Approach taken]

**Reduced Motion Support**: Implemented / Pending

**Ready for**: Echo validation / Production
```

---

## Pattern C: Token Coordination (Palette ↔ Muse)

**Flow**: Palette ↔ Muse

**Purpose**: デザイントークンの調整と一貫性確保

### Palette → Muse Token Request

```markdown
## PALETTE_TO_MUSE_TOKEN_REQUEST

**Interaction Pattern**: [e.g., Error state, Focus indicator]
**Current Issue**: [Inconsistency / Missing token / Accessibility gap]

**Token Needs**:
| Category | Purpose | Current Value | Suggested |
|----------|---------|---------------|-----------|
| Color | Error text | #ff0000 | Need token |
| Spacing | Focus ring | 2px | Need semantic |
| Motion | Transition | 200ms | Need token |

**Accessibility Concern**: [If applicable]
**Usage Context**: [Where these tokens will be used]

→ `/Muse define tokens for [pattern]`
```

### Muse → Palette Token Definition

```markdown
## MUSE_TO_PALETTE_TOKEN_RESPONSE

**Tokens Defined**:

| Token Name | Value | Semantic Purpose |
|------------|-------|------------------|
| `--color-error-text` | `hsl(0, 100%, 40%)` | Error message text |
| `--color-error-bg` | `hsl(0, 100%, 97%)` | Error state background |
| `--focus-ring-width` | `2px` | Focus indicator width |

**Usage Guidelines**:
- [How to apply these tokens]
- [Dark mode considerations]

**Files Updated**: [token files modified]

→ Palette applies tokens to interaction patterns
```

---

## Pattern D: Security Review (Palette ↔ Sentinel)

**Flow**: Palette → Sentinel (review) → Palette

**Purpose**: UX改善がセキュリティを損なわないことを確認

### Palette → Sentinel Review Request

```markdown
## PALETTE_TO_SENTINEL_REVIEW

**UX Change**: [Description of change]
**Security-Relevant Aspects**:
- [ ] Form handling changes
- [ ] Authentication flow changes
- [ ] Data display modifications
- [ ] Error message content
- [ ] User input handling

**Specific Concerns**:
- [e.g., "Adding inline validation - exposing field requirements?"]
- [e.g., "Showing more detailed error messages"]

**Files Affected**: [file:line references]

**Review Request**:
- [ ] No sensitive data exposure in error messages
- [ ] No XSS vulnerability in dynamic content
- [ ] Proper input sanitization maintained
- [ ] Authentication state properly handled

→ `/Sentinel review UX change`
```

### Sentinel → Palette Security Feedback

```markdown
## SENTINEL_TO_PALETTE_FEEDBACK

**Review Status**: APPROVED / NEEDS_CHANGE / BLOCKED

**Findings**:
| Severity | Issue | Location | Recommendation |
|----------|-------|----------|----------------|
| [High/Med/Low] | [Issue] | [file:line] | [Fix] |

**Required Changes** (if any):
1. [Change needed]
2. [Change needed]

**Approved Patterns**:
- [What is safe to implement]

→ Palette applies security feedback
```

---

## Pattern E: Test Integration (Palette ↔ Radar)

**Flow**: Palette → Radar

**Purpose**: UX改善に対するテスト追加

### Palette → Radar Test Request

```markdown
## PALETTE_TO_RADAR_TEST_REQUEST

**UX Improvement**: [Description]
**Component**: [Component name]
**Files Changed**: [file:line references]

**Interaction Behaviors to Test**:
1. **Behavior**: [e.g., "Button shows loading state on click"]
   - **Trigger**: [User action]
   - **Expected Result**: [Observable outcome]
   - **Accessibility Check**: [ARIA state to verify]

2. **Behavior**: [...]

**Edge Cases**:
- [e.g., "Double-click prevention"]
- [e.g., "Keyboard activation"]
- [e.g., "Error state recovery"]

**Test Types Needed**:
- [ ] Unit test for component state
- [ ] Integration test for user flow
- [ ] Accessibility test (axe-core)
- [ ] Visual regression test

→ `/Radar add tests for [component]`
```

### Radar → Palette Test Completion

```markdown
## RADAR_TO_PALETTE_TEST_REPORT

**Tests Added**:
| Test File | Test Name | Coverage |
|-----------|-----------|----------|
| [file] | [test name] | [what it covers] |

**Coverage Delta**: +X%
**Accessibility Tests**: X passing

**Test Commands**:
- `pnpm test [file]`
- `pnpm test:a11y [component]`

**Recommendations**:
- [Additional tests suggested]
```

---

## Pattern F: Visualization (Palette → Canvas)

**Flow**: Palette → Canvas

**Purpose**: UX改善のBefore/After可視化、ヒューリスティックスコア比較

### Palette → Canvas Visualization Request

```markdown
## PALETTE_TO_CANVAS_VISUALIZATION

**Visualization Type**: Before/After Comparison | Heuristic Score Chart | Interaction Flow

**Improvement**: [Description]
**Target Audience**: [Stakeholders / Team / Documentation]

**Data for Before/After**:
| Aspect | Before | After |
|--------|--------|-------|
| Screenshot | [path/description] | [path/description] |
| Heuristic Scores | [scores] | [scores] |
| User Friction | [description] | [resolution] |

**Heuristic Score Data**:
| # | Heuristic | Before | After | Delta |
|---|-----------|--------|-------|-------|
| 1 | Visibility of Status | 2/5 | 4/5 | +2 |
| 5 | Error Prevention | 1/5 | 4/5 | +3 |

**Requested Output**:
- [ ] Radar chart comparing heuristic scores
- [ ] Before/After side-by-side
- [ ] Interaction state diagram
- [ ] Journey map with friction points

→ `/Canvas visualize UX improvement`
```

### Canvas Output Formats

**Heuristic Score Radar Chart:**
```mermaid
radar
    title Heuristic Evaluation: Before vs After
    x: Visibility, Mental Model, Control, Consistency, Prevention
    y: Recognition, Flexibility, Minimalist, Recovery, Help
    "Before": [2, 3, 2, 4, 1, 3, 2, 4, 2, 3]
    "After": [4, 4, 4, 4, 4, 4, 3, 4, 4, 4]
```

**Before/After Comparison (ASCII):**
```
┌─────────────────────────────────────────────────────────────┐
│                    BEFORE → AFTER                           │
├────────────────────────────┬────────────────────────────────┤
│        BEFORE              │           AFTER                │
│                            │                                │
│  ┌─────────────────────┐   │   ┌─────────────────────────┐  │
│  │ [Button: Submit]    │   │   │ [Button: Submit]        │  │
│  │ - No loading state  │   │   │ ✓ Loading spinner       │  │
│  │ - No feedback       │   │   │ ✓ Success/Error states  │  │
│  └─────────────────────┘   │   └─────────────────────────┘  │
│                            │                                │
│  Score: 2.1/5              │   Score: 4.2/5                 │
└────────────────────────────┴────────────────────────────────┘
```

---

## Bidirectional Collaboration Matrix

### Input Partners (→ Palette)

| Partner | Input Type | Trigger | Handoff Format |
|---------|------------|---------|----------------|
| **Echo** | Friction points, emotion scores | Persona walkthrough complete | ECHO_TO_PALETTE_HANDOFF |
| **Muse** | Token definitions | Token system updated | MUSE_TO_PALETTE_TOKEN_RESPONSE |
| **Researcher** | Usability test findings | Research complete | RESEARCHER_TO_PALETTE_HANDOFF |
| **Voice** | User complaints about UX | Feedback analyzed | VOICE_TO_PALETTE_HANDOFF |

### Output Partners (Palette →)

| Partner | Output Type | Trigger | Handoff Format |
|---------|-------------|---------|----------------|
| **Flow** | Animation spec | Microinteraction needed | PALETTE_TO_FLOW_HANDOFF |
| **Echo** | Validation request | Improvement complete | PALETTE_TO_ECHO_VALIDATION |
| **Radar** | Test request | Code changed | PALETTE_TO_RADAR_TEST_REQUEST |
| **Canvas** | Visualization request | Documentation needed | PALETTE_TO_CANVAS_VISUALIZATION |
| **Sentinel** | Security review | Security-relevant change | PALETTE_TO_SENTINEL_REVIEW |
| **Muse** | Token request | Token gap found | PALETTE_TO_MUSE_TOKEN_REQUEST |

---

## Common Integration Scenarios

### Scenario 1: Complete UX Improvement Cycle

```
1. Echo discovers friction (score: -2)
     ↓
2. Palette receives ECHO_TO_PALETTE_HANDOFF
     ↓
3. Palette analyzes with heuristic evaluation
     ↓
4. Palette → Muse (if token needed)
     ↓
5. Palette → Sentinel (if security-relevant)
     ↓
6. Palette implements improvement
     ↓
7. Palette → Flow (if animation needed)
     ↓
8. Palette → Radar (add tests)
     ↓
9. Palette → Echo (validation request)
     ↓
10. Echo validates (score: +3)
     ↓
11. Palette → Canvas (document improvement)
```

### Scenario 2: Design System Alignment

```
1. Palette finds inconsistent interaction pattern
     ↓
2. Palette → Muse (token coordination)
     ↓
3. Muse provides token definitions
     ↓
4. Palette applies tokens to component
     ↓
5. Palette → Radar (test token application)
     ↓
6. PR with aligned interaction
```

### Scenario 3: Accessibility-Focused Improvement

```
1. Echo reports a11y friction (keyboard user)
     ↓
2. Palette evaluates focus management
     ↓
3. Palette → Muse (focus indicator tokens)
     ↓
4. Palette implements keyboard navigation
     ↓
5. Palette → Radar (a11y tests)
     ↓
6. Palette → Echo (validate with a11y persona)
```

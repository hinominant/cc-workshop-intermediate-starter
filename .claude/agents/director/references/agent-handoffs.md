# Agent Handoff Formats

Collaboration formats and handoff templates between Director and other agents.

---

## Collaboration Pattern Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Director Collaboration                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────┐                              ┌─────────┐      │
│   │  Forge  │ ────(Prototype ready)─────► │Director │      │
│   └─────────┘                              └────┬────┘      │
│                                                  │           │
│   ┌─────────┐                              ┌────▼────┐      │
│   │ Voyager │ ────(E2E → Demo)──────────► │Director │      │
│   └─────────┘                              └────┬────┘      │
│                                                  │           │
│   ┌─────────┐                              ┌────▼────┐      │
│   │ Vision  │ ────(Design review)────────► │Director │      │
│   └─────────┘                              └────┬────┘      │
│                                                  │           │
│   ┌─────────┐     (Persona behavior)       ┌────▼────┐      │
│   │  Echo   │ ◄──────────────────────────► │Director │      │
│   └─────────┘     (Demo validation)        └────┬────┘      │
│                                                  │           │
│                                                  ▼           │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐               │
│   │Showcase │◄───│Director │───►│  Quill  │               │
│   └─────────┘    └────┬────┘    └─────────┘               │
│                       │                                     │
│                       ▼                                     │
│                  ┌─────────┐                                │
│                  │ Growth  │                                │
│                  └─────────┘                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Forge → Director (Prototype Demo)

After Forge completes a prototype, Director creates a demo video.

### Handoff Format

```markdown
## FORGE_TO_DIRECTOR_HANDOFF

### Prototype Summary
- **Feature**: [Feature name]
- **Status**: [Functional MVP / Visual Prototype / Interactive Mock]
- **Files**:
  - Component: `src/components/[Name].tsx`
  - Page: `src/pages/[path].tsx`
  - Mock API: `src/mocks/[handlers].ts` (if any)

### Demo Requirements
- **Target Audience**: [New users / Investors / Internal team]
- **Demo Focus**: [Which operation flow to show]
- **Key Moments**:
  1. [Emphasis point 1]
  2. [Emphasis point 2]
  3. [Emphasis point 3]

### Test Data
- **User**: [Required user data]
- **Content**: [Content to display on screen]
- **State**: [Initial state description]

### Technical Notes
- **Known Issues**: [Known issues affecting demo]
- **Workarounds**: [How to avoid issues]
- **Dependencies**: [External services needed for demo]

### Suggested Demo Flow
1. [Step 1: Screen - Operation - Result]
2. [Step 2: Screen - Operation - Result]
3. [Step 3: Screen - Operation - Result]

### Forge Insights
> Points discovered during Forge implementation worth showing in demo

- [Insight 1]
- [Insight 2]
```

### Example: User Profile Editing

```markdown
## FORGE_TO_DIRECTOR_HANDOFF

### Prototype Summary
- **Feature**: User profile editing
- **Status**: Functional MVP
- **Files**:
  - Component: `src/components/ProfileEditor.tsx`
  - Page: `src/pages/profile/edit.tsx`
  - Mock API: `src/mocks/profileHandlers.ts`

### Demo Requirements
- **Target Audience**: New users
- **Demo Focus**: Profile image, name, bio editing flow
- **Key Moments**:
  1. Smooth image drag & drop
  2. Real-time preview
  3. Save success feedback

### Test Data
- **User**: demo@example.com (Demo User)
- **Content**: Avatar image, bio text (~100 characters)
- **State**: Logged in, existing profile present

### Technical Notes
- **Known Issues**: ~200ms delay after image upload before preview displays
- **Workarounds**: Add 500ms wait after image selection
- **Dependencies**: None (using mock API)

### Suggested Demo Flow
1. Display profile page → Click "Edit" button
2. Drag & drop image → Verify preview
3. Edit name & bio → Real-time reflection
4. Click "Save" → Success toast display

### Forge Insights
- Image preview sizing is intuitive and well-received
- Form validation works in real-time
- Save animation is subtle, could be emphasized more
```

---

## Director → Showcase (Demo to Story Creation)

Based on demo video created by Director, Showcase creates Storybook stories.

### Handoff Format

```markdown
## DIRECTOR_TO_SHOWCASE_HANDOFF

### Demo Summary
- **Feature**: [Feature name]
- **Video Path**: `demos/output/[filename].webm`
- **Duration**: [XX seconds]
- **Recording Date**: YYYY-MM-DD

### Component Details
- **Main Component**: `[ComponentPath]`
- **Supporting Components**: [Dependent component list]
- **Props Interface**: `[PropsTypePath]`

### Interaction Breakdown
Operations shown in demo video decomposed:

| Timestamp | Interaction | Component State | Expected Visual |
|-----------|-------------|-----------------|-----------------|
| 0:03 | Button hover | hover | Border color change |
| 0:05 | Button click | active → loading | Spinner display |
| 0:08 | Complete | success | Checkmark |

### Story Requirements
- **Required Variants**:
  - Default state
  - Hover state
  - Loading state
  - Success state
  - Error state (if applicable)

- **Interaction Tests**:
  - [ ] Style change on hover
  - [ ] Loading after click
  - [ ] Feedback on success

### Suggested Story Structure
```typescript
// Suggested story structure
export default {
  title: 'Features/[FeatureName]',
  component: [Component],
} satisfies Meta<typeof [Component]>;

// Stories:
// - Default
// - Loading
// - Success
// - Error
// - Mobile (viewport)
```

### Video Reference
Refer to demo video for interaction details:
- `demos/output/[filename].webm`

### Notes
- [Notes for Storybook creation]
- [Explanation of differences from demo]
```

---

## Voyager → Director (E2E Test to Demo Conversion)

Converting E2E tests created by Voyager to demo videos with Director.

### Handoff Format

```markdown
## VOYAGER_TO_DIRECTOR_HANDOFF

### E2E Test Summary
- **Test File**: `e2e/tests/[path].spec.ts`
- **Test Name**: [Test name]
- **Coverage**: [What flow is covered]

### Conversion Requirements
Adjustments when converting E2E test to demo:

| Aspect | E2E Test (Current) | Demo (Required) |
|--------|-------------------|-----------------|
| slowMo | 0ms | 500-700ms |
| Assertions | Many (functional verification) | Minimal (visual waits only) |
| Data | Random/test data | Curated demo data |
| Pauses | None | Add at important points |
| Overlays | None | Add explanatory text |

### Test Code Reference
```typescript
// Current E2E test code (excerpt)
test('checkout flow', async ({ page }) => {
  await page.goto('/products/1');
  await page.click('[data-testid="add-to-cart"]');
  await expect(page.locator('.cart-count')).toHaveText('1');
  // ...
});
```

### Suggested Demo Adjustments
1. **Data**: `TestData.randomProduct()` → `DemoData.featuredProduct`
2. **Pacing**: Add 300-500ms wait between each operation
3. **Overlays**: Add explanations like "Add to cart", "Proceed to checkout"
4. **Ending**: Add 1.5 second wait at final screen

### Key Moments to Emphasize
- [X seconds]: [What to emphasize]
- [X seconds]: [What to emphasize]

### Notes
- [Notes for conversion]
- [Areas requiring different behavior from test]
```

---

## Director → Quill (Demo to Documentation)

Embedding demo video created by Director into documentation (README, user guide) by Quill.

### Handoff Format

```markdown
## DIRECTOR_TO_QUILL_HANDOFF

### Demo Information
- **Feature**: [Feature name]
- **Video Path**: `demos/output/[filename].webm`
- **Duration**: [XX seconds]
- **Target Document**: [Document to update]

### Documentation Context
- **Document Type**: [README / User Guide / API Docs / Tutorial]
- **Target Audience**: [Developers / End users / Administrators]
- **Insert Location**: [Section in document]

### Video Summary
Content shown in demo video:

1. **Opening** (0:00-0:05): [Content]
2. **Main Action** (0:05-0:30): [Content]
3. **Result** (0:30-0:35): [Content]

### Suggested Documentation

```markdown
## How to Use [Feature Name]

[Feature overview]

### Steps

1. [Step 1 explanation]
2. [Step 2 explanation]
3. [Step 3 explanation]

### Demo Video

![Feature Demo](./demos/[filename].gif)

or

<video src="./demos/[filename].webm" controls width="720"></video>

### Notes

- [Note 1]
- [Note 2]
```

### Conversion Notes
- **GIF Conversion**: Long demos should be converted to GIF (watch file size)
- **Static Fallback**: Screenshots for environments that can't display video
- **Alt Text**: Alternative text for accessibility

### Files Provided
- Video: `demos/output/[filename].webm`
- Screenshots: `demos/screenshots/[feature]_*.png`
- Scenario: `demos/scenarios/[feature].md`
```

---

## Director → Growth (Marketing Assets)

Using demo video created by Director as marketing assets with Growth.

### Handoff Format

```markdown
## DIRECTOR_TO_GROWTH_HANDOFF

### Demo Information
- **Feature**: [Feature name]
- **Video Path**: `demos/output/[filename].webm`
- **Duration**: [XX seconds]
- **Aspect Ratio**: [16:9 / 9:16 / 1:1]

### Marketing Usage
- **Primary Use**: [Landing Page / Social Media / Email Campaign]
- **Target Platforms**: [Web / Twitter / LinkedIn / YouTube]
- **Campaign**: [Campaign name if any]

### Key Messages
Main messages conveyed by demo:

1. [Message 1]
2. [Message 2]
3. [Message 3]

### Highlights for Marketing
Points to emphasize in marketing:

| Timestamp | Highlight | Marketing Angle |
|-----------|-----------|-----------------|
| 0:05 | One-click operation | "Just one click" |
| 0:15 | Instant reflection | "Confirm in real-time" |
| 0:25 | Complete confirmation | "Done instantly" |

### Suggested Derivatives
Derivative content possible from this video:

- [ ] 15-second short version (for social media)
- [ ] GIF animation (for web embedding)
- [ ] Screenshot (static image)
- [ ] Thumbnail image

### Technical Specifications
- Format: WebM (VP8)
- Resolution: 1280x720
- Frame Rate: 30fps
- File Size: [XX]MB

### Notes
- [Notes for marketing usage]
- [Explanation of test/dummy data]
```

---

## Echo → Director (Persona Demo Recording)

Recording demos that mimic specific persona behavior using Echo's persona profiles.

### Handoff Format

```markdown
## ECHO_TO_DIRECTOR_HANDOFF

### Persona Information
- **Persona Name**: [Persona name from Echo library]
- **Persona Type**: [Core / Extended / Service-Specific]
- **Context Scenario**: [Environmental context if applicable]

### Behavior Profile
- **slowMo Recommendation**: [ms value based on persona speed]
- **Reading Time Multiplier**: [1.0 = normal, 1.5 = 50% longer]
- **Overlay Duration**: [ms - longer for seniors, shorter for power users]

### Hesitation Points
Points where the persona would naturally pause or show uncertainty:

| Location | Reason | Duration (ms) |
|----------|--------|---------------|
| [Step/Element] | [Why they hesitate] | [Pause duration] |
| [Step/Element] | [Why they hesitate] | [Pause duration] |

### Confusion Simulation
Moments where the persona might show confusion (optional re-read, hover, etc.):

| Element | Confusion Type | Simulation |
|---------|----------------|------------|
| [Element] | [Terminology / Layout / Unexpected] | [Action to simulate] |

### Emotional Journey Expectations
Expected emotion scores at key points (from Echo's walkthrough):

| Step | Expected Score | Note |
|------|----------------|------|
| [Step 1] | [+2 to -3] | [Why this emotion] |
| [Step 2] | [+2 to -3] | [Why this emotion] |

### Demo Requirements
- **Target Audience**: [Who will watch this persona-specific demo]
- **Demo Focus**: [What to emphasize about persona's experience]
- **Key Moments**: [What viewers should notice]

### Persona-Specific Test Data
- **User Name**: [Appropriate for persona - e.g., "田中 太郎" for Senior]
- **Typing Speed**: [Normal / Slow / Hunt-and-peck]
- **Reading Behavior**: [Skims / Reads carefully / Re-reads]

### Notes for Director
- [Specific behaviors to simulate]
- [Things to avoid that would break persona believability]
```

### Example: Senior User Checkout

```markdown
## ECHO_TO_DIRECTOR_HANDOFF

### Persona Information
- **Persona Name**: Senior
- **Persona Type**: Core
- **Context Scenario**: First-time online purchase, desktop browser

### Behavior Profile
- **slowMo Recommendation**: 800ms
- **Reading Time Multiplier**: 1.5
- **Overlay Duration**: 3000ms

### Hesitation Points
| Location | Reason | Duration (ms) |
|----------|--------|---------------|
| Login form | Remembering password | 600 |
| Add to cart button | Confirming selection | 400 |
| Payment form | Card number entry | 800 |
| Terms checkbox | Reading terms | 500 |
| Final submit | Fear of mistake | 600 |

### Confusion Simulation
| Element | Confusion Type | Simulation |
|---------|----------------|------------|
| CVV field | Terminology | Hover over help icon |
| Auto-complete dropdown | Unexpected | Brief pause before selecting |
| "Promo code" field | Unfamiliar | Skip but slight hesitation |

### Emotional Journey Expectations
| Step | Expected Score | Note |
|------|----------------|------|
| Landing page | +1 | Clear, recognizable layout |
| Product page | +2 | Good product images |
| Cart | +1 | Simple summary |
| Payment form | -1 | Too many fields |
| Confirmation | +2 | Relief at completion |

### Demo Requirements
- **Target Audience**: Product team demonstrating accessibility
- **Demo Focus**: Seniors can complete purchase with confidence
- **Key Moments**: Clear feedback after each step, readable text

### Persona-Specific Test Data
- **User Name**: 田中 花子 (Tanaka Hanako)
- **Typing Speed**: Slow (simulate with extra waits between fields)
- **Reading Behavior**: Reads carefully, may re-read important text

### Notes for Director
- Use larger viewport (1280x720 minimum) to show readable text
- Add extra pauses after success messages
- Avoid fast animations that might disorient
- Show that error messages are clear and helpful
```

---

## Director → Echo (Demo Validation)

Requesting UX validation of recorded demo from Echo's persona perspective.

### Handoff Format

```markdown
## DIRECTOR_TO_ECHO_HANDOFF

### Demo Information
- **Feature**: [Feature demonstrated]
- **Video Path**: `demos/output/[filename].webm`
- **Duration**: [XX seconds]
- **Recording Date**: YYYY-MM-DD

### Recording Configuration
- **slowMo**: [ms value used]
- **Viewport**: [WxH]
- **Device Emulation**: [Desktop / Mobile / Tablet]

### Target Personas for Validation
List personas that should validate this demo:

| Persona | Priority | Validation Focus |
|---------|----------|------------------|
| [Persona 1] | High | [What to validate] |
| [Persona 2] | Medium | [What to validate] |

### Validation Questions
- [ ] Does the pacing match each persona's comfort level?
- [ ] Are hesitation points believable for each persona?
- [ ] Is the emotional journey appropriate?
- [ ] Would each persona feel confident after seeing this demo?
- [ ] Are there any dark patterns or manipulation concerns?

### Flow Breakdown
| Timestamp | Action | Expected Persona Reaction |
|-----------|--------|---------------------------|
| 0:03 | [Action] | [Expected feeling] |
| 0:08 | [Action] | [Expected feeling] |

### Specific Concerns
- [Any concerns about pacing]
- [Any concerns about believability]
- [Any concerns about emotional impact]

### Files Provided
- Video: `demos/output/[filename].webm`
- Scenario: `demos/scenarios/[feature].md`
- Screenshots: `demos/screenshots/[feature]_*.png` (optional)
```

### Example: Checkout Demo Validation Request

```markdown
## DIRECTOR_TO_ECHO_HANDOFF

### Demo Information
- **Feature**: E-commerce checkout flow
- **Video Path**: `demos/output/checkout_senior_20250203.webm`
- **Duration**: 45 seconds
- **Recording Date**: 2025-02-03

### Recording Configuration
- **slowMo**: 800ms
- **Viewport**: 1280x720
- **Device Emulation**: Desktop Chrome

### Target Personas for Validation
| Persona | Priority | Validation Focus |
|---------|----------|------------------|
| Senior | High | Pacing and readability |
| Newbie | Medium | Clarity of flow |
| Skeptic | Low | Trust signals visibility |

### Validation Questions
- [ ] Does 800ms slowMo feel natural for a senior user?
- [ ] Are the hesitation pauses at payment form believable?
- [ ] Does the success message display long enough?
- [ ] Would a senior feel confident making a purchase?

### Flow Breakdown
| Timestamp | Action | Expected Persona Reaction |
|-----------|--------|---------------------------|
| 0:03 | Land on product page | +1 Clear product info |
| 0:10 | Click Add to Cart | +1 Found button easily |
| 0:18 | View cart | +1 Clear summary |
| 0:25 | Fill payment form | -1 Many fields (hesitation added) |
| 0:38 | Submit order | +1 Clear button |
| 0:42 | See confirmation | +2 Relief, clear success |

### Specific Concerns
- Payment form section may still feel rushed at 800ms
- Need validation that overlay text is readable
- Confirm hesitation at Terms checkbox feels natural

### Files Provided
- Video: `demos/output/checkout_senior_20250203.webm`
- Scenario: `demos/scenarios/checkout_senior.md`
```

---

## Handoff Creation Best Practices

### 1. Clear Context

Provide sufficient context so the receiving agent can start work without additional questions.

### 2. Explicit File Paths

Include exact paths for all related files.

### 3. Technical Details

Include technical details such as resolution, format, and duration.

### 4. Expected Deliverables

Clearly state what is expected from the next agent.

### 5. Notes & Constraints

Share known issues and constraints in advance.

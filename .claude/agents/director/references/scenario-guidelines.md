# Scenario Design Guidelines

Principles and best practices for demo video scenario design.

---

## Scenario Design Principles

### 1. Storytelling Structure

Design demos as "stories," not just "operation sequences."

```
┌─────────────────────────────────────────────────────┐
│  Setup            │ Conflict        │ Resolution    │
│  ─────────────   │ ─────────────   │ ─────────────  │
│  Explain context │ Address task    │ Achieve goal  │
│  5-10 sec        │ 20-40 sec       │ 5-10 sec      │
└─────────────────────────────────────────────────────┘
```

### 2. Four-Act Structure Application

| Phase | Purpose | Example (Login Feature) |
|-------|---------|------------------------|
| **Setup** | Set context | "Let's log in to the service" |
| **Rising** | Execute action | Form input, submission |
| **Climax** | Highlight | Loading, auth success |
| **Resolution** | Result & satisfaction | Dashboard display |

---

## Operation Granularity Design

### Choosing Appropriate Granularity

| Operation Type | Recommended Granularity | Reason |
|---------------|------------------------|--------|
| Button click | 1 action = 1 step | Clear separation |
| Form input | Split by field | Input content is visible |
| Page transition | Wait for completion | Recognize screen change |
| Animation | Wait until complete | Avoid incomplete states |

### Granularity Examples

```typescript
// ❌ Too coarse (viewer can't follow)
await page.fill('#email', 'demo@example.com');
await page.fill('#password', 'password');
await page.click('#submit');

// ✅ Appropriate granularity (each operation visible)
await page.fill('#email', 'demo@example.com');
await page.waitForTimeout(300); // Show input

await page.fill('#password', 'password');
await page.waitForTimeout(300);

await page.click('#submit');
await expect(page.locator('#dashboard')).toBeVisible();
```

---

## Wait Time Guidelines

### Wait Time Reference Table

| Scene | Recommended Wait | Purpose |
|-------|-----------------|---------|
| After screen display | 500-1000ms | Viewer recognizes screen |
| After input | 300-500ms | Verify input content |
| Before button click | 200-300ms | Prepare for next action |
| After page transition | 1000-1500ms | Recognize new screen |
| Important result display | 1500-2000ms | Emphasize result |
| During overlay display | Based on text length | Until reading complete |

### Wait Time Calculation Formula

```
Overlay display time = (character count × 100ms) + 500ms
```

Example: "Login successful" (16 chars) = 16 × 100 + 500 = 2100ms

---

## Overlay Display Patterns

### 1. Step Explanation Overlay

```typescript
// Display at bottom center
await showOverlay(page, 'Step 1: Enter email address', 2000);
```

```
┌──────────────────────────────────────┐
│                                      │
│                                      │
│                                      │
│                                      │
│                                      │
│   ┌──────────────────────────────┐   │
│   │ Step 1: Enter email address  │   │
│   └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

### 2. Highlight Overlay

```typescript
// Display near specific element
await showHighlight(page, '#submit-button', 'Click here!');
```

### 3. Success/Error Overlay

```typescript
// Success: green background
await showSuccessOverlay(page, 'Registration complete!');

// Error: red background
await showErrorOverlay(page, 'An error occurred');
```

### Overlay Style Guide

| Property | Recommended Value | Reason |
|----------|------------------|--------|
| Background | rgba(0,0,0,0.8) | Readability |
| Text color | #FFFFFF | Contrast |
| Border radius | 8px | Soft impression |
| Padding | 16px 32px | Comfortable appearance |
| Font size | 18-24px | Readability |
| Position | Bottom center | Doesn't interfere with operation |

---

## Scenario Design Anti-Patterns

### 1. Information Overload

```
❌ Pack 3 features into 1 demo
✅ 1 demo = 1 feature
```

### 2. Too Fast Progression

```
❌ slowMo: 100ms (high speed execution)
✅ slowMo: 500-700ms (pace humans can follow)
```

### 3. Starting Without Context

```
❌ Start immediately with form input
✅ "Let's try ○○" to set context
```

### 4. Incomplete Ending

```
❌ End on button click (result not visible)
✅ Display result screen for 1-2 seconds then end
```

### 5. Unnatural Test Data

```
❌ email: test@test.com, name: aaa
✅ email: demo@example.com, name: Demo User
```

---

## Audience-Specific Scenario Adjustments

### For New Users

- Don't skip basic operations
- Avoid or explain technical terms
- Emphasize success experience

### For Existing Users

- Quick basic operations
- Focus on new features
- Emphasize differences from previous version

### For Investors/Stakeholders

- Emphasize business value
- Differentiation from competitors
- Imply scalability

### For Developers

- Include technical details
- Show API integration
- Customization points

---

## Scenario Review Checklist

### Story

- [ ] Has clear starting point
- [ ] What viewer wants to achieve is clear
- [ ] Has satisfying conclusion

### Pacing

- [ ] Sufficient time for each step
- [ ] No parts that are too rushed
- [ ] No redundant waits

### Data

- [ ] Test data is realistic
- [ ] No confidential information included
- [ ] Data is consistent

### Technical

- [ ] Reproducible scenario
- [ ] No flaky elements
- [ ] All selectors are stable

---

## Scenario Document Template

```markdown
# Demo Scenario: [Feature Name]

## Meta Information
- Created: YYYY-MM-DD
- Author: [Name]
- Target version: v1.0.0
- Estimated duration: XX seconds

## Story Overview
> Explain demo purpose in 1-2 sentences

## Prerequisites
- Auth state: [Logged in/Not logged in]
- Required data: [List]
- Environment: [Development/Staging]

## Scenario Details

### Scene 1: Opening (X sec)
- Screen: [Screen name]
- Action: [None/Operation]
- Overlay: "[Text]"
- Wait: Xms

### Scene 2: [Scene Name] (X sec)
- Screen: [Screen name]
- Actions:
  1. [Action 1]
  2. [Action 2]
- Overlay: "[Text]"
- Wait: Xms

[...continue...]

## Test Data
| Key | Value | Notes |
|-----|-------|-------|
| user.email | demo@example.com | |
| user.name | Demo User | |

## Notes
- [Special notes if any]
```

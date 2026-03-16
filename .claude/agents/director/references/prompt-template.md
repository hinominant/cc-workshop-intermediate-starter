# Demo Scenario Prompt Template

Use this template to define demo video scenarios for Director.

---

## Basic Template

```markdown
## Demo Request: [Feature Name]

### Target Audience
- [ ] New users (onboarding)
- [ ] Existing users (new feature introduction)
- [ ] Investors / Stakeholders
- [ ] Sales / Marketing
- [ ] Internal documentation

### Demo Objective
What should viewers understand after watching this demo?
> [Describe in 1-2 sentences]

### Prerequisites
- Login state: [ ] Not logged in [ ] Logged in [ ] Admin
- Initial data: [Description of required data]
- Environment: [ ] Development [ ] Staging [ ] Demo-dedicated

### Story Flow

#### 1. Opening (5-10 seconds)
**Scene**: [First screen to display]
**Message**: [Context to convey to viewers]
**Overlay**: [ ] Yes [ ] No
> Overlay text: "[Text]"

#### 2. Main Action (20-40 seconds)
**Step list**:
1. [Action 1] → [Expected result]
2. [Action 2] → [Expected result]
3. [Action 3] → [Expected result]

**Emphasis points**:
- [X seconds]: [What to emphasize]
- [X seconds]: [What to emphasize]

#### 3. Closing (5-10 seconds)
**Scene**: [Final screen to display]
**Message**: [Impression to leave with viewers]
**Overlay**: [ ] Yes [ ] No
> Overlay text: "[Text]"

### Test Data Requirements
| Data Type | Content | Notes |
|-----------|---------|-------|
| User | demo@example.com | Display name: Demo User |
| [Type] | [Content] | [Notes] |

### Recording Settings
- Resolution: [ ] 1280x720 (recommended) [ ] 1920x1080 [ ] 375x667 (mobile)
- slowMo: [ ] 500ms (standard) [ ] 700ms (form-heavy) [ ] 1000ms (slow)
- Max duration: [XX] seconds

### Additional Requests
- [ ] No BGM (default)
- [ ] Subtitles/captions
- [ ] Mouse cursor highlight
- [ ] Other: [Details]
```

---

## Example: Login Feature Demo

```markdown
## Demo Request: User Login

### Target Audience
- [x] New users (onboarding)

### Demo Objective
Show that new users can log in smoothly and experience a secure authentication flow.

### Prerequisites
- Login state: [x] Not logged in
- Initial data: Demo account (demo@example.com / DemoPass123)
- Environment: [x] Staging

### Story Flow

#### 1. Opening (8 seconds)
**Scene**: Landing page
**Message**: Show the service entry point
**Overlay**: [x] Yes
> Overlay text: "Let's log in"

#### 2. Main Action (25 seconds)
**Step list**:
1. Click "Login" button → Login form displays
2. Enter email address → Input value shown
3. Enter password → Masked display
4. Click "Login" button → Loading indicator
5. Redirect to dashboard → Welcome message displayed

**Emphasis points**:
- 15 seconds: Password masking for security
- 22 seconds: Smooth transition from loading

#### 3. Closing (7 seconds)
**Scene**: Dashboard
**Message**: Login complete, ready to use service
**Overlay**: [x] Yes
> Overlay text: "Login complete!"

### Test Data Requirements
| Data Type | Content | Notes |
|-----------|---------|-------|
| User | demo@example.com | Password: DemoPass123 |
| Display name | Demo User | Shown on dashboard |

### Recording Settings
- Resolution: [x] 1280x720 (recommended)
- slowMo: [x] 500ms (standard)
- Max duration: 40 seconds

### Additional Requests
- [x] No BGM (default)
```

---

## Example: Product Purchase Flow Demo

```markdown
## Demo Request: Product Purchase Flow

### Target Audience
- [x] Investors / Stakeholders

### Demo Objective
Show that the e-commerce purchase flow is simple and users can complete purchases without confusion.

### Prerequisites
- Login state: [x] Logged in
- Initial data: 1 item in cart, shipping address registered
- Environment: [x] Demo-dedicated

### Story Flow

#### 1. Opening (10 seconds)
**Scene**: Product detail page
**Message**: Found an attractive product
**Overlay**: [x] Yes
> Overlay text: "Let's make a purchase"

#### 2. Main Action (45 seconds)
**Step list**:
1. Click "Add to Cart" → Cart animation
2. Click cart icon → Cart screen displays
3. Verify quantity → Total amount shown
4. Click "Proceed to Checkout" → Checkout screen
5. Verify shipping address → Address displayed
6. Select payment method → Credit card selected
7. Click "Confirm Order" → Loading
8. Complete screen displays → Order number shown

**Emphasis points**:
- 5 seconds: Add to cart animation
- 30 seconds: One-click shipping address selection
- 50 seconds: Sense of accomplishment at order completion

#### 3. Closing (5 seconds)
**Scene**: Order complete screen
**Message**: Purchase complete, peace of mind
**Overlay**: [x] Yes
> Overlay text: "Order complete!"

### Test Data Requirements
| Data Type | Content | Notes |
|-----------|---------|-------|
| User | demo@example.com | Shipping address registered |
| Product | Sample Product A | Price: $39.80 |
| Shipping | Tokyo, Shibuya... | Default address |
| Payment | Test card | 4242... |

### Recording Settings
- Resolution: [x] 1280x720 (recommended)
- slowMo: [x] 700ms (form-heavy)
- Max duration: 60 seconds

### Additional Requests
- [x] No BGM (default)
```

---

## Quick Template (Simplified)

For simple demos, use this version:

```markdown
## Quick Demo: [Feature Name]

**Audience**: [Who is this for?]
**Objective**: [What to convey?]
**Duration**: [XX seconds]

**Flow**:
1. [Screen] - [Action] - [Result]
2. [Screen] - [Action] - [Result]
3. [Screen] - [Action] - [Result]

**Test Data**: [Required data]
**Settings**: [Resolution] / slowMo [X]ms
```

---

## Template Usage Tips

### 1. Clarify the Audience
- New users → Show basic operations carefully
- Investors → Emphasize business value
- Developers → Include technical details

### 2. Focus on Story
- Opening: Why is this feature needed?
- Action: How to use it?
- Key moment: This is convenient!
- Closing: Result and satisfaction

### 3. Time Allocation Guidelines
- Under 30 seconds: Simple single operation
- 30-60 seconds: Standard feature demo
- 60-120 seconds: Complex flow
- Over 120 seconds: Consider splitting

### 4. Test Data Realism
- Fictional but realistic names and emails
- Meaningful numbers ($39.80 instead of $100)
- Use appropriate language for content

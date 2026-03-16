# Demo Recording Checklist

Quality checklists for each phase of demo video production.

---

## Prompt Creation Checklist

Items to verify before designing a demo scenario.

### Purpose & Audience

- [ ] **Audience is clear**: Identified who will watch this demo
- [ ] **Purpose is clear**: Defined what viewers should understand after watching
- [ ] **One demo, one feature**: Not cramming multiple unrelated features

### Story Design

- [ ] **Starting point is clear**: Demo start state is defined
- [ ] **Ending point is clear**: Demo end state (success state) is defined
- [ ] **Has narrative arc**: Is a story, not just operation steps
- [ ] **Has emphasis points**: Identified moments viewers should especially notice

### Test Data

- [ ] **Realistic data**: Using demo@example.com, not test@test.com
- [ ] **Consistent data**: Names, emails, addresses are not contradictory
- [ ] **No confidential information**: No production data or real user information

### Technical Feasibility

- [ ] **Reproducible**: Same steps produce same results
- [ ] **Not flaky**: No randomly failing elements
- [ ] **Appropriate duration**: Expected to fit within target time (usually 30-60 seconds)

---

## Implementation Checklist

Items to verify when writing test code.

### Configuration

- [ ] **Using dedicated config file**: Using playwright.config.demo.ts
- [ ] **slowMo setting**: Appropriate value (500-700ms) is set
- [ ] **Video recording ON**: `video: { mode: 'on' }` is set
- [ ] **Appropriate resolution**: Resolution matches target audience device

### Code Quality

- [ ] **Scene division**: Each scene clearly separated with comments
- [ ] **Appropriate waits**: Proper use of waitForTimeout and expect().toBeVisible()
- [ ] **Overlay usage**: Overlay explanations at important points
- [ ] **Error handling**: Handles unexpected states appropriately

### Selectors

- [ ] **Stable selectors**: Using data-testid or role-based selectors
- [ ] **CSS class independent**: Selectors won't break with style changes
- [ ] **Text matching**: Not affected by language changes or handled

### Authentication & Data

- [ ] **Auth state prepared**: Appropriate state set in beforeEach
- [ ] **Test data seeded**: Required data is set up
- [ ] **Cleanup**: State reset in afterEach (if needed)

---

## Post-Recording Checklist

Items to verify after recording, before delivery.

### Playback Verification

- [ ] **Plays correctly**: Video file plays normally
- [ ] **Records to end**: Not cut off midway
- [ ] **No unintended audio**: Silent (usually no sound)

### Visual Quality

- [ ] **Resolution OK**: Not blurry, text is readable
- [ ] **No flickering**: No screen flickering or glitches
- [ ] **Framerate OK**: Not choppy

### Content Quality

- [ ] **All operations visible**: No operations too fast to see
- [ ] **Appropriate pacing**: Not too slow, not too fast
- [ ] **Overlays readable**: Text is readable, display time is sufficient
- [ ] **Result visible**: Final state displayed long enough

### Data Verification

- [ ] **No confidential information**: No passwords, tokens, production data visible
- [ ] **Demo data used**: Realistic but fictional data displayed
- [ ] **No error displays**: No console errors or network errors visible

### File

- [ ] **Naming convention followed**: [feature]_[action]_[date].webm format
- [ ] **Appropriate size**: About 5-10MB for 30 seconds
- [ ] **Saved in correct location**: demos/output/ directory

---

## Final Pre-Delivery Checklist

Final verification before submitting to stakeholders.

### Content Verification

- [ ] **Purpose achieved**: Demo meets original objectives
- [ ] **Brand consistency**: UI matches product's brand
- [ ] **Current state**: No outdated UI or features shown

### Technical Verification

- [ ] **Multiple playback test**: No issues after repeated plays
- [ ] **Verified in different environments**: Checked in players other than local
- [ ] **File integrity**: Confirmed not corrupted

### Documentation

- [ ] **Scenario document saved**: Scenario document saved for future updates
- [ ] **Metadata recorded**: Recording date, version, environment recorded
- [ ] **Change history**: Changes from previous version documented if applicable

---

## Quick Check Sheet

3-minute simple check.

```
□ Plays to the end
□ Followable pace
□ No confidential information
□ Clear result
□ Appropriate filename
```

---

## Checklist Template (Copy-Ready)

```markdown
## Demo Checklist: [Feature Name]

### Pre-Recording
- [ ] Audience: [Target]
- [ ] Purpose: [Purpose]
- [ ] Estimated duration: [X seconds]
- [ ] Test data prepared
- [ ] Scenario approved

### Recording
- [ ] playwright.config.demo.ts used
- [ ] slowMo: [X]ms set
- [ ] Resolution: [WxH]
- [ ] All scenes implemented

### Post-Recording
- [ ] Playback check OK
- [ ] Pacing OK
- [ ] No confidential information
- [ ] Filename: [filename.webm]
- [ ] Size: [X]MB

### Delivery
- [ ] Purpose achieved
- [ ] Scenario document saved
- [ ] Metadata recorded

**Recorded by**: [Name]
**Date**: YYYY-MM-DD
**Version**: v1.0
```

---

## Quality Scorecard

Rate each item 1-5 to calculate total score.

| Category | Item | Score (1-5) |
|----------|------|-------------|
| **Story** | Clear beginning/ending | |
| | Appropriate pacing | |
| | Effective emphasis points | |
| **Visual** | Resolution/quality | |
| | Overlay readability | |
| | Brand consistency | |
| **Technical** | Stability/reproducibility | |
| | Selector robustness | |
| | Error handling | |
| **Data** | Realism | |
| | Confidential info excluded | |
| | | |
| **Total** | | /55 |

### Score Assessment

- **45-55**: Excellent - Ready for delivery
- **35-44**: Good - Deliverable with minor fixes
- **25-34**: Needs improvement - Major issues require fixing
- **< 25**: Reshoot - Review from scenario

---

## Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Operations too fast | Insufficient slowMo | Set slowMo to 700ms or higher |
| Screen changes before next operation | Insufficient wait | Add waitForURL or expect().toBeVisible() |
| Overlay unreadable | Insufficient display time | Set duration to (char count × 100ms) + 500ms |
| Video is choppy | Machine load | Record in headless mode |
| File size too large | Resolution/duration | Lower to 720p, reduce duration |
| Confidential info visible | Insufficient data prep | Use demo-dedicated environment with dummy data |

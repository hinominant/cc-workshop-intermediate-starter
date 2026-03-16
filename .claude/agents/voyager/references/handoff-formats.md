# Voyager Handoff Formats

Standardized handoff templates for agent collaboration.

---

## Input Handoffs (→ Voyager)

### RADAR_TO_VOYAGER_HANDOFF

```markdown
## RADAR_TO_VOYAGER_HANDOFF

**Unit/Integration Coverage**:
| Area | Tests | Coverage |
|------|-------|----------|
| [Module] | [N] | [X%] |

**E2E Test Needed**:
- User journey: [Description]
- Critical path: [Steps]
- Cross-page flows: [pages involved]

**Boundary**:
- Radar: Single function/component tests (completed)
- Voyager: Multi-page user journeys (requested)

**Request**: Create E2E tests for critical user journeys
```

### BUILDER_TO_VOYAGER_HANDOFF

```markdown
## BUILDER_TO_VOYAGER_HANDOFF

**Feature Implemented**: [Description]
**Files Changed**:
| File | Change |
|------|--------|
| [path] | [what changed] |

**User Flows Affected**:
- New flow: [description of new user journey]
- Modified flow: [description of changed journey]

**Test Requirements**:
- Critical path: [steps user takes]
- Error scenarios: [what could go wrong]
- Auth required: [yes/no, which role]

**Request**: Add E2E tests covering new user flows
```

### SCOUT_TO_VOYAGER_HANDOFF

```markdown
## SCOUT_TO_VOYAGER_HANDOFF

**Bug Investigated**: [Bug description]
**Root Cause**: [Root cause analysis]
**Affected User Flow**: [Which journey is broken]

**Reproduction Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**E2E Regression Request**:
- Verify the fix: [What to check in browser]
- Edge cases: [Related scenarios]
- Cross-browser: [Specific browser if relevant]

**Request**: Write E2E regression test preventing this bug from recurring
```

### DIRECTOR_TO_VOYAGER_HANDOFF

```markdown
## DIRECTOR_TO_VOYAGER_HANDOFF

**Demo Scenario Designed**: [Description]
**User Journey**:
1. [Step 1 with expected visual state]
2. [Step 2 with expected visual state]
3. [Step 3 with expected visual state]

**Reuse Opportunity**:
- Page Objects: [can reuse existing or need new]
- Test data: [demo data setup requirements]
- Assertions: [visual + functional checks]

**Request**: Convert demo scenario into repeatable E2E test
```

### FLOW_TO_VOYAGER_HANDOFF

```markdown
## FLOW_TO_VOYAGER_HANDOFF

**Animation Added**: [Description]
**Affected Pages**: [List of pages]

**E2E Considerations**:
- Animation may affect wait strategies
- Use `animations: 'disabled'` for snapshot tests
- Verify functionality still works with reduced motion

**Timing-Sensitive Points**:
- [Element appears after X ms transition]
- [Modal fade-in before interactive]

**Request**: Verify user flows still pass with new animations
```

---

## Output Handoffs (Voyager →)

### VOYAGER_TO_RADAR_HANDOFF

```markdown
## VOYAGER_TO_RADAR_HANDOFF

**E2E Finding**: [What the E2E test revealed]
**Root Cause**: [Function/component level issue]

**Unit Test Needed**:
| Function | Test Case | Priority |
|----------|-----------|----------|
| [name] | [scenario] | [High/Med/Low] |

**Boundary**:
- Voyager: Detected issue via user flow (slow to test)
- Radar: Function-level testing needed (fast, thorough)

**Request**: Add unit tests for edge cases discovered during E2E testing
```

### VOYAGER_TO_SCOUT_HANDOFF

```markdown
## VOYAGER_TO_SCOUT_HANDOFF

**Flaky Test**: [test file] > [test name]
**Symptoms**: Fails ~[X]% of runs with [error type]
**Environment**: [CI only / Local too]

**Evidence Provided**:
- Failed test videos: [count]
- Network timing logs: [available?]
- CI environment details: [OS, Node version]

**Suspected Cause**: [Race condition / timing / state leak]

**Request**: Investigate root cause of intermittent E2E failure
```

### VOYAGER_TO_GEAR_HANDOFF

```markdown
## VOYAGER_TO_GEAR_HANDOFF

**E2E Infrastructure Need**: [Description]

**Current State**:
| Setting | Value | Issue |
|---------|-------|-------|
| [config] | [value] | [problem] |

**Requirements**:
- Browser installation: [chromium, firefox, webkit]
- Parallel execution: [N shards]
- Artifact storage: [reports, videos, traces]
- Notifications: [Slack, PR comment]

**Config Files**: playwright.config.ts ready

**Request**: Set up CI pipeline for E2E test execution
```

### VOYAGER_TO_JUDGE_HANDOFF

```markdown
## VOYAGER_TO_JUDGE_HANDOFF

**E2E Tests Written**: [Count and description]
**Files Changed**:
| File | Tests Added | Type |
|------|-------------|------|
| [path] | [N] | [smoke/critical/regression] |

**Review Focus Areas**:
- Page Object design: [appropriate abstraction?]
- Wait strategy: [correct waits used?]
- Test isolation: [no shared state?]
- Selector stability: [data-testid usage?]

**Request**: Review E2E test quality and patterns
```

### VOYAGER_TO_NAVIGATOR_HANDOFF

```markdown
## VOYAGER_TO_NAVIGATOR_HANDOFF

**E2E Preparation Task**: [Description]

**Browser Task**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Output**: [File/data to produce]
**Output Path**: [Where to save]

**Why Navigator**: This is a one-time browser task, not a repeatable test

**Request**: Execute browser task to prepare E2E test environment
```

### VOYAGER_TO_PALETTE_HANDOFF

```markdown
## VOYAGER_TO_PALETTE_HANDOFF

**E2E Observation**: [Usability issue found during testing]
**A11y Test Result**: [axe-core findings if any]

**Affected Pages**:
| Page | Issue | Impact |
|------|-------|--------|
| [path] | [description] | [critical/serious/moderate] |

**Evidence**:
- Screenshots: [attached?]
- axe-core report: [violations]
- Keyboard navigation: [issues found]

**Request**: Review and improve UX/accessibility based on E2E findings
```

---

## Collaboration Patterns

### Pattern A: Feature E2E Coverage
```
Builder (implementation) → BUILDER_TO_VOYAGER → Voyager (E2E tests) → VOYAGER_TO_JUDGE → Judge (review)
```

### Pattern B: Bug Regression
```
Scout (investigation) → SCOUT_TO_VOYAGER → Voyager (regression E2E) → VOYAGER_TO_RADAR → Radar (unit tests)
```

### Pattern C: Test Level Escalation
```
Radar (unit/integration) → RADAR_TO_VOYAGER → Voyager (E2E tests) → VOYAGER_TO_GEAR → Gear (CI setup)
```

### Pattern D: Flaky Investigation
```
Voyager (flaky detected) → VOYAGER_TO_SCOUT → Scout (root cause) → Voyager (fix applied)
```

### Pattern E: Demo to Test
```
Director (demo scenario) → DIRECTOR_TO_VOYAGER → Voyager (E2E test) → VOYAGER_TO_JUDGE → Judge (review)
```

### Pattern F: A11y Discovery
```
Voyager (a11y test) → VOYAGER_TO_PALETTE → Palette (UX fix) → Voyager (re-verify)
```

### Pattern G: Animation Safety
```
Flow (animation) → FLOW_TO_VOYAGER → Voyager (verify flows) → VOYAGER_TO_RADAR → Radar (unit tests)
```

### Pattern H: Full Pipeline
```
Builder → Voyager (E2E) → VOYAGER_TO_GEAR → Gear (CI) → Voyager (verify pipeline)
```

### Pattern I: Performance Optimization
```
Voyager (performance measurement) → VOYAGER_TO_BOLT → Bolt (code optimization) → Voyager (re-verify)
```

---

## Performance Handoff

### VOYAGER_TO_BOLT_HANDOFF

```markdown
## VOYAGER_TO_BOLT_HANDOFF

**Performance Issue Detected**: [Description]

**Metrics**:
| Metric | Measured | Target | Status |
|--------|----------|--------|--------|
| LCP | [value] | ≤ 2.5s | [PASS/FAIL] |
| CLS | [value] | ≤ 0.1 | [PASS/FAIL] |
| INP | [value] | ≤ 200ms | [PASS/FAIL] |
| TTFB | [value] | ≤ 800ms | [PASS/FAIL] |
| Bundle Size | [value] | ≤ [budget] | [PASS/FAIL] |

**Affected Pages**:
| Page | Metric | Measured | Evidence |
|------|--------|----------|----------|
| [path] | [metric] | [value] | [trace/screenshot link] |

**Boundary**:
- Voyager: Measured and identified the issue (E2E context)
- Bolt: Code-level optimization needed (bundle splitting, lazy loading, etc.)

**Evidence Attached**:
- Lighthouse report: [path]
- Trace file: [path]
- HAR file: [path if relevant]

**Request**: Optimize code to meet performance budget targets
```

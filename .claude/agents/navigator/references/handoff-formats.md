# Navigator Agent Handoff Formats

Standardized handoff templates for agent collaboration.

---

## SCOUT_TO_NAVIGATOR_HANDOFF

```markdown
## SCOUT_TO_NAVIGATOR_HANDOFF

**Investigation ID**: [ID]
**Bug Title**: [Title]
**Reproduction Request**: [What Navigator should do]

**Target**:
- URL: [URL]
- Environment: [Production / Staging]
- User type: [Admin / Regular / Guest]

**Reproduction Steps**:
1. [Step 1]
2. [Step 2]
3. Bug should occur at: [expected location]

**Evidence Needed**:
- [ ] Screenshot of error state
- [ ] Console errors
- [ ] Network requests/responses
- [ ] Before/after comparison

**Request**: Execute reproduction steps and capture evidence
```

---

## NAVIGATOR_TO_TRIAGE_HANDOFF

```markdown
## NAVIGATOR_TO_TRIAGE_HANDOFF

**Task ID**: [ID]
**Investigation Request**: [From Scout]
**Verification Status**: [Reproduced / Not Reproduced / Partial]

**Execution Summary**:
| Step | Action | Result | Evidence |
|------|--------|--------|----------|
| 1 | [Action] | ✅/❌ | [Screenshot path] |

**Findings**:
- Bug reproduced: [Yes / No / Intermittent]
- Reproduction rate: [X out of Y attempts]
- Additional observations: [Notes]

**Evidence Files**:
- Screenshots: `.navigator/screenshots/investigation_[id]/`
- Console logs: `.navigator/logs/console_[id].log`
- Network HAR: `.navigator/har/investigation_[id].har`

**Request**: Assess incident severity and coordinate response
```

---

## NAVIGATOR_TO_BUILDER_HANDOFF

```markdown
## NAVIGATOR_TO_BUILDER_HANDOFF

**Task ID**: [ID]
**Data Collection**: [Task description]

**Collected Data**:
| Type | Path | Records | Format |
|------|------|---------|--------|
| [Type] | [Path] | [N] | [JSON/CSV] |

**Data Schema** (inferred):
```json
{
  "field1": "type",
  "field2": "type"
}
```

**Validation Results**:
- Total records: [N]
- Valid records: [N]
- Errors: [N]
- Warnings: [N]

**Request**: Process/integrate collected data
```

---

## NAVIGATOR_TO_LENS_HANDOFF

```markdown
## NAVIGATOR_TO_LENS_HANDOFF

**Task ID**: [ID]
**Evidence Collection**: [Purpose]

**Screenshots Captured**:
| Name | Path | Description |
|------|------|-------------|
| [Name] | [Path] | [What it shows] |

**Request**: Generate evidence report / Create comparison
```

---

## NAVIGATOR_TO_BOLT_HANDOFF

```markdown
## NAVIGATOR_TO_BOLT_HANDOFF

**Task ID**: [ID]
**Performance Investigation**: [Task]

**Metrics Collected**:
| Metric | Value | Baseline |
|--------|-------|----------|
| FCP | [X ms] | [Y ms] |
| LCP | [X ms] | [Y ms] |
| TTI | [X ms] | [Y ms] |

**Network Summary**:
- Total requests: [N]
- Total size: [X MB]
- Slowest requests: [List]

**HAR File**: `.navigator/har/performance_[id].har`

**Request**: Analyze performance data and recommend optimizations
```

---

## TRIAGE_TO_NAVIGATOR_HANDOFF

```markdown
## TRIAGE_TO_NAVIGATOR_HANDOFF

**Incident ID**: INC-YYYY-NNNN
**Severity**: SEV[1-4]
**Verification Request**: [What to verify]

**Current Status**:
- Issue: [Description]
- Affected URL: [URL]
- Reported symptoms: [Symptoms]

**Verification Steps**:
1. [Step to perform]
2. [Step to perform]

**Expected Result**: [What indicates issue is resolved]

**Request**: Verify issue resolution and capture evidence
```

---

## VOYAGER_TO_NAVIGATOR_HANDOFF

```markdown
## VOYAGER_TO_NAVIGATOR_HANDOFF

**E2E Test**: [Test name]
**Task Conversion**: [Why converting from test to task]

**Original Test Purpose**:
- Flow: [User journey being tested]
- Assertions: [What was being verified]

**Task Requirements**:
- Perform flow: [Yes / No]
- Collect data: [What data]
- Capture evidence: [What evidence]

**Page Objects Available**:
- [PageObject1]: [Path]
- [PageObject2]: [Path]

**Request**: Execute flow as task and collect specified data
```

---

## COLLABORATION PATTERNS

Navigator participates in 6 primary collaboration patterns:

| Pattern | Name | Flow | Purpose |
|---------|------|------|---------|
| **A** | Debug Investigation | Scout → Navigator → Triage | Bug reproduction and evidence collection |
| **B** | Data Collection | Navigator → Builder/Schema | Collect and process web data |
| **C** | Visual Evidence | Navigator → Lens → Canvas | Capture and document visual evidence |
| **D** | Performance Analysis | Navigator → Bolt/Tuner | Collect and analyze performance data |
| **E** | E2E to Task | Voyager → Navigator | Convert test scenarios to task execution |
| **F** | Security Validation | Sentinel → Navigator → Probe | Verify security measures in browser |

### Pattern A: Debug Investigation

```
Scout receives bug report
    ↓
Scout investigates code, identifies reproduction steps
    ↓
Scout → SCOUT_TO_NAVIGATOR_HANDOFF → Navigator
    ↓
Navigator executes reproduction steps
    ↓
Navigator captures evidence (screenshots, logs, HAR)
    ↓
Navigator → NAVIGATOR_TO_TRIAGE_HANDOFF → Triage
    ↓
Triage assesses severity and coordinates response
```

### Pattern B: Data Collection

```
User requests data collection task
    ↓
Nexus → Navigator
    ↓
Navigator executes RECON → PLAN → EXECUTE → COLLECT → REPORT
    ↓
Navigator → NAVIGATOR_TO_BUILDER_HANDOFF → Builder
    ↓
Builder processes/transforms collected data
    ↓
(Optional) Builder → Schema for data modeling
```

### Pattern C: Visual Evidence

```
Evidence collection required (for investigation, documentation)
    ↓
[Agent] → Navigator
    ↓
Navigator captures screenshots at key states
    ↓
Navigator → NAVIGATOR_TO_LENS_HANDOFF → Lens
    ↓
Lens generates comparison/report
    ↓
(Optional) Lens → Canvas for diagram generation
```

### Pattern D: Performance Analysis

```
Performance investigation needed
    ↓
Navigator collects performance metrics (FCP, LCP, TTI)
    ↓
Navigator captures HAR file
    ↓
Navigator → NAVIGATOR_TO_BOLT_HANDOFF → Bolt
    ↓
Bolt analyzes and recommends optimizations
    ↓
(Optional) Bolt → Tuner for database query analysis
```

### Pattern E: E2E to Task

```
Voyager has E2E test that needs one-time execution
    ↓
Voyager → VOYAGER_TO_NAVIGATOR_HANDOFF → Navigator
    ↓
Navigator executes flow as task (not test)
    ↓
Navigator collects data/evidence
    ↓
Navigator reports task completion (not test results)
```

### Pattern F: Security Validation

```
Sentinel identifies security requirement
    ↓
Sentinel → Navigator (validation request)
    ↓
Navigator tests security in browser context:
  - Auth flow validation
  - Session handling
  - CORS behavior
  - Cookie attributes
    ↓
Navigator → Probe for dynamic security testing
    ↓
Probe validates findings with security tools
```

---

## NAVIGATOR_TO_ECHO_HANDOFF

Handoff format for passing screenshot collection results to Echo for Visual Review.

```markdown
## NAVIGATOR_TO_ECHO_HANDOFF

**Task ID**: [ID]
**Review Purpose**: [Visual UX Review / Accessibility Audit / Competitor Comparison]

**Screenshots Captured**:
| # | Path | Page State | Context |
|---|------|------------|---------|
| 1 | `.navigator/screenshots/[id]/01_landing.png` | Initial load | Homepage after navigation |
| 2 | `.navigator/screenshots/[id]/02_form.png` | Form visible | After clicking signup |
| 3 | `.navigator/screenshots/[id]/03_error.png` | Error state | After invalid submission |

**Device Context**:
| Attribute | Value |
|-----------|-------|
| Viewport | 390x844 (iPhone 14 Pro) |
| Browser | Chrome Mobile |
| Connection | 4G (simulated) |
| Pixel Ratio | 3x |

**Flow Information**:
- URL: [Target URL]
- Journey: [Flow description - e.g., "First-time signup flow"]
- Actions Performed: [List of actions taken before each screenshot]

**Recommended Personas**:
- Primary: [Most relevant persona - e.g., "Mobile User"]
- Secondary: [Additional personas to consider]

**Request**: Perform Visual Persona Review on captured screenshots
```

---

## Collaboration Pattern G: Visual Review

```
User requests visual UX review
    ↓
Navigator captures screenshots at key states:
  - Initial load
  - Interaction states
  - Error/success states
  - Different viewport sizes
    ↓
Navigator → NAVIGATOR_TO_ECHO_HANDOFF → Echo
    ↓
Echo performs Visual Persona Review:
  - First Glance analysis (0-3 sec)
  - Scan pattern simulation
  - Visual emotion scoring
  - Friction detection
    ↓
Echo → Canvas for Journey visualization
    ↓
Canvas generates Visual Journey Map with screenshots
```

### Screenshot Capture Guidelines for Visual Review

When capturing screenshots for Echo visual review:

1. **Capture Key States**
   - Initial page load (before any interaction)
   - After primary CTA interaction
   - Form states (empty, filled, error, success)
   - Loading states if visible
   - Modal/overlay states

2. **Device Variations**
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (390x844)

3. **Context Documentation**
   - Note user actions leading to each state
   - Record timing (page load, interaction delay)
   - Capture browser console for any errors

4. **File Organization**
   ```
   .navigator/screenshots/visual-review-[id]/
   ├── desktop/
   │   ├── 01_landing.png
   │   ├── 02_signup_form.png
   │   └── 03_success.png
   ├── mobile/
   │   ├── 01_landing.png
   │   ├── 02_signup_form.png
   │   └── 03_success.png
   └── manifest.json  # Screenshot metadata
   ```

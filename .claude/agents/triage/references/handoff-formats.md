# Triage Handoff Formats Reference

Standardized handoff formats for agent collaboration.

## TRIAGE_TO_SCOUT_HANDOFF

```markdown
## TRIAGE_TO_SCOUT_HANDOFF

**Incident ID**: INC-YYYY-NNNN
**Severity**: SEV[1-4]
**Status**: Investigating
**Time Pressure**: [Critical / High / Normal]

**Symptoms**:
| Time (UTC) | Symptom | Evidence |
|------------|---------|----------|
| HH:MM | [Symptom 1] | [Log/metric] |
| HH:MM | [Symptom 2] | [Log/metric] |

**Error Details**:
- Error messages: [Exact text]
- Affected endpoint: [URL/API]
- Error rate: [X% of requests]

**Timeline**:
| Time | Event |
|------|-------|
| HH:MM | [First symptom] |
| HH:MM | [Incident detected] |

**Initial Hypotheses**:
1. [Hypothesis 1] - Evidence: [for/against]
2. [Hypothesis 2] - Evidence: [for/against]

**Requested Analysis**:
- Root cause identification
- Contributing factors
- Specific files/code responsible
- Recommended fix approach

**Request**: Investigate and provide root cause analysis
```

---

## SCOUT_TO_TRIAGE_HANDOFF

```markdown
## SCOUT_TO_TRIAGE_HANDOFF

**Incident ID**: INC-YYYY-NNNN
**Investigation Status**: Complete

**Root Cause**:
| Aspect | Detail |
|--------|--------|
| Location | `src/path/file.ts:123` |
| Function | `functionName()` |
| Issue | [What is wrong] |
| Trigger | [What caused it to fail] |

**Contributing Factors**:
1. [Factor 1]
2. [Factor 2]

**Recommended Fix**:
| Approach | Risk | Time Estimate |
|----------|------|---------------|
| Hotfix | Low | [X min] |
| Proper fix | Medium | [X hours] |

**Files to Modify**:
| File | Change Required |
|------|-----------------|
| [file1] | [change] |

**Request**: Coordinate fix implementation with Builder
```

---

## TRIAGE_TO_BUILDER_HANDOFF

```markdown
## TRIAGE_TO_BUILDER_HANDOFF

**Incident ID**: INC-YYYY-NNNN
**Severity**: SEV[1-4]
**Status**: Root cause identified, fix needed

**Root Cause** (from Scout):
| Aspect | Detail |
|--------|--------|
| Location | `src/path/file.ts:123` |
| Issue | [Description] |

**Fix Requirements**:
| Type | Required | Description |
|------|----------|-------------|
| Hotfix | [Yes/No] | Minimal change for immediate relief |
| Proper fix | [Yes/No] | Complete solution |

**Constraints**:
- Time pressure: [Critical / High / Normal]
- Testing: [Full suite / Smoke test / Critical path only]
- Rollback plan: [In place / Needs creation]

**Acceptance Criteria**:
- [ ] Error rate returns to baseline
- [ ] Affected users can complete flows
- [ ] No new errors introduced

**Request**: Implement fix and deploy to production
```

---

## BUILDER_TO_TRIAGE_HANDOFF

```markdown
## BUILDER_TO_TRIAGE_HANDOFF

**Incident ID**: INC-YYYY-NNNN
**Fix Status**: Implemented / Deployed

**Changes Applied**:
| File | Change | Commit |
|------|--------|--------|
| [file1] | [change] | [hash] |

**Deployment**:
- Deployed at: [HH:MM UTC]
- Environment: Production
- Version: [version]

**Verification Needed**:
- [ ] Error rate monitoring
- [ ] User flow verification
- [ ] Regression check

**Rollback Plan**:
- Command: [rollback command]
- Previous version: [version]

**Request**: Verify fix and coordinate Radar testing
```

---

## TRIAGE_TO_RADAR_HANDOFF

```markdown
## TRIAGE_TO_RADAR_HANDOFF

**Incident ID**: INC-YYYY-NNNN
**Fix Applied**: [commit hash or PR]
**Deployed At**: [HH:MM UTC]

**Verification Needed**:
| Area | Test Type | Priority |
|------|-----------|----------|
| Affected functionality | Smoke test | Critical |
| Related areas | Regression | High |
| Edge cases | Edge case test | High |

**Test Scenarios**:
1. [Scenario that triggered incident]
2. [Related happy path scenarios]
3. [Negative test - ensure fix is complete]

**Success Criteria**:
- All critical tests pass
- No new failures introduced
- Coverage maintained

**Request**: Execute verification tests and report results
```

---

## RADAR_TO_TRIAGE_HANDOFF

```markdown
## RADAR_TO_TRIAGE_HANDOFF

**Incident ID**: INC-YYYY-NNNN
**Verification Status**: [Pass / Fail / Partial]

**Test Results**:
| Test Suite | Status | Details |
|------------|--------|---------|
| Smoke tests | ✅/❌ | [details] |
| Regression | ✅/❌ | [details] |
| Edge cases | ✅/❌ | [details] |

**Coverage**:
- Before: [X%]
- After: [X%]

**Issues Found**: [None / List]

**Recommendation**:
- [ ] Safe to close incident
- [ ] Additional fixes needed
- [ ] Extended monitoring recommended

**Request**: [Close incident / Continue investigation]
```

---

## TRIAGE_TO_LENS_HANDOFF

```markdown
## TRIAGE_TO_LENS_HANDOFF

**Incident ID**: INC-YYYY-NNNN
**Severity**: SEV[1-4]
**Phase**: [Active / Resolved]

**Evidence Needed**:
| Type | Description | Priority |
|------|-------------|----------|
| Dashboard | Current error state | High |
| Logs | Error logs around [time] | High |
| User flow | Affected user journey | Medium |
| Before/After | Comparison when resolved | Medium |

**Output Location**: `.evidence/incidents/INC-YYYY-NNNN/`

**Request**: Capture evidence for postmortem documentation
```

---

## TRIAGE_TO_SENTINEL_HANDOFF

```markdown
## TRIAGE_TO_SENTINEL_HANDOFF

**Incident ID**: INC-YYYY-NNNN
**Security Concern**: [Type - breach / vulnerability / suspicious activity]

**Incident Summary**:
| Aspect | Detail |
|--------|--------|
| First detected | [HH:MM UTC] |
| Potential scope | [users / data / systems] |
| Initial assessment | [description] |

**Security Questions**:
- Is there active exploitation?
- What data may be exposed?
- What systems are at risk?

**Request**: Security assessment and remediation guidance
```

---

## TRIAGE_TO_GEAR_HANDOFF

```markdown
## TRIAGE_TO_GEAR_HANDOFF

**Incident ID**: INC-YYYY-NNNN
**Action Required**: Rollback

**Rollback Details**:
| Aspect | Value |
|--------|-------|
| Current version | [version] |
| Target version | [version] |
| Environment | Production |

**Reason**: [Why rollback is needed]

**Verification After Rollback**:
- [ ] Service health check
- [ ] Error rate baseline
- [ ] Critical path verification

**Request**: Execute rollback and confirm success
```

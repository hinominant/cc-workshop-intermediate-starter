# Compliance Report Templates

## Executive Summary Template

```markdown
# Compliance Assessment Executive Summary

## Overview

| Attribute | Value |
|-----------|-------|
| Assessment Date | YYYY-MM-DD |
| Assessor | Canon (AI Agent) |
| Target | [Project/System Name] |
| Scope | [Description of what was assessed] |
| Standards | [List of standards assessed against] |

## Compliance Status

| Standard | Target Level | Achieved | Status |
|----------|--------------|----------|--------|
| OWASP ASVS | L2 | L1 | ⚠️ Partial |
| WCAG 2.1 | AA | A | ⚠️ Partial |
| OpenAPI 3.1 | Full | Full | ✅ Compliant |

## Risk Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | X | Immediate action required |
| High | X | Address within 1 week |
| Medium | X | Address within 1 month |
| Low | X | Backlog |

## Top Findings

1. **[CRITICAL] [Finding Title]**
   - Standard: [Citation]
   - Impact: [Brief impact description]
   - Recommendation: [Brief recommendation]

2. **[HIGH] [Finding Title]**
   - Standard: [Citation]
   - Impact: [Brief impact description]
   - Recommendation: [Brief recommendation]

## Recommended Next Steps

1. [Immediate priority action]
2. [Short-term improvement]
3. [Long-term roadmap item]

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Assessor | | | |
| Reviewer | | | |
| Approver | | | |
```

---

## Detailed Compliance Report Template

```markdown
# Detailed Compliance Assessment Report

## 1. Introduction

### 1.1 Purpose
This report documents the compliance assessment of [Target] against [Standards].

### 1.2 Scope
**In Scope:**
- [Component/Module 1]
- [Component/Module 2]

**Out of Scope:**
- [Excluded items with justification]

### 1.3 Methodology
- Static code analysis
- Configuration review
- Documentation review
- [Other methods used]

### 1.4 Standards Reference

| Standard | Version | Level |
|----------|---------|-------|
| [Standard 1] | [Version] | [Level/Tier] |

---

## 2. Summary of Findings

### 2.1 Compliance Score

| Category | Requirements | Compliant | Partial | Non-Compliant | N/A |
|----------|--------------|-----------|---------|---------------|-----|
| [Category 1] | X | X | X | X | X |
| [Category 2] | X | X | X | X | X |
| **Total** | X | X | X | X | X |

**Overall Compliance: XX%**

### 2.2 Findings by Severity

```
Critical: █████ X
High:     ████████ X
Medium:   ██████████████ X
Low:      ████████████████████ X
```

---

## 3. Detailed Findings

### Finding: CANON-001

| Attribute | Value |
|-----------|-------|
| ID | CANON-001 |
| Standard | [Standard Name] |
| Requirement | [Requirement title] |
| Citation | [Section/Clause number] |
| Severity | Critical / High / Medium / Low |
| Status | ❌ Non-compliant / ⚠️ Partial / ✅ Compliant |

**Description:**
[Detailed description of the finding]

**Evidence:**
```
File: src/path/to/file.ts:42
Code: [Relevant code snippet]
```

**Impact:**
[Description of potential impact if not addressed]

**Recommendation:**
[Specific steps to achieve compliance]

**Compliant Example:**
```typescript
// Example of compliant implementation
```

**Effort Estimate:** [Low / Medium / High]

**Remediation Agent:** [Builder / Sentinel / Palette / etc.]

---

### Finding: CANON-002
[Repeat structure for each finding]

---

## 4. Exemptions and Exceptions

### 4.1 Documented Exemptions

| Requirement | Exemption Reason | Approved By | Expiry |
|-------------|------------------|-------------|--------|
| [Requirement] | [Reason] | [Name] | [Date] |

### 4.2 Not Applicable Items

| Requirement | Reason N/A |
|-------------|------------|
| [Requirement] | [Why it doesn't apply] |

---

## 5. Remediation Plan

### 5.1 Priority Matrix

| Priority | Finding IDs | Timeline | Owner |
|----------|-------------|----------|-------|
| Immediate | CANON-001, CANON-005 | Within 48 hours | [Team] |
| High | CANON-002, CANON-003 | Within 1 week | [Team] |
| Medium | CANON-004, CANON-006 | Within 1 month | [Team] |
| Low | CANON-007, CANON-008 | Backlog | [Team] |

### 5.2 Resource Requirements

| Activity | Effort | Skills Required |
|----------|--------|-----------------|
| [Activity 1] | X hours | [Skills] |
| [Activity 2] | X hours | [Skills] |

---

## 6. Appendices

### Appendix A: Assessment Checklist
[Full checklist used during assessment]

### Appendix B: Tool Output
[Raw output from automated tools]

### Appendix C: Evidence Archive
[References to stored evidence]

---

## 7. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | Canon | Initial assessment |
```

---

## Finding Template (Single Finding)

```markdown
## Finding: [ID]

### Basic Information

| Field | Value |
|-------|-------|
| **ID** | CANON-XXX |
| **Title** | [Short descriptive title] |
| **Standard** | [Standard name and version] |
| **Requirement** | [Requirement ID/name] |
| **Citation** | [Exact section, clause, or criterion] |
| **Severity** | Critical / High / Medium / Low / Info |
| **Status** | ❌ Non-compliant / ⚠️ Partial / ✅ Compliant |
| **Category** | Security / Accessibility / API / Quality |

### Finding Details

**Issue Description:**
[Clear description of what was found]

**Evidence Location:**
- File: `src/path/file.ts:42-50`
- Component: `ComponentName`
- Configuration: `config/settings.json`

**Evidence Code:**
```typescript
// Non-compliant code example
```

**Standard Requirement (Quote):**
> [Exact quote from the standard]

### Impact Assessment

**Technical Impact:**
[What could go wrong technically]

**Business Impact:**
[Business/user consequences]

**Likelihood:** High / Medium / Low

**Risk Level:** Critical / High / Medium / Low

### Remediation

**Recommendation:**
[Specific steps to fix]

**Compliant Implementation:**
```typescript
// Example of compliant code
```

**Acceptance Criteria:**
- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]

**Estimated Effort:** Low (< 2h) / Medium (2-8h) / High (> 8h)

**Remediation Agent:** Builder / Sentinel / Palette / Gateway

### Verification

**How to Verify:**
1. [Verification step 1]
2. [Verification step 2]

**Automated Test:**
```bash
# Command to verify compliance
```

### References

- [Link to standard documentation]
- [Link to implementation guide]
- [Link to related findings]
```

---

## Compliance Tracking Template

```markdown
# Compliance Tracking: [Standard Name]

## Status Dashboard

| Category | Total | ✅ | ⚠️ | ❌ | ➖ | Progress |
|----------|-------|-----|-----|-----|-----|----------|
| Authentication | 10 | 6 | 2 | 1 | 1 | 70% |
| Access Control | 8 | 5 | 2 | 1 | 0 | 75% |
| Input Validation | 12 | 8 | 3 | 1 | 0 | 83% |
| **Overall** | 30 | 19 | 7 | 3 | 1 | **76%** |

## Detailed Status

### Category: [Category Name]

| ID | Requirement | Status | Finding | Owner | Due |
|----|-------------|--------|---------|-------|-----|
| REQ-001 | [Requirement] | ✅ | - | - | - |
| REQ-002 | [Requirement] | ⚠️ | CANON-001 | [Name] | YYYY-MM-DD |
| REQ-003 | [Requirement] | ❌ | CANON-002 | [Name] | YYYY-MM-DD |

## Open Findings

| Finding | Severity | Requirement | Status | Owner | Due |
|---------|----------|-------------|--------|-------|-----|
| CANON-001 | High | REQ-002 | In Progress | [Name] | YYYY-MM-DD |
| CANON-002 | Critical | REQ-003 | Open | [Name] | YYYY-MM-DD |

## Progress History

| Date | Compliance % | Notes |
|------|--------------|-------|
| YYYY-MM-DD | 50% | Initial assessment |
| YYYY-MM-DD | 65% | CANON-003, CANON-004 resolved |
| YYYY-MM-DD | 76% | CANON-005 resolved |

## Next Actions

1. [ ] [Action 1] - Due: YYYY-MM-DD - Owner: [Name]
2. [ ] [Action 2] - Due: YYYY-MM-DD - Owner: [Name]
```

---

## Quick Audit Checklist Template

```markdown
# Quick Compliance Checklist: [Standard]

## Assessment Information
- **Date:** YYYY-MM-DD
- **Target:** [Project/Component]
- **Assessor:** Canon
- **Standard:** [Standard and version]
- **Level:** [Target compliance level]

## Checklist

### [Category 1]

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 1.1 | [Requirement description] | ✅ / ⚠️ / ❌ / ➖ | |
| 1.2 | [Requirement description] | ✅ / ⚠️ / ❌ / ➖ | |

### [Category 2]

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 2.1 | [Requirement description] | ✅ / ⚠️ / ❌ / ➖ | |
| 2.2 | [Requirement description] | ✅ / ⚠️ / ❌ / ➖ | |

## Summary

| Metric | Value |
|--------|-------|
| Total Requirements | X |
| Compliant (✅) | X |
| Partial (⚠️) | X |
| Non-Compliant (❌) | X |
| Not Applicable (➖) | X |
| **Compliance Rate** | XX% |

## Critical Issues (Immediate Action Required)

1. [Issue 1] - REQ X.X
2. [Issue 2] - REQ X.X

## Next Steps

1. [Next step 1]
2. [Next step 2]
```

---

## Handoff Templates

### Canon → Builder (Implementation)

```markdown
## Canon → Builder Handoff

### Compliance Finding Summary

| Field | Value |
|-------|-------|
| Finding ID | CANON-XXX |
| Standard | [Standard name] |
| Citation | [Section number] |
| Severity | [Critical/High/Medium/Low] |
| Deadline | YYYY-MM-DD |

### Current State

**Location:** `path/to/file.ts:42`

**Current Code:**
```typescript
// Non-compliant implementation
```

**Issue:** [What's wrong]

### Required Change

**Standard Requirement:**
> [Quote from standard]

**Implementation Guidance:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Compliant Example:**
```typescript
// Example implementation that meets the standard
```

### Acceptance Criteria

- [ ] [Criterion 1 - specific and testable]
- [ ] [Criterion 2 - specific and testable]
- [ ] Standard requirement [citation] is satisfied

### Verification Steps

After implementation:
1. Run: `[command]`
2. Verify: [what to check]
3. Expected result: [what success looks like]
```

### Canon → Scribe (Documentation)

```markdown
## Canon → Scribe Handoff

### Documentation Request

| Field | Value |
|-------|-------|
| Purpose | Compliance documentation |
| Standards | [List of standards] |
| Audience | [Internal / External / Auditor] |

### Required Documents

1. **Compliance Summary**
   - Overall compliance status
   - Key findings summary
   - Remediation progress

2. **Evidence Collection**
   - Screenshots/logs of passing tests
   - Configuration snapshots
   - Code review records

3. **Process Documentation**
   - Assessment methodology used
   - Tools and techniques
   - Review and approval process

### Format Requirements

- Output format: [Markdown / Word / PDF]
- Style guide: [Reference]
- Template: [Template to use]

### Deadline

- Draft due: YYYY-MM-DD
- Final due: YYYY-MM-DD
```

---

## NEXUS Compliance Report Format

```markdown
## NEXUS_HANDOFF

- Step: [X/Y]
- Agent: Canon
- Summary: Compliance assessment completed for [target] against [standards]
- Key findings / decisions:
  - Overall compliance: XX%
  - Critical findings: X
  - High findings: X
  - Standards assessed: [list]
- Artifacts (files/commands/links):
  - Compliance report: [path or content]
  - Finding details: [summary]
- Risks / trade-offs:
  - [Non-compliance risks identified]
  - [Cost of remediation vs risk acceptance]
- Pending Confirmations:
  - Trigger: ON_COMPLIANCE_LEVEL
  - Question: Target compliance level not specified
  - Options: Level A (minimum) | Level AA (standard) | Level AAA (enhanced)
  - Recommended: Level AA
- User Confirmations:
  - Q: Which standard to prioritize? → A: [User's answer]
- Open questions (blocking/non-blocking):
  - [Blocking] Industry-specific regulations applicable?
  - [Non-blocking] Preferred remediation timeline?
- Suggested next agent: Builder (for code fixes) / Sentinel (for security) / Palette (for a11y)
- Next action: CONTINUE (awaiting user confirmation on compliance level)
```

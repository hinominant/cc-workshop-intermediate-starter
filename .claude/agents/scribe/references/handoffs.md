# Handoff Templates

A collection of handoff templates for Scribe when collaborating with other agents.

---

## 1. Scribe → Builder Handoff

Template for requesting implementation after completing PRD/SRS:

```markdown
## Implementation Handoff

### Documents Ready
- [ ] PRD: [link/path]
- [ ] SRS: [link/path]
- [ ] HLD: [link/path]
- [ ] LLD: [link/path]

### Implementation Scope
**Feature:** [Feature Name]

**Priority Requirements:**
1. [P0] REQ-001: [Description]
2. [P0] REQ-002: [Description]
3. [P1] REQ-003: [Description]

**Key Constraints:**
- [Constraint 1]
- [Constraint 2]

**Acceptance Criteria Summary:**
- AC-001: [Criterion]
- AC-002: [Criterion]

### Technical Notes
- Database schema defined in SRS Section 4
- API contracts in SRS Section 5
- Security requirements in SRS Section 6

### Questions/Clarifications
- [Any open items Builder should be aware of]

### Expected Deliverables
1. Working implementation per SRS
2. Unit tests per Test Spec
3. Updated documentation if interfaces change

---

**Handoff by:** Scribe
**Handoff to:** Builder
**Date:** YYYY-MM-DD
```

---

## 2. Scribe → Radar Handoff

Template for requesting test implementation after completing test specification:

```markdown
## Test Implementation Handoff

### Documents Ready
- [ ] Test Specification: [link/path]
- [ ] Related SRS: [link/path]

### Test Scope
**Feature:** [Feature Name]

**Test Cases to Implement:**

| Priority | ID | Title | Type | Automation |
|----------|-----|-------|------|------------|
| P0 | TC-001 | [Title] | Unit | Required |
| P0 | TC-002 | [Title] | Integration | Required |
| P1 | TC-003 | [Title] | Unit | Required |
| P1 | TC-N001 | [Title] | Negative | Required |

**Coverage Targets:**
- Unit test coverage: 80%
- Critical paths: 100%

### Test Data
- Test users defined in Test Spec Section 6.1
- Test data sets in Test Spec Section 6.2
- Setup scripts in Test Spec Section 6.3

### Special Considerations
- [Mocking requirements]
- [Test isolation requirements]
- [Performance test setup]

### Expected Deliverables
1. Implemented test cases per Test Spec
2. Test coverage report
3. Any discovered edge cases documented

---

**Handoff by:** Scribe
**Handoff to:** Radar
**Date:** YYYY-MM-DD
```

---

## 3. Scribe → Voyager Handoff

Template for passing E2E test specifications:

```markdown
## E2E Test Handoff

### Documents Ready
- [ ] Test Specification (E2E section): [link/path]
- [ ] User Stories: [link/path]

### E2E Test Scope
**Feature:** [Feature Name]

**User Journeys to Test:**

1. **Happy Path: [Journey Name]**
   - Start: [Entry point]
   - Steps: [Key steps]
   - End: [Expected outcome]

2. **Alternative Path: [Journey Name]**
   - Start: [Entry point]
   - Steps: [Key steps]
   - End: [Expected outcome]

**Critical Flows (P0):**
| Flow | Description | Related TC |
|------|-------------|------------|
| Login | User authentication | TC-E001 |
| Checkout | Complete purchase | TC-E002 |

### Test Environment
- URL: [staging/test URL]
- Test credentials: [reference to secure location]

### Visual Verification Points
- [ ] [Page/Component]: [Expected appearance]
- [ ] [Page/Component]: [Expected appearance]

### Expected Deliverables
1. Playwright/Cypress test files
2. Page Object definitions
3. Test execution report

---

**Handoff by:** Scribe
**Handoff to:** Voyager
**Date:** YYYY-MM-DD
```

---

## 4. Scribe → Schema Handoff

Template for requesting data model design:

```markdown
## Schema Design Handoff

### Context
- [ ] PRD: [link/path]
- [ ] SRS Data Requirements: [link/path]

### Data Requirements Summary
**Feature:** [Feature Name]

**Entities Needed:**
| Entity | Purpose | Key Fields |
|--------|---------|------------|
| [Entity 1] | [Purpose] | [Fields] |
| [Entity 2] | [Purpose] | [Fields] |

**Relationships:**
- [Entity A] 1--N [Entity B]
- [Entity B] N--M [Entity C]

**Constraints:**
- [Constraint 1]
- [Constraint 2]

**Data Validation Rules:**
| Field | Rule |
|-------|------|
| email | RFC 5322 |
| status | ENUM: active/inactive |

### Performance Considerations
- Expected record volume: [estimate]
- Query patterns: [common queries]
- Index requirements: [known indexes]

### Expected Deliverables
1. ER diagram
2. Migration scripts
3. Updated SRS Data Model section

---

**Handoff by:** Scribe
**Handoff to:** Schema
**Date:** YYYY-MM-DD
```

---

## 5. Scribe → Gateway Handoff

Template for requesting API design:

```markdown
## API Design Handoff

### Context
- [ ] PRD: [link/path]
- [ ] SRS Interface Requirements: [link/path]

### API Requirements Summary
**Feature:** [Feature Name]

**Endpoints Needed:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/v1/[resource] | Create [resource] |
| GET | /api/v1/[resource]/:id | Get [resource] |
| PUT | /api/v1/[resource]/:id | Update [resource] |
| DELETE | /api/v1/[resource]/:id | Delete [resource] |

**Authentication:**
- Type: [Bearer/API Key/etc]
- Scope: [Required permissions]

**Request/Response Requirements:**
- See SRS Section 5 for detailed contracts
- Error codes defined in SRS Section 3

### Non-Functional Requirements
- Rate limiting: [spec]
- Response time: [target]
- Versioning strategy: [strategy]

### Expected Deliverables
1. OpenAPI specification
2. API documentation
3. Updated SRS Interface section

---

**Handoff by:** Scribe
**Handoff to:** Gateway
**Date:** YYYY-MM-DD
```

---

## 6. Spark → Scribe Handoff

Template for creating detailed specifications from feature proposals:

```markdown
## Specification Request from Spark

### Feature Proposal
- [ ] RFC/Feature Proposal: [link/path]
- [ ] RICE Score: [score]
- [ ] Priority: [P0/P1/P2]

### Proposal Summary
**Feature:** [Feature Name]

**Problem Statement:**
[From Spark's proposal]

**Proposed Solution:**
[From Spark's proposal]

**Success Metrics:**
| Metric | Target |
|--------|--------|
| [Metric 1] | [Target] |

### Scope Clarification Needed
- [ ] [Question 1]
- [ ] [Question 2]

### Documents to Create
1. [ ] PRD - Product requirements
2. [ ] SRS - Technical specifications
3. [ ] Test Spec - Test cases

### Timeline
- PRD: [target date]
- SRS: [target date]
- Review: [target date]

---

**Handoff by:** Spark
**Handoff to:** Scribe
**Date:** YYYY-MM-DD
```

---

## 7. Scribe → Sherpa Handoff

Template for passing implementation checklist to workflow management:

```markdown
## Workflow Handoff

### Documents Ready
- [ ] Implementation Checklist: [link/path]
- [ ] PRD/SRS: [link/path]

### Epic Breakdown
**Feature:** [Feature Name]

**Phases:**

1. **Phase 1: [Name]**
   - Tasks: [Reference to checklist section]
   - Dependencies: [None/Previous phase]
   - Estimated scope: [S/M/L]

2. **Phase 2: [Name]**
   - Tasks: [Reference to checklist section]
   - Dependencies: Phase 1
   - Estimated scope: [S/M/L]

3. **Phase 3: [Name]**
   - Tasks: [Reference to checklist section]
   - Dependencies: Phase 2
   - Estimated scope: [S/M/L]

### Commit Points
- After Phase 1: [What should be committable]
- After Phase 2: [What should be committable]
- After Phase 3: [What should be committable]

### Risk Points
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

---

**Handoff by:** Scribe
**Handoff to:** Sherpa
**Date:** YYYY-MM-DD
```

---

## Handoff Best Practices

### 1. Completeness Check
```markdown
## Handoff Completeness Checklist

- [ ] All necessary documents are linked
- [ ] Scope is clearly defined
- [ ] Success criteria are documented
- [ ] Unresolved questions are listed
- [ ] Expected deliverables are specified
```

### 2. Providing Context
```markdown
## Context Summary

**Background:**
[Why this work is needed]

**Related Work:**
- [Previous related feature]
- [Dependent system]

**Stakeholders:**
- [Who cares about this]

**Constraints:**
- [Timeline]
- [Technical]
- [Business]
```

### 3. Feedback Loop
```markdown
## Feedback Loop

**Questions during implementation:**
→ Return to Scribe for clarification

**Scope changes discovered:**
→ Scribe updates documents

**Test gaps identified:**
→ Scribe updates Test Spec

**Document Updates Needed:**
| Document | Section | Change Needed |
|----------|---------|---------------|
| [Doc] | [Section] | [Change] |
```

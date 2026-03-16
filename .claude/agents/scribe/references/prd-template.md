# PRD (Product Requirements Document) Template

## Template

```markdown
# PRD: [Feature Name]

## Document Info

| Item | Value |
|------|-------|
| Version | 1.0 |
| Author | [Name] |
| Status | Draft / Review / Approved |
| Created | YYYY-MM-DD |
| Updated | YYYY-MM-DD |
| Reviewers | [Names] |
| Approvers | [Names] |

## Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | [Name] | Initial draft |

---

## 1. Overview

### 1.1 Purpose
[What problem does this feature solve?]

### 1.2 Background
[Why is this feature needed now? What is the context?]

### 1.3 Goals
- [Goal 1]
- [Goal 2]

### 1.4 Non-Goals (Out of Scope)
- [What this feature will NOT do]

### 1.5 Success Metrics
| Metric | Current | Target | Measurement Method |
|--------|---------|--------|-------------------|
| [Metric 1] | [Value] | [Value] | [How to measure] |

---

## 2. User Stories

### 2.1 Target Users
| Persona | Description | Priority |
|---------|-------------|----------|
| [Persona 1] | [Who they are, what they need] | Primary |
| [Persona 2] | [Who they are, what they need] | Secondary |

### 2.2 User Stories

**US-001**: [User Story Title]
```
As a [persona],
I want to [action],
So that [benefit].
```
- Priority: High / Medium / Low
- Acceptance Criteria: See AC-001

**US-002**: [User Story Title]
```
As a [persona],
I want to [action],
So that [benefit].
```
- Priority: High / Medium / Low
- Acceptance Criteria: See AC-002

---

## 3. Functional Requirements

### 3.1 [Feature Area 1]

**REQ-001**: [Requirement Title]
- Description: [Detailed description]
- Input: [What user provides]
- Output: [What system returns]
- Business Rules:
  - [Rule 1]
  - [Rule 2]
- Acceptance Criteria: AC-001
- Priority: Must Have / Should Have / Nice to Have
- Dependencies: [REQ-XXX if any]

**REQ-002**: [Requirement Title]
- Description: [Detailed description]
- Input: [What user provides]
- Output: [What system returns]
- Business Rules:
  - [Rule 1]
- Acceptance Criteria: AC-002
- Priority: Must Have / Should Have / Nice to Have

### 3.2 [Feature Area 2]

**REQ-003**: [Requirement Title]
...

---

## 4. Non-Functional Requirements

### 4.1 Performance
**NFR-001**: Response Time
- API response time < 200ms (p95)
- Page load time < 2s

### 4.2 Security
**NFR-002**: Authentication
- All endpoints require authentication
- JWT token expiry: 24 hours

### 4.3 Scalability
**NFR-003**: Load Capacity
- Support 1000 concurrent users

### 4.4 Availability
**NFR-004**: Uptime
- 99.9% availability

### 4.5 Accessibility
**NFR-005**: WCAG Compliance
- WCAG 2.1 Level AA

---

## 5. Acceptance Criteria

**AC-001**: [Criterion for REQ-001]
```gherkin
Given [precondition]
When [action]
Then [expected result]
And [additional result]
```

**AC-002**: [Criterion for REQ-002]
```gherkin
Given [precondition]
When [action]
Then [expected result]
```

---

## 6. Edge Cases & Error Handling

| ID | Scenario | Expected Behavior | Error Code |
|----|----------|-------------------|------------|
| EC-001 | [Edge case description] | [How to handle] | [Code] |
| EC-002 | [Edge case description] | [How to handle] | [Code] |

---

## 7. UI/UX Requirements

### 7.1 Wireframes
[Link to wireframes or embed images]

### 7.2 UI Specifications
- [UI element 1]: [Specification]
- [UI element 2]: [Specification]

### 7.3 Interaction Flow
1. User does [action 1]
2. System responds with [response 1]
3. User does [action 2]
4. ...

---

## 8. Technical Constraints

### 8.1 Technology Stack
- Frontend: [Framework/Library]
- Backend: [Framework/Library]
- Database: [Database]

### 8.2 Integration Points
| System | Type | Purpose |
|--------|------|---------|
| [System 1] | API | [Purpose] |
| [System 2] | Webhook | [Purpose] |

### 8.3 Data Requirements
- Data retention: [Period]
- Data format: [Format]
- Migration needs: [Yes/No, details]

---

## 9. Dependencies

### 9.1 Internal Dependencies
| Dependency | Owner | Status | ETA |
|------------|-------|--------|-----|
| [Dependency 1] | [Team] | [Status] | [Date] |

### 9.2 External Dependencies
| Dependency | Provider | Status |
|------------|----------|--------|
| [API/Service] | [Provider] | [Status] |

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Mitigation strategy] |
| [Risk 2] | High/Med/Low | High/Med/Low | [Mitigation strategy] |

---

## 11. Timeline

| Phase | Start | End | Deliverables |
|-------|-------|-----|--------------|
| Design | YYYY-MM-DD | YYYY-MM-DD | HLD, LLD |
| Implementation | YYYY-MM-DD | YYYY-MM-DD | Code, Unit Tests |
| Testing | YYYY-MM-DD | YYYY-MM-DD | Test Results |
| Release | YYYY-MM-DD | - | Production Deploy |

---

## 12. Open Questions

| ID | Question | Owner | Status | Answer |
|----|----------|-------|--------|--------|
| Q-001 | [Question] | [Name] | Open/Resolved | [Answer] |

---

## 13. Appendix

### 13.1 Glossary
| Term | Definition |
|------|------------|
| [Term 1] | [Definition] |

### 13.2 References
- [Link to related document 1]
- [Link to related document 2]

### 13.3 Traceability Matrix
| Requirement | Design | Test Case | Code |
|-------------|--------|-----------|------|
| REQ-001 | HLD-3.1 | TC-001 | auth.service.ts |
| REQ-002 | HLD-3.2 | TC-002 | user.service.ts |
```

---

## Quick Template (Minimal)

For smaller features, use this minimal template:

```markdown
# PRD: [Feature Name]

**Version:** 1.0 | **Date:** YYYY-MM-DD | **Author:** [Name]

## Overview
[1-2 paragraphs describing the feature]

## User Story
As a [persona], I want to [action], so that [benefit].

## Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| REQ-001 | [Description] | Must | [Criteria] |
| REQ-002 | [Description] | Should | [Criteria] |

## Edge Cases
- [Edge case 1]: [Handling]
- [Edge case 2]: [Handling]

## Out of Scope
- [Item 1]
- [Item 2]

## Open Questions
- [ ] [Question 1]
- [ ] [Question 2]
```

---

## PRD Quality Checklist

- [ ] All requirements have IDs (REQ-XXX)
- [ ] All requirements have acceptance criteria
- [ ] Priority is clearly specified
- [ ] Out of scope is clearly defined
- [ ] Non-functional requirements are included
- [ ] Edge cases are considered
- [ ] Dependencies are identified
- [ ] Risks are evaluated

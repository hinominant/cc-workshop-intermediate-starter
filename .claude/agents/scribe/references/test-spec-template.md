# Test Specification Template

## Template

```markdown
# Test Specification: [Feature Name]

## Document Info

| Item | Value |
|------|-------|
| Version | 1.0 |
| Author | [Name] |
| Status | Draft / Review / Approved |
| Created | YYYY-MM-DD |
| Updated | YYYY-MM-DD |
| Related PRD | PRD-[name] |
| Related SRS | SRS-[name] |

## Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | [Name] | Initial draft |

---

## 1. Test Overview

### 1.1 Purpose
This document specifies the test cases for [feature name].

### 1.2 Scope
- **In Scope:** [What is tested]
- **Out of Scope:** [What is not tested]

### 1.3 Test Strategy
| Test Type | Tool | Coverage Target |
|-----------|------|-----------------|
| Unit Test | Jest/pytest/etc | 80% |
| Integration Test | [Tool] | Critical paths |
| E2E Test | Playwright/Cypress | Happy paths |
| Performance Test | k6/JMeter | NFR targets |

### 1.4 Test Environment
| Environment | Purpose | URL/Access |
|-------------|---------|------------|
| Local | Development | localhost |
| Staging | Integration | staging.example.com |
| Production | Smoke tests only | example.com |

### 1.5 Prerequisites
- [Prerequisite 1]
- [Prerequisite 2]
- Test data prepared (see Section 6)

---

## 2. Test Cases

### 2.1 [Feature Area 1]: [Name]

#### TC-001: [Test Case Title]

| Field | Value |
|-------|-------|
| **ID** | TC-001 |
| **Title** | [Descriptive title] |
| **Priority** | P0 / P1 / P2 |
| **Type** | Functional / Non-Functional / Security |
| **Automation** | Automated / Manual / Semi-automated |
| **Related Requirement** | FR-001, REQ-001 |

**Preconditions:**
- User is logged in
- [Other precondition]

**Test Steps:**
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to [page] | [Page] is displayed |
| 2 | Enter [data] in [field] | Input is accepted |
| 3 | Click [button] | [Action] is performed |
| 4 | Verify [outcome] | [Expected state] |

**Test Data:**
| Input | Value | Notes |
|-------|-------|-------|
| email | test@example.com | Valid email |
| password | Test123! | Valid password |

**Expected Result:**
- [Result 1]
- [Result 2]

**Postconditions:**
- [State after test]

---

#### TC-002: [Test Case Title]

| Field | Value |
|-------|-------|
| **ID** | TC-002 |
| **Title** | [Descriptive title] |
| **Priority** | P0 / P1 / P2 |
| **Type** | Functional |
| **Automation** | Automated |
| **Related Requirement** | FR-002 |

**Preconditions:**
- [Precondition]

**Test Steps:**
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | [Action] | [Result] |
| 2 | [Action] | [Result] |

**Expected Result:**
- [Result]

---

### 2.2 [Feature Area 2]: [Name]

#### TC-003: [Test Case Title]
...

---

## 3. Negative Test Cases

### TC-N001: [Invalid Input Test]

| Field | Value |
|-------|-------|
| **ID** | TC-N001 |
| **Title** | Invalid email format validation |
| **Priority** | P1 |
| **Type** | Negative |
| **Related Requirement** | FR-001 |

**Test Steps:**
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter "invalid-email" | Input displayed |
| 2 | Submit form | Validation error shown |
| 3 | Verify error message | "Invalid email format" displayed |

**Expected Result:**
- Form submission is prevented
- User sees clear error message
- Input field is highlighted

---

### TC-N002: [Unauthorized Access Test]
...

---

## 4. Boundary Test Cases

### TC-B001: [Minimum Boundary Test]

| Field | Value |
|-------|-------|
| **ID** | TC-B001 |
| **Title** | Password minimum length |
| **Priority** | P1 |
| **Type** | Boundary |

**Boundary Values:**
| Boundary | Value | Expected Behavior |
|----------|-------|-------------------|
| Below min | 7 chars | Reject |
| At min | 8 chars | Accept |
| At max | 128 chars | Accept |
| Above max | 129 chars | Reject |

---

## 5. Non-Functional Test Cases

### 5.1 Performance Tests

#### TC-P001: Response Time Test

| Field | Value |
|-------|-------|
| **ID** | TC-P001 |
| **Title** | API response time under load |
| **Priority** | P0 |
| **Related NFR** | NFR-P001 |

**Test Configuration:**
- Concurrent users: 100
- Duration: 5 minutes
- Ramp-up: 30 seconds

**Expected Results:**
| Metric | Target | Pass Criteria |
|--------|--------|---------------|
| p50 latency | < 100ms | Must meet |
| p95 latency | < 200ms | Must meet |
| p99 latency | < 500ms | Should meet |
| Error rate | < 0.1% | Must meet |

### 5.2 Security Tests

#### TC-S001: SQL Injection Test

| Field | Value |
|-------|-------|
| **ID** | TC-S001 |
| **Title** | SQL injection prevention |
| **Priority** | P0 |

**Test Payloads:**
```
' OR '1'='1
'; DROP TABLE users; --
1' AND '1'='1
```

**Expected Result:**
- All payloads are safely handled
- No SQL errors exposed
- No data leakage

### 5.3 Accessibility Tests

#### TC-A001: Screen Reader Compatibility

| Field | Value |
|-------|-------|
| **ID** | TC-A001 |
| **Title** | Form labels for screen readers |
| **Standard** | WCAG 2.1 Level AA |

**Verification:**
- [ ] All form fields have labels
- [ ] Error messages are announced
- [ ] Focus order is logical
- [ ] Color is not the only indicator

---

## 6. Test Data

### 6.1 Test Users

| Username | Password | Role | Purpose |
|----------|----------|------|---------|
| test_admin@example.com | Admin123! | Admin | Admin flow tests |
| test_user@example.com | User123! | User | User flow tests |
| test_guest@example.com | Guest123! | Guest | Guest flow tests |

### 6.2 Test Data Sets

#### Valid Data Set
```json
{
  "email": "valid@example.com",
  "password": "ValidPass123!",
  "name": "Test User"
}
```

#### Invalid Data Set
```json
{
  "email": "invalid-email",
  "password": "short",
  "name": ""
}
```

### 6.3 Data Setup Scripts
```sql
-- Insert test users
INSERT INTO users (email, name, role) VALUES
  ('test_admin@example.com', 'Admin User', 'admin'),
  ('test_user@example.com', 'Regular User', 'user');
```

---

## 7. Traceability Matrix

| Requirement | Test Cases | Status |
|-------------|------------|--------|
| FR-001 | TC-001, TC-002, TC-N001 | Ready |
| FR-002 | TC-003, TC-N002 | Ready |
| NFR-P001 | TC-P001 | Ready |
| NFR-S001 | TC-S001 | Ready |

---

## 8. Test Execution

### 8.1 Execution Schedule

| Phase | Test Types | Environment | Trigger |
|-------|------------|-------------|---------|
| CI | Unit, Integration | Local/CI | Every commit |
| Nightly | E2E, Performance | Staging | Daily |
| Release | All | Staging | Pre-release |

### 8.2 Entry Criteria
- [ ] Code freeze complete
- [ ] All unit tests passing
- [ ] Test environment ready
- [ ] Test data prepared

### 8.3 Exit Criteria
- [ ] All P0 test cases pass
- [ ] 95% of P1 test cases pass
- [ ] No open critical bugs
- [ ] Performance targets met

---

## 9. Defect Management

### Severity Definitions
| Severity | Definition | Example |
|----------|------------|---------|
| Critical | System unusable, data loss | Login completely broken |
| Major | Feature broken, workaround exists | Payment fails for specific cards |
| Minor | Cosmetic or minor inconvenience | Typo in error message |

### Bug Report Template
```markdown
**Bug ID:** BUG-XXX
**Title:** [Brief description]
**Severity:** Critical / Major / Minor
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Environment:** [Browser/OS/Version]
**Screenshots:** [Attach if applicable]
```

---

## 10. Appendix

### A. Test Case Status Definitions
| Status | Definition |
|--------|------------|
| Not Run | Test has not been executed |
| Pass | Test completed successfully |
| Fail | Test did not meet expected results |
| Blocked | Test cannot run due to dependency |
| Skipped | Test intentionally not run |

### B. Glossary
| Term | Definition |
|------|------------|
| P0 | Must pass before release |
| P1 | Should pass, may defer with justification |
| P2 | Nice to have, can defer |
```

---

## Quick Test Spec (Minimal)

For smaller features:

```markdown
# Test Spec: [Feature Name]

**Date:** YYYY-MM-DD | **Author:** [Name]

## Test Cases

| ID | Title | Priority | Steps | Expected Result | Status |
|----|-------|----------|-------|-----------------|--------|
| TC-001 | [Title] | P0 | [Steps] | [Result] | Not Run |
| TC-002 | [Title] | P1 | [Steps] | [Result] | Not Run |
| TC-N001 | [Negative] | P1 | [Steps] | [Error shown] | Not Run |

## Test Data
- Valid: [data]
- Invalid: [data]

## Pass Criteria
- All P0 cases pass
- 90% of P1 cases pass
```

---

## Gherkin Format Template

For BDD-style test specifications:

```gherkin
Feature: [Feature Name]
  As a [persona]
  I want to [action]
  So that [benefit]

  Background:
    Given the user is logged in
    And the system is in [state]

  @P0 @smoke
  Scenario: Successful [action]
    Given [precondition]
    When [action]
    Then [expected result]
    And [additional verification]

  @P1
  Scenario: [Another scenario]
    Given [precondition]
    When [action]
    Then [expected result]

  @P1 @negative
  Scenario: Failed [action] with invalid input
    Given [precondition]
    When [invalid action]
    Then [error result]
    And [error message] is displayed

  @P2
  Scenario Outline: [Parameterized test]
    Given [precondition]
    When user enters <input>
    Then result is <expected>

    Examples:
      | input | expected |
      | valid | success  |
      | empty | error    |
      | null  | error    |
```

---

## Test Specification Quality Checklist

- [ ] All test cases have IDs (TC-XXX)
- [ ] All test cases have priority
- [ ] Traceability to requirements exists
- [ ] Preconditions are clear
- [ ] Test steps are reproducible
- [ ] Expected results are verifiable
- [ ] Test data is prepared
- [ ] Negative test cases are included
- [ ] Boundary value tests are included
- [ ] Exit criteria are defined

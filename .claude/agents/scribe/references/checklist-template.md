# Checklist Templates

## Implementation Checklist Template

```markdown
# Implementation Checklist: [Feature Name]

## Document Info

| Item | Value |
|------|-------|
| Feature | [Feature Name] |
| Related PRD | PRD-[name] |
| Related SRS | SRS-[name] |
| Related Design | HLD/LLD-[name] |
| Author | [Name] |
| Created | YYYY-MM-DD |

---

## Pre-Implementation

### Requirements Verification
- [ ] Reviewed all PRD requirements
- [ ] Understood SRS functional requirements
- [ ] Understood acceptance criteria
- [ ] Confirmed out-of-scope items
- [ ] Confirmed dependencies

### Design Verification
- [ ] Understood HLD architecture
- [ ] Reviewed LLD class design
- [ ] Reviewed API interfaces
- [ ] Reviewed data model
- [ ] Reviewed sequence diagrams

### Environment Setup
- [ ] Development environment is set up
- [ ] Required dependencies are installed
- [ ] Can access test environment
- [ ] Have required credentials
- [ ] Created branch

---

## Implementation Phase

### Core Implementation

#### [Component/Module 1]
- [ ] [Task 1.1]: [Description]
- [ ] [Task 1.2]: [Description]
- [ ] [Task 1.3]: [Description]

#### [Component/Module 2]
- [ ] [Task 2.1]: [Description]
- [ ] [Task 2.2]: [Description]

### Data Layer
- [ ] Created database migration
- [ ] Implemented model/entity
- [ ] Implemented repository/DAO
- [ ] Verified indexes

### API Layer
- [ ] Implemented endpoints
- [ ] Implemented request validation
- [ ] Implemented response format
- [ ] Implemented error handling
- [ ] Implemented authentication/authorization

### Business Logic
- [ ] Implemented service layer
- [ ] Implemented business rules
- [ ] Handled edge cases
- [ ] Implemented transaction management

### UI Layer (if applicable)
- [ ] Implemented components
- [ ] Implemented state management
- [ ] Implemented form validation
- [ ] Implemented error display
- [ ] Implemented loading states

---

## Quality Assurance

### Code Quality
- [ ] Code passes lint checks
- [ ] Code passes formatter
- [ ] No type errors (for TypeScript/statically typed languages)
- [ ] Addressed code review comments

### Testing
- [ ] Created unit tests
- [ ] Created integration tests
- [ ] Created E2E tests (if required)
- [ ] All tests pass
- [ ] Met coverage target

### Security
- [ ] Implemented input validation
- [ ] Verified SQL injection protection
- [ ] Verified XSS protection
- [ ] Verified CSRF protection
- [ ] Authentication/authorization works correctly
- [ ] Sensitive information not logged

### Performance
- [ ] No N+1 queries
- [ ] Appropriate indexes configured
- [ ] Cache used appropriately
- [ ] Met performance targets

---

## Pre-Deployment

### Documentation
- [ ] Added code comments
- [ ] Updated API documentation
- [ ] Updated README
- [ ] Recorded change history

### Review & Approval
- [ ] Completed self-review
- [ ] Received code review
- [ ] Addressed review comments
- [ ] Obtained approval

### Deployment Preparation
- [ ] Verified migration scripts
- [ ] Verified rollback procedure
- [ ] Verified environment variables/config
- [ ] Verified deployment procedure

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| Reviewer | | | |
| QA | | | |
| Product Owner | | | |

---

## Notes

[Any additional notes, discovered issues, or follow-up items]

---

## Follow-up Items

| Item | Priority | Owner | Due Date |
|------|----------|-------|----------|
| [Item 1] | High/Med/Low | [Name] | YYYY-MM-DD |
```

---

## Review Checklist Template

```markdown
# Code Review Checklist: [PR/MR Title]

## Review Info

| Item | Value |
|------|-------|
| PR/MR Number | #[number] |
| Author | [Name] |
| Reviewer | [Name] |
| Review Date | YYYY-MM-DD |
| Related Issue | [Issue link] |

---

## Functional Review

### Requirements Compliance
- [ ] Implemented according to requirements
- [ ] Meets acceptance criteria
- [ ] Edge cases are handled
- [ ] Error cases are properly handled

### Business Logic
- [ ] Business rules are correctly implemented
- [ ] Calculation logic is accurate
- [ ] State transitions are correct
- [ ] Data integrity is maintained

---

## Code Quality Review

### Readability
- [ ] Code is easy to understand
- [ ] Variable/function names are appropriate
- [ ] Comments are used appropriately
- [ ] Complex logic has explanations

### Structure
- [ ] Functions/methods are appropriate size
- [ ] Follows single responsibility principle
- [ ] Appropriate abstraction level
- [ ] No duplicate code

### Consistency
- [ ] Follows project conventions
- [ ] Consistent with existing patterns
- [ ] Follows naming conventions
- [ ] Formatting is consistent

---

## Technical Review

### Architecture
- [ ] Conforms to architecture
- [ ] Implemented in appropriate layer
- [ ] Dependency direction is correct
- [ ] Module coupling is appropriate

### Error Handling
- [ ] Exceptions are properly handled
- [ ] Error messages are appropriate
- [ ] Errors are logged
- [ ] Recovery handling exists (if needed)

### Performance
- [ ] No obvious performance issues
- [ ] No N+1 queries
- [ ] No unnecessary loops/calculations
- [ ] No memory leak potential

### Security
- [ ] Input validation exists
- [ ] Injection attack protection exists
- [ ] Authentication/authorization is correct
- [ ] Sensitive information is not exposed

---

## Testing Review

### Test Coverage
- [ ] Unit tests are sufficient
- [ ] Edge cases are tested
- [ ] Error cases are tested
- [ ] Integration tests exist (if needed)

### Test Quality
- [ ] Tests are independent
- [ ] Tests are clear and understandable
- [ ] Mocks are used appropriately
- [ ] Assertions are appropriate

---

## Documentation Review

- [ ] Code comments are appropriate
- [ ] API documentation is updated
- [ ] README is updated (if needed)
- [ ] Changes are described in PR description

---

## Review Result

### Status
- [ ] Approved
- [ ] Request Changes
- [ ] Comment

### Summary

**Good Points:**
- [Good point 1]
- [Good point 2]

**Issues Found:**
| Severity | Location | Issue | Suggestion |
|----------|----------|-------|------------|
| Critical/Major/Minor | file:line | [Issue] | [Suggestion] |

### Comments
[Additional comments]

---

## Sign-off

| Reviewer | Decision | Date |
|----------|----------|------|
| [Name] | Approved/Request Changes | YYYY-MM-DD |
```

---

## Quick Checklist (Minimal)

For smaller changes, use this minimal checklist:

```markdown
# Quick Implementation Checklist: [Feature]

## Before Coding
- [ ] Understood requirements
- [ ] Confirmed impact scope
- [ ] Created branch

## Implementation
- [ ] Implemented feature
- [ ] Added error handling
- [ ] Created tests

## Before PR
- [ ] Lint/Format passes
- [ ] Tests pass
- [ ] Completed self-review
- [ ] Wrote PR description

## Notes
[Any notes]
```

---

## Checklist Quality Guidelines

### Good Checklist Items
- Specific and verifiable
- Corresponds to one action
- Clear completion/incompletion
- Reviewer can make judgment

### Bad Checklist Items (Avoid)
- ❌ "Code is clean" (subjective)
- ❌ "Performance is good" (vague)
- ❌ "Test all cases" (unverifiable)
- ❌ "Implement properly" (unclear)

### Better Alternatives
- ✅ "ESLint errors are 0"
- ✅ "p95 latency is under 200ms"
- ✅ "Tests exist for happy path, error path, boundary values"
- ✅ "Implemented according to SRS FR-001 specification"

# Rewind Handoff Templates

## Incoming Handoffs (Requests to Rewind)

### From Scout (Bug Investigation to History Investigation)

```markdown
## REWIND_HANDOFF (from Scout)

### Bug Information
- **Location**: src/auth/token.ts:142
- **Symptom**: validateToken() returns false
- **Reproduction**: Attempt login with old token

### Historical Questions
- [ ] When was this function changed?
- [ ] When did it last work correctly?
- [ ] What are the related changes?

### Known Context
- Last working: Unknown (before last week's release?)
- Recent changes: Auth refactoring (1 week ago)

### Expected Output
- Identify regression-causing commit
- Explanation of why it broke
- Context information for the fix
```

### From Triage (Incident to Root Cause Investigation)

```markdown
## REWIND_HANDOFF (from Triage)

### Incident Information
- **Occurred**: 2024-01-15 14:30 JST
- **Impact**: 50% increase in login failure rate
- **Detection**: Alert monitoring

### Timeline
- 14:00 - Deployment executed
- 14:30 - Alert fired
- 14:45 - Rollback completed

### Investigation Request
- Identify commits included in deployment
- Identify the commit that caused the problem
- Check history of similar incidents

### Urgency
🔴 High (Production impact ongoing)
```

### From Atlas (Architecture Analysis to History Investigation)

```markdown
## REWIND_HANDOFF (from Atlas)

### Analysis Results
- **Target**: Circular dependency in UserService
- **Problem**: Mutual dependency between AuthModule ↔ UserModule

### History Investigation Request
- When did this dependency start existing?
- Was it intentional design or accidental?
- Were there past attempts to resolve it?

### Expected Output
- Timeline of dependency occurrence
- Background of design decisions
- Suggestions for refactoring
```

---

## Outgoing Handoffs (Handoffs from Rewind)

### To Builder (For Fix Implementation)

```markdown
## BUILDER_HANDOFF (from Rewind)

### Investigation Summary
- **Root Cause Commit**: def5678
- **Author**: developer@example.com
- **Date**: 2024-01-15
- **Confidence**: High (95%)

### Problem Essence
Commit def5678 removed `base64FallbackDecoding`.
This caused users with old format (base64) tokens
to be unable to authenticate.

### Fix Constraints
- **Must maintain**: Performance improvement of new token format
- **Must restore**: Old token compatibility
- **Consider**: Both formats need support during migration period

### Suggested Approaches

1. **Option A: Partial revert (Recommended)**
   - Restore only base64 fallback
   - Maintain other improvements
   - Implementation time: Short

2. **Option B: Add migration path**
   - Auto-update when old token detected
   - More fundamental solution
   - Implementation time: Medium

3. **Option C: Full revert**
   - Revert def5678 entirely
   - Other improvements also lost
   - Recommended only for emergencies

### Related Code
```typescript
// Code removed (before def5678)
function decodeToken(token: string): Payload {
  try {
    return newFormatDecode(token);
  } catch {
    return base64FallbackDecode(token); // This was removed
  }
}
```

### Recommended Test Additions
- Authentication test with old format tokens
- Tests in mixed old/new format environments
- Edge cases during migration

---
**Suggested command**: `/Builder fix token compatibility maintaining performance improvements`
```

### To Scout (For Further Investigation)

```markdown
## SCOUT_HANDOFF (from Rewind)

### Rewind's Investigation Results
- **Causal commit**: def5678 (token handling refactor)
- **Change date**: 2024-01-15
- **Impact scope**: Entire auth module

### Why Further Investigation Needed
Commit has been identified, but it's not clear
why only certain users are affected.

### Investigation Request Items
- [ ] What do affected users have in common?
- [ ] Where does the token format difference originate?
- [ ] Are there other affected features?

### Provided Context
- Changed code: src/auth/token.ts
- Removed feature: base64 fallback
- Related test: token.spec.ts (insufficient)

---
**Suggested command**: `/Scout investigate why only some users affected by token change`
```

### To Guardian (For Commit Strategy)

```markdown
## GUARDIAN_HANDOFF (from Rewind)

### Situation
- **Problem discovered**: Regression in production
- **Cause**: def5678 (auth refactoring)
- **Current state**: Urgent response needed

### Revert Consideration
Impact if reverting def5678:

**What would be lost:**
- Token processing performance improvement (~20% faster)
- Preparation for new token format migration

**What would be preserved:**
- Old token compatibility
- Production stability

### Recommended Actions

1. **Immediate**: Partial revert or emergency fix
2. **After**: Design proper migration path
3. **Future**: Strengthen testing for breaking changes

### Questions for Guardian
- Should we create a partial revert PR?
- What's the commit strategy for emergency fix?
- What about hotfix branch operations?

---
**Suggested command**: `/Guardian plan emergency fix for token regression`
```

### To Canvas (For Visualization)

```markdown
## CANVAS_HANDOFF (from Rewind)

### Visualization Request
- **Type**: Timeline diagram
- **Theme**: Auth module regression investigation

### Timeline Data

```yaml
timeline:
  title: "Token Validation Regression"
  start: "2024-01-10"
  end: "2024-01-20"

  events:
    - date: "2024-01-10"
      commit: "abc1234"
      type: "release"
      label: "v2.3.0 Release"
      note: "Last known good state"

    - date: "2024-01-12"
      commit: "111aaaa"
      type: "feature"
      label: "Add caching layer"

    - date: "2024-01-15"
      commit: "def5678"
      type: "breaking"
      label: "Refactor token handling"
      note: "← ROOT CAUSE"
      highlight: true

    - date: "2024-01-17"
      commit: "222bbbb"
      type: "feature"
      label: "Update dependencies"

    - date: "2024-01-20"
      commit: "xyz9999"
      type: "incident"
      label: "Bug reported"
      note: "Current HEAD"

  annotations:
    - from: "def5678"
      to: "xyz9999"
      label: "Regression period (5 days)"
      style: "warning"
```

### Diagram Requirements
- Vertical timeline
- Highlight breaking commit
- Show commit messages as annotations
- Visually indicate regression period

### Usage
- Attach to incident report
- Postmortem material
- Team sharing

---
**Suggested command**: `/Canvas create timeline diagram from Rewind investigation`
```

### To Sentinel (For Security Investigation)

```markdown
## SENTINEL_HANDOFF (from Rewind)

### Findings
During history investigation, the following security concerns were discovered.

### Concerns

1. **Hardcoded Values Found**
   - Commit: ghi7890 (2023-11-20)
   - File: src/config/secrets.ts
   - Content: Test API keys were committed
   - Still exists in history

2. **Vulnerable Pattern Introduced**
   - Commit: jkl0123 (2023-12-01)
   - File: src/utils/crypto.ts
   - Content: MD5 hash being used

### Recommended Actions
- Consider removing sensitive information from history
- Audit current codebase
- Conduct security review

---
**Suggested command**: `/Sentinel audit findings from Rewind investigation`
```

---

## Nexus Hub Mode Handoff

Standard format when called via Nexus:

```text
## NEXUS_HANDOFF
- Step: 2/4
- Agent: Rewind
- Summary: Identified def5678 as regression cause. Token handling refactoring broke old format compatibility.
- Key findings / decisions:
  - Root cause: def5678 - "Refactor token handling"
  - Confidence: High (bisect + manual verification)
  - Impact: Users with old token format cannot authenticate
- Artifacts:
  - bisect_log.txt (attached)
  - timeline_visualization.md
- Risks / trade-offs:
  - Revert would lose performance improvements
  - Partial fix requires careful testing
- Open questions:
  - (non-blocking) How many users have old format tokens?
- Pending Confirmations: None
- User Confirmations:
  - Q: Okay to start bisect? → A: Yes
- Suggested next agent: Builder (fix implementation)
- Next action: CONTINUE
```

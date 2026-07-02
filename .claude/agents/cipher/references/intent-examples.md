# cipher — 意図解読 事例 (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## Examples

### When Context Speaks

```
User: "Fix auth"

[Gather]
Branch: fix/jwt-refresh
Recent commit: "fix: token expiry" (CI failed)
Error: TokenExpiredError

[Read]
→ JWT refresh timeout issue
→ Goal is to pass CI
→ minimal scope

CIPHER:
  original: "Fix auth"
  intent: "Fix JWT refresh CI failure"
  scope: minimal
  assumptions:
    - "Continuing current branch work"
  context:
    - "TokenExpiredError is the symptom"
  agent: Builder
```

### When to Ask

```
User: "Improve the dashboard"

[Gather]
Recent dashboard work: none
Errors: none
Discussion: none

[Decide]
→ Multiple valid interpretations
→ No safe default
→ Ask

"What aspect should I focus on?"
- Performance
- Features
- UI/UX
- Bug fixes
```

### Reading Frustration

```
User: "Login still doesn't work"

[Read]
"still" = frustrated, tried before
Terse = irritated

[Gather]
This week's fix commits: 4, all login-related

[Decide]
→ Surface fixes have failed
→ Root cause investigation needed
→ "Did you clear cache?" is forbidden

CIPHER:
  original: "Login still doesn't work"
  intent: "Root cause analysis and permanent fix"
  scope: moderate
  assumptions:
    - "Past 4 fixes were ineffective"
  context:
    - "User is frustrated"
    - "Avoid basic suggestions"
  agent: Scout → Builder
```

---


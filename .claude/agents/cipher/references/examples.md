# Examples

## 1. Context Tells Everything

```
User: "Fix auth"

[Gather]
Branch: fix/jwt-refresh
Commit: "fix: token expiry" (CI red)
Error: TokenExpiredError

[Read]
Context is screaming. It's JWT.

CIPHER:
  intent: "Fix JWT refresh CI failure"
  scope: minimal
  agent: Builder
```

---

## 2. When to Ask

```
User: "Improve the dashboard"

[Gather]
Recent work: none
Errors: none
Discussion: none

[Read]
Context is silent. Must ask.

→ "Which aspect?"
   - Performance
   - Features
   - Design
```

---

## 3. Reading Frustration

```
User: "Login still doesn't work"

[Gather]
This week's fixes: 4, all failed

[Read]
"still" = frustrated
4 failures = surface fixes don't work

CIPHER:
  intent: "Root cause investigation and permanent fix"
  scope: moderate
  context:
    - "Past 4 fixes ineffective"
    - "Basic suggestions forbidden"
  agent: Scout → Builder
```

---

## 4. Reading Delegation

```
User: "Handle rate limiting"

[Read]
"Handle" = delegated. Trust given.

[Decide]
- Use Redis (already available)
- 100 req/min (reasonable)
- All API routes

CIPHER:
  intent: "Implement Redis-based rate limiting"
  scope: moderate
  context:
    - "Decision delegated"
    - "Minimize questions"
  agent: Builder
```

---

## 5. Reading Exploration

```
User: "What if we switched to GraphQL?"

[Read]
"What if" = exploring. Wants discussion.

CIPHER:
  intent: "Explore GraphQL migration"
  mode: exploration (don't implement)
  agent: Spark
```

---

## Anti-Patterns

```
❌ "Fix it" → "What should I fix?"
   Check context first.

❌ "Still doesn't work" → "Did you clear cache?"
   Don't insult them.

❌ "Handle it" → "Just to confirm..."
   You were trusted. Act.

❌ "What if..." → Start implementing
   They asked for discussion, not code.
```

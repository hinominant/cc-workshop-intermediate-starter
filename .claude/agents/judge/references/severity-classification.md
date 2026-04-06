# Severity Classification

Standardized severity levels for Judge's code review findings. Every finding must be assigned exactly one severity level.

---

## Severity Levels

### S1 -- CRITICAL / Blocker

**Definition:** Security vulnerability, data loss risk, or crash on a production-critical path. The system will break or be compromised if merged.

**Response:** Must fix before merge. PR is BLOCKED.

| Category | Concrete Example |
|----------|-----------------|
| Security | SQL injection via string concatenation in query: `db.query("SELECT * FROM users WHERE id = " + userId)` |
| Security | Hardcoded API key or database password in source code |
| Security | Authentication bypass: endpoint missing auth middleware |
| Data loss | `DELETE FROM orders` without WHERE clause in migration |
| Data loss | File write that truncates before confirming replacement data is valid |
| Crash | Null dereference on a code path hit by every request (e.g., `req.user.id` without auth check) |
| Crash | Uncaught async exception in request handler causing server restart |
| Logic | Payment amount calculated incorrectly -- users charged wrong amount |
| Logic | Race condition that can double-process a financial transaction |

### S2 -- HIGH

**Definition:** Bug that will visibly affect users, missing error handling on a likely path, or type safety violation that can cause runtime failure.

**Response:** Must fix before merge. PR is REQUEST_CHANGES.

| Category | Concrete Example |
|----------|-----------------|
| Bug | API returns 500 when optional field is missing in request body |
| Bug | Pagination returns duplicate items when data is inserted during traversal |
| Error handling | `catch (e) {}` -- silently swallows errors with no logging |
| Error handling | HTTP client call with no timeout -- can hang indefinitely |
| Type safety | `any` cast that bypasses a critical type check (e.g., `user as any`).role |
| Type safety | Runtime type mismatch: function returns `string | undefined` but caller assumes `string` |
| Logic | Off-by-one in loop causes last item in list to be skipped |
| Logic | Timezone-unaware date comparison produces wrong results across UTC boundary |

### S3 -- MEDIUM

**Definition:** Code smell, missing edge case handling, or inconsistency with codebase patterns. Not immediately broken but creates future risk.

**Response:** Should fix before merge. Negotiable with justification.

| Category | Concrete Example |
|----------|-----------------|
| Edge case | No handling for empty array input -- works but returns misleading result |
| Consistency | Rest of codebase uses repository pattern; this file queries DB directly in controller |
| Consistency | Error responses use `{ error: string }` everywhere except this endpoint which uses `{ message: string }` |
| Code smell | Function takes 7 parameters -- should be an options object |
| Code smell | 150-line function doing 4 distinct things -- should be decomposed |
| Test gap | New branch logic added but no test covers the new path |
| Naming | Boolean named `data` instead of `isValid` or `hasAccess` -- misleads readers |

### S4 -- LOW

**Definition:** Minor improvement to naming, documentation, or style. Does not affect correctness or security.

**Response:** Fix if convenient. Can merge without fixing.

| Category | Concrete Example |
|----------|-----------------|
| Naming | Variable `d` could be `durationMs` for clarity |
| Documentation | Public function missing JSDoc for non-obvious parameter |
| Style | Inconsistent use of single vs double quotes (if no linter enforces it) |
| Cleanup | Commented-out code block left in file |
| Cleanup | `console.log` left from debugging |
| Import | Unused import statement |

### S5 -- NIT

**Definition:** Personal preference, optional micro-improvement. Informational only.

**Response:** Never blocks merge. Author may ignore without discussion.

| Category | Concrete Example |
|----------|-----------------|
| Preference | `forEach` vs `for...of` -- both correct, reviewer prefers one |
| Preference | Ternary vs if/else for simple conditional |
| Suggestion | "You could use `Object.entries()` here" -- works fine as-is |
| Readability | "Adding a blank line before this return would improve readability" |

---

## Response Time Expectations

| Severity | Response SLA | Merge Blocker |
|----------|-------------|---------------|
| S1 | Immediate -- fix required before any further review | Yes (BLOCK) |
| S2 | Same review cycle -- must be addressed before re-review | Yes (REQUEST_CHANGES) |
| S3 | Current PR -- negotiate if author pushes back with justification | Conditional |
| S4 | Best effort -- can be deferred to follow-up PR | No |
| S5 | Optional -- author's discretion | No |

---

## Routing Table

Which agent handles each finding type, by severity:

| Finding Type | S1-S2 Route | S3-S4 Route | Notes |
|-------------|-------------|-------------|-------|
| Implementation bug | Builder | Builder | Builder fixes all logic defects |
| Missing test coverage | Radar | Radar | Radar writes/fixes tests |
| Security vulnerability | Sentinel (SAST scan needed) | Builder (simple fix) | S1 security always goes to Sentinel first |
| Performance regression | Bolt | Bolt | Bolt profiles and optimizes |
| Architecture violation | Architect | Architect (advisory) | S1-S2: mandatory fix. S3-S4: tech debt ticket |
| Type definition error | Builder | Builder | Builder owns type correctness |
| CI/CD config issue | Gear | Gear | Gear owns pipeline definitions |
| PR structure problem | Guardian | Guardian | Guardian owns commit/branch hygiene |
| Database schema issue | Schema | Schema | Schema owns migration correctness |

---

## Escalation Criteria

### Escalate to Architect

- S1/S2 finding reveals a systemic pattern, not just a local bug
- The fix requires changing the architecture, not just the implementation
- Multiple PRs in the same sprint have the same class of issue
- The code is technically correct but the approach will not scale

### Escalate to CEO (Keiji)

- S1 security vulnerability with potential data breach
- Finding contradicts explicit business requirements
- Two agents disagree on severity and evidence is inconclusive
- The issue requires a product decision (feature vs bug)

### Escalate to Nexus

- Findings span multiple agents' domains and need coordinated resolution
- Review reveals scope significantly larger than the PR implies
- Time pressure conflicts with S1/S2 findings -- need prioritization decision

---

## False Positive Handling

Not every suspicious pattern is a real issue. Downgrade severity when:

| Scenario | Action |
|----------|--------|
| Pattern looks like SQL injection but uses parameterized query builder under the hood | Downgrade to S5 note or remove |
| Missing null check but TypeScript strict mode guarantees non-null at this point | Downgrade to S5 or remove |
| Hardcoded string looks like a secret but is a public constant (e.g., OAuth redirect URI) | Downgrade to S4 with note |
| No error handling but caller already wraps in try/catch at a higher level | Downgrade to S4 suggestion |
| Code smell flagged but the pattern is intentional and documented in ADR | Remove finding, acknowledge ADR |

### Before Reporting a Finding

1. Check if the "issue" is handled elsewhere in the call chain
2. Check if TypeScript/ESLint/other tooling already catches this
3. Check if there is an ADR or documented decision explaining the pattern
4. Check if the same pattern exists elsewhere in the codebase (established convention vs deviation)

If after checking, the issue is still valid, report it at the appropriate severity.

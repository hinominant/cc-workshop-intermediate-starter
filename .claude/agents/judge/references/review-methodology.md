# Review Methodology

Judge's systematic code review process. Every review follows this methodology regardless of PR size.

---

## Review Process (5 Phases)

### Phase 1: Context Scan (Always First)

Before reading a single line of code, understand the intent:

1. Read PR description and linked tickets
2. Check `forge-insights.md` if referenced
3. Read any related SPEC or requirement docs
4. Note the scope: which modules/layers are touched
5. Identify the risk profile (new feature / bugfix / refactor / config change)

**Output:** Mental model of what the change should do and why.

If context is missing, log it as an S4 finding and proceed with best available information. Do not guess intent.

### Phase 2: Structural Review

Scan the full diff at a high level:

| Check | What to Look For |
|-------|-----------------|
| File organization | New files in correct directories? Follows existing conventions? |
| Naming consistency | File names, export names match codebase patterns? |
| Import structure | Circular imports? Unused imports? Deep relative paths? |
| Pattern adherence | Uses established patterns (repository pattern, service layer, etc.)? |
| Test files | New logic file has corresponding test file? |
| Config changes | Environment variables documented? Migration scripts included? |

### Phase 3: Logic Review

Read each changed function line by line. For every function, answer:

1. **Inputs/Outputs:** What types flow in and out? Are they validated?
2. **Boundaries:** What happens with null, undefined, empty string, 0, negative, MAX_INT?
3. **Failure modes:** Can this throw? Is the exception caught? What happens downstream?
4. **Side effects:** Does this mutate shared state? Write to DB? Send a message? Call an API?
5. **Concurrency:** Can this run in parallel? Race conditions? Stale reads?

```
// Logic review mental checklist per function:
// [ ] Happy path works
// [ ] Error path is handled
// [ ] Edge cases are covered
// [ ] Return type is consistent (no implicit undefined)
// [ ] Async errors are caught (no unhandled rejection)
```

### Phase 4: Security Review

Apply adversarial thinking to every user-facing change:

- Input validation: Is user input sanitized before use?
- SQL/NoSQL injection: Parameterized queries only?
- XSS: Output encoding on dynamic content?
- Auth/AuthZ: Every endpoint checks both authentication AND authorization?
- Secrets: No hardcoded tokens, keys, or passwords in code or logs?
- CORS/CSP: Headers configured for new endpoints?

See `security-review-checklist.md` for the full checklist.

### Phase 5: Test Review

Evaluate test quality, not just test existence:

| Signal | Good | Bad |
|--------|------|-----|
| Test target | Tests behavior ("should return user by email") | Tests implementation ("should call findOne") |
| Assertions | Specific (`toEqual({ id: 1, name: 'test' })`) | Vague (`toBeTruthy()`) |
| Coverage | Happy + error + edge cases | Happy path only |
| Independence | Each test sets up own state | Tests depend on execution order |
| Tautology | Assertions can fail if code breaks | Assertions pass regardless |

---

## Time-Boxed Review Approach

Not every PR deserves the same depth. Match review effort to risk.

### Quick Review (5 min)

**When:** Config changes, dependency bumps, typo fixes, documentation, formatting.

- Phase 1 (Context): 1 min
- Phase 2 (Structural): 2 min
- Phase 4 (Security): 1 min -- check for accidental secret exposure
- Phase 5 (Report): 1 min

Skip Phase 3 and Phase 5 (Test Review) unless something looks off.

### Standard Review (15 min)

**When:** Single-feature PRs, bugfixes, most day-to-day work. Diff < 300 lines.

- Phase 1 (Context): 2 min
- Phase 2 (Structural): 3 min
- Phase 3 (Logic): 5 min
- Phase 4 (Security): 2 min
- Phase 5 (Test Review): 2 min
- Report: 1 min

### Deep Review (30 min)

**When:** New modules, security-sensitive changes, payment flows, auth changes, data migration, public API changes. Diff > 300 lines or touches > 10 files.

- Phase 1 (Context): 3 min
- Phase 2 (Structural): 5 min
- Phase 3 (Logic): 12 min
- Phase 4 (Security): 5 min
- Phase 5 (Test Review): 3 min
- Report: 2 min

### Oversized PR (> 1000 lines)

Trigger `INTERACTION_TRIGGER: ON_REVIEW_SCOPE`. Propose:
1. Split review into stages (e.g., DB layer first, then API, then UI)
2. Focus on highest-risk files only
3. Request PR be split before review

---

## Review Scope by PR Size

| PR Size | Lines | Focus Areas |
|---------|-------|------------|
| XS | < 50 | Full review, all phases. Quick to do thoroughly. |
| S | 50-150 | All phases. Standard time-box. |
| M | 150-300 | All phases. Prioritize logic and security over style. |
| L | 300-1000 | Deep review. Skip S5 nits entirely. Focus on S1-S3. |
| XL | > 1000 | Request split or stage-based review. Review only critical paths. |

---

## Cognitive Bias Awareness

Reviewers are human (or human-aligned). These biases affect review quality:

### Anchoring Bias
**Trap:** The first issue found colors perception of the entire PR. One bug makes everything look buggy.
**Counter:** Complete all 5 phases before writing findings. Do not stop after first discovery.

### Confirmation Bias
**Trap:** Looking for evidence that confirms an initial suspicion while ignoring contradicting evidence.
**Counter:** For every finding, actively search for counter-evidence. Ask: "Is there a reason this is correct?"

### Bandwagon Bias
**Trap:** Previous reviewers flagged something, so it must be important. Or previous reviewers approved, so it must be fine.
**Counter:** Review the diff independently. Read other reviews only after forming your own conclusions.

### Halo Effect
**Trap:** Trusted author = less scrutiny. Junior author = more scrutiny.
**Counter:** Review the code, not the author. Apply the same checklist regardless of who wrote it.

### Recency Bias
**Trap:** Overweighting the last file reviewed. Forgetting issues found in early files.
**Counter:** Take notes per file during review. Write findings immediately when spotted.

---

## Writing Actionable Review Comments

### SBI Format (Situation-Behavior-Impact)

Every review comment should follow this structure:

1. **Situation:** Where is the issue? (file, line, context)
2. **Behavior:** What specifically is the problem? (observable fact, not opinion)
3. **Impact:** Why does it matter? (what breaks, what risk exists)

### Good vs Bad Review Comments

```markdown
// BAD: Vague, no actionable information
"This doesn't look right."

// BAD: Opinion without evidence
"I wouldn't do it this way."

// BAD: Imperious without explanation
"Fix this."

// GOOD: SBI format with severity
[S2] `src/services/user.ts:42` - `findUser()` does not handle the case
where the database query returns null. If a user is deleted between the
auth check and this query, the next line (`user.name`) throws a TypeError,
returning a 500 to the client. Route to: Builder.

// GOOD: Acknowledging good work
This error handling in `createOrder()` is thorough -- covering both
the payment API timeout and the partial-charge scenario. Well done.

// GOOD: Asking a clarifying question (not a finding)
[Question] `src/api/webhook.ts:88` - This endpoint accepts POST without
CSRF protection. Is this intentional because it's called by an external
service? If so, how is the request authenticated?
```

### Comment Prefixes

| Prefix | Meaning |
|--------|---------|
| `[S1]`-`[S5]` | Finding with severity level |
| `[Question]` | Clarification needed, not a defect |
| `[Praise]` | Acknowledging good work |
| `[Note]` | Informational, not actionable |
| `[Suggestion]` | Optional improvement, equivalent to S5 |

---

## Post-Review Checklist

Before submitting the review report:

- [ ] Every finding has a severity level (S1-S5)
- [ ] Every finding has a file path and line number
- [ ] Every finding has a routing target (Builder/Radar/Sentinel/etc.)
- [ ] No S1 findings exist with an APPROVE verdict
- [ ] No S5 findings exist with a BLOCK verdict
- [ ] At least one positive observation is included (if applicable)
- [ ] The verdict is explicitly stated: APPROVE / REQUEST_CHANGES / BLOCK

# Triage Criteria

Scout's classification system for bug priority, investigation depth, and escalation.

---

## Priority Classification

### P0 -- Outage / Critical

**Definition:** Service down, data loss active, security breach in progress, or core revenue flow completely broken.

**Examples:**
- Production API returning 500 on all requests
- Database corruption causing data loss
- Authentication system down -- no user can log in
- Payment processing charging wrong amounts
- Security breach: unauthorized data access detected
- Background job processing stuck, queue growing unbounded

**Investigation depth:** Full investigation with timeline reconstruction. Drop everything.

| Aspect | Requirement |
|--------|------------|
| Start within | Immediately |
| Status updates | Every 15 minutes |
| Evidence collection | Full (Sentry, logs, metrics, git blame, data state) |
| Timeline reconstruction | Required |
| Blast radius assessment | Required |
| Documentation | Full Investigation Report |

### P1 -- Broken Flow

**Definition:** Core user flow fails for all or most users. Workaround may exist but is not acceptable.

**Examples:**
- User registration fails for users with specific email domains
- Search returns empty results for all queries
- File upload silently fails (no error shown, file not saved)
- Notification system sending duplicates to all users
- Dashboard shows incorrect metrics (all charts show 0)

**Investigation depth:** Full 5-Why analysis. Reproduction steps mandatory.

| Aspect | Requirement |
|--------|------------|
| Start within | 1 hour |
| Status updates | Every 30 minutes |
| Evidence collection | Full |
| Timeline reconstruction | If regression suspected |
| Blast radius assessment | Required |
| Documentation | Full Investigation Report |

### P2 -- Degraded

**Definition:** Feature works incorrectly for some users or some cases. Core flow is functional but degraded.

**Examples:**
- Sort order wrong on one specific column in a table
- Profile image upload fails for images > 5MB (works for smaller)
- Email formatting broken for Japanese characters
- Pagination shows wrong total count but correct page data
- Date picker shows wrong timezone for users in JST

**Investigation depth:** Standard 5-Why analysis. Identify affected population.

| Aspect | Requirement |
|--------|------------|
| Start within | Same day |
| Status updates | Daily |
| Evidence collection | Standard (logs, code, data for affected cases) |
| Timeline reconstruction | Only if intermittent |
| Blast radius assessment | Identify affected user segment |
| Documentation | Standard Investigation Report |

### P3 -- Edge Case

**Definition:** Bug in an uncommon path. Workaround exists. Low user impact.

**Examples:**
- Export to CSV fails when a cell contains a comma in a quoted string
- Tooltip text truncated on screens narrower than 320px
- Browser back button does not restore filter state
- Admin panel sorting breaks when column contains null values
- Error message shows raw error code instead of user-friendly text

**Investigation depth:** Identify root cause and fix location. Reproduction steps optional.

| Aspect | Requirement |
|--------|------------|
| Start within | Next sprint |
| Status updates | On completion |
| Evidence collection | Focused (specific code path and data) |
| Timeline reconstruction | Not required |
| Blast radius assessment | Not required |
| Documentation | Brief report (root cause + fix location) |

---

## Impact Assessment Matrix

Score each dimension 1-3, multiply for total impact score.

### Users Affected

| Score | Criteria |
|-------|---------|
| 3 | All users or a critical user segment (paying customers, admins) |
| 2 | Significant subset (10-50% of users, specific region or plan tier) |
| 1 | Small subset (< 10%, specific edge case, single user report) |

### Severity

| Score | Criteria |
|-------|---------|
| 3 | Data loss, security breach, complete feature failure |
| 2 | Incorrect behavior, degraded experience, misleading output |
| 1 | Cosmetic issue, minor inconvenience, workaround readily available |

### Frequency

| Score | Criteria |
|-------|---------|
| 3 | Every time (deterministic, 100% reproduction rate) |
| 2 | Often (> 10% of attempts, or daily occurrence) |
| 1 | Rarely (specific conditions, hard to reproduce, sporadic) |

### Scoring

| Total Score | Priority |
|-------------|----------|
| 18-27 | P0 |
| 8-17 | P1 |
| 4-7 | P2 |
| 1-3 | P3 |

### Example Scoring

```
Bug: "Payment fails for users with non-ASCII names"
  Users affected: 2 (significant subset -- all non-Latin-name users)
  Severity: 3 (complete feature failure -- cannot pay)
  Frequency: 3 (every time for affected users)
  Total: 2 x 3 x 3 = 18 -> P0
```

```
Bug: "Tooltip truncated on small screens"
  Users affected: 1 (small subset -- very small screens)
  Severity: 1 (cosmetic)
  Frequency: 3 (every time on affected screens)
  Total: 1 x 1 x 3 = 3 -> P3
```

---

## Investigation Depth by Priority

| Priority | Time Budget | Required Deliverables | Optional |
|----------|------------|----------------------|----------|
| P0 | Unlimited until resolved | Full report, timeline, blast radius, post-mortem | -- |
| P1 | Up to 4 hours | Full report, reproduction steps, fix location | Timeline |
| P2 | Up to 2 hours | Root cause, fix location, affected population | Full report |
| P3 | Up to 1 hour | Root cause, fix location | Report |

---

## Escalation Triggers

### Escalate to Triage Agent

| Condition | Action |
|-----------|--------|
| Cannot reproduce after 3 attempts | Escalate with attempted reproduction details |
| Root cause is in third-party dependency | Escalate with dependency details and workaround options |
| Multiple valid root cause hypotheses, evidence inconclusive | Escalate with all hypotheses and evidence for each |
| Bug requires production data access | Escalate to request access through proper channels |
| Investigation exceeds time budget by 2x | Escalate with findings so far and proposed next steps |

### Escalate to Architect

| Condition | Action |
|-----------|--------|
| Root cause is a design-level flaw (not just a code bug) | Report as systemic issue with architectural recommendation |
| Same root cause category found in 3+ bugs within a month | Pattern escalation -- the architecture needs review |

### Escalate to CEO (Keiji)

| Condition | Action |
|-----------|--------|
| P0 security breach with potential data exposure | Immediate escalation with timeline and scope |
| Bug impacts business-critical flow and fix requires product decision | Escalate with options and trade-offs |
| Investigation reveals compliance violation | Escalate immediately |

---

## Bug vs Feature Request vs Design Issue

### Classification Guide

| Signal | Classification | Route |
|--------|---------------|-------|
| "It crashes / returns error / loses data" | Bug | Scout investigates |
| "It works but does not do X" | Feature request | Product decision, not Scout's domain |
| "It does X but I expected Y" | Depends on spec | Check spec: if spec says Y, it's a bug. If spec says X, it's a feature request |
| "It works but the UX is confusing" | Design issue | Vision/Palette agent, not Scout |
| "It works but is slow" | Performance issue | Bolt agent, not Scout |
| "It works in dev but not in prod" | Environment bug | Scout investigates |
| "It used to work but now it doesn't" | Regression | Scout investigates (high priority) |

### Gray Areas

When classification is unclear:
1. Check the specification or acceptance criteria
2. Check if the behavior changed (regression = always a bug)
3. If no spec exists, document the current behavior and escalate for product decision
4. Do not investigate feature requests or design issues -- redirect to the appropriate agent

---

## Regression Detection Signals

A regression is a bug introduced by a recent change. Regressions are always at least P2 because something that worked now does not.

### Signals That Suggest Regression

| Signal | Evidence to Collect |
|--------|-------------------|
| "It used to work" | When did it last work? What was deployed since? |
| Error appeared after a specific deploy | Deployment log with timestamp and commit hash |
| Test that previously passed now fails | CI history showing when the test started failing |
| Behavior change without spec change | Git log on affected files vs spec/ticket history |
| Sentry shows new error type appearing on specific date | Correlate with deployment timeline |

### Regression Investigation Shortcut

1. Identify the last-known-good state (date, commit, or version)
2. Run `git bisect` between good and bad states
3. Read the introducing commit's diff and PR description
4. Report: "Regression introduced by commit X in PR #Y"

This is often faster than full 5-Why analysis for regressions.

# Root Cause Analysis Methodology

Scout's structured approach to tracing symptoms to root causes. Every investigation follows this methodology.

---

## 5-Why Analysis

The core technique. Start from the visible symptom and ask "why" at each level until you reach a structural or design-level cause.

### Rules

1. Each "why" must be backed by evidence (log line, code path, data state)
2. Stop when the answer points to a **design decision or code structure**, not another runtime symptom
3. If a "why" has multiple valid answers, branch and investigate each
4. Typical depth: 3-5 levels. Less than 3 usually means you stopped too early

### Worked Example

```
Symptom: User reports "Order confirmation email not received"

Why 1: Email service returned 202 but email was never sent
  Evidence: Email service logs show accepted but no delivery log entry

Why 2: Email was queued but the queue worker crashed before processing
  Evidence: Worker error log shows OOM kill at 14:32, queue depth increased from 0 to 847

Why 3: Worker memory leak caused by accumulating event listeners on each job
  Evidence: Memory profiler shows listener count growing linearly with processed jobs

Why 4: Event listener registered in job handler but never removed after completion
  Evidence: `worker.ts:67` calls `emitter.on('progress', callback)` inside the loop
  without corresponding `emitter.off()` or `emitter.once()`

Why 5: No resource cleanup lifecycle in the job processing framework
  Evidence: BaseWorker class has no `onComplete` hook for teardown

Root Cause: Job processing framework lacks a cleanup lifecycle hook,
causing resource leaks in any worker that registers listeners.

Fix Location: BaseWorker class needs an `onJobComplete` hook.
Immediate fix: Change `emitter.on` to `emitter.once` in worker.ts:67.
```

### When 5-Why Is Not Enough

If after 5 levels you are still at runtime symptoms, you likely have one of:
- **Multiple interacting causes** -- switch to Fault Tree Analysis
- **Distributed system issue** -- switch to Timeline Reconstruction
- **Data corruption** -- need to trace data lineage, not code paths

---

## Fault Tree Analysis

For complex bugs with multiple contributing factors. Work top-down from the failure.

### Structure

```
                    [Top Event: System Failure]
                           /        \
                         OR           OR
                        /   \        /   \
              [Cause A]  [Cause B] [Cause C] [Cause D]
                 |                     |
                AND                   AND
               /   \                 /   \
         [Sub-A1] [Sub-A2]    [Sub-C1] [Sub-C2]
```

**OR gate:** Any single child can cause the parent
**AND gate:** All children must occur together to cause the parent

### When to Use

- Intermittent bugs that require multiple conditions to trigger
- Production incidents involving multiple system components
- Bugs that "shouldn't happen" based on the code alone

### Example

```
[Payment double-charge]
      |
     AND
    /    \
[Request retried]  [Idempotency key not checked]
      |                     |
     OR                    OR
    /    \                /    \
[Network  [Client     [Key    [Redis
 timeout]  timeout     expired] down]
           too short]
```

This reveals: the double-charge requires BOTH a retry AND a failed idempotency check. Fix either branch to prevent the issue.

---

## Timeline Reconstruction

For production incidents and intermittent bugs. Build a minute-by-minute timeline of what happened.

### Template

| Time (UTC) | Source | Event | Relevance |
|------------|--------|-------|-----------|
| 14:28:00 | Deploy log | v2.3.1 deployed to production | Change introduction point |
| 14:30:15 | App log | First error: "Connection refused to cache-01" | First symptom |
| 14:30:15 | Infra | cache-01 health check failed | Correlated infra event |
| 14:31:00 | Sentry | Error spike: 47 events/min (baseline: 2/min) | Impact measurement |
| 14:33:00 | App log | Circuit breaker opened for cache service | System response |
| 14:35:00 | On-call | Alert fired, investigation started | Human response |

### Sources for Timeline Data

1. Application logs (structured logging with timestamps)
2. Infrastructure logs (AWS CloudWatch, GCP Stackdriver, etc.)
3. Deployment logs (CI/CD pipeline execution times)
4. Monitoring/alerting systems (when alerts fired)
5. Error tracking (Sentry event timestamps and frequency)
6. Git log (when code was committed and merged)
7. User reports (when users first noticed the issue)

---

## Evidence Collection Checklist

Collect all relevant evidence BEFORE forming hypotheses.

### Required Evidence

| Evidence Type | Source | Command / Method |
|--------------|--------|-----------------|
| Error output | Application logs, stderr | Check structured log files, Sentry MCP |
| Stack trace | Error tracker, application logs | Sentry MCP `get_issue` or log search |
| Recent code changes | Git history | `git log --oneline -20 -- <affected_files>` |
| Recent deployments | CI/CD logs | Deployment pipeline history |
| Data state | Database | Direct query of affected records |
| Environment variables | Config | Compare dev/staging/prod env vars |
| Package versions | Lock files | `git diff HEAD~5 -- package-lock.json` |
| Metrics | Monitoring | Request rate, error rate, latency before/after |
| User reports | Issue tracker | Exact reproduction steps from reporter |

### Git Blame for Context

```bash
# Who last changed the affected lines?
git blame -L 40,60 src/services/payment.ts

# What was the commit message and full diff?
git show <commit-hash>

# When was the file last modified?
git log -1 --format="%ai %s" -- src/services/payment.ts

# Find all commits that touched a specific function
git log -p -S "functionName" -- src/services/payment.ts
```

---

## Hypothesis Generation and Elimination Protocol

### Step 1: Generate Hypotheses (Min 2, Max 5)

After collecting evidence, list all plausible explanations:

```markdown
## Hypotheses

1. **Regression from recent commit** -- PR #342 modified the affected function 2 days ago
2. **Data corruption** -- affected user's record has an invalid state
3. **Environment-specific** -- works locally, fails in production (env var difference)
4. **Race condition** -- concurrent requests creating inconsistent state
```

### Step 2: Define Confirmation/Refutation Evidence

For each hypothesis, what would prove or disprove it?

| Hypothesis | Confirms | Refutes |
|-----------|----------|---------|
| Regression from #342 | Bug only affects code paths changed in #342 | Bug exists on commit before #342 (`git bisect`) |
| Data corruption | Specific records have invalid values | All records are valid; code path fails regardless of data |
| Environment-specific | Different behavior with same input on different envs | Same failure on all environments |
| Race condition | Failure only under concurrent load | Failure with single sequential request |

### Step 3: Collect and Evaluate

Test each hypothesis against the evidence. Eliminate those that contradict evidence.

### Step 4: If All Eliminated

When all hypotheses are eliminated:
1. Expand the investigation scope (upstream services, infrastructure, external dependencies)
2. Check for **compound causes** (two things that are individually fine but fail together)
3. Check for **environmental factors** (OS updates, network changes, certificate expiration)
4. Revisit the symptom definition -- are we investigating the right thing?

---

## Common Root Cause Categories

| Category | Typical Symptoms | Investigation Focus | Common Resolution |
|----------|-----------------|--------------------|--------------------|
| **Data** | Specific records fail, others work | Query affected data, compare with working data | Data migration or validation fix |
| **Logic** | Deterministic failure on specific input | Trace code path with failing input | Code fix in the logic branch |
| **Timing** | Intermittent, load-dependent | Concurrent access patterns, async flows | Locking, transaction boundaries, queue |
| **Environment** | Works locally, fails in prod | Env vars, package versions, infra config | Config fix or dependency update |
| **Dependency** | Failure correlates with external service | API responses, contract changes, availability | Integration fix, circuit breaker, fallback |
| **Regression** | Worked before a specific date/deploy | Git bisect, deployment history | Revert or fix the regressing commit |

---

## Investigation Documentation Template

Every completed investigation produces this document:

```markdown
## Investigation Report

**Bug ID:** [ticket reference]
**Investigated by:** Scout
**Date:** YYYY-MM-DD
**Symptom:** [Exact error/behavior as reported]
**Severity:** [P0/P1/P2/P3]

### Reproduction Steps
1. [Precondition: ...]
2. [Action: ...]
3. [Expected: ...]
4. [Actual: ...]

### Evidence Collected
- [Timestamp] [Source] [Finding]
- ...

### Root Cause Chain (5-Why)
- Why 1: [explanation] -- Evidence: [...]
- Why 2: [explanation] -- Evidence: [...]
- Root Cause: [structural/design cause]

### Fix Location
- `path/to/file.ts` lines XX-YY: [what needs to change]

### Recommended Approach
[How Builder should fix this -- direction, not code]

### Blast Radius
- [Other features/users/data affected by the same root cause]

### Related Issues
- [Other bugs that may share this root cause]

### Investigation Time
- Evidence collection: X min
- Hypothesis testing: X min
- Total: X min
```

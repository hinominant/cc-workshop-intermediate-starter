# PR Management

PR description, size guidelines, stacked PR strategy, review etiquette, lifecycle, branching conventions, merge strategies, and conflict resolution.

---

## PR Description Template

Every PR must include these sections. Copy and fill in:

```markdown
## Summary
[1-2 sentences: what changed and why. Business impact, not technical details.]

## Changes
- `type(scope):` commit description 1
- `type(scope):` commit description 2
- ...

## Test Plan
- [ ] Unit tests added/updated for [area]
- [ ] Integration tests for [endpoints/services]
- [ ] Manual verification: [what was checked, how]
- [ ] Edge cases tested: [list specific cases]

## Risk Assessment
- **Breaking changes:** None / [describe impact and migration path]
- **Migration needed:** No / [SQL migration / data backfill / config change]
- **Rollback plan:** Revert commit [hash] / [describe manual steps]
- **Affected services:** [list downstream services or consumers]

## Screenshots / Demo
[If UI change, include before/after screenshots]

## Related
- Closes #[issue number]
- Depends on #[PR number] (if stacked)
- Related: #[issue or PR for context]
```

---

## PR Size Guidelines

| Size | Lines Changed | Review Time | Recommendation |
|------|--------------|-------------|----------------|
| **Small** | < 200 | 15-30 min | Ideal. Merge quickly. |
| **Medium** | 200 - 500 | 30-60 min | Acceptable. Ensure clear commit sequence. |
| **Large** | 500 - 1000 | 1-2 hours | Split if possible. Needs review order guide. |
| **Too Large** | > 1000 | Half day+ | Must split into stacked PRs. |

### What Counts Toward Line Count

| Counts | Does Not Count |
|--------|---------------|
| Logic changes | Auto-generated files (lock files, migrations) |
| Test additions | Package manager output |
| Configuration changes | Snapshot updates (but these should be minimal) |
| Type definitions | IDE-generated formatting changes |

### When a PR Is Too Large

1. Check if formatting/style changes can be a separate PR
2. Check if test additions can be a separate PR
3. Check if the feature can be split by layer (DB -> API -> UI)
4. Check if the feature can use feature flags for incremental delivery

---

## Stacked PR Strategy

For changes that exceed 500 meaningful lines, use stacked PRs.

### Structure

```
main
  |
  +-- stack/feature-x-1-schema       (PR #1: DB schema + migrations)
       |
       +-- stack/feature-x-2-api     (PR #2: API endpoints + service layer)
            |
            +-- stack/feature-x-3-ui (PR #3: UI components + pages)
```

### Rules

| Rule | Detail |
|------|--------|
| Label each PR | `stack: 1/3`, `stack: 2/3`, `stack: 3/3` in title |
| Dependency order | Merge base first, then dependents |
| Keep each under 300 lines | Goal is reviewability in one session |
| Update chain on merge | Rebase dependent PRs onto main after base merges |
| Cross-reference | Each PR links to the full stack in description |

### Stack Description Template

Add to each PR in the stack:

```markdown
## Stack
This PR is part of a stack implementing [Feature X]:
1. #101 - DB schema and migrations (this PR)
2. #102 - API endpoints and service layer
3. #103 - UI components and pages

Merge order: #101 -> #102 -> #103
```

---

## Review Request Etiquette

### Who to Assign

| Change Type | Reviewer |
|-------------|----------|
| Core business logic | Domain expert + senior engineer |
| API contract change | API consumers + backend lead |
| Database schema | DBA or data team lead |
| Security-related | Security-focused reviewer |
| Frontend UI | Frontend lead + designer (for visual changes) |
| Infrastructure | DevOps / platform team |

### When to Request Review

| Do | Do Not |
|----|--------|
| After all CI checks pass | Before tests are green |
| After self-review of the diff | Without reading your own diff |
| After PR description is complete | With "WIP" or empty description |
| During business hours | Friday afternoon for large PRs |
| With context for complex decisions | Expecting reviewer to guess intent |

### Responding to Review Comments

| Situation | Action |
|-----------|--------|
| Agree with suggestion | Fix and reply "Done" with commit hash |
| Disagree respectfully | Explain reasoning, offer alternative |
| Need discussion | Suggest a quick sync, then document decision |
| Won't fix (intentional) | Explain why with evidence, mark as "won't fix" |

---

## PR Lifecycle

```
1. DRAFT        -> Work in progress, not ready for review
                   Use for: early feedback, CI validation, visibility
                   
2. READY        -> All checks pass, description complete, self-reviewed
                   Action: Request reviewers
                   
3. IN REVIEW    -> Reviewer(s) assigned and actively reviewing
                   Action: Respond to comments within 24 hours
                   
4. CHANGES REQ  -> Reviewer requested changes
                   Action: Address all comments, re-request review
                   
5. APPROVED     -> Reviewer approved
                   Action: Merge (author merges, not reviewer)
                   
6. MERGED       -> PR merged to target branch
                   Action: Delete source branch, close related issues
```

### Stale PR Policy

| Age | Action |
|-----|--------|
| 3 days without review | Ping reviewer |
| 7 days without review | Escalate to team lead |
| 14 days without activity | Close with comment, reopen when ready |

---

## Branch Naming Convention

### Format

```
<type>/<ticket-id>-<short-description>
```

### Examples

| Type | Branch Name |
|------|-------------|
| Feature | `feat/ARIS-420-kpi-integrity-checks` |
| Bug fix | `fix/ARIS-456-duplicate-charge` |
| Refactor | `refactor/extract-auth-middleware` |
| Docs | `docs/add-api-reference` |
| Test | `test/add-checkout-e2e` |
| Chore | `chore/upgrade-dependencies` |
| Hotfix | `hotfix/ARIS-789-payment-crash` |

### Rules

| Rule | Detail |
|------|--------|
| Lowercase only | `feat/Add-Login` is wrong, use `feat/add-login` |
| Hyphens for spaces | `feat/add_login` is wrong, use `feat/add-login` |
| Ticket ID when available | Always include for traceability |
| Short but descriptive | Max 50 characters after type prefix |
| No personal prefixes | `keiji/feat/login` is wrong, use `feat/login` |

---

## Merge Strategy Decision

| Strategy | When to Use | Pros | Cons |
|----------|-------------|------|------|
| **Squash merge** | Feature PRs with messy history | Clean main history, one commit per feature | Loses individual commit detail |
| **Merge commit** | Stacked PRs, release branches | Preserves full history, clear merge points | Noisy main history |
| **Rebase merge** | Small PRs with clean commits | Linear history, no merge commits | Requires clean commit history |

### Decision Flowchart

```
Is the PR a single logical change with clean commits?
  YES -> Rebase merge
  NO  -> Is the commit history valuable for future debugging?
           YES -> Merge commit
           NO  -> Squash merge (DEFAULT)
```

### Default: Squash Merge

Most PRs should use squash merge. The PR title becomes the commit message on main. Individual commits are preserved in the PR for archaeology.

---

## Conflict Resolution Protocol

### Prevention

| Practice | How |
|----------|-----|
| Rebase frequently | `git fetch origin && git rebase origin/main` daily |
| Small PRs | Less time open = less chance of conflict |
| Communicate | Announce when working on shared files |
| Feature flags | Avoid long-lived branches |

### Resolution Steps

1. **Identify the conflict scope**
   ```bash
   git fetch origin
   git rebase origin/main
   # Observe which files conflict
   ```

2. **Understand both sides**
   - Read the incoming change (theirs): what was the intent?
   - Read your change (ours): what was the intent?
   - Are they logically compatible or contradictory?

3. **Resolve by intent, not by line**
   - Do not blindly accept "ours" or "theirs"
   - Merge the intent of both changes
   - If contradictory, discuss with the other author

4. **Verify after resolution**
   ```bash
   git rebase --continue
   npm run build    # Verify compilation
   npm run test     # Verify tests pass
   npm run lint     # Verify lint passes
   ```

5. **Document if non-obvious**
   - Add a comment in the PR if the resolution involved a judgment call
   - Tag the other author for visibility

### Emergency: Abort and Retry

```bash
git rebase --abort   # Back to pre-rebase state
# Re-evaluate strategy: maybe merge commit is safer than rebase
```

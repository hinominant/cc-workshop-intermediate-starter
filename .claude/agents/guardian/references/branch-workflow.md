# Branch Workflow

Git flow vs trunk-based development, feature branch lifecycle, release management, hotfix protocol, branch protection, and hygiene.

---

## Git Flow vs Trunk-Based Development

| Aspect | Git Flow | Trunk-Based |
|--------|----------|-------------|
| Main branches | `main` + `develop` | `main` only |
| Feature branches | Long-lived, from `develop` | Short-lived (<2 days), from `main` |
| Release process | Release branch from `develop` | Tag or release branch from `main` |
| Merge frequency | Infrequent (end of feature) | Daily or more |
| Best for | Versioned products, mobile apps | SaaS, web apps, continuous delivery |
| Complexity | High (many branches to manage) | Low (one source of truth) |
| Risk | Merge conflicts from long-lived branches | Incomplete features on `main` |
| Mitigation | Frequent rebasing | Feature flags |

### Default Choice: Trunk-Based Development

For SaaS and web applications, trunk-based development is preferred. Short-lived feature branches merge into `main` via PR. Feature flags control incomplete features in production.

### When to Use Git Flow

- Mobile apps with distinct release versions
- Products shipped to customers (not hosted)
- Regulatory environments requiring release branch auditing
- Multiple supported versions in production simultaneously

---

## Feature Branch Lifecycle

```
1. CREATE      git checkout -b feat/ARIS-420-feature-name main
               |
2. DEVELOP     Commit in small increments, push daily
               |
3. SYNC        git fetch origin && git rebase origin/main
               (Do this at least daily to avoid large conflicts)
               |
4. PUSH        git push origin feat/ARIS-420-feature-name -u
               |
5. PR          Open PR when ready (or draft PR early for visibility)
               |
6. REVIEW      Address feedback, push fix commits (do not squash yet)
               |
7. APPROVE     Reviewer approves
               |
8. MERGE       Squash merge to main (author merges)
               |
9. CLEANUP     Delete remote branch, delete local branch
```

### Timing Guidelines

| Step | Target Duration |
|------|----------------|
| Create -> First push | Same day |
| Branch lifetime | 1-3 days (max 5) |
| PR open -> First review | 24 hours |
| Review comments -> Response | 24 hours |
| Approval -> Merge | Same day |

### If Branch Lives Too Long (> 5 Days)

1. Check if the scope is too large (split into stacked PRs)
2. Check if waiting on review (escalate)
3. Check if blocked on dependency (document and communicate)
4. If feature is genuinely large, use feature flags and merge incrementally

---

## Release Branch Management

For projects that need release branches (Git Flow or scheduled releases):

### Creating a Release Branch

```bash
git checkout -b release/v2.1.0 main
# or from develop in Git Flow:
git checkout -b release/v2.1.0 develop
```

### Release Branch Rules

| Rule | Detail |
|------|--------|
| No new features | Only bug fixes and release preparation |
| Cherry-pick fixes | Do not merge feature branches into release |
| Version bump | Update version numbers on branch creation |
| Freeze window | No changes 24h before release (stabilization) |
| Tag on release | `git tag -a v2.1.0 -m "Release 2.1.0"` |
| Back-merge | Merge release branch back to `main` (and `develop` if Git Flow) |

### Release Workflow

```
main ──────────────────────────────────────── main
       \                                    /
        release/v2.1.0 ── fix ── fix ── tag
```

---

## Hotfix Branch Protocol

For critical production bugs that cannot wait for the next release.

### Process

```bash
# 1. Branch from main (or the release tag)
git checkout -b hotfix/ARIS-789-critical-fix v2.1.0

# 2. Fix the bug (minimal change)
# 3. Add regression test
# 4. Open PR targeting main

# 5. After merge, tag the new release
git tag -a v2.1.1 -m "Hotfix: ARIS-789 payment crash"

# 6. If using Git Flow, also merge into develop
```

### Hotfix Rules

| Rule | Detail |
|------|--------|
| Minimal change | Fix only the bug, nothing else |
| Regression test | Must include a test that would have caught the bug |
| Fast review | Reviewer should prioritize within 2 hours |
| Deploy immediately | Do not batch with other changes |
| Post-mortem | Document root cause and prevention in the PR |

### Severity Classification

| Severity | Response Time | Examples |
|----------|--------------|---------|
| P0 - Critical | Fix within 2 hours | Data loss, security breach, payment failure |
| P1 - High | Fix within 24 hours | Feature completely broken, major UX degradation |
| P2 - Medium | Next sprint | Non-critical bug, workaround exists |
| P3 - Low | Backlog | Cosmetic, minor inconvenience |

Only P0 and P1 warrant hotfix branches. P2/P3 go through normal feature branch flow.

---

## Branch Protection Rules

### Recommended Settings for `main`

| Setting | Value | Reason |
|---------|-------|--------|
| Require PR reviews | 1 approval minimum | No direct pushes to main |
| Require status checks | CI must pass | Broken code never reaches main |
| Require up-to-date branch | Yes | PR must be rebased before merge |
| Restrict force pushes | Block all | History must never be rewritten |
| Restrict deletions | Block | Cannot delete main |
| Require linear history | Recommended | Squash or rebase merge only |
| Require signed commits | Optional | Depends on team policy |

### For `develop` (Git Flow only)

| Setting | Value |
|---------|-------|
| Require PR reviews | 1 approval |
| Require status checks | CI must pass |
| Allow force pushes | No |

---

## Clean Branch Hygiene

### After PR Merge

```bash
# Delete remote branch (GitHub does this automatically if configured)
git push origin --delete feat/ARIS-420-feature-name

# Delete local branch
git branch -d feat/ARIS-420-feature-name

# Prune remote tracking branches
git fetch --prune
```

### Periodic Cleanup

Run monthly (or configure as CI job):

```bash
# List merged branches (safe to delete)
git branch --merged main | grep -v 'main\|develop'

# Delete all merged local branches
git branch --merged main | grep -v 'main\|develop' | xargs git branch -d

# List stale remote branches (>30 days old)
git for-each-ref --sort=committerdate --format='%(committerdate:short) %(refname:short)' refs/remotes/origin \
  | head -20
```

### Branch Naming Conflicts

If a branch name already exists (from a previous attempt):

```bash
# Add a suffix
feat/ARIS-420-feature-name-v2

# Or delete the old branch first if it was merged
git branch -d feat/ARIS-420-feature-name
```

### Warning Signs

| Sign | Problem | Action |
|------|---------|--------|
| >10 active branches per person | Scope too large or PRs not being reviewed | Split work, prioritize reviews |
| Branch >7 days old | Risk of conflicts and context loss | Merge or close |
| Branch diverged >50 commits from main | Painful rebase ahead | Rebase incrementally, daily |
| Orphaned branches (no PR, no recent commits) | Forgotten work | Archive or delete |

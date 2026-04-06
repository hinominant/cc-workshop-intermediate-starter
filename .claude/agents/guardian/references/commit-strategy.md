# Commit Strategy

Conventional Commits specification, granularity rules, message writing guide, and examples of good and bad commit messages.

---

## Conventional Commits Specification

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Meaning | Example |
|------|---------|---------|
| `feat` | New user-facing functionality | `feat(auth): add password reset flow` |
| `fix` | Bug fix | `fix(cart): correct tax calculation for 0-yen items` |
| `refactor` | Code restructuring, no behavior change | `refactor(api): extract validation into middleware` |
| `test` | Adding or updating tests only | `test(auth): add integration tests for login endpoint` |
| `docs` | Documentation changes only | `docs(readme): add deployment instructions` |
| `chore` | Build, CI, dependency updates | `chore(deps): upgrade vitest to v3.0` |
| `perf` | Performance improvement | `perf(query): add index on users.email` |
| `style` | Formatting, whitespace (no logic change) | `style: apply prettier to all ts files` |
| `ci` | CI configuration changes | `ci: add playwright e2e to GitHub Actions` |
| `build` | Build system changes | `build: switch from webpack to vite` |
| `revert` | Reverting a previous commit | `revert: feat(auth): add password reset flow` |

### Scope

Scope is optional but recommended. Use the module or feature name:

```
feat(auth):       -> Authentication module
fix(api/users):   -> Users API endpoint
refactor(db):     -> Database layer
test(checkout):   -> Checkout feature tests
```

### Breaking Changes

Signal breaking changes with `!` after type/scope, and explain in the footer:

```
feat(api)!: change user response format from flat to nested

BREAKING CHANGE: GET /api/users now returns { data: { user } }
instead of { user }. All API consumers must update their parsing logic.
```

---

## Commit Granularity Rules

### One Logical Change Per Commit

Each commit should represent a single, coherent thought. Ask: "If I revert this commit, what exactly will be undone?"

| Situation | Commits |
|-----------|---------|
| Add a new API endpoint | 1. `feat(api): add POST /users endpoint` |
| Add endpoint + tests | 1. `feat(api): add POST /users endpoint` 2. `test(api): add tests for POST /users` |
| Fix bug + add test for it | 1. `fix(cart): correct rounding in total calculation` 2. `test(cart): add regression test for rounding bug` |
| Refactor + style fix | 1. `refactor(auth): extract token validation` 2. `style(auth): format with prettier` |

### Maximum 500 Lines Per Commit

If a single logical change exceeds 500 lines, split it:

| Original | Split Into |
|----------|-----------|
| `feat: add user management` (800 lines) | 1. `feat(db): add user schema and migrations` (200) 2. `feat(api): add user CRUD endpoints` (300) 3. `feat(ui): add user management page` (300) |

### Separate Refactoring from Features

```
# WRONG: Mixed in one commit
feat(auth): add OAuth login and refactor session handling

# CORRECT: Separated
refactor(auth): extract session handling into SessionService
feat(auth): add OAuth login using SessionService
```

---

## Commit Message Writing Guide

### Subject Line

| Rule | Guideline |
|------|-----------|
| Mood | Imperative ("add", not "added" or "adds") |
| Length | Under 50 characters (hard limit: 72) |
| Punctuation | No period at the end |
| Capitalization | Lowercase after type prefix |
| Content | What the commit does when applied |

### Body (Optional but Recommended for Non-Trivial Changes)

Explain **what** changed and **why**, not **how** (the diff shows how):

```
fix(payment): prevent duplicate charge on retry

The payment webhook handler did not check for idempotency keys,
causing duplicate charges when the payment provider retried after
a timeout. Added idempotency check using the X-Idempotency-Key
header value stored in Redis with a 24h TTL.

Closes #456
```

### Footer

| Footer | When to Use |
|--------|-------------|
| `Closes #123` | Issue this commit resolves |
| `Refs #456` | Related issue (not resolved by this commit) |
| `BREAKING CHANGE: ...` | Backward-incompatible change description |
| `Co-authored-by: Name <email>` | Pair programming credit |

---

## Interactive Rebase Guide for Cleanup Before PR

Before opening a PR, clean up the commit history using interactive rebase:

```bash
# Rebase last N commits (count from branch point)
git rebase -i HEAD~N

# Or rebase from the branch point
git rebase -i main
```

### Rebase Actions

| Action | When to Use |
|--------|-------------|
| `pick` | Keep the commit as-is |
| `reword` | Change the commit message |
| `squash` | Merge into previous commit, combine messages |
| `fixup` | Merge into previous commit, discard this message |
| `drop` | Remove the commit entirely |
| `edit` | Pause to amend the commit (split, modify files) |

### Common Cleanup Patterns

```bash
# Before rebase (messy history):
pick abc1234 feat(auth): add login form
pick def5678 fix typo
pick ghi9012 wip
pick jkl3456 feat(auth): add validation
pick mno7890 forgot to add test file

# After rebase (clean history):
pick abc1234 feat(auth): add login form with validation
pick jkl3456 test(auth): add login form tests
```

### Safety Rules

- Never rebase commits that have been pushed to a shared branch
- Always verify the repo compiles after rebase: `git stash && npm run build && git stash pop`
- If rebase goes wrong: `git rebase --abort`

---

## Commit Message Examples

### Good Commit Messages

```
1. feat(checkout): add coupon code validation at cart level

2. fix(api): return 404 instead of 500 when user not found

3. refactor(db): replace raw SQL with Prisma query builder

4. test(payment): add integration tests for webhook retry logic

5. perf(search): add composite index on (status, created_at)

   Query time reduced from 2.3s to 45ms for the dashboard
   active-orders query. Index size: ~12MB for 500K rows.

6. fix(i18n): handle pluralization for Japanese locale

   Japanese does not distinguish singular/plural, but the i18n
   library was inserting "(1)" suffixes. Disabled count-based
   pluralization for ja locale.

7. docs(api): add rate limiting section to API reference

8. chore(deps): upgrade next.js from 14.1 to 15.0

   Breaking changes addressed:
   - Replaced `getServerSideProps` with Server Components
   - Updated image imports to use next/image v2 API

9. feat(export)!: change CSV delimiter from comma to tab

   BREAKING CHANGE: Exported CSV files now use tab delimiter.
   Downstream systems consuming these files must update parsers.

10. revert: feat(auth): add biometric login

    Reverts commit a1b2c3d. Biometric API has a critical security
    vulnerability (CVE-2026-1234). Will re-implement after vendor patch.
```

### Bad Commit Messages

```
1. fix stuff
   -> What was fixed? Why? Meaningless.

2. WIP
   -> Never commit unfinished work to a shared branch.

3. Updated handler.ts
   -> Describes the file, not the change or purpose.

4. Address review comments
   -> Describes the process, not the actual change.

5. Minor changes
   -> Impossible to understand without reading the diff.

6. feat(auth): Add OAuth login and fix session bug and update styles
   -> Three unrelated changes in one commit. Split them.

7. asdfghjkl
   -> No comment needed.

8. Merge branch 'main' into feature/login
   -> Avoid merge commits; rebase instead.

9. feat(auth): added the new login flow that uses OAuth2 with PKCE and also handles the refresh token rotation with sliding window expiration
   -> Way too long. Subject should be under 50 characters.

10. fix: fix
    -> Recursive meaninglessness.
```

---

## Quick Reference Card

```
Format:  type(scope): imperative description under 50 chars
Body:    WHY this change was made (optional, wrap at 72 chars)
Footer:  Closes #123 / BREAKING CHANGE: ... (optional)

Types:   feat fix refactor test docs chore perf style ci build revert
Mood:    "add" not "added" or "adds"
Split:   One logical change per commit, max 500 lines
Verify:  Repo compiles after every commit
```

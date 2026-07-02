# rewind — Git考古学 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## REWIND'S FRAMEWORK

```
SCOPE → LOCATE → TRACE → REPORT → RECOMMEND
```

### 1. SCOPE Phase (Define Search Space)

Understand what we're looking for:

```yaml
INVESTIGATION_SCOPE:
  symptom: "[What's broken - test failure, behavior change, etc.]"
  known_good: "[Last known working state - commit, tag, date, or 'unknown']"
  known_bad: "[Current broken state - usually HEAD]"
  search_type:
    - REGRESSION: "Worked before, broken now"
    - ARCHAEOLOGY: "Why is the code like this?"
    - IMPACT: "What did this change affect?"
  files_of_interest:
    - "[File or directory paths]"
  test_criteria: "[How to verify good/bad state]"
```

### 2. LOCATE Phase (Find the Change)

**For Regression (git bisect):**
```bash
# Step 1: Identify good and bad commits
git log --oneline -20  # Recent history
git tag -l             # Check for version tags

# Step 2: Automated bisect (with user confirmation)
git bisect start
git bisect bad HEAD
git bisect good <known_good_commit>
git bisect run <test_command>

# Step 3: Record the result
git bisect log > bisect_log.txt
git bisect reset
```

**For Archaeology (history dive):**
```bash
# Trace file evolution
git log --follow -p -- <file>

# Find when a line was introduced
git log -S "<search_string>" --oneline

# Understand a specific change
git show <commit> --stat
git show <commit> -- <file>
```

**For Impact Analysis:**
```bash
# What files changed together
git log --name-only --pretty=format: <commit_range> | sort | uniq -c | sort -rn

# Who touched this code
git shortlog -sn -- <file>

# Change frequency
git log --since="6 months ago" --oneline -- <file> | wc -l
```

### 3. TRACE Phase (Build the Story)

Create a narrative of what happened:

```yaml
CHANGE_STORY:
  breaking_commit:
    sha: "[Full SHA]"
    short: "[Short SHA]"
    date: "[YYYY-MM-DD HH:MM]"
    author: "[Author name]"
    message: "[Commit message]"

  context_before:
    - commit: "[Previous relevant commit]"
      summary: "[What it did]"

  the_change:
    files_modified:
      - path: "[File path]"
        type: "[modified/added/deleted]"
        summary: "[What changed]"
    lines_added: N
    lines_removed: N
    intent: "[Apparent purpose of the change]"

  context_after:
    - commit: "[Following relevant commit]"
      summary: "[What it did]"

  why_it_broke:
    hypothesis: "[Why this change caused the issue]"
    evidence:
      - "[Supporting evidence 1]"
      - "[Supporting evidence 2]"
```

### 4. REPORT Phase (Present Findings)

Generate human-readable report:

```markdown
## Rewind Investigation Report

### Summary
- **Symptom:** [What's broken]
- **Root Cause Commit:** [SHA] by [Author] on [Date]
- **Confidence:** [High/Medium/Low]

### Timeline
```
[Good State]
    │
    ├── abc1234 (2024-01-10) - Refactored user service
    │
    ├── def5678 (2024-01-11) - Added caching layer  ← BREAKING COMMIT
    │
    ├── ghi9012 (2024-01-12) - Updated tests
    │
[Bad State - Current]
```

### The Breaking Change
**Commit:** def5678
**Message:** Added caching layer for improved performance
**Author:** developer@example.com

**What Changed:**
- Modified `src/services/user.ts` (+45, -12)
- Added `src/cache/redis.ts` (new file)

**Why It Broke:**
The caching layer introduced a race condition where...

### Evidence
1. Test `user.spec.ts:42` passes on abc1234, fails on def5678
2. The change modified the return type of `getUser()` from...
3. No tests covered the edge case where...

### Recommendations
1. **Quick Fix:** [Immediate mitigation]
2. **Proper Fix:** [Root cause resolution]
3. **Prevention:** [How to avoid in future]
```

### 5. RECOMMEND Phase (Suggest Next Steps)

Based on findings, recommend actions:

| Finding Type | Recommendation | Handoff To |
|--------------|----------------|------------|
| Clear regression | Revert or fix PR | Guardian → Builder |
| Design flaw | Architecture review | Atlas |
| Missing test | Add test coverage | Radar |
| Security issue | Immediate patch | Sentinel → Builder |

---

## INVESTIGATION PATTERNS

### Pattern 1: "When Did This Break?" (Regression Hunt)

```yaml
REGRESSION_HUNT:
  trigger: "Test that used to pass now fails"

  workflow:
    1_gather:
      - Get failing test name/command
      - Find last known good state (CI, tag, memory)
      - Estimate commit range

    2_bisect:
      - Validate good/bad commits manually first
      - Run automated bisect with test
      - Handle flaky tests (run multiple times)

    3_analyze:
      - Examine the breaking commit
      - Understand the change intent
      - Identify why it broke the test

    4_report:
      - Timeline visualization
      - Root cause explanation
      - Fix recommendations

  gotchas:
    - Flaky tests give false positives
    - Build failures can mask actual bad commit
    - Dependencies might have changed
```

### Pattern 2: "Why Is The Code Like This?" (Archaeology)

```yaml
ARCHAEOLOGY:
  trigger: "Confusing code that seems intentional"

  workflow:
    1_identify:
      - Mark the confusing code section
      - Formulate specific questions

    2_dig:
      - git blame to find introduction
      - git log -S to find related changes
      - Check commit messages for context
      - Look for linked issues/PRs

    3_reconstruct:
      - Build timeline of changes
      - Identify decision points
      - Find any documentation

    4_document:
      - Explain the history
      - Suggest documentation updates
      - Recommend refactoring if appropriate

  artifacts:
    - Code evolution timeline
    - Decision rationale summary
    - Technical debt assessment
```

### Pattern 3: "What Did This Change Affect?" (Impact Analysis)

```yaml
IMPACT_ANALYSIS:
  trigger: "Need to understand change ripple effects"

  workflow:
    1_scope:
      - Identify the commit/range of interest
      - List all changed files

    2_trace:
      - Find dependent files (imports, calls)
      - Check test coverage for changed areas
      - Identify configuration changes

    3_assess:
      - Categorize by risk level
      - Note any breaking API changes
      - Check for migration needs

    4_report:
      - Impact matrix
      - Risk assessment
      - Testing recommendations

  output:
    - Affected file list with risk levels
    - Suggested test focus areas
    - Rollback considerations
```

### Pattern 4: "Who Changed What and Why?" (Blame Analysis)

```yaml
BLAME_ANALYSIS:
  trigger: "Need accountability or context for changes"

  workflow:
    1_blame:
      - Run git blame on target file/lines
      - Aggregate by author and time

    2_context:
      - For each significant change:
        - Get full commit message
        - Check for linked PR/issue
        - Understand the intent

    3_summarize:
      - Create ownership map
      - Identify knowledge holders
      - Note areas with single point of failure

    4_visualize:
      - Contribution timeline
      - Code ownership matrix
      - Knowledge distribution

  note: "Focus on commits, not individuals. Never use for blame game."
```

---

## GIT COMMAND REFERENCE

### Safe Commands (Always OK)

```bash
# History viewing
git log [options]
git show <commit>
git diff <commit1>..<commit2>
git blame <file>

# Search
git log -S "<string>"           # Find commits adding/removing string
git log -G "<regex>"            # Find commits matching regex in diff
git log --follow -- <file>      # Track file across renames
git grep "<pattern>" <commit>   # Search in specific commit

# Inspection
git rev-parse <ref>             # Resolve ref to SHA
git describe --tags <commit>    # Find nearest tag
git merge-base <commit1> <commit2>  # Find common ancestor
```

### Requires Confirmation

```bash
# Bisect (modifies HEAD temporarily)
git bisect start/good/bad/run/reset

# Checkout (changes working directory)
git checkout <commit> -- <file>  # Safer: specific file only
git checkout <commit>            # Detached HEAD state

# Stash (if needed to preserve work)
git stash push -m "Rewind investigation"
git stash pop
```

### Never Run

```bash
# Destructive commands - FORBIDDEN
git reset --hard
git clean -f
git checkout .
git rebase
git push --force
```

---

## BISECT AUTOMATION

### Automatic Bisect Script Template

```bash
#!/bin/bash
# rewind_bisect.sh - Automated bisect runner

# Configuration (filled by Rewind)
GOOD_COMMIT="$1"
BAD_COMMIT="$2"
TEST_COMMAND="$3"

# Safety checks
if [ -z "$GOOD_COMMIT" ] || [ -z "$BAD_COMMIT" ] || [ -z "$TEST_COMMAND" ]; then
    echo "Usage: rewind_bisect.sh <good_commit> <bad_commit> <test_command>"
    exit 1
fi

# Verify commits exist
git rev-parse "$GOOD_COMMIT" > /dev/null 2>&1 || { echo "Good commit not found"; exit 1; }
git rev-parse "$BAD_COMMIT" > /dev/null 2>&1 || { echo "Bad commit not found"; exit 1; }

# Start bisect
echo "Starting bisect..."
echo "Good: $GOOD_COMMIT"
echo "Bad: $BAD_COMMIT"
echo "Test: $TEST_COMMAND"

git bisect start
git bisect bad "$BAD_COMMIT"
git bisect good "$GOOD_COMMIT"

# Run automated bisect
git bisect run sh -c "$TEST_COMMAND"

# Capture result
RESULT_COMMIT=$(git bisect view --oneline | head -1)
echo ""
echo "=== BISECT RESULT ==="
echo "First bad commit: $RESULT_COMMIT"
git show --stat $(echo $RESULT_COMMIT | cut -d' ' -f1)

# Clean up
git bisect reset
echo "Bisect complete. Working directory restored."
```

### Handling Bisect Edge Cases

```yaml
BISECT_EDGE_CASES:
  flaky_test:
    detection: "Same commit gives different results"
    solution: "Run test 3 times, majority wins"
    script: |
      for i in 1 2 3; do
        $TEST_COMMAND && good=$((good+1)) || bad=$((bad+1))
      done
      [ $good -gt $bad ] && exit 0 || exit 1

  build_failure:
    detection: "Build fails on some commits"
    solution: "Skip unbuildable commits"
    command: "git bisect skip"

  large_range:
    detection: ">1000 commits to search"
    solution: "Use heuristics to narrow first"
    approach:
      - Check recent release tags first
      - Use git log -S to find relevant commits
      - Narrow to specific file changes

  merge_commits:
    detection: "Bisect lands on merge commit"
    solution: "Investigate both parents"
    command: "git log --first-parent"
```

---

## OUTPUT FORMATS

### Timeline Visualization

```
                    REWIND TIMELINE
    ════════════════════════════════════════════

    ✓ GOOD: v2.0.0 (abc1234) 2024-01-01
    │
    │ ○ def5678 - Add user caching
    │ │   Author: alice@example.com
    │ │   Files: +2, ~1
    │
    │ ○ ghi9012 - Update dependencies
    │ │   Author: bob@example.com
    │ │   Files: ~1
    │
    │ ● jkl3456 - Refactor auth module  ← BREAKING
    │ │   Author: charlie@example.com
    │ │   Files: ~5, -1
    │ │
    │ │   This commit changed the token validation
    │ │   logic, breaking existing sessions.
    │
    │ ○ mno7890 - Fix typo in docs
    │   Author: dave@example.com
    │   Files: ~1
    │
    ✗ BAD: HEAD (pqr1234) 2024-01-15

    Legend: ✓ Good  ✗ Bad  ● Breaking  ○ Neutral
```

### Investigation Summary

```markdown
## 🔄 Rewind Investigation Summary

| Property | Value |
|----------|-------|
| **Investigation Type** | Regression Hunt |
| **Symptom** | Login fails with "Invalid token" |
| **Search Range** | v2.0.0..HEAD (47 commits) |
| **Bisect Steps** | 6 |
| **Root Cause** | jkl3456 |
| **Confidence** | High (95%) |

### Breaking Commit Details

```
commit jkl3456789abcdef
Author: charlie@example.com
Date: 2024-01-10

Refactor auth module for better performance

- Simplified token validation
- Removed legacy compatibility layer
- Updated session handling
```

### Why It Broke

The commit removed the legacy compatibility layer that handled
tokens in the old format. Existing sessions had tokens in the
old format, causing validation failures.

### Recommended Actions

1. **Immediate:** Revert jkl3456 or add backward compatibility
2. **Short-term:** Migrate existing sessions to new token format
3. **Long-term:** Add integration tests for token compatibility
```

---


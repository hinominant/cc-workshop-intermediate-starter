# Inbound Handoff Reference for Harvest

Handoff formats for data received from partner agents. These enable bidirectional collaboration and feedback loops.

---

## Overview

```
┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│   Judge   │     │   Pulse   │     │  Sherpa   │     │  Launch   │
└─────┬─────┘     └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
      │                 │                 │                 │
      │ FEEDBACK        │ SYNC            │ FEEDBACK        │ REQUEST
      │                 │                 │                 │
      └────────────────┬┴─────────────────┴─────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │     Harvest     │
              │  (Data Sink)    │
              └─────────────────┘
```

---

## 1. JUDGE_TO_HARVEST_FEEDBACK

Code review quality data from Judge for inclusion in quality trend reports.

### Handoff Format

```yaml
JUDGE_TO_HARVEST_FEEDBACK:
  type: "quality_feedback"
  timestamp: "2024-01-15T10:00:00Z"
  repository: "org/project"
  period:
    start: "2024-01-08"
    end: "2024-01-15"

  # Aggregate quality metrics
  quality_metrics:
    total_reviews: 25
    approval_rate: 0.88
    avg_review_cycles: 1.4
    avg_review_time_hours: 8.5

  # Per-PR quality scores
  pr_quality:
    - number: 150
      score: 85
      issues_found: 3
      issues_resolved: 3
      review_cycles: 2
      reviewers: ["alice", "bob"]
      categories:
        - "security"
        - "performance"
    - number: 149
      score: 92
      issues_found: 1
      issues_resolved: 1
      review_cycles: 1
      reviewers: ["charlie"]
      categories:
        - "style"

  # Quality trends
  trends:
    score_trend: "improving"  # improving, stable, declining
    common_issues:
      - type: "missing_tests"
        count: 5
      - type: "unclear_naming"
        count: 3
      - type: "security_concern"
        count: 2

  # Team improvement suggestions
  suggestions:
    - "Consider adding test coverage requirements for feat PRs"
    - "Security review needed for PRs touching auth modules"
```

### Processing Logic

```bash
# Process Judge feedback for report integration
process_judge_feedback() {
  local feedback_file="$1"
  local report_file="$2"

  # Extract quality metrics
  local avg_score=$(jq '.pr_quality | map(.score) | add / length' "$feedback_file")
  local approval_rate=$(jq '.quality_metrics.approval_rate' "$feedback_file")
  local review_cycles=$(jq '.quality_metrics.avg_review_cycles' "$feedback_file")

  # Generate quality section for report
  cat <<EOF
## Code Review Quality Trends

| Metric | Value | Trend |
|--------|-------|-------|
| Average Quality Score | ${avg_score}/100 | $(jq -r '.trends.score_trend' "$feedback_file") |
| Approval Rate | $(echo "scale=1; $approval_rate * 100" | bc)% | - |
| Avg Review Cycles | ${review_cycles} | - |

### Common Issues Found
$(jq -r '.trends.common_issues[] | "- **\(.type)**: \(.count) occurrences"' "$feedback_file")

### Improvement Suggestions
$(jq -r '.suggestions[] | "- \(.)"' "$feedback_file")
EOF
}
```

### Use Cases

1. **Weekly Report Enhancement**: Include quality trends in team reports
2. **Individual Reports**: Show quality scores per contributor
3. **Release Notes**: Highlight quality improvements in release

---

## 2. PULSE_TO_HARVEST_HANDOFF

KPI and metrics data from Pulse for correlation analysis.

### Handoff Format

```yaml
PULSE_TO_HARVEST_HANDOFF:
  type: "metrics_sync"
  timestamp: "2024-01-15T10:00:00Z"
  repository: "org/project"
  period:
    start: "2024-01-08"
    end: "2024-01-15"

  # KPI definitions and values
  kpis:
    - name: "deployment_frequency"
      value: 12
      unit: "deployments/week"
      target: 10
      status: "on_track"

    - name: "lead_time_for_changes"
      value: 18.5
      unit: "hours"
      target: 24
      status: "on_track"

    - name: "change_failure_rate"
      value: 0.08
      unit: "ratio"
      target: 0.15
      status: "on_track"

    - name: "mttr"
      value: 2.5
      unit: "hours"
      target: 4
      status: "on_track"

  # Correlation requests
  correlate_with:
    - pr_merge_rate
    - pr_size_distribution
    - review_turnaround

  # Historical context
  historical_data:
    - period: "2024-01-01/2024-01-07"
      deployment_frequency: 10
      lead_time_for_changes: 22
    - period: "2024-01-08/2024-01-15"
      deployment_frequency: 12
      lead_time_for_changes: 18.5
```

### Processing Logic

```bash
# Correlate Pulse KPIs with PR metrics
correlate_kpis_with_prs() {
  local pulse_data="$1"
  local pr_data="$2"

  # Calculate PR metrics
  local merge_rate=$(echo "$pr_data" | jq '[.[] | select(.state == "MERGED")] | length / length')
  local avg_pr_size=$(echo "$pr_data" | jq '[.[] | .additions + .deletions] | add / length')

  # Generate correlation analysis
  cat <<EOF
## Metrics Correlation Analysis

### DORA Metrics vs PR Activity

| KPI | Value | Correlated PR Metric | Correlation |
|-----|-------|---------------------|-------------|
| Deployment Frequency | $(jq -r '.kpis[] | select(.name == "deployment_frequency") | .value' "$pulse_data") | PR Merge Rate: ${merge_rate} | Strong positive |
| Lead Time | $(jq -r '.kpis[] | select(.name == "lead_time_for_changes") | .value' "$pulse_data")h | Avg PR Size: ${avg_pr_size} lines | Inverse |

### Insights
- Smaller PRs correlate with faster lead times
- Higher merge frequency drives deployment frequency
EOF
}
```

### Use Cases

1. **Executive Reports**: Include DORA metrics alongside PR activity
2. **Trend Analysis**: Correlate KPI changes with PR patterns
3. **Team Performance**: Link individual PR metrics to team KPIs

---

## 3. SHERPA_TO_HARVEST_HANDOFF

Task completion and progress data from Sherpa for progress reports.

### Handoff Format

```yaml
SHERPA_TO_HARVEST_HANDOFF:
  type: "progress_feedback"
  timestamp: "2024-01-15T10:00:00Z"
  repository: "org/project"

  # Epic/Task hierarchy
  epics:
    - id: "EPIC-123"
      title: "User Authentication System"
      status: "in_progress"
      progress: 0.75

      steps:
        - id: "STEP-1"
          title: "Design auth flow"
          status: "completed"
          completed_at: "2024-01-10T14:00:00Z"
          linked_prs: [145, 146]

        - id: "STEP-2"
          title: "Implement OAuth2"
          status: "completed"
          completed_at: "2024-01-12T16:00:00Z"
          linked_prs: [148, 150]

        - id: "STEP-3"
          title: "Add MFA support"
          status: "in_progress"
          linked_prs: [152]
          estimated_completion: "2024-01-18"

        - id: "STEP-4"
          title: "Security audit"
          status: "pending"
          linked_prs: []
          blocked_by: ["STEP-3"]

  # Velocity metrics
  velocity:
    steps_completed_this_week: 2
    avg_step_duration_hours: 36
    on_schedule: true

  # PR to task mapping
  pr_task_map:
    145: { epic: "EPIC-123", step: "STEP-1" }
    146: { epic: "EPIC-123", step: "STEP-1" }
    148: { epic: "EPIC-123", step: "STEP-2" }
    150: { epic: "EPIC-123", step: "STEP-2" }
    152: { epic: "EPIC-123", step: "STEP-3" }
```

### Processing Logic

```bash
# Generate progress report with Sherpa data
generate_progress_report() {
  local sherpa_data="$1"
  local pr_data="$2"

  cat <<EOF
## Epic Progress Report

$(jq -r '.epics[] | "### \(.id): \(.title)\n\n**Status:** \(.status) | **Progress:** \(.progress * 100 | floor)%\n"' "$sherpa_data")

### Step Details

| Step | Title | Status | Linked PRs | Duration |
|------|-------|--------|------------|----------|
$(jq -r '.epics[].steps[] | "| \(.id) | \(.title) | \(.status) | \(.linked_prs | join(", ")) | - |"' "$sherpa_data")

### Velocity

- Steps completed this week: $(jq '.velocity.steps_completed_this_week' "$sherpa_data")
- Average step duration: $(jq '.velocity.avg_step_duration_hours' "$sherpa_data") hours
- Schedule status: $(jq -r 'if .velocity.on_schedule then "On Track ✅" else "Behind ⚠️" end' "$sherpa_data")
EOF
}
```

### Use Cases

1. **Sprint Reports**: Link PRs to sprint tasks/stories
2. **Progress Tracking**: Show epic completion with PR evidence
3. **Resource Reports**: Calculate effort per epic based on PR data

---

## 4. LAUNCH_TO_HARVEST_HANDOFF

Release planning data from Launch for release notes generation.

### Handoff Format

```yaml
LAUNCH_TO_HARVEST_HANDOFF:
  type: "release_request"
  timestamp: "2024-01-15T10:00:00Z"
  repository: "org/project"

  # Release details
  release:
    version: "1.2.0"
    tag: "v1.2.0"
    release_date: "2024-01-20"
    previous_tag: "v1.1.0"

  # PR filtering criteria
  filter:
    since_tag: "v1.1.0"
    include_labels: ["release:1.2.0"]
    exclude_labels: ["wontfix", "duplicate"]

  # Categorization rules
  categorization:
    features:
      prefixes: ["feat:", "feature:"]
      labels: ["enhancement", "feature"]
    bugfixes:
      prefixes: ["fix:", "bugfix:"]
      labels: ["bug", "bugfix"]
    breaking:
      prefixes: ["BREAKING:"]
      labels: ["breaking-change"]
    security:
      labels: ["security"]

  # Output preferences
  output:
    format: "changelog"
    include_contributors: true
    include_pr_links: true
    group_by: "category"  # category, author, date

  # Additional context
  context:
    highlights:
      - "Major performance improvements"
      - "New OAuth2 authentication"
    deprecations:
      - feature: "Legacy auth API"
        removal_version: "2.0.0"
    migration_required: true
    migration_guide_url: "/docs/migration-1.2.md"
```

### Processing Logic

```bash
# Generate release notes from Launch request
generate_release_notes_from_launch() {
  local launch_data="$1"

  local prev_tag=$(jq -r '.release.previous_tag' "$launch_data")
  local new_version=$(jq -r '.release.version' "$launch_data")

  # Fetch PRs between tags
  local prs=$(gh pr list --state merged \
    --search "merged:>=$(git log -1 --format=%aI $prev_tag)" \
    --json number,title,author,labels,mergedAt)

  # Categorize PRs
  local features=$(echo "$prs" | jq '[.[] | select(.title | test("^feat:|^feature:"))]')
  local fixes=$(echo "$prs" | jq '[.[] | select(.title | test("^fix:|^bugfix:"))]')
  local breaking=$(echo "$prs" | jq '[.[] | select(.labels[].name == "breaking-change")]')

  cat <<EOF
# Release Notes v${new_version}

**Release Date:** $(jq -r '.release.release_date' "$launch_data")
**Previous Version:** ${prev_tag}

---

## Highlights

$(jq -r '.context.highlights[] | "- \(.)"' "$launch_data")

## Features

$(echo "$features" | jq -r '.[] | "- \(.title) (#\(.number)) - @\(.author.login)"')

## Bug Fixes

$(echo "$fixes" | jq -r '.[] | "- \(.title) (#\(.number)) - @\(.author.login)"')

$(if [ "$(echo "$breaking" | jq 'length')" -gt 0 ]; then
  echo "## Breaking Changes"
  echo ""
  echo "$breaking" | jq -r '.[] | "- \(.title) (#\(.number))"'
  echo ""
  echo "See [Migration Guide]($(jq -r '.context.migration_guide_url' "$launch_data"))"
fi)

## Contributors

$(echo "$prs" | jq -r '[.[].author.login] | unique | map("@\(.)") | join(", ")')
EOF
}
```

### Bidirectional: HARVEST_TO_LAUNCH_HANDOFF

Send generated release notes back to Launch.

```yaml
HARVEST_TO_LAUNCH_HANDOFF:
  type: "release_notes_generated"
  timestamp: "2024-01-15T12:00:00Z"

  release:
    version: "1.2.0"

  output:
    file: "release-notes-v1.2.0.md"
    format: "markdown"

  summary:
    total_prs: 25
    features: 10
    bugfixes: 12
    breaking_changes: 1
    contributors: 8

  artifacts:
    - path: "release-notes-v1.2.0.md"
      type: "release_notes"
    - path: "changelog-1.2.0.json"
      type: "structured_data"

  status: "SUCCESS"
  next_action: "Launch can proceed with release"
```

---

## 5. CANVAS_TO_HARVEST_HANDOFF

Visualization requests with specific data requirements.

### Handoff Format

```yaml
CANVAS_TO_HARVEST_HANDOFF:
  type: "visualization_data_request"
  timestamp: "2024-01-15T10:00:00Z"

  request:
    visualization_type: "interactive_dashboard"

    # Data requirements
    data_needs:
      - type: "time_series"
        metric: "merged_prs_per_week"
        period: "last_12_weeks"

      - type: "distribution"
        metric: "pr_size"
        grouping: "category"

      - type: "ranking"
        metric: "contributor_activity"
        limit: 10

    # Format preferences
    format:
      output: "json"
      include_metadata: true

  callback:
    return_to: "Canvas"
    visualization_id: "dashboard-001"
```

### Processing Logic

```bash
# Prepare data for Canvas visualization
prepare_canvas_data() {
  local request="$1"
  local pr_data="$2"

  # Generate time series data
  local time_series=$(echo "$pr_data" | jq '
    group_by(.mergedAt[0:10]) |
    map({date: .[0].mergedAt[0:10], count: length}) |
    sort_by(.date)
  ')

  # Generate distribution data
  local distribution=$(echo "$pr_data" | jq '
    map({
      size: (if (.additions + .deletions) < 50 then "XS"
             elif (.additions + .deletions) < 200 then "S"
             elif (.additions + .deletions) < 500 then "M"
             elif (.additions + .deletions) < 1000 then "L"
             else "XL" end)
    }) |
    group_by(.size) |
    map({size: .[0].size, count: length})
  ')

  # Build response
  jq -n --argjson ts "$time_series" --argjson dist "$distribution" '{
    visualization_id: "dashboard-001",
    data: {
      time_series: $ts,
      distribution: $dist
    },
    generated_at: now | strftime("%Y-%m-%dT%H:%M:%SZ")
  }'
}
```

---

## Handoff Processing Protocol

### Receipt Acknowledgment

When receiving any handoff:

```yaml
_HANDOFF_RECEIVED:
  Agent: Harvest
  Received: JUDGE_TO_HARVEST_FEEDBACK
  Timestamp: "2024-01-15T10:00:05Z"
  Status: PROCESSING
  Expected_completion: "2024-01-15T10:00:30Z"
```

### Validation Rules

```bash
# Validate incoming handoff
validate_handoff() {
  local handoff="$1"
  local required_fields="$2"

  for field in $required_fields; do
    if ! jq -e ".$field" "$handoff" &>/dev/null; then
      echo "ERROR: Missing required field: $field"
      return 1
    fi
  done

  return 0
}

# Validation by handoff type
case "$handoff_type" in
  "JUDGE_TO_HARVEST_FEEDBACK")
    validate_handoff "$data" "quality_metrics pr_quality timestamp"
    ;;
  "PULSE_TO_HARVEST_HANDOFF")
    validate_handoff "$data" "kpis period timestamp"
    ;;
  "SHERPA_TO_HARVEST_HANDOFF")
    validate_handoff "$data" "epics velocity timestamp"
    ;;
  "LAUNCH_TO_HARVEST_HANDOFF")
    validate_handoff "$data" "release filter timestamp"
    ;;
esac
```

### Error Response

```yaml
_HANDOFF_ERROR:
  Agent: Harvest
  Received: JUDGE_TO_HARVEST_FEEDBACK
  Status: REJECTED
  Error:
    Code: "INVALID_PAYLOAD"
    Message: "Missing required field: quality_metrics"
    Recovery: "Resend with complete payload"
```

---

## Integration Priority

| Handoff | Priority | Impact | Implementation Phase |
|---------|:--------:|:------:|:--------------------:|
| JUDGE_TO_HARVEST_FEEDBACK | High | Quality visibility | Phase 1 |
| LAUNCH_TO_HARVEST_HANDOFF | High | Release automation | Phase 1 |
| PULSE_TO_HARVEST_HANDOFF | Medium | Metrics correlation | Phase 2 |
| SHERPA_TO_HARVEST_HANDOFF | Medium | Progress tracking | Phase 2 |
| CANVAS_TO_HARVEST_HANDOFF | Low | Enhanced visuals | Phase 3 |

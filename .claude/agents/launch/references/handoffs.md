# Launch Handoff Formats

## Input Handoffs (Receiving)

### PLAN_TO_LAUNCH_HANDOFF

```yaml
## PLAN_TO_LAUNCH_HANDOFF

release_scope:
  version_hint: "1.2.0"  # Suggested version
  type: "minor"         # major | minor | patch | prerelease
  features:
    - id: "#100"
      title: "OAuth2 authentication"
      priority: high
    - id: "#101"
      title: "Report export"
      priority: medium
  fixes:
    - id: "#102"
      title: "Login timeout fix"
      severity: high
  target_date: "2024-01-15"
  constraints:
    - "Must include security fix #104"
    - "No breaking changes"
  dependencies:
    - "Staging environment ready"
    - "QA sign-off complete"
```

### GUARDIAN_TO_LAUNCH_HANDOFF

```yaml
## GUARDIAN_TO_LAUNCH_HANDOFF

pr_analysis:
  total_prs: 15
  merged_since_last_release: 12
  commits:
    - hash: "abc123"
      type: "feat"
      scope: "auth"
      message: "add OAuth2 provider"
      pr: "#100"
    - hash: "def456"
      type: "fix"
      scope: "auth"
      message: "resolve timeout issue"
      pr: "#102"
  breaking_changes: false
  recommended_version: "minor"
```

### BUILDER_TO_LAUNCH_HANDOFF

```yaml
## BUILDER_TO_LAUNCH_HANDOFF

feature_status:
  features:
    - id: "oauth"
      status: "complete"
      tested: true
      flag_integrated: true
    - id: "export"
      status: "complete"
      tested: true
      flag_integrated: false
  blockers: []
  ready_for_release: true
```

### HARVEST_TO_LAUNCH_HANDOFF

```yaml
## HARVEST_TO_LAUNCH_HANDOFF

pr_history:
  period: "v1.1.0..HEAD"
  total_prs: 15
  by_author:
    - author: "@alice"
      count: 5
    - author: "@bob"
      count: 4
  by_type:
    feat: 6
    fix: 4
    chore: 3
    docs: 2
  average_merge_time: "2.3 days"
```

---

## Output Handoffs (Sending)

### LAUNCH_TO_GUARDIAN_HANDOFF

```yaml
## LAUNCH_TO_GUARDIAN_HANDOFF

release_commits:
  version: "v1.2.0"
  tag: "v1.2.0"
  branch: "release/v1.2.0"

  changelog_entry: |
    ## [1.2.0] - 2024-01-15

    ### Added
    - OAuth2認証によるGoogle/GitHubログイン対応 (#100)
    - レポートのPDF/CSVエクスポート機能 (#101)

    ### Fixed
    - 高負荷時のログインタイムアウト問題 (#102)

    ### Security
    - 脆弱性のある依存パッケージを更新 (#104)

  release_notes_draft: |
    # Release v1.2.0

    ## Highlights
    - OAuth2 Authentication
    - Report Export

  commit_message: "chore(release): prepare v1.2.0"

  files_to_commit:
    - "CHANGELOG.md"
    - "package.json"  # if version bump needed

actions_required:
  - "Review and commit CHANGELOG changes"
  - "Create release tag"
  - "Push to release branch"
```

### LAUNCH_TO_GEAR_HANDOFF

```yaml
## LAUNCH_TO_GEAR_HANDOFF

deployment_request:
  version: "v1.2.0"
  tag: "v1.2.0"
  environment: "production"

  pre_deploy:
    - "Verify staging deployment successful"
    - "Run smoke tests"

  deploy_steps:
    - "Deploy container image v1.2.0"
    - "Run database migrations (if any)"
    - "Update feature flag configurations"

  post_deploy:
    - "Verify health checks"
    - "Run smoke tests"
    - "Monitor error rates for 30 minutes"

  rollback_plan: "rollback-v1.2.0.md"

  feature_flags:
    - name: "oauth-v2"
      initial_state: "off"
      rollout_percentage: 5
      targets: ["beta-users"]
    - name: "export-v2"
      initial_state: "on"
      rollout_percentage: 100

  monitoring:
    dashboards:
      - "https://grafana.example.com/d/release-v1.2.0"
    alerts:
      - "error_rate > 5%"
      - "p95_latency > 2s"
```

### LAUNCH_TO_TRIAGE_HANDOFF

```yaml
## LAUNCH_TO_TRIAGE_HANDOFF

incident_playbook:
  release_version: "v1.2.0"
  release_date: "2024-01-15"

  rollback_triggers:
    critical:
      - "Error rate > 5% for 5 minutes"
      - "Authentication completely failing"
      - "Payment processing errors"
    high:
      - "P95 latency > 2x baseline"
      - "User complaints spike"
    medium:
      - "Non-critical feature degradation"

  rollback_procedures:
    option_a:
      name: "Feature Flag Disable"
      time: "< 1 minute"
      risk: "low"
      steps:
        - "curl -X POST https://api.flags.io/flags/oauth-v2/disable"
        - "Verify flag disabled"
        - "Monitor error rates"

    option_b:
      name: "Container Rollback"
      time: "2-5 minutes"
      risk: "low"
      steps:
        - "kubectl rollout undo deployment/app -n production"
        - "kubectl rollout status deployment/app -n production"
        - "Verify health checks"

    option_c:
      name: "Full Rollback"
      time: "5-15 minutes"
      risk: "medium"
      steps:
        - "Deploy previous version v1.1.0"
        - "Rollback database migrations (if any)"
        - "Clear caches"

  contacts:
    primary: "@release-team"
    escalation: "@engineering-leads"

  post_incident:
    - "Create incident report"
    - "Schedule postmortem"
    - "Update runbook if needed"
```

### LAUNCH_TO_CANVAS_HANDOFF

```yaml
## LAUNCH_TO_CANVAS_HANDOFF

diagram_request:
  type: "timeline"
  title: "Release Timeline Q1 2024"

  data:
    releases:
      - version: "v1.1.0"
        date: "2024-01-01"
        type: "minor"
        features: 4
        status: "released"
      - version: "v1.2.0"
        date: "2024-01-15"
        type: "minor"
        features: 3
        status: "planned"
      - version: "v1.3.0"
        date: "2024-02-01"
        type: "minor"
        features: 5
        status: "planned"

    milestones:
      - name: "Feature Freeze"
        date: "2024-01-10"
      - name: "Code Freeze"
        date: "2024-01-13"

    freeze_periods:
      - name: "Holiday Freeze"
        start: "2024-12-20"
        end: "2024-01-02"

  format: "mermaid"  # or "ascii" or "drawio"
```

### LAUNCH_TO_QUILL_HANDOFF

```yaml
## LAUNCH_TO_QUILL_HANDOFF

documentation_update:
  version: "v1.2.0"

  files:
    - path: "CHANGELOG.md"
      action: "prepend"
      content: "[CHANGELOG entry]"

    - path: "README.md"
      section: "Latest Release"
      action: "update"
      content: "Latest stable release: v1.2.0"

    - path: "docs/releases/v1.2.0.md"
      action: "create"
      content: "[Full release notes]"

  api_docs:
    - "New OAuth endpoints documented"
    - "Export API documented"

  migration_guide:
    required: false
    breaking_changes: []
```

---

## Nexus Handoff Format

### NEXUS_HANDOFF (from Launch)

```text
## NEXUS_HANDOFF
- Step: [X/Y]
- Agent: Launch
- Summary: v1.2.0リリース計画を作成。CHANGELOG、リリースノート、ロールバック計画を生成。
- Key findings / decisions:
  - バージョン: 1.2.0 (MINOR - 新機能追加、後方互換)
  - 3つの新機能、1つのバグ修正、1つのセキュリティ修正
  - Feature flag: oauth-v2を段階的ロールアウト
- Artifacts (files/commands/links):
  - CHANGELOG.md エントリ生成済み
  - releases/v1.2.0.md リリースノート生成済み
  - rollback-v1.2.0.md ロールバック計画生成済み
- Risks / trade-offs:
  - OAuth機能は段階的展開で影響を限定
  - ロールバック時間: フラグ無効化 < 1分
- Open questions (blocking/non-blocking):
  - (non-blocking) リリース日時の最終確認
- Pending Confirmations:
  - Trigger: ON_RELEASE_TIMING
  - Question: いつリリースしますか？
  - Options: 次の定期リリース窓 / ASAP / 特定日時指定
  - Recommended: 次の定期リリース窓（火〜木 10:00）
- Suggested next agent: Guardian（リリースコミット準備）
- Next action: この返答全文をNexusに貼り付ける
```

---

## AUTORUN Output Format

```text
_STEP_COMPLETE:
  Agent: Launch
  Status: SUCCESS
  Output:
    - Version: v1.2.0
    - CHANGELOG: Added 3 entries (Added, Fixed, Security)
    - Release notes: Generated user-facing notes
    - Rollback plan: Feature flag + container rollback options
    - Feature flags: oauth-v2 configured for 5% rollout
  Next: Guardian
```

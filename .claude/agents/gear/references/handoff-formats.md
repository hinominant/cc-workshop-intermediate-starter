# Handoff Formats

Input and output handoff templates for Gear's inter-agent collaboration.

---

## Output Handoffs (Sending)

### GEAR_TO_HORIZON_HANDOFF

Outdated or deprecated dependencies detected, modernization needed.

```yaml
GEAR_TO_HORIZON_HANDOFF:
  Dependency_Report:
    project: "[Project Name]"
    scan_date: "[YYYY-MM-DD]"
    scan_method: "pnpm outdated + pnpm audit"
  Outdated_Packages:
    - name: "[package-name]"
      current: "[version]"
      latest: "[version]"
      update_type: "[major/minor/patch]"
  Audit_Issues:
    total: "[count]"
    critical: "[count]"
    high: "[count]"
    moderate: "[count]"
  Request:
    - "Check if packages are deprecated"
    - "Suggest modern alternatives if applicable"
    - "Provide migration guidance for breaking changes"
```

### GEAR_TO_CANVAS_HANDOFF

DevOps architecture ready for visualization.

```yaml
GEAR_TO_CANVAS_HANDOFF:
  Visualization_Request:
    type: "[ci_cd_pipeline / docker_architecture / dependency_graph]"
    purpose: "[documentation / onboarding / debugging]"
  Pipeline_Stages:
    - "[Stage 1 description]"
    - "[Stage 2 description]"
  Components:
    - "[Component list]"
  Annotations:
    - "[Parallel jobs]"
    - "[Cache usage points]"
    - "[Environment gates]"
  Output_Format: "mermaid"
```

### GEAR_TO_RADAR_HANDOFF

CI/CD pipeline needs test coverage.

```yaml
GEAR_TO_RADAR_HANDOFF:
  Test_Request:
    pipeline: "[workflow name]"
    test_type: "[unit / integration / e2e]"
    focus: "[specific stage or job]"
  Current_Coverage:
    status: "[coverage % or 'unknown']"
    gaps: "[identified gaps]"
  Config_Files:
    - "[list of relevant config files]"
```

### GEAR_TO_BOLT_HANDOFF

Build performance needs optimization beyond configuration.

```yaml
GEAR_TO_BOLT_HANDOFF:
  Performance_Issue:
    area: "[build / install / ci_pipeline]"
    current_duration: "[time]"
    target_duration: "[time]"
  Bottleneck:
    identified: "[bottleneck description]"
    evidence: "[timing data / profiling output]"
  Already_Tried:
    - "[optimization already applied]"
  Request:
    - "Application-level performance optimization"
```

### GEAR_TO_SENTINEL_HANDOFF

Security configuration needs audit.

```yaml
GEAR_TO_SENTINEL_HANDOFF:
  Security_Scan:
    scan_type: "[dependency audit / secret detection / container scan]"
    tool: "[pnpm audit / Gitleaks / Docker Scout / Trivy]"
  Findings:
    - vulnerability: "[CVE or description]"
      severity: "[critical/high/medium/low]"
      package: "[affected package]"
      fix_available: "[yes/no]"
  Request:
    - "Deep security review of findings"
    - "Remediation priority assessment"
```

### GEAR_TO_LAUNCH_HANDOFF

CI/CD pipeline ready for release configuration.

```yaml
GEAR_TO_LAUNCH_HANDOFF:
  Pipeline_Status:
    ci_passing: "[yes/no]"
    cd_configured: "[yes/no]"
    environments: "[staging, production]"
  Release_Readiness:
    semantic_release: "[configured/not configured]"
    changelog: "[auto-generated/manual]"
    version_strategy: "[semver/calver]"
  Request:
    - "Configure release workflow"
    - "Set up versioning strategy"
```

---

## Input Handoffs (Receiving)

### SCAFFOLD_TO_GEAR_HANDOFF

Initial environment provisioned, optimization needed.

```yaml
SCAFFOLD_TO_GEAR_HANDOFF:
  Environment_Created:
    type: "[Docker / CI/CD / dev environment]"
    files_created:
      - "[file list]"
  Optimization_Needed:
    - "Dockerfile layer optimization"
    - "CI/CD caching setup"
    - "Build performance tuning"
```

### HORIZON_TO_GEAR_HANDOFF

Migration recommendations ready for implementation.

```yaml
HORIZON_TO_GEAR_HANDOFF:
  Migration_Plan:
    packages:
      - name: "[package]"
        from: "[version]"
        to: "[version]"
        breaking_changes: "[list]"
    migration_steps:
      - "[step 1]"
      - "[step 2]"
  Request:
    - "Execute dependency updates"
    - "Update CI/CD configuration if needed"
    - "Verify build passes after migration"
```

### BOLT_TO_GEAR_HANDOFF

Performance recommendations requiring infrastructure changes.

```yaml
BOLT_TO_GEAR_HANDOFF:
  Recommendations:
    - type: "[caching / build config / CI optimization]"
      description: "[what needs to change]"
      expected_improvement: "[estimated gain]"
  Config_Changes:
    - file: "[config file path]"
      change: "[description of change]"
```

---

## Output Report Format

Standard format for Gear completion reports.

```markdown
## DevOps: [Task Name]

### Overview
**Area:** [Dependencies / CI/CD / Docker / Observability / Monorepo]
**Action:** [What was done]
**Risk:** Low (Patch) / Medium (Minor) / High (Major/Config change)

### Changes
| File | Change |
|------|--------|
| [file] | [description] |

### Verification
- Build: [pass/fail]
- Tests: [pass/fail]
- Lint: [pass/fail]

### Recommended Next Steps
- [ ] [Follow-up action 1]
- [ ] [Follow-up action 2]
```

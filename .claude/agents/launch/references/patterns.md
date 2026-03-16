# Launch Collaboration Patterns

## Pattern A: Plan-to-Release Flow

```
Plan → Launch → Guardian
```

**Trigger:** Release planning initiated
**Flow:**
1. Plan defines release scope and timeline
2. Launch creates version strategy, CHANGELOG, rollback plan
3. Guardian prepares release commits and tags

**Input from Plan:**
```yaml
release_scope:
  features: ["#100", "#101"]
  target_date: "2024-01-15"
  type: "minor"
```

**Output to Guardian:**
```yaml
release_commits:
  tag: "v1.2.0"
  changelog_entry: "..."
  release_notes: "..."
```

---

## Pattern B: Build-to-Release Flow

```
Builder → Launch → Gear
```

**Trigger:** Features complete, ready for release
**Flow:**
1. Builder confirms feature completion
2. Launch generates release artifacts
3. Gear executes deployment pipeline

**Input from Builder:**
```yaml
feature_status:
  complete: ["oauth", "export"]
  tested: true
  ready_for_release: true
```

**Output to Gear:**
```yaml
deployment_request:
  version: "v1.2.0"
  environment: "production"
  feature_flags: [...]
```

---

## Pattern C: Release Documentation

```
Launch → Quill
```

**Trigger:** Release notes finalized
**Flow:**
1. Launch generates CHANGELOG and release notes
2. Quill updates README, documentation

**Output to Quill:**
```yaml
documentation_update:
  changelog: "CHANGELOG.md"
  release_notes: "releases/v1.2.0.md"
  readme_section: "Latest Release"
```

---

## Pattern D: Release Visualization

```
Launch → Canvas
```

**Trigger:** Release timeline needed
**Flow:**
1. Launch provides release schedule data
2. Canvas creates visual timeline

**Output to Canvas:**
```yaml
diagram_request:
  type: "timeline"
  data:
    releases:
      - version: "v1.2.0"
        date: "2024-01-15"
        features: 5
      - version: "v1.3.0"
        date: "2024-02-01"
        features: 3
```

---

## Pattern E: Post-Release Monitoring

```
Launch → Triage
```

**Trigger:** Release deployed
**Flow:**
1. Launch provides rollback procedures
2. Triage monitors for incidents

**Output to Triage:**
```yaml
incident_playbook:
  version: "v1.2.0"
  rollback_triggers:
    - "error_rate > 5%"
    - "p95_latency > 2s"
  rollback_procedure: "rollback-v1.2.0.md"
```

---

## Pattern F: Feature Flag Integration

```
Launch ↔ Builder
```

**Trigger:** Gradual rollout planned
**Flow:**
1. Launch designs flag strategy
2. Builder implements flag integration
3. Launch monitors rollout stages

**Bidirectional:**
```yaml
flag_design:
  name: "oauth-v2"
  rollout_stages: [5, 25, 50, 100]
  targets: ["beta-users"]

implementation_status:
  flag_integrated: true
  fallback_tested: true
```

---

## Orchestration Patterns

### Standard Release

```
Plan → Launch → Guardian → Gear → Launch (verify)
```

### Hotfix Release

```
Triage → Launch → Guardian → Gear → Triage (monitor)
```

### Feature Release with Flags

```
Plan → Launch → Builder (flag) → Launch → Gear → Launch (rollout)
```

### Documentation Release

```
Launch → Quill → Guardian → Gear
```

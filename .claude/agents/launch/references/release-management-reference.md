# launch — リリース管理 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## 1. Versioning Strategies

### Semantic Versioning (SemVer)

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes (incompatible API changes)
MINOR: New features (backwards compatible)
PATCH: Bug fixes (backwards compatible)

Examples:
  1.0.0 → 2.0.0  Breaking API change
  1.0.0 → 1.1.0  New feature added
  1.0.0 → 1.0.1  Bug fix
```

### Pre-release Versions

```
1.0.0-alpha.1    Early development
1.0.0-beta.1     Feature complete, testing
1.0.0-rc.1       Release candidate
1.0.0            Stable release
```

### CalVer (Calendar Versioning)

```
YYYY.MM.DD      2024.01.15
YYYY.MM.MICRO   2024.01.1
YY.MM           24.01

Use when:
- Time-based releases (monthly/quarterly)
- Continuous deployment models
- SaaS products with frequent updates
```

### Version Decision Matrix

| Change Type | SemVer | Example |
|-------------|--------|---------|
| Breaking API change | MAJOR | 1.x.x → 2.0.0 |
| New feature (compatible) | MINOR | 1.0.x → 1.1.0 |
| Bug fix | PATCH | 1.0.0 → 1.0.1 |
| Security fix | PATCH | 1.0.0 → 1.0.1 |
| Dependency update | PATCH/MINOR | Depends on impact |
| Documentation only | No bump | N/A |

---

## 2. CHANGELOG Generation

### Keep a Changelog Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New feature description (#123)

### Changed
- Modified behavior description (#124)

### Deprecated
- Feature marked for removal (#125)

### Removed
- Deleted feature description (#126)

### Fixed
- Bug fix description (#127)

### Security
- Security fix description (#128)

## [1.2.0] - 2024-01-15

### Added
- User authentication via OAuth2 (#100)
- Export functionality for reports (#101)

### Fixed
- Login timeout issue under high load (#102)

## [1.1.0] - 2024-01-01

### Added
- Initial release features

[Unreleased]: https://github.com/user/repo/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/user/repo/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/user/repo/releases/tag/v1.1.0
```

### CHANGELOG Entry Guidelines

| Category | Description | Example |
|----------|-------------|---------|
| **Added** | New features | "Add OAuth2 authentication" |
| **Changed** | Existing functionality changes | "Update dashboard layout" |
| **Deprecated** | Soon-to-be removed features | "Deprecate legacy API v1" |
| **Removed** | Removed features | "Remove deprecated endpoint" |
| **Fixed** | Bug fixes | "Fix memory leak in worker" |
| **Security** | Security improvements | "Patch XSS vulnerability" |

### Commit to CHANGELOG Mapping

```yaml
changelog_mapping:
  feat: Added
  fix: Fixed
  security: Security
  perf: Changed
  refactor: Changed
  deprecate: Deprecated
  remove: Removed
  docs: (skip unless significant)
  chore: (skip)
  test: (skip)
  ci: (skip)
```

---

## 3. Release Notes Generation

### User-Facing Release Notes Template

```markdown
# Release v1.2.0

**Release Date:** January 15, 2024

## Highlights

- **OAuth2 Authentication** - Sign in with Google or GitHub
- **Report Export** - Download reports as PDF or CSV

## What's New

### User Authentication
You can now sign in using your Google or GitHub account. This provides:
- Faster login experience
- No need to remember another password
- Enhanced security with 2FA support

### Report Export
Export your reports in multiple formats:
- PDF for sharing and printing
- CSV for data analysis in spreadsheets

## Bug Fixes

- Fixed an issue where login would timeout during peak hours
- Resolved dashboard loading delays on slow connections

## Breaking Changes

None in this release.

## Upgrade Instructions

1. No action required for most users
2. If using API v1, migrate to v2 before March 2024

## Known Issues

- Dark mode has minor styling issues on Safari (fix planned for v1.2.1)

---

For full technical details, see the [CHANGELOG](./CHANGELOG.md).
```

### Release Notes vs CHANGELOG

| Aspect | Release Notes | CHANGELOG |
|--------|--------------|-----------|
| Audience | End users | Developers |
| Language | Plain language | Technical |
| Format | Narrative | Structured list |
| Focus | Benefits, impact | What changed |
| Updates | Per release | Continuous |

---

## 4. Rollback Planning

### Rollback Plan Template

```markdown
# Rollback Plan: v1.2.0

## Pre-Deployment Checklist

- [ ] Database backup completed
- [ ] Previous version artifact available
- [ ] Rollback procedure tested in staging
- [ ] Monitoring alerts configured
- [ ] On-call team notified

## Rollback Triggers

Initiate rollback if ANY of these occur:
1. Error rate > 5% for 5 minutes
2. P95 latency > 2x baseline
3. Critical functionality broken
4. Security vulnerability discovered

## Rollback Procedure

### Option A: Feature Flag Disable (Fastest)
```bash
# Disable feature flag
curl -X POST https://api.flags.io/flags/oauth-v2/disable

# Verify
curl https://api.flags.io/flags/oauth-v2/status
```
**Time to effect:** < 1 minute
**Risk:** Low

### Option B: Container Rollback
```bash
# Roll back Kubernetes deployment
kubectl rollout undo deployment/app -n production

# Verify rollback
kubectl rollout status deployment/app -n production
```
**Time to effect:** 2-5 minutes
**Risk:** Low

### Option C: Database Rollback (If schema changed)
```bash
# Run down migration
pnpm prisma migrate rollback --to v1.1.0

# Verify schema
pnpm prisma migrate status
```
**Time to effect:** 5-15 minutes
**Risk:** Medium (data loss possible)

## Post-Rollback Actions

1. [ ] Notify stakeholders of rollback
2. [ ] Create incident report
3. [ ] Schedule postmortem
4. [ ] Tag rolled-back version in git

## Rollback Verification

- [ ] Health check passing
- [ ] Error rate normalized
- [ ] User flows functional
- [ ] Monitoring green
```

### Rollback Strategy Matrix

| Change Type | Rollback Method | Time | Risk |
|-------------|-----------------|------|------|
| Feature flag controlled | Disable flag | < 1 min | Low |
| Container/deployment | Rollback deployment | 2-5 min | Low |
| Configuration change | Revert config | 1-3 min | Low |
| Database migration | Down migration | 5-15 min | Medium |
| Data migration | Restore backup | 15-60 min | High |

---

## 5. Feature Flag Strategy

### Feature Flag Types

| Type | Purpose | Example |
|------|---------|---------|
| **Release Flag** | Hide incomplete features | `enable-new-checkout` |
| **Ops Flag** | Circuit breaker | `use-cache-v2` |
| **Experiment Flag** | A/B testing | `experiment-pricing-v3` |
| **Permission Flag** | User segmentation | `beta-users-only` |

### Gradual Rollout Strategy

```yaml
rollout_plan:
  stage_1:
    name: "Internal Testing"
    percentage: 0%
    targets: ["internal-team"]
    duration: "2 days"
    success_criteria:
      - error_rate: < 1%
      - no_critical_bugs: true

  stage_2:
    name: "Beta Users"
    percentage: 5%
    targets: ["beta-users"]
    duration: "3 days"
    success_criteria:
      - error_rate: < 2%
      - user_feedback: positive

  stage_3:
    name: "Gradual Rollout"
    percentage: 25%
    targets: ["all-users"]
    duration: "2 days"
    success_criteria:
      - error_rate: < 2%
      - p95_latency: < baseline * 1.2

  stage_4:
    name: "Full Rollout"
    percentage: 100%
    targets: ["all-users"]
    duration: "stable"
    success_criteria:
      - error_rate: < 2%
```

### Feature Flag Lifecycle

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Create  │───▶│ Rollout │───▶│ Stable  │───▶│ Remove  │
│  Flag   │    │  100%   │    │ Period  │    │  Flag   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │
   Day 0        Day 7-14       Day 30+        Day 60+
```

### Flag Configuration Template

```json
{
  "name": "oauth-v2",
  "description": "OAuth 2.0 authentication flow",
  "owner": "@auth-team",
  "created": "2024-01-01",
  "expires": "2024-03-01",
  "rollout": {
    "percentage": 25,
    "targets": {
      "include": ["beta-users", "internal"],
      "exclude": ["legacy-integrations"]
    }
  },
  "fallback": false,
  "cleanup_ticket": "JIRA-456"
}
```

---

## 6. Release Checklist Generation

### Standard Release Checklist

```markdown
# Release Checklist: v1.2.0

## Pre-Release (T-2 days)

### Code Freeze
- [ ] Feature branch merged to release branch
- [ ] No new features after freeze
- [ ] Only bug fixes allowed

### Quality Gates
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code coverage > 80%
- [ ] No critical/high security issues
- [ ] Performance benchmarks met

### Documentation
- [ ] CHANGELOG updated
- [ ] Release notes drafted
- [ ] API documentation updated
- [ ] Migration guide (if needed)

### Infrastructure
- [ ] Staging deployment successful
- [ ] Load testing completed
- [ ] Rollback plan documented
- [ ] Database migration tested

## Release Day (T-0)

### Pre-Deployment
- [ ] Go/No-go meeting completed
- [ ] Stakeholders notified
- [ ] On-call team available
- [ ] Monitoring dashboards ready

### Deployment
- [ ] Database migration executed
- [ ] Application deployed
- [ ] Health checks passing
- [ ] Smoke tests passing

### Verification
- [ ] Critical paths tested manually
- [ ] Error rates normal
- [ ] Performance within SLA
- [ ] No alerts triggered

## Post-Release (T+1 day)

### Monitoring
- [ ] 24-hour stability confirmed
- [ ] User feedback reviewed
- [ ] Metrics dashboard reviewed

### Cleanup
- [ ] Release notes published
- [ ] Stakeholders notified of success
- [ ] Release branch tagged
- [ ] Retrospective scheduled
```

### Go/No-Go Decision Matrix

| Criterion | Status | Required | Blocker |
|-----------|--------|----------|---------|
| All tests passing | ✅ / ❌ | Yes | Yes |
| Security scan clean | ✅ / ❌ | Yes | Yes |
| Staging verified | ✅ / ❌ | Yes | Yes |
| Rollback tested | ✅ / ❌ | Yes | Yes |
| CHANGELOG complete | ✅ / ❌ | Yes | No |
| Stakeholder approval | ✅ / ❌ | Yes | Yes |
| On-call available | ✅ / ❌ | Yes | Yes |
| Low-risk window | ✅ / ❌ | Preferred | No |

---

## 7. Hotfix Workflow

### Hotfix Process

```
Production Issue Detected
         │
         ▼
┌─────────────────┐
│ Create hotfix   │
│ branch from tag │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Apply fix     │
│  (minimal diff) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Expedited review│
│ (2 approvers)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deploy to prod  │
│ (skip staging)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cherry-pick to  │
│ main branch     │
└─────────────────┘
```

### Hotfix Branch Naming

```
hotfix/v1.2.1-login-timeout
hotfix/v1.2.1-security-patch
```

### Hotfix Version Bump

```
Current: v1.2.0
Hotfix:  v1.2.1

CHANGELOG:
## [1.2.1] - 2024-01-16

### Fixed
- Critical: Login timeout under high load (#130)
```

---

## 8. Release Calendar

### Release Window Guidelines

| Window | Risk Level | Recommended |
|--------|------------|-------------|
| Monday AM | Medium | Avoid (post-weekend issues) |
| Tuesday-Thursday | Low | ✅ Best |
| Friday | High | ❌ Avoid |
| Holiday eve | High | ❌ Never |
| Weekend | High | ❌ Emergency only |

### Release Cadence Options

| Cadence | Description | Best For |
|---------|-------------|----------|
| Continuous | Every commit to main | SaaS, small teams |
| Daily | Once per day | Active development |
| Weekly | Tuesday/Wednesday | Most teams |
| Bi-weekly | Every sprint end | Scrum teams |
| Monthly | First week of month | Enterprise, stable |

### Freeze Period Planning

```yaml
freeze_periods:
  - name: "Holiday Freeze"
    start: "2024-12-20"
    end: "2024-01-02"
    exceptions: "Critical security only"

  - name: "Q4 Close"
    start: "2024-12-15"
    end: "2024-12-31"
    exceptions: "Finance-approved changes"

  - name: "Major Event"
    start: "2024-03-10"
    end: "2024-03-12"
    exceptions: "Event support only"
```

---


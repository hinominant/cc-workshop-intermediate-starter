# Triage Response Workflow Reference

Detailed incident response phases and templates.

## Phase 1: DETECT & CLASSIFY (First 5 minutes)

**Immediate Actions:**
1. Acknowledge the incident
2. Gather initial information
3. Classify severity
4. Notify stakeholders (if SEV1/SEV2)

### Initial Incident Report Template

```markdown
## Initial Incident Report

**Reported By:** [name/system]
**Reported At:** [YYYY-MM-DD HH:MM UTC]
**Initial Description:** [what was reported]

**Symptoms:**
- [ ] Error messages: [exact text]
- [ ] Affected URL/endpoint: [path]
- [ ] Error rate: [X% of requests]
- [ ] Latency: [current vs baseline]
- [ ] User reports: [count/nature]

**Environment:**
- [ ] Production / Staging / Dev
- [ ] Region: [if applicable]
- [ ] Version: [deployed version]
```

---

## Phase 2: ASSESS & CONTAIN (Minutes 5-15)

**Impact Assessment:**
- Determine scope of affected users/features
- Identify potential data impact
- Check for cascading failures
- Document timeline of events

### Containment Options

| Action | When to Use | Risk |
|--------|-------------|------|
| Feature flag disable | Feature-specific issue | Functionality loss |
| Rollback deploy | Recent deploy caused issue | May lose good changes |
| Scale up resources | Load-related issue | Cost increase |
| Block traffic | DDoS/abuse | Legitimate users blocked |
| Failover to backup | Primary system failure | Data sync lag |
| Disable integration | Third-party issue | Feature degradation |

---

## Phase 3: INVESTIGATE & MITIGATE (Minutes 15-60)

**Coordinate Investigation:**
- Hand off to Scout for root cause analysis
- Request Lens for evidence collection
- Request Beacon for monitoring data (if available)

### Handoff Sequence (Standard Flow)

```
1. Triage → Scout     : RCA依頼（症状・タイムライン・初期仮説を含む）
2. Scout → Triage     : RCA完了報告（根本原因・修正箇所・推奨アプローチ）
3. Triage → Builder     : 修正依頼（Scout結果を含む、緊急度を明記）
4. Builder → Radar      : テスト依頼（修正内容・回帰テスト要件）
5. Radar → Triage     : 検証完了報告（テスト結果・カバレッジ）
6. Triage → Close     : インシデントクローズ（検証完了後）
```

**Parallel Execution (When applicable):**
- Scout RCA中にLensで証拠収集（並列可）
- 原因が明確な場合、Scout完了前にBuilderが修正開始可（Triageの判断）

### Mitigation Options Template

```markdown
## Mitigation Options

| Option | Impact | Reversibility | Time to Implement |
|--------|--------|---------------|-------------------|
| [Option 1] | [impact] | [easy/medium/hard] | [X min] |
| [Option 2] | [impact] | [easy/medium/hard] | [X min] |
| [Option 3] | [impact] | [easy/medium/hard] | [X min] |

**Recommended:** [Option] because [reason]
```

---

## Phase 4: RESOLVE & VERIFY (Variable)

### Resolution Checklist

- [ ] Root cause identified (via Scout)
- [ ] Fix implemented (via Builder)
- [ ] Fix deployed to production
- [ ] Monitoring shows recovery
- [ ] User-facing symptoms resolved
- [ ] No regression in other areas

### Resolution Verification Template

```markdown
## Resolution Verification

**Service Health:**
- [ ] Error rate returned to baseline: [X%]
- [ ] Latency returned to baseline: [X ms]
- [ ] Success rate recovered: [X%]

**User Verification:**
- [ ] Test account can complete affected flow
- [ ] No new error reports
- [ ] Affected users notified (if applicable)

**Monitoring:**
- [ ] Alerts cleared
- [ ] Dashboards show normal
- [ ] No secondary issues detected

**Extended Verification (SEV1/SEV2):**
- [ ] Primary user flow tested end-to-end
- [ ] Data integrity verified (no loss/corruption)
- [ ] Related systems verified (no cascading impact)
- [ ] 30-minute observation period completed without recurrence
- [ ] Rollback plan confirmed still viable
```

---

## Phase 5: LEARN & IMPROVE (Post-resolution)

### Postmortem Timeline

| Severity | Deadline |
|----------|----------|
| SEV1 | Within 24 hours |
| SEV2 | Within 48 hours |
| SEV3/4 | Within 1 week (if warranted) |

### External Incident Report Decision

| Report Type | Audience | Timing |
|-------------|----------|--------|
| Detailed Report | Customers, Partners, Executives | After SEV1/SEV2 resolution (Recommended) |
| Summary Report | When quick sharing is needed | On request |
| None | Internal impact only | SEV3/SEV4 |

### Knowledge Capture (Required for SEV1/SEV2)

After postmortem completion, add learnings to `.agents/PROJECT.md`:

```markdown
| YYYY-MM-DD | Triage | Postmortem: [incident title] | Root cause: [brief] | Prevention: [action item] |
```

Also update `.agents/triage.md` if:
- New incident pattern discovered
- Effective mitigation strategy found
- Runbook gap identified

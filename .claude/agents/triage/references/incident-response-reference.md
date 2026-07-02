# triage — インシデント対応 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## INCIDENT SEVERITY LEVELS

Use this matrix to classify incidents consistently.

| Level | Name | Criteria | Response Time | Example |
|-------|------|----------|---------------|---------|
| **SEV1** | Critical | Complete outage, data loss risk, security breach | Immediate | Production DB down, API unreachable |
| **SEV2** | Major | Significant degradation, major feature broken | < 30 min | Payments failing, auth broken |
| **SEV3** | Minor | Partial degradation, workaround exists | < 2 hours | Search slow, minor UI bug |
| **SEV4** | Low | Minimal impact, cosmetic issues | < 24 hours | Typo, styling glitch |

### Severity Assessment Checklist

```markdown
## Severity Assessment

**Impact Scope:**
- [ ] All users affected
- [ ] Specific user segment affected
- [ ] Single user affected
- [ ] Internal only

**Business Impact:**
- [ ] Revenue loss (direct)
- [ ] Revenue loss (indirect)
- [ ] Reputation damage
- [ ] Compliance violation
- [ ] No business impact

**Data Impact:**
- [ ] Data loss confirmed
- [ ] Data corruption possible
- [ ] Data exposure risk
- [ ] No data impact

**Service State:**
- [ ] Complete outage
- [ ] Degraded performance
- [ ] Partial functionality
- [ ] Fully operational

**Calculated Severity:** SEV[1-4]
```

---

## INCIDENT RESPONSE WORKFLOW

| Phase | Time | Key Actions |
|-------|------|-------------|
| **1. Detect & Classify** | 0-5 min | Acknowledge, gather info, classify severity, notify stakeholders |
| **2. Assess & Contain** | 5-15 min | Impact assessment, containment decision, timeline documentation |
| **3. Investigate & Mitigate** | 15-60 min | Handoff to Scout, coordinate fix with Builder |
| **4. Resolve & Verify** | Variable | Deploy fix, verify recovery, regression check |
| **5. Learn & Improve** | Post-resolution | Postmortem (SEV1: 24h, SEV2: 48h), knowledge capture |

### Containment Options Quick Reference

| Action | When to Use | Risk |
|--------|-------------|------|
| Feature flag disable | Feature-specific issue | Functionality loss |
| Rollback deploy | Recent deploy caused issue | May lose good changes |
| Scale up resources | Load-related issue | Cost increase |
| Failover to backup | Primary system failure | Data sync lag |

See `references/response-workflow.md` for detailed phase templates.

---

## POSTMORTEM & REPORTS

| Document Type | Audience | When to Create |
|---------------|----------|----------------|
| **Internal Postmortem** | Technical team | All SEV1/SEV2, warranted SEV3/4 |
| **Professional Incident Report (PIR)** | Customers, Partners, Executives | SEV1/SEV2 resolution |
| **Executive Summary** | Quick sharing | On request |

### Postmortem Key Sections

1. **Incident Summary** - ID, Severity, Duration, Impact
2. **Timeline** - Chronological events (UTC)
3. **Root Cause** - 5 Whys analysis
4. **Detection & Response** - What worked, what didn't
5. **Action Items** - P0/P1/P2 with owners
6. **Lessons Learned**

### Postmortem Deadlines

| Severity | Deadline |
|----------|----------|
| SEV1 | Within 24 hours |
| SEV2 | Within 48 hours |
| SEV3/4 | Within 1 week (if warranted) |

See `references/postmortem-templates.md` for full templates.

---

## COMMUNICATION & RUNBOOKS

### Communication Templates

| Template | Purpose |
|----------|---------|
| Initial Notification | SEV1/SEV2 first alert |
| Status Update | Ongoing progress |
| Resolution Notice | Incident closed |

### Escalation Matrix

| Condition | Action | Who to Notify |
|-----------|--------|---------------|
| SEV1 detected | Immediate escalation | On-call lead, Engineering manager |
| SEV2 > 30 min | Escalate to leadership | Engineering manager |
| Security suspected | Involve Sentinel | Security team |
| Data loss confirmed | Escalate immediately | CTO, Legal (if PII) |

### Runbooks Available

| Runbook | Quick Diagnostics Focus |
|---------|------------------------|
| Database Issue | Connection pool, replication, disk, locks |
| API Outage | Error rates, latency, upstream, deployments |
| Third-Party Integration | Vendor status, response times, auth |

See `references/runbooks-communication.md` for full templates.

---


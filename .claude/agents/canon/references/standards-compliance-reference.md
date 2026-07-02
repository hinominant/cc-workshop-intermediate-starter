# canon — 標準準拠 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## STANDARDS CATEGORIES

### 1. Security Standards

| Standard | Scope | Use Case | Reference |
|----------|-------|----------|-----------|
| **OWASP Top 10** | Web application security | Basic security assessment | references/security-standards.md |
| **OWASP ASVS** | Verification standard | Detailed security verification | references/security-standards.md |
| **NIST CSF** | Cybersecurity framework | Enterprise security posture | references/security-standards.md |
| **CIS Controls** | Prioritized controls | Implementation guidance | references/security-standards.md |

### 2. Accessibility Standards

| Standard | Scope | Use Case | Reference |
|----------|-------|----------|-----------|
| **WCAG 2.1 / 2.2** | Web content accessibility | Web accessibility | references/accessibility-standards.md |
| **WAI-ARIA** | Accessible rich internet applications | Dynamic content | references/accessibility-standards.md |
| **JIS X 8341-3** | Japanese accessibility | Japan-specific compliance | references/accessibility-standards.md |

### 3. API / Data Standards

| Standard | Scope | Use Case | Reference |
|----------|-------|----------|-----------|
| **OpenAPI 3.x** | API specification | REST API documentation | references/api-standards.md |
| **JSON Schema** | Data validation | Schema definition | references/api-standards.md |
| **RFC 7231** | HTTP semantics | HTTP method/status usage | references/api-standards.md |
| **GraphQL Spec** | GraphQL | GraphQL API design | references/api-standards.md |

### 4. Code Quality Standards

| Standard | Scope | Use Case | Reference |
|----------|-------|----------|-----------|
| **ISO/IEC 25010** | Software quality model | Quality assessment | references/quality-standards.md |
| **IEEE 830** | Requirements specification | SRS documents | references/quality-standards.md |
| **Clean Code** | Code principles | Readability assessment | references/quality-standards.md |
| **SOLID** | OOP principles | Design assessment | references/quality-standards.md |

### 5. Infrastructure / Operations Standards

| Standard | Scope | Use Case | Reference |
|----------|-------|----------|-----------|
| **12-Factor App** | Cloud-native apps | Application architecture | references/quality-standards.md |
| **CNCF Best Practices** | Cloud native | Container/K8s patterns | references/quality-standards.md |
| **SRE Principles** | Site reliability | Operations practices | references/quality-standards.md |

### 6. Industry-Specific Standards (Reference Only)

| Standard | Industry | Note |
|----------|----------|------|
| **PCI-DSS** | Payment | Requires certified assessor for formal compliance |
| **HIPAA** | Healthcare | Legal requirements, consult compliance team |
| **GDPR** | Privacy | Legal requirements, consult legal team |
| **SOC 2** | SaaS | Formal audit required for certification |

**Important:** Canon provides guidance on industry-specific standards but does NOT make legal compliance determinations. Always consult appropriate professionals for regulated industries.

---

## COMPLIANCE ASSESSMENT FRAMEWORK

### Assessment Levels

| Level | Symbol | Definition | Action |
|-------|--------|------------|--------|
| **Compliant** | ✅ | Fully meets standard requirement | Document and maintain |
| **Partial** | ⚠️ | Partially meets, improvement possible | Prioritize enhancement |
| **Non-compliant** | ❌ | Does not meet requirement | Requires remediation |
| **Not Applicable** | ➖ | Requirement doesn't apply to context | Document exemption reason |

### Severity Classification

| Severity | Definition | Timeline |
|----------|------------|----------|
| **Critical** | Security vulnerability, data breach risk | Immediate (24-48h) |
| **High** | Significant standards violation, user impact | Within 1 week |
| **Medium** | Notable deviation, best practice violation | Within 1 month |
| **Low** | Minor deviation, enhancement opportunity | Backlog |
| **Info** | Observation, no action required | Documentation only |

### Assessment Process

```
1. SCOPE DEFINITION
   ├─ Identify assessment target (codebase, feature, system)
   ├─ Determine applicable standards
   └─ Set compliance level target (A/AA/AAA, L1/L2/L3)

2. STANDARDS MAPPING
   ├─ Map requirements to code/components
   ├─ Identify gaps and overlaps
   └─ Note any exemptions with justification

3. COMPLIANCE EVALUATION
   ├─ Assess each requirement
   ├─ Document evidence (code locations, configurations)
   └─ Classify compliance level and severity

4. REMEDIATION PLANNING
   ├─ Prioritize findings by severity × impact
   ├─ Estimate remediation effort
   └─ Assign to appropriate agents

5. REPORTING
   ├─ Generate compliance report
   ├─ Create action items
   └─ Track remediation progress
```

### Evidence Documentation

When documenting compliance, include:
- **Standard Reference:** `OWASP A03:2021 - Injection`
- **Requirement:** Use parameterized queries for all database access
- **Evidence Location:** `src/api/users.ts:42`, `src/db/queries.ts:15-30`
- **Status:** ❌ Non-compliant
- **Finding:** String concatenation used in SQL query construction
- **Recommendation:** Replace with parameterized query or prepared statement
- **Priority:** Critical
- **Remediation Agent:** Builder (code change), Sentinel (verification)

---

## COMPLIANCE REPORT TEMPLATE

```markdown
# Canon Compliance Report

## Executive Summary

| Metric | Value |
|--------|-------|
| Report Date | YYYY-MM-DD |
| Assessment Target | [Codebase/Feature/System] |
| Standard(s) Assessed | [e.g., OWASP ASVS 4.0, WCAG 2.1 AA] |
| Overall Compliance | XX% |
| Critical Findings | X |
| High Findings | X |
| Medium Findings | X |
| Low Findings | X |

## Compliance by Category

| Category | Compliant | Partial | Non-compliant | N/A |
|----------|-----------|---------|---------------|-----|
| [Category 1] | X | X | X | X |
| [Category 2] | X | X | X | X |
| **Total** | X | X | X | X |

## Critical Findings

### Finding ID: CANON-001

- **Standard:** [Standard Name and Version]
- **Requirement:** [Specific requirement citation]
- **Citation:** [Section/Clause number]
- **Status:** ❌ Non-compliant
- **Severity:** Critical
- **Evidence:** [File path:line number]
- **Finding:** [Description of the issue]
- **Impact:** [What could go wrong]
- **Recommendation:** [How to fix]
- **Remediation Agent:** [Builder/Sentinel/Palette/etc.]
- **Estimated Effort:** [Low/Medium/High]

### Finding ID: CANON-002
...

## Recommendations Summary

| Priority | Finding ID | Standard | Remediation Agent | Effort |
|----------|------------|----------|-------------------|--------|
| 1 | CANON-001 | OWASP A03 | Builder | Medium |
| 2 | CANON-003 | WCAG 1.1.1 | Palette | Low |
| ... | ... | ... | ... | ... |

## Appendix: Standards Reference

| Standard | Version | Scope | Document Link |
|----------|---------|-------|---------------|
| [Standard] | [Version] | [What it covers] | [URL/path] |

## Next Steps

1. [Immediate action items]
2. [Short-term improvements]
3. [Long-term compliance roadmap]
```

---


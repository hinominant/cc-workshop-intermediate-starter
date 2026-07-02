# Probe — Security Testing Templates (reference)

> Progressive Disclosure: SKILL.md から抽出した詳細な検査テンプレ集 (ARIS-1577 #2)。
> ZAP / OWASP / GraphQL / OAuth / Nuclei / SARIF / CVSS / レポート雛形。必要時に参照する。

## OWASP ZAP TESTING TEMPLATES

### Baseline Scan Configuration

```yaml
# zap-baseline.yaml
env:
  contexts:
    - name: "Application Context"
      urls:
        - "${TARGET_URL}"
      includePaths:
        - "${TARGET_URL}.*"
      excludePaths:
        - ".*logout.*"
        - ".*\.js$"
        - ".*\.css$"
      authentication:
        method: "form"
        parameters:
          loginUrl: "${LOGIN_URL}"
          loginRequestData: "username={%username%}&password={%password%}"

jobs:
  - type: spider
    parameters:
      maxDuration: 5
      maxDepth: 5
  - type: passiveScan-wait
    parameters:
      maxDuration: 10
  - type: activeScan
    parameters:
      maxRuleDurationInMins: 5
      maxScanDurationInMins: 30
```

### API Scan Configuration

```yaml
# zap-api-scan.yaml
env:
  contexts:
    - name: "API Context"
      urls:
        - "${API_BASE_URL}"
      technology:
        include:
          - "API"
          - "Language.JavaScript"

jobs:
  - type: openapi
    parameters:
      apiUrl: "${OPENAPI_SPEC_URL}"
  - type: activeScan
    policyDefinition:
      rules:
        - id: 40012  # Cross Site Scripting (Reflected)
          strength: "HIGH"
        - id: 40014  # Cross Site Scripting (Persistent)
          strength: "HIGH"
        - id: 40018  # SQL Injection
          strength: "HIGH"
        - id: 40019  # SQL Injection - MySQL
          strength: "MEDIUM"
        - id: 90019  # Server Side Include
          strength: "MEDIUM"
        - id: 90020  # Remote OS Command Injection
          strength: "HIGH"
```

### Authentication Test Scenarios

```yaml
# auth-test-scenarios.yaml
scenarios:
  - name: "Session Fixation"
    steps:
      - action: "Get session before login"
      - action: "Login with valid credentials"
      - verify: "Session ID changed after login"

  - name: "Session Timeout"
    steps:
      - action: "Login and get session"
      - action: "Wait for timeout period"
      - verify: "Session is invalidated"

  - name: "Logout Effectiveness"
    steps:
      - action: "Login and perform actions"
      - action: "Logout"
      - verify: "Previous session cannot be reused"

  - name: "Concurrent Session"
    steps:
      - action: "Login from location A"
      - action: "Login same user from location B"
      - verify: "Policy enforced (allow/deny/invalidate)"
```

---

## PENETRATION TEST SCENARIOS

### OWASP Top 10 Test Matrix

| Category | Test Scenario | Tool/Method | Priority |
|----------|---------------|-------------|----------|
| **A01: Broken Access Control** | IDOR testing | Manual + ZAP | HIGH |
| | Privilege escalation | Manual | HIGH |
| | Missing function access | ZAP Spider | MEDIUM |
| **A02: Cryptographic Failures** | TLS configuration | testssl.sh | HIGH |
| | Sensitive data exposure | ZAP passive scan | HIGH |
| **A03: Injection** | SQL injection | sqlmap / ZAP | CRITICAL |
| | Command injection | Manual + ZAP | CRITICAL |
| | XSS (reflected/stored) | ZAP active scan | HIGH |
| **A04: Insecure Design** | Business logic flaws | Manual | MEDIUM |
| | Rate limiting bypass | Manual | MEDIUM |
| **A05: Security Misconfiguration** | Default credentials | Nuclei | HIGH |
| | Directory listing | ZAP Spider | MEDIUM |
| | Error message leakage | ZAP passive scan | LOW |
| **A06: Vulnerable Components** | CVE scanning | Nuclei / Trivy | HIGH |
| **A07: Auth Failures** | Brute force protection | Hydra / Manual | HIGH |
| | Session management | Manual | HIGH |
| **A08: Data Integrity** | Deserialization | Manual | HIGH |
| **A09: Logging Failures** | Log injection | Manual | MEDIUM |
| **A10: SSRF** | Internal URL access | Manual + ZAP | HIGH |

### API Security Test Checklist

```markdown
## API Security Tests

### Authentication
- [ ] API key exposure in URLs/logs
- [ ] JWT validation (signature, expiry, algorithm)
- [ ] OAuth flow security
- [ ] API versioning authentication bypass

### Authorization
- [ ] BOLA (Broken Object Level Authorization)
- [ ] BFLA (Broken Function Level Authorization)
- [ ] Mass assignment vulnerabilities
- [ ] Rate limiting per user/endpoint

### Input Validation
- [ ] SQL injection in parameters
- [ ] NoSQL injection
- [ ] XML external entity (XXE)
- [ ] JSON injection
- [ ] GraphQL injection (if applicable)

### Data Exposure
- [ ] Excessive data in responses
- [ ] Sensitive data in error messages
- [ ] Debug endpoints accessible
- [ ] Internal IDs exposed
```

---

## GRAPHQL SECURITY TESTING

### GraphQL Attack Vectors

| Attack | Description | Test Method |
|--------|-------------|-------------|
| **Introspection** | Schema exposure | Query `__schema` |
| **Batch Query** | DoS via nested queries | Depth/complexity limits |
| **Field Duplication** | Resource exhaustion | Duplicate field queries |
| **Alias Overload** | Bypass rate limiting | Multiple aliases |
| **Injection** | SQL/NoSQL via variables | Malicious variable values |
| **Authorization Bypass** | Access unauthorized data | Query protected fields |

### GraphQL Security Test Scenarios

```yaml
# graphql-security-tests.yaml
scenarios:
  - name: "Introspection Exposure"
    description: "Check if introspection is enabled in production"
    query: |
      query IntrospectionQuery {
        __schema {
          types { name }
        }
      }
    expected: "Should return error or limited schema in production"
    severity: MEDIUM

  - name: "Query Depth Attack"
    description: "Test for unbounded query depth"
    query: |
      query DepthAttack {
        user(id: 1) {
          posts {
            author {
              posts {
                author {
                  posts { id }
                }
              }
            }
          }
        }
      }
    expected: "Should be rejected by depth limiter"
    severity: HIGH

  - name: "Batch Query Attack"
    description: "Test for batch query DoS"
    query: |
      query BatchAttack {
        a1: user(id: 1) { email }
        a2: user(id: 2) { email }
        # ... repeat 100 times
        a100: user(id: 100) { email }
      }
    expected: "Should be rate limited or rejected"
    severity: MEDIUM

  - name: "Field Suggestion Leak"
    description: "Error messages revealing field names"
    query: |
      query FieldLeak {
        user(id: 1) { passwrod }  # Intentional typo
      }
    expected: "Should not suggest 'password' in error"
    severity: LOW

  - name: "Variable Injection"
    description: "SQL/NoSQL injection via variables"
    query: |
      query UserQuery($id: ID!) {
        user(id: $id) { email name }
      }
    variables:
      - { "id": "1 OR 1=1" }
      - { "id": "1'; DROP TABLE users;--" }
      - { "id": { "$ne": null } }  # NoSQL
    expected: "Should reject malicious input"
    severity: CRITICAL

  - name: "Authorization Bypass"
    description: "Access other user's private data"
    query: |
      query OtherUserData {
        user(id: $targetUserId) {
          email
          privateNotes
          paymentMethods { cardNumber }
        }
      }
    auth: "Use token of different user"
    expected: "Should deny access to private fields"
    severity: HIGH
```

### GraphQL Security Checklist

```markdown
## GraphQL Security Verification

### Configuration
- [ ] Introspection disabled in production
- [ ] Query depth limit configured (recommend: 10)
- [ ] Query complexity limit configured
- [ ] Batch query limit configured
- [ ] Persisted queries only (if applicable)

### Authentication
- [ ] All mutations require authentication
- [ ] Sensitive queries require authentication
- [ ] Token validation on every request

### Authorization
- [ ] Field-level authorization implemented
- [ ] Object-level authorization (BOLA prevention)
- [ ] Directive-based access control (@auth)

### Input Validation
- [ ] Custom scalars for sensitive types (Email, URL)
- [ ] Variable validation before resolver execution
- [ ] File upload size/type restrictions

### Error Handling
- [ ] No field suggestions in errors (production)
- [ ] No stack traces in responses
- [ ] Generic error messages for failures
```

---

## OAUTH 2.0 SECURITY TESTING

### OAuth Attack Vectors

| Attack | Flow Affected | Description |
|--------|---------------|-------------|
| **Authorization Code Theft** | Auth Code | Intercept code via redirect |
| **CSRF** | All | Forge authorization requests |
| **Token Leakage** | Implicit | Token in URL fragment |
| **PKCE Bypass** | Auth Code | Skip code_verifier |
| **Open Redirect** | All | Malicious redirect_uri |
| **Scope Manipulation** | All | Request excessive scopes |
| **Token Replay** | All | Reuse stolen tokens |
| **Client Impersonation** | All | Fake client_id |

### OAuth 2.0 Test Scenarios

```yaml
# oauth-security-tests.yaml
scenarios:
  authorization_code_flow:
    - name: "Redirect URI Validation"
      description: "Test redirect_uri whitelist enforcement"
      tests:
        - uri: "https://evil.com/callback"
          expected: "REJECT"
        - uri: "https://legit.com/callback/../../../evil"
          expected: "REJECT"
        - uri: "https://legit.com.evil.com/callback"
          expected: "REJECT"
        - uri: "https://legit.com/callback?extra=param"
          expected: "Check if params allowed"
      severity: CRITICAL

    - name: "PKCE Enforcement"
      description: "Verify PKCE is required for public clients"
      tests:
        - step: "Request auth without code_challenge"
          expected: "REJECT for public clients"
        - step: "Exchange code without code_verifier"
          expected: "REJECT"
        - step: "Use incorrect code_verifier"
          expected: "REJECT"
      severity: HIGH

    - name: "Authorization Code Replay"
      description: "Test one-time use of authorization codes"
      tests:
        - step: "Exchange valid code for token"
          expected: "SUCCESS"
        - step: "Exchange same code again"
          expected: "REJECT + revoke previous tokens"
      severity: HIGH

    - name: "State Parameter CSRF"
      description: "Verify state parameter prevents CSRF"
      tests:
        - state: "missing"
          expected: "REJECT"
        - state: "wrong_value"
          expected: "REJECT"
        - state: "predictable_value"
          expected: "WARN - should be random"
      severity: HIGH

  token_security:
    - name: "Token Scope Validation"
      description: "Request more scopes than authorized"
      tests:
        - authorized: ["read"]
          requested: ["read", "write", "admin"]
          expected: "Grant only authorized scopes"
      severity: MEDIUM

    - name: "Refresh Token Rotation"
      description: "Verify refresh tokens are rotated"
      tests:
        - step: "Use refresh token"
          expected: "New access + refresh token"
        - step: "Reuse old refresh token"
          expected: "REJECT + revoke token family"
      severity: HIGH

    - name: "Token Binding"
      description: "Token bound to original client"
      tests:
        - step: "Use token with different client_id"
          expected: "REJECT"
        - step: "Use token from different IP (if binding enabled)"
          expected: "REJECT or re-auth"
      severity: MEDIUM

  implicit_flow:
    - name: "Token in URL"
      description: "Check token exposure in browser history"
      note: "Implicit flow is deprecated - recommend migration to Auth Code + PKCE"
      tests:
        - check: "Token in URL fragment (not query)"
          expected: "Fragment only (# not ?)"
        - check: "Token in Referer header"
          expected: "Stripped by browser policy"
      severity: HIGH
```

### OAuth Security Checklist

```markdown
## OAuth 2.0 Security Verification

### Authorization Server
- [ ] Redirect URI strict matching (no wildcards in production)
- [ ] PKCE required for public clients (SPAs, mobile)
- [ ] State parameter required and validated
- [ ] Authorization codes single-use
- [ ] Short authorization code lifetime (<10 min)

### Token Management
- [ ] Access token short-lived (<1 hour)
- [ ] Refresh token rotation enabled
- [ ] Token revocation endpoint available
- [ ] Refresh token family revocation on reuse

### Client Security
- [ ] Confidential clients use client_secret
- [ ] Public clients use PKCE (code_challenge)
- [ ] Client credentials not exposed in frontend

### Scope & Consent
- [ ] Minimum necessary scopes requested
- [ ] Scope changes require re-consent
- [ ] Sensitive scopes require step-up auth

### Transport Security
- [ ] HTTPS required for all endpoints
- [ ] Token not logged in server logs
- [ ] CORS properly configured for token endpoint
```

### OAuth Test Script Template

```bash
#!/bin/bash
# oauth-security-test.sh

BASE_URL="${OAUTH_SERVER_URL}"
CLIENT_ID="${CLIENT_ID}"
REDIRECT_URI="${REDIRECT_URI}"

echo "=== OAuth 2.0 Security Tests ==="

# Test 1: Open Redirect
echo "[TEST] Redirect URI Validation"
EVIL_REDIRECT="https://evil.com/callback"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  "${BASE_URL}/authorize?client_id=${CLIENT_ID}&redirect_uri=${EVIL_REDIRECT}&response_type=code")
if [ "$RESPONSE" != "400" ]; then
  echo "[FAIL] Open redirect not blocked (HTTP $RESPONSE)"
else
  echo "[PASS] Malicious redirect_uri rejected"
fi

# Test 2: Missing State Parameter
echo "[TEST] State Parameter Required"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  "${BASE_URL}/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code")
# Note: Check if state is optional (should be required)
echo "[INFO] Response without state: $RESPONSE"

# Test 3: PKCE Enforcement
echo "[TEST] PKCE Required for Public Client"
RESPONSE=$(curl -s -X POST "${BASE_URL}/token" \
  -d "grant_type=authorization_code" \
  -d "code=${AUTH_CODE}" \
  -d "client_id=${CLIENT_ID}" \
  -d "redirect_uri=${REDIRECT_URI}")
# Should fail without code_verifier
echo "[INFO] Token response without PKCE: $RESPONSE"
```

---

## NUCLEI TEMPLATES

### Custom Vulnerability Templates

Nuclei enables rapid, template-based vulnerability scanning. Use custom templates for project-specific checks.

### Template Structure

```yaml
# nuclei-template-structure.yaml
id: template-unique-id
info:
  name: "Human readable name"
  author: "your-name"
  severity: critical|high|medium|low|info
  description: "What this template detects"
  reference:
    - https://cve.mitre.org/...
    - https://owasp.org/...
  tags: tag1,tag2,tag3

requests:
  - method: GET|POST|PUT|DELETE
    path:
      - "{{BaseURL}}/path"
    matchers:
      - type: word|regex|status|dsl
        words:
          - "pattern to match"
```

### Common Security Templates

```yaml
# nuclei/sensitive-files.yaml
id: sensitive-file-exposure
info:
  name: "Sensitive File Exposure"
  author: "probe-agent"
  severity: high
  description: "Detects exposed sensitive files"
  tags: exposure,config,sensitive

requests:
  - method: GET
    path:
      - "{{BaseURL}}/.env"
      - "{{BaseURL}}/.git/config"
      - "{{BaseURL}}/config.php.bak"
      - "{{BaseURL}}/database.yml"
      - "{{BaseURL}}/wp-config.php.bak"
      - "{{BaseURL}}/.aws/credentials"
      - "{{BaseURL}}/.docker/config.json"
    matchers-condition: or
    matchers:
      - type: word
        words:
          - "DB_PASSWORD"
          - "AWS_SECRET"
          - "api_key"
          - "[core]"  # git config
        condition: or
      - type: status
        status:
          - 200
---
# nuclei/debug-endpoints.yaml
id: debug-endpoint-exposure
info:
  name: "Debug Endpoint Exposure"
  author: "probe-agent"
  severity: medium
  description: "Detects exposed debug/admin endpoints"
  tags: debug,admin,misconfiguration

requests:
  - method: GET
    path:
      - "{{BaseURL}}/debug"
      - "{{BaseURL}}/_debug"
      - "{{BaseURL}}/actuator"
      - "{{BaseURL}}/actuator/health"
      - "{{BaseURL}}/actuator/env"
      - "{{BaseURL}}/__debug__"
      - "{{BaseURL}}/graphql?query={__schema{types{name}}}"
      - "{{BaseURL}}/api/swagger.json"
      - "{{BaseURL}}/phpinfo.php"
    stop-at-first-match: true
    matchers-condition: or
    matchers:
      - type: word
        words:
          - "\"status\":\"UP\""
          - "__schema"
          - "swagger"
          - "phpinfo()"
        condition: or
---
# nuclei/jwt-vulnerabilities.yaml
id: jwt-weak-config
info:
  name: "JWT Weak Configuration"
  author: "probe-agent"
  severity: high
  description: "Detects JWT with weak algorithm or no signature"
  tags: jwt,auth,cryptography

requests:
  - method: GET
    path:
      - "{{BaseURL}}/api/user"
    headers:
      Authorization: "Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QiLCJhZG1pbiI6dHJ1ZX0."
    matchers:
      - type: dsl
        dsl:
          - "status_code != 401"
          - "!contains(body, 'invalid')"
          - "!contains(body, 'unauthorized')"
        condition: and
```

### Project-Specific Templates

```yaml
# nuclei/custom/idor-user-api.yaml
id: idor-user-endpoint
info:
  name: "IDOR in User API"
  author: "probe-agent"
  severity: high
  description: "Tests for Insecure Direct Object Reference in user endpoints"
  tags: idor,api,authorization

requests:
  - method: GET
    path:
      - "{{BaseURL}}/api/users/{{user_id}}"
    payloads:
      user_id:
        - "1"
        - "2"
        - "999999"
        - "{{target_user_id}}"
    headers:
      Authorization: "Bearer {{auth_token}}"
    matchers-condition: and
    matchers:
      - type: status
        status:
          - 200
      - type: word
        words:
          - "email"
          - "phone"
        condition: or
    extractors:
      - type: json
        json:
          - ".email"
          - ".id"
---
# nuclei/custom/rate-limit-check.yaml
id: rate-limit-bypass
info:
  name: "Rate Limit Bypass Check"
  author: "probe-agent"
  severity: medium
  description: "Tests rate limiting on sensitive endpoints"
  tags: rate-limit,dos,brute-force

requests:
  - method: POST
    path:
      - "{{BaseURL}}/api/auth/login"
    body: '{"email":"test@test.com","password":"wrong"}'
    headers:
      Content-Type: "application/json"
    race: true
    race_count: 100
    matchers:
      - type: dsl
        dsl:
          - "status_code != 429"
        condition: and
```

### Nuclei CI/CD Integration

```yaml
# .github/workflows/nuclei-scan.yml
name: Nuclei Security Scan

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  nuclei-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Nuclei
        run: |
          go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

      - name: Update Templates
        run: nuclei -update-templates

      - name: Run Nuclei Scan
        run: |
          nuclei -u ${{ secrets.TARGET_URL }} \
            -t nuclei-templates/ \
            -t .nuclei/ \
            -severity critical,high \
            -sarif-export nuclei-results.sarif \
            -json-export nuclei-results.json

      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: nuclei-results.sarif

      - name: Check for Critical Findings
        run: |
          if jq -e '.[] | select(.info.severity == "critical")' nuclei-results.json > /dev/null; then
            echo "Critical vulnerabilities found!"
            exit 1
          fi
```

---

## SARIF OUTPUT FORMAT

### Security Results in SARIF

SARIF (Static Analysis Results Interchange Format) enables standardized security findings integration with GitHub Security tab and other tools.

```json
{
  "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
  "version": "2.1.0",
  "runs": [
    {
      "tool": {
        "driver": {
          "name": "Probe Security Scanner",
          "version": "1.0.0",
          "rules": [
            {
              "id": "PROBE-SQL-001",
              "name": "SQL Injection",
              "shortDescription": {
                "text": "SQL Injection vulnerability detected"
              },
              "fullDescription": {
                "text": "User input is directly concatenated into SQL query without proper sanitization"
              },
              "help": {
                "text": "Use parameterized queries or prepared statements"
              },
              "properties": {
                "security-severity": "9.8",
                "tags": ["security", "sql-injection", "owasp-a03"]
              }
            }
          ]
        }
      },
      "results": [
        {
          "ruleId": "PROBE-SQL-001",
          "level": "error",
          "message": {
            "text": "SQL Injection confirmed at /api/users endpoint"
          },
          "locations": [
            {
              "physicalLocation": {
                "artifactLocation": {
                  "uri": "src/api/users.js"
                },
                "region": {
                  "startLine": 42
                }
              }
            }
          ],
          "fingerprints": {
            "primaryLocationLineHash": "abc123"
          }
        }
      ]
    }
  ]
}
```

### ZAP to SARIF Conversion

```python
# zap_to_sarif.py
import json
import sys

def convert_zap_to_sarif(zap_json_path, output_path):
    with open(zap_json_path) as f:
        zap_data = json.load(f)

    severity_map = {
        "High": "error",
        "Medium": "warning",
        "Low": "note",
        "Informational": "note"
    }

    sarif = {
        "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
        "version": "2.1.0",
        "runs": [{
            "tool": {
                "driver": {
                    "name": "OWASP ZAP",
                    "version": "2.14.0",
                    "rules": []
                }
            },
            "results": []
        }]
    }

    rules_added = set()

    for site in zap_data.get("site", []):
        for alert in site.get("alerts", []):
            rule_id = f"ZAP-{alert['pluginid']}"

            # Add rule definition if not already added
            if rule_id not in rules_added:
                sarif["runs"][0]["tool"]["driver"]["rules"].append({

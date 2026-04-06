# Security Review Checklist

Judge's security-focused review reference. Apply OWASP Top 10 thinking to every user-facing change.

---

## OWASP Top 10 Quick-Check for Code Review

| # | Category | What to Look For in a Diff |
|---|----------|---------------------------|
| A01 | Broken Access Control | Missing auth middleware, IDOR (user A accessing user B's data), missing role checks |
| A02 | Cryptographic Failures | Hardcoded secrets, weak hashing (MD5/SHA1 for passwords), HTTP for sensitive data, missing encryption at rest |
| A03 | Injection | String concatenation in SQL/NoSQL/LDAP queries, unsanitized input in shell commands, template injection |
| A04 | Insecure Design | Business logic flaws, missing rate limiting, no abuse prevention on sensitive operations |
| A05 | Security Misconfiguration | Debug mode in production, default credentials, overly permissive CORS, verbose error messages exposing internals |
| A06 | Vulnerable Components | Known-vulnerable dependency versions, unmaintained packages, dependencies with open CVEs |
| A07 | Auth Failures | Weak password policies, missing brute-force protection, session tokens in URLs, missing token expiration |
| A08 | Data Integrity Failures | Unsigned updates, untrusted deserialization, CI/CD pipeline without integrity checks |
| A09 | Logging Failures | Missing audit logs for security events, sensitive data in logs (passwords, tokens, PII) |
| A10 | SSRF | User-controlled URLs passed to server-side HTTP clients without allowlist validation |

---

## Input Validation Patterns

### Must Verify in Every Review

```typescript
// CHECK 1: Is user input validated before use?

// BAD: Direct use of request body
app.post('/users', (req, res) => {
  db.createUser(req.body); // No validation
});

// GOOD: Schema validation before processing
app.post('/users', (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ errors: result.error });
  db.createUser(result.data);
});
```

### Validation Checklist

| Input Type | Validations Required |
|-----------|---------------------|
| String | Max length, allowed characters, encoding (UTF-8), trim whitespace |
| Number | Min/max range, integer vs float, NaN check |
| Email | Format validation, domain check for business rules |
| URL | Protocol allowlist (https only), no internal IPs (SSRF prevention) |
| File upload | File type validation (magic bytes, not just extension), size limit, filename sanitization |
| Array | Max length, element type validation, no prototype pollution |
| Date | Valid format, reasonable range, timezone handling |
| ID/Reference | Exists in database, caller has permission to access |

---

## Authentication Review Points

| Check | Detail |
|-------|--------|
| Auth middleware present | Every protected route has authentication middleware applied |
| Token validation | JWT signature verified, expiration checked, issuer validated |
| Session management | Sessions invalidated on logout, timeout enforced, no fixation |
| Password handling | Bcrypt/argon2 with appropriate cost factor, no plain-text storage |
| MFA flows | MFA check cannot be bypassed by skipping steps in the flow |
| API key rotation | Keys have expiration, revocation endpoint exists |

### Common Auth Bypass Patterns

```typescript
// BYPASS 1: Auth check on wrong layer
// Middleware checks auth, but a direct function call bypasses it
router.get('/admin', authMiddleware, adminController.list);
// But someone imports adminController.list() directly elsewhere

// BYPASS 2: Missing authorization (auth != authz)
router.get('/users/:id', authMiddleware, (req, res) => {
  // Authenticated, but any user can access any user's data
  const user = await db.findUser(req.params.id); // IDOR vulnerability
  // MISSING: if (req.user.id !== req.params.id) return res.status(403)
});

// BYPASS 3: Race condition in permission check
const user = await getUser(id);    // has permission
await longOperation();              // permission revoked during this
await sensitiveAction(user);        // acts with stale permission
```

---

## Authorization Review Points

| Check | Detail |
|-------|--------|
| RBAC enforcement | Role checked at the resource level, not just the route level |
| IDOR prevention | Resource ownership verified: `WHERE id = :id AND owner_id = :userId` |
| Horizontal privilege | User A cannot access User B's data by changing an ID in the request |
| Vertical privilege | Regular user cannot access admin functions by guessing the URL |
| Field-level access | Sensitive fields (salary, SSN) filtered based on viewer's role |
| Bulk operations | Batch endpoints check permissions per item, not just the request |

---

## Sensitive Data Exposure

### Data That Must Never Appear In:

| Location | Prohibited Data |
|----------|----------------|
| Source code | API keys, database passwords, JWT secrets, encryption keys |
| Log output | Passwords, full credit card numbers, session tokens, PII |
| Error messages | Stack traces, internal file paths, database schema details |
| URL parameters | Session IDs, tokens, passwords (visible in browser history/logs) |
| Git history | Even if removed in latest commit, it persists in history |
| Client-side code | Server secrets, admin API endpoints, internal service URLs |

### Detection Patterns in Code Review

```
# Regex patterns to watch for in diffs:
password\s*=\s*["']          # Hardcoded password
(api[_-]?key|apikey)\s*=     # API key assignment
(secret|token)\s*=\s*["']    # Secret/token assignment
BEGIN (RSA|DSA|EC) PRIVATE   # Private key in code
console.log.*password        # Password in log output
console.log.*token           # Token in log output
console.log.*secret          # Secret in log output
```

---

## SQL Injection / XSS / CSRF Detection

### SQL Injection

```typescript
// VULNERABLE: String concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`;

// VULNERABLE: Template literal in query
db.query(`DELETE FROM sessions WHERE user_id = ${userId}`);

// SAFE: Parameterized query
db.query('SELECT * FROM users WHERE email = $1', [email]);

// SAFE: Query builder with parameters
db.users.findOne({ where: { email } });
```

### XSS (Cross-Site Scripting)

```typescript
// VULNERABLE: Injecting user input into HTML
element.innerHTML = `<div>${userInput}</div>`;

// VULNERABLE: React dangerouslySetInnerHTML with user data
<div dangerouslySetInnerHTML={{ __html: userComment }} />

// VULNERABLE: Unescaped output in server-side template
res.send(`<h1>Welcome, ${userName}</h1>`);

// SAFE: React's default escaping (JSX)
<div>{userInput}</div>

// SAFE: Explicit sanitization
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userComment) }} />
```

### CSRF (Cross-Site Request Forgery)

| Check | Detail |
|-------|--------|
| State-changing operations | POST/PUT/DELETE endpoints have CSRF token validation |
| Cookie settings | `SameSite=Strict` or `SameSite=Lax` on session cookies |
| Token in form | Hidden CSRF token field in HTML forms |
| API endpoints | Webhook/API endpoints from external services use signature verification instead of CSRF |

---

## Dependency Vulnerability Awareness

### Review Signals

| Signal | Action |
|--------|--------|
| New dependency added | Check npm audit / GitHub Advisory Database for known CVEs |
| Dependency version pinned to old version | Ask why not latest; check if security patches are missed |
| Dependency with < 100 weekly downloads | Higher risk of malicious package or abandoned maintenance |
| `postinstall` script in new dependency | Inspect what it does -- potential supply chain attack vector |
| Dependency imported but only one function used | Consider if the functionality can be implemented inline |

### Lock File Changes

When `package-lock.json` or `yarn.lock` changes:
- Verify the change corresponds to an intentional dependency update
- Large lock file changes from a "small" PR are suspicious
- Check that no unexpected packages were added as transitive dependencies

---

## Secret / Credential Detection in Code

### High-Confidence Patterns (S1 if found)

| Pattern | Example |
|---------|---------|
| AWS keys | `AKIA[0-9A-Z]{16}` |
| GitHub tokens | `ghp_[a-zA-Z0-9]{36}` or `github_pat_` |
| Slack tokens | `xoxb-`, `xoxp-`, `xoxs-` |
| JWT secrets | Hardcoded string in `jwt.sign()` call |
| Database URLs | `postgres://user:password@host` in source |
| Private keys | `-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----` |

### Medium-Confidence Patterns (S3, verify context)

| Pattern | Could Be False Positive |
|---------|------------------------|
| `password = "..."` | Could be a test fixture or example |
| `secret = "..."` | Could be a public client secret (OAuth) |
| `token = "..."` | Could be a CSRF token name, not a value |
| Base64-encoded long strings | Could be non-sensitive encoded data |

### Where to Check

- `.env` files committed to repo (should be in `.gitignore`)
- Config files with real values instead of placeholders
- Test files with production credentials
- Docker files with build-time secrets
- CI/CD pipeline definitions with inline secrets

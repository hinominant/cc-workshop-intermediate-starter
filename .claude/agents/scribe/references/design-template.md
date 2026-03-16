# Design Document Templates (HLD/LLD)

## HLD (High-Level Design) Template

```markdown
# HLD: [Feature Name]

## Document Info

| Item | Value |
|------|-------|
| Version | 1.0 |
| Author | [Name] |
| Status | Draft / Review / Approved |
| Created | YYYY-MM-DD |
| Updated | YYYY-MM-DD |
| Related PRD | PRD-[name] |
| Related SRS | SRS-[name] |

## Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | [Name] | Initial draft |

---

## 1. Overview

### 1.1 Purpose
This document describes the high-level design for [feature name].

### 1.2 Scope
- [What this design covers]
- [What this design does not cover]

### 1.3 Goals
- [Design goal 1]
- [Design goal 2]

### 1.4 References
- PRD: [link]
- SRS: [link]
- ADR: [link]

---

## 2. Architecture Overview

### 2.1 System Context Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     External Users                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │ Web App │  │Mobile   │  │ Admin   │                     │
│  │ Users   │  │ Users   │  │ Users   │                     │
│  └────┬────┘  └────┬────┘  └────┬────┘                     │
└───────┼────────────┼────────────┼───────────────────────────┘
        │            │            │
        ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Rate Limit  │  │ Auth Check  │  │ Routing     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Auth Service  │ │ User Service  │ │ [New Service] │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │                 │                 │
        └────────────────┬┘                 │
                         ▼                  ▼
              ┌──────────────────┐  ┌──────────────┐
              │   PostgreSQL     │  │    Redis     │
              └──────────────────┘  └──────────────┘
```

### 2.2 Component Overview

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| API Gateway | Routing, rate limiting, auth | Kong / AWS API Gateway |
| Auth Service | Authentication, authorization | Node.js / Express |
| User Service | User management | Node.js / Express |
| [New Service] | [Responsibility] | [Technology] |
| PostgreSQL | Primary data store | PostgreSQL 14 |
| Redis | Caching, sessions | Redis 7 |

---

## 3. Component Design

### 3.1 [Component Name]

#### 3.1.1 Responsibilities
- [Responsibility 1]
- [Responsibility 2]

#### 3.1.2 Interfaces

**Provided Interfaces:**
| Interface | Description | Protocol |
|-----------|-------------|----------|
| [Interface 1] | [Description] | REST |
| [Interface 2] | [Description] | gRPC |

**Required Interfaces:**
| Interface | Provider | Protocol |
|-----------|----------|----------|
| [Interface 1] | [Component] | REST |

#### 3.1.3 Component Diagram

```
┌─────────────────────────────────────────────┐
│              [Component Name]               │
│  ┌─────────────────────────────────────┐    │
│  │           Controller Layer          │    │
│  │  ┌──────────┐  ┌──────────┐        │    │
│  │  │ Handler1 │  │ Handler2 │        │    │
│  │  └────┬─────┘  └────┬─────┘        │    │
│  └───────┼─────────────┼──────────────┘    │
│          │             │                    │
│  ┌───────▼─────────────▼──────────────┐    │
│  │           Service Layer            │    │
│  │  ┌──────────┐  ┌──────────┐        │    │
│  │  │ Service1 │  │ Service2 │        │    │
│  │  └────┬─────┘  └────┬─────┘        │    │
│  └───────┼─────────────┼──────────────┘    │
│          │             │                    │
│  ┌───────▼─────────────▼──────────────┐    │
│  │         Repository Layer           │    │
│  │  ┌──────────┐  ┌──────────┐        │    │
│  │  │  Repo1   │  │  Repo2   │        │    │
│  │  └──────────┘  └──────────┘        │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### 3.2 [Component Name 2]
...

---

## 4. Data Design

### 4.1 Data Model Overview

```
┌──────────────┐       ┌──────────────┐
│    User      │       │   Session    │
├──────────────┤       ├──────────────┤
│ id (PK)      │──1:N──│ id (PK)      │
│ email        │       │ userId (FK)  │
│ name         │       │ token        │
│ status       │       │ expiresAt    │
└──────────────┘       └──────────────┘
        │
        │ 1:N
        ▼
┌──────────────┐
│  AuditLog    │
├──────────────┤
│ id (PK)      │
│ userId (FK)  │
│ action       │
│ timestamp    │
└──────────────┘
```

### 4.2 Database Selection
| Data | Database | Rationale |
|------|----------|-----------|
| User data | PostgreSQL | ACID, relationships |
| Sessions | Redis | Fast access, TTL |
| Audit logs | PostgreSQL | Compliance, querying |

---

## 5. Integration Design

### 5.1 External Integrations

| System | Type | Purpose | Error Handling |
|--------|------|---------|----------------|
| Auth0 | OAuth | Social login | Retry 3x, fallback |
| SendGrid | API | Emails | Queue, retry |
| Stripe | API | Payments | Idempotency keys |

### 5.2 Integration Patterns

**Pattern: Circuit Breaker**
- Used for: External API calls
- Config: 5 failures → open, 30s timeout

**Pattern: Retry with Backoff**
- Used for: Transient failures
- Config: 3 retries, exponential backoff

---

## 6. Security Design

### 6.1 Authentication
- Method: JWT with RS256
- Token lifetime: 24 hours
- Refresh token: 7 days

### 6.2 Authorization
- Model: RBAC
- Roles: admin, user, guest

### 6.3 Data Protection
- At rest: AES-256
- In transit: TLS 1.3
- PII: Encrypted columns

---

## 7. Deployment Architecture

### 7.1 Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                         AWS                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    VPC                               │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │              Public Subnet                     │  │   │
│  │  │  ┌─────────┐  ┌─────────┐                      │  │   │
│  │  │  │   ALB   │  │   NAT   │                      │  │   │
│  │  │  └────┬────┘  └─────────┘                      │  │   │
│  │  └───────┼────────────────────────────────────────┘  │   │
│  │          │                                           │   │
│  │  ┌───────▼────────────────────────────────────────┐  │   │
│  │  │              Private Subnet                    │  │   │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐        │  │   │
│  │  │  │  ECS    │  │  ECS    │  │  RDS    │        │  │   │
│  │  │  │ Service │  │ Service │  │ Primary │        │  │   │
│  │  │  └─────────┘  └─────────┘  └─────────┘        │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Scaling Strategy
| Component | Strategy | Trigger |
|-----------|----------|---------|
| API | Horizontal | CPU > 70% |
| Database | Read replicas | Connections > 80% |
| Cache | Cluster mode | Memory > 80% |

---

## 8. Non-Functional Considerations

### 8.1 Performance
| Aspect | Target | Approach |
|--------|--------|----------|
| API latency | < 200ms | Caching, connection pooling |
| Throughput | 1000 req/s | Horizontal scaling |

### 8.2 Reliability
| Aspect | Target | Approach |
|--------|--------|----------|
| Availability | 99.9% | Multi-AZ, health checks |
| Recovery | < 5 min | Automated failover |

### 8.3 Observability
- Logging: Structured JSON → CloudWatch
- Metrics: Prometheus → Grafana
- Tracing: OpenTelemetry → Jaeger

---

## 9. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| [Risk 1] | High | Medium | [Mitigation] |
| [Risk 2] | Medium | Low | [Mitigation] |

---

## 10. Decision Log

| ID | Decision | Rationale | Date |
|----|----------|-----------|------|
| D-001 | Use PostgreSQL | Team expertise, ACID needs | YYYY-MM-DD |
| D-002 | JWT for auth | Stateless, scalable | YYYY-MM-DD |

---

## 11. Open Questions

| ID | Question | Owner | Status |
|----|----------|-------|--------|
| Q-001 | [Question] | [Name] | Open |
```

---

## LLD (Low-Level Design) Template

```markdown
# LLD: [Feature Name]

## Document Info

| Item | Value |
|------|-------|
| Version | 1.0 |
| Author | [Name] |
| Status | Draft / Review / Approved |
| Created | YYYY-MM-DD |
| Related HLD | HLD-[name] |

---

## 1. Module Design

### 1.1 [Module Name]

#### Class Diagram

```
┌─────────────────────────────────────────┐
│            AuthController               │
├─────────────────────────────────────────┤
│ - authService: AuthService              │
├─────────────────────────────────────────┤
│ + login(dto: LoginDto): AuthResponse    │
│ + logout(token: string): void           │
│ + refresh(token: string): AuthResponse  │
└───────────────────┬─────────────────────┘
                    │ uses
                    ▼
┌─────────────────────────────────────────┐
│             AuthService                 │
├─────────────────────────────────────────┤
│ - userRepo: UserRepository              │
│ - tokenService: TokenService            │
│ - cacheService: CacheService            │
├─────────────────────────────────────────┤
│ + authenticate(email, password): Token  │
│ + validateToken(token): User            │
│ + revokeToken(token): void              │
│ - checkLockout(userId): boolean         │
│ - recordFailedAttempt(userId): void     │
└───────────────────┬─────────────────────┘
                    │ uses
                    ▼
┌─────────────────────────────────────────┐
│            UserRepository               │
├─────────────────────────────────────────┤
│ - db: DatabaseConnection                │
├─────────────────────────────────────────┤
│ + findByEmail(email): User | null       │
│ + updateLastLogin(userId): void         │
│ + incrementFailedAttempts(userId): void │
│ + lockAccount(userId, until): void      │
└─────────────────────────────────────────┘
```

#### Interface Definitions

```typescript
// DTOs
interface LoginDto {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  expiresAt: Date;
  user: UserDto;
}

// Service Interface
interface IAuthService {
  authenticate(email: string, password: string): Promise<AuthResponse>;
  validateToken(token: string): Promise<User>;
  revokeToken(token: string): Promise<void>;
}

// Repository Interface
interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  updateLastLogin(userId: string): Promise<void>;
  incrementFailedAttempts(userId: string): Promise<number>;
  lockAccount(userId: string, until: Date): Promise<void>;
}
```

#### Method Specifications

**Method: AuthService.authenticate()**

```
Input: email (string), password (string)
Output: AuthResponse
Throws: InvalidCredentialsError, AccountLockedError

Algorithm:
1. Find user by email
2. If not found, throw InvalidCredentialsError
3. Check if account is locked
   - If locked and lockUntil > now, throw AccountLockedError
   - If locked and lockUntil <= now, unlock account
4. Verify password hash
   - If invalid:
     a. Increment failed attempts
     b. If attempts >= 5, lock account for 30 min
     c. Throw InvalidCredentialsError
5. Reset failed attempts to 0
6. Generate JWT token
7. Store token in cache with TTL
8. Update lastLogin timestamp
9. Return AuthResponse

Complexity: O(1) - single DB lookup, hash comparison
Dependencies: bcrypt, jsonwebtoken, redis
```

### 1.2 [Module Name 2]
...

---

## 2. Data Structures

### 2.1 Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    failed_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_status CHECK (status IN ('active', 'inactive', 'locked'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Audit log table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### 2.2 Cache Structure

```
Key Pattern: session:{userId}:{tokenId}
Value: JSON {
  userId: string,
  roles: string[],
  createdAt: timestamp,
  expiresAt: timestamp
}
TTL: 86400 seconds (24 hours)

Key Pattern: lockout:{userId}
Value: number (failed attempts count)
TTL: 1800 seconds (30 minutes)
```

---

## 3. Sequence Diagrams

### 3.1 Login Flow

```
Client          Controller        Service          Repository       Cache
  │                 │                │                 │              │
  │─POST /login────▶│                │                 │              │
  │                 │─authenticate()─▶│                │              │
  │                 │                │─findByEmail()──▶│              │
  │                 │                │◀─user───────────│              │
  │                 │                │                 │              │
  │                 │                │─checkLockout()──│──────────────▶│
  │                 │                │◀─not locked─────│◀─────────────│
  │                 │                │                 │              │
  │                 │                │─verifyPassword()│              │
  │                 │                │  (bcrypt)       │              │
  │                 │                │                 │              │
  │                 │                │─generateToken() │              │
  │                 │                │                 │              │
  │                 │                │─storeSession()──│──────────────▶│
  │                 │                │◀─ok─────────────│◀─────────────│
  │                 │                │                 │              │
  │                 │                │─updateLastLogin()▶│             │
  │                 │                │◀─ok─────────────│              │
  │                 │◀─AuthResponse──│                 │              │
  │◀─200 + token────│                │                 │              │
```

### 3.2 Token Validation Flow

```
Client          Middleware        Cache          Service
  │                 │               │               │
  │─Request + JWT──▶│               │               │
  │                 │─get session───▶│              │
  │                 │◀─session data──│              │
  │                 │                │               │
  │                 │─validateToken()│──────────────▶│
  │                 │◀─user──────────│◀─────────────│
  │                 │                │               │
  │                 │─attach user to request        │
  │                 │                │               │
  │◀─continue to handler            │               │
```

---

## 4. Error Handling

### 4.1 Error Codes

| Code | HTTP | Message | Recovery Action |
|------|------|---------|-----------------|
| AUTH_001 | 400 | Invalid email format | Fix email input |
| AUTH_002 | 401 | Invalid credentials | Retry with correct credentials |
| AUTH_003 | 403 | Account locked | Wait and retry |
| AUTH_004 | 401 | Token expired | Re-authenticate |
| AUTH_005 | 401 | Token invalid | Re-authenticate |

### 4.2 Error Handling Strategy

```typescript
// Custom error classes
class AuthenticationError extends Error {
  constructor(
    public code: string,
    message: string,
    public httpStatus: number = 401
  ) {
    super(message);
  }
}

// Controller error handling
try {
  const result = await authService.authenticate(email, password);
  return res.json(result);
} catch (error) {
  if (error instanceof AuthenticationError) {
    return res.status(error.httpStatus).json({
      error: {
        code: error.code,
        message: error.message
      }
    });
  }
  // Log unexpected error
  logger.error('Unexpected auth error', { error });
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'An error occurred' }
  });
}
```

---

## 5. Configuration

### 5.1 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| JWT_SECRET | JWT signing secret | - | Yes |
| JWT_EXPIRES_IN | Token expiry | 24h | No |
| BCRYPT_ROUNDS | Password hash rounds | 12 | No |
| MAX_LOGIN_ATTEMPTS | Before lockout | 5 | No |
| LOCKOUT_DURATION | Lock duration (min) | 30 | No |

### 5.2 Feature Flags

| Flag | Description | Default |
|------|-------------|---------|
| AUTH_SOCIAL_LOGIN | Enable social login | false |
| AUTH_MFA | Enable MFA | false |

---

## 6. Testing Strategy

### 6.1 Unit Tests

| Class | Method | Test Cases |
|-------|--------|------------|
| AuthService | authenticate | valid creds, invalid creds, locked account |
| AuthService | validateToken | valid token, expired token, invalid token |
| TokenService | generate | creates valid JWT |
| TokenService | verify | validates correctly |

### 6.2 Integration Tests

| Scenario | Components | Assertions |
|----------|------------|------------|
| Login flow | API → Service → DB → Cache | Token returned, session stored |
| Lockout flow | API → Service → DB | Account locked after 5 attempts |

---

## 7. Migration Plan

### 7.1 Database Migrations

```sql
-- Migration: 001_create_users
CREATE TABLE users (...);

-- Migration: 002_add_lockout_fields
ALTER TABLE users ADD COLUMN failed_attempts INT DEFAULT 0;
ALTER TABLE users ADD COLUMN locked_until TIMESTAMP;
```

### 7.2 Rollback Plan

```sql
-- Rollback: 002_add_lockout_fields
ALTER TABLE users DROP COLUMN failed_attempts;
ALTER TABLE users DROP COLUMN locked_until;
```
```

---

## Design Document Quality Checklist

### HLD
- [ ] System context diagram exists
- [ ] Component structure is clear
- [ ] Integration points are defined
- [ ] Security design is included
- [ ] Scaling strategy exists
- [ ] Deployment architecture is defined

### LLD
- [ ] Class diagram/module structure exists
- [ ] Interface definitions exist
- [ ] Method specifications (algorithms) exist
- [ ] Database schema exists
- [ ] Sequence diagrams exist
- [ ] Error handling strategy exists
- [ ] Configuration items are listed

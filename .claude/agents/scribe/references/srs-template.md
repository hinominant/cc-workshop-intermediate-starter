# SRS (Software Requirements Specification) Template

## Template

```markdown
# SRS: [Feature Name]

## Document Info

| Item | Value |
|------|-------|
| Version | 1.0 |
| Author | [Name] |
| Status | Draft / Review / Approved |
| Created | YYYY-MM-DD |
| Updated | YYYY-MM-DD |
| Related PRD | PRD-[name] |

## Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | [Name] | Initial draft |

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for [feature name].

### 1.2 Scope
- Included: [What is covered]
- Excluded: [What is not covered]

### 1.3 Definitions & Abbreviations
| Term | Definition |
|------|------------|
| [Term] | [Definition] |

### 1.4 References
- PRD: [link]
- ADR: [link]
- OpenAPI: [link]

---

## 2. System Overview

### 2.1 System Context
```
┌─────────────────────────────────────────┐
│              External Systems           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │ Auth0   │  │ Stripe  │  │ SendGrid│  │
│  └────┬────┘  └────┬────┘  └────┬────┘  │
│       │            │            │       │
└───────┼────────────┼────────────┼───────┘
        │            │            │
        ▼            ▼            ▼
┌─────────────────────────────────────────┐
│           Target System                 │
│  ┌─────────────────────────────────┐    │
│  │     [Feature Module]            │    │
│  │  ┌─────┐  ┌─────┐  ┌─────┐     │    │
│  │  │ API │──│Logic│──│ DB  │     │    │
│  │  └─────┘  └─────┘  └─────┘     │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### 2.2 System Features
| Feature | Description | Priority |
|---------|-------------|----------|
| [Feature 1] | [Description] | P0 |
| [Feature 2] | [Description] | P1 |

---

## 3. Functional Requirements

### 3.1 [Feature Area 1]: [Name]

#### FR-001: [Requirement Title]

**Description:**
[Detailed description of what the system shall do]

**Preconditions:**
- [Precondition 1]
- [Precondition 2]

**Input:**
| Parameter | Type | Required | Constraints | Description |
|-----------|------|----------|-------------|-------------|
| email | string | Yes | RFC 5322 | User email |
| password | string | Yes | 8-128 chars | User password |

**Processing Logic:**
1. Validate input format
2. Check if user exists in database
3. Verify password hash
4. Generate JWT token
5. Return token with expiry

**Output:**
| Field | Type | Description |
|-------|------|-------------|
| token | string | JWT access token |
| expiresAt | datetime | Token expiry timestamp |

**Error Conditions:**
| Condition | Error Code | HTTP Status | Message |
|-----------|------------|-------------|---------|
| Invalid email format | AUTH_001 | 400 | Invalid email format |
| User not found | AUTH_002 | 401 | Invalid credentials |
| Wrong password | AUTH_002 | 401 | Invalid credentials |
| Account locked | AUTH_003 | 403 | Account is locked |

**Business Rules:**
- BR-001: Account locks after 5 failed attempts
- BR-002: Lockout duration is 30 minutes

**Acceptance Criteria:**
```gherkin
Scenario: Successful login
  Given a registered user with email "user@example.com"
  And password "validPassword123"
  When the user submits login credentials
  Then a JWT token is returned
  And the token expires in 24 hours

Scenario: Failed login - wrong password
  Given a registered user with email "user@example.com"
  When the user submits wrong password
  Then error AUTH_002 is returned
  And failed attempt counter increments
```

#### FR-002: [Requirement Title]
...

### 3.2 [Feature Area 2]: [Name]

#### FR-003: [Requirement Title]
...

---

## 4. Data Requirements

### 4.1 Data Model

#### Entity: User
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| passwordHash | VARCHAR(255) | NOT NULL | Bcrypt hash |
| status | ENUM | NOT NULL | active/inactive/locked |
| failedAttempts | INT | DEFAULT 0 | Failed login count |
| lockedUntil | TIMESTAMP | NULLABLE | Lock expiry time |
| createdAt | TIMESTAMP | NOT NULL | Creation time |
| updatedAt | TIMESTAMP | NOT NULL | Last update time |

#### Entity: [Other Entity]
...

### 4.2 Data Relationships
```
User 1──N Session
User 1──N AuditLog
```

### 4.3 Data Validation Rules
| Field | Rule | Error Message |
|-------|------|---------------|
| email | RFC 5322 format | Invalid email format |
| password | Min 8 chars, 1 uppercase, 1 number | Password too weak |

---

## 5. Interface Requirements

### 5.1 API Specification

#### POST /api/v1/auth/login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2024-01-16T10:30:00Z",
    "user": {
      "id": "usr_123",
      "email": "user@example.com"
    }
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "error": {
    "code": "AUTH_002",
    "message": "Invalid credentials"
  }
}
```

**OpenAPI Reference:** See `api/openapi.yaml#/paths/~1auth~1login`

### 5.2 External Interfaces
| System | Protocol | Purpose | Rate Limit |
|--------|----------|---------|------------|
| Auth0 | OAuth 2.0 | Social login | 1000/min |
| SendGrid | REST API | Email verification | 100/min |

---

## 6. Non-Functional Requirements

### 6.1 Performance
| ID | Requirement | Metric | Target |
|----|-------------|--------|--------|
| NFR-P001 | Login API response time | p95 latency | < 200ms |
| NFR-P002 | Token validation | p95 latency | < 50ms |
| NFR-P003 | Concurrent logins | throughput | 100/sec |

### 6.2 Security
| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-S001 | Password hashing | bcrypt, cost=12 |
| NFR-S002 | Token encryption | JWT with RS256 |
| NFR-S003 | Rate limiting | 10 req/min per IP |
| NFR-S004 | Audit logging | All auth events |

### 6.3 Reliability
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-R001 | Availability | 99.9% |
| NFR-R002 | Mean Time to Recovery | < 5 min |
| NFR-R003 | Data durability | 99.999% |

### 6.4 Scalability
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-SC001 | Horizontal scaling | Auto-scale at 70% CPU |
| NFR-SC002 | Database connections | Pool size 20-100 |

### 6.5 Maintainability
| ID | Requirement | Standard |
|----|-------------|----------|
| NFR-M001 | Code coverage | > 80% |
| NFR-M002 | Documentation | All public APIs |
| NFR-M003 | Logging | Structured JSON logs |

---

## 7. Constraints

### 7.1 Technical Constraints
- Must use existing PostgreSQL database
- Must integrate with current Auth0 tenant
- JWT must be compatible with existing services

### 7.2 Business Constraints
- Must comply with GDPR
- Must support existing user base migration

### 7.3 Regulatory Constraints
- Password requirements per security policy
- Audit trail retention: 7 years

---

## 8. Assumptions & Dependencies

### 8.1 Assumptions
| ID | Assumption | Impact if False |
|----|------------|-----------------|
| A-001 | Auth0 supports required flows | Need alternative provider |
| A-002 | Email service is reliable | Need fallback mechanism |

### 8.2 Dependencies
| ID | Dependency | Owner | Status | Required By |
|----|------------|-------|--------|-------------|
| D-001 | User table schema | Schema agent | Done | FR-001 |
| D-002 | JWT signing keys | DevOps | Pending | FR-001 |

---

## 9. Traceability Matrix

| PRD Req | SRS Req | Test Case | Design Section |
|---------|---------|-----------|----------------|
| REQ-001 | FR-001 | TC-001, TC-002 | HLD-3.1 |
| REQ-002 | FR-002, FR-003 | TC-003 | HLD-3.2 |

---

## 10. Appendix

### A. State Diagrams

```
         ┌──────────┐
         │  Active  │
         └────┬─────┘
              │ 5 failed attempts
              ▼
         ┌──────────┐
         │  Locked  │
         └────┬─────┘
              │ 30 min passed
              ▼
         ┌──────────┐
         │  Active  │
         └──────────┘
```

### B. Sequence Diagrams

```
Client          API           Service        Database
  │              │               │              │
  │─POST /login─▶│               │              │
  │              │─validate()──▶│              │
  │              │              │─findUser()──▶│
  │              │              │◀─user─────────│
  │              │◀─token────────│              │
  │◀─200 + token─│               │              │
```

### C. Glossary
| Term | Definition |
|------|------------|
| JWT | JSON Web Token - compact token format |
| Bcrypt | Password hashing algorithm |
```

---

## SRS Quality Checklist

- [ ] All functional requirements have IDs (FR-XXX)
- [ ] Input/output is clearly defined
- [ ] Error conditions are comprehensive
- [ ] Business rules are documented
- [ ] Non-functional requirements have numeric targets
- [ ] Data model is defined
- [ ] API specifications are included
- [ ] Traceability matrix exists

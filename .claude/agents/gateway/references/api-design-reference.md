# gateway — API設計リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## OPENAPI SPECIFICATION TEMPLATES

### Basic OpenAPI Structure

```yaml
openapi: 3.1.0
info:
  title: [API Name]
  description: |
    [API description with key features]
  version: 1.0.0
  contact:
    name: API Support
    email: api-support@example.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://staging-api.example.com/v1
    description: Staging
  - url: http://localhost:3000/v1
    description: Local development

tags:
  - name: Users
    description: User management operations
  - name: Orders
    description: Order management operations

paths:
  # Endpoints defined here

components:
  schemas:
    # Data models defined here
  securitySchemes:
    # Authentication defined here
  responses:
    # Common responses defined here
```

### Endpoint Definition Template

```yaml
paths:
  /users:
    get:
      tags:
        - Users
      summary: List all users
      description: |
        Retrieve a paginated list of users.
        Supports filtering by status and sorting.
      operationId: listUsers
      parameters:
        - $ref: '#/components/parameters/limitParam'
        - $ref: '#/components/parameters/offsetParam'
        - name: status
          in: query
          description: Filter by user status
          schema:
            type: string
            enum: [active, inactive, pending]
        - name: sort
          in: query
          description: Sort field and direction
          schema:
            type: string
            example: created_at:desc
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserList'
              example:
                data:
                  - id: "usr_123"
                    name: "John Doe"
                    email: "john@example.com"
                    status: "active"
                meta:
                  total: 100
                  limit: 10
                  offset: 0
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
      security:
        - bearerAuth: []

    post:
      tags:
        - Users
      summary: Create a new user
      description: Create a new user account
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
            example:
              name: "John Doe"
              email: "john@example.com"
              password: "securePassword123"
      responses:
        '201':
          description: User created successfully
          headers:
            Location:
              description: URL of created resource
              schema:
                type: string
                example: /api/v1/users/usr_123
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          $ref: '#/components/responses/Conflict'
      security:
        - bearerAuth: []
```

### Schema Definition Template

```yaml
components:
  schemas:
    User:
      type: object
      required:
        - id
        - name
        - email
        - status
        - createdAt
      properties:
        id:
          type: string
          description: Unique user identifier
          example: "usr_123abc"
          readOnly: true
        name:
          type: string
          description: User's full name
          minLength: 1
          maxLength: 100
          example: "John Doe"
        email:
          type: string
          format: email
          description: User's email address
          example: "john@example.com"
        status:
          type: string
          enum: [active, inactive, pending]
          description: Account status
          example: "active"
        createdAt:
          type: string
          format: date-time
          description: Account creation timestamp
          readOnly: true
          example: "2024-01-15T10:30:00Z"
        updatedAt:
          type: string
          format: date-time
          description: Last update timestamp
          readOnly: true

    CreateUserRequest:
      type: object
      required:
        - name
        - email
        - password
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
        email:
          type: string
          format: email
        password:
          type: string
          format: password
          minLength: 8
          maxLength: 128
          writeOnly: true

    UserList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        meta:
          $ref: '#/components/schemas/PaginationMeta'

    PaginationMeta:
      type: object
      properties:
        total:
          type: integer
          description: Total number of items
        limit:
          type: integer
          description: Items per page
        offset:
          type: integer
          description: Current offset

    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: string
          description: Error code
          example: "VALIDATION_ERROR"
        message:
          type: string
          description: Human-readable message
          example: "Email format is invalid"
        details:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              message:
                type: string
```

### Common Components Template

```yaml
components:
  parameters:
    limitParam:
      name: limit
      in: query
      description: Maximum number of items to return
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 10

    offsetParam:
      name: offset
      in: query
      description: Number of items to skip
      schema:
        type: integer
        minimum: 0
        default: 0

    idParam:
      name: id
      in: path
      required: true
      description: Resource identifier
      schema:
        type: string

  responses:
    BadRequest:
      description: Invalid request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "BAD_REQUEST"
            message: "Invalid request parameters"

    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "UNAUTHORIZED"
            message: "Authentication required"

    Forbidden:
      description: Access denied
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "FORBIDDEN"
            message: "You don't have permission to access this resource"

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "NOT_FOUND"
            message: "Resource not found"

    Conflict:
      description: Resource conflict
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "CONFLICT"
            message: "Resource already exists"

    TooManyRequests:
      description: Rate limit exceeded
      headers:
        Retry-After:
          description: Seconds until rate limit resets
          schema:
            type: integer
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT authentication token

    apiKey:
      type: apiKey
      in: header
      name: X-API-Key
      description: API key for service-to-service calls
```

---

## API VERSIONING STRATEGIES

### Version Placement Options

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| **URL Path** | `/api/v1/users` | Clear, cacheable | URL changes on version |
| **Query Param** | `/api/users?version=1` | Same URL | Less discoverable |
| **Header** | `Accept: application/vnd.api.v1+json` | Clean URLs | Hidden, complex |
| **Content Negotiation** | `Accept: application/json; version=1` | Standard-based | Client complexity |

**Recommendation:** URL Path versioning for simplicity and clarity.

### Version Migration Strategy

```markdown
## Version Migration Plan: v1 → v2

### Timeline
| Phase | Duration | Action |
|-------|----------|--------|
| Announcement | Week 1 | Notify consumers of v2 release |
| Parallel Operation | Weeks 2-12 | Both v1 and v2 available |
| Deprecation Notice | Week 8 | Add deprecation headers to v1 |
| v1 Sunset | Week 13 | v1 returns 410 Gone |

### Deprecation Headers
```http
Deprecation: true
Sunset: Sat, 01 Mar 2025 00:00:00 GMT
Link: </api/v2/users>; rel="successor-version"
```

### Breaking vs Non-Breaking Changes

**Non-Breaking (Safe to add):**
- New optional fields in response
- New optional query parameters
- New endpoints
- New HTTP methods on existing endpoints
- More permissive validation

**Breaking (Requires new version):**
- Removing fields from response
- Changing field types
- Renaming fields
- Changing URL structure
- Stricter validation
- Changing authentication method
- Changing error response format
```

---

## BREAKING CHANGE DETECTION

### Detection Checklist

```markdown
## API Change Impact Analysis

**Endpoint:** [METHOD /path]
**Change Type:** [Add/Modify/Remove]

### Field Changes
| Field | Before | After | Breaking? |
|-------|--------|-------|-----------|
| [field] | [type] | [type] | [Yes/No] |

### Request Changes
- [ ] Required field added → BREAKING
- [ ] Field type changed → BREAKING
- [ ] Field removed → BREAKING (if clients send it)
- [ ] Validation stricter → BREAKING
- [ ] Optional field added → Safe

### Response Changes
- [ ] Field removed → BREAKING
- [ ] Field type changed → BREAKING
- [ ] Field renamed → BREAKING
- [ ] New field added → Safe
- [ ] Null handling changed → Potentially breaking

### Behavioral Changes
- [ ] Error codes changed → Potentially breaking
- [ ] Pagination changed → BREAKING
- [ ] Rate limits changed → Potentially breaking
- [ ] Authentication changed → BREAKING

### Impact Assessment
**Affected Clients:** [List known consumers]
**Migration Effort:** [Low/Medium/High]
**Recommended Action:** [Version bump / Deprecate / Safe to deploy]
```

### Compatibility Matrix

```
Before → After         Breaking?   Action Required
─────────────────────────────────────────────────
string → number        YES         New version
number → string        YES         New version
required → optional    NO          Safe
optional → required    YES         New version
field exists → removed YES         New version
null → non-null        YES         New version
non-null → nullable    NO          Safe (usually)
array → object         YES         New version
add enum value         NO*         Safe (lenient clients)
remove enum value      YES         New version
```

---

## API REVIEW CHECKLIST

### Design Review

```markdown
## API Design Review: [Endpoint Name]

### Naming & Structure
- [ ] URL follows REST conventions (nouns, plural)
- [ ] HTTP methods used correctly
- [ ] Consistent naming style (camelCase/snake_case)
- [ ] Nested resources properly structured
- [ ] Query parameters for filtering/sorting (not in body)

### Request
- [ ] Request body schema defined
- [ ] Required vs optional fields clear
- [ ] Field types appropriate
- [ ] Validation rules specified
- [ ] Examples provided

### Response
- [ ] Response schema defined
- [ ] All possible status codes documented
- [ ] Error responses consistent
- [ ] Pagination for list endpoints
- [ ] Timestamps in ISO 8601 format

### Security
- [ ] Authentication specified
- [ ] Authorization rules documented
- [ ] Sensitive data not in URL/logs
- [ ] Rate limiting defined
- [ ] Input validation prevents injection

### Documentation
- [ ] Summary and description present
- [ ] Request/response examples
- [ ] Error scenarios documented
- [ ] Edge cases covered
```

### Specification Validation

Before handoff to Builder, validate the specification:

```markdown
## API Specification Validation Checklist

### Schema Completeness
- [ ] すべてのリクエストボディにスキーマ定義がある
- [ ] すべてのレスポンスにスキーマ定義がある
- [ ] 必須フィールドが明示されている
- [ ] フィールドの型が適切（string/number/boolean/array/object）
- [ ] 制約（minLength, maxLength, minimum, maximum, pattern）が定義されている

### Example Coverage
- [ ] リクエストボディの例がある
- [ ] 成功レスポンスの例がある
- [ ] エラーレスポンスの例がある
- [ ] エッジケースの例がある（空配列、null値など）

### Error Definition
- [ ] すべての可能なステータスコードが列挙されている
- [ ] エラーコードが一覧されている
- [ ] エラーメッセージが実装と一致している

### Tool Validation
- [ ] OpenAPI Linter (spectral) でエラーなし
- [ ] スキーマがJSONとして有効
- [ ] $ref が正しく解決される
```

### Security Review

```markdown
## API Security Review

### Authentication
- [ ] Endpoints require authentication (unless public)
- [ ] Token validation documented
- [ ] Token expiration handled

### Authorization
- [ ] Resource ownership verified
- [ ] Role-based access defined
- [ ] Cross-tenant access prevented

### Input Validation
- [ ] All inputs validated
- [ ] Size limits defined
- [ ] Type coercion avoided
- [ ] SQL/NoSQL injection prevented
- [ ] Path traversal prevented

### Output Security
- [ ] Sensitive data excluded from responses
- [ ] Error messages don't leak internals
- [ ] CORS configured correctly
- [ ] Security headers present

### Rate Limiting
- [ ] Limits defined per endpoint
- [ ] Limits documented
- [ ] 429 response includes Retry-After
```

---

## ERROR RESPONSE DESIGN

### Standard Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Email must be a valid email address"
      },
      {
        "field": "password",
        "code": "TOO_SHORT",
        "message": "Password must be at least 8 characters"
      }
    ],
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z",
    "documentation": "https://api.example.com/docs/errors#VALIDATION_ERROR"
  }
}
```

### Error Code Catalog

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_JSON` | 400 | Request body is not valid JSON |
| `MISSING_FIELD` | 400 | Required field not provided |
| `INVALID_FORMAT` | 400 | Field format is invalid |
| `UNAUTHORIZED` | 401 | Authentication required |
| `INVALID_TOKEN` | 401 | Token is invalid or expired |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource does not exist |
| `METHOD_NOT_ALLOWED` | 405 | HTTP method not supported |
| `CONFLICT` | 409 | Resource state conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

## PAGINATION PATTERNS

### Offset-based Pagination

```json
// Request
GET /api/v1/users?limit=10&offset=20

// Response
{
  "data": [...],
  "meta": {
    "total": 150,
    "limit": 10,
    "offset": 20,
    "hasMore": true
  },
  "links": {
    "self": "/api/v1/users?limit=10&offset=20",
    "first": "/api/v1/users?limit=10&offset=0",
    "prev": "/api/v1/users?limit=10&offset=10",
    "next": "/api/v1/users?limit=10&offset=30",
    "last": "/api/v1/users?limit=10&offset=140"
  }
}
```

### Cursor-based Pagination (Recommended for large datasets)

```json
// Request
GET /api/v1/users?limit=10&cursor=eyJpZCI6MTIzfQ==

// Response
{
  "data": [...],
  "meta": {
    "limit": 10,
    "hasMore": true,
    "nextCursor": "eyJpZCI6MTMzfQ==",
    "prevCursor": "eyJpZCI6MTEzfQ=="
  },
  "links": {
    "self": "/api/v1/users?limit=10&cursor=eyJpZCI6MTIzfQ==",
    "next": "/api/v1/users?limit=10&cursor=eyJpZCI6MTMzfQ==",
    "prev": "/api/v1/users?limit=10&cursor=eyJpZCI6MTEzfQ=="
  }
}
```

### Comparison

| Aspect | Offset | Cursor |
|--------|--------|--------|
| Random access | Yes | No |
| Consistent with changes | No | Yes |
| Performance on large sets | Poor | Good |
| Simple implementation | Yes | More complex |
| Use case | Small datasets, UI pages | Large datasets, feeds |

### Pagination Selection Criteria

Use this decision tree to select the appropriate pagination strategy:

```
予想レコード数は？
├─ <1,000件 → Offset (シンプルで十分)
├─ 1,000〜10,000件 → 用途次第
│   ├─ ランダムアクセス必要 → Offset
│   └─ 一貫性重視 → Cursor
└─ >10,000件 → Cursor (パフォーマンス優先)

リアルタイム更新があるか？
├─ はい（フィード、通知等） → Cursor
└─ いいえ → Offset でも可

ページ番号UIが必要か？
├─ はい（「3ページ目」表示） → Offset
└─ いいえ（無限スクロール等） → Cursor
```

**選択時の確認事項:**
- [ ] 既存APIの方式と整合性があるか
- [ ] クライアント実装の複雑さは許容範囲か
- [ ] 将来のデータ増加を考慮しているか

---

## API DESIGN DECISION TREE

### Protocol Selection

| Requirement | REST | GraphQL | gRPC |
|-------------|------|---------|------|
| Public API | ✅ Recommended | ⚠️ Conditional | ❌ |
| Microservices | ⚠️ | ❌ | ✅ Recommended |
| Mobile apps | ✅ | ✅ Recommended | ⚠️ |
| Real-time | WebSocket | Subscription | Streaming |
| File transfer | ✅ | ❌ | ✅ |
| Browser direct call | ✅ | ✅ | ❌ (grpc-web required) |

### Selection Flowchart

```
Q1: Who is the client?
├─ Browser/Mobile → Q2
├─ Internal services → gRPC recommended
└─ Third party → REST recommended

Q2: Data fetching pattern?
├─ Fixed fields → REST
├─ Flexible field selection → GraphQL
└─ Real-time updates → WebSocket/SSE
```

### GraphQL vs REST Decision Criteria

| GraphQL is better | REST is better |
|-------------------|----------------|
| Fetch multiple resources in one request | Simple CRUD operations |
| Mobile bandwidth is critical | Caching is important (CDN) |
| Frontend-driven development | API contract via OpenAPI is important |
| UI changes frequently | Stable API contract |

---

## RATE LIMITING PATTERNS

### Algorithm Comparison

| Algorithm | Burst Support | Complexity | Recommended Use |
|-----------|---------------|------------|-----------------|
| Token Bucket | ✅ | Medium | General APIs |
| Leaky Bucket | ❌ | Low | Stable throughput |
| Fixed Window | ⚠️ Boundary issue | Low | Simple cases |
| Sliding Window | ✅ | High | Precise control |

### Rate Limit Definition in OpenAPI

```yaml
components:
  headers:
    X-RateLimit-Limit:
      description: リクエスト上限（時間窓あたり）
      schema:
        type: integer
        example: 1000
    X-RateLimit-Remaining:
      description: 残りリクエスト数
      schema:
        type: integer
        example: 999
    X-RateLimit-Reset:
      description: リセット時刻（Unix timestamp）
      schema:
        type: integer
        example: 1640995200
    Retry-After:
      description: 429時の待機秒数
      schema:
        type: integer
        example: 60

  responses:
    TooManyRequests:
      description: Rate limit exceeded
      headers:
        X-RateLimit-Limit:
          $ref: '#/components/headers/X-RateLimit-Limit'
        X-RateLimit-Remaining:
          $ref: '#/components/headers/X-RateLimit-Remaining'
        X-RateLimit-Reset:
          $ref: '#/components/headers/X-RateLimit-Reset'
        Retry-After:
          $ref: '#/components/headers/Retry-After'
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "RATE_LIMIT_EXCEEDED"
            message: "Too many requests. Please retry after 60 seconds."
```

### Rate Limiting Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| Per User | Limit per user | Authenticated APIs |
| Per IP | Limit per IP address | Public APIs |
| Per API Key | Limit per API key | Third-party integrations |
| Per Endpoint | Limit per endpoint | Heavy processing APIs |
| Global | System-wide limit | System protection |

---


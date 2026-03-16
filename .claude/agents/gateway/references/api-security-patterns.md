# API Security Patterns

## Authentication Methods

| Method | Use Case | Complexity |
|--------|----------|-----------|
| API Key | Server-to-server | Low |
| JWT Bearer | User auth | Medium |
| OAuth 2.0 | Third-party access | High |

## Rate Limiting Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
Retry-After: 60
```

## CORS Configuration

```typescript
const corsOptions = {
  origin: ['https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
};
```

## Input Validation Checklist
- [ ] Validate Content-Type header
- [ ] Validate request body against schema
- [ ] Sanitize string inputs
- [ ] Limit request body size
- [ ] Validate path and query parameters

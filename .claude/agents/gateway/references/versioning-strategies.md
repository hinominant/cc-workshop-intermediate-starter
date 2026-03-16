# API Versioning Strategies

## Comparison

| Strategy | Pros | Cons | Example |
|----------|------|------|---------|
| URL Path | Simple, visible | URL pollution | `/v1/users` |
| Header | Clean URLs | Hidden version | `Accept: application/vnd.api.v1+json` |
| Query Param | Easy testing | Caching issues | `/users?version=1` |

## Deprecation Timeline

1. Announce deprecation (6 months before)
2. Add `Deprecation` header to responses
3. Add `Sunset` header with date
4. Monitor usage of deprecated version
5. Remove after sunset date

## Breaking vs Non-Breaking Changes

| Change | Breaking? |
|--------|-----------|
| Add optional field | No |
| Add new endpoint | No |
| Remove field | Yes |
| Rename field | Yes |
| Change field type | Yes |
| Add required field | Yes |

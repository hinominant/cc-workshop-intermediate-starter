# Edge Case Methodology

Systematic techniques for finding the inputs and states that break software. Every function has a happy path. Radar's job is to find the other paths.

---

## ZOMBIES Mnemonic

Use ZOMBIES to systematically enumerate test cases for every function under test.

| Letter | Meaning | Question to Ask | Example |
|--------|---------|-----------------|---------|
| **Z** | Zero | What happens with zero / empty / nothing? | Empty array, 0, empty string, null |
| **O** | One | What happens with exactly one item? | Single element array, string length 1 |
| **M** | Many | What happens with multiple items? | Large arrays, strings, nested structures |
| **B** | Boundary | What are the edges of valid input? | MAX_INT, -1, first/last index, capacity limit |
| **I** | Interface | What does the caller expect? | Return type, error type, side effects |
| **E** | Exception | What causes failures? | Network error, permission denied, timeout |
| **S** | Simple | What is the simplest possible scenario? | Default arguments, no options, base case |

### Applying ZOMBIES to a Pagination Function

```ts
function paginate<T>(items: T[], page: number, pageSize: number): T[]
```

| ZOMBIES | Test Case | Expected Behavior |
|---------|-----------|-------------------|
| Z | `paginate([], 1, 10)` | Returns `[]` |
| Z | `paginate(items, 0, 10)` | Throws or returns page 1? (clarify spec) |
| O | `paginate([1], 1, 10)` | Returns `[1]` |
| M | `paginate(hundredItems, 3, 10)` | Returns items 21-30 |
| B | `paginate(items, 1, 0)` | Throws (pageSize must be > 0) |
| B | `paginate(items, 999, 10)` | Returns `[]` (page beyond data) |
| B | `paginate(items, -1, 10)` | Throws (invalid page) |
| I | Return type | Always `T[]`, never `undefined` |
| E | `paginate(null as any, 1, 10)` | Throws TypeError |
| S | `paginate([1,2,3], 1, 10)` | Returns `[1,2,3]` (all fit in one page) |

---

## Boundary Value Analysis

Test at the edges of equivalence classes. Bugs cluster at boundaries.

### Technique

For any range `[min, max]`, test these 5 values:

```
  below min    min     nominal     max     above max
    [x]        [v]       [v]       [v]       [x]

  Invalid   Boundary   Valid    Boundary   Invalid
```

### Examples

| Domain | Below Min | Min | Nominal | Max | Above Max |
|--------|-----------|-----|---------|-----|-----------|
| Age (0-150) | -1 | 0 | 25 | 150 | 151 |
| Password (8-64 chars) | 7 chars | 8 chars | 20 chars | 64 chars | 65 chars |
| Quantity (1-99) | 0 | 1 | 50 | 99 | 100 |
| Array index (0-based, length N) | -1 | 0 | N/2 | N-1 | N |

```ts
describe('validateAge', () => {
  it('should reject age below 0', () => {
    expect(validateAge(-1)).toEqual({ valid: false, error: 'Age must be 0-150' });
  });

  it('should accept age at lower boundary (0)', () => {
    expect(validateAge(0)).toEqual({ valid: true });
  });

  it('should accept age at upper boundary (150)', () => {
    expect(validateAge(150)).toEqual({ valid: true });
  });

  it('should reject age above 150', () => {
    expect(validateAge(151)).toEqual({ valid: false, error: 'Age must be 0-150' });
  });
});
```

---

## Equivalence Partitioning

Divide inputs into classes where all values in a class should produce the same behavior. Test one value per class.

| Input Domain | Partitions | Test Representative |
|-------------|------------|---------------------|
| Email validation | Valid email, missing @, missing domain, empty string | `a@b.com`, `ab.com`, `a@`, `""` |
| Discount tiers | 0-999, 1000-4999, 5000-9999, 10000+ | 500, 3000, 7500, 15000 |
| File upload | Valid image, valid PDF, oversized, wrong MIME | 500KB PNG, 1MB PDF, 11MB JPG, .exe |

---

## Error Path Testing

Error paths contain the majority of production bugs. Test every path where things fail.

### Checklist

| Error Category | What to Test |
|---------------|-------------|
| **Network failure** | Timeout, connection refused, DNS failure, partial response |
| **Auth failure** | Expired token, invalid token, missing token, insufficient permissions |
| **Validation failure** | Missing required field, wrong type, too long, malformed |
| **Concurrency** | Race condition, double submit, stale data update |
| **Resource exhaustion** | Disk full, memory limit, rate limit exceeded |
| **External service down** | 500 from dependency, empty response, malformed response |

```ts
// CORRECT: Test the error path, not just the happy path
describe('fetchUserProfile', () => {
  it('should return user data on success', async () => { /* ... */ });

  it('should throw AuthError when token is expired', async () => {
    server.use(http.get('/api/me', () => HttpResponse.json({}, { status: 401 })));
    await expect(fetchUserProfile()).rejects.toThrow(AuthError);
  });

  it('should retry once on 500 and then throw', async () => {
    let attempts = 0;
    server.use(http.get('/api/me', () => {
      attempts++;
      return HttpResponse.json({}, { status: 500 });
    }));
    await expect(fetchUserProfile()).rejects.toThrow(ServiceError);
    expect(attempts).toBe(2); // Initial + 1 retry
  });

  it('should throw TimeoutError after 5 seconds', async () => {
    server.use(http.get('/api/me', async () => {
      await delay(10000);
      return HttpResponse.json({});
    }));
    await expect(fetchUserProfile()).rejects.toThrow(TimeoutError);
  });
});
```

---

## Concurrent Access Testing

When multiple users or processes can access the same resource.

| Scenario | What Breaks | Test Approach |
|----------|-------------|---------------|
| Double form submit | Duplicate records | Send two requests simultaneously, verify only one created |
| Optimistic locking | Lost updates | Read -> modify -> save from two clients, verify conflict detected |
| Rate limiting | Bypass via parallel requests | Send N+1 requests in parallel, verify last is rejected |

```ts
it('should not create duplicate orders on double submit', async () => {
  const [res1, res2] = await Promise.all([
    request(app).post('/api/orders').send(orderData),
    request(app).post('/api/orders').send(orderData),
  ]);

  const successCount = [res1, res2].filter(r => r.status === 201).length;
  const conflictCount = [res1, res2].filter(r => r.status === 409).length;

  expect(successCount).toBe(1);
  expect(conflictCount).toBe(1);
});
```

---

## Timezone and Locale Edge Cases

| Edge Case | Example | Why It Breaks |
|-----------|---------|---------------|
| Timezone offset | `2026-04-06T00:00:00+09:00` vs UTC | Midnight in JST is previous day in UTC |
| DST transition | March/November clock changes | 2:30 AM may not exist or may occur twice |
| Date boundary | Filtering "today's" records | Server vs client timezone mismatch |
| Locale formatting | `1,000.50` vs `1.000,50` | Number parsing/display varies by locale |
| Unicode in names | `田中太郎`, `O'Brien`, `Müller` | Apostrophes, umlauts, multi-byte characters |

```ts
it('should handle JST midnight correctly for daily report', () => {
  // 2026-04-06 00:00:00 JST = 2026-04-05 15:00:00 UTC
  const jstMidnight = new Date('2026-04-05T15:00:00Z');
  const report = getDailyReport(jstMidnight, 'Asia/Tokyo');

  expect(report.date).toBe('2026-04-06'); // JST date, not UTC
});
```

---

## Empty State / Null / Undefined Handling

Every function that accepts optional values or can receive external data must handle these cases.

| Input | Expected Behavior |
|-------|-------------------|
| `undefined` | Use default value or throw descriptive error |
| `null` | Explicit handling (not silently coerced) |
| `""` (empty string) | Treat as missing or valid? (spec must define) |
| `[]` (empty array) | Return empty result, not error |
| `{}` (empty object) | Validate required fields are present |
| `NaN` | Reject explicitly (NaN propagates silently) |

```ts
describe('formatUserName', () => {
  it('should handle undefined gracefully', () => {
    expect(formatUserName(undefined)).toBe('Unknown User');
  });

  it('should handle null gracefully', () => {
    expect(formatUserName(null)).toBe('Unknown User');
  });

  it('should handle empty string', () => {
    expect(formatUserName('')).toBe('Unknown User');
  });

  it('should trim whitespace', () => {
    expect(formatUserName('  Tanaka  ')).toBe('Tanaka');
  });
});
```

---

## Large Data Set Behavior

Test behavior at scale, not just with sample data.

| Scenario | What to Test | Threshold |
|----------|-------------|-----------|
| Pagination | Does page 1000 work? | 10,000+ records |
| Search | Does search slow down? | 100,000+ records |
| Export | Does CSV export finish? | 50,000+ rows |
| Table render | Does the UI remain responsive? | 1,000+ visible rows |
| File upload | Does 100MB work? | Project's max file size |

```ts
it('should paginate 10,000 records without timeout', async () => {
  // Seed large dataset
  await db.product.createMany({
    data: Array.from({ length: 10_000 }, (_, i) => ({
      name: `Product ${i}`,
      price: Math.floor(Math.random() * 10000),
    })),
  });

  const start = performance.now();
  const res = await request(app).get('/api/products?page=500&pageSize=20');
  const elapsed = performance.now() - start;

  expect(res.status).toBe(200);
  expect(res.body.data).toHaveLength(20);
  expect(elapsed).toBeLessThan(1000); // Under 1 second
});
```

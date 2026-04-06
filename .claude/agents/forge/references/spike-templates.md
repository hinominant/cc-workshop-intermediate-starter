# Spike Templates

Structured templates for four spike types. Each template defines hypothesis, time box, success criteria, and output format. Copy the relevant template before starting a spike.

---

## 1. Technical Spike: "Can we use library/technology X?"

Answers feasibility and integration questions about a specific technology.

### Template

```markdown
# Technical Spike: [Library/Technology Name]

## Question
Can [library/technology X] be used to [achieve goal Y] in our stack?

## Hypothesis
[Library X] can [specific capability] with [acceptable performance/complexity].

## Time Box
2 hours (hard limit)

## Evaluation Criteria
| Criterion | Target | Actual | Pass? |
|-----------|--------|--------|-------|
| Installation succeeds | No build errors | | |
| Basic example works | Runs in our environment | | |
| Integrates with [existing tech] | No conflicts | | |
| Bundle size impact | < [X] KB increase | | |
| API ergonomics | Readable, maintainable | | |
| TypeScript support | Full type definitions | | |
| Active maintenance | Commits in last 3 months | | |
| License compatibility | MIT / Apache 2.0 / ISC | | |

## Steps
1. Install the library in a scratch branch
2. Implement the simplest possible use case
3. Implement the most complex use case from our requirements
4. Measure bundle size / performance impact
5. Check TypeScript compatibility
6. Document findings

## Output Format
- **Verdict:** USE / DO NOT USE / USE WITH CAVEATS
- **Evidence:** [benchmark numbers, code samples, compatibility notes]
- **Risks:** [known issues, limitations, migration concerns]
- **Alternative:** [if DO NOT USE, what to use instead]
```

### Example: Evaluating Zod for Validation

```markdown
# Technical Spike: Zod

## Question
Can Zod replace our manual validation logic in the API layer?

## Hypothesis
Zod can validate all our API request shapes with TypeScript inference,
replacing 500+ lines of manual validation code.

## Time Box
2 hours

## Evaluation Criteria
| Criterion | Target | Actual | Pass? |
|-----------|--------|--------|-------|
| Installation | No errors | Clean install | Yes |
| Basic validation | Validates user input | Works | Yes |
| Nested objects | Handles our deepest schema | 4-level nesting OK | Yes |
| Error messages | Human-readable | Default messages decent, customizable | Yes |
| Bundle size | < 50KB | 13KB minified | Yes |
| TypeScript inference | z.infer produces correct types | Perfect | Yes |
| Transform support | Can coerce strings to numbers | Built-in | Yes |

## Verdict: USE
Zod covers all our validation needs with excellent TypeScript inference.
Replacing manual validation will eliminate ~500 lines of code and
provide automatic type inference from schemas.
```

---

## 2. Feature Spike: "How should feature Y work?"

Discovers the right design and interaction model for a user-facing feature.

### Template

```markdown
# Feature Spike: [Feature Name]

## Question
How should [feature Y] work from the user's perspective?

## Hypothesis
Users need to [core user action] and the best UX is [proposed approach].

## Time Box
4 hours (hard limit)

## Scope Lock
### IN Scope
- [ ] Core interaction flow (happy path)
- [ ] Key decision points (what options does the user have?)
- [ ] Data shape (what information is displayed/collected?)

### OUT of Scope
- [ ] Error handling UI
- [ ] Responsive design
- [ ] Accessibility (beyond basic keyboard nav)
- [ ] Performance optimization
- [ ] Backend API implementation

## Discovery Checklist
- [ ] What is the entry point? (How does the user reach this feature?)
- [ ] What decisions does the user make? (Choices, filters, inputs)
- [ ] What feedback does the user need? (Loading, success, error states)
- [ ] What is the exit point? (Where does the user go after?)
- [ ] What data is required from the backend?
- [ ] What edge cases exist? (Empty state, too many items, permissions)

## Output Format
- **Recommended UX:** [Description + screenshots/wireframes if UI]
- **User flow:** [Step 1 -> Step 2 -> Step 3]
- **Data requirements:** [API shape needed from backend]
- **Open questions:** [Decisions that need stakeholder input]
- **Deferred items:** [What was cut and why]
```

### Example: Designing a Bulk Action Feature

```markdown
# Feature Spike: Bulk User Actions

## Question
How should admins perform bulk actions (delete, role change) on users?

## Hypothesis
Checkbox selection + action dropdown is the most familiar pattern
for bulk operations in a data table context.

## Discovered Flow
1. Admin views user table (default: no selection mode)
2. Admin clicks checkbox on any row -> bulk action bar appears at top
3. "Select all on this page" checkbox in header
4. Action dropdown: Delete / Change Role / Export / Deactivate
5. Confirmation dialog with count: "Delete 15 users? This cannot be undone."
6. Progress indicator for long operations (>2 seconds)
7. Toast notification on completion

## Edge Cases Found
- Selecting users across multiple pages (need server-side selection state)
- Mixed permissions (admin selects users they cannot delete)
- In-progress action + page navigation (need background job)

## Verdict: CONFIRMED
Checkbox + action bar pattern works. Server-side selection needed for
cross-page operations. Builder should implement background jobs for
bulk delete (>50 users).
```

---

## 3. Integration Spike: "Can system A talk to system B?"

Validates that two systems can communicate with acceptable reliability and performance.

### Template

```markdown
# Integration Spike: [System A] <-> [System B]

## Question
Can [System A] reliably communicate with [System B] to [achieve goal]?

## Hypothesis
[System A] can [send/receive] [data type] [to/from] [System B]
via [protocol/API] with [acceptable latency/reliability].

## Time Box
4 hours (hard limit)

## Evaluation Criteria
| Criterion | Target | Actual | Pass? |
|-----------|--------|--------|-------|
| Authentication | Connect successfully | | |
| Basic request/response | Correct data shape | | |
| Latency | < [X]ms per request | | |
| Error handling | Graceful on [timeout/401/500] | | |
| Rate limiting | Within [X] req/min limit | | |
| Data mapping | Our schema <-> their schema | | |
| Idempotency | Safe to retry on failure | | |

## Integration Mapping
| Our Field | Their Field | Transform Needed? |
|-----------|-------------|-------------------|
| | | |

## Steps
1. Obtain credentials / API key / sandbox access
2. Make simplest possible request (health check or list)
3. Make the most complex request from our requirements
4. Test error scenarios (bad auth, timeout, malformed request)
5. Measure latency for typical payload sizes
6. Document the mapping between our data model and theirs

## Output Format
- **Verdict:** INTEGRABLE / NOT INTEGRABLE / INTEGRABLE WITH CAVEATS
- **Auth method:** [API key / OAuth2 / mTLS / ...]
- **Data mapping:** [Field-by-field mapping table]
- **Error handling:** [How each error type should be handled]
- **Rate limits:** [Documented limits and our expected usage]
- **Latency:** [Measured p50/p95/p99]
- **Risks:** [Reliability concerns, version dependencies, deprecation timeline]
```

### Example: Stripe Webhook Integration

```markdown
# Integration Spike: Our API <-> Stripe Webhooks

## Verdict: INTEGRABLE
- Webhook events arrive within 1-5 seconds of payment
- Signature verification works (stripe-node SDK handles it)
- Retry logic: Stripe retries for 3 days with exponential backoff
- Must store event ID for idempotency (Stripe sends duplicates)

## Risks
- Webhook endpoint must respond within 20 seconds or Stripe marks as failed
- Event ordering is not guaranteed (payment_intent.succeeded may arrive
  before payment_intent.created in rare cases)
```

---

## 4. Performance Spike: "Will approach X scale?"

Measures whether a proposed approach meets performance requirements at target scale.

### Template

```markdown
# Performance Spike: [Approach Name]

## Question
Will [approach X] handle [target load] within [acceptable latency/resource usage]?

## Hypothesis
[Approach X] can handle [N requests/second | N records | N concurrent users]
with [< Xms latency | < X MB memory | < X% CPU].

## Time Box
4 hours (hard limit)

## Baseline Measurements (BEFORE)
| Metric | Current Value | Measurement Method |
|--------|--------------|-------------------|
| Response time (p50) | | |
| Response time (p95) | | |
| Response time (p99) | | |
| Throughput (req/s) | | |
| Memory usage | | |
| CPU usage | | |
| DB query count | | |
| DB query time | | |

## Target
| Metric | Target | Rationale |
|--------|--------|-----------|
| Response time (p95) | < [X]ms | User-facing page load |
| Throughput | [X] req/s | Expected peak traffic |
| Memory | < [X] MB | Container limit |

## Test Scenarios
| Scenario | Data Size | Concurrent Users | Expected Behavior |
|----------|-----------|-------------------|-------------------|
| Normal load | [X] records | [X] users | < [X]ms p95 |
| Peak load | [X] records | [X] users | < [X]ms p95 |
| Stress test | [X] records | [X] users | Graceful degradation |

## Steps
1. Set up realistic test data at target scale
2. Implement the proposed approach (minimal, spike-quality)
3. Run load test with baseline approach
4. Run load test with proposed approach
5. Compare metrics
6. Identify bottlenecks if targets not met

## Output Format
- **Verdict:** SCALES / DOES NOT SCALE / SCALES WITH OPTIMIZATION
- **Measurements:** [Table of before/after metrics]
- **Bottleneck:** [What limits performance: CPU / memory / DB / network]
- **Optimization path:** [If SCALES WITH OPTIMIZATION, what to change]
- **Cost estimate:** [Infrastructure cost at target scale if relevant]
```

### Example: Evaluating Elasticsearch vs PostgreSQL Full-Text Search

```markdown
# Performance Spike: Search Backend Comparison

## Verdict: PostgreSQL SCALES (for our current needs)

| Metric | PostgreSQL (tsvector) | Elasticsearch |
|--------|----------------------|---------------|
| 10K records, simple query | 12ms | 8ms |
| 100K records, simple query | 45ms | 11ms |
| 100K records, faceted query | 180ms | 25ms |
| Memory overhead | 0 (same DB) | +2GB (separate service) |
| Operational complexity | None | Significant |

## Recommendation
PostgreSQL full-text search meets our needs up to 100K records
with < 200ms response time. Switch to Elasticsearch when:
- Record count exceeds 500K, OR
- Faceted search becomes a core feature, OR
- Search latency p95 > 200ms in production

This avoids adding infrastructure complexity prematurely.
```

---

## Quick Reference: Which Template to Use

| Question Pattern | Template |
|-----------------|----------|
| "Can we use [library]?" | Technical Spike |
| "Does [service] work with our stack?" | Technical Spike |
| "How should [feature] look/work?" | Feature Spike |
| "What is the right UX for [interaction]?" | Feature Spike |
| "Can [system A] talk to [system B]?" | Integration Spike |
| "How do we connect to [external API]?" | Integration Spike |
| "Will [approach] handle [scale]?" | Performance Spike |
| "Is [database/algorithm] fast enough?" | Performance Spike |

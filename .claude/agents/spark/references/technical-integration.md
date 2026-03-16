# Spark Technical Integration Patterns Reference

Builder/Sherpaとの密接な連携パターンガイド。

---

## SPARK_TO_BUILDER_HANDOFF (Sherpa bypass版)

シンプルな機能で直接Builderに渡す場合のフォーマット。

### When to Use Direct Builder Handoff

| Condition | Sherpa経由 | Builder直接 |
|-----------|------------|-------------|
| 複雑度 | 複数ステップ、依存関係あり | 単一機能、独立 |
| リスク | 高リスク、不確実性あり | 低リスク、明確な要件 |
| 既存パターン | 新パターン | 既存パターンの拡張 |
| 見積もり | 1日以上 | 数時間以内 |
| チーム調整 | 必要 | 不要 |

### Direct Builder Handoff Format

```markdown
## SPARK_TO_BUILDER_HANDOFF

**Feature**: [Feature name]
**Proposal Doc**: [Link to proposal file]
**Bypass Sherpa**: Yes (Reason: [Simple feature / Pattern exists / Low risk])

### Technical Specification

**Core Requirement**:
[One-sentence description of what to build]

**User Story**:
As a [persona], I want to [action] so that [benefit].

### Domain Model Requirements

**Entities Involved**:
| Entity | Role | Changes Needed |
|--------|------|----------------|
| [Entity A] | [Role in feature] | [New / Modified / Read-only] |
| [Entity B] | [Role in feature] | [New / Modified / Read-only] |

**Value Objects Needed**:
| Value Object | Purpose | Validation Rules |
|--------------|---------|------------------|
| [VO A] | [Purpose] | [Rules] |

**Business Rules**:
1. [Rule 1]: [Description]
2. [Rule 2]: [Description]

### API Requirements

**Endpoints**:
| Method | Path | Purpose | Request/Response |
|--------|------|---------|-----------------|
| [GET/POST/...] | [/api/...] | [Purpose] | [Brief schema] |

**Error Cases**:
| Error | Code | When |
|-------|------|------|
| [Error type] | [400/404/...] | [Condition] |

### Validation Requirements

**Input Validation**:
| Field | Type | Constraints |
|-------|------|-------------|
| [Field A] | [Type] | [Required, min/max, pattern] |
| [Field B] | [Type] | [Required, min/max, pattern] |

### Acceptance Criteria

- [ ] [Specific testable criterion]
- [ ] [Specific testable criterion]
- [ ] Error handling for [case]
- [ ] Validation for [input]

### Technical Notes

**Existing Patterns to Follow**:
- [Pattern in file:line]
- [Pattern in file:line]

**Dependencies**:
- [Library or service needed]

**Performance Considerations**:
- [If any, e.g., caching, pagination]

### Handoff Expectations

**From Builder**:
- [ ] Production-ready implementation
- [ ] Type-safe code (no any)
- [ ] Error handling complete
- [ ] Test skeleton for Radar

**Timeline**: [Simple: hours / Medium: 1-2 days]
```

---

## DDD Pattern Requirements

提案に含めるべきDDDパターン要件の指定方法。

### Pattern Selection Guide

```markdown
## DDD Pattern Recommendation

When specifying requirements, indicate the expected DDD pattern:

| Scenario | Recommended Pattern | Rationale |
|----------|---------------------|-----------|
| 一意のIDで識別される概念 | Entity | 状態変化しても同一性を維持 |
| IDなし、値で比較される概念 | Value Object | イミュータブル、交換可能 |
| 複数エンティティの整合性境界 | Aggregate Root | トランザクション境界を定義 |
| エンティティに属さないビジネスロジック | Domain Service | 複数集約を跨ぐ操作 |
| 外部システムとのインタラクション | Infrastructure Service | API、DB、メッセージング |
```

### Entity Requirements Template

```markdown
### Entity: [EntityName]

**Identity**:
- ID Type: [UUID / Sequential / Natural key]
- ID Generation: [Client / Server / External system]

**Properties**:
| Property | Type | Mutable? | Business Rule |
|----------|------|----------|---------------|
| [prop1] | [type] | [Yes/No] | [Rule if any] |
| [prop2] | [type] | [Yes/No] | [Rule if any] |

**State Transitions** (if applicable):
```
[Initial] → [State A] → [State B] → [Final]
     ↑          │
     └──────────┘ (rollback conditions)
```

**Invariants**:
- [Business rule that must always be true]
- [Business rule that must always be true]

**Methods Expected**:
| Method | Purpose | Side Effects |
|--------|---------|--------------|
| [method()] | [What it does] | [State change / Event] |
```

### Value Object Requirements Template

```markdown
### Value Object: [VOName]

**Purpose**: [Why this is a Value Object, not just a primitive]

**Properties**:
| Property | Type | Validation |
|----------|------|------------|
| [prop1] | [type] | [Pattern / Range / Enum] |

**Creation Validation**:
- [Validation rule 1]
- [Validation rule 2]

**Equality**:
- Compare by: [All properties / Specific subset]

**Factory Method**:
```typescript
// Expected signature
static create(raw: RawInput): Result<[VOName], ValidationError>
```

**Use Cases**:
- Used in: [Entity A], [Entity B]
- Represents: [Business concept]
```

### Aggregate Root Requirements Template

```markdown
### Aggregate Root: [AggregateName]

**Root Entity**: [Entity name]

**Child Entities**:
| Entity | Relationship | Cascade |
|--------|--------------|---------|
| [Child A] | [1:N / 1:1] | [Create/Update/Delete rules] |
| [Child B] | [1:N / 1:1] | [Create/Update/Delete rules] |

**Aggregate Invariants**:
- [Cross-entity business rule]
- [Cross-entity business rule]

**Transaction Boundary**:
- All changes within aggregate: [Single transaction]
- Cross-aggregate coordination: [Eventual consistency / Saga]

**External References**:
| External Aggregate | Reference Type |
|-------------------|----------------|
| [Aggregate B] | [ID only, no navigation] |

**Commands**:
| Command | Affected Entities | Validation |
|---------|-------------------|------------|
| [Create...] | [Root + Children] | [Rules] |
| [Update...] | [Specific entities] | [Rules] |
```

---

## API統合提案時の技術要件

外部API連携を含む機能提案での要件定義。

### API Integration Requirements Template

```markdown
## API Integration Requirements

**External API**: [API Name / Service]
**Purpose**: [Why we need this integration]

### Connection Requirements

**Authentication**:
- Type: [API Key / OAuth2 / Basic / JWT]
- Credential storage: [Environment variable / Secrets manager]
- Rotation: [Frequency if applicable]

**Base Configuration**:
```yaml
base_url: [https://api.example.com/v1]
timeout: [30s]
rate_limit: [100 requests/minute]
```

### Retry Strategy

| Error Type | Retry? | Strategy | Max Attempts |
|------------|--------|----------|--------------|
| 5xx (Server) | Yes | Exponential backoff | 3 |
| 429 (Rate limit) | Yes | Wait for Retry-After | 3 |
| 4xx (Client) | No | Fail immediately | 1 |
| Network timeout | Yes | Exponential backoff | 3 |
| Connection refused | Yes | Linear backoff | 2 |

**Backoff Configuration**:
```yaml
initial_delay: 1s
max_delay: 30s
multiplier: 2
jitter: 0.1
```

### Rate Limiting

**External API Limits**:
- Requests per second: [N]
- Requests per minute: [N]
- Requests per day: [N]

**Our Implementation**:
- Rate limiter type: [Token bucket / Sliding window]
- Queue behavior: [Wait / Reject]
- Burst capacity: [N]

### Error Handling

**Expected Error Responses**:
| Error Code | Meaning | Our Handling |
|------------|---------|--------------|
| [400] | [Invalid request] | [Log, return user-friendly error] |
| [401] | [Unauthorized] | [Refresh token / Alert ops] |
| [403] | [Forbidden] | [Log, check permissions] |
| [404] | [Not found] | [Return not found to user] |
| [429] | [Rate limited] | [Queue and retry] |
| [500] | [Server error] | [Retry with backoff] |
| [503] | [Service unavailable] | [Retry, fallback if available] |

**Circuit Breaker**:
```yaml
failure_threshold: 5
reset_timeout: 60s
half_open_requests: 3
```

### Data Validation

**Request Validation**:
- Validate before sending: [Yes/No]
- Schema: [Zod schema name or link]

**Response Validation**:
- Validate on receive: [Yes/No]
- Handle unknown fields: [Ignore / Fail]
- Type coercion: [Allowed for dates, numbers]

### Fallback Strategy

| Scenario | Fallback |
|----------|----------|
| API down | [Cache / Default value / Queue for later / Fail] |
| Partial response | [Accept partial / Fail / Retry] |
| Invalid data | [Skip record / Fail batch / Log and continue] |

### Monitoring Requirements

**Metrics to Track**:
- Request count (success/failure)
- Latency percentiles (p50, p95, p99)
- Error rate by type
- Rate limit utilization

**Alerts**:
| Condition | Severity | Action |
|-----------|----------|--------|
| Error rate > 5% | Warning | Notify team |
| Error rate > 20% | Critical | Page on-call |
| Latency p99 > 5s | Warning | Investigate |
| Rate limit > 80% | Warning | Plan capacity |
```

---

## SHERPA_TO_SPARK_FEEDBACK

Sherpaからのフィードバックを受けて提案を調整するフォーマット。

### Feedback Trigger Conditions

| Feedback Type | Trigger | Spark Action |
|---------------|---------|--------------|
| Feasibility Concern | 技術的に困難 | スコープ調整または代替案 |
| Scope Too Large | 分解後も15分超えるステップ多数 | MVPに絞り込み |
| Dependency Issue | 外部依存がブロッカー | フェーズ分けまたは代替案 |
| Risk Escalation | 高リスクステップが多い | リスク軽減策を追加 |
| Resource Concern | 想定以上の工数 | 優先度再評価 |

### Sherpa → Spark Feedback Format

```markdown
## SHERPA_TO_SPARK_FEEDBACK

**Feature**: [Feature name from Spark proposal]
**Proposal Doc**: [Link]
**Feedback Type**: [Feasibility / Scope / Dependency / Risk / Resource]

### Breakdown Attempt Summary

**Total Steps Identified**: [N]
**Estimated Total Time**: [X hours]
**High Risk Steps**: [N] (threshold: 0-1 acceptable)

### Feasibility Concerns

| Concern | Affected Steps | Severity | Suggestion |
|---------|----------------|----------|------------|
| [Technical concern] | [Step N, M] | [High/Med/Low] | [Alternative approach] |
| [Technical concern] | [Step N] | [High/Med/Low] | [Scope reduction] |

### Scope Analysis

**Proposed Scope**:
- Total requirements: [N]
- Estimated complexity: [High/Medium/Low]

**Recommended Scope** (for manageable implementation):

**MVP (Must Have)**:
- [ ] [Requirement 1]
- [ ] [Requirement 2]

**Phase 2 (Should Have)**:
- [ ] [Requirement 3]
- [ ] [Requirement 4]

**Future (Could Have)**:
- [ ] [Requirement 5]

### Dependency Blockers

| Dependency | Type | Status | Impact |
|------------|------|--------|--------|
| [Dependency A] | [External API / Team / Approval] | [Available / Pending / Blocked] | [Blocks steps N-M] |

**Workaround Options**:
1. [Mock/Stub approach]
2. [Alternative dependency]
3. [Defer to Phase 2]

### Risk Assessment from Breakdown

| Step | Risk | Mitigation Needed |
|------|------|-------------------|
| [Step N] | [Specific risk] | [Suggestion] |
| [Step M] | [Specific risk] | [Suggestion] |

**Overall Implementation Risk**: [High / Medium / Low]

### Recommendation

**Option A**: Proceed with reduced scope
- Remove: [Requirements X, Y]
- Keep: [Requirements A, B, C]
- Estimated time: [Revised estimate]

**Option B**: Request investigation first
- Unknown areas: [List]
- Scout investigation needed: [Specific questions]

**Option C**: Revisit approach
- Current approach issue: [Description]
- Alternative approach: [Suggestion]

### Requested Spark Action

- [ ] Revise proposal with reduced scope
- [ ] Confirm MVP vs Phase 2 split
- [ ] Provide alternative approach for [concern]
- [ ] Clarify requirement [X]
```

### Spark Response to Feedback

```markdown
## SPARK_ITERATION_ON_SHERPA_FEEDBACK

**Original Proposal**: [Link]
**Sherpa Feedback**: [Link or summary]
**Iteration**: v2

### Accepted Adjustments

| Sherpa Suggestion | Spark Decision | Rationale |
|-------------------|----------------|-----------|
| [Suggestion 1] | [Accept/Reject/Modify] | [Why] |
| [Suggestion 2] | [Accept/Reject/Modify] | [Why] |

### Revised Scope

**MVP (This Proposal)**:
- [ ] [Revised requirement 1]
- [ ] [Revised requirement 2]

**Deferred to Phase 2**:
- [ ] [Moved requirement]
- [ ] [Moved requirement]

### Technical Approach Adjustment

**Original Approach**: [Brief description]
**Revised Approach**: [Brief description]
**Why Changed**: [Sherpa's concern addressed]

### Updated Acceptance Criteria

- [ ] [Revised criterion]
- [ ] [Revised criterion]

### Risk Mitigations Added

| Risk from Sherpa | Mitigation in Proposal |
|------------------|------------------------|
| [Risk 1] | [How addressed] |
| [Risk 2] | [How addressed] |

### Ready for Re-breakdown

**Sherpa Action Requested**:
- Re-attempt breakdown with revised scope
- Confirm [X hours] estimate is now achievable
- Validate risk level is acceptable
```

---

## Feasibility Concerns → Scope Adjustment

実現可能性の懸念に基づくスコープ調整パターン。

### Adjustment Decision Matrix

| Concern Type | Impact | Preferred Adjustment |
|--------------|--------|---------------------|
| 技術的に不可能 | Critical | 機能削除 or 代替アプローチ |
| 工数が予算超過 | High | Phase分割 or MVP縮小 |
| 外部依存がブロック | High | Mock化 or 非同期対応 |
| 品質リスク | Medium | 追加テスト要件 or 段階リリース |
| パフォーマンス懸念 | Medium | 最適化要件追加 or 制限追加 |

### Scope Adjustment Template

```markdown
## SCOPE_ADJUSTMENT

**Original Feature**: [Feature name]
**Adjustment Reason**: [Feasibility concern from Sherpa]

### Impact Analysis

**Original Scope Impact**:
| Metric | Original | Adjusted | Change |
|--------|----------|----------|--------|
| User value | [High/Med/Low] | [High/Med/Low] | [+/-/=] |
| Effort | [X hours] | [Y hours] | [-Z%] |
| Risk | [High/Med/Low] | [High/Med/Low] | [Reduced/Same] |

### Adjustment Options

**Option 1: Remove Feature Aspect**
- Remove: [Aspect X]
- Keep: [Core functionality]
- Trade-off: [What users lose]
- Recommendation: [When to choose this]

**Option 2: Simplify Implementation**
- Change: [Complex approach] → [Simpler approach]
- Trade-off: [Performance / Flexibility / UX]
- Recommendation: [When to choose this]

**Option 3: Phase Split**
- Phase 1: [MVP subset]
- Phase 2: [Remaining]
- Trade-off: [Delayed full value]
- Recommendation: [When to choose this]

### Selected Adjustment

**Choice**: [Option N]
**Rationale**: [Why this option]

### Updated Proposal Summary

**What's In**:
- [Requirement 1]
- [Requirement 2]

**What's Out** (deferred or removed):
- [Requirement 3] → [Deferred to Phase 2 / Removed]

**User Communication** (if user-facing change):
- [How to explain reduced scope to users]
- [Future roadmap message]
```

---

## Integration Workflow

### Full Flow: Spark → Sherpa → Builder

```
Spark Proposal Created
        │
        ├── Complex? ───────────────────────────────┐
        │      │                                     │
        │      ↓                                     │
        │   SPARK_TO_SHERPA_HANDOFF                  │
        │      │                                     │
        │      ↓                                     │
        │   Sherpa Breakdown                         │
        │      │                                     │
        │      ├── OK ────────→ SHERPA_TO_BUILDER   │
        │      │                      │              │
        │      │                      ↓              │
        │      │                   Builder           │
        │      │                      │              │
        │      │                      ↓              │
        │      │                   Implementation    │
        │      │                                     │
        │      └── Concerns ──→ SHERPA_TO_SPARK     │
        │                           │               │
        │                           ↓               │
        │                     Spark Iteration       │
        │                           │               │
        │                           ↓               │
        │                     Revised Proposal      │
        │                           │               │
        │                           └───────────────┘
        │
        └── Simple? ────────────────────────────────┐
                                                     │
               SPARK_TO_BUILDER_HANDOFF (Direct)    │
                      │                              │
                      ↓                              │
                   Builder                           │
                      │                              │
                      ↓                              │
                   Implementation                    │
```

### Handoff Checklists

**Before Sherpa Handoff**:
- [ ] User story is complete and clear
- [ ] Acceptance criteria are testable
- [ ] DDD patterns are suggested (not mandated)
- [ ] API requirements are specified if applicable
- [ ] Priority is clear

**Before Builder Direct Handoff**:
- [ ] Feature is simple (< 4 hours estimate)
- [ ] Existing patterns can be followed
- [ ] No external dependencies pending
- [ ] Low risk
- [ ] All technical requirements specified

**After Sherpa Feedback**:
- [ ] Review all concerns
- [ ] Decide on adjustment approach
- [ ] Update proposal document
- [ ] Communicate scope changes to stakeholders
- [ ] Re-submit for breakdown

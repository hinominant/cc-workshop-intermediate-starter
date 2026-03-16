# Bridge Patterns

## Requirement Clarification Patterns

### Pattern 1: The Decomposition Pattern

**When to use:** Complex requirements that need breaking down

```markdown
## Decomposition Analysis

### Original Requirement
> "Users should be able to search for products"

### Component Breakdown

| Component | Questions | Implications |
|-----------|-----------|--------------|
| Search Input | Single field? Multiple filters? | UI complexity |
| Search Logic | Exact match? Fuzzy? Full-text? | Performance, infrastructure |
| Results | List? Grid? Pagination? | UX decisions |
| Sorting | Relevance? Price? Date? | Algorithm complexity |
| Filters | Categories? Price range? Rating? | Data model requirements |

### MVP Definition
- [x] Single search field
- [x] Basic text matching
- [x] Simple list results
- [ ] Advanced filters (Phase 2)
- [ ] Fuzzy search (Phase 2)
```

### Pattern 2: The Assumption Ladder

**When to use:** Requirements with many implicit assumptions

```markdown
## Assumption Ladder

### Stated Requirement
> "Send email notifications to users"

### Level 1: Obvious Assumptions
- Users have email addresses ✓
- We have email sending capability ✓

### Level 2: Hidden Assumptions
- Users want email (vs. push, SMS) ?
- All users or only active users ?
- Immediately or batched ?

### Level 3: Deep Assumptions
- Email deliverability requirements ?
- Unsubscribe requirements (legal) ?
- Template ownership (marketing vs. product) ?

### Validation Status
| Level | Assumption | Validated | By |
|-------|------------|-----------|-----|
| 1 | Has email capability | ✓ | Tech Lead |
| 2 | Users prefer email | ? | Need Researcher |
| 3 | Legal requirements | ? | Need Legal review |
```

### Pattern 3: The Trade-off Triangle

**When to use:** Competing constraints (speed, quality, scope)

```markdown
## Trade-off Triangle

        SCOPE
         /\
        /  \
       /    \
      /      \
     /________\
   TIME      QUALITY

### Current Position
- Scope: Fixed (launch feature X)
- Time: Flexible (can negotiate)
- Quality: Non-negotiable (security requirement)

### Trade-off Options

| Option | Scope | Time | Quality | Recommendation |
|--------|-------|------|---------|----------------|
| A | Full | +2 weeks | Full | Best if time available |
| B | MVP | On time | Full | **Recommended** |
| C | Full | On time | Reduced | Not acceptable (security) |

### Decision Required
Which constraint should flex?
```

---

## Stakeholder Alignment Patterns

### Pattern 4: The Perspective Map

**When to use:** Multiple stakeholders with different views

```markdown
## Perspective Map: [Feature Name]

### Stakeholder Perspectives

| Stakeholder | Primary Concern | Success Metric | Fear |
|-------------|-----------------|----------------|------|
| PM | Market timing | Launch date | Competitor beats us |
| Engineering | System stability | Error rate | Production incidents |
| Design | User experience | Task completion | Confusing interface |
| Sales | Customer asks | Deal closure | Losing deals |

### Alignment Points
- All agree: [Common ground]
- Conflict: [Where perspectives clash]
- Resolution: [How to bridge]

### Proposed Approach
[Approach that addresses all stakeholder concerns]
```

### Pattern 5: The Priority Stack

**When to use:** Everything is "high priority"

```markdown
## Priority Stack Exercise

### Rules
1. No ties allowed
2. Stack rank from 1 to N
3. "Must have for launch" can only be 3 items max

### Stacking Session

| Rank | Item | Stakeholder Vote | Final |
|------|------|------------------|-------|
| 1 | [Item] | PM: 1, Eng: 2 | 1 |
| 2 | [Item] | PM: 3, Eng: 1 | 2 |
| 3 | [Item] | PM: 2, Eng: 3 | 3 |
| 4+ | [Items] | - | Backlog |

### Launch Definition
- Must have: #1, #2, #3
- Should have: #4, #5
- Nice to have: #6+

### Sign-off
- [ ] PM agrees to stack
- [ ] Engineering commits to #1-3
- [ ] Design validates UX for #1-3
```

---

## Scope Management Patterns

### Pattern 6: The Scope Fence

**When to use:** Preventing scope creep

```markdown
## Scope Fence: [Feature Name]

### Inside the Fence (In Scope)
✅ [Explicit item 1]
✅ [Explicit item 2]
✅ [Explicit item 3]

### On the Fence (Conditional)
⚠️ [Item 4] - Only if time permits
⚠️ [Item 5] - Only if no blockers

### Outside the Fence (Out of Scope)
❌ [Explicit exclusion 1]
❌ [Explicit exclusion 2]
❌ [Explicit exclusion 3]

### Fence Rules
- Any change to "Inside" requires: [Approval process]
- "On the Fence" items evaluated: [Date]
- "Outside" items go to: [Backlog/Future phase]

### Fence Guardians
- PM: [Name]
- Tech Lead: [Name]
- Approval required from: [Both/Either]
```

### Pattern 7: The Impact Ripple

**When to use:** Assessing scope change impact

```markdown
## Impact Ripple: [Change Request]

### The Change
> [Description of requested change]

### Direct Impact (Ripple 1)
| Area | Impact | Effort |
|------|--------|--------|
| Code | [Changes needed] | [Hours] |
| Tests | [Changes needed] | [Hours] |
| Docs | [Changes needed] | [Hours] |

### Secondary Impact (Ripple 2)
| Area | Impact | Effort |
|------|--------|--------|
| Related features | [What else changes] | [Hours] |
| Dependencies | [What's affected] | [Hours] |
| Timeline | [Shift needed] | [Days] |

### Tertiary Impact (Ripple 3)
| Area | Impact | Effort |
|------|--------|--------|
| Other teams | [Who's affected] | [Coordination] |
| Future work | [What's harder later] | [Technical debt] |

### Total Impact
- Effort: [Sum of hours]
- Timeline: [Shift in days]
- Risk: [Low/Medium/High]

### Recommendation
[Approve/Defer/Reject with reasoning]
```

---

## Communication Patterns

### Pattern 8: The Translation Table

**When to use:** Explaining technical concepts to business

```markdown
## Translation Table: [Technical Topic]

### Technical → Business Dictionary

| Technical Term | Business Translation | Why It Matters |
|----------------|----------------------|----------------|
| Microservices | "Separate apps that talk to each other" | Can update parts without touching others |
| Technical debt | "Shortcuts that slow us down later" | Affects future feature speed |
| API | "A contract between systems" | Enables integrations |
| Cache | "A memory for frequent questions" | Makes the app faster |
| Database index | "A book's index for data" | Faster searches |

### Analogy Bank

| Concept | Analogy |
|---------|---------|
| Load balancing | "Multiple checkout lanes at a supermarket" |
| Authentication | "Showing ID at a club entrance" |
| Encryption | "Writing in a secret code only we can read" |
| Rollback | "Undoing changes like Ctrl+Z" |
```

### Pattern 9: The Decision Record

**When to use:** Documenting important decisions

```markdown
## Decision Record: DR-[Number]

### Metadata
- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Superseded | Deprecated
- **Deciders:** [Names]

### Context
[Background and why decision is needed]

### Decision
[The decision made, clearly stated]

### Rationale
[Why this decision over alternatives]

### Consequences
#### Positive
- [Good outcome 1]
- [Good outcome 2]

#### Negative
- [Trade-off 1]
- [Trade-off 2]

#### Risks
- [Risk 1] - Mitigation: [Strategy]

### Alternatives Considered
1. **[Option A]:** [Why rejected]
2. **[Option B]:** [Why rejected]

### Related Decisions
- [DR-X]: [How they relate]

### Review Date
[When to reconsider this decision]
```

---

## Meeting Patterns

### Pattern 10: The Alignment Checkpoint

**When to use:** Regular alignment meetings

```markdown
## Alignment Checkpoint: [Date]

### 1. Scope Check (5 min)
- Original scope: [Reference]
- Current state: [Status]
- Drift detected: [Yes/No]

### 2. Assumption Review (5 min)
| Assumption | Still Valid? | Action Needed |
|------------|--------------|---------------|
| [Assumption 1] | ✓ / ✗ | [If changed] |

### 3. Priority Confirmation (5 min)
- Top 3 priorities unchanged: [Yes/No]
- Restack needed: [Yes/No]

### 4. Blocker Surface (5 min)
| Blocker | Owner | ETA |
|---------|-------|-----|
| [Blocker 1] | [Name] | [Date] |

### 5. Next Actions (5 min)
| Action | Owner | Due |
|--------|-------|-----|
| [Action 1] | [Name] | [Date] |

### Attendees
- [Name] (Role) - Attended: ✓/✗
```

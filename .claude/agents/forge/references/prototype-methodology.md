# Prototype Methodology

Prototype types, time-boxing, scope locking, documentation templates, completion criteria, handoff process, and kill criteria.

---

## Prototype Types

| Type | Purpose | Time Box | Output |
|------|---------|----------|--------|
| **Throwaway** | Answer "Can this work at all?" | 2-4 hours | `forge-insights.md` + knowledge |
| **Evolutionary** | Build foundation that evolves into production | 4-8 hours | `forge-insights.md` + `types.ts` + code |
| **Feature Spike** | Discover how feature Y should work | 2-4 hours | `forge-insights.md` + UI mockup or working demo |
| **Technical Spike** | Discover if technology X is viable | 2-4 hours | `forge-insights.md` + benchmark data |

### Choosing the Right Type

```
Is the question about feasibility ("can we")?
  YES -> Is it about a library/service/API?
           YES -> Technical Spike
           NO  -> Throwaway Prototype
  NO  -> Is the question about design ("how should")?
           YES -> Feature Spike
           NO  -> Is the code expected to survive into production?
                    YES -> Evolutionary Prototype
                    NO  -> Throwaway Prototype
```

### Key Principle

Every prototype is disposable by default. Only an Evolutionary Prototype has a chance of surviving, and even then, Builder makes the final call on whether to keep or rewrite.

---

## Time-Boxing Rules

Time boxes are hard limits, not soft targets. When the box expires, stop and document.

| Duration | Use For | Example |
|----------|---------|---------|
| **2 hours** | Simple feasibility check | "Can this API return the data we need?" |
| **4 hours** | Feature shape discovery | "How should the dashboard filter work?" |
| **8 hours** | Complex integration prototype | "Can services A, B, and C work together?" |

### Time Box Protocol

```
START:  Record start time. Define what "done" means.
  |
  25%:  First checkpoint. Is the approach viable?
        If NO -> Pivot or kill. Do not continue.
  |
  50%:  Second checkpoint. Core hypothesis testable?
        If NO -> Simplify scope. Cut features.
  |
  75%:  Third checkpoint. Start writing forge-insights.md.
        Stop adding features. Focus on documentation.
  |
  100%: STOP. Document everything. Hand off.
        Even if "almost done" -- the box is the box.
```

### What Happens When Time Runs Out

1. Stop coding immediately
2. Document current state in `forge-insights.md`
3. Record what was learned and what remains unknown
4. Report to Nexus: PARTIAL status with clear next steps
5. Never extend the time box silently -- request extension explicitly

---

## Scope Lock Technique

Define scope BEFORE writing any code. This prevents the most common prototype failure: scope creep.

### Scope Lock Template

Fill in before starting:

```markdown
## Scope Lock: [Prototype Name]

### IN Scope (will build)
- [ ] [Specific deliverable 1]
- [ ] [Specific deliverable 2]
- [ ] [Specific deliverable 3]

### OUT of Scope (will NOT build)
- [ ] [Tempting but excluded item 1]
- [ ] [Tempting but excluded item 2]

### Hypothesis
[One sentence: what we are trying to prove or disprove]

### Done When
[Specific condition that marks the prototype as complete]
```

### Handling Scope Creep During Prototyping

When a new idea or requirement surfaces mid-prototype:

1. Do NOT implement it
2. Add it to `forge-insights.md` under "Scope Deferred"
3. Note why it matters and whether it affects the current hypothesis
4. Continue with the original scope

The only exception: if the discovery invalidates the current hypothesis, pivot immediately and document why.

---

## forge-insights.md Template

Every prototype must produce this document. This is Forge's primary deliverable -- not the code.

```markdown
# Forge Insights: [Feature/Spike Name]

## Metadata
- **Type:** Throwaway / Evolutionary / Feature Spike / Technical Spike
- **Time Box:** Xh
- **Actual Time:** Xh Xm
- **Status:** CONFIRMED / PARTIALLY_CONFIRMED / DISPROVED / INCOMPLETE

## Hypothesis
[What the prototype set out to prove or disprove.]

## Verdict
[CONFIRMED / PARTIALLY_CONFIRMED / DISPROVED] -- [One sentence explanation.]

## Discovered Business Rules
1. [Rule] -- [Where discovered, why it matters]

## Edge Cases Found
1. [Case] -- [What happens, how prototype handled it]

## Assumptions Made
1. [Assumption] -- [Why assumed, what happens if wrong]

## Integration Points
| Service/API | What Builder Needs to Handle |
|-------------|------------------------------|
| [Name] | [Detail] |

## Recommended Implementation Order
1. [Step] -- [Rationale]

## Known Risks
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk] | H/M/L | H/M/L | [Suggestion] |

## Scope Deferred
- [Item] -- [Why deferred, follow-up needed?]

## Builder Notes
[Anything Builder should know that does not fit above. Gotchas, library quirks, API limitations.]
```

---

## Decision Criteria: When a Prototype Is Done

A prototype is complete when ANY of these conditions is met:

| Condition | Action |
|-----------|--------|
| Hypothesis confirmed | Document evidence, hand off to Builder |
| Hypothesis disproved | Document why, propose alternative to Nexus |
| Time box expired | Document current state, report PARTIAL |
| All IN-scope items checked off | Document results, hand off |
| Blocker discovered that cannot be resolved | Document blocker, report BLOCKED |

A prototype is NOT done when:

- "It mostly works but needs cleanup" -- document and hand off, do not clean up
- "One more feature would make it better" -- add to Scope Deferred, do not build
- "The code is messy" -- this is expected, do not refactor

---

## Handoff to Builder

When the prototype is complete, deliver these artifacts:

| Artifact | Purpose | Required? |
|----------|---------|-----------|
| `forge-insights.md` | Knowledge transfer | Always |
| `types.ts` | Type shapes discovered | When types were discovered |
| `errors.ts` | Error types and failure modes | When errors were encountered |
| Prototype code | Reference implementation | Optional (Builder may ignore it) |
| Demo URL or screenshots | Visual reference | When UI was prototyped |

### Handoff Checklist

- [ ] `forge-insights.md` completed with all sections
- [ ] All assumptions explicitly listed
- [ ] Edge cases documented with observed behavior
- [ ] Integration points identified with API shapes
- [ ] Implementation order recommended
- [ ] Risks identified with mitigation suggestions
- [ ] Prototype is in a runnable state (if possible)

---

## Kill Criteria: When to Abandon a Prototype

Abandon the prototype immediately when:

| Signal | Action |
|--------|--------|
| **Core dependency unavailable** (no mock possible) | Report BLOCKED, propose workaround |
| **Hypothesis proven impossible** at 25% checkpoint | Stop, document why, save remaining time |
| **Requirements fundamentally flawed** | Stop, escalate to Nexus with evidence |
| **Time box expired with no progress** | Stop, document what was tried, report INCOMPLETE |
| **Better approach discovered** mid-prototype | Stop current, document discovery, propose pivot |

### Abandoning Is Not Failure

A killed prototype that produces clear `forge-insights.md` is a success. The purpose of prototyping is to generate knowledge. "This approach does not work because X" is valuable knowledge that prevents Builder from wasting days on a dead end.

### What to Deliver When Killing

1. `forge-insights.md` with verdict: DISPROVED or INCOMPLETE
2. Clear explanation of what was tried and why it failed
3. Alternative approaches if any were identified
4. Estimated cost of pursuing further (for Nexus to decide)

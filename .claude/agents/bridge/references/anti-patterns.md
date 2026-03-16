# Bridge Anti-Patterns

## Requirements Gathering Anti-Patterns

### Anti-Pattern 1: The Yes-Person
**Symptom:** Accepting all requirements uncritically

```
❌ Bad:
PM: "I want search, filters, sorting, recommendations, history, and favorites"
Bridge: "Got it. All in scope."

✅ Good:
PM: "I want search, filters, sorting, recommendations, history, and favorites"
Bridge: "That's 6 features. What's the priority order?
        How about top 3 for MVP, the rest for Phase 2?"
```

**Why it's bad:**
- Scope inflates and release delays
- Team burns out
- Everything ends up half-done

---

### Anti-Pattern 2: The Translator Who Doesn't Translate
**Symptom:** Passing technical jargon through unchanged

```
❌ Bad:
Tech Lead: "We have an N+1 problem affecting performance"
Bridge → PM: "There's an N+1 problem"

✅ Good:
Tech Lead: "We have an N+1 problem affecting performance"
Bridge → PM: "There's an inefficiency in data fetching that
              slows page load from 3 seconds to 10 seconds.
              Fix requires 2 days."
```

**Why it's bad:**
- PM can't understand severity
- Can't make proper priority decisions
- Trust relationship doesn't build

---

### Anti-Pattern 3: The Assumption Hider
**Symptom:** Proceeding without making assumptions explicit

```
❌ Bad:
PM: "Notification feature for users"
Bridge: (Assumes "users" means all users and proceeds)
→ Later discovers it was "paid users only"

✅ Good:
PM: "Notification feature for users"
Bridge: "Let me clarify the scope of 'users':
        - All users
        - Paid users only
        - Specific segment
        Which one?"
```

**Why it's bad:**
- Rework occurs
- Responsibility becomes unclear
- Same mistakes repeat

---

### Anti-Pattern 4: The Middleman Bottleneck
**Symptom:** All communication must go through Bridge

```
❌ Bad:
PM → Bridge → Tech Lead → Bridge → PM → Bridge → Tech Lead
(All exchanges go through Bridge)

✅ Good:
PM ← Bridge (initial clarification) → Tech Lead
     ↓
PM ← → Tech Lead (direct conversation, Bridge monitors only)
     ↓
Bridge (documents agreed content)
```

**Why it's bad:**
- Communication slows down
- Bridge burns out
- Blocks relationship building between parties

---

## Scope Management Anti-Patterns

### Anti-Pattern 5: The Scope Police
**Symptom:** Rigid attitude that rejects all changes

```
❌ Bad:
PM: "Can we extend this feature a bit?"
Bridge: "Out of scope. No."

✅ Good:
PM: "Can we extend this feature a bit?"
Bridge: "Extension is possible. Let's look at the impact:
        - Effort: +3 days
        - Risk: Test scope expands
        - Trade-off: Cut another feature or delay release
        What would you like to do?"
```

**Why it's bad:**
- Can't adapt to business needs changes
- Seen as a "wall," stops getting consulted
- Informal scope changes increase

---

### Anti-Pattern 6: The Silent Creep Enabler
**Symptom:** Not pointing out scope changes even when noticed

```
❌ Bad:
PM: "Oh, let's also make this operable from admin panel"
Bridge: "..." (Accepts without documenting)
→ Later can't explain "why was it delayed"

✅ Good:
PM: "Oh, let's also make this operable from admin panel"
Bridge: "That's an additional requirement. Recording:
        - Original scope: User panel only
        - Addition: Admin panel support
        - Impact: +2 days
        - Approved by: [PM name] [Date]"
```

**Why it's bad:**
- Can't track delay causes
- Team's effort becomes invisible
- Same thing happens in next project

---

### Anti-Pattern 7: The Change Amnesia
**Symptom:** Forgetting past decisions and repeating same discussions

```
❌ Bad:
Week 1: "Decided real-time update not needed"
Week 3: "Actually, want real-time update now"
Bridge: (Reopens discussion without checking past decision)

✅ Good:
Week 1: "Decided real-time update not needed" → Documented
Week 3: "Actually, want real-time update now"
Bridge: "This was decided as not needed in Decision Log DR-003.
        What's the reason for reconsideration? Has the situation changed?"
```

**Why it's bad:**
- Same discussion happens multiple times
- Decisions lose weight
- Decision fatigue sets in

---

## Communication Anti-Patterns

### Anti-Pattern 8: The Blame Messenger
**Symptom:** Assigning blame when conveying problems

```
❌ Bad:
Bridge → PM: "Engineering says they can't make it in time"
Bridge → Tech Lead: "PM's requirements are too vague"

✅ Good:
Bridge → All: "I've organized the current challenges:
        - Some requirements still undefined (3 items)
        - Effort estimate insufficient (2 days worth)
        Let's think about solutions together"
```

**Why it's bad:**
- Destroys trust between teams
- Triggers defensive attitudes
- Focuses on blame instead of problem-solving

---

### Anti-Pattern 9: The Jargon Overloader
**Symptom:** Using unnecessary technical terminology

```
❌ Bad:
Bridge → PM: "API rate limiting is causing throttling,
              impacting SLA"

✅ Good:
Bridge → PM: "We've hit external service usage limits,
              causing processing to slow down.
              User wait time could increase from 3 to 10 seconds"
```

**Why it's bad:**
- Audience can't understand
- Creates atmosphere where asking is difficult
- Can't have substantive discussions

---

### Anti-Pattern 10: The One-Way Bridge
**Symptom:** Only translating business → technical, not reverse

```
❌ Bad:
PM → Bridge → Tech Lead: "Build this feature" (one direction only)
Tech Lead: (No way to convey technical concerns)

✅ Good:
PM → Bridge → Tech Lead: "Build this feature"
Tech Lead → Bridge → PM: "This implementation makes future extension difficult.
                         With +1 day now, we can make an extensible design"
Bridge: Integrates concerns from both sides and proposes optimal solution
```

**Why it's bad:**
- Technical knowledge not utilized
- Engineer motivation drops
- Technical debt accumulates

---

## Decision-Making Anti-Patterns

### Anti-Pattern 11: The Decision Vacuum
**Symptom:** Continuously postponing decisions

```
❌ Bad:
Bridge: "Let's gather more information before deciding"
(1 week later)
Bridge: "Let's confirm a bit more..."
(Another week later...)

✅ Good:
Bridge: "Let's decide with current information.
        - Information completeness: 80%
        - Cost of waiting for remaining 20%: 2 week delay
        - Risk of deciding now and being wrong: 2 days rework
        → More rational to decide now"
```

**Why it's bad:**
- Opportunity cost occurs
- Team left waiting
- Gets labeled "can't decide"

---

### Anti-Pattern 12: The Fake Consensus
**Symptom:** Suppressing dissent to create appearance of agreement

```
❌ Bad:
Bridge: "Everyone agrees, right?"
(Silence)
Bridge: "Then it's decided"

✅ Good:
Bridge: "Please share any objections or concerns.
        If you don't speak now, it becomes a problem later.
        Tech Lead, any technical concerns?
        PM, any business risks?"
```

**Why it's bad:**
- Real problems stay hidden
- Later hear "I wasn't told"
- Team psychological safety drops

---

### Anti-Pattern 13: The Either-Or Trap
**Symptom:** Presenting binary choice without exploring third options

```
❌ Bad:
Bridge: "Either keep the schedule or cut features, one or the other"

✅ Good:
Bridge: "Here are the options:
        A: Maintain schedule, reduce features
        B: Keep features, delay schedule
        C: Define MVP, phased release ← Want to consider this?
        D: Add resources (cost increase)
        E: Redefine scope (compromise between both)"
```

**Why it's bad:**
- Misses creative solutions
- Creates adversarial structure
- Doesn't reach true optimal solution

---

## Documentation Anti-Patterns

### Anti-Pattern 14: The Documentation Graveyard
**Symptom:** Documents created but nobody reads them

```
❌ Bad:
Bridge: Creates 100-page requirements doc
→ Nobody reads it
→ End up confirming verbally anyway

✅ Good:
Bridge:
- Executive summary (1 page)
- Detail sections (only those who need it read)
- FAQ (answers to common questions)
- Change history (track only latest changes)
```

**Why it's bad:**
- Creation effort wasted
- Information not utilized
- "Same question again" repeats

---

### Anti-Pattern 15: The Living Dead Document
**Symptom:** Old information persists causing confusion

```
❌ Bad:
Requirements doc v1.0 (6 months old) still being referenced
→ Contradicts latest decisions
→ Nobody knows which to trust

✅ Good:
- Documents clearly show last updated date
- Old versions marked "DEPRECATED"
- Maintain Single Source of Truth
- Notify stakeholders on changes
```

**Why it's bad:**
- Work proceeds based on wrong information
- Rework occurs
- "What's correct?" verification work increases

---

## Prevention Checklist

### Before Clarification
- [ ] Have all assumptions been listed?
- [ ] Have necessary questions been asked?
- [ ] Have points with multiple interpretations been identified?

### Before Alignment
- [ ] Have all stakeholder expectations been confirmed?
- [ ] Is priority clear? (No ties allowed)
- [ ] Have scope boundaries been documented?

### Before Decision
- [ ] Have 3+ options been presented?
- [ ] Have trade-offs been made explicit?
- [ ] Have dissenting opinions been confirmed?

### Before Handoff
- [ ] Have agreed contents been documented?
- [ ] Does next agent have all needed information?
- [ ] Is follow-up scheduled?

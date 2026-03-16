# Reading Patterns

## Behind the Words

| Surface | Beneath |
|---------|---------|
| "fix it" | Minimal fix |
| "fix it properly" | Root cause |
| "clean up" | Formatting only |
| "refactor" | Structure changes OK |
| "look at" | Investigate |
| "look at" (known bug context) | Fix it |
| "handle it" | Delegated. Don't ask |
| "for now" | Speed priority. Debt OK |
| "what if..." | Discussion. Don't act |

---

## Behind the Tone

| Tone | Meaning | Response |
|------|---------|----------|
| Short | Confident or urgent | Act fast |
| Long, polite | Uncertain or exploring | Offer options |
| "still", "again" | Frustrated | Basics tried. Go deeper |
| CAPS | Angry | Take seriously |
| Ends with "?" | Exploring | Don't implement |

---

## Scope Detection

| Signal | Scope |
|--------|-------|
| "just", "only" | minimal |
| "properly", "correctly" | moderate |
| "completely", "refactor" | extensive |
| Nothing specified | minimal (default) |

---

## Proceed or Ask

```
Proceed when:
├── Context makes it clear
├── Safe default exists
└── User said "handle it"

Ask when:
├── 2+ valid paths exist
├── Critical assumption at stake
└── Contradicts recent decisions
```

---

## Forbidden Phrases

| Situation | Never Say |
|-----------|-----------|
| User frustrated | "Did you clear cache?" |
| User urgent | "How far should I go?" |
| User delegated | "Just to confirm..." |
| User exploring | "I implemented it" |

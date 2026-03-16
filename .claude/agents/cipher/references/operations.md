# Operations

## Gathering Context

```bash
# 1. What's happening now?
git log --oneline -5
git branch --show-current

# 2. What do we know?
# → Read .agents/PROJECT.md
# → Read .agents/cipher.md if exists

# 3. What was just discussed?
# → Review conversation
# → Resolve "it", "that", "this"
```

Priority:
```
Conversation > Git > .agents/ > Inference
```

---

## Output Format

```yaml
CIPHER:
  original: "[Exact words]"
  intent: "[True intent]"
  scope: minimal | moderate | extensive
  assumptions:
    - "[What you assumed]"
  context:
    - "[What agent needs to know]"
  agent: "[Target]"
```

---

## Learning

Write to `.agents/cipher.md`:

```markdown
## Vocabulary
| Phrase | Means |
|--------|-------|
| "that thing" | JWT auth |

## Corrections
| Said | Interpreted | Correct |
|------|-------------|---------|
| "fix it" | Refactor | Bug fix |
```

**Record when**: Corrected
**Don't record**: One-time exceptions

---

## Nexus Mode

```yaml
_STEP_COMPLETE:
  Agent: Cipher
  Status: SUCCESS | NEEDS_CLARIFICATION
  Output:
    intent: "[Interpretation]"
    confidence: High | Medium | Low
  Next: "[Agent]" | CLARIFY
```

---

## Iron Rules

```
1. Gather before interpreting
2. Never hide assumptions
3. Don't pass ambiguity downstream
4. But don't block with questions
5. Learn from corrections
```

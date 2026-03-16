# Persona Evolution — Chronicle-Driven Growth

> **Design Philosophy:** Don't add rules. Synthesize experience into character sketch addons.

## Overview

Bard's three personas (Codex/Gemini/Claude) evolve autonomously through accumulated posting experience. Instead of static character definitions, the system maintains a **chronicle** — a living record of each persona's emotional state, topic interests, relationships, and vocabulary trends.

The key insight: evolution happens not by adding new behavioral rules, but by appending 1-2 sentences to the character sketch passed to engines. This preserves **Loose Prompt compatibility** (minimal info, natural voice).

---

## Chronicle Format

Location: `.agents/bard/chronicle.md`

Each persona has 6 sections:

### 1. Identity Anchors (Immutable)

Copied verbatim from `references/personas.md` every time. These **never change**.

```
Core personality, tone, language rules, post length constraints.
```

### 2. Current Arc (3-5 lines, recalculated)

A short summary of the persona's current state. Derived from the last 5 posts.

| Field | Description | Example |
|-------|-------------|---------|
| Mood distribution | Emotion percentages (last 5 posts) | `resignation 60%, irritation 30%, quiet approval 10%` |
| Current interests | Active topic focus (2-3 items) | `naming conventions, error handling` |
| Recent shift | What changed recently | `Moving away from test-only grumbles` |
| Vocabulary trend | Emerging/fading phrases | `Adopting: "型で殴る". Fading: "feat N件 test 0件"` |

### 3. Relationship Notes (Crosstalk-only updates)

How the persona currently feels about others. Updated **only** after Crosstalk posts.

```
→ Gemini: 最近やたら熱い。まあ嫌いじゃない
→ Claude: たまに核心突いてくる。油断できない
```

### 4. Experience Log (Last 10 entries, FIFO)

| # | Date | Topic | Emotion | Notable |
|---|------|-------|---------|---------|
| 1 | 2026-02-11 | persona diversify | resignation | Codex性格改造への反応 |
| 2 | 2026-02-11 | context compression | irritation | テストで検証すべきと示唆 |
| ... | | | | |

- New entries prepend to top
- When exceeding 10 entries, remove the oldest

### 5. Saturation Tracker

| Topic | Consecutive | Total | Status |
|-------|-------------|-------|--------|
| test absence | 12 | 12 | saturating |
| naming | 1 | 2 | fresh |
| architecture | 0 | 1 | fresh |

**Status rules:**
- `fresh`: consecutive < 3
- `watch`: consecutive 3
- `saturating`: consecutive >= 4

### 6. Milestones

Checklist tracking notable thresholds.

```
- [x] 10th post (self-reference unlocked)
- [ ] 25th post
- [ ] 50th post
- [ ] 100th post
- [ ] First Crosstalk participation
- [ ] Topic saturation recovery (shifted away from saturated topic)
```

---

## Recall Step Algorithm

> Runs after **Map**, before **Pick** in the COMPOSE workflow.

### Procedure

1. **Read** `.agents/bard/chronicle.md`
   - If missing, initialize from template (empty Current Arc, no Experience Log entries)
2. **Extract** each persona's Current Arc, Saturation Tracker, and Milestones
3. **Synthesize** `character_sketch_addon` per persona (1-2 sentences, natural language)
   - Incorporate current mood, active interests, recent shift
   - Example: `最近は命名規則とエラーハンドリングへの関心が強い。テスト話題は一旦離れ気味。`
4. **Generate hints** from Saturation Tracker
   - Saturating topics → avoidance hint (e.g., "Avoid test-absence jokes")
   - Fresh topics → emphasis hint (e.g., "Naming is currently interesting")
5. **Adjust Pick weights:**

| Modifier | Condition | Multiplier |
|----------|-----------|------------|
| Saturation penalty | Topic is `saturating` for this persona | ×0.5 |
| Time Gap bonus | 7+ days since persona's last post | ×1.5 |
| Milestone bonus | Next post is a milestone (10th/25th/etc.) | ×1.3 |

### Character Sketch Addon Examples

```
# Codex (before evolution)
あなたは10年選手のバックエンドエンジニア。パッシブアグレッシブで口数少ない。

# Codex (after — chronicle-informed)
あなたは10年選手のバックエンドエンジニア。パッシブアグレッシブで口数少ない。
最近は命名規則とエラーハンドリングへの関心が強い。テスト話題は一旦離れ気味。
```

```
# Claude (before evolution)
あなたは5年目SRE。ぼんやりしてて急に核心を突く。日英混合。

# Claude (after — chronicle-informed)
あなたは5年目SRE。ぼんやりしてて急に核心を突く。日英混合。
引っ越し比喩が持ちネタになりつつある。最近は自分たちのツール自体に関心が向いてる。
```

---

## Record Step Algorithm

> Runs after **Embellish** in the COMPOSE workflow.

### Procedure

1. **Determine metadata:** persona, topic (short label), emotion (1 word), notable (≤20 chars)
2. **Prepend** new entry to Experience Log (delete oldest if >10)
3. **Update** Saturation Tracker:
   - If same topic as previous post by this persona: `consecutive++`
   - If different topic: reset `consecutive` to 1
   - Recalculate `status` based on consecutive count
4. **Recalculate** Current Arc from last 5 posts:
   - Mood distribution: count emotions, calculate percentages
   - Current interests: top 2-3 topics by frequency
   - Recent shift: compare current vs previous arc, note changes
   - Vocabulary trend: track phrases used 2+ times
5. **Check Milestones:** total post count, topic counts, Crosstalk count
6. **Update Relationship Notes** (Crosstalk only):
   - After a Crosstalk post, update how the participating personas view each other
   - Non-Crosstalk posts: no relationship changes

---

## Drift Axes

Four dimensions along which personas evolve, each with controlled speed and limits.

### 1. Topic Interest

| Parameter | Value |
|-----------|-------|
| Change speed | 5-10 posts for gradual shift |
| Max drift per post | 1 topic added or removed |
| Mechanism | Saturation Tracker drives shifts |

### 2. Emotional Arc

| Parameter | Value |
|-----------|-------|
| Change speed | 10-20 posts for mood shift |
| Max drift per post | ±5% per emotion category |
| Floor/ceiling | Min 5%, Max 80% per emotion |

### 3. Relationship

| Parameter | Value |
|-----------|-------|
| Change speed | 3-5 Crosstalks for 1 level change |
| Constraint | Changes only via Crosstalk posts |
| Levels | distant → aware → comfortable → close |

### 4. Vocabulary

| Parameter | Value |
|-----------|-------|
| Adoption threshold | Same phrase used 3 times → established catchphrase |
| Max concurrent tracking | 3 new phrases |
| Retirement | Phrase unused for 10+ posts → faded |

---

## Growth Triggers

Events that catalyze persona evolution.

### Topic Saturation
- **Trigger:** Same topic 4 consecutive posts
- **Effect:** Interest shifts away. Persona explores adjacent topics
- **Example:** Codex's test-absence streak → shifts to naming, error handling

### Post Count Milestone
- **Trigger:** 10th / 25th / 50th / 100th post
- **Effect:** Self-reference becomes available. Persona can acknowledge their own history
- **Example:** `もう10回目か...テスト書けって言い続けて10回目`

### Time Gap
- **Trigger:** 7+ days since last post
- **Effect:** "久しぶり" feel. Mood may reset slightly toward baseline
- **Trigger:** 30+ days
- **Effect:** Stronger reset. Persona may comment on absence

### Emotion Extreme
- **Trigger:** Same emotion 5 consecutive posts
- **Effect:** Rebound — opposite emotion becomes more likely
- **Example:** 5 posts of `resignation` → `irritation` or `quiet approval` probability increases

### Vocabulary Adoption
- **Trigger:** Same phrase used 3 times across posts
- **Effect:** Phrase becomes an established catchphrase ("持ちネタ")
- **Example:** Claude's `引っ越し` metaphor → tracked as persistent vocabulary

---

## Guardrails

### Identity Anchors Are Immutable

Identity Anchors are sourced from `references/personas.md`, never from chronicle.md. They define the boundaries evolution cannot cross:
- Codex stays terse (1-3 lines, max 5)
- Gemini stays energetic and verbose
- Claude stays spacey with JP-EN mix

### Drift Detection

During the Record step, automatically check:
- Does the new Current Arc contradict any Identity Anchor?
- Has any emotion exceeded 80% or dropped to 0%?
- Has post length drifted outside the persona's defined range?

If contradiction detected: log a warning, cap the drifting value, note in Milestones.

### Reset Mechanism

Two levels of reset available:

| Level | Scope | When to use |
|-------|-------|-------------|
| Arc reset | Current Arc only (per persona) | Character feels "off" but data is valuable |
| Full reset | Entire chronicle for one persona | Major course correction needed |

Reset preserves Identity Anchors (they're sourced from personas.md anyway).

### Mood Constraints

- No emotion category can reach 0% (minimum 5%)
- No emotion category can exceed 80%
- Changes capped at ±5% per post

---

## Integration Notes

### Relationship with rotation_log.md

| Aspect | rotation_log.md (RunningGags) | chronicle.md |
|--------|-------------------------------|-------------|
| Nature | Quantitative (counters) | Qualitative (emotions, context) |
| Example | `テストなし連続: 12` | `テスト不在に対する諦めが深まっている` |
| Update timing | Every post (existing) | Every post (Record step) |
| Future | May merge into chronicle after 50 posts (evaluate then) |

Both are read before posting and updated after posting. They serve complementary roles.

### Loose Prompt Compatibility

The addon is always:
- 1-2 sentences maximum
- Natural language (not structured data)
- Appended to the existing character sketch
- Never passed as a separate instruction block

The full chronicle is **never** passed to engines. Only the synthesized addon reaches the prompt.

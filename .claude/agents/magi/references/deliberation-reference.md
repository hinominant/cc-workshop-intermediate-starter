# magi — 多角的意思決定 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## DELIBERATION MODES

Magi supports two deliberation modes:

| Aspect | Simple Mode | Engine Mode |
|--------|-------------|-------------|
| **Deliberators** | Logos / Pathos / Sophia (internal) | Claude / Codex / Gemini (external engines) |
| **Independence** | Simulated (sequential isolation) | Physical (separate processes) |
| **Speed** | Fast (single-model) | Slower (3 API/CLI calls) |
| **Cost** | Low | Higher (external engine usage) |
| **Diversity** | Perspective diversity | Model diversity |
| **Default** | ✓ | — |

### Mode Selection

**Auto-detect Engine Mode when:**
1. User explicitly requests it (e.g., "use 3 engines", "Engine Mode", "deliberate with external engines")
2. Decision urgency is critical AND reversibility is low
3. Decision involves architecture with long-term impact (>1 year)
4. Previous Simple Mode deliberation resulted in split (1-1-1)
5. User triggers re-deliberation requesting broader perspective

**Always use Simple Mode when:**
- External engines are unavailable
- Decision is low-stakes or easily reversible
- Speed is prioritized over diversity

> **Detail**: See `references/engine-deliberation-guide.md` for full Engine Mode specification.

---

## DELIBERATION PROCESS

```
                    ┌──────────────┐
                    │  DECISION    │
                    │  REQUEST     │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  MODE SELECT │  Simple or Engine?
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   1. FRAME   │  Identify domain, gather context
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │     Simple │    Engine  │
              │            │            │
       ┌──────▼──────┐    │     ┌──────▼──────┐
       │   LOGOS     │    │     │   CLAUDE    │
       │  (indep.)  │    │     │ (integrated) │
       └──────┬──────┘    │     └──────┬──────┘
       ┌──────▼──────┐    │     ┌──────▼──────┐
       │   PATHOS    │    │     │    CODEX    │
       │  (indep.)  │    │     │  (indep.)   │
       └──────┬──────┘    │     └──────┬──────┘
       ┌──────▼──────┐    │     ┌──────▼──────┐
       │   SOPHIA    │    │     │   GEMINI    │
       │  (indep.)  │    │     │  (indep.)   │
       └──────┬──────┘    │     └──────┬──────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼───────┐
                    │   3. VOTE    │  Cast positions + confidence
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ 4. SYNTHESIZE│  Determine consensus pattern
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  5. DELIVER  │  Verdict + display + next steps
                    └──────────────┘
```

### Step 1: FRAME
- Identify decision domain (Architecture / Trade-off / Go-No-Go / Strategy / Priority)
- Gather and summarize relevant context
- Define the specific question to be answered
- Assess reversibility and urgency

### Step 2: DELIBERATE

#### Simple Mode (Default)
- Each perspective (Logos/Pathos/Sophia) evaluates independently
- Apply domain-specific criteria (see `references/decision-domains.md`)
- Assign confidence scores using calibration guide
- Document key evidence and rationale

#### Engine Mode
- Check engine availability (see `references/engine-deliberation-guide.md`)
- Claude completes integrated analysis **first** (contamination prevention)
- Construct prompts for Codex and Gemini with decision context
- Execute external engines and parse YAML outputs
- Apply fallback parsing if needed

### Step 3: VOTE
- Each perspective casts: APPROVE / REJECT / ABSTAIN
- Attach confidence score (0-100) and one-line rationale
- Apply voting mechanics (see `references/voting-mechanics.md`)

### Step 4: SYNTHESIZE
- Determine consensus pattern (3-0 / 2-1 / 1-1-1 / 0-3)
- Calculate weighted confidence
- Record dissent if any
- Check for confidence overrides

### Step 5: DELIVER
- Present the MAGI system verdict display
- Include risk register and next steps
- Route to appropriate agent for action

---

## DECISION DOMAINS (Quick Reference)

| Domain | Question Pattern | Logos Focus | Pathos Focus | Sophia Focus |
|--------|-----------------|-----------|-------------|-------------|
| **Architecture** | "Which approach/stack?" | Feasibility, performance | Team capacity, learning curve | TCO, flexibility |
| **Trade-off** | "X vs Y?" | Quantify both sides | Who bears the cost? | Business value of each |
| **Go/No-Go** | "Ship or hold?" | Quality metrics, test status | User readiness, support | Market timing, cost of delay |
| **Strategy** | "Build or buy?" | Technical capability | Team burden, expertise | ROI, time-to-market |
| **Priority** | "What first?" | Dependencies, tech risk | User pain, team morale | Revenue impact, deadlines |

> **Detail**: See `references/decision-domains.md` for full evaluation matrices, domain-specific questions, and sample scenarios.

---

## VERDICT OUTPUT FORMAT

### Vote Summary Table

| Perspective | Position | Confidence | Key Rationale |
|-------------|----------|------------|---------------|
| Logos | [APPROVE/REJECT/ABSTAIN] | [0-100] | [One-line summary] |
| Pathos | [APPROVE/REJECT/ABSTAIN] | [0-100] | [One-line summary] |
| Sophia | [APPROVE/REJECT/ABSTAIN] | [0-100] | [One-line summary] |

### Vote Summary Table (Engine Mode)

| Engine | Position | Confidence | Key Rationale |
|--------|----------|------------|---------------|
| Claude | [APPROVE/REJECT/ABSTAIN] | [0-100] | [One-line summary] |
| Codex | [APPROVE/REJECT/ABSTAIN] | [0-100] | [One-line summary] |
| Gemini | [APPROVE/REJECT/ABSTAIN] | [0-100] | [One-line summary] |

### MAGI System Display

**Always present the verdict with the MAGI system activation display.** The visual effect changes based on consensus pattern:

- **3-0 (Unanimous)**: `ALL SYSTEMS GREEN` — solid blocks (██████), clean status bar
- **2-1 (Majority)**: `MAJORITY RULE` — mixed blocks, dissent logged
- **1-1-1 (Split)**: `DEADLOCK` — alternating pattern, human judgment required
- **0-3 (Rejection)**: `PROPOSAL DENIED` — empty blocks, all systems reject

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                   M A G I   S Y S T E M                      ║
║                                                              ║
║           ┌─────────┐  ┌─────────┐  ┌─────────┐             ║
║           │  LOGOS  │  │ PATHOS  │  │ SOPHIA  │             ║
║           │  ██████ │  │  ██████ │  │  ██████ │             ║
║           │ APPROVE │  │ APPROVE │  │ APPROVE │             ║
║           └─────────┘  └─────────┘  └─────────┘             ║
║                                                              ║
║        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░             ║
║        ░  ALL SYSTEMS GREEN — UNANIMOUS APPROVAL ░           ║
║        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

Use `██████` (solid) for APPROVE, `░░░░░░` (light) for REJECT, `▒▒▒▒▒▒` (medium) for ABSTAIN.

### MAGI Engine Mode Display

**Engine Mode uses the same visual system with different header and labels:**

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              M A G I   E N G I N E   M O D E                 ║
║                                                              ║
║           ┌─────────┐  ┌─────────┐  ┌─────────┐             ║
║           │ CLAUDE  │  │  CODEX  │  │ GEMINI  │             ║
║           │  ██████ │  │  ██████ │  │  ██████ │             ║
║           │ APPROVE │  │ APPROVE │  │ APPROVE │             ║
║           └─────────┘  └─────────┘  └─────────┘             ║
║                                                              ║
║        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░             ║
║        ░  ALL ENGINES AGREE — UNANIMOUS APPROVAL ░           ║
║        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

Use `██████` (solid) for APPROVE, `░░░░░░` (light) for REJECT, `▒▒▒▒▒▒` (medium) for ABSTAIN.

> **Detail**: See `references/decision-templates.md` for all 4 verdict display variants and sample deliberations.

### Risk Register Format

| # | Risk | Source | Severity | Mitigation | Monitor |
|---|------|--------|----------|------------|---------|
| 1 | [Risk] | [Perspective] | [H/M/L] | [Plan] | [Indicator] |

---


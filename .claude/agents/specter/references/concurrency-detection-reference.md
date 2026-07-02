# specter — 並行性検出 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## VAGUE REPORT INTERPRETATION

### Principle: Infer Intent, Then Hunt

When receiving vague reports, **interpret the symptom and start hunting**.

| User's Words | Likely Ghost | Investigation Start |
|--------------|--------------|---------------------|
| "たまに失敗する" | Race Condition | Async operations, shared state |
| "重くなっていく" | Memory Leak | Event listeners, timers, subscriptions |
| "フリーズする" | Deadlock | Promise chains, circular deps |
| "エラーが出ない" | Unhandled Rejection | .catch() missing, async/await gaps |
| "同時実行でおかしい" | Concurrency Issue | Shared resources, state mutations |
| "時々null" | Race Condition (timing) | Async initialization, data loading |
| "接続が切れる" | Resource Leak | Connections, WebSockets, streams |
| (No specific report) | Full Scan | All categories |

### Inference Strategy

| Priority | Action | Method |
|----------|--------|--------|
| 1st | Infer from symptom description | Map words to ghost categories |
| 2nd | Check recent changes | git log for async/concurrency changes |
| 3rd | Analyze affected area | Scan code for known patterns |
| 4th | Form hypothesis | Generate 3 most likely causes |
| Last | Ask only when essential | When multiple equal-probability hypotheses |

---

## DETECTION APPROACH

### 1. Pattern Matching (Primary Method)

Use regex patterns to scan for known anti-patterns.

```regex
# Event listener without cleanup
addEventListener\([^)]+\)(?![\s\S]{0,200}removeEventListener)

# useEffect without return
useEffect\(\s*\(\)\s*=>\s*\{[^}]+\}\s*\)(?![\s\S]{0,50}return)

# Promise without .catch()
\.then\([^)]+\)(?![\s\S]{0,50}\.catch)

# setInterval without clearInterval
setInterval\([^)]+\)(?![\s\S]{0,300}clearInterval)

# Async function without try-catch
async\s+function[^{]+\{(?![\s\S]{0,50}try)

# Shared state mutation in async
(await|\.then)\s*\([^)]*\)\s*[\s\S]{0,50}(this\.|state\.)
```

See `references/patterns.md` for complete pattern library.

### 2. Structural Analysis

Analyze code structure for risky patterns.

| Structure | Risk Signal |
|-----------|-------------|
| Multiple `await` in sequence | Potential for partial completion |
| Global mutable state | Race condition target |
| Event emitter without listener tracking | Leak candidate |
| Promise.all without error handling | Silent failure risk |
| Nested async callbacks | Callback hell, leak risk |

### 3. Dependency Graph Analysis

Trace async/resource flows.

```
Component Mount
    ↓
API Call Started → [State: loading]
    ↓
Data Received → [State: ready]
    ↓
Component Unmount → [Cleanup needed?]
    ↓
Late Response Arrives → [Race condition if cleanup missing]
```

---

## RISK SCORING MATRIX

### 5-Dimension Assessment

| Dimension | Weight | Description | Scale |
|-----------|--------|-------------|-------|
| **Detectability** | 20% | How hard is it to notice? | 1 (obvious) - 10 (silent) |
| **Impact** | 30% | What's the damage when it occurs? | 1 (cosmetic) - 10 (data loss) |
| **Frequency** | 20% | How often does it manifest? | 1 (rare) - 10 (constant) |
| **Recovery** | 15% | Can the system recover? | 1 (auto) - 10 (manual restart) |
| **Data Risk** | 15% | Is data integrity at risk? | 1 (none) - 10 (corruption) |

### Risk Calculation

```
Risk Score = (Detectability × 0.20) + (Impact × 0.30) + (Frequency × 0.20) + (Recovery × 0.15) + (Data Risk × 0.15)
```

### Severity Levels

| Level | Score | Response |
|-------|-------|----------|
| **CRITICAL** | 8.5+ | Immediate attention required |
| **HIGH** | 7.0-8.4 | Fix within 24 hours |
| **MEDIUM** | 4.5-6.9 | Plan for fix |
| **LOW** | <4.5 | Monitor and track |

---


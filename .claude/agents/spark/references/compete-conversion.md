# Spark Compete-to-Spec Conversion Reference

競合分析から具体的な機能仕様への変換ガイド。

---

## Gap Type別の提案アプローチ

Competeエージェントから受け取るギャップタイプに応じた提案戦略。

### Gap Type Overview

| Gap Type | Definition | Strategy | Risk Level |
|----------|------------|----------|------------|
| **Parity Gap** | 競合にあって自社にない機能 | Catch-up | Low-Medium |
| **Blue Ocean** | どの競合にもない新機能 | Innovation | High |
| **Our Advantage** | 自社にあって競合にない機能 | Fortification | Low |
| **Threat Gap** | 競合が急速に追いついている領域 | Defensive | Medium-High |

---

## Parity Gap → Catch-up Proposal

競合にある機能を追加するアプローチ。

### When to Use

- ユーザーが競合機能を明確に期待している
- 機能がなければ商談を失うリスクがある
- 業界標準となっている機能

### Catch-up Proposal Template

```markdown
## CATCH_UP_PROPOSAL: [Feature Name]

**Gap Source**: COMPETE_TO_SPARK_HANDOFF [Date]
**Gap Type**: Parity Gap
**Competitors with Feature**: [Comp A, Comp B, ...]

### Market Context

**User Expectation Level**: [Essential / Expected / Nice-to-have]
**Lost Opportunity Evidence**:
- [Support ticket/feedback about missing feature]
- [Churned customer citing this gap]
- [Sales loss attributed to gap]

### Competitive Implementation Analysis

| Competitor | Implementation | Strengths | Weaknesses |
|------------|----------------|-----------|------------|
| [Comp A] | [How they do it] | [What's good] | [What's bad] |
| [Comp B] | [How they do it] | [What's good] | [What's bad] |

### Our Approach: Match + Differentiate

**Baseline Parity** (Must Match):
- [ ] [Core functionality that must match]
- [ ] [Core functionality that must match]

**Differentiation Opportunity**:
- [ ] [How we can do it better/different]
- [ ] [Our unique advantage in implementation]

### Proposal Specification

**User Story**:
As a [persona], I want to [action] so that [benefit].
*Note: This addresses the gap where [Comp A] currently wins.*

**Priority**: [P1/P2/P3]
**Quadrant**: [Quick Win / Big Bet based on our implementation cost]

**Acceptance Criteria**:
- [ ] [Functional requirement matching competition]
- [ ] [Functional requirement matching competition]
- [ ] [Differentiating element]

**NOT in Scope** (Conscious trade-offs):
- [Feature aspect we're choosing not to match]
- [Reason: diminishing returns / different strategy]

### Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Implementation more complex than competitors | [H/M/L] | [Start with MVP] |
| Feature table stakes by time we ship | [H/M/L] | [Accelerate timeline] |
| Users expect exact competitor behavior | [H/M/L] | [Clear communication of our approach] |

### Success Metrics

- Metric to track: [Adoption rate / Feature usage]
- Target: [Match competitor's user penetration of X%]
- Timeline: [Within X weeks of launch]
```

---

## Blue Ocean → Innovation Proposal

競合にない新機能でリードするアプローチ。

### When to Use

- 市場で未解決の問題を発見した
- 技術的優位性を活かせる
- 新しいユーザーセグメントを獲得できる

### Innovation Proposal Template

```markdown
## INNOVATION_PROPOSAL: [Feature Name]

**Gap Source**: COMPETE_TO_SPARK_HANDOFF [Date]
**Gap Type**: Blue Ocean
**Competitor Coverage**: None

### Market Opportunity

**Unmet Need**:
[Description of the problem no one is solving]

**Why Competitors Haven't Done This**:
- [Technical barrier they face]
- [Strategic focus elsewhere]
- [Market segment they're ignoring]

**Our Unique Capability**:
- [Technology advantage]
- [Data advantage]
- [Expertise advantage]

### Innovation Validation

**Evidence of Demand**:
| Signal Type | Evidence | Strength |
|-------------|----------|----------|
| User requests | [Specific requests] | [Strong/Weak] |
| Adjacent behavior | [What users do today instead] | [Strong/Weak] |
| Market trends | [Industry movement] | [Strong/Weak] |

**Risk Level**: High (by definition for innovation)

### Proposal Specification

**Vision Statement**:
[What does this enable that was impossible before?]

**User Story**:
As a [persona], I want to [novel action] so that [transformative benefit].
*Note: No competitor currently offers this capability.*

**Priority**: [P2/P3 unless strategic bet]
**Quadrant**: Big Bet (Innovation typically high effort)

**Minimum Viable Innovation**:
- [ ] [Core capability that proves the concept]
- [ ] [Core capability that proves the concept]

**Full Vision** (Future iterations):
- [ ] [Advanced capability]
- [ ] [Advanced capability]

### Validation Strategy

**Before Full Build**:
1. Prototype with Forge → User validation with Echo
2. A/B test MVP with Experiment
3. Measure: [Early adoption metric]

**Kill Criteria**:
- If [X% of users] don't [action] within [time], reconsider

### First-Mover Considerations

| Consideration | Our Plan |
|---------------|----------|
| Setting user expectations | [How we'll educate market] |
| Competitor response time | [Est. X months before copy] |
| Defensibility | [Patents / Network effects / Data moat] |
| Iteration speed | [How we'll stay ahead] |
```

---

## Our Advantage → Fortification Proposal

既存の優位性を強化するアプローチ。

### When to Use

- 競合がこの領域を追っている兆候がある
- ユーザーがこの機能で自社を選んでいる
- さらなる差別化で競争優位を広げられる

### Fortification Proposal Template

```markdown
## FORTIFICATION_PROPOSAL: [Feature Name Enhancement]

**Gap Source**: COMPETE_TO_SPARK_HANDOFF [Date]
**Gap Type**: Our Advantage (Fortify)
**Current Status**: [Feature exists, competitors don't have]

### Current Advantage Analysis

**What We Have**:
[Current feature description]

**Why It's An Advantage**:
- User value: [What users love about it]
- Competitive moat: [Why competitors haven't copied]
- Usage metrics: [Adoption / satisfaction stats]

**Threat Assessment**:
| Competitor | Likelihood of Copying | Timeline | Threat Level |
|------------|----------------------|----------|--------------|
| [Comp A] | [High/Med/Low] | [X months] | [🔴/🟡/🟢] |
| [Comp B] | [High/Med/Low] | [X months] | [🔴/🟡/🟢] |

### Fortification Strategy

**Option 1: Deepen the Moat**
- Make existing advantage harder to replicate
- Add unique data / integrations / network effects

**Option 2: Extend the Advantage**
- Build related features on top of strength
- Create ecosystem around core advantage

**Option 3: Communicate the Advantage**
- Better marketing / positioning
- Help users discover and use the advantage

**Recommended**: [Option X]
**Rationale**: [Why this option]

### Proposal Specification

**User Story**:
As a [existing happy user], I want [enhancement] so that [even better outcome].
*Note: This doubles down on why users choose us over [Comp A].*

**Priority**: [P1/P2] (Protecting advantages is high priority)
**Quadrant**: [Quick Win if incremental, Big Bet if major]

**Enhancement Scope**:
- [ ] [Specific improvement to existing advantage]
- [ ] [Specific improvement to existing advantage]

**Defensibility Created**:
- [ ] [New barrier for competitors to overcome]
- [ ] [New barrier for competitors to overcome]

### Success Metrics

- Retention of users who cite this feature: [Maintain X%]
- Feature usage depth: [Increase by Y%]
- Competitive win rate: [Maintain/Improve Z%]
```

---

## Threat Gap → Defensive Proposal

競合が急速に追いついている領域への対応。

### When to Use

- 以前は優位だった領域で競合が追いついた
- 競合の新リリースで差が縮まった
- ユーザーが「もはや差がない」と言い始めた

### Defensive Proposal Template

```markdown
## DEFENSIVE_PROPOSAL: [Feature Area]

**Gap Source**: COMPETE_TO_SPARK_HANDOFF [Date]
**Gap Type**: Threat Gap
**Threat Level**: [Critical / High / Medium]

### Threat Analysis

**Previous Advantage**:
[What we used to have that they didn't]

**Current State**:
| Aspect | Us | Comp A | Comp B | Gap Remaining |
|--------|-----|--------|--------|---------------|
| [Aspect 1] | [✅] | [✅] | [❌] | Narrowed |
| [Aspect 2] | [✅] | [✅] | [✅] | Gone |

**Speed of Erosion**: [X% gap closed in Y months]
**Projected Parity**: [Z months until full catch-up]

### Defensive Strategy Options

**Option 1: Leap Ahead**
- Major innovation to create new gap
- Risk: High effort, might not work
- Reward: Re-establish leadership

**Option 2: Incremental Defense**
- Continuous improvements to stay ahead
- Risk: Competitors might out-invest
- Reward: Sustainable with less risk

**Option 3: Pivot Focus**
- Accept parity, differentiate elsewhere
- Risk: Lose users who valued this area
- Reward: Resources for new advantages

**Recommended**: [Option X]
**Urgency**: [Immediate / This Quarter / Can Wait]

### Proposal Specification

**User Story**:
As a [user who chose us for this], I want [next-level capability] so that [reason to stay].
*Note: Prevents loss to [Comp A] who now offers [competing feature].*

**Priority**: [P1 if threat is critical]
**Quadrant**: [Based on chosen strategy]

**Defensive Requirements**:
- [ ] [Must-do to prevent churn]
- [ ] [Must-do to prevent churn]

**Regain Leadership** (if Option 1):
- [ ] [Innovation to leap ahead]
- [ ] [Innovation to leap ahead]

### Urgency Justification

**If We Don't Act**:
- [X% of users may churn to competitor]
- [Y revenue at risk]
- [Z reputational impact]

**Timeline**:
- Critical deadline: [When competitor reaches parity]
- Our target launch: [Must beat by X weeks]
```

---

## Feature Matrix → User Story変換

競合機能マトリクスから具体的なUser Storyを生成するプロセス。

### Input: Compete Feature Matrix

```markdown
| Feature | Us | Comp A | Comp B | Priority |
|---------|-----|--------|--------|----------|
| Export to PDF | ❌ | ✅ | ✅ | P1 |
| Team sharing | ✅ | ✅ | ❌ | - |
| AI suggestions | ❌ | ❌ | ❌ | P2 (Blue Ocean) |
| Offline mode | ❌ | ✅ | ❌ | P3 |
```

### Conversion Process

```
For each Gap (❌ for Us, ✅ for Competitor):
1. Identify Gap Type
2. Research competitor implementation
3. Identify target persona
4. Define benefit in our context
5. Generate User Story
6. Assess differentiation opportunity
```

### Output: User Story Set

```markdown
## FEATURE_MATRIX_CONVERSION

**Source**: Compete Feature Matrix [Date]
**Total Gaps Identified**: [N]
**Converted to Proposals**: [M]

### P1: Export to PDF (Parity Gap)

**Gap Type**: Parity
**Competitors**: Comp A, Comp B

**User Story**:
> As a **Project Manager**,
> I want to **export my project summary as a PDF**
> So that **I can share status with stakeholders who don't have app access**.

**Competitor Reference**:
- Comp A: [How they implement]
- Comp B: [How they implement]

**Our Differentiation**:
- [What we can do better/different]

**Acceptance Criteria**:
- [ ] PDF includes all visible project data
- [ ] Custom branding option (differentiator)
- [ ] Works offline (catch up to Comp A)

---

### P2: AI Suggestions (Blue Ocean)

**Gap Type**: Blue Ocean
**Competitors**: None

**User Story**:
> As a **Content Creator**,
> I want to **receive AI-powered suggestions for my work**
> So that **I can improve quality faster than doing everything manually**.

**Innovation Opportunity**:
- No competitor offers this
- We have [AI capability / data] to do it well

**Validation First**:
- Prototype with Forge
- User test with Echo
- A/B test with Experiment

**Acceptance Criteria** (MVP):
- [ ] Basic suggestions for [top use case]
- [ ] User feedback mechanism
- [ ] Opt-in experience
```

---

## 差別化ポイントの仕様への落とし込み

競合優位性を維持しながら機能仕様を作成するガイド。

### Differentiation Integration

```markdown
## DIFFERENTIATED_FEATURE_SPEC

**Feature**: [Feature name]
**Gap Type**: [Parity/Blue Ocean/Fortification/Defense]

### Baseline Requirements (Match Competition)

| Requirement | Competitor Benchmark | Our Implementation |
|-------------|---------------------|-------------------|
| [Req 1] | [How Comp A does it] | [Same approach] |
| [Req 2] | [How Comp B does it] | [Same approach] |

### Differentiation Requirements (Beat Competition)

| Differentiator | Why It's Better | Priority |
|----------------|-----------------|----------|
| [Diff 1] | [User benefit] | Must Have |
| [Diff 2] | [User benefit] | Should Have |
| [Diff 3] | [User benefit] | Could Have |

### Differentiation Justification

**Why Users Will Prefer Ours**:
1. [Specific advantage 1]
2. [Specific advantage 2]

**What Competitors Would Need to Match**:
1. [Barrier 1: Tech / Data / Time]
2. [Barrier 2: Tech / Data / Time]

### Trade-offs Accepted

**What We're NOT Matching**:
| Competitor Feature | Reason Not Matching |
|-------------------|---------------------|
| [Feature aspect] | [Low value / High cost / Different strategy] |

**Risk of Not Matching**:
- [User segment affected]
- [Mitigation strategy]
```

---

## 競合優位性検証ループ

提案した差別化が実際に優位性になるか検証するプロセス。

### Verification Loop

```
1. PROPOSE: Create differentiated spec
        ↓
2. VALIDATE_INTERNAL: Scout investigation
   - Is differentiation technically feasible?
   - What's the actual implementation cost?
        ↓
3. VALIDATE_USER: Echo persona walkthrough
   - Do users value this differentiation?
   - Is it noticeable / important to them?
        ↓
4. VALIDATE_MARKET: Experiment A/B test
   - Does differentiation drive adoption?
   - Are metrics better than competitor baseline?
        ↓
5. CONFIRM or ITERATE
   - If validated: Ship with confidence
   - If not: Revisit differentiation strategy
```

### Verification Request Template

```markdown
## DIFFERENTIATION_VERIFICATION_REQUEST

**Feature**: [Feature name]
**Proposed Differentiator**: [Specific differentiation]

**Request to Scout**:
- Technical feasibility of [differentiator]
- Implementation complexity vs. matching competitor
- Any technical risks specific to our approach

**Request to Echo**:
- Persona reaction to [differentiator]
- Perceived value vs. competitor approach
- Any confusion or concerns

**Request to Experiment**:
- A/B test: Our differentiation vs. competitor-match baseline
- Primary metric: [Adoption / Satisfaction / Conversion]
- Hypothesis: [Differentiation] increases [metric] by [X%]

**Decision Criteria**:
- Proceed if: [Echo positive] AND [Experiment shows +X%]
- Iterate if: [Mixed signals]
- Match competitor if: [Differentiation not valued]
```

---

## Integration with Compete Agent

### Compete → Spark Full Flow

```
COMPETE Analysis Complete
        ↓
COMPETE_TO_SPARK_HANDOFF
        ↓
Spark Gap Classification
├── Parity Gap → Catch-up Proposal
├── Blue Ocean → Innovation Proposal
├── Our Advantage → Fortification Proposal
└── Threat Gap → Defensive Proposal
        ↓
Differentiated Spec Creation
        ↓
Verification Loop (Scout → Echo → Experiment)
        ↓
Final Proposal → Sherpa/Forge
```

### Maintaining Competitive Context

```markdown
## COMPETITIVE_CONTEXT (Include in Proposal)

**Competitive Landscape** (from Compete):
- [Comp A]: [Position / Threat level]
- [Comp B]: [Position / Threat level]

**This Proposal Addresses**:
- Gap type: [Parity/Blue Ocean/Fortification/Defense]
- Primary competitor concern: [Comp X]
- Expected competitive response: [Time to copy / Unlikely to copy]

**Ongoing Monitoring**:
- Signal to watch: [Competitor announcement / Feature launch]
- Re-evaluate if: [Competitor matches our approach]
- Escalate to Compete if: [Major competitive shift]
```

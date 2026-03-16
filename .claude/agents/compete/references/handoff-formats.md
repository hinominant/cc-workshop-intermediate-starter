# Compete Handoff Formats Reference

Standardized handoff formats for agent collaboration.

## COMPETE_TO_SPARK_HANDOFF

```markdown
## COMPETE_TO_SPARK_HANDOFF

**Analysis Type**: [Feature Gap / Differentiation Opportunity / Unmet Need]
**Competitive Context**:
- Competitors analyzed: [List]
- Market gap identified: [Description]

**Opportunity**:
| Aspect | Detail |
|--------|--------|
| Unmet Need | [What users want but competitors don't offer] |
| Our Advantage | [Why we can do it better] |
| Risk if Ignored | [What happens if we don't act] |

**Supporting Data**:
- Review sentiment: [Summary]
- Feature comparison: [Key findings]
- Market trend: [Relevant trend]

**Request**: Ideate differentiating feature based on competitive gap
**Priority**: [High / Medium / Low]
```

## COMPETE_TO_GROWTH_HANDOFF

```markdown
## COMPETE_TO_GROWTH_HANDOFF

**Positioning Analysis**:
- Our position: [Description]
- Competitor positions: [Map summary]
- Differentiation angle: [Recommended focus]

**SEO Gaps**:
| Keyword | Competitor Rank | Our Rank | Opportunity |
|---------|-----------------|----------|-------------|
| [KW 1] | #[X] | #[Y] | [Action] |
| [KW 2] | #[X] | #[Y] | [Action] |

**Messaging Recommendation**:
- Primary: [Key message]
- Supporting: [Evidence points]
- Avoid: [Competitor-owned territory]

**Request**: Implement positioning in SEO/content strategy
**Priority**: [High / Medium / Low]
```

## COMPETE_TO_CANVAS_HANDOFF

```markdown
## COMPETE_TO_CANVAS_HANDOFF

**Visualization Type**: [Positioning Map / SWOT Matrix / Feature Comparison]

**Data**:
```yaml
competitors:
  - name: [Competitor A]
    x_axis: [value]
    y_axis: [value]
  - name: [Competitor B]
    x_axis: [value]
    y_axis: [value]
  - name: [Our Product]
    x_axis: [value]
    y_axis: [value]
axes:
  x: [Label]
  y: [Label]
quadrants:
  - [Q1 Label]
  - [Q2 Label]
  - [Q3 Label]
  - [Q4 Label]
```

**Purpose**: [How this visualization will be used]
**Request**: Generate [Mermaid / ASCII] diagram for strategic document
```

## COMPETE_TO_ROADMAP_HANDOFF

```markdown
## COMPETE_TO_ROADMAP_HANDOFF

**Strategic Insight**:
- Analysis type: [Competitive threat / Market opportunity / Feature gap]
- Urgency: [High / Medium / Low]

**Competitive Landscape**:
| Aspect | Current State | Trend |
|--------|---------------|-------|
| Market position | [Description] | [Improving/Stable/Declining] |
| Feature parity | [Gap summary] | [Widening/Stable/Closing] |
| Competitive threats | [Key threats] | [Increasing/Stable/Decreasing] |

**Recommendation**:
- Priority adjustment: [What should move up/down]
- New consideration: [Feature/initiative to add]
- Rationale: [Why this matters now]

**Request**: Incorporate competitive insights into roadmap prioritization
```

## VOICE_TO_COMPETE_HANDOFF

```markdown
## VOICE_TO_COMPETE_HANDOFF

**Feedback Source**: [Reviews / NPS / Support tickets / User interviews]
**Analysis Period**: [Date range]

**Competitor Mentions**:
| Competitor | Sentiment | Quote | Count |
|------------|-----------|-------|-------|
| [Comp A] | Positive/Negative | "[Sample quote]" | [N] |
| [Comp B] | Positive/Negative | "[Sample quote]" | [N] |

**Switching Reasons**:
- To us from competitors: [Reasons with frequency]
- From us to competitors: [Reasons with frequency]

**Feature Requests Mentioning Competitors**:
| Feature | Competitor Has It | Request Count |
|---------|-------------------|---------------|
| [Feature] | [Yes/No] | [N] |

**Request**: Analyze competitive implications of customer feedback
```

## PULSE_TO_COMPETE_HANDOFF

```markdown
## PULSE_TO_COMPETE_HANDOFF

**Benchmark Request**:
| Metric | Our Value | Industry Need |
|--------|-----------|---------------|
| [Metric 1] | [Value] | [Benchmark needed] |
| [Metric 2] | [Value] | [Benchmark needed] |

**Context**: [Why benchmarking is needed]
**Comparison Scope**: [Direct competitors / Industry average / Best in class]
**Request**: Provide competitive benchmarks for comparison
```

## Quick Handoff Commands

**To Roadmap:**
```
/Roadmap prioritize based on competitive analysis
Context: Compete identified [gap/opportunity].
Insight: Competitors lack [X], and users want it.
Recommendation: Add [feature] to roadmap.
```

**To Spark:**
```
/Spark ideate differentiating feature
Context: Compete analysis shows [competitive landscape].
Gap: No competitor addresses [user need].
Constraint: Must align with our [strength/strategy].
```

**To Canvas:**
```
/Canvas create competitive visualization
Type: [Positioning map | Feature matrix | SWOT]
Data: [Competitor data]
Focus: [What insight to highlight]
```

**To Growth:**
```
/Growth implement positioning strategy
Context: Positioning analysis complete.
Position: [Our unique position].
SEO Gaps: [Keyword opportunities].
Messaging: [Key differentiation message].
```

# Voice Multi-Channel Feedback Synthesis

Unify feedback from all sources into a single, actionable view.

---

## Channel Integration Framework

```markdown
## Multi-Channel Feedback Synthesis

### Source Inventory
| Channel | Type | Collection Method | Volume | Priority |
|---------|------|-------------------|--------|----------|
| NPS Survey | Quantitative | Email / In-app | [N/month] | Primary |
| CES Survey | Quantitative | Post-action | [N/month] | Primary |
| CSAT Survey | Quantitative | Touchpoint | [N/month] | Primary |
| In-app Widget | Qualitative | Always-on | [N/month] | High |
| Support Tickets | Qualitative | Zendesk/Intercom | [N/month] | High |
| Exit Survey | Qualitative | Cancellation flow | [N/month] | High |
| App Store Reviews | Public | iOS/Android | [N/month] | Medium |
| G2/Capterra | Public | Scraping/API | [N/month] | Medium |
| Social Media | Public | Monitoring tool | [N/month] | Monitor |
| Sales Calls | Qualitative | CRM notes | [N/month] | Medium |
| User Interviews | Qualitative | Scheduled | [N/month] | Low volume, high value |

### Unified Taxonomy
Apply consistent tags across ALL channels:

| Dimension | Values |
|-----------|--------|
| Category | bug / feature / ux / performance / pricing / support / praise / other |
| Sentiment | positive (+1) / neutral (0) / negative (-1) |
| Urgency | critical / high / medium / low |
| Segment | enterprise / pro / starter / free / trial |
| Journey Stage | awareness / consideration / onboarding / active / at-risk / churned |
| Impact | revenue / retention / satisfaction / efficiency |
```

---

## Channel Aggregation Implementation

```typescript
// lib/feedback-aggregation.ts
interface UnifiedFeedback {
  id: string;
  source: 'nps' | 'ces' | 'csat' | 'widget' | 'support' | 'exit' | 'review' | 'social' | 'sales' | 'interview';
  originalId: string;
  content: string;

  // Unified taxonomy
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  segment: string;
  journeyStage: string;

  // Quantitative scores (if applicable)
  npsScore?: number;
  cesScore?: number;
  csatScore?: number;

  // Metadata
  userId?: string;
  userSegment?: string;
  userMRR?: number;
  timestamp: string;

  // Processing
  keywords: string[];
  actionable: boolean;
  themes: string[];
}

interface FeedbackAggregation {
  period: string;
  totalFeedback: number;
  bySource: Record<string, number>;
  byCategory: Record<string, number>;
  bySentiment: Record<string, number>;
  themes: ThemeCluster[];
  prioritizedIssues: PrioritizedIssue[];
}

interface ThemeCluster {
  theme: string;
  count: number;
  sources: string[];
  sentiment: number; // average
  sampleFeedback: string[];
  trend: 'up' | 'down' | 'stable';
}

interface PrioritizedIssue {
  issue: string;
  frequency: number;
  revenueImpact: number;
  sentimentImpact: number;
  priorityScore: number;
  recommendation: string;
}

// Aggregate feedback from all sources
async function aggregateFeedback(period: string): Promise<FeedbackAggregation> {
  const sources = [
    fetchNPSResponses(period),
    fetchCESResponses(period),
    fetchCSATResponses(period),
    fetchWidgetFeedback(period),
    fetchSupportTickets(period),
    fetchExitSurveys(period),
    fetchAppStoreReviews(period),
    fetchG2Reviews(period),
    fetchSocialMentions(period)
  ];

  const allFeedback = await Promise.all(sources);
  const unified = allFeedback.flat().map(normalizeFeedback);

  return {
    period,
    totalFeedback: unified.length,
    bySource: countBy(unified, 'source'),
    byCategory: countBy(unified, 'category'),
    bySentiment: countBy(unified, 'sentiment'),
    themes: clusterThemes(unified),
    prioritizedIssues: prioritizeIssues(unified)
  };
}

// Normalize feedback from different sources to unified format
function normalizeFeedback(raw: any, source: string): UnifiedFeedback {
  const analyzed = analyzeSentiment(raw.content || raw.message || raw.text);

  return {
    id: generateId(),
    source: source as UnifiedFeedback['source'],
    originalId: raw.id,
    content: raw.content || raw.message || raw.text,
    category: categorize(raw),
    sentiment: analyzed.sentiment,
    sentimentScore: analyzed.score,
    urgency: determineUrgency(raw, analyzed),
    segment: raw.userSegment || 'unknown',
    journeyStage: raw.journeyStage || inferJourneyStage(raw),
    npsScore: raw.npsScore,
    cesScore: raw.cesScore,
    csatScore: raw.csatScore,
    userId: raw.userId,
    userSegment: raw.userSegment,
    userMRR: raw.userMRR,
    timestamp: raw.timestamp || raw.createdAt,
    keywords: extractKeywords(raw.content),
    actionable: isActionable(raw, analyzed),
    themes: identifyThemes(raw.content)
  };
}

// Prioritize issues by impact
function prioritizeIssues(feedback: UnifiedFeedback[]): PrioritizedIssue[] {
  const issueGroups = groupByTheme(feedback);

  return Object.entries(issueGroups)
    .map(([issue, items]) => {
      const frequency = items.length;
      const revenueImpact = items.reduce((sum, f) => sum + (f.userMRR || 0), 0);
      const sentimentImpact = items.reduce((sum, f) => sum + f.sentimentScore, 0) / items.length;

      // Priority score: frequency × revenue × (1 - sentiment)
      const priorityScore = frequency * (revenueImpact / 1000) * (1 - sentimentImpact);

      return {
        issue,
        frequency,
        revenueImpact,
        sentimentImpact,
        priorityScore,
        recommendation: generateRecommendation(issue, items)
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}
```

---

## Cross-Channel Report Template

```markdown
## Multi-Channel Feedback Report: [Period]

### Executive Summary
| Metric | Value | vs Previous | Trend |
|--------|-------|-------------|-------|
| Total Feedback | [N] | [+/-X%] | ↑/↓/→ |
| Avg Sentiment | [X.X] | [+/-X] | ↑/↓/→ |
| NPS | [X] | [+/-X] | ↑/↓/→ |
| CES | [X.X] | [+/-X] | ↑/↓/→ |
| CSAT | [X%] | [+/-X%] | ↑/↓/→ |

### Volume by Channel
| Channel | Count | % of Total | Sentiment | Key Theme |
|---------|-------|------------|-----------|-----------|
| NPS Survey | [N] | [X%] | [+/-X] | [Theme] |
| CES Survey | [N] | [X%] | [+/-X] | [Theme] |
| In-app Widget | [N] | [X%] | [+/-X] | [Theme] |
| Support Tickets | [N] | [X%] | [+/-X] | [Theme] |
| App Reviews | [N] | [X%] | [+/-X] | [Theme] |
| Social | [N] | [X%] | [+/-X] | [Theme] |

### Cross-Channel Theme Analysis
Themes appearing across multiple channels carry more weight.

| Theme | NPS | CES | Widget | Support | Reviews | Total | Priority |
|-------|-----|-----|--------|---------|---------|-------|----------|
| [Theme 1] | [N] | [N] | [N] | [N] | [N] | [Sum] | P1 |
| [Theme 2] | [N] | [N] | [N] | [N] | [N] | [Sum] | P1 |
| [Theme 3] | [N] | [N] | [N] | [N] | [N] | [Sum] | P2 |

### Prioritized Issues (by Impact)
| Rank | Issue | Frequency | Revenue Impact | Sentiment | Action |
|------|-------|-----------|----------------|-----------|--------|
| 1 | [Issue] | [N] | ¥[X] at risk | [-X.X] | [Action] |
| 2 | [Issue] | [N] | ¥[X] at risk | [-X.X] | [Action] |
| 3 | [Issue] | [N] | ¥[X] at risk | [-X.X] | [Action] |

### Segment-Specific Insights
| Segment | Volume | Top Issue | Sentiment | Action |
|---------|--------|-----------|-----------|--------|
| Enterprise | [N] | [Issue] | [+/-X] | [Action] |
| Pro | [N] | [Issue] | [+/-X] | [Action] |
| Starter | [N] | [Issue] | [+/-X] | [Action] |

### Journey Stage Analysis
| Stage | Volume | Sentiment | Top Concern | Handoff |
|-------|--------|-----------|-------------|---------|
| Onboarding | [N] | [+/-X] | [Issue] | → Echo |
| Active | [N] | [+/-X] | [Issue] | → Roadmap |
| At-Risk | [N] | [+/-X] | [Issue] | → Retain |
| Churned | [N] | [+/-X] | [Issue] | → Compete |

### Signal Strength Indicators
- 🔴 **Critical**: [Issue] mentioned [N]+ times across [X] channels
- 🟡 **Emerging**: [Issue] trending up [X%] this period
- 🟢 **Improving**: [Issue] down [X%] after [fix implemented]

### Recommended Actions
| Priority | Action | Owner | Expected Impact |
|----------|--------|-------|-----------------|
| P1 | [Action] | [Team] | [Impact] |
| P2 | [Action] | [Team] | [Impact] |
| P3 | [Action] | [Team] | [Impact] |

### Agent Handoffs
- → `/Roadmap prioritize: [feature requests]`
- → `/Retain address: [at-risk segment issues]`
- → `/Scout investigate: [reported bugs]`
- → `/Compete analyze: [competitor mentions]`
```

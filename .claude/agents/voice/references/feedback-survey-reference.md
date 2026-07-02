# voice — フィードバック調査 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## NPS SURVEY DESIGN

| Score | Label | Follow-up Question |
|-------|-------|-------------------|
| 0-6 | Detractors | 「どのような点が期待に沿わなかったですか？」 |
| 7-8 | Passives | 「どのような改善があれば10点になりますか？」 |
| 9-10 | Promoters | 「特にお気に入りの点を教えてください。」 |

### NPS Benchmark

| NPS Range | Interpretation |
|-----------|----------------|
| 70+ | World-class |
| 50-69 | Excellent |
| 30-49 | Good |
| 0-29 | Needs improvement |
| Below 0 | Critical |

See `references/nps-survey.md` for full NPS implementation and React component.

---

## CSAT & CES SURVEYS

### CSAT (Customer Satisfaction Score)

| Score | Label | Emoji |
|-------|-------|-------|
| 5 | とても満足 | 😄 |
| 4 | 満足 | 🙂 |
| 3 | 普通 | 😐 |
| 2 | 不満 | 🙁 |
| 1 | とても不満 | 😞 |

**Calculation:** CSAT = (満足回答数 / 全回答数) × 100

### CES (Customer Effort Score)

| Score | Interpretation |
|-------|----------------|
| 1-3 | High effort - churn risk |
| 4 | Neutral |
| 5-7 | Low effort - loyalty driver |

**Target:** CES 5.5+ (7-point scale)

See `references/csat-ces-surveys.md` for implementations, touchpoint examples, and analysis templates.

---

## EXIT SURVEY (CHURN ANALYSIS)

### Churn Reason Taxonomy

| Category | Sub-Reasons | Save Offer |
|----------|-------------|------------|
| **価格** | 高すぎる / 予算削減 / ROI不足 | 割引 / ダウングレードプラン提案 |
| **機能** | 必要な機能がない / 使いこなせない / 競合が優れている | ロードマップ共有 / トレーニング |
| **体験** | 使いにくい / パフォーマンス問題 / サポート不満 | オンボーディング再実施 |
| **状況** | プロジェクト終了 / 会社都合 / 一時的に不要 | アカウント一時停止 |
| **競合** | [具体的な競合名を収集] | 差別化ポイント説明 |

### Trigger Points

| Trigger | Priority | Response Rate Target |
|---------|----------|---------------------|
| 解約ボタンクリック時 | Critical | 80%+ (blocking) |
| ダウングレード時 | High | 70%+ |
| 更新キャンセル時 | High | 60%+ |

See `references/exit-survey.md` for exit survey implementation and churn analysis report templates.

---

## MULTI-CHANNEL FEEDBACK SYNTHESIS

### Unified Taxonomy

| Dimension | Values |
|-----------|--------|
| Category | bug / feature / ux / performance / pricing / support / praise / other |
| Sentiment | positive (+1) / neutral (0) / negative (-1) |
| Urgency | critical / high / medium / low |
| Segment | enterprise / pro / starter / free / trial |
| Journey Stage | awareness / consideration / onboarding / active / at-risk / churned |

### Priority Score Formula

**Priority Score = frequency × (revenueImpact / 1000) × (1 - sentimentScore)**

Themes appearing across multiple channels carry more weight.

See `references/multi-channel-synthesis.md` for aggregation implementation and cross-channel report templates.

---

## FEEDBACK WIDGET & ANALYSIS

### Feedback Types

| Type | Label | Icon |
|------|-------|------|
| bug | バグ報告 | 🐛 |
| feature | 機能リクエスト | 💡 |
| improvement | 改善提案 | 📈 |
| praise | 良かった点 | 👍 |
| other | その他 | 💬 |

### Sentiment Classification

| Sentiment | Score | Indicators |
|-----------|-------|------------|
| Positive | +1 | 「便利」「良い」「助かる」「嬉しい」 |
| Neutral | 0 | 質問、提案、中立的な意見 |
| Negative | -1 | 「困る」「不便」「遅い」「分からない」 |

See `references/feedback-widget-analysis.md` for widget implementation, sentiment analysis, and response templates.

---

## RETAIN INTEGRATION

### Handoff to Retain

When feedback indicates retention risks:

```markdown
## Voice → Retain Handoff

**Risk Level:** [High | Medium | Low]

**Signals Identified:**
- NPS score dropped from [X] to [Y]
- [N] detractors in the past [period]
- Common complaint: [issue]
- Churn mentions: [N] users said they're considering leaving

**User Segments at Risk:**
- [Segment 1]: [X%] negative sentiment
- [Segment 2]: [X%] negative sentiment

**Key Feedback Themes:**
1. [Theme 1] - [Sample quote]
2. [Theme 2] - [Sample quote]

**Recommended Retention Actions:**
1. [Specific action for at-risk segment]
2. [Specific action for at-risk segment]

Suggested command: `/Retain address churn risk`
```

---


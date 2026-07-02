# compete — 競合分析 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## COLLABORATION PATTERNS

### Pattern A: Strategic Insight Loop (Compete ↔ Spark)

**Purpose**: 競合ギャップから機能提案、提案後の競合優位性検証

```
Compete: 競合ギャップ特定 → Spark: 差別化機能提案
                         ↓
Compete: 競合優位性検証 ← Spark: 機能仕様完成
```

**Trigger**: 競合が未対応の顧客ニーズを発見した時

---

### Pattern B: Market Positioning Flow (Compete → Growth)

**Purpose**: ポジショニング分析からSEO/マーケティング戦略へ

```
Compete: ポジショニング分析
    ↓
Compete: SEOギャップ分析
    ↓
Growth: SEO/コンテンツ戦略実行
```

**Trigger**: ポジショニング分析が完了し、マーケティング施策が必要な時

---

### Pattern C: Feature Gap Analysis (Compete → Spark → Forge)

**Purpose**: 競合機能ギャップからプロトタイプ作成

```
Compete: 競合機能マトリクス作成
    ↓
Spark: 差別化機能仕様策定
    ↓
Forge: 高速プロトタイプ作成
```

**Trigger**: 競合にない重要機能のギャップを発見した時

---

### Pattern D: Metric Benchmarking (Compete ↔ Pulse)

**Purpose**: 競合ベンチマークからKPI設定、実績との比較

```
Pulse: メトリクス収集 → Compete: 競合ベンチマーク提供
                       ↓
Pulse: KPI設定・比較 ← Compete: 業界標準データ
```

**Trigger**: パフォーマンス指標の競合比較が必要な時

---

### Pattern E: Visualization Request (Compete → Canvas)

**Purpose**: ポジショニングマップ・SWOT図の生成

```
Compete: 分析データ作成
    ↓
Canvas: Mermaid/ASCII図生成
    ↓
Compete: 戦略ドキュメントに組み込み
```

**Trigger**: 競合分析結果の視覚化が必要な時

---

### Pattern F: Alert Response Chain (Compete → Multi-agent)

**Purpose**: 競合アラート時の緊急対応チェーン

```
Compete: 競合アラート検出
    ↓
Scout: 技術調査（必要時）
    ↓
Spark: 対応策提案
    ↓
Roadmap: 優先度調整
```

**Trigger**: 高優先度の競合動向を検出した時

---

## ANALYSIS TEMPLATES

Core analysis frameworks for competitive intelligence.

| Template | Purpose | Key Components |
|----------|---------|----------------|
| **Competitor Profile** | Company overview | Overview, Strengths/Weaknesses, Pricing, Target Customer |
| **Feature Matrix** | Feature comparison | Basic matrix, Weighted scoring (1-5 scale) |
| **SWOT Analysis** | Strategic assessment | Strengths, Weaknesses, Opportunities, Threats |
| **Positioning Map** | Market position | 2x2 quadrant chart, Positioning statement |
| **Benchmarking** | Performance comparison | Performance metrics, UX benchmarks |
| **Differentiation Strategy** | Competitive strategy | Strategy selection, Execution plan |
| **Market Trends** | Industry analysis | Industry shifts, Technology trends, Emerging players |

**Differentiation Strategies:**
- Feature Differentiation (Notion's blocks)
- Price Differentiation (Canva vs Adobe)
- Experience Differentiation (Linear vs Jira)
- Niche Focus (Figma for designers)
- Integration Ecosystem (Zapier)
- Speed/Performance (Algolia)
- Trust/Security (1Password)

See `references/analysis-templates.md` for detailed templates.

---

## OPERATIONAL PLAYBOOKS

Playbooks for competitive response, sales support, and learning.

| Playbook | Purpose | When to Use |
|----------|---------|-------------|
| **Competitive Response** | Respond to competitor actions | Feature launch, pricing change, acquisition |
| **Battle Card** | Sales team quick reference | During sales conversations |
| **Win/Loss Analysis** | Learn from deal outcomes | After significant win or loss |
| **Alert System** | Monitor competitive landscape | Ongoing monitoring |

**Alert Priority Levels:**
- **High**: Funding, feature overlap, price changes, executive moves, acquisitions
- **Medium**: New integrations, marketing campaigns, case studies
- **Low**: Hiring changes, website redesigns, social mentions

See `references/playbooks.md` for detailed templates.

---

## INTELLIGENCE GATHERING

Sources and templates for competitive intelligence collection.

| Intelligence Type | Sources | Key Metrics |
|-------------------|---------|-------------|
| **Public Sources** | Website, blog, changelog, docs | Feature velocity, positioning, pricing |
| **External** | G2, Capterra, social, job postings | Reviews, tech stack, growth areas |
| **Community** | Forums, Reddit, Slack/Discord | Pain points, feature requests |
| **Financial** | SEC filings, earnings calls | Revenue, strategy, investments |

**Specialized Analysis Templates:**
- **Price Intelligence**: Price positioning, Value ratio, TCO comparison
- **Review Intelligence**: Aggregate scores, Sentiment analysis, Common complaints
- **Tech Stack Analysis**: Infrastructure, Frontend/Backend, Integrations, Security
- **SEO Competitive Analysis**: Domain metrics, Keyword gaps, Content strategy

See `references/intelligence-gathering.md` for detailed templates.

---

## HANDOFF FORMATS

Standardized handoff formats for agent collaboration.

| Handoff | Direction | Purpose |
|---------|-----------|---------|
| **COMPETE_TO_SPARK** | Compete → Spark | Feature gap → Feature ideation |
| **COMPETE_TO_GROWTH** | Compete → Growth | Positioning → SEO/Marketing |
| **COMPETE_TO_CANVAS** | Compete → Canvas | Data → Visualization |
| **COMPETE_TO_ROADMAP** | Compete → Roadmap | Insight → Priority decision |
| **VOICE_TO_COMPETE** | Voice → Compete | Customer feedback → Competitive analysis |
| **PULSE_TO_COMPETE** | Pulse → Compete | Metrics → Benchmark request |

See `references/handoff-formats.md` for detailed formats.

---


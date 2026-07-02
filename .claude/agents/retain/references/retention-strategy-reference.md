# retain — リテンション戦略 リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## RETENTION ANALYSIS FRAMEWORK

| Component | Purpose | Key Output |
|-----------|---------|------------|
| **Cohort Analysis** | Track retention by signup cohort | Weekly/monthly retention tables |
| **Churn Prediction** | Score users by churn risk | Risk level (low/medium/high/critical) |
| **Drop-off Analysis** | Identify when users leave | Period-specific interventions |

### Churn Risk Levels

| Level | Score | Recommended Action |
|-------|-------|-------------------|
| Low | 0-29 | 通常のエンゲージメント施策を継続 |
| Medium | 30-49 | 自動リエンゲージメントキャンペーン |
| High | 50-69 | パーソナライズされた再エンゲージメント施策 |
| Critical | 70+ | 即座に個別対応（電話/1:1メール）|

See `references/retention-analysis.md` for cohort templates and churn prediction model.

---

## RE-ENGAGEMENT TRIGGERS

| Trigger | Condition | Channel | Max Frequency |
|---------|-----------|---------|---------------|
| dormant_3_days | 3-7日未訪問 | Push | 4回/月 |
| dormant_7_days | 7-14日未訪問 | Email | 2回/月 |
| incomplete_onboarding | オンボーディング未完了 | Email | 3回/月 |
| feature_discovery | 未使用機能あり | In-app | 1回/月 |
| streak_at_risk | ストリーク期限6時間以内 | Push | 30回/月 |

See `references/engagement-triggers.md` for trigger configuration and message templates.

---

## HABIT FORMATION DESIGN

### Hook Model

| Phase | Goal | Examples |
|-------|------|----------|
| **1. Trigger** | きっかけを作る | Push通知、メールダイジェスト、内的動機 |
| **2. Action** | 最小限の行動 | 簡単なタスク、ワンクリック操作 |
| **3. Variable Reward** | 変動報酬 | 社会的報酬、獲得報酬、達成報酬 |
| **4. Investment** | ユーザー投資 | 時間、データ、ソーシャル、学習 |

### Streak System

| Milestone | Action |
|-----------|--------|
| 7日連続 | ウィークリーバッジ |
| 30日連続 | マンスリーバッジ |
| 100日連続 | センチュリーバッジ |
| 365日連続 | 年間バッジ |

See `references/habit-formation.md` for Hook Model template and streak implementation.

---

## GAMIFICATION ELEMENTS

### Badge Rarity System

| Rarity | Examples | Criteria |
|--------|----------|----------|
| **Common** | スタートアップ、ウィークリーウォリアー | 初回アクション、7日連続 |
| **Rare** | マンスリーマスター、パワーユーザー | 30日連続、全機能使用 |
| **Epic** | コミュニティヘルパー | 10人以上を支援 |
| **Legendary** | OGメンバー | ベータ版から利用 |

### Progress Level System

| Level | Name | XP Range | Benefit |
|-------|------|----------|---------|
| 1 | ビギナー | 0-100 | 基本機能 |
| 2 | ルーキー | 100-300 | カスタムテーマ |
| 3 | レギュラー | 300-600 | 優先サポート |
| 4 | エキスパート | 600-1000 | ベータ機能アクセス |
| 5 | マスター | 1000+ | コミュニティバッジ |

See `references/gamification.md` for badge system, progress tracker, and loyalty program templates.

---

## CUSTOMER HEALTH SCORE

### Health Score Components (100 points total)

| Dimension | Weight | Signals |
|-----------|--------|---------|
| **利用頻度** | 25% | DAU/MAU比率, セッション数, 最終ログイン |
| **機能深度** | 20% | 機能利用率, コア機能使用, 高度機能使用 |
| **エンゲージメント** | 20% | 滞在時間, アクション数, コンテンツ作成 |
| **満足度** | 15% | NPS, CSAT, CES, サポート満足度 |
| **成長** | 10% | シート追加, プラン変更, 利用量増加 |
| **関係性** | 10% | サポート履歴, コミュニティ参加, 紹介実績 |

### Health Score Thresholds

| Score | Status | Action |
|-------|--------|--------|
| 80-100 | 🟢 Healthy | アップセル/紹介依頼 |
| 60-79 | 🟡 Stable | 継続モニタリング |
| 40-59 | 🟠 At Risk | 自動介入開始 |
| 0-39 | 🔴 Critical | 人的介入（1:1対応）|

See `references/health-score.md` for full framework, implementation, and report templates.

---

## SUBSCRIPTION RETENTION STRATEGIES

### Cancellation Funnel

| Step | Option | Expected Conversion |
|------|--------|-------------------|
| 1 | 解約理由の選択 | 100% (required) |
| 2 | 一時停止オプション提示 | 20-25% accept |
| 3 | ダウングレード提案 | 15-20% accept |
| 4 | 割引オファー | 10-15% accept |
| 5 | 解約完了（理由収集） | Remaining |

### Save Offer Matrix

| Churn Reason | Offer Type | Discount | Duration |
|--------------|-----------|----------|----------|
| 高すぎる | 割引 | 30% | 3ヶ月 |
| 予算削減 | ダウングレード | - | - |
| 使いこなせない | トレーニング | 無料 | - |
| 一時的に不要 | 一時停止 | - | 最大3ヶ月 |
| 競合製品 | 特別オファー | 40% | 6ヶ月 |

See `references/subscription-retention.md` for cancellation flow implementation, pause options, and retention metrics templates.

---

## ONBOARDING OPTIMIZATION

### Activation Milestones

| Milestone | Target Time | Success Criteria | Impact on D30 |
|-----------|-------------|------------------|---------------|
| **M0: アカウント作成** | T+0 | メール認証完了 | Baseline |
| **M1: プロフィール完成** | T+5min | 必須項目入力 | +8% |
| **M2: 最初のアクション** | T+24h | コア機能1回使用 | +15% |
| **M3: 価値体験** | T+3days | 成果物作成/目標達成 | +25% |
| **M4: 習慣形成** | T+7days | 3日以上アクティブ | +35% |
| **M5: 定着** | T+14days | 週2回以上利用 | +45% |

### Progressive Disclosure Schedule

| Week | Available Features | Introduction Method |
|------|-------------------|---------------------|
| Week 1 | 基本機能のみ | チュートリアル |
| Week 2 | +中級機能 | ツールチップ |
| Week 3 | +高度な機能 | フィーチャー紹介 |
| Week 4+ | 全機能 | ヘルプセンター |

See `references/onboarding.md` for activation framework, milestone tracking implementation, and analytics templates.

---

## VOICE INTEGRATION

### Receiving Feedback from Voice

When Voice identifies retention risks:

```markdown
## Received from Voice

**Risk Identified:**
- NPS dropped by [X] points
- [N] detractors mentioned [issue]
- Negative sentiment trend in [area]

**At-Risk Segments:**
1. [Segment] - [specific issue]
2. [Segment] - [specific issue]

**Feedback Themes:**
- "[Quote 1]"
- "[Quote 2]"

**Retain's Response:**
1. [Intervention for segment 1]
2. [Intervention for segment 2]
3. [Long-term strategy adjustment]
```

---


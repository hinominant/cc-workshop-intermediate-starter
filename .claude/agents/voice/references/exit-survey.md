# Voice Exit Survey (Churn Analysis)

Capture churn reasons at the moment of departure for actionable insights.

---

## Exit Survey Framework

```markdown
## Exit Survey Design

### Trigger Points
| Trigger | Priority | Response Rate Target |
|---------|----------|---------------------|
| 解約ボタンクリック時 | Critical | 80%+ (blocking) |
| ダウングレード時 | High | 70%+ |
| 更新キャンセル時 | High | 60%+ |
| 無料トライアル終了時 | Medium | 40%+ |
| 長期非アクティブ時 | Medium | 30%+ |

### Churn Reason Taxonomy
| Category | Sub-Reasons | Save Offer |
|----------|-------------|------------|
| **価格** | 高すぎる / 予算削減 / ROI不足 | 割引 / ダウングレードプラン提案 |
| **機能** | 必要な機能がない / 使いこなせない / 競合が優れている | ロードマップ共有 / トレーニング |
| **体験** | 使いにくい / パフォーマンス問題 / サポート不満 | オンボーディング再実施 |
| **状況** | プロジェクト終了 / 会社都合 / 一時的に不要 | アカウント一時停止 |
| **競合** | [具体的な競合名を収集] | 差別化ポイント説明 |
```

---

## Exit Survey Implementation

```typescript
// components/ExitSurvey.tsx
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

interface ExitSurveyResponse {
  primaryReason: string;
  secondaryReasons?: string[];
  competitor?: string;
  feedback?: string;
  wouldReturn: boolean;
  userId: string;
  planType: string;
  tenure: number; // days as customer
}

const churnReasons = {
  pricing: {
    label: '価格に関する理由',
    options: [
      { value: 'too_expensive', label: '価格が高すぎる' },
      { value: 'budget_cut', label: '予算が削減された' },
      { value: 'low_roi', label: '費用対効果が低い' }
    ],
    saveOffer: 'discount'
  },
  features: {
    label: '機能に関する理由',
    options: [
      { value: 'missing_feature', label: '必要な機能がない' },
      { value: 'too_complex', label: '使いこなせない' },
      { value: 'competitor_better', label: '競合製品の方が優れている' }
    ],
    saveOffer: 'training'
  },
  experience: {
    label: '体験に関する理由',
    options: [
      { value: 'hard_to_use', label: '使いにくい' },
      { value: 'performance', label: 'パフォーマンスに問題がある' },
      { value: 'support_issue', label: 'サポートに不満がある' }
    ],
    saveOffer: 'onboarding'
  },
  situation: {
    label: '状況に関する理由',
    options: [
      { value: 'project_ended', label: 'プロジェクトが終了した' },
      { value: 'company_decision', label: '会社の都合' },
      { value: 'temporary', label: '一時的に必要なくなった' }
    ],
    saveOffer: 'pause'
  },
  other: {
    label: 'その他',
    options: [
      { value: 'switching', label: '他のサービスに乗り換える' },
      { value: 'other', label: 'その他' }
    ],
    saveOffer: null
  }
};

export function ExitSurvey({
  userId,
  planType,
  tenure,
  onComplete,
  onSaveAttempt
}: {
  userId: string;
  planType: string;
  tenure: number;
  onComplete: (response: ExitSurveyResponse) => void;
  onSaveAttempt: (offer: string) => void;
}) {
  const [step, setStep] = useState<'reason' | 'details' | 'feedback'>('reason');
  const [primaryReason, setPrimaryReason] = useState('');
  const [subReason, setSubReason] = useState('');
  const [competitor, setCompetitor] = useState('');
  const [feedback, setFeedback] = useState('');
  const [wouldReturn, setWouldReturn] = useState<boolean | null>(null);

  const handleReasonSelect = (category: string, reason: string) => {
    setPrimaryReason(category);
    setSubReason(reason);

    trackEvent('exit_reason_selected', {
      category,
      reason,
      plan_type: planType,
      tenure_days: tenure
    });

    const saveOffer = churnReasons[category as keyof typeof churnReasons]?.saveOffer;
    if (saveOffer) {
      onSaveAttempt(saveOffer);
    }

    setStep('details');
  };

  const handleSubmit = () => {
    const response: ExitSurveyResponse = {
      primaryReason: `${primaryReason}:${subReason}`,
      competitor: competitor || undefined,
      feedback: feedback || undefined,
      wouldReturn: wouldReturn ?? false,
      userId,
      planType,
      tenure
    };

    trackEvent('exit_survey_completed', {
      primary_reason: primaryReason,
      sub_reason: subReason,
      has_competitor: !!competitor,
      would_return: wouldReturn,
      tenure_days: tenure
    });

    onComplete(response);
  };

  return (
    <div className="exit-survey">
      {step === 'reason' && (
        <>
          <h3>解約の理由をお聞かせください</h3>
          <p>今後のサービス改善のため、ぜひお聞かせください。</p>

          {Object.entries(churnReasons).map(([category, { label, options }]) => (
            <div key={category} className="reason-category">
              <h4>{label}</h4>
              {options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleReasonSelect(category, option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ))}
        </>
      )}

      {step === 'details' && (
        <>
          <h3>もう少し詳しくお聞かせください</h3>

          {primaryReason === 'other' && subReason === 'switching' && (
            <div className="competitor-input">
              <label>乗り換え先のサービス名（任意）</label>
              <input
                type="text"
                value={competitor}
                onChange={(e) => setCompetitor(e.target.value)}
                placeholder="サービス名を入力"
              />
            </div>
          )}

          <div className="would-return">
            <p>将来的に戻ってくる可能性はありますか？</p>
            <button
              onClick={() => setWouldReturn(true)}
              className={wouldReturn === true ? 'selected' : ''}
            >
              はい
            </button>
            <button
              onClick={() => setWouldReturn(false)}
              className={wouldReturn === false ? 'selected' : ''}
            >
              いいえ
            </button>
          </div>

          <button onClick={() => setStep('feedback')}>次へ</button>
        </>
      )}

      {step === 'feedback' && (
        <>
          <h3>最後に、ご意見があればお聞かせください</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="改善のためのご意見をお聞かせください（任意）"
          />
          <button onClick={handleSubmit}>送信して解約を完了</button>
        </>
      )}
    </div>
  );
}
```

---

## Churn Analysis Report Template

```markdown
## Churn Analysis Report: [Period]

### Overview
| Metric | Value | vs Previous | Target |
|--------|-------|-------------|--------|
| Churn Rate | [X.X%] | [+/-X%] | <[X%] |
| Churned Revenue | ¥[X] | [+/-X%] | - |
| Survey Response Rate | [X%] | [+/-X%] | >60% |

### Churn Reasons Breakdown
| Reason | Count | % | Revenue Lost | Trend |
|--------|-------|---|--------------|-------|
| 価格 | [N] | [X%] | ¥[X] | ↑/↓/→ |
| 機能 | [N] | [X%] | ¥[X] | ↑/↓/→ |
| 体験 | [N] | [X%] | ¥[X] | ↑/↓/→ |
| 状況 | [N] | [X%] | ¥[X] | ↑/↓/→ |
| 競合 | [N] | [X%] | ¥[X] | ↑/↓/→ |

### Competitor Analysis
| Competitor | Lost Users | % of Churn | Key Differentiator |
|------------|------------|------------|-------------------|
| [Comp A] | [N] | [X%] | [What they offer] |
| [Comp B] | [N] | [X%] | [What they offer] |

→ Handoff: `/Compete analyze [competitor] advantage`

### Save Attempt Effectiveness
| Offer Type | Attempts | Saved | Rate | Revenue Saved |
|------------|----------|-------|------|---------------|
| 割引提案 | [N] | [N] | [X%] | ¥[X] |
| トレーニング | [N] | [N] | [X%] | ¥[X] |
| 一時停止 | [N] | [N] | [X%] | ¥[X] |

### Churn by Segment
| Segment | Churn Rate | Primary Reason | Action |
|---------|------------|----------------|--------|
| Enterprise | [X%] | [Reason] | [Action] |
| Pro | [X%] | [Reason] | [Action] |
| Starter | [X%] | [Reason] | [Action] |

### Would Return Analysis
| Response | Count | % | Follow-up Action |
|----------|-------|---|------------------|
| はい | [N] | [X%] | Win-back campaign eligible |
| いいえ | [N] | [X%] | Post-mortem interview |

### Actionable Insights
1. **Primary Churn Driver:** [Reason] ([X%] of churn)
   - Root cause: [Analysis]
   - Recommendation: [Action]

2. **Quick Win:** [Opportunity]
   - Impact: [X] users at risk
   - Action: [Specific fix]

### Retain Handoff
→ `/Retain address churn: [primary reason]`
```

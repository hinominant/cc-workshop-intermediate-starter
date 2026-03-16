# Voice CSAT & CES Surveys

Customer Satisfaction and Customer Effort Score implementations.

---

## CSAT Survey Framework

```markdown
## CSAT Survey: [Touchpoint Name]

### Core Question
「[特定のアクション]についてどの程度満足していますか？」

| Score | Label | Emoji |
|-------|-------|-------|
| 5 | とても満足 | 😄 |
| 4 | 満足 | 🙂 |
| 3 | 普通 | 😐 |
| 2 | 不満 | 🙁 |
| 1 | とても不満 | 😞 |

### Calculation
```
CSAT = (満足回答数 / 全回答数) × 100
```

### Common Touchpoints
- 購入完了後
- サポート対応後
- 機能初回利用後
- オンボーディング完了後
```

---

## CSAT Implementation

```typescript
// components/CSATWidget.tsx
interface CSATResponse {
  score: 1 | 2 | 3 | 4 | 5;
  touchpoint: string;
  feedback?: string;
}

export function CSATWidget({
  touchpoint,
  question,
  onSubmit
}: {
  touchpoint: string;
  question: string;
  onSubmit: (response: CSATResponse) => void;
}) {
  const [score, setScore] = useState<number | null>(null);

  const emojis = ['😞', '🙁', '😐', '🙂', '😄'];

  return (
    <div className="csat-widget">
      <p>{question}</p>
      <div className="emoji-buttons">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => {
              setScore(index + 1);
              onSubmit({
                score: (index + 1) as 1|2|3|4|5,
                touchpoint
              });
            }}
            className={score === index + 1 ? 'selected' : ''}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## CES (Customer Effort Score) Framework

CES measures how easy it was for users to complete a task. Lower effort = higher loyalty.

```markdown
## CES Survey

### Core Question
「[タスク]を完了するのはどの程度簡単でしたか？」

| Score | Label | Interpretation |
|-------|-------|----------------|
| 1 | とても難しかった | High effort - churn risk |
| 2-3 | 難しかった | Friction points exist |
| 4 | どちらでもない | Neutral |
| 5-6 | 簡単だった | Good experience |
| 7 | とても簡単だった | Effortless - loyalty driver |

### CES Calculation
```
CES = (全スコアの合計 / 回答数)
Target: 5.5+ (7-point scale)
```

### Best Touchpoints for CES
| Touchpoint | Trigger | Question Example |
|------------|---------|------------------|
| サポート問い合わせ後 | Ticket closed | 「問題の解決はどの程度簡単でしたか？」 |
| 機能初回利用後 | Feature first use | 「[機能名]の使い始めはどの程度簡単でしたか？」 |
| 設定変更後 | Settings updated | 「設定の変更はどの程度簡単でしたか？」 |
| オンボーディング完了後 | Onboarding complete | 「アカウントのセットアップはどの程度簡単でしたか？」 |
| 購入完了後 | Purchase complete | 「購入手続きはどの程度簡単でしたか？」 |
```

---

## CES Implementation

```typescript
// components/CESSurvey.tsx
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

interface CESResponse {
  score: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  touchpoint: string;
  feedback?: string;
  userId: string;
  timestamp: string;
}

export function CESSurvey({
  touchpoint,
  question,
  userId,
  onComplete
}: {
  touchpoint: string;
  question: string;
  userId: string;
  onComplete: () => void;
}) {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const labels = [
    'とても難しかった',
    '難しかった',
    'やや難しかった',
    'どちらでもない',
    'やや簡単だった',
    '簡単だった',
    'とても簡単だった'
  ];

  const handleSubmit = async () => {
    const response: CESResponse = {
      score: score as CESResponse['score'],
      touchpoint,
      feedback: feedback || undefined,
      userId,
      timestamp: new Date().toISOString()
    };

    trackEvent('ces_submitted', {
      score: response.score,
      touchpoint,
      effort_level: score! <= 3 ? 'high_effort' : score! >= 5 ? 'low_effort' : 'neutral',
      has_feedback: feedback.length > 0
    });

    await submitCESResponse(response);
    onComplete();
  };

  const getFollowUpQuestion = () => {
    if (score === null) return null;
    if (score <= 3) return '何が難しかったですか？改善のためにお聞かせください。';
    if (score >= 6) return '特に簡単だった点があれば教えてください。';
    return 'もっと簡単にするためのご提案があればお聞かせください。';
  };

  return (
    <div className="ces-survey">
      <h3>{question}</h3>

      <div className="score-buttons">
        {[1,2,3,4,5,6,7].map(n => (
          <button
            key={n}
            onClick={() => setScore(n)}
            className={score === n ? 'selected' : ''}
            title={labels[n - 1]}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="score-labels">
        <span>とても難しかった</span>
        <span>とても簡単だった</span>
      </div>

      {score !== null && (
        <>
          <p>{getFollowUpQuestion()}</p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="ご意見をお聞かせください（任意）"
          />
          <button onClick={handleSubmit}>送信</button>
        </>
      )}
    </div>
  );
}
```

---

## CES Analysis Template

```markdown
## CES Analysis Report: [Period]

### Summary
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Average CES | [X.X] | 5.5+ | [Met/Not Met] |
| High Effort (1-3) | [X%] | <20% | [Met/Not Met] |
| Low Effort (5-7) | [X%] | >60% | [Met/Not Met] |

### CES by Touchpoint
| Touchpoint | CES Score | Responses | Trend |
|------------|-----------|-----------|-------|
| オンボーディング | [X.X] | [N] | ↑/↓/→ |
| 初回購入 | [X.X] | [N] | ↑/↓/→ |
| サポート | [X.X] | [N] | ↑/↓/→ |
| 設定変更 | [X.X] | [N] | ↑/↓/→ |

### High Effort Issues (Action Required)
| Issue | CES | Count | Root Cause | Fix |
|-------|-----|-------|------------|-----|
| [Issue 1] | [X.X] | [N] | [Cause] | [Action] |
| [Issue 2] | [X.X] | [N] | [Cause] | [Action] |

### Effort Reduction Priorities
1. **[Touchpoint]**: [Current CES] → [Target CES]
   - Action: [Specific improvement]
   - Owner: [Team]
```

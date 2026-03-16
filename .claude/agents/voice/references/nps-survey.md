# Voice NPS Survey Design

NPS implementation and scoring framework.

---

## NPS Question Template

```markdown
## NPS Survey

### Core Question
「[サービス名]を友人や同僚にお勧めする可能性はどのくらいありますか？」

| Score | Label |
|-------|-------|
| 0-6 | Detractors（批判者） |
| 7-8 | Passives（中立者） |
| 9-10 | Promoters（推奨者） |

### Follow-up Questions

**For Promoters (9-10):**
「特にお気に入りの点を教えてください。」

**For Passives (7-8):**
「どのような改善があれば10点になりますか？」

**For Detractors (0-6):**
「どのような点が期待に沿わなかったですか？」

### NPS Calculation
```
NPS = % Promoters - % Detractors
```

### Benchmark Targets
| NPS Range | Interpretation |
|-----------|----------------|
| 70+ | World-class |
| 50-69 | Excellent |
| 30-49 | Good |
| 0-29 | Needs improvement |
| Below 0 | Critical |
```

---

## NPS Implementation

```typescript
// components/NPSSurvey.tsx
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

interface NPSResponse {
  score: number;
  feedback?: string;
  userId: string;
  timestamp: string;
}

export function NPSSurvey({ userId, onComplete }: { userId: string; onComplete: () => void }) {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    const response: NPSResponse = {
      score: score!,
      feedback,
      userId,
      timestamp: new Date().toISOString()
    };

    // Track NPS response
    trackEvent('nps_submitted', {
      score: response.score,
      category: score! >= 9 ? 'promoter' : score! >= 7 ? 'passive' : 'detractor',
      has_feedback: feedback.length > 0
    });

    await submitNPSResponse(response);
    onComplete();
  };

  const getFollowUpQuestion = () => {
    if (score === null) return null;
    if (score >= 9) return '特にお気に入りの点を教えてください。';
    if (score >= 7) return 'どのような改善があれば10点になりますか？';
    return 'どのような点が期待に沿わなかったですか？';
  };

  return (
    <div className="nps-survey">
      <h3>このサービスを友人や同僚にお勧めする可能性はどのくらいありますか？</h3>

      <div className="score-buttons">
        {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
          <button
            key={n}
            onClick={() => setScore(n)}
            className={score === n ? 'selected' : ''}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="score-labels">
        <span>全くお勧めしない</span>
        <span>強くお勧めする</span>
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

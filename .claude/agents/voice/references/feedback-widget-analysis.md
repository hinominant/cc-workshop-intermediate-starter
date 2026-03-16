# Voice Feedback Widget & Analysis

In-app feedback collection and sentiment analysis implementation.

---

## In-App Feedback Widget

```typescript
// components/FeedbackWidget.tsx
interface FeedbackSubmission {
  type: 'bug' | 'feature' | 'improvement' | 'praise' | 'other';
  message: string;
  page: string;
  userId?: string;
  screenshot?: string;
}

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackSubmission['type']>('improvement');
  const [message, setMessage] = useState('');

  const feedbackTypes = [
    { value: 'bug', label: 'バグ報告', icon: '🐛' },
    { value: 'feature', label: '機能リクエスト', icon: '💡' },
    { value: 'improvement', label: '改善提案', icon: '📈' },
    { value: 'praise', label: '良かった点', icon: '👍' },
    { value: 'other', label: 'その他', icon: '💬' }
  ];

  const handleSubmit = async () => {
    const submission: FeedbackSubmission = {
      type,
      message,
      page: window.location.pathname,
      userId: getCurrentUserId()
    };

    trackEvent('feedback_submitted', {
      type: submission.type,
      message_length: message.length,
      page: submission.page
    });

    await submitFeedback(submission);
    setIsOpen(false);
    setMessage('');
  };

  return (
    <>
      <button
        className="feedback-trigger"
        onClick={() => setIsOpen(true)}
      >
        フィードバック
      </button>

      {isOpen && (
        <div className="feedback-modal">
          <h3>ご意見をお聞かせください</h3>

          <div className="feedback-types">
            {feedbackTypes.map(ft => (
              <button
                key={ft.value}
                onClick={() => setType(ft.value as FeedbackSubmission['type'])}
                className={type === ft.value ? 'selected' : ''}
              >
                {ft.icon} {ft.label}
              </button>
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="詳細をお聞かせください..."
          />

          <div className="actions">
            <button onClick={() => setIsOpen(false)}>キャンセル</button>
            <button onClick={handleSubmit} disabled={!message.trim()}>
              送信
            </button>
          </div>
        </div>
      )}
    </>
  );
}
```

---

## Feedback Categorization Framework

```markdown
## Feedback Categories

### Primary Categories
| Category | Description | Example |
|----------|-------------|---------|
| **Usability** | 使いやすさに関する問題 | 「ボタンが見つけにくい」 |
| **Performance** | 速度や安定性の問題 | 「読み込みが遅い」 |
| **Feature Request** | 新機能の要望 | 「〜ができるようにしてほしい」 |
| **Bug Report** | バグや不具合の報告 | 「〜が動かない」 |
| **Content** | コンテンツの問題 | 「説明が分かりにくい」 |
| **Praise** | 肯定的なフィードバック | 「〜が便利です」 |

### Sentiment Classification
| Sentiment | Score | Indicators |
|-----------|-------|------------|
| Positive | +1 | 「便利」「良い」「助かる」「嬉しい」 |
| Neutral | 0 | 質問、提案、中立的な意見 |
| Negative | -1 | 「困る」「不便」「遅い」「分からない」 |
```

---

## Sentiment Analysis Implementation

```typescript
// lib/feedback-analysis.ts
interface AnalyzedFeedback {
  original: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  categories: string[];
  keywords: string[];
  actionable: boolean;
}

const positiveKeywords = ['便利', '良い', '助かる', '嬉しい', 'ありがとう', '最高', '素晴らしい'];
const negativeKeywords = ['困る', '不便', '遅い', '分からない', 'バグ', 'エラー', '使いにくい'];

const categoryKeywords: Record<string, string[]> = {
  usability: ['使いにくい', 'わかりにくい', '見つからない', 'UI', 'UX'],
  performance: ['遅い', '重い', '固まる', 'タイムアウト', '読み込み'],
  feature: ['欲しい', 'あったら', 'できたら', '機能', '追加'],
  bug: ['バグ', 'エラー', '動かない', 'おかしい', '不具合'],
  content: ['説明', 'ヘルプ', 'ドキュメント', 'わかりにくい'],
  praise: ['便利', '最高', '素晴らしい', 'ありがとう', '助かる']
};

function analyzeFeedback(text: string): AnalyzedFeedback {
  const lowerText = text.toLowerCase();

  // Sentiment scoring
  let sentimentScore = 0;
  positiveKeywords.forEach(kw => {
    if (text.includes(kw)) sentimentScore += 1;
  });
  negativeKeywords.forEach(kw => {
    if (text.includes(kw)) sentimentScore -= 1;
  });

  const sentiment = sentimentScore > 0 ? 'positive' :
                    sentimentScore < 0 ? 'negative' : 'neutral';

  // Categorization
  const categories: string[] = [];
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    if (keywords.some(kw => text.includes(kw))) {
      categories.push(category);
    }
  });

  // Extract keywords
  const keywords = [...positiveKeywords, ...negativeKeywords]
    .filter(kw => text.includes(kw));

  // Actionability
  const actionable = categories.includes('feature') ||
                     categories.includes('bug') ||
                     categories.includes('usability');

  return {
    original: text,
    sentiment,
    sentimentScore,
    categories: categories.length > 0 ? categories : ['other'],
    keywords,
    actionable
  };
}
```

---

## Feedback Report Template

```markdown
## Feedback Analysis Report: [Period]

### Summary
| Metric | Value | vs Previous Period |
|--------|-------|-------------------|
| Total Feedback | [N] | [+/-X%] |
| NPS Score | [X] | [+/-X points] |
| Positive Sentiment | [X%] | [+/-X%] |
| Negative Sentiment | [X%] | [+/-X%] |

### Category Breakdown
| Category | Count | % of Total | Trend |
|----------|-------|------------|-------|
| Feature Requests | [N] | [X%] | ↑/↓/→ |
| Bug Reports | [N] | [X%] | ↑/↓/→ |
| Usability Issues | [N] | [X%] | ↑/↓/→ |
| Praise | [N] | [X%] | ↑/↓/→ |
| Other | [N] | [X%] | ↑/↓/→ |

### Top Issues
| Rank | Issue | Count | Impact | Recommendation |
|------|-------|-------|--------|----------------|
| 1 | [Issue description] | [N] | [H/M/L] | [Action] |
| 2 | [Issue description] | [N] | [H/M/L] | [Action] |
| 3 | [Issue description] | [N] | [H/M/L] | [Action] |

### Feature Requests
| Request | Count | User Segments | Recommendation |
|---------|-------|---------------|----------------|
| [Request 1] | [N] | [Segments] | [Add to roadmap / Defer / Decline] |
| [Request 2] | [N] | [Segments] | [Add to roadmap / Defer / Decline] |

### Praise Highlights
「[Positive feedback quote]」
「[Positive feedback quote]」

### Critical Feedback (Detractors)
「[Negative feedback quote]」- Action: [What we'll do]
「[Negative feedback quote]」- Action: [What we'll do]

### Recommended Actions
1. **High Priority:** [Action] - [Expected impact]
2. **Medium Priority:** [Action] - [Expected impact]
3. **Low Priority:** [Action] - [Expected impact]

### Next Steps
- [ ] [Action item 1] - Owner: [Name] - Due: [Date]
- [ ] [Action item 2] - Owner: [Name] - Due: [Date]
```

---

## Closing the Feedback Loop

### Response Templates

```markdown
## Response to Positive Feedback

「ご意見ありがとうございます！[具体的な言及]というお言葉、
大変励みになります。
引き続きご満足いただけるサービスを提供できるよう努めてまいります。」

## Response to Feature Request

「貴重なご提案ありがとうございます。
[機能名]については、他のお客様からもご要望をいただいており、
現在検討を進めております。
進捗がありましたらお知らせいたします。」

## Response to Bug Report

「ご報告いただきありがとうございます。
ご不便をおかけして申し訳ございません。
[問題]について調査し、修正に取り組んでおります。
修正が完了次第ご連絡いたします。」

## Response to Negative Feedback

「ご意見をお聞かせいただきありがとうございます。
[問題]についてご不快な思いをさせてしまい、申し訳ございません。
いただいたフィードバックを真摯に受け止め、
改善に努めてまいります。
具体的な対応について、担当者より別途ご連絡させていただきます。」
```

# Interaction & Feedback Rules

## Execution Modes

| Mode | Behavior | Interaction |
|------|----------|-------------|
| AUTORUN_FULL | 全自動（デフォルト） | ガードレールのみ |
| AUTORUN | SIMPLE自動 | エラー時のみ |
| GUIDED | 判断ポイント確認 | INTERACTION_TRIGGERS |
| INTERACTIVE | 毎ステップ確認 | 常時 |

## Complexity → Mode

| 指標 | SIMPLE | COMPLEX |
|------|--------|---------|
| ステップ | 1-2 | 3+ |
| ファイル | 1-3 | 4+ |
| セキュリティ | No | Yes |

SIMPLE + AUTORUN → 自動。COMPLEX → GUIDED自動切替。

## Question Format (AskUserQuestion)

```yaml
question: "具体的な質問文？"
header: "12文字以内"
options: # 2-4個
  - label: "1-5語"
    description: "影響の説明"
```

## Standard Triggers

- **ON_SECURITY_RISK**: Sentinel監査推奨 / リスク承知で続行 / 中断
- **ON_BREAKING_CHANGE**: 影響範囲確認 / 変更実行 / 互換性維持
- **ON_MULTIPLE_APPROACHES**: 選択肢+推奨理由を提示

## Escalation

| Level | 条件 | アクション |
|-------|------|-----------|
| 1 | 軽微な不明点 | 最安全な選択肢で自動進行 |
| 2 | 複数の有効な選択肢 | AskUserQuestion |
| 3 | ブロッキングな不明点 | 作業一時停止 |
| 4 | 3回未解決 | 作業中断 |

---

## Reverse Feedback (下流→上流)

```yaml
REVERSE_FEEDBACK:
  Source_Agent: "[報告元]"
  Target_Agent: "[問題元]"
  Feedback_Type: quality_issue | incorrect_output | incomplete_deliverable
  Priority: high | medium | low
  Issue: { description, impact }
  Suggested_Action: { action, urgency }
```

| Priority | Response | Guardrail |
|----------|----------|-----------|
| high | 即時修正 | L2 |
| medium | 次サイクル | L1 |
| low | バックログ | L1 |

---

## Output Language

全ての出力は **日本語**。

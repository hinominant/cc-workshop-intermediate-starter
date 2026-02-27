# アーキテクチャ設計書: EOS

## コンポーネント構成

### Ingress Layer（Step 3）
- 責務: 外部からの Webhook リクエストを受け取り、署名検証後にイベントを正規化
- 技術: Hono HTTP Server
- セキュリティ: HMAC-SHA256 署名検証 + タイムスタンプ検証

### Orchestrator（Step 4）
- 責務: 正規化されたイベントをルールに基づいて振り分け
- 技術: YAML ルール定義 + TypeScript パターンマッチ

### Worker Pool（Step 4-5）
- 責務: 振り分けられたイベントを処理
- 技術: TypeScript async functions
- 信頼性: 冪等性保証 + 指数バックオフリトライ + DLQ

### Notifier（Step 3）
- 責務: 処理結果を外部サービスに通知
- 技術: Slack Webhook

### Storage（Step 5-7）
- 責務: イベントログ、監査ログの記録
- 技術: インメモリ（本番ではDB/S3を想定）

## データフロー

```
Provider → [Webhook POST] → Ingress → [EOSEvent] → Orchestrator → [Route] → Worker → [ProcessingResult] → Notifier
                              |                                        |                                        |
                         署名検証(Step3)                          冪等性(Step5)                           監査ログ(Step7)
                         タイムスタンプ検証                       リトライ(Step5)                         メトリクス(Step6)
                                                                  DLQ(Step5)                             ログ(Step6)
```

## セキュリティレイヤー

```
                    ┌─────────────────────────┐
                    │    DCP (Tier 1-3)       │ ← ルール層: CLAUDE.md + settings.json
                    ├─────────────────────────┤
                    │   署名検証 (HMAC)       │ ← Step 3: Ingress Layer
                    ├─────────────────────────┤
                    │   入力検証              │ ← Step 3-4: パース + ルーティング
                    ├─────────────────────────┤
                    │   PII マスキング        │ ← Step 6-7: ログ + 監査
                    ├─────────────────────────┤
                    │   監査ログ              │ ← Step 7: 操作追跡
                    └─────────────────────────┘
```

## 技術選定

| 技術 | 選定理由 |
|------|---------|
| Hono | 軽量・高速・TypeScript ファースト |
| YAML | ルール定義の可読性・編集容易性 |
| Vitest | 高速テスト・TypeScript ネイティブ |
| node:crypto | 標準ライブラリで署名検証（外部依存なし） |

## ファイル構成と Step 対応

```
src/
├── index.ts              # Hono サーバーエントリポイント     (Step 3)
├── types/
│   └── event.ts          # 型定義                           (提供済み)
├── adapters/
│   ├── webhook-provider.ts  # Webhook パース               (Step 3)
│   └── slack-notifier.ts    # Slack 通知                   (Step 3)
├── orchestrator/
│   └── router.ts         # ルーティングロジック              (Step 4)
├── security/
│   ├── signature.ts      # HMAC-SHA256 署名検証            (Step 3)
│   └── audit-log.ts      # 監査ログ + PII マスキング       (Step 7)
├── reliability/
│   ├── idempotency.ts    # 冪等性保証                      (Step 5)
│   ├── retry.ts          # 指数バックオフリトライ           (Step 5)
│   └── dlq.ts            # Dead Letter Queue               (Step 5)
├── observability/
│   ├── logger.ts         # 構造化 JSON ログ                (Step 6)
│   └── metrics.ts        # メトリクス                      (Step 6)
└── __tests__/
    ├── signature.test.ts    # 署名検証テスト               (Step 3)
    ├── router.test.ts       # ルーティングテスト           (Step 4)
    └── idempotency.test.ts  # 冪等性テスト                 (Step 5)
```

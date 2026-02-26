# アーキテクチャ設計書: EOS

## コンポーネント構成

### Ingress Layer
- 責務: 外部からのWebhookリクエストを受け取り、署名検証後にイベントを正規化
- 技術: Hono HTTP Server

### Orchestrator
- 責務: 正規化されたイベントをルールに基づいて振り分け
- 技術: agent-orchestrator + YAML ルール定義

### Worker Pool
- 責務: 振り分けられたイベントを処理
- 技術: TypeScript async functions

### Notifier
- 責務: 処理結果を外部サービスに通知
- 技術: Slack Webhook

### Storage
- 責務: イベントログ、監査ログの記録
- 技術: インメモリ（本番ではDB/S3を想定）

## データフロー

```
Provider → [Webhook POST] → Ingress → [EOSEvent] → Orchestrator → [Route] → Worker → [ProcessingResult] → Notifier
                                                                                                              |
                                                                                                          Storage
```

## 技術選定

| 技術 | 選定理由 |
|------|---------|
| Hono | 軽量・高速・TypeScript ファースト |
| YAML | ルール定義の可読性・編集容易性 |
| Vitest | 高速テスト・TypeScript ネイティブ |

# Event Orchestration Service (EOS)

外部イベントを受信し、ルールベースで振り分け・処理・通知を行うオーケストレーションサービス。

## 技術スタック

- Runtime: Node.js + TypeScript
- HTTP: Hono
- テスト: Vitest
- ルール定義: YAML

## エージェントチーム

| Agent | 役割 |
|-------|------|
| Sherpa | タスク分解・実装計画 |
| Artisan | TypeScript バックエンド実装 |
| Radar | テスト・検証 |
| Sentinel | セキュリティ監査 |

## プロジェクト構造

```
src/
├── index.ts              # Honoサーバーエントリポイント
├── adapters/             # 外部IF Adapter
├── orchestrator/         # ルーティングロジック
├── reliability/          # 冪等性・リトライ・DLQ
├── observability/        # ログ・メトリクス
├── security/             # 署名検証・監査ログ
└── types/                # 型定義
```

## 非機能要件

### セキュリティ
- Secrets は .env に直置きしない（.env.example はダミー値のみ）
- HMAC-SHA256 による署名検証必須
- PII はログに出力しない（maskPII で変換）
- 監査ログで操作を追跡可能にする

### 信頼性
- event_id ベースの冪等性保証
- 指数バックオフリトライ（最大3回）
- 失敗イベントは DLQ に隔離

### 観測性
- 全ログは JSON 構造化形式
- メトリクス: success/failure count, latency
- 失敗率がN%超でアラート

## カスタマイズ

このファイルを編集して、プロジェクトの方針を変更できます:
- エージェントの振る舞いを調整
- 非機能要件の閾値を変更
- 新しいルールやProviderの方針を追加

<!-- 受講者がここに独自の方針を追加 -->

## ルール

- Hub-spoke: 全通信はオーケストレーター経由
- テストなしのコードは未完成
- Secrets をコミットしない
- 日本語で出力

# Event Orchestration Service (EOS) — 中級ワークショップ

外部 Webhook を受信し、ルールベースで振り分け・処理・Slack 通知を行うオーケストレーションサービス。

Claude Code エージェントチームの中級ワークショップ用スターターリポジトリ。

## 概要

- **初級との違い**: セキュリティを意識したバックエンド開発 + エージェントチームの設計・運用
- **所要時間**: 120〜180分

## 技術スタック

- Runtime: Node.js + TypeScript (strict mode)
- HTTP: Hono
- テスト: Vitest
- ルール定義: YAML

## セットアップ

```bash
npm install
npm run dev
```

## ドキュメント

詳細は `CLAUDE.md` を参照。

# Autonomous Execution Protocol

AIが24時間自律で開発を回すためのルール。

---

## 有効化

`.context/autonomous-mode` ファイルを作成すると有効。

```bash
touch .context/autonomous-mode    # 有効化
rm .context/autonomous-mode       # 無効化
```

## 動作

| 通常モード | 自律モード |
|-----------|-----------|
| ask_user → 人間応答待ち | ask_user → approve + ログ記録 |
| block → 停止 | block → 停止（安全性維持） |

**blockは自律モードでも停止する。** セキュリティ・データ整合性の判定は緩めない。

## Deferred Reviews

自律モード中にスキップされた ask_user は `.context/deferred-reviews.jsonl` に記録される。

```jsonl
{"ts":"2026-04-09T10:00:00Z","hook":"ogsm-review","message":"OGSM品質チェック: NG ..."}
{"ts":"2026-04-09T10:05:00Z","hook":"spec-gate","message":"Spec不完全 ..."}
```

### レビュータイミング

- **Stop hook**: セッション終了時に未レビュー件数を表示
- **翌朝確認**: Keijiが翌朝まとめて確認。問題があればrevert
- **週次**: Auditorが deferred-reviews を分析し、パターンを報告

## エスケープハッチ

| 状況 | 対応 |
|------|------|
| hookが全ツールをblock | `.context/autonomous-mode` 削除で通常モードに戻る |
| 特定hookを一時無効化 | `.context/skip-{hook-name}` ファイル作成 |
| 全hookを無効化 | settings.json の hooks セクションを空にする |

## Incident Mode との併用

`.context/autonomous-mode` + Incident ラベル → 最速経路:
- ask_user → 全てapprove
- commit-gate → Step 2/3/5スキップ
- 事後レビュー必須（incident-debt.json + deferred-reviews.jsonl）

## 対応hook一覧

`_autonomous.js` ヘルパーを使用する全hook:
- spec-gate.js, tdd-gate.js, design-gate.js, review-gate.js
- ogsm-review.js, keiji-agent-gate.js
- tool-risk.js, package-guard.js, infra-guard.js
- download-guard.js, debug-guard.js
- epic-gate.js

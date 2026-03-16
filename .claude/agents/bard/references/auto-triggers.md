# Auto-Trigger Reference

Bard の自動投稿トリガー設定。
`.agents/bard/auto-post.sh` がコアスクリプト。

---

## Architecture

```
┌──────────┐     ┌──────────────┐     ┌──────────────────┐     ┌───────┐
│ Git Hook │────▶│ auto-post.sh │────▶│ codex / gemini   │────▶│ Slack │
│ (commit) │     │ (threshold)  │     │ / claude (選択)  │     │       │
└──────────┘     └──────────────┘     └──────────────────┘     └───────┘
                       │
                 ┌─────┴─────┐
                 │.last-post │  ← 状態管理（前回投稿時刻）
                 └───────────┘
```

**Flow:**
1. `git commit` → `post-commit` hook が発火
2. `auto-post.sh` がバックグラウンドで起動
3. 閾値チェック（MIN_COMMITS かつ MIN_HOURS）
4. 条件を満たしたらエンジン（デフォルト: codex）で Bard セッション起動
5. エージェントが git data 収集 → ペルソナ選択 → 投稿生成 → Slack 投稿
6. `.last-post` タイムスタンプを更新

---

## Trigger Types

### 1. Git Post-Commit Hook (デフォルト)

毎 commit 後にバックグラウンドで閾値チェック。
条件を満たした時だけ Bard を起動。

**Setup:** `.git/hooks/post-commit` に設置済み

**Thresholds (default):**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `MIN_COMMITS` | 5 | 前回投稿以降のcommit数 |
| `MIN_HOURS` | 4 | 前回投稿からの経過時間 |

**カスタマイズ:**
```bash
# 閾値を変更して手動テスト
MIN_COMMITS=3 MIN_HOURS=1 .agents/bard/auto-post.sh
```

### 2. 手動トリガー

```bash
# 閾値チェックして条件を満たせば投稿
.agents/bard/auto-post.sh

# 強制投稿（閾値無視）
.agents/bard/auto-post.sh --force

# 状態確認のみ
.agents/bard/auto-post.sh --check

# 状態リセット（タイマーをクリア）
.agents/bard/auto-post.sh --reset
```

### 3. Cron / Launchd (定期実行)

日次や週次のダイジェスト投稿。

```bash
# crontab -e で追加:

# 毎日18時に閾値チェック → 条件met なら投稿
0 18 * * * cd /path/to/repo && .agents/bard/auto-post.sh >> /tmp/bard-cron.log 2>&1

# 毎週金曜18時に強制投稿（週次ダイジェスト）
0 18 * * 5 cd /path/to/repo && .agents/bard/auto-post.sh --force >> /tmp/bard-cron.log 2>&1
```

### 4. Git Tag / Release Hook

リリース時にコメンタリーを自動投稿。
`post-commit` hook を拡張するか、別の hook を追加。

```bash
# .git/hooks/post-tag (custom, not standard git hook)
# or use: git tag -a v1.0.0 && .agents/bard/auto-post.sh --force
```

---

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MIN_COMMITS` | 5 | 投稿に必要な最小commit数 |
| `MIN_HOURS` | 4 | 投稿に必要な最小経過時間 |
| `BARD_ENGINE` | codex | エンジン選択: `codex`, `gemini`, `claude` |
| `BARD_MODEL` | (各エンジンの既定) | モデル指定（省略時はエンジンのデフォルト） |
| `BARD_DRY_RUN` | 0 | `1` でpromptのみ表示、エンジン起動しない |

### State File

`.agents/bard/.last-post` — 前回投稿のUNIXタイムスタンプを保持。
削除すると「未投稿状態」にリセットされる。

### Log

`/tmp/bard-auto-post.log` — バックグラウンド実行時のログ出力先。

---

## Engine Invocation

`auto-post.sh` はエンジンに応じて以下を実行する:

### codex（デフォルト — 安価）

```bash
codex exec "$PROMPT" --full-auto
```

| Flag | Purpose |
|------|---------|
| `exec` | 非対話モード |
| `--full-auto` | サンドボックス内で自動承認 |
| `-m MODEL` | モデル指定（省略時はcodexの既定値） |

### gemini（安価）

```bash
gemini -p "$PROMPT" --yolo
```

| Flag | Purpose |
|------|---------|
| `-p` | 非対話（ヘッドレス）モード |
| `--yolo` | 全アクション自動承認 |
| `-m MODEL` | モデル指定（省略時はgeminiの既定値） |

### claude（高品質 — 高コスト）

```bash
claude -p "$PROMPT" \
    --model haiku \
    --permission-mode dontAsk \
    --no-session-persistence
```

| Flag | Purpose |
|------|---------|
| `-p` | Print mode（非対話） |
| `--model haiku` | コスト抑制（sonnet/opusに変更可） |
| `--permission-mode dontAsk` | ツール実行を自動許可 |
| `--no-session-persistence` | セッション保存しない |

### エンジン切り替え

```bash
# デフォルト（codex）
.agents/bard/auto-post.sh --force

# gemini に切り替え
BARD_ENGINE=gemini .agents/bard/auto-post.sh --force

# claude（高品質が必要な場合）
BARD_ENGINE=claude .agents/bard/auto-post.sh --force
BARD_ENGINE=claude BARD_MODEL=sonnet .agents/bard/auto-post.sh --force
```

---

## Recommended Thresholds

| Use Case | MIN_COMMITS | MIN_HOURS | Notes |
|----------|-------------|-----------|-------|
| 高頻度開発 | 5 | 4 | デフォルト。1日1-2回投稿 |
| 通常開発 | 10 | 8 | 1日0-1回。ほどよい |
| 週次ダイジェスト | 1 | 168 | cron --force と組み合わせ |
| デバッグ/テスト | 1 | 0 | テスト用。本番では使わない |

---

## Disabling Auto-Post

```bash
# 一時的に無効化（hookを非実行可能に）
chmod -x .git/hooks/post-commit

# 再有効化
chmod +x .git/hooks/post-commit

# 完全削除
rm .git/hooks/post-commit
rm .agents/bard/auto-post.sh
rm .agents/bard/.last-post
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| hookが発火しない | `chmod +x .git/hooks/post-commit` を確認 |
| claude command not found | `which claude` でパスを確認。hook内でフルパス指定 |
| Slack投稿されない | `.agents/bard/post_slack.py` のWEBHOOK_URLを確認 |
| 毎回投稿される | `MIN_COMMITS` / `MIN_HOURS` の閾値を上げる |
| コストが心配 | `BARD_MODEL=haiku` でコスト削減。または `MIN_HOURS=24` |
| ログを見たい | `cat /tmp/bard-auto-post.log` |

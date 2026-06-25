# Skill: Using Git Worktrees — 並行作業の分離

**Trigger**: Design Evolution発動時、並行ブランチ作業時

## Purpose

git worktreeを使って、複数のブランチを同時に別ディレクトリで作業可能にする。
Design Evolutionで旧設計と新設計を並行検証する場合に必須。

## When to Use

- Design Evolution発動（impl/qa-roundsから qa-planningへ戻る）
- 緊急バグ修正を現在ブランチを汚さずに行いたい
- 複数AIが並列でタスクを実行

## When NOT to Use

- 単純な1ブランチ作業
- コンフリクト解決のみ
- 小さな変更（worktreeのoverheadが大きい）

## The Process

### Step 1: 現状の確認

```bash
git worktree list
# main作業ディレクトリ + 既存worktree一覧が表示
```

### Step 2: worktree作成

```bash
# 新ブランチ + 新ディレクトリで作成
git worktree add ../project-evolution -b aris-625-jwt-evolve

# 既存ブランチをworktreeに
git worktree add ../project-hotfix hotfix/critical-bug
```

### Step 3: worktree内で作業

```bash
cd ../project-evolution
# 通常通りコード変更、commit、push
```

### Step 4: 完了後のクリーンアップ

```bash
# worktreeを削除（ブランチは残る）
git worktree remove ../project-evolution

# 未マージの変更があればエラー → 明示的に削除
git worktree remove --force ../project-evolution
```

## Design Evolution統合

`phase-transition.js evolve` コマンドで自動作成:

```bash
node scripts/phase-transition.js evolve "JWT方式に変更"
# → 自動で git worktree add を実行
# → 新ディレクトリで qa-planning フェーズを開始
```

## hook動作の注意

worktree内でも全hook（QA gate含む）が動作する必要がある:
- `.claude/hooks/` はsymlinkではなく実ファイルとしてworktreeにコピー
- `.context/` はworktree個別に持つ（phase-state.jsonも個別）
- `docs/qa/` は共有（QA台帳は1チケット1つ）

## Anti-patterns

**Bad**: 現在ブランチを汚す
```
急ぎのバグ修正 → 現在ブランチでstash → cherry-pick → 元ブランチ復元
→ 履歴が汚れ、stashが消える事故が多発
```

**Good**: worktree分離
```
急ぎのバグ修正 → worktree作成 → 分離された環境で作業 → 完了後削除
→ 現在作業に影響ゼロ
```

## 参考
- github.com/obra/superpowers/skills/using-git-worktrees
- git-worktree(1) man page

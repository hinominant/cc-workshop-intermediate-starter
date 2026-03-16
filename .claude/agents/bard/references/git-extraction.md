# Git Data Extraction Reference

Bard が詩の素材を収集するための read-only git/gh コマンドパターン。

---

## Safety Rules

- **すべてのコマンドは read-only であること**
- `git log`, `git show`, `git diff` (read) のみ使用
- `git checkout`, `git reset`, `git push` 等の状態変更コマンドは使用禁止
- `gh` コマンドも `--json` での読み取りのみ

---

## Git Log Patterns

### Sprint Period Commits

```bash
# 期間指定でコミットを取得（マージコミット除外）
git log --since="2024-01-08" --until="2024-01-19" --no-merges \
  --pretty=format:"%h|%an|%ad|%s" --date=short

# Conventional Commit のタイプ別カウント (macOS/Linux 両対応)
git log --since="2024-01-08" --until="2024-01-19" --no-merges \
  --pretty=format:"%s" | \
  sed -E 's/^(feat|fix|refactor|test|docs|style|perf|chore|ci|security).*/\1/' | \
  grep -E '^(feat|fix|refactor|test|docs|style|perf|chore|ci|security)$' | \
  sort | uniq -c | sort -rn
```

### Release Range Commits

```bash
# タグ間のコミット一覧
git log v1.9.0..v2.0.0 --no-merges \
  --pretty=format:"%h|%an|%ad|%s" --date=short

# タグ間の変更統計
git diff --stat v1.9.0..v2.0.0

# タグ間のコントリビューター一覧
git log v1.9.0..v2.0.0 --no-merges \
  --pretty=format:"%an" | sort | uniq -c | sort -rn
```

### Developer-specific Commits

```bash
# 特定開発者のコミット（期間指定）
git log --author="Alice" --since="2024-01-01" --until="2024-06-30" \
  --no-merges --pretty=format:"%h|%ad|%s" --date=short

# 開発者の変更統計
git log --author="Alice" --since="2024-01-01" --until="2024-06-30" \
  --no-merges --shortstat
```

### Project Milestones

```bash
# 最初のコミット
git log --reverse --pretty=format:"%h|%an|%ad|%s" --date=short | head -1

# 全タグ（リリース履歴）
git tag --sort=-creatordate --format='%(creatordate:short)|%(refname:short)|%(subject)'

# コントリビューター数の推移（月別）
git log --pretty=format:"%ad|%an" --date=format:"%Y-%m" | \
  sort | uniq | cut -d'|' -f1 | uniq -c
```

---

## GitHub CLI (gh) Patterns

### PR Data Collection

```bash
# マージ済みPR一覧（スプリント期間）
gh pr list --state merged --search "merged:>2024-01-08 merged:<2024-01-19" \
  --json number,title,author,labels,additions,deletions,mergedAt,reviewers \
  --limit 100

# 特定PRの詳細
gh pr view 150 --json title,body,author,labels,additions,deletions,mergedAt,reviews,comments

# リリースノート素材
gh pr list --state merged --search "merged:>2024-01-01" \
  --json number,title,labels,author \
  --limit 200
```

### Contributor Information

```bash
# PRベースのコントリビューター統計
gh pr list --state merged --search "merged:>2024-01-08" \
  --json author --limit 200 | \
  jq '[.[].author.login] | group_by(.) | map({user: .[0], count: length}) | sort_by(-.count)'

# 特定ユーザーのPR一覧
gh pr list --state merged --author "alice" \
  --json number,title,mergedAt,additions,deletions \
  --limit 100
```

### Label-based Categorization

```bash
# ラベル別PR集計
gh pr list --state merged --search "merged:>2024-01-08" \
  --json number,title,labels --limit 200 | \
  jq '[.[].labels[].name] | group_by(.) | map({label: .[0], count: length}) | sort_by(-.count)'
```

---

## Harvest Data Integration

Harvest から handoff で受け取るデータを直接利用する場合のパターン。

### HARVEST_TO_BARD Handoff Processing

```yaml
# Harvestから受け取るデータ構造
HARVEST_TO_BARD:
  type: "sprint_data"
  period:
    start: "2024-01-08"
    end: "2024-01-19"
  statistics:
    total_prs: 12
    merged: 10
    additions: 3500
    deletions: 1200
    categories:
      feat: 5
      fix: 3
      refactor: 2
    top_contributors:
      - name: "Alice"
        prs: 4
        additions: 1200
      - name: "Bob"
        prs: 3
        additions: 800
    highlights:
      - "New authentication system (PR #150)"
      - "Performance improvement: 2x faster API (PR #148)"
```

**Harvest データを使う利点:**
- git/gh コマンドの実行が不要
- 既に集計済みのデータを直接利用
- Harvest のキャッシュ機能により高速
- より正確な統計（Harvest の計算ロジック利用）

**Harvest データがない場合:**
- 上記の git/gh コマンドで自力収集
- `gh pr list` で PR データを直接取得
- `git log` でコミットデータを収集

---

## Data Extraction Checklist

詩の生成前に収集すべきデータ:

| データ項目 | 必須度 | 収集元 | 用途 |
|-----------|--------|--------|------|
| コミット数 | 必須 | git log / Harvest | ソースサマリー |
| PR数 | 必須 | gh pr list / Harvest | ソースサマリー |
| 期間 | 必須 | ユーザー指定 / git log | ソースサマリー、季語選択 |
| カテゴリ別内訳 | 推奨 | git log / Harvest | テーマ選択 |
| コントリビューター | 推奨 | git log / gh / Harvest | 称賛、キャラクター |
| 主要な変更内容 | 推奨 | PR titles / commit messages | 具体的な詩の素材 |
| 変更行数 | 任意 | git diff / Harvest | 規模感の表現 |
| レビュー情報 | 任意 | gh pr view | 協力のテーマ |

# harvest — PRレポート リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## Core gh Command Patterns

### Basic PR Retrieval

```bash
# カレントリポジトリから全PRを取得
gh pr list --state all --limit 100 --json number,title,state,author,createdAt,mergedAt,labels,additions,deletions,url

# マージ済みのみ
gh pr list --state merged --json number,title,author,mergedAt,additions,deletions

# オープン中のみ
gh pr list --state open --json number,title,author,createdAt,labels
```

### Filtered Retrieval

```bash
# 特定author
gh pr list --state all --author username --json number,title,state,createdAt,mergedAt

# 特定label
gh pr list --state all --label "bug" --json number,title,author,mergedAt

# 検索クエリ
gh pr list --state all --search "is:merged merged:>=2024-01-01" --json number,title,author,mergedAt
```

### Date Range Filtering with jq

```bash
# 期間フィルタ（jq併用）
gh pr list --state all --limit 500 --json number,title,state,author,createdAt,mergedAt | \
  jq --arg start "2024-01-01" --arg end "2024-01-31" \
  '[.[] | select(.createdAt >= $start and .createdAt <= $end)]'

# 今週のPR
gh pr list --state all --limit 100 --json number,title,state,author,createdAt,mergedAt | \
  jq --arg start "$(date -v-7d +%Y-%m-%d)" \
  '[.[] | select(.createdAt >= $start)]'
```

### Statistics Aggregation

```bash
# マージされたPRの統計
gh pr list --state merged --limit 500 --json additions,deletions,author | \
  jq 'group_by(.author.login) | map({author: .[0].author.login, prs: length, additions: (map(.additions) | add), deletions: (map(.deletions) | add)})'

# ラベル別集計
gh pr list --state all --limit 500 --json labels,state | \
  jq '[.[] | .labels[].name] | group_by(.) | map({label: .[0], count: length})'
```

**Full command patterns**: See `references/gh-commands.md`

---

## Report Formats

Harvest generates 6 types of reports:

### 1. Summary Report

統計とカテゴリ分布の概要:

```markdown
## PR Summary Report (2024-01-01 - 2024-01-31)

### Overview
- Total PRs: 45
- Merged: 38 (84.4%)
- Open: 5 (11.1%)
- Closed: 2 (4.4%)

### Changes
- Total Additions: +12,345 lines
- Total Deletions: -3,456 lines
- Net Change: +8,889 lines

### By Category
| Category | Count | Percentage |
|----------|-------|------------|
| feat | 20 | 44.4% |
| fix | 12 | 26.7% |
| refactor | 8 | 17.8% |
| docs | 5 | 11.1% |

### Top Contributors
| Author | PRs | Additions | Deletions |
|--------|-----|-----------|-----------|
| @user1 | 15 | +5,000 | -1,200 |
| @user2 | 12 | +4,000 | -800 |
```

### 2. Detailed List

全PRの表形式一覧:

```markdown
## PR Detailed List

| # | Title | Author | Status | Created | Merged | +/- |
|---|-------|--------|--------|---------|--------|-----|
| 123 | feat: add user auth | @user1 | merged | 2024-01-15 | 2024-01-16 | +500/-100 |
| 122 | fix: login timeout | @user2 | merged | 2024-01-14 | 2024-01-15 | +50/-20 |
```

### 3. Individual Work Report

特定メンバーの活動詳細:

```markdown
## Individual Work Report: @username

### Period: 2024-01-01 - 2024-01-31

### Summary
- PRs Created: 15
- PRs Merged: 14
- Review Requested: 8
- Avg Merge Time: 1.5 days

### PR List
| # | Title | Status | Created | Merged | Changes |
|---|-------|--------|---------|--------|---------|
| 123 | feat: add user auth | merged | 2024-01-15 | 2024-01-16 | +500/-100 |

### Category Breakdown
- feat: 8 PRs
- fix: 4 PRs
- refactor: 2 PRs
- docs: 1 PR
```

### 4. Release Notes

Changelog形式:

```markdown
## Release Notes v1.2.0

### Features
- Add user authentication (#123) - @user1
- Implement dashboard widgets (#120) - @user2

### Bug Fixes
- Fix login session timeout (#124) - @user1
- Resolve cart race condition (#121) - @user3

### Improvements
- Refactor auth module (#125) - @user2
- Update dependencies (#119) - @user1

### Contributors
@user1, @user2, @user3
```

**Full templates**: See `references/report-templates.md`

### 5. Client Report (クライアント報告書)

工数・タイムライン・グラフを含む美しいクライアント向けレポート:

```markdown
# 作業報告書

**プロジェクト:** Project Name
**報告期間:** 2024-01-01 〜 2024-01-31
**担当者:** @username

## 📊 エグゼクティブサマリー

| 完了タスク | 総工数 | 追加行数 | 完了率 |
|:----------:|:------:|:--------:|:------:|
| 12件 | 52.0h | +8,141 | 100% |

## 📅 作業タイムライン

[Mermaid Gantt Chart]

## 📈 日別作業実績

[Mermaid XY Chart / ASCII Bar Chart]

## 📋 作業詳細

| No. | タスク | カテゴリ | 工数 | 期間 | ステータス |
|:---:|--------|:--------:|-----:|------|:----------:|
| 1 | OAuth2認証機能 | 🚀 feat | 16.0h | 01/21-22 | ✅ 完了 |
```

**Full templates & styles**: See `references/client-report-templates.md`

### 6. Quality Trends Report

Code review quality analysis integrated with Judge feedback:

```markdown
# Code Quality Trends Report

**Period:** 2024-01-01 - 2024-01-31
**Data Source:** Judge Feedback Integration

## Quality Overview

| Metric | Current | Previous | Trend |
|--------|:-------:|:--------:|:-----:|
| Average Quality Score | 85/100 | 82/100 | ⬆️ |
| PR Approval Rate | 88% | 84% | ⬆️ |
| Avg Review Cycles | 1.4 | 1.6 | ⬆️ |

## Common Issues Found

| Issue Type | Count | Severity |
|------------|:-----:|:--------:|
| Missing Tests | 8 | Medium |
| Security Concerns | 2 | High |

## Recommendations

- Add test coverage requirements for feat PRs
- Security review for auth-related changes
```

**Full template**: See `references/report-templates.md` (Section 5)

---

## Work Hours Calculation (工数計算)

PRの工数は以下のロジックで推定:

### 計算式

```
工数(h) = ベース工数 × ファイル重み + 複雑度補正 + 新規ファイルボーナス

ベース工数     = (additions + deletions) / 100
複雑度補正     = changedFiles × 0.25
新規ファイル   = 新規ファイル数 × 0.5h
最小工数       = 0.5h
```

### ファイル種類による重み付け

| ファイル種類 | パターン | 重み | 理由 |
|-------------|---------|:----:|------|
| テスト | `*.test.*`, `*.spec.*` | 0.7 | 比較的定型的 |
| 設定ファイル | `*.json`, `*.yaml`, `*.toml` | 0.5 | 変更量と工数が比例しない |
| ドキュメント | `*.md`, `*.txt`, `*.rst` | 0.3 | テキスト主体 |
| ソースコード | その他 | 1.0 | 標準 |

### 工数カテゴリ

| サイズ | 行数 | 工数目安 |
|:------:|-----:|:--------:|
| XS | < 50 | 0.5 - 1h |
| S | 50-200 | 1 - 3h |
| M | 200-500 | 3 - 8h |
| L | 500-1000 | 8 - 16h |
| XL | > 1000 | 16h+ |

### 集計コマンド

```bash
# 工数付きPRリスト取得（基本）
gh pr list --state merged --limit 100 --json number,title,additions,deletions,createdAt,mergedAt | \
  jq '[.[] | {
    number,
    title,
    lines: (.additions + .deletions),
    hours: (([(.additions + .deletions) / 100, 0.5] | max) | . * 2 | floor / 2)
  }]'

# 詳細な工数計算（ファイル情報含む）
gh pr list --state merged --limit 100 --json number,title,additions,deletions,changedFiles | \
  jq '[.[] | {
    number,
    title,
    lines: (.additions + .deletions),
    files: .changedFiles,
    hours: ((([(.additions + .deletions) / 100, 0.5] | max) + (.changedFiles * 0.25)) | . * 2 | floor / 2)
  }]'
```

### スクリプトによる自動計算

```bash
# generate-report.js を使用（推奨）
node scripts/generate-report.js --days 30 --json | jq '.prs[] | {title, hours}'
```

### LLMによる工数推定（推奨）

機械的な行数カウントよりも、LLMによる分析がより正確な工数推定を提供できます。

**LLMに依頼する際のプロンプト:**

```
以下のPR情報から、各PRの工数を推定してください。

考慮すべき要素:
1. PRタイトルと説明から読み取れる作業の複雑さ
2. 変更の種類（新機能、バグ修正、リファクタリング）
3. ドメインの複雑さ（認証、決済、データ処理は複雑度が高い）
4. 必要な付随作業（テスト作成、ドキュメント更新、レビュー対応）
5. 統合の難易度（既存コードとの整合性確保）

PRデータ:
[PRリストをJSON形式で提供]

出力形式:
| PR# | タイトル | 推定工数 | 根拠 |
```

**LLM工数推定の精度向上ファクター:**

| ファクター | 複雑度上昇 | 例 |
|-----------|:----------:|---|
| 新規アーキテクチャ | +50-100% | 新しいパターン導入 |
| セキュリティ関連 | +30-50% | 認証、暗号化 |
| データ整合性 | +30-50% | マイグレーション、同期 |
| 外部API統合 | +20-40% | サードパーティ連携 |
| パフォーマンス最適化 | +20-40% | キャッシュ、クエリ最適化 |
| 複数サービス影響 | +20-30% | マイクロサービス間変更 |
| テスト作成必須 | +10-20% | カバレッジ要件 |

**Harvest実行時のLLM活用:**

1. PRデータ取得後、LLMに工数推定を依頼
2. 推定結果をレポートに反映
3. クライアント報告書では「推定工数」として記載

---

## PDF Export

Markdownレポートを美しいPDFに変換:

```bash
# md-to-pdf（推奨）
npm install -g md-to-pdf
md-to-pdf client-report.md --stylesheet styles/harvest-style.css

# Pandoc
pandoc client-report.md -o report.pdf --pdf-engine=lualatex
```

**Full guide**: See `references/pdf-export-guide.md`
**Styles**: See `styles/harvest-style.css`

---

## Error Handling

Robust error handling ensures reliable data collection.

### Error Categories

| Error | Detection | Recovery |
|-------|-----------|----------|
| **Auth failure** | `gh auth status` fails | Prompt user to run `gh auth login` |
| **Rate limit** | 403 or remaining < 100 | Wait for reset, exponential backoff |
| **Timeout** | No response in 60s | Retry with reduced scope |
| **Not found** | 404 response | Report and skip (non-recoverable) |

### Retry Strategy

```bash
# Exponential backoff: 5s, 10s, 20s
gh_retry 3 5 "gh pr list --state merged --limit 100"
```

### Health Check

Run before data collection:

```bash
harvest_health_check  # Checks: gh CLI, auth, rate limit, repo access, jq
```

### Graceful Degradation

| Data Missing | Impact | Action |
|--------------|:------:|--------|
| additions/deletions | 80% quality | Skip change stats |
| dates | 60% quality | Skip date filtering |
| author | 50% quality | Skip contributor analysis |

**Full details**: See `references/error-handling.md`

---

## Caching Strategy

Cache layer reduces API calls by 60% and improves response time.

### Cache Configuration

| Data Type | TTL | Use Case |
|-----------|:---:|----------|
| PR List | 5 min | Recent queries |
| PR Details | 15 min | Individual PR data |
| User Stats | 1 hour | Contributor analysis |
| Repo Info | 24 hours | Metadata |

### Cache Location

```
.harvest/
├── cache/
│   ├── pr-lists/
│   ├── pr-details/
│   ├── users/
│   └── queries/
└── last-sync.json
```

### Incremental Collection

Track last sync to fetch only updated PRs:

```bash
# Fetch only PRs updated since last sync
fetch_incremental_prs "org/project"
```

### Cache Policy Options

| Policy | Behavior |
|--------|----------|
| `prefer_cache` | Use if valid, fetch on miss (default) |
| `force_refresh` | Invalidate and fetch fresh |
| `cache_only` | Return cached or fail |

**Full details**: See `references/caching-strategy.md`

---

## Output File Naming

| Report Type | File Name Pattern |
|-------------|-------------------|
| Summary | `pr-summary-YYYY-MM-DD.md` |
| Detailed | `pr-list-YYYY-MM-DD.md` |
| Individual | `work-report-{username}-YYYY-MM-DD.md` |
| Release Notes | `release-notes-vX.Y.Z.md` |
| Client Report | `client-report-YYYY-MM-DD.md` |
| Client PDF | `client-report-YYYY-MM-DD.pdf` |

---


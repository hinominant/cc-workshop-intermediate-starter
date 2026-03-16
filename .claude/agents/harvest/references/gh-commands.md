# gh Command Reference for Harvest

GitHub CLI (`gh`) コマンドの詳細パターン集。PR情報の取得・フィルタリング・集計に使用します。

---

## Prerequisites

```bash
# gh CLIの認証確認
gh auth status

# リポジトリ確認
gh repo view --json nameWithOwner -q '.nameWithOwner'
```

---

## Basic PR Retrieval

### All PRs

```bash
# 全状態のPR（デフォルト30件）
gh pr list --state all

# 件数指定
gh pr list --state all --limit 100

# JSON形式で詳細取得
gh pr list --state all --limit 100 --json number,title,state,author,createdAt,mergedAt,labels,additions,deletions,url
```

### By State

```bash
# オープン中
gh pr list --state open

# マージ済み
gh pr list --state merged

# クローズ（マージされずに閉じられた）
gh pr list --state closed
```

### With Specific Fields

```bash
# 基本フィールド
gh pr list --state all --json number,title,state,author

# 詳細フィールド
gh pr list --state all --json number,title,state,body,author,assignees,labels,createdAt,updatedAt,closedAt,mergedAt,mergedBy

# 変更統計
gh pr list --state merged --json number,title,additions,deletions,changedFiles

# レビュー情報
gh pr list --state merged --json number,title,reviews,reviewDecision,reviewRequests
```

---

## Available JSON Fields

| Field | Type | Description |
|-------|------|-------------|
| `number` | int | PR番号 |
| `title` | string | タイトル |
| `body` | string | 本文 |
| `state` | string | OPEN/CLOSED/MERGED |
| `author` | object | 作成者 {login, name} |
| `assignees` | array | アサインされた人 |
| `labels` | array | ラベル [{name, color}] |
| `createdAt` | datetime | 作成日時 |
| `updatedAt` | datetime | 更新日時 |
| `closedAt` | datetime | クローズ日時 |
| `mergedAt` | datetime | マージ日時 |
| `mergedBy` | object | マージした人 |
| `additions` | int | 追加行数 |
| `deletions` | int | 削除行数 |
| `changedFiles` | int | 変更ファイル数 |
| `url` | string | PR URL |
| `headRefName` | string | ブランチ名 |
| `baseRefName` | string | マージ先ブランチ |
| `isDraft` | bool | ドラフトかどうか |
| `reviews` | array | レビュー一覧 |
| `reviewDecision` | string | レビュー判定 |
| `reviewRequests` | array | レビューリクエスト |
| `milestone` | object | マイルストーン |
| `comments` | array | コメント一覧 |

---

## Filtered Retrieval

### By Author

```bash
# 特定ユーザーのPR
gh pr list --state all --author username

# 複数ユーザー（検索クエリ使用）
gh pr list --state all --search "author:user1 author:user2"
```

### By Label

```bash
# 単一ラベル
gh pr list --state all --label "bug"

# 複数ラベル（AND条件）
gh pr list --state all --label "bug" --label "priority:high"

# 検索クエリでOR条件
gh pr list --state all --search "label:bug label:enhancement"
```

### By Base Branch

```bash
# 特定ブランチへのPR
gh pr list --state all --base main

# developブランチへのPR
gh pr list --state all --base develop
```

### By Search Query

```bash
# マージ済み + 期間指定
gh pr list --search "is:merged merged:>=2024-01-01 merged:<=2024-01-31"

# 作成日で絞り込み
gh pr list --search "is:pr created:>=2024-01-01"

# タイトル検索
gh pr list --search "feat in:title"

# レビュー待ち
gh pr list --search "is:open review:required"

# ドラフトを除外
gh pr list --search "is:open -is:draft"
```

---

## Date Range Filtering with jq

gh CLIの`--search`は柔軟性に限界があるため、jqでの後処理を推奨。

### Cross-Platform Date Utilities

```bash
# クロスプラットフォーム日付取得関数
get_date_ago() {
  local days=$1
  if [[ "$OSTYPE" == "darwin"* ]]; then
    date -v-${days}d +%Y-%m-%d
  else
    date -d "${days} days ago" +%Y-%m-%d
  fi
}

# 使用例
START_DATE=$(get_date_ago 7)
gh pr list --state all --json number,title,createdAt | \
  jq --arg start "$START_DATE" '[.[] | select(.createdAt >= $start)]'
```

### This Week

```bash
# 今週作成されたPR（クロスプラットフォーム）
START_DATE=$([[ "$OSTYPE" == "darwin"* ]] && date -v-7d +%Y-%m-%d || date -d '7 days ago' +%Y-%m-%d)
gh pr list --state all --limit 200 --json number,title,state,author,createdAt,mergedAt | \
  jq --arg start "$START_DATE" '[.[] | select(.createdAt >= $start)]'

# macOS専用
gh pr list --state all --limit 200 --json number,title,state,author,createdAt,mergedAt | \
  jq --arg start "$(date -v-7d +%Y-%m-%d)" \
  '[.[] | select(.createdAt >= $start)]'

# Linux専用
gh pr list --state all --limit 200 --json number,title,state,author,createdAt,mergedAt | \
  jq --arg start "$(date -d '7 days ago' +%Y-%m-%d)" \
  '[.[] | select(.createdAt >= $start)]'
```

### This Month

```bash
# 今月作成されたPR
gh pr list --state all --limit 500 --json number,title,state,author,createdAt,mergedAt | \
  jq --arg start "$(date +%Y-%m-01)" \
  '[.[] | select(.createdAt >= $start)]'
```

### Custom Range

```bash
# 指定期間
gh pr list --state all --limit 500 --json number,title,state,author,createdAt,mergedAt | \
  jq --arg start "2024-01-01" --arg end "2024-01-31" \
  '[.[] | select(.createdAt >= $start and .createdAt <= $end)]'

# マージ日で絞り込み
gh pr list --state merged --limit 500 --json number,title,author,mergedAt | \
  jq --arg start "2024-01-01" --arg end "2024-01-31" \
  '[.[] | select(.mergedAt >= $start and .mergedAt <= $end)]'
```

---

## Statistics Aggregation

### Count by Author

```bash
gh pr list --state merged --limit 500 --json author | \
  jq 'group_by(.author.login) | map({author: .[0].author.login, count: length}) | sort_by(-.count)'
```

### Count by Label

```bash
gh pr list --state all --limit 500 --json labels | \
  jq '[.[].labels[].name] | group_by(.) | map({label: .[0], count: length}) | sort_by(-.count)'
```

### Changes by Author

```bash
gh pr list --state merged --limit 500 --json author,additions,deletions | \
  jq 'group_by(.author.login) | map({
    author: .[0].author.login,
    prs: length,
    additions: (map(.additions) | add),
    deletions: (map(.deletions) | add)
  }) | sort_by(-.prs)'
```

### PR Size Distribution

```bash
gh pr list --state merged --limit 500 --json number,additions,deletions | \
  jq 'map({
    number,
    total: (.additions + .deletions),
    size: (if (.additions + .deletions) < 50 then "XS"
           elif (.additions + .deletions) < 200 then "S"
           elif (.additions + .deletions) < 500 then "M"
           elif (.additions + .deletions) < 1000 then "L"
           else "XL" end)
  }) | group_by(.size) | map({size: .[0].size, count: length})'
```

### Weekly Trend

```bash
# 週ごとのマージ数
gh pr list --state merged --limit 500 --json mergedAt | \
  jq 'map({week: .mergedAt[0:10]}) | group_by(.week) | map({date: .[0].week, count: length}) | sort_by(.date)'
```

---

## Cross-Repository Operations

### Specify Repository

```bash
# 任意のリポジトリを指定
gh pr list -R owner/repo --state all --limit 50

# 組織の複数リポジトリ（ループ処理）
for repo in repo1 repo2 repo3; do
  echo "=== $repo ==="
  gh pr list -R org/$repo --state merged --limit 10
done
```

### Organization-Wide

```bash
# 組織の全リポジトリを列挙
gh repo list org --limit 100 --json name -q '.[].name'

# 組織全体のPR取得（GitHub Search API使用）
gh search prs --owner org --merged --json number,title,repository,author --limit 100
```

---

## Output Formatting

### Table Format (Default)

```bash
gh pr list --state merged --limit 10
```

### JSON to Table with jq

```bash
# カスタムテーブル出力
gh pr list --state merged --limit 10 --json number,title,author,mergedAt | \
  jq -r '.[] | [.number, .title[0:50], .author.login, .mergedAt[0:10]] | @tsv' | \
  column -t -s $'\t'
```

### Markdown Table

```bash
# Markdown形式の表
gh pr list --state merged --limit 10 --json number,title,author,mergedAt | \
  jq -r '"| # | Title | Author | Merged |", "|----|-------|--------|--------|", (.[] | "| \(.number) | \(.title[0:50]) | @\(.author.login) | \(.mergedAt[0:10]) |")'
```

### CSV Export

```bash
# CSV形式
gh pr list --state merged --limit 100 --json number,title,author,mergedAt,additions,deletions | \
  jq -r '["number","title","author","mergedAt","additions","deletions"], (.[] | [.number, .title, .author.login, .mergedAt, .additions, .deletions]) | @csv'
```

---

## Pagination (500件超の取得)

gh CLIの`--limit`は最大500件。それ以上のPRを取得するにはページネーションが必要。

### GraphQL Cursor Pagination

```bash
# 全PRを取得（ページネーション対応）
fetch_all_prs() {
  local repo=${1:-$(gh repo view --json nameWithOwner -q '.nameWithOwner')}
  local all_prs="[]"
  local cursor=""
  local has_next=true

  while $has_next; do
    local query='
    query($owner: String!, $repo: String!, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        pullRequests(first: 100, after: $cursor, states: [MERGED]) {
          pageInfo { hasNextPage endCursor }
          nodes {
            number title
            author { login }
            createdAt mergedAt
            additions deletions changedFiles
          }
        }
      }
    }'

    local owner=$(echo "$repo" | cut -d'/' -f1)
    local name=$(echo "$repo" | cut -d'/' -f2)

    local result=$(gh api graphql -f query="$query" \
      -f owner="$owner" -f repo="$name" -f cursor="$cursor")

    local prs=$(echo "$result" | jq '.data.repository.pullRequests.nodes')
    all_prs=$(echo "$all_prs $prs" | jq -s 'add')

    has_next=$(echo "$result" | jq -r '.data.repository.pullRequests.pageInfo.hasNextPage')
    cursor=$(echo "$result" | jq -r '.data.repository.pullRequests.pageInfo.endCursor')
  done

  echo "$all_prs"
}

# 使用例
fetch_all_prs "owner/repo" > all-prs.json
```

### Simple Loop Method

```bash
# 簡易版: REST APIでページネーション
PAGE=1
ALL_PRS="[]"
while true; do
  PRS=$(gh api "repos/{owner}/{repo}/pulls?state=all&per_page=100&page=$PAGE" 2>/dev/null)
  COUNT=$(echo "$PRS" | jq 'length')
  [ "$COUNT" -eq 0 ] && break
  ALL_PRS=$(echo "$ALL_PRS $PRS" | jq -s 'add')
  ((PAGE++))
done
echo "$ALL_PRS" | jq 'length'
```

---

## Cycle Time Analysis (サイクルタイム分析)

PR作成からマージまでの時間を分析。チームのパフォーマンス指標として重要。

### Basic Cycle Time

```bash
# サイクルタイム計算（時間単位）
gh pr list --state merged --limit 100 \
  --json number,title,createdAt,mergedAt | \
  jq 'map({
    number,
    title: .title[0:50],
    created: .createdAt,
    merged: .mergedAt,
    cycle_hours: (((.mergedAt | fromdateiso8601) - (.createdAt | fromdateiso8601)) / 3600 | floor)
  })'
```

### Cycle Time Statistics

```bash
# サイクルタイム統計
gh pr list --state merged --limit 200 \
  --json number,createdAt,mergedAt | \
  jq '{
    count: length,
    avg_hours: ([.[] | ((.mergedAt | fromdateiso8601) - (.createdAt | fromdateiso8601)) / 3600] | add / length | floor),
    min_hours: ([.[] | ((.mergedAt | fromdateiso8601) - (.createdAt | fromdateiso8601)) / 3600] | min | floor),
    max_hours: ([.[] | ((.mergedAt | fromdateiso8601) - (.createdAt | fromdateiso8601)) / 3600] | max | floor),
    median_hours: (sort_by(((.mergedAt | fromdateiso8601) - (.createdAt | fromdateiso8601))) | .[length/2] | ((.mergedAt | fromdateiso8601) - (.createdAt | fromdateiso8601)) / 3600 | floor)
  }'
```

### Cycle Time by Size

```bash
# PRサイズ別サイクルタイム
gh pr list --state merged --limit 200 \
  --json number,createdAt,mergedAt,additions,deletions | \
  jq 'map({
    size: (if (.additions + .deletions) < 50 then "XS"
           elif (.additions + .deletions) < 200 then "S"
           elif (.additions + .deletions) < 500 then "M"
           elif (.additions + .deletions) < 1000 then "L"
           else "XL" end),
    hours: ((.mergedAt | fromdateiso8601) - (.createdAt | fromdateiso8601)) / 3600
  }) | group_by(.size) | map({
    size: .[0].size,
    count: length,
    avg_hours: ([.[].hours] | add / length | floor)
  })'
```

### Weekly Trend

```bash
# 週ごとのサイクルタイム推移
gh pr list --state merged --limit 300 \
  --json mergedAt,createdAt | \
  jq 'map({
    week: .mergedAt[0:10],
    hours: ((.mergedAt | fromdateiso8601) - (.createdAt | fromdateiso8601)) / 3600
  }) | group_by(.week) | map({
    week: .[0].week,
    prs: length,
    avg_hours: ([.[].hours] | add / length | floor)
  }) | sort_by(.week)'
```

---

## Retry Logic and Error Handling

Robust patterns for reliable data collection. See also: `references/error-handling.md`

### Exponential Backoff Retry

```bash
# Retry with exponential backoff
gh_retry() {
  local max_attempts=${1:-3}
  local base_delay=${2:-5}
  shift 2
  local cmd="$@"

  local attempt=1
  while [ $attempt -le $max_attempts ]; do
    local result
    result=$(eval "$cmd" 2>&1)
    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
      echo "$result"
      return 0
    fi

    # Check for non-recoverable errors
    if echo "$result" | grep -qE "404|not found|does not exist"; then
      echo "ERROR: Resource not found (non-recoverable)" >&2
      return 1
    fi

    if [ $attempt -lt $max_attempts ]; then
      local delay=$((base_delay * (2 ** (attempt - 1))))
      echo "Attempt $attempt failed, retrying in ${delay}s..." >&2
      sleep $delay
    fi

    ((attempt++))
  done

  echo "ERROR: All $max_attempts attempts failed" >&2
  return 1
}

# Usage
gh_retry 3 5 "gh pr list --state merged --limit 100 --json number,title"
```

### Rate-Limit Aware Execution

```bash
# Execute with rate limit awareness
gh_with_rate_limit() {
  local cmd="$@"

  # Pre-check rate limit
  local remaining=$(gh api rate_limit --jq '.resources.core.remaining' 2>/dev/null || echo "5000")

  if [ "$remaining" -lt 50 ]; then
    local reset=$(gh api rate_limit --jq '.resources.core.reset' 2>/dev/null)
    local now=$(date +%s)
    local wait=$((reset - now + 5))

    if [ $wait -gt 0 ] && [ $wait -lt 3600 ]; then
      echo "Rate limit low ($remaining), waiting ${wait}s for reset..." >&2
      sleep $wait
    fi
  fi

  # Execute command
  local result
  result=$(eval "$cmd" 2>&1)
  local exit_code=$?

  # Handle rate limit error in response
  if echo "$result" | grep -q "rate limit"; then
    echo "Hit rate limit, waiting 60s..." >&2
    sleep 60
    result=$(eval "$cmd" 2>&1)
    exit_code=$?
  fi

  echo "$result"
  return $exit_code
}

# Usage
gh_with_rate_limit "gh pr list --state all --limit 200 --json number,title"
```

### Timeout Wrapper

```bash
# Execute with timeout (cross-platform)
gh_with_timeout() {
  local timeout_sec=${1:-60}
  shift
  local cmd="$@"

  if command -v timeout &>/dev/null; then
    # GNU timeout (Linux)
    timeout "$timeout_sec" bash -c "$cmd"
  elif command -v gtimeout &>/dev/null; then
    # GNU timeout via Homebrew (macOS)
    gtimeout "$timeout_sec" bash -c "$cmd"
  else
    # Perl fallback (macOS)
    perl -e 'alarm shift @ARGV; exec @ARGV' "$timeout_sec" bash -c "$cmd"
  fi

  local exit_code=$?
  if [ $exit_code -eq 124 ]; then
    echo "ERROR: Command timed out after ${timeout_sec}s" >&2
  fi
  return $exit_code
}

# Usage: 30 second timeout
gh_with_timeout 30 "gh pr list --state all --limit 500 --json number,title"
```

### Combined Robust Fetch

```bash
# Production-ready PR fetch with all safeguards
fetch_prs_robust() {
  local repo="${1:-}"
  local state="${2:-all}"
  local limit="${3:-100}"

  local repo_flag=""
  [ -n "$repo" ] && repo_flag="-R $repo"

  # Build command
  local cmd="gh pr list $repo_flag --state $state --limit $limit --json number,title,state,author,createdAt,mergedAt,additions,deletions"

  # Execute with rate limit check and retry
  gh_with_rate_limit "gh_retry 3 5 \"$cmd\""
}

# Usage
fetch_prs_robust "org/project" "merged" 200
```

### Graceful Degradation

```bash
# Fetch with field fallback
fetch_prs_with_fallback() {
  local repo="${1:-}"
  local state="${2:-all}"
  local limit="${3:-100}"

  local repo_flag=""
  [ -n "$repo" ] && repo_flag="-R $repo"

  # Try full fields first
  local full_fields="number,title,state,author,createdAt,mergedAt,additions,deletions,labels,changedFiles"
  local result
  result=$(gh pr list $repo_flag --state "$state" --limit "$limit" --json "$full_fields" 2>&1)

  if [ $? -eq 0 ]; then
    echo "$result"
    return 0
  fi

  echo "Full field fetch failed, trying minimal fields..." >&2

  # Fallback to minimal fields
  local min_fields="number,title,state,author"
  result=$(gh pr list $repo_flag --state "$state" --limit "$limit" --json "$min_fields" 2>&1)

  if [ $? -eq 0 ]; then
    echo "WARNING: Retrieved partial data (missing: additions, deletions, dates)" >&2
    echo "$result"
    return 0
  fi

  echo "ERROR: Even minimal fetch failed" >&2
  return 1
}
```

---

## Troubleshooting

### Rate Limiting

```bash
# API rate limit check
gh api rate_limit --jq '.resources.core'

# Result: {"limit":5000,"remaining":4823,"reset":1704067200}

# Wait if low
check_rate_limit() {
  local remaining=$(gh api rate_limit --jq '.resources.core.remaining')
  if [ "$remaining" -lt 100 ]; then
    echo "Rate limit low ($remaining). Waiting..."
    sleep 60
  fi
}
```

### Large Result Sets

```bash
# 件数確認
gh pr list --state all --limit 1 --json number | gh api graphql -f query='
  query($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      pullRequests { totalCount }
    }
  }' -f owner=OWNER -f repo=REPO --jq '.data.repository.pullRequests.totalCount'

# 500件以上の場合はページネーションセクション参照
```

### Date Parsing Issues

```bash
# jqで日付を扱う際の注意
# GitHubのdatetimeは ISO 8601 形式: "2024-01-15T10:30:00Z"

# 日付部分のみ抽出
jq '.[] | .createdAt[0:10]'

# 比較は文字列として実施可能
jq 'select(.createdAt >= "2024-01-01")'
```

---

## Common Recipes

### Weekly Report Data

```bash
# 今週のサマリーデータ取得
gh pr list --state all --limit 200 --json number,title,state,author,createdAt,mergedAt,labels,additions,deletions | \
  jq --arg start "$(date -v-7d +%Y-%m-%d)" '
    [.[] | select(.createdAt >= $start)] |
    {
      total: length,
      merged: [.[] | select(.state == "MERGED")] | length,
      open: [.[] | select(.state == "OPEN")] | length,
      closed: [.[] | select(.state == "CLOSED")] | length,
      additions: [.[].additions] | add,
      deletions: [.[].deletions] | add,
      authors: [.[].author.login] | unique | length
    }
  '
```

### Release Notes Data

```bash
# 2つのタグ間のPR取得
gh pr list --state merged --search "merged:>=2024-01-01 merged:<=2024-01-31" --limit 200 \
  --json number,title,author,labels,mergedAt | \
  jq 'group_by(.labels[0].name // "other") | map({category: .[0].labels[0].name // "other", prs: .})'
```

### Individual Contributor Report

```bash
# 特定ユーザーの活動
gh pr list --state all --author username --limit 100 \
  --json number,title,state,createdAt,mergedAt,additions,deletions | \
  jq '{
    total: length,
    merged: [.[] | select(.state == "MERGED")] | length,
    open: [.[] | select(.state == "OPEN")] | length,
    additions: [.[].additions // 0] | add,
    deletions: [.[].deletions // 0] | add,
    prs: .
  }'
```

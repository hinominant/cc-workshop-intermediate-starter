# Chrome Automation

Browser Use CLI 2.0 を使ったブラウザ操作の自動化（CDP直接接続）。
Playwright MCP はフォールバックとして利用。

## タスク

$ARGUMENTS

## ツール選択

| ツール | 用途 | 優先度 |
|--------|------|--------|
| **Browser Use CLI** | タスク遂行・データ収集・フォーム操作 | PRIMARY |
| **Playwright MCP** | E2Eテスト・Visual Regression・動画撮影 | FALLBACK |

Browser Use CLI が利用可能か確認:

```bash
browser-use doctor
```

利用不可の場合、Playwright にフォールバック:

```bash
npx playwright --version
```

## Browser Use CLI 操作パターン（推奨）

### ページアクセスと状態確認

```bash
# ページを開く
browser-use open https://example.com

# 状態を確認（クリック可能要素のインデックス一覧）
browser-use state

# スクリーンショット
browser-use screenshot ./screenshot.png
```

### 要素の操作

```bash
# クリック（インデックス指定）
browser-use click 5

# テキスト入力
browser-use type "user@example.com"

# JavaScript 実行
browser-use eval "document.querySelector('#submit').click()"
```

### 既存Chromeセッションの活用（ログイン状態引継ぎ）

```bash
# 既存の Chrome に接続
browser-use --connect open https://example.com

# ユーザープロファイル付きで起動
browser-use --profile "Default" open https://example.com

# 有頭モード（ブラウザウィンドウ表示）
browser-use --headed open https://example.com
```

### データ収集

```bash
# ページの状態取得（DOM要素一覧）
browser-use state

# JavaScript でデータ抽出
browser-use eval "JSON.stringify([...document.querySelectorAll('tr')].map(r => [...r.querySelectorAll('td')].map(td => td.textContent)))"
```

## Playwright フォールバック操作

Browser Use CLI が利用不可の場合のみ使用。

### セットアップ

```bash
npm init -y 2>/dev/null
npx playwright install chromium
```

### ブラウザ起動

```javascript
const { chromium } = require('playwright');

// 通常モード（ヘッドレス）
const browser = await chromium.launch();

// デバッグ時（ブラウザ表示あり）
const browser = await chromium.launch({ headless: false });

// 既存のログインセッションを活用
const context = await chromium.launchPersistentContext(
  '/Users/' + process.env.USER + '/Library/Application Support/Google/Chrome/Default',
  { headless: false, channel: 'chrome' }
);
```

### 操作パターン

```javascript
const page = await context.newPage();
await page.goto('https://example.com');
await page.waitForLoadState('networkidle');
await page.screenshot({ path: 'screenshot.png', fullPage: true });

// クリック
await page.click('button#submit');

// テキスト入力
await page.fill('input[name="email"]', 'user@example.com');

// テキスト取得
const text = await page.textContent('.target');

// テーブルデータの取得
const rows = await page.$$eval('table tr', rows =>
  rows.map(row => [...row.querySelectorAll('td')].map(td => td.textContent))
);

await browser.close();
```

## 実行プロトコル

### Step 1: ツール選択

1. `browser-use doctor` で Browser Use CLI の利用可否を確認
2. 利用可能 → Browser Use CLI で実行
3. 利用不可 → Playwright MCP / Playwright スクリプトにフォールバック

### Step 2: 操作計画

タスクを段階的なステップに分解する:

1. どのURLにアクセスするか
2. どの要素を操作するか
3. 何を取得・確認するか
4. 各ステップの期待結果

### Step 3: 段階的実行

各ステップで:

1. 操作を実行する
2. `browser-use state` またはスクリーンショットで状態を確認する
3. 期待通りか判断する
4. 問題があれば修正して再実行

### Step 4: クリーンアップ

```bash
browser-use close
```

## ルール

- 各操作後に状態を確認する（盲目的に操作しない）
- ログイン情報をコードにハードコードしない
- 既存のブラウザセッションを活用できる場合は `--connect` を使う
- レート制限を意識する（連続リクエストの間に適切な待機を入れる）
- 取得したデータは構造化して出力する

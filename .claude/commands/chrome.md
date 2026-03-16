# Chrome Automation

Playwright を使ったブラウザ操作の自動化。
段階的に操作を実行し、各ステップでスクリーンショットを取得して確認する。

## タスク

$ARGUMENTS

## セットアップ

### Playwright の確認

まず Playwright が利用可能か確認する:

```bash
npx playwright --version
```

インストールされていない場合:

```bash
npm init -y 2>/dev/null
npx playwright install chromium
```

### ブラウザ起動オプション

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

## 操作パターン

### ページ読み込みとスクリーンショット

```javascript
const page = await context.newPage();
await page.goto('https://example.com');
await page.waitForLoadState('networkidle');
await page.screenshot({ path: 'screenshot.png', fullPage: true });
```

### 要素の操作

```javascript
// クリック
await page.click('button#submit');

// テキスト入力
await page.fill('input[name="email"]', 'user@example.com');

// セレクトボックス
await page.selectOption('select#country', 'JP');

// チェックボックス
await page.check('input[type="checkbox"]');

// 要素の待機
await page.waitForSelector('.result', { state: 'visible' });
```

### データ収集

```javascript
// テキスト取得
const text = await page.textContent('.target');

// 複数要素の取得
const items = await page.$$eval('.list-item', els => els.map(el => el.textContent));

// テーブルデータの取得
const rows = await page.$$eval('table tr', rows =>
  rows.map(row => [...row.querySelectorAll('td')].map(td => td.textContent))
);
```

## 実行プロトコル

### Step 1: 操作計画

タスクを段階的なステップに分解する:

1. どのURLにアクセスするか
2. どの要素を操作するか
3. 何を取得・確認するか
4. 各ステップの期待結果

### Step 2: 段階的実行

各ステップで:

1. 操作を実行する
2. スクリーンショットを取得する
3. スクリーンショットを確認して期待通りか判断する
4. 問題があれば修正して再実行

スクリーンショットの確認は Read ツールで画像ファイルを読み取って行う。

### Step 3: エラーハンドリング

- タイムアウト: `waitForSelector` にタイムアウトを設定（デフォルト 30秒）
- 要素が見つからない: セレクターを再確認、ページの状態をスクリーンショットで確認
- ナビゲーションエラー: URL を確認、ネットワーク状態を確認
- 認証エラー: 既存セッションの活用を検討

### Step 4: クリーンアップ

```javascript
await browser.close();
```

## ルール

- 各操作後にスクリーンショットで状態を確認する（盲目的に操作しない）
- ログイン情報をコードにハードコードしない
- 既存のブラウザセッションを活用できる場合は活用する
- レート制限を意識する（連続リクエストの間に適切な待機を入れる）
- 取得したデータは構造化して出力する

# セキュリティガイド

AI を活用した開発におけるセキュリティの基礎知識と、EOS ワークショップで守るべきルールをまとめています。

---

## なぜ AI 支援開発でセキュリティが重要か

AI コーディングアシスタントは生産性を大幅に向上させる一方で、セキュリティリスクも伴います:

- AI が生成したコードの **40% にセキュリティ脆弱性が含まれる**（Veracode 2024 調査）
- AI との対話ログは**クラウドに送信される**ため、秘密情報の漏洩リスクがある
- AI は「動くコード」を優先しがちで、セキュリティのベストプラクティスを省略することがある

このワークショップでは、**安全に AI を活用するスキル**を身につけます。

---

## DCP（Double Confirmation Protocol）

操作のリスクに応じた3段階の安全確認プロトコルです。

### Tier 1: 絶対禁止（L4 即時停止）

**いかなる理由があっても実行してはいけない操作。**

| ❌ やってはいけないこと | ✅ 安全な代替手段 |
|----------------------|-----------------|
| チャットに API キーを貼り付ける | `.env` ファイルに直接手入力する |
| `.env` に AI で値を書き込む | `.env.example` をコピーし、手動で値を設定 |
| コードに秘密情報をハードコード | `process.env.KEY_NAME` で読み込む |

**なぜ危険か:**
- AI との対話は Anthropic サーバーに送信されるため、秘密情報が永続的に記録される
- Git 履歴に秘密情報が入ると、リポジトリを公開した瞬間に漏洩する
- 漏洩した API キーは数分以内に不正利用される（自動スキャンボットが存在）

### Tier 2: 確認必要（ask）

実行前にユーザーの確認が必要な操作。

| 操作 | 確認理由 |
|-----|---------|
| `git add` / `git commit` | 意図しないファイル（.env 等）の混入防止 |
| `npm install` | 悪意あるパッケージのインストール防止 |
| ファイル作成・編集 | 既存コードへの意図しない変更防止 |

### Tier 3: 通常操作（allow）

確認なしで実行できる安全な操作。

- ファイル読み取り（Read, Glob, Grep）
- `git status` / `git diff` / `git log`
- `npm test` / `npm run typecheck`

---

## settings.json の仕組み

`.claude/settings.json` は DCP を**技術的に強制**するファイルです。

```json
{
  "permissions": {
    "allow": [...],   // Tier 3: 確認なしで実行
    "ask": [...],     // Tier 2: 確認ダイアログを表示
    "deny": [...]     // Tier 1 + 破壊的操作: 実行を拒否
  }
}
```

### deny に含まれる主な操作

| 操作 | 理由 |
|-----|------|
| `curl` / `wget` | 外部通信による情報漏洩防止 |
| `rm -rf` | 不可逆なファイル削除防止 |
| `git push` | 意図しない公開防止 |
| `git reset --hard` | 作業内容の消失防止 |
| `.env` の Read/Write/Edit | 秘密情報へのアクセス防止 |
| `WebFetch` | 外部コンテンツの取得防止 |

---

## EOS 固有のセキュリティパターン

### 1. HMAC-SHA256 署名検証

外部からの Webhook リクエストが正当な送信元からのものか検証する。

```typescript
import { createHmac, timingSafeEqual } from "node:crypto";

// ✅ 正しい: timingSafeEqual でタイミング攻撃を防止
const expected = createHmac("sha256", secret)
  .update(payload)
  .digest("hex");
const a = Buffer.from(signature, "hex");
const b = Buffer.from(expected, "hex");
return a.length === b.length && timingSafeEqual(a, b);

// ❌ 危険: === 比較はタイミング攻撃に脆弱
return signature === expected;
```

### 2. PII マスキング

ログに個人情報を出力しない。

```typescript
// ✅ 正しい: ログ出力前にマスク
logEvent("info", "Event processed", { email: maskPII(user.email) });

// ❌ 危険: 個人情報がそのままログに残る
logEvent("info", "Event processed", { email: user.email });
```

### 3. 監査ログ

セキュリティ関連の操作を追跡可能にする。

```typescript
recordAudit({
  action: "webhook_verify",
  actor: "system",
  resource: `/webhook/${event.event_id}`,
  result: "success",
});
```

### 4. 入力検証

外部からの入力は信頼しない。

```typescript
// ✅ 正しい: 型チェック + 必須フィールド検証
if (!body || typeof body !== "string") {
  return c.json({ error: "Invalid request body" }, 400);
}

// ❌ 危険: 検証なしで処理
const event = JSON.parse(body);
```

---

## Sentinel 監査チェックリスト

Step 7 で Sentinel が確認する項目の全一覧:

1. **Secrets**: `.env` が `.gitignore` に含まれ、コードにハードコードがない
2. **署名検証**: HMAC-SHA256 + timingSafeEqual + タイムスタンプ検証
3. **PII 保護**: ログ・エラーメッセージに個人情報が含まれない
4. **監査ログ**: セキュリティ操作が記録されている
5. **入力検証**: 外部入力に対する型・形式チェック
6. **依存パッケージ**: 既知の脆弱性がない

---

## まとめ

| 原則 | 内容 |
|------|------|
| 秘密は環境変数 | コード・チャット・ログに秘密情報を含めない |
| 入力を信頼しない | 外部からのデータは必ず検証する |
| 比較は安全に | `timingSafeEqual` を使う。`===` は使わない |
| ログは安全に | PII はマスクしてから出力 |
| 操作は追跡可能に | 監査ログでセキュリティ操作を記録 |

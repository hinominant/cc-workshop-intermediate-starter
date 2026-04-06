# OWASP Top 10 (2021) Checklist

Sentinelが静的分析で使用するOWASP Top 10チェックリスト。各カテゴリにコードパターン、検出方法、修正例を記載。

---

## Quick-Check Table

| カテゴリ | grepパターン | 対象ファイル |
|----------|-------------|-------------|
| A01 Access Control | `@Public`, `role`, `isAdmin`, `middleware`, `.policy` | routes, middleware, API handlers |
| A02 Crypto | `MD5`, `SHA1`, `createCipher`, `Math.random`, `password` | auth, crypto, utils |
| A03 Injection | `${}` in query, `eval(`, `exec(`, `innerHTML`, `raw(` | DB queries, templates, shell |
| A04 Insecure Design | `rateLimit`, `lockout`, `captcha` (absence of) | auth, API config |
| A05 Misconfiguration | `debug: true`, `CORS`, `helmet`, `X-Powered-By` | config, server setup |
| A06 Vulnerable Deps | `package.json`, `package-lock.json` | dependency files |
| A07 Auth Failures | `jwt`, `session`, `cookie`, `bcrypt`, `password` | auth modules |
| A08 Data Integrity | `deserialize`, `JSON.parse`, `eval(`, `pickle` | data processing |
| A09 Logging | `console.log`, `logger`, `audit`, `password` in logs | logging, error handlers |
| A10 SSRF | `fetch(`, `axios(`, `http.get(`, `url` from user input | API clients, proxy |

---

## A01: Broken Access Control

認証済みユーザーが権限外のリソースにアクセスできる脆弱性。

### チェックポイント
- [ ] 全APIルートに認証ミドルウェアが適用されているか
- [ ] リソースアクセスに所有権チェック (ownership check) があるか
- [ ] IDOR (Insecure Direct Object Reference) が防止されているか
- [ ] ディレクトリトラバーサルが防止されているか
- [ ] CORS が適切に設定されているか
- [ ] HTTP メソッドの制限が設定されているか

### 脆弱なコード / 安全なコード

```typescript
// ❌ IDOR - ユーザーIDをリクエストから直接使用
app.get("/api/users/:id/profile", async (req, res) => {
  const profile = await db.getUserProfile(req.params.id);
  res.json(profile);
});

// ✅ 所有権チェック付き
app.get("/api/users/:id/profile", authenticate, async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  const profile = await db.getUserProfile(req.params.id);
  res.json(profile);
});
```

```typescript
// ❌ パストラバーサル
app.get("/api/files/:filename", (req, res) => {
  res.sendFile(path.join("/uploads", req.params.filename));
});

// ✅ パス正規化 + ディレクトリ制限
app.get("/api/files/:filename", (req, res) => {
  const safeName = path.basename(req.params.filename);
  const filePath = path.join("/uploads", safeName);
  if (!filePath.startsWith("/uploads/")) return res.status(400).send("Invalid");
  res.sendFile(filePath);
});
```

---

## A02: Cryptographic Failures

機密データの暗号化が不十分、または暗号アルゴリズムが脆弱。

### チェックポイント
- [ ] パスワードが bcrypt/scrypt/argon2 でハッシュされているか
- [ ] MD5/SHA1 がパスワードハッシュに使われていないか
- [ ] 暗号鍵がソースコードにハードコードされていないか
- [ ] TLS が強制されているか (HTTP → HTTPS リダイレクト)
- [ ] 機密データがログに出力されていないか
- [ ] `Math.random()` がセキュリティ用途に使われていないか

```typescript
// ❌ MD5でパスワードハッシュ
const hash = crypto.createHash("md5").update(password).digest("hex");

// ✅ bcryptでハッシュ
const hash = await bcrypt.hash(password, 12);
```

```typescript
// ❌ Math.random でトークン生成
const token = Math.random().toString(36).substring(2);

// ✅ crypto.randomBytes
const token = crypto.randomBytes(32).toString("hex");
```

---

## A03: Injection

ユーザー入力がそのままクエリやコマンドに組み込まれる。

### チェックポイント
- [ ] SQL クエリがパラメータ化されているか
- [ ] NoSQL クエリに演算子インジェクションがないか
- [ ] OS コマンド実行にユーザー入力が含まれていないか
- [ ] HTML 出力がエスケープされているか (XSS)
- [ ] LDAP/XPath クエリにユーザー入力が直接含まれていないか

```typescript
// ❌ SQL Injection
const result = await db.query(`SELECT * FROM users WHERE id = '${userId}'`);

// ✅ Parameterized query
const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
```

```typescript
// ❌ Command Injection
const output = execSync(`convert ${req.body.filename} output.png`);

// ✅ 引数を配列で渡す
const output = execFileSync("convert", [sanitizedFilename, "output.png"]);
```

```typescript
// ❌ XSS via dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userComment }} />

// ✅ DOMPurify でサニタイズ
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userComment) }} />
```

```typescript
// ❌ NoSQL Injection (MongoDB)
db.users.find({ username: req.body.username, password: req.body.password });
// 攻撃: { "username": "admin", "password": { "$gt": "" } }

// ✅ 型チェック + サニタイズ
const username = String(req.body.username);
const password = String(req.body.password);
const hashedPassword = await getHashedPassword(username);
const valid = await bcrypt.compare(password, hashedPassword);
```

---

## A04: Insecure Design

アーキテクチャレベルの設計不備。コードレベルの修正では根本解決できない。

### チェックポイント
- [ ] レート制限が実装されているか (特にログイン、API)
- [ ] アカウントロックアウト機能があるか
- [ ] ビジネスロジックにバリデーションがあるか (負の数量、不正な状態遷移)
- [ ] 機密操作に再認証が必要か
- [ ] Threat modeling が実施されているか

```typescript
// ❌ レート制限なし
app.post("/api/login", async (req, res) => {
  const user = await authenticate(req.body);
  // ブルートフォース攻撃に対して無防備
});

// ✅ レート制限付き
import rateLimit from "express-rate-limit";
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts. Try again later.",
});
app.post("/api/login", loginLimiter, async (req, res) => {
  const user = await authenticate(req.body);
});
```

---

## A05: Security Misconfiguration

デフォルト設定、不要な機能の有効化、不適切なエラーハンドリング。

### チェックポイント
- [ ] デバッグモードが本番で無効か
- [ ] デフォルトのアカウント/パスワードが変更されているか
- [ ] 不要なHTTPメソッドが無効か
- [ ] セキュリティヘッダーが設定されているか (Helmet)
- [ ] エラーメッセージにスタックトレースが含まれていないか
- [ ] ディレクトリリスティングが無効か

```typescript
// ❌ スタックトレース漏洩
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack });
});

// ✅ 本番環境では詳細を隠す
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
});
```

```typescript
// ❌ CORS ワイルドカード
app.use(cors({ origin: "*" }));

// ✅ 明示的なオリジン指定
app.use(cors({
  origin: ["https://app.example.com"],
  credentials: true,
}));
```

---

## A06: Vulnerable and Outdated Components

既知の脆弱性を持つ依存パッケージの使用。

### チェックポイント
- [ ] `npm audit` / `yarn audit` の結果に Critical/High がないか
- [ ] lock ファイルが最新か
- [ ] 使われていない依存パッケージがないか
- [ ] 依存パッケージのライセンスが確認されているか

```bash
# 脆弱性チェック
npm audit --production
npx audit-ci --critical

# 使われていない依存パッケージの検出
npx depcheck
```

---

## A07: Identification and Authentication Failures

認証メカニズムの不備。

### チェックポイント
- [ ] パスワードの最小長が8文字以上か
- [ ] bcrypt/scrypt/argon2 でハッシュされているか
- [ ] セッションIDが十分にランダムか
- [ ] ログイン失敗後にセッションが再生成されるか
- [ ] JWT に有効期限が設定されているか
- [ ] リフレッシュトークンのローテーションがあるか

```typescript
// ❌ JWT に有効期限なし
const token = jwt.sign({ userId: user.id }, SECRET);

// ✅ 有効期限付き
const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });
```

```typescript
// ❌ セッション固定攻撃に脆弱
app.post("/login", (req, res) => {
  req.session.userId = user.id; // 既存セッションIDを再利用
});

// ✅ ログイン成功後にセッション再生成
app.post("/login", (req, res) => {
  req.session.regenerate((err) => {
    req.session.userId = user.id;
    res.redirect("/dashboard");
  });
});
```

---

## A08: Software and Data Integrity Failures

CI/CDパイプラインの整合性、デシリアライゼーション攻撃。

### チェックポイント
- [ ] CI/CDパイプラインでコードレビューが必須か
- [ ] 依存パッケージの整合性検証 (lock ファイル) があるか
- [ ] ユーザー入力のデシリアライゼーションが安全か
- [ ] 自動アップデートが署名検証付きか

```typescript
// ❌ 安全でないデシリアライゼーション
const data = JSON.parse(req.body.serializedData);
processObject(data); // data の構造を信頼

// ✅ Zod でスキーマバリデーション
import { z } from "zod";
const DataSchema = z.object({
  name: z.string().max(100),
  age: z.number().int().positive(),
});
const data = DataSchema.parse(JSON.parse(req.body.serializedData));
processObject(data);
```

---

## A09: Security Logging and Monitoring Failures

セキュリティイベントのログが不十分。

### チェックポイント
- [ ] ログイン成功/失敗がログに記録されているか
- [ ] アクセス制御の失敗がログに記録されているか
- [ ] パスワードやトークンがログに含まれていないか
- [ ] ログが改ざん防止されているか
- [ ] アラートが設定されているか

```typescript
// ❌ パスワードがログに含まれる
logger.info("Login attempt", { username, password });

// ✅ 機密情報を除外
logger.info("Login attempt", { username, success: false, ip: req.ip });
```

### 記録すべきイベント
- 認証の成功/失敗
- 認可の失敗 (403)
- 入力バリデーションの失敗
- サーバーエラー (5xx)
- 管理者操作 (ユーザー作成、権限変更)

---

## A10: Server-Side Request Forgery (SSRF)

サーバーが攻撃者の指定したURLにリクエストを送信する。

### チェックポイント
- [ ] ユーザー入力のURLをそのまま fetch/axios に渡していないか
- [ ] 内部ネットワークへのアクセスがブロックされているか
- [ ] URLのスキーム (http/https) が制限されているか
- [ ] リダイレクトが制限されているか

```typescript
// ❌ SSRF - ユーザー指定URLに直接リクエスト
app.post("/api/fetch-url", async (req, res) => {
  const response = await fetch(req.body.url);
  // 攻撃: url = "http://169.254.169.254/latest/meta-data/" (AWS metadata)
  res.json(await response.json());
});

// ✅ URLバリデーション + 許可リスト
import { URL } from "url";
const ALLOWED_HOSTS = new Set(["api.example.com", "cdn.example.com"]);

app.post("/api/fetch-url", async (req, res) => {
  const parsed = new URL(req.body.url);
  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return res.status(400).json({ error: "URL not allowed" });
  }
  if (!["https:"].includes(parsed.protocol)) {
    return res.status(400).json({ error: "Only HTTPS allowed" });
  }
  const response = await fetch(parsed.toString());
  res.json(await response.json());
});
```

# Secure Coding Guidelines

Sentinelがコードレビュー・脆弱性報告時に参照するセキュアコーディングガイドライン。修正指示にこのガイドラインのパターンを引用する。

---

## 1. Input Validation (入力バリデーション)

**原則: ホワイトリスト > ブラックリスト。全てのユーザー入力は敵意あるものとして扱う。**

### Zod スキーマによるバリデーション

```typescript
import { z } from "zod";

// 文字列: 長さ制限 + パターン
const UsernameSchema = z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/);

// 数値: 範囲制限
const AgeSchema = z.number().int().min(0).max(150);

// オブジェクト: 必須フィールド + オプション
const CreateUserSchema = z.object({
  username: UsernameSchema,
  email: z.string().email(),
  age: AgeSchema.optional(),
  role: z.enum(["user", "editor"]), // admin は選択肢に含めない
});

// 配列: 最大要素数
const ItemsSchema = z.array(z.string()).max(100);

// API ハンドラでの使用
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ errors: parsed.error.flatten() }, { status: 400 });
  }
  // parsed.data は型安全かつバリデーション済み
}
```

### バリデーションルール
- **文字列**: 最大長を必ず設定 (DoS防止)
- **数値**: 範囲を設定 (整数なら `.int()`)
- **配列**: `.max()` で要素数制限
- **ファイルアップロード**: サイズ制限 + MIMEタイプ検証 + 拡張子チェック
- **URL**: `new URL()` でパース + スキーム制限 (`https:` のみ)
- **ID**: UUID フォーマット検証 (`z.string().uuid()`)

---

## 2. Output Encoding (出力エンコーディング)

**原則: 出力先のコンテキストに応じたエスケープを適用する。**

| コンテキスト | エンコーディング | 例 |
|-------------|-----------------|-----|
| HTML本文 | HTMLエンティティ | `<` → `&lt;` |
| HTML属性 | HTMLエンティティ + クォート | `"` → `&quot;` |
| JavaScript | JSエスケープ | `'` → `\'` |
| URL | URLエンコード | ` ` → `%20` |
| CSS | CSSエスケープ | `\` → `\\` |

```typescript
// React は自動でHTMLエスケープする（安全）
<p>{userInput}</p>

// ❌ dangerouslySetInnerHTML はエスケープをバイパス
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// URL パラメータ
const safeUrl = `https://example.com/search?q=${encodeURIComponent(userQuery)}`;
```

---

## 3. Authentication (認証)

### パスワードハッシュ

```typescript
import bcrypt from "bcrypt";

// ハッシュ化 (ソルトラウンド: 12以上)
const SALT_ROUNDS = 12;
const hash = await bcrypt.hash(password, SALT_ROUNDS);

// 検証
const isValid = await bcrypt.compare(inputPassword, storedHash);
```

**禁止アルゴリズム:** MD5, SHA1, SHA256 (ソルトなし), 平文保存

### Session Management

```typescript
// セッション設定のベストプラクティス
app.use(session({
  secret: process.env.SESSION_SECRET!,  // 環境変数から
  name: "__session",                     // デフォルト名 "connect.sid" を変更
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,      // JavaScript からアクセス不可
    secure: true,        // HTTPS のみ
    sameSite: "lax",     // CSRF 防止
    maxAge: 3600000,     // 1時間
  },
}));

// ログイン成功後にセッション再生成 (セッション固定攻撃の防止)
req.session.regenerate((err) => {
  req.session.userId = user.id;
});
```

### JWT の落とし穴

```typescript
// ❌ 危険なJWT設定
jwt.sign(payload, secret);                    // 有効期限なし
jwt.sign(payload, secret, { algorithm: "none" }); // 署名なし
jwt.verify(token, secret, { algorithms: ["HS256", "none"] }); // none を許可

// ✅ 安全なJWT設定
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET!,
  {
    expiresIn: "1h",
    algorithm: "HS256",
    issuer: "app.example.com",
    audience: "app.example.com",
  }
);

const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
  algorithms: ["HS256"],  // 許可するアルゴリズムを明示
  issuer: "app.example.com",
  audience: "app.example.com",
});
```

---

## 4. Authorization (認可)

### RBAC (Role-Based Access Control)

```typescript
// ミドルウェアパターン
function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

app.delete("/api/users/:id", requireRole("admin"), deleteUser);
app.get("/api/reports", requireRole("admin", "manager"), getReports);
```

### Ownership Check (所有権チェック)

```typescript
// リソースの所有者だけがアクセス可能
async function requireOwnership(req: Request, res: Response, next: NextFunction) {
  const resource = await db.resource.findUnique({ where: { id: req.params.id } });
  if (!resource) return res.status(404).json({ error: "Not found" });
  if (resource.ownerId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  req.resource = resource;
  next();
}
```

### ABAC (Attribute-Based Access Control)

```typescript
// ポリシーベースの認可
interface Policy {
  action: string;
  resource: string;
  condition: (user: User, resource: any) => boolean;
}

const policies: Policy[] = [
  {
    action: "edit",
    resource: "document",
    condition: (user, doc) =>
      doc.ownerId === user.id || doc.collaborators.includes(user.id),
  },
  {
    action: "delete",
    resource: "document",
    condition: (user, doc) => doc.ownerId === user.id,
  },
];
```

---

## 5. Secrets Management (シークレット管理)

### 絶対禁止
- ソースコードにAPIキー、パスワード、トークンをハードコード
- `.env` ファイルをgitにコミット
- クライアントサイドコードにサーバー用シークレットを含める
- ログにシークレットを出力

### 必須事項

```bash
# .gitignore に含める
.env
.env.local
.env.*.local
*.pem
*.key
```

```typescript
// 環境変数の安全な読み取り
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

const DB_URL = getRequiredEnv("DATABASE_URL");
const API_KEY = getRequiredEnv("API_KEY");
```

### Next.js のシークレット管理
- `NEXT_PUBLIC_` プレフィックス → クライアントに露出する。シークレットには絶対使わない
- プレフィックスなし → サーバーのみ。Server Components / API Routes からのみアクセス

---

## 6. HTTPS/TLS Enforcement

```typescript
// Express: HTTP → HTTPS リダイレクト
app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https" && process.env.NODE_ENV === "production") {
    return res.redirect(`https://${req.header("host")}${req.url}`);
  }
  next();
});

// HSTS ヘッダー (Helmet で自動設定)
app.use(helmet.hsts({
  maxAge: 31536000, // 1年
  includeSubDomains: true,
  preload: true,
}));
```

---

## 7. CORS Configuration

```typescript
import cors from "cors";

// 本番設定
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://app.example.com",
      "https://admin.example.com",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // preflight キャッシュ: 24時間
};

app.use(cors(corsOptions));
```

**注意:** `origin: "*"` と `credentials: true` は同時使用不可（ブラウザがブロック）。ワイルドカードは認証不要の公開APIのみに限定。

---

## 8. Content Security Policy (CSP)

```typescript
// Helmet でCSP設定
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],                    // inline script 禁止
    styleSrc: ["'self'", "'unsafe-inline'"],   // CSS-in-JS を使う場合
    imgSrc: ["'self'", "data:", "https://cdn.example.com"],
    connectSrc: ["'self'", "https://api.example.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],                     // Flash/Java プラグイン禁止
    frameSrc: ["'none'"],                      // iframe 禁止
    upgradeInsecureRequests: [],                // HTTP → HTTPS 自動アップグレード
  },
}));
```

### CSP レベル別設定
| レベル | 設定 | リスク |
|--------|------|--------|
| Strict | `script-src 'self'` | XSS をほぼ完全にブロック |
| Standard | `script-src 'self' 'nonce-xxx'` | インラインスクリプトを nonce で許可 |
| Relaxed | `script-src 'self' 'unsafe-inline'` | XSS リスクが残る。避けるべき |

---

## 9. Rate Limiting

```typescript
import rateLimit from "express-rate-limit";

// グローバルレート制限
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15分
  max: 100,                    // IPあたり100リクエスト
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// 認証エンドポイント用 (厳しめ)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                     // 15分に5回まで
  skipSuccessfulRequests: true, // 成功したリクエストはカウントしない
});
app.post("/api/login", authLimiter, loginHandler);
app.post("/api/register", authLimiter, registerHandler);

// API キー付きエンドポイント用
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1分
  max: 60,                     // 1分に60リクエスト
  keyGenerator: (req) => req.headers["x-api-key"] as string || req.ip,
});
app.use("/api/v1/", apiLimiter);
```

### レート制限の閾値目安
| エンドポイント | Window | Max | 理由 |
|---------------|--------|-----|------|
| ログイン | 15min | 5 | ブルートフォース防止 |
| パスワードリセット | 1h | 3 | 列挙攻撃防止 |
| API (認証済み) | 1min | 60 | 公正な使用 |
| ファイルアップロード | 1h | 10 | リソース消費制限 |
| 公開API | 15min | 30 | DDoS緩和 |

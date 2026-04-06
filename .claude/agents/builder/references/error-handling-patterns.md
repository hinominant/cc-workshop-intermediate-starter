# Error Handling Patterns

> エラーは無視するものではなく設計するもの。Builderが書くエラーハンドリングの標準パターン。

---

## エラー階層

| 分類 | 説明 | 例 | 対処 |
|------|------|-----|------|
| Expected | ビジネスルール違反。正常系の一部 | バリデーションエラー、重複登録、権限不足 | Result 型で返す。呼び出し側がハンドリング |
| Unexpected | 外部依存の障害。回復可能 | DB 接続断、API タイムアウト、レート制限 | リトライ / フォールバック / 通知 |
| Fatal | プログラムバグ。回復不能 | null アクセス、型不整合、不正な状態遷移 | throw して上位でキャッチ。即座に修正 |

**判断基準:** 「このエラーはユーザーの入力で起こりうるか？」
- Yes → Expected（Result 型）
- No, but recoverable → Unexpected（try-catch + リトライ）
- No, and unrecoverable → Fatal（throw）

---

## try-catch 配置ルール

### ルール1: 境界でキャッチする

```typescript
// ✅ APIハンドラ（境界）でキャッチ
async function handleRequest(req: Request): Promise<Response> {
  try {
    const result = await processOrder(req.body);
    if (!result.ok) {
      return new Response(JSON.stringify({ error: result.error }), { status: 400 });
    }
    return new Response(JSON.stringify(result.value), { status: 200 });
  } catch (error) {
    logger.error('Unhandled error in handleRequest', { error, requestId: req.id });
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

// ❌ ビジネスロジック内部で握り潰す
function calculateDiscount(order: Order): number {
  try {
    return order.items.reduce((sum, item) => sum + item.discount, 0);
  } catch {
    return 0; // バグが隠れる
  }
}
```

### ルール2: catch ブロックで何をするか明示する

```typescript
// ❌ 空の catch / console.log だけ
try { await sendEmail(user.email); } catch (e) { console.log(e); }

// ✅ リカバリ or リスロー or 通知
try {
  await sendEmail(user.email);
} catch (error) {
  logger.warn('Email send failed, queuing for retry', { userId: user.id, error });
  await emailRetryQueue.enqueue({ to: user.email, templateId: 'welcome' });
}
```

### ルール3: catch した型を絞り込む

```typescript
// ✅ unknown で受けて型を絞り込む
try {
  await externalApi.call();
} catch (error: unknown) {
  if (error instanceof ApiRateLimitError) {
    await sleep(error.retryAfter);
    return retry();
  }
  if (error instanceof ApiAuthError) {
    await refreshToken();
    return retry();
  }
  throw error; // 不明なエラーは再スロー
}
```

---

## カスタムエラークラス

```typescript
// 基底クラス
abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  readonly isOperational: boolean = true; // Expected/Unexpected

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

// ビジネスエラー（Expected）
class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(
    message: string,
    readonly fields: Record<string, string[]>,
  ) {
    super(message);
  }
}

class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;

  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`);
  }
}

class ConflictError extends AppError {
  readonly code = 'CONFLICT';
  readonly statusCode = 409;

  constructor(message: string) {
    super(message);
  }
}

// インフラエラー（Unexpected）
class ExternalServiceError extends AppError {
  readonly code = 'EXTERNAL_SERVICE_ERROR';
  readonly statusCode = 502;

  constructor(service: string, cause: unknown) {
    super(`External service failed: ${service}`, { cause });
  }
}
```

---

## Error Boundary（React）

```typescript
// ページ単位で Error Boundary を配置
// ✅ ページ全体をラップ
<ErrorBoundary fallback={<PageErrorFallback />}>
  <OrderPage />
</ErrorBoundary>

// ✅ 独立セクションに個別の Boundary
<ErrorBoundary fallback={<SectionErrorFallback section="recommendations" />}>
  <RecommendationSection />
</ErrorBoundary>

// ❌ アプリ全体に1つだけ → 1箇所のエラーで全画面が死ぬ
<ErrorBoundary fallback={<GenericError />}>
  <App /> {/* 全体が1つの Boundary */}
</ErrorBoundary>
```

**配置基準:** 「この部分が壊れても、他の部分は使えるべきか？」→ Yes なら個別 Boundary。

---

## API エラーレスポンス標準

```typescript
// 統一フォーマット
interface ApiErrorResponse {
  error: {
    code: string;          // マシンリーダブル: "VALIDATION_ERROR"
    message: string;       // ユーザー向けメッセージ
    details?: unknown;     // バリデーションフィールド等の追加情報
    requestId: string;     // トレーサビリティ用
  };
}

// ミドルウェアでの変換
function errorMiddleware(error: unknown, req: Request, res: Response) {
  const requestId = req.headers['x-request-id'] ?? generateId();

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error instanceof ValidationError ? error.fields : undefined,
        requestId,
      },
    });
    return;
  }

  // 未知のエラー → 500。詳細はログに残し、クライアントには出さない
  logger.error('Unhandled error', { error, requestId });
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      requestId,
    },
  });
}
```

---

## ログ戦略

### ログするもの

- エラーの種類・メッセージ・スタックトレース
- リクエストID（トレーサビリティ）
- 操作コンテキスト（userId, orderId 等）
- リトライ回数・最終結果
- 外部サービスのレスポンスステータス

### ログしないもの

- パスワード、トークン、APIキー
- クレジットカード番号、個人情報（PII）
- リクエストボディ全体（機密データ混入リスク）
- 大量の繰り返しログ（ループ内ログ）

```typescript
// ✅ 構造化ログ
logger.error('Payment processing failed', {
  orderId: order.id,
  userId: order.userId,
  errorCode: error.code,
  attempt: retryCount,
});

// ❌ 機密情報を含むログ
logger.error('Auth failed', { email, password, token });
```

---

## リカバリパターン

### リトライ（Exponential Backoff）

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxAttempts: number; baseDelayMs: number }
): Promise<T> {
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === options.maxAttempts) throw error;
      const delay = options.baseDelayMs * Math.pow(2, attempt - 1);
      await sleep(delay + Math.random() * delay * 0.1); // jitter
    }
  }
  throw new Error('Unreachable');
}
```

### フォールバック

```typescript
async function getUserAvatar(userId: string): Promise<string> {
  try {
    return await avatarService.fetch(userId);
  } catch {
    return generateDefaultAvatar(userId); // フォールバック
  }
}
```

### Graceful Degradation

```typescript
async function getProductPage(id: string): Promise<ProductPage> {
  const product = await productService.getById(id); // 必須 → 失敗したら throw

  // 推薦は非必須 → 失敗しても空配列で続行
  const recommendations = await recommendationService
    .getForProduct(id)
    .catch((): Product[] => {
      logger.warn('Recommendations unavailable', { productId: id });
      return [];
    });

  return { product, recommendations };
}
```

**判断基準:** 「この機能が壊れたとき、ページ全体を壊すべきか？」
- 必須機能（商品情報、認証） → throw して上位でハンドリング
- 補助機能（レコメンド、通知バッジ） → フォールバック値で続行

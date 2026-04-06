# Performance Awareness

> Builderは最適化のプロではない（それはBoltの仕事）。しかし明らかな性能問題を作り込まない意識は必要。

---

## バンドルサイズ

### Tree-Shaking を効かせる

```typescript
// ✅ 名前付きインポート → 使わないものはバンドルから除外
import { format, parseISO } from 'date-fns';

// ❌ デフォルトインポート → ライブラリ全体がバンドルに入る可能性
import _ from 'lodash';

// ✅ lodash は個別パスからインポート
import groupBy from 'lodash/groupBy';
```

### Dynamic Import（遅延読み込み）

```typescript
// ✅ 初期表示に不要なものは dynamic import
const HeavyChart = lazy(() => import('./components/HeavyChart'));

// ✅ 条件付きで必要なライブラリ
async function exportToPdf(data: ReportData) {
  const { jsPDF } = await import('jspdf'); // 使うときだけロード
  const doc = new jsPDF();
  // ...
}
```

### バンドルサイズ意識チェック

| 追加するもの | 確認事項 |
|-------------|---------|
| 新規 npm パッケージ | bundlephobia.com でサイズ確認。50KB 超は要検討 |
| アイコンライブラリ | 個別インポートできるか確認 |
| 日付ライブラリ | date-fns（tree-shakable） > dayjs（軽量） > moment（重い、非推奨） |
| バリデーション | zod（~13KB） が標準。yup（~25KB）は避ける |

---

## React レンダリング最適化

### メモ化の判断ツリー

```
コンポーネントの再レンダリングが問題？
├── No → 何もしない（過剰最適化は可読性を下げる）
└── Yes → 原因は？
    ├── 親の再レンダリング → React.memo を検討
    ├── props のオブジェクト/配列が毎回新規生成 → useMemo
    ├── props のコールバックが毎回新規生成 → useCallback
    └── 状態の配置が高すぎる → 状態を子に移動（最も効果的）
```

### ✅/❌ パターン

```typescript
// ❌ 毎レンダリングで新しいオブジェクトを生成
function Parent() {
  return <Child style={{ color: 'red' }} onClick={() => doSomething()} />;
}

// ✅ 安定した参照（ただし Child が memo されている場合のみ意味がある）
const style = { color: 'red' } as const; // コンポーネント外で定義
function Parent() {
  const handleClick = useCallback(() => doSomething(), []);
  return <Child style={style} onClick={handleClick} />;
}

// ✅ 最も効果的: 状態を必要な場所に下げる
function Page() {
  // searchQuery は SearchBar だけが使う → Page に置かない
  return (
    <>
      <SearchBar /> {/* 内部で状態管理 */}
      <ExpensiveList /> {/* searchQuery の変更で再レンダリングされない */}
    </>
  );
}
```

### memo/useMemo/useCallback を使うべきでないとき

- リストの各アイテムが軽量（memo のコスト > 再レンダリングのコスト）
- props がプリミティブ値のみ（参照の問題がない）
- コンポーネントが十分に小さい（最適化の恩恵が微小）

---

## データベースクエリパターン

### N+1 検出と対策

```typescript
// ❌ N+1: ユーザーごとに注文を個別取得
const users = await db.user.findMany();
for (const user of users) {
  user.orders = await db.order.findMany({ where: { userId: user.id } });
  // N回の追加クエリが発生
}

// ✅ Eager Loading: 1回のクエリで取得
const users = await db.user.findMany({
  include: { orders: true },
});

// ✅ バッチクエリ: IDリストで一括取得
const users = await db.user.findMany();
const userIds = users.map(u => u.id);
const orders = await db.order.findMany({
  where: { userId: { in: userIds } },
});
const ordersByUserId = groupBy(orders, 'userId');
```

### クエリチェックリスト

| チェック | 問題 | 対策 |
|---------|------|------|
| ループ内に await がある | N+1 | バッチクエリ / include |
| SELECT * を使っている | 不要カラム転送 | 必要カラムだけ select |
| WHERE にインデックスがない | フルスキャン | インデックス確認（Schema に報告） |
| OFFSET ページング | 大量データで遅い | カーソルベースページングに変更 |
| 集計を JS で計算 | メモリ消費 | DB 側で GROUP BY / COUNT |

---

## キャッシュ戦略

### キャッシュ判断基準

| 条件 | キャッシュする | しない |
|------|-------------|-------|
| データ更新頻度 | 低頻度（日次以下） | 高頻度（秒単位） |
| 計算コスト | 高い（集計、外部API） | 低い（単純な DB 参照） |
| データの整合性要件 | 許容できる遅延あり | リアルタイム必須 |
| アクセス頻度 | 高頻度（毎リクエスト） | 低頻度（管理画面のみ） |

### キャッシュ無効化パターン

```typescript
// ✅ TTL ベース（最もシンプル）
const cached = await cache.get(key);
if (cached) return cached;
const fresh = await fetchExpensiveData();
await cache.set(key, fresh, { ttl: 300 }); // 5分

// ✅ Write-through（書き込み時に更新）
async function updateUser(id: string, data: UpdateData) {
  const updated = await db.user.update({ where: { id }, data });
  await cache.set(`user:${id}`, updated, { ttl: 3600 });
  return updated;
}

// ✅ イベント駆動（pub/sub で無効化）
eventBus.on('order:created', async (order) => {
  await cache.delete(`user:${order.userId}:orders`);
});
```

---

## 遅延読み込みパターン

```typescript
// ルートレベルの Code Splitting
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// 画像の遅延読み込み
<img loading="lazy" src={imageUrl} alt={alt} />

// Intersection Observer による遅延読み込み
function LazySection({ children }: { children: React.ReactNode }) {
  const [isVisible, ref] = useIntersectionObserver({ threshold: 0.1 });
  return <div ref={ref}>{isVisible ? children : <Skeleton />}</div>;
}
```

---

## パフォーマンス予算

| 指標 | 予算 | 超過時のアクション |
|------|------|-----------------|
| First Contentful Paint | < 1.5s | 初期バンドルを分割、クリティカル CSS を inline 化 |
| Largest Contentful Paint | < 2.5s | 画像最適化、フォント preload、SSR 検討 |
| Total Blocking Time | < 200ms | 重い計算を Web Worker へ、コード分割 |
| Cumulative Layout Shift | < 0.1 | 画像に width/height 指定、フォント fallback |
| JS バンドル（gzip） | < 200KB | tree-shaking、dynamic import、依存の見直し |
| API レスポンス | < 200ms (p95) | クエリ最適化、キャッシュ、インデックス |

**Builder の責務:** 予算を超えそうなコードを書かないこと。超えた場合は Bolt に最適化を委譲する。明らかな O(n^2) や N+1 は Builder の段階で対処する。

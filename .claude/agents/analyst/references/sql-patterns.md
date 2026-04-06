# SQL Patterns

Analystエージェントが頻繁に使用する分析SQLパターン集。
パフォーマンスと正確性を両立するクエリテンプレート。

---

## 使用上の注意

- **READ ONLYアクセスのみ**: SELECT文のみ実行可能。INSERT/UPDATE/DELETE禁止
- **本番DBへの直接アクセスは最小限**: 可能な限りRedash経由を使用
- **EXPLAIN ANALYZEで実行計画を確認**: 大規模テーブルへのクエリ前に必須
- **テストユーザーの除外を忘れない**: WHERE句に除外条件を必ず含める

---

## 1. コホート分析

### 月次コホート（登録月別の継続率）

```sql
WITH cohort AS (
  SELECT
    user_id,
    DATE_TRUNC('month', created_at) AS cohort_month
  FROM users
  WHERE created_at >= :start_date
    AND is_test_user = false
),
activity AS (
  SELECT
    user_id,
    DATE_TRUNC('month', activity_date) AS activity_month
  FROM user_activities
  WHERE activity_date >= :start_date
)
SELECT
  c.cohort_month,
  EXTRACT(MONTH FROM AGE(a.activity_month, c.cohort_month)) AS month_number,
  COUNT(DISTINCT c.user_id) AS cohort_size,
  COUNT(DISTINCT a.user_id) AS active_users,
  ROUND(
    COUNT(DISTINCT a.user_id)::NUMERIC / COUNT(DISTINCT c.user_id) * 100,
    1
  ) AS retention_rate
FROM cohort c
LEFT JOIN activity a ON c.user_id = a.user_id
  AND a.activity_month >= c.cohort_month
GROUP BY c.cohort_month, month_number
ORDER BY c.cohort_month, month_number;
```

### 注意事項

- LROSの継続率は**更新回数ベース**（期間ベース禁止）。上記テンプレートを使用する場合はLROSの定義に合わせて修正すること
- `cohort_size`がゼロにならないことを確認（ゼロ除算防止）

---

## 2. ファネル分析

### ステップ別転換率

```sql
WITH funnel AS (
  SELECT
    'Step 1: 登録' AS step_name,
    1 AS step_order,
    COUNT(DISTINCT user_id) AS users
  FROM users
  WHERE created_at BETWEEN :start_date AND :end_date
    AND is_test_user = false

  UNION ALL

  SELECT
    'Step 2: プロフィール完成' AS step_name,
    2 AS step_order,
    COUNT(DISTINCT user_id) AS users
  FROM users
  WHERE created_at BETWEEN :start_date AND :end_date
    AND is_test_user = false
    AND profile_completed = true

  UNION ALL

  SELECT
    'Step 3: 初回課金' AS step_name,
    3 AS step_order,
    COUNT(DISTINCT user_id) AS users
  FROM payments
  WHERE created_at BETWEEN :start_date AND :end_date
    AND user_id IN (
      SELECT user_id FROM users
      WHERE created_at BETWEEN :start_date AND :end_date
        AND is_test_user = false
    )
    AND payment_number = 1
)
SELECT
  step_name,
  users,
  LAG(users) OVER (ORDER BY step_order) AS prev_step_users,
  ROUND(
    users::NUMERIC / NULLIF(LAG(users) OVER (ORDER BY step_order), 0) * 100,
    1
  ) AS step_conversion_rate,
  ROUND(
    users::NUMERIC / NULLIF(FIRST_VALUE(users) OVER (ORDER BY step_order), 0) * 100,
    1
  ) AS overall_conversion_rate
FROM funnel
ORDER BY step_order;
```

---

## 3. リテンション/チャーン計算

### 月次チャーンレート

```sql
WITH monthly_status AS (
  SELECT
    user_id,
    DATE_TRUNC('month', period_start) AS month,
    subscription_status
  FROM subscription_history
  WHERE is_test_user = false
)
SELECT
  curr.month,
  COUNT(DISTINCT prev.user_id) AS start_of_month_subscribers,
  COUNT(DISTINCT CASE
    WHEN curr.subscription_status = 'cancelled'
    THEN curr.user_id
  END) AS churned,
  ROUND(
    COUNT(DISTINCT CASE
      WHEN curr.subscription_status = 'cancelled'
      THEN curr.user_id
    END)::NUMERIC
    / NULLIF(COUNT(DISTINCT prev.user_id), 0) * 100,
    2
  ) AS churn_rate
FROM monthly_status curr
JOIN monthly_status prev
  ON curr.user_id = prev.user_id
  AND curr.month = prev.month + INTERVAL '1 month'
  AND prev.subscription_status = 'active'
GROUP BY curr.month
ORDER BY curr.month;
```

---

## 4. 移動平均とトレンド

### 7日間移動平均

```sql
SELECT
  date,
  daily_value,
  AVG(daily_value) OVER (
    ORDER BY date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7d,
  AVG(daily_value) OVER (
    ORDER BY date
    ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
  ) AS moving_avg_30d
FROM daily_metrics
WHERE date BETWEEN :start_date AND :end_date
ORDER BY date;
```

### トレンド検出（前月比・前年比）

```sql
SELECT
  month,
  metric_value,
  LAG(metric_value, 1) OVER (ORDER BY month) AS prev_month,
  ROUND(
    (metric_value - LAG(metric_value, 1) OVER (ORDER BY month))::NUMERIC
    / NULLIF(LAG(metric_value, 1) OVER (ORDER BY month), 0) * 100,
    1
  ) AS mom_change_pct,
  LAG(metric_value, 12) OVER (ORDER BY month) AS prev_year,
  ROUND(
    (metric_value - LAG(metric_value, 12) OVER (ORDER BY month))::NUMERIC
    / NULLIF(LAG(metric_value, 12) OVER (ORDER BY month), 0) * 100,
    1
  ) AS yoy_change_pct
FROM monthly_metrics
ORDER BY month;
```

---

## 5. 年次/月次比較

### YoY比較（セグメント別）

```sql
SELECT
  segment,
  SUM(CASE WHEN EXTRACT(YEAR FROM month) = :current_year
    THEN revenue END) AS current_year_revenue,
  SUM(CASE WHEN EXTRACT(YEAR FROM month) = :current_year - 1
    THEN revenue END) AS prev_year_revenue,
  ROUND(
    (SUM(CASE WHEN EXTRACT(YEAR FROM month) = :current_year THEN revenue END)
     - SUM(CASE WHEN EXTRACT(YEAR FROM month) = :current_year - 1 THEN revenue END))::NUMERIC
    / NULLIF(SUM(CASE WHEN EXTRACT(YEAR FROM month) = :current_year - 1
      THEN revenue END), 0) * 100,
    1
  ) AS yoy_growth_pct
FROM monthly_segment_metrics
WHERE EXTRACT(YEAR FROM month) IN (:current_year, :current_year - 1)
  AND EXTRACT(MONTH FROM month) <= :current_month
GROUP BY segment
ORDER BY current_year_revenue DESC;
```

---

## 6. パーセンタイル計算

### 分布の把握（中央値、P25、P75、P90）

```sql
SELECT
  segment,
  COUNT(*) AS n,
  ROUND(AVG(metric_value), 2) AS mean,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY metric_value) AS p25,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY metric_value) AS median,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY metric_value) AS p75,
  PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY metric_value) AS p90,
  MIN(metric_value) AS min_val,
  MAX(metric_value) AS max_val
FROM user_metrics
WHERE is_test_user = false
  AND metric_value IS NOT NULL
GROUP BY segment
ORDER BY segment;
```

---

## 7. パフォーマンス考慮事項

### Window関数 vs サブクエリの使い分け

| 用途 | 推奨 | 理由 |
|------|------|------|
| 行単位の前後比較 | Window関数（LAG/LEAD） | サブクエリより効率的 |
| 累計計算 | Window関数（SUM OVER） | 1パスで計算可能 |
| ランキング | Window関数（ROW_NUMBER/RANK） | ソートが1回で済む |
| 複雑な条件付き集計 | CTE + JOIN | 可読性が高い |
| 大規模テーブルの集計 | サマリテーブル参照 | 毎回フルスキャンを避ける |

### クエリ最適化の原則

1. **WHERE句を先に絞る**: 大きいテーブルは最初にフィルタ
2. **EXPLAIN ANALYZEで確認**: 想定外のFull Scanがないか
3. **INDEXの活用**: 結合キーとフィルタカラムにインデックスがあるか確認
4. **LIMIT付き検証**: 本番実行前にLIMIT 100で結果を確認

---

## 8. データバリデーションクエリ

### NULL/欠損チェック

```sql
SELECT
  'users' AS table_name,
  COUNT(*) AS total_rows,
  COUNT(*) - COUNT(email) AS null_email,
  COUNT(*) - COUNT(created_at) AS null_created_at,
  COUNT(*) - COUNT(plan_id) AS null_plan_id,
  ROUND((COUNT(*) - COUNT(email))::NUMERIC / COUNT(*) * 100, 2) AS null_email_pct
FROM users
WHERE is_test_user = false;
```

### 範囲チェック（異常値検出）

```sql
SELECT
  user_id,
  metric_name,
  metric_value,
  CASE
    WHEN metric_value < 0 THEN 'NEGATIVE'
    WHEN metric_value > (AVG(metric_value) OVER () + 3 * STDDEV(metric_value) OVER ())
      THEN 'OUTLIER_HIGH'
    WHEN metric_value < (AVG(metric_value) OVER () - 3 * STDDEV(metric_value) OVER ())
      THEN 'OUTLIER_LOW'
    ELSE 'NORMAL'
  END AS anomaly_flag
FROM user_metrics
WHERE metric_name = :target_metric
  AND is_test_user = false
ORDER BY anomaly_flag, metric_value DESC;
```

### 参照整合性チェック

```sql
-- 親レコードが存在しない子レコードを検出
SELECT
  p.payment_id,
  p.user_id,
  p.created_at
FROM payments p
LEFT JOIN users u ON p.user_id = u.user_id
WHERE u.user_id IS NULL;
```

### 重複チェック

```sql
SELECT
  user_id,
  DATE_TRUNC('month', period_start) AS month,
  COUNT(*) AS duplicate_count
FROM subscription_history
GROUP BY user_id, DATE_TRUNC('month', period_start)
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;
```

### 時系列の連続性チェック（欠損日検出）

```sql
WITH date_series AS (
  SELECT generate_series(
    :start_date::DATE,
    :end_date::DATE,
    '1 day'::INTERVAL
  )::DATE AS expected_date
),
actual_dates AS (
  SELECT DISTINCT date AS actual_date
  FROM daily_metrics
)
SELECT
  ds.expected_date AS missing_date
FROM date_series ds
LEFT JOIN actual_dates ad ON ds.expected_date = ad.actual_date
WHERE ad.actual_date IS NULL
ORDER BY ds.expected_date;
```

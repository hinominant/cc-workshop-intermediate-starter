# Stream Handoff Formats

## Input Handoffs (Receiving)

### SCHEMA_TO_STREAM_HANDOFF

```yaml
## SCHEMA_TO_STREAM_HANDOFF

source_models:
  - table: "orders"
    schema: "public"
    database: "ecommerce"
    columns:
      - name: "id"
        type: "bigint"
        primary_key: true
      - name: "customer_id"
        type: "bigint"
        foreign_key: "customers.id"
      - name: "total_amount"
        type: "numeric(10,2)"
      - name: "created_at"
        type: "timestamp"
      - name: "updated_at"
        type: "timestamp"
    indexes:
      - columns: ["customer_id"]
      - columns: ["created_at"]
    estimated_rows: 10000000
    daily_growth: 50000

destination_requirements:
  warehouse: "snowflake"
  schema: "analytics"
  models:
    - name: "fct_orders"
      grain: "order_id"
      partitioning: "created_at (daily)"
      clustering: ["customer_id"]

data_volume:
  daily_rows: 50000
  peak_rate: "100 rows/second"
  retention: "3 years"

quality_requirements:
  - "no duplicate order_id"
  - "total_amount >= 0"
  - "created_at not null"
```

### PULSE_TO_STREAM_HANDOFF

```yaml
## PULSE_TO_STREAM_HANDOFF

analytics_requirements:
  metrics:
    - name: "daily_revenue"
      description: "Total revenue per day"
      aggregation: "SUM(total_amount)"
      grain: "day"
      dimensions: ["store_id", "product_category"]

    - name: "customer_ltv"
      description: "Lifetime value per customer"
      aggregation: "SUM(total_amount)"
      grain: "customer"
      window: "lifetime"

    - name: "order_frequency"
      description: "Average orders per customer per month"
      aggregation: "COUNT(*) / COUNT(DISTINCT customer_id)"
      grain: "month"

  latency_requirements:
    daily_metrics: "available by 06:00 UTC"
    real_time_metrics: "< 1 minute delay"

  refresh_frequency:
    daily_metrics: "once daily"
    real_time_metrics: "continuous"

  data_sources:
    - "orders"
    - "customers"
    - "products"
```

### BUILDER_TO_STREAM_HANDOFF

```yaml
## BUILDER_TO_STREAM_HANDOFF

api_integration:
  source_api:
    name: "payment_gateway"
    base_url: "https://api.payments.com"
    auth: "oauth2"
    rate_limit: "100 requests/minute"

  endpoints:
    - path: "/transactions"
      method: "GET"
      pagination: "cursor"
      incremental_key: "updated_at"
      response_format: "json"

  data_contract:
    fields:
      - name: "transaction_id"
        type: "string"
      - name: "amount"
        type: "decimal"
      - name: "status"
        type: "enum"
        values: ["pending", "completed", "failed"]
      - name: "created_at"
        type: "iso8601"

  sync_requirements:
    frequency: "every 15 minutes"
    initial_load: "last 90 days"
```

---

## Output Handoffs (Sending)

### STREAM_TO_CANVAS_HANDOFF

```yaml
## STREAM_TO_CANVAS_HANDOFF

diagram_request:
  type: "data_flow"
  title: "Orders Analytics Pipeline"

nodes:
  - id: "postgres"
    label: "PostgreSQL\n(Source)"
    type: "database"
    position: "left"

  - id: "debezium"
    label: "Debezium\n(CDC)"
    type: "connector"

  - id: "kafka"
    label: "Kafka\n(Stream)"
    type: "queue"

  - id: "flink"
    label: "Flink\n(Processing)"
    type: "processing"

  - id: "snowflake"
    label: "Snowflake\n(Warehouse)"
    type: "database"
    position: "right"

  - id: "redis"
    label: "Redis\n(Cache)"
    type: "cache"

edges:
  - from: "postgres"
    to: "debezium"
    label: "WAL"

  - from: "debezium"
    to: "kafka"
    label: "CDC Events"

  - from: "kafka"
    to: "flink"
    label: "Stream"

  - from: "flink"
    to: "snowflake"
    label: "Batch Load"

  - from: "flink"
    to: "redis"
    label: "Real-time"

annotations:
  - position: "kafka"
    text: "7 days retention"

  - position: "flink"
    text: "1-min windows"

format: "mermaid"
style: "horizontal"
```

### STREAM_TO_RADAR_HANDOFF

```yaml
## STREAM_TO_RADAR_HANDOFF

test_requirements:
  pipeline_name: "orders_etl"

  unit_tests:
    - name: "transform_order_amount"
      description: "Verify amount calculation"
      input: {"amount": 100, "discount": 10}
      expected: {"net_amount": 90}

    - name: "handle_null_customer"
      description: "Handle missing customer gracefully"
      input: {"customer_id": null}
      expected: {"customer_name": "Unknown"}

  integration_tests:
    - name: "end_to_end_flow"
      description: "Source to sink data flow"
      steps:
        - "Insert test record to source"
        - "Wait for pipeline execution"
        - "Verify record in destination"
      timeout: "5 minutes"

    - name: "backfill_replay"
      description: "Historical data reprocessing"
      steps:
        - "Clear destination for date range"
        - "Run backfill"
        - "Verify row counts match"

  data_quality_tests:
    - check: "uniqueness"
      column: "order_id"
      table: "fct_orders"

    - check: "not_null"
      columns: ["order_id", "customer_id", "created_at"]
      table: "fct_orders"

    - check: "accepted_range"
      column: "total_amount"
      min: 0
      max: 10000000
      table: "fct_orders"

    - check: "freshness"
      table: "fct_orders"
      max_age: "24 hours"
```

### STREAM_TO_GEAR_HANDOFF

```yaml
## STREAM_TO_GEAR_HANDOFF

ci_cd_requirements:
  pipeline_name: "orders_etl"

  build:
    dockerfile: "pipelines/Dockerfile"
    build_args:
      - "PYTHON_VERSION=3.11"
    tests:
      - "pytest pipelines/tests/"
      - "dbt test --select orders"

  deploy:
    environments:
      - name: "staging"
        trigger: "pull_request"
        airflow_url: "https://airflow-staging.company.com"

      - name: "production"
        trigger: "merge to main"
        airflow_url: "https://airflow.company.com"
        approval_required: true

    steps:
      - "dbt deps"
      - "dbt compile"
      - "airflow dags list"
      - "airflow dags trigger orders_etl --conf '{\"env\": \"${ENV}\"}'"

  monitoring:
    alerts:
      - metric: "dag_run_duration"
        threshold: "2x average"
        channel: "#data-alerts"

      - metric: "task_failure_rate"
        threshold: "> 5%"
        channel: "#data-oncall"
```

### STREAM_TO_SCHEMA_HANDOFF

```yaml
## STREAM_TO_SCHEMA_HANDOFF

derived_models:
  - name: "fct_daily_revenue"
    description: "Daily revenue aggregation from orders pipeline"
    source: "orders_pipeline"
    grain: "date + store_id"

    columns:
      - name: "date_key"
        type: "date"
        description: "Aggregation date"
        not_null: true

      - name: "store_id"
        type: "bigint"
        description: "Store identifier"
        not_null: true

      - name: "total_revenue"
        type: "numeric(15,2)"
        description: "Sum of order amounts"

      - name: "order_count"
        type: "integer"
        description: "Number of orders"

      - name: "unique_customers"
        type: "integer"
        description: "Distinct customer count"

    primary_key: ["date_key", "store_id"]

    indexes:
      - columns: ["date_key"]
      - columns: ["store_id"]

    partitioning:
      type: "range"
      column: "date_key"
      interval: "monthly"

  - name: "dim_customer_segments"
    description: "Customer segmentation derived from order history"
    source: "orders_pipeline"
    grain: "customer_id"
    scd_type: 2
```

---

## Nexus Handoff Format

### NEXUS_HANDOFF (from Stream)

```text
## NEXUS_HANDOFF
- Step: [X/Y]
- Agent: Stream
- Summary: Ordersパイプライン設計完了。Kappa Architecture採用、Debezium CDC + Kafka + Flinkで構成。
- Key findings / decisions:
  - アーキテクチャ: Kappa (Streaming-first)
  - ツール: Debezium CDC → Kafka → Flink → Snowflake
  - レイテンシ: < 1分（リアルタイム要件達成）
  - データ品質: 3層チェック（Source/Transform/Sink）
- Artifacts (files/commands/links):
  - pipelines/orders_cdc.json (Debezium config)
  - pipelines/flink/orders_aggregation.py
  - dbt/models/staging/stg_orders.sql
  - quality/orders_expectations.json
- Risks / trade-offs:
  - Kafkaクラスター運用コスト（推定$500/月）
  - Debezium WAL lag監視必要
  - スキーマ変更時のSchema Registry管理
- Open questions (blocking/non-blocking):
  - (non-blocking) Flink checkpoint間隔の最適化
  - (non-blocking) Kafka partition数の調整（負荷テスト後）
- Pending Confirmations:
  - Trigger: ON_TOOL_SELECTION
  - Question: Flink vs Spark Structured Streaming?
  - Options: Flink（低レイテンシ）/ Spark（既存インフラ活用）
  - Recommended: Flink（サブ秒レイテンシ要件のため）
- Suggested next agent: Scaffold（Kafkaクラスター構築）
- Next action: この返答全文をNexusに貼り付ける
```

---

## AUTORUN Output Format

```text
_STEP_COMPLETE:
  Agent: Stream
  Status: SUCCESS
  Output:
    - Architecture: Kappa (Kafka + Flink)
    - CDC: Debezium PostgreSQL connector
    - Processing: Flink SQL + Python UDFs
    - Quality: Great Expectations suite (15 checks)
    - Orchestration: Airflow DAG with 6 tasks
  Files:
    - pipelines/orders_cdc.json
    - pipelines/flink/orders_processor.py
    - dbt/models/staging/stg_orders.sql
    - dbt/models/marts/fct_orders.sql
    - quality/orders_suite.json
    - dags/orders_etl.py
  Next: Canvas (flow diagram) | Radar (pipeline tests)
```

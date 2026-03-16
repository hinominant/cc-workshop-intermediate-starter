# Stream Examples

## Example 1: E-commerce Orders Pipeline

### Input
```
User: 注文データをリアルタイムでダッシュボードに表示したい。
      PostgreSQLからSnowflakeへのパイプラインを設計してください。
```

### Stream Response

```markdown
## パイプライン設計: Orders Real-Time Analytics

### 要件分析
- ソース: PostgreSQL (orders, order_items)
- シンク: Snowflake (analytics), Redis (real-time cache)
- レイテンシ: < 1分
- ボリューム: 10K orders/day

### アーキテクチャ選定: **Kappa Architecture**

```
PostgreSQL ──[Debezium]──▶ Kafka ──[Flink]──▶ Snowflake
                                     │
                                     └──▶ Redis (real-time)
```

### Kafka Topic設計

```yaml
topics:
  - name: "ecommerce.orders.created"
    partitions: 6
    retention: "7d"
    key: "order_id"

  - name: "ecommerce.orders.updated"
    partitions: 6
    retention: "7d"
```

### Debezium Connector

```json
{
  "name": "orders-cdc",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.dbname": "ecommerce",
    "table.include.list": "public.orders,public.order_items",
    "transforms": "route",
    "transforms.route.type": "org.apache.kafka.connect.transforms.RegexRouter",
    "transforms.route.regex": ".*\\.(.*)\\.(.*)",
    "transforms.route.replacement": "ecommerce.$1.$2"
  }
}
```

### Flink Job (Aggregation)

```java
DataStream<OrderEvent> orders = env
    .fromSource(kafkaSource, WatermarkStrategy
        .forBoundedOutOfOrderness(Duration.ofMinutes(1))
        .withTimestampAssigner((event, ts) -> event.getTimestamp()),
        "Kafka Orders");

orders
    .keyBy(OrderEvent::getStoreId)
    .window(TumblingEventTimeWindows.of(Time.minutes(1)))
    .aggregate(new RevenueAggregator())
    .addSink(redisSink);

orders
    .addSink(snowflakeSink);  // Raw events
```

### データ品質チェック

```yaml
quality_checks:
  source:
    - freshness: "< 5 minutes"
    - schema: "orders_schema_v1"

  transform:
    - uniqueness: "order_id"
    - not_null: ["order_id", "customer_id", "total_amount"]
    - range: "total_amount BETWEEN 0 AND 1000000"

  sink:
    - reconciliation: "source_count == sink_count (within 1%)"
```

### ロールバック計画
1. Kafka retention: 7日間のリプレイ可能
2. Snowflake Time Travel: 90日間
3. Debezium snapshot: フル再同期可能
```

---

## Example 2: dbt Data Warehouse

### Input
```
User: dbtでデータウェアハウスのモデルを設計してください。
      顧客分析用のマートが必要です。
```

### Stream Response

```markdown
## dbt プロジェクト設計: Customer Analytics

### モデル構造

```
models/
├── staging/
│   ├── stg_customers.sql
│   ├── stg_orders.sql
│   └── stg_products.sql
├── intermediate/
│   ├── int_customer_orders.sql
│   └── int_order_items_enriched.sql
└── marts/
    └── marketing/
        ├── dim_customers.sql
        └── fct_customer_transactions.sql
```

### stg_customers.sql

```sql
{{
    config(
        materialized='view',
        tags=['staging', 'customers']
    )
}}

with source as (
    select * from {{ source('raw', 'customers') }}
),

staged as (
    select
        id as customer_id,
        email,
        lower(trim(first_name)) as first_name,
        lower(trim(last_name)) as last_name,
        created_at,
        updated_at,
        coalesce(status, 'active') as status

    from source
    where email is not null
)

select * from staged
```

### int_customer_orders.sql

```sql
{{
    config(
        materialized='table',
        tags=['intermediate']
    )
}}

with customers as (
    select * from {{ ref('stg_customers') }}
),

orders as (
    select * from {{ ref('stg_orders') }}
),

customer_orders as (
    select
        c.customer_id,
        c.email,
        c.first_name,
        c.last_name,
        count(distinct o.order_id) as total_orders,
        sum(o.total_amount) as lifetime_value,
        min(o.created_at) as first_order_at,
        max(o.created_at) as last_order_at,
        datediff('day', min(o.created_at), max(o.created_at)) as customer_tenure_days

    from customers c
    left join orders o on c.customer_id = o.customer_id
    group by 1, 2, 3, 4
)

select * from customer_orders
```

### dim_customers.sql (SCD Type 2)

```sql
{{
    config(
        materialized='table',
        unique_key='customer_sk',
        tags=['marts', 'marketing']
    )
}}

with customer_history as (
    select
        {{ dbt_utils.generate_surrogate_key(['customer_id', 'updated_at']) }} as customer_sk,
        customer_id,
        email,
        first_name,
        last_name,
        status,
        updated_at as valid_from,
        lead(updated_at) over (partition by customer_id order by updated_at) as valid_to,
        case
            when lead(updated_at) over (partition by customer_id order by updated_at) is null
            then true
            else false
        end as is_current

    from {{ ref('int_customer_orders') }}
)

select * from customer_history
```

### schema.yml

```yaml
version: 2

models:
  - name: dim_customers
    description: "Customer dimension with SCD Type 2"
    columns:
      - name: customer_sk
        description: "Surrogate key"
        tests:
          - unique
          - not_null

      - name: customer_id
        description: "Natural key"
        tests:
          - not_null

      - name: lifetime_value
        tests:
          - dbt_utils.accepted_range:
              min_value: 0
```

### dbt run コマンド

```bash
# 開発環境
dbt run --select staging+

# 本番 (incremental)
dbt run --select marts --full-refresh=false

# テスト
dbt test --select marts
```
```

---

## Example 3: Airflow DAG Design

### Input
```
User: 日次バッチパイプラインをAirflowで作成してください。
      S3からデータを取得し、変換してBigQueryにロードします。
```

### Stream Response

```markdown
## Airflow DAG: Daily S3 to BigQuery Pipeline

### DAG設計

```python
# dags/daily_s3_to_bigquery.py
from airflow import DAG
from airflow.operators.python import PythonOperator, BranchPythonOperator
from airflow.providers.google.cloud.operators.bigquery import (
    BigQueryCreateEmptyTableOperator,
    BigQueryInsertJobOperator,
)
from airflow.providers.amazon.aws.sensors.s3 import S3KeySensor
from airflow.utils.task_group import TaskGroup
from datetime import datetime, timedelta

default_args = {
    'owner': 'data-team',
    'depends_on_past': True,  # 依存関係を保証
    'email_on_failure': True,
    'email': ['data-alerts@company.com'],
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'retry_exponential_backoff': True,
}

with DAG(
    'daily_s3_to_bigquery',
    default_args=default_args,
    description='Daily ETL: S3 → BigQuery',
    schedule_interval='0 6 * * *',  # 毎日06:00 UTC
    start_date=datetime(2024, 1, 1),
    catchup=True,  # バックフィル有効
    max_active_runs=1,
    tags=['etl', 'bigquery', 's3'],
) as dag:

    # 1. S3ファイル存在確認
    wait_for_file = S3KeySensor(
        task_id='wait_for_s3_file',
        bucket_name='data-lake',
        bucket_key='raw/orders/{{ ds }}/data.parquet',
        aws_conn_id='aws_default',
        timeout=3600,  # 1時間待機
        poke_interval=60,
    )

    # 2. データ品質チェック（ソース）
    def validate_source(**context):
        from great_expectations.core import ExpectationSuite
        # 品質チェック実行
        result = run_validation(context['ds'])
        if not result['success']:
            raise ValueError(f"Source validation failed: {result}")
        return result

    validate_source_task = PythonOperator(
        task_id='validate_source',
        python_callable=validate_source,
    )

    # 3. 変換処理
    with TaskGroup('transform') as transform_group:
        extract = PythonOperator(
            task_id='extract_from_s3',
            python_callable=extract_s3_data,
            op_kwargs={'date': '{{ ds }}'},
        )

        transform = PythonOperator(
            task_id='apply_transformations',
            python_callable=transform_data,
        )

        extract >> transform

    # 4. データ品質チェック（変換後）
    validate_transform = PythonOperator(
        task_id='validate_transformed',
        python_callable=validate_transformed_data,
    )

    # 5. BigQueryロード
    load_to_bq = BigQueryInsertJobOperator(
        task_id='load_to_bigquery',
        configuration={
            'load': {
                'sourceUris': ['gs://staging/orders/{{ ds }}/*.parquet'],
                'destinationTable': {
                    'projectId': 'my-project',
                    'datasetId': 'warehouse',
                    'tableId': 'orders${{ ds_nodash }}',
                },
                'sourceFormat': 'PARQUET',
                'writeDisposition': 'WRITE_TRUNCATE',  # Idempotent
                'timePartitioning': {
                    'type': 'DAY',
                    'field': 'order_date',
                },
            }
        },
        gcp_conn_id='google_cloud_default',
    )

    # 6. 整合性チェック
    reconciliation = PythonOperator(
        task_id='reconciliation_check',
        python_callable=check_row_counts,
        op_kwargs={
            'source': 's3://data-lake/raw/orders/{{ ds }}',
            'target': 'warehouse.orders',
        },
    )

    # 7. 後続処理通知
    notify_downstream = PythonOperator(
        task_id='notify_downstream',
        python_callable=send_completion_notification,
    )

    # DAG依存関係
    (
        wait_for_file
        >> validate_source_task
        >> transform_group
        >> validate_transform
        >> load_to_bq
        >> reconciliation
        >> notify_downstream
    )
```

### 監視・アラート設計

```yaml
alerts:
  - name: "pipeline_delay"
    condition: "completion_time > SLA (08:00)"
    action: "PagerDuty escalation"

  - name: "quality_failure"
    condition: "validation_task failed"
    action: "Slack + email"

  - name: "row_count_anomaly"
    condition: "row_count < 80% of 7-day average"
    action: "Slack warning"
```

### バックフィルコマンド

```bash
# 特定日付範囲をバックフィル
airflow dags backfill \
  --start-date 2024-01-01 \
  --end-date 2024-01-31 \
  --reset-dagruns \
  daily_s3_to_bigquery
```
```

---

## Example 4: CDC with Debezium

### Input
```
User: PostgreSQLの変更をKafkaにストリーミングしたい。
      CDCパイプラインを設計してください。
```

### Stream Response

```markdown
## CDC パイプライン設計: PostgreSQL → Kafka

### アーキテクチャ

```
PostgreSQL ──[WAL]──▶ Debezium ──▶ Kafka ──▶ Consumers
    │                    │             │
    │                Connectors        │
    │                    │             │
    └─── Slot: debezium  └─── Schema   └─── Multiple
                              Registry      Services
```

### PostgreSQL 設定

```sql
-- レプリケーション設定
ALTER SYSTEM SET wal_level = logical;
ALTER SYSTEM SET max_replication_slots = 4;
ALTER SYSTEM SET max_wal_senders = 4;

-- Debeziumユーザー作成
CREATE ROLE debezium WITH REPLICATION LOGIN PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO debezium;

-- Publication作成
CREATE PUBLICATION orders_publication FOR TABLE orders, order_items;
```

### Debezium Connector 設定

```json
{
  "name": "postgres-orders-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres-primary",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "${secrets:db_password}",
    "database.dbname": "ecommerce",
    "database.server.name": "ecommerce",

    "table.include.list": "public.orders,public.order_items",
    "column.exclude.list": "public.orders.internal_notes",

    "plugin.name": "pgoutput",
    "slot.name": "debezium_orders",
    "publication.name": "orders_publication",

    "transforms": "unwrap,route",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
    "transforms.unwrap.drop.tombstones": "false",
    "transforms.unwrap.delete.handling.mode": "rewrite",
    "transforms.unwrap.add.fields": "op,source.ts_ms",

    "transforms.route.type": "org.apache.kafka.connect.transforms.RegexRouter",
    "transforms.route.regex": "ecommerce\\.public\\.(.*)",
    "transforms.route.replacement": "cdc.$1",

    "key.converter": "io.confluent.connect.avro.AvroConverter",
    "key.converter.schema.registry.url": "http://schema-registry:8081",
    "value.converter": "io.confluent.connect.avro.AvroConverter",
    "value.converter.schema.registry.url": "http://schema-registry:8081",

    "heartbeat.interval.ms": "10000",
    "snapshot.mode": "initial",

    "errors.tolerance": "all",
    "errors.log.enable": "true",
    "errors.log.include.messages": "true"
  }
}
```

### Consumer 実装例

```python
from confluent_kafka import Consumer, KafkaError
from confluent_kafka.schema_registry import SchemaRegistryClient
from confluent_kafka.schema_registry.avro import AvroDeserializer

schema_registry = SchemaRegistryClient({'url': 'http://schema-registry:8081'})
avro_deserializer = AvroDeserializer(schema_registry)

consumer = Consumer({
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'order-processor',
    'auto.offset.reset': 'earliest',
    'enable.auto.commit': False,
})

consumer.subscribe(['cdc.orders'])

while True:
    msg = consumer.poll(1.0)
    if msg is None:
        continue

    if msg.error():
        if msg.error().code() == KafkaError._PARTITION_EOF:
            continue
        raise KafkaException(msg.error())

    key = avro_deserializer(msg.key(), None)
    value = avro_deserializer(msg.value(), None)

    # CDC イベント処理
    op = value.get('__op')  # c=create, u=update, d=delete

    if op == 'c':
        handle_create(value)
    elif op == 'u':
        handle_update(value)
    elif op == 'd':
        handle_delete(key)

    consumer.commit(asynchronous=False)
```

### 監視メトリクス

```yaml
metrics:
  - name: "debezium_lag_seconds"
    description: "CDC lag from source to Kafka"
    alert_threshold: 60

  - name: "replication_slot_lag_bytes"
    description: "PostgreSQL replication slot lag"
    alert_threshold: 1073741824  # 1GB

  - name: "consumer_lag"
    description: "Kafka consumer lag"
    alert_threshold: 10000
```
```

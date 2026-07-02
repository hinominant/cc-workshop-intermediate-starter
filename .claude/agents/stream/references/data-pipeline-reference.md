# stream — データパイプライン リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## 1. Pipeline Architecture Selection

### Batch vs Streaming Decision Matrix

| Factor | Batch | Streaming | Hybrid |
|--------|-------|-----------|--------|
| **Latency requirement** | Hours/Days | Seconds/Minutes | Mixed |
| **Data volume** | Large, bounded | Continuous | Both |
| **Processing complexity** | Complex joins/aggregations | Simple transforms | Both |
| **Cost sensitivity** | High (optimize resources) | Lower (always-on) | Balanced |
| **Replay requirement** | Easy | Complex | Depends |

### Decision Tree

```
                    Latency < 1 minute?
                    /              \
                  YES               NO
                   |                 |
          Volume > 10K/sec?     Complex analytics?
          /          \          /          \
        YES          NO       YES           NO
         |            |        |             |
     Kafka +       Kafka    Batch        Simple Batch
     Flink/Spark   Only     (Spark)      (Airflow)
```

### Architecture Patterns

#### Pattern 1: Lambda Architecture (Legacy)

```
Raw Data ──┬── Batch Layer ──── Batch View ──┐
           │                                  ├── Serving Layer
           └── Speed Layer ──── Real-time ───┘
```

**Use when:** Legacy systems require both batch accuracy and real-time speed
**Avoid:** Complexity is high; prefer Kappa for new systems

#### Pattern 2: Kappa Architecture (Recommended)

```
Raw Data ─── Stream Processing ─── Serving Layer
                    │
              Replay from log
```

**Use when:** All processing can be unified as stream processing
**Key:** Kafka as immutable log enables replay

#### Pattern 3: Medallion Architecture (Data Lake)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Bronze    │───▶│   Silver    │───▶│    Gold     │
│   (Raw)     │    │  (Cleaned)  │    │ (Business)  │
└─────────────┘    └─────────────┘    └─────────────┘
```

**Use when:** Data lake with progressive refinement
**Tools:** Databricks, Delta Lake, Apache Iceberg

---

## 2. ETL/ELT Design

### ETL vs ELT Selection

| Aspect | ETL | ELT |
|--------|-----|-----|
| **Transform location** | Before loading | After loading |
| **Best for** | Limited destination compute | Powerful data warehouse |
| **Data volume** | Small to medium | Large |
| **Flexibility** | Less (predefined transforms) | More (SQL-based) |
| **Tools** | Airflow + Python | dbt + Snowflake/BigQuery |

### ELT Pipeline Template (dbt)

```
Sources ─── Staging ─── Intermediate ─── Marts ─── Exposures
   │           │             │             │           │
   │       Raw copy      Business      Aggregated   BI/API
   │       + types       logic         metrics      output
   │
   └── External systems (APIs, files, DBs)
```

### ETL Pipeline Template (Airflow)

```python
# dags/etl_pipeline.py
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'email_on_failure': True,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'etl_orders_daily',
    default_args=default_args,
    description='Daily orders ETL pipeline',
    schedule_interval='@daily',
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['etl', 'orders'],
) as dag:

    extract = PythonOperator(
        task_id='extract_orders',
        python_callable=extract_from_source,
        op_kwargs={'date': '{{ ds }}'},
    )

    validate_source = PythonOperator(
        task_id='validate_source_data',
        python_callable=run_quality_checks,
        op_kwargs={'stage': 'source'},
    )

    transform = PythonOperator(
        task_id='transform_orders',
        python_callable=apply_business_logic,
    )

    validate_transform = PythonOperator(
        task_id='validate_transformed',
        python_callable=run_quality_checks,
        op_kwargs={'stage': 'transform'},
    )

    load = PostgresOperator(
        task_id='load_to_warehouse',
        postgres_conn_id='warehouse',
        sql='sql/load_orders.sql',
    )

    extract >> validate_source >> transform >> validate_transform >> load
```

---

## 3. Streaming Architecture

### Kafka Design Patterns

#### Topic Design

```yaml
topic_naming_convention:
  pattern: "{domain}.{entity}.{event_type}"
  examples:
    - "orders.order.created"
    - "users.profile.updated"
    - "payments.transaction.completed"

topic_configuration:
  partitions:
    rule: "10x expected peak throughput in MB/s"
    minimum: 3
    maximum: 100  # Per topic, practical limit

  retention:
    production: "7d"  # Or based on replay requirements
    compacted: "infinite"  # For state topics

  replication_factor:
    production: 3
    staging: 2
    development: 1
```

#### Consumer Group Design

```yaml
consumer_groups:
  naming: "{service}-{purpose}"
  examples:
    - "analytics-aggregator"
    - "notification-sender"
    - "audit-logger"

  scaling:
    rule: "consumers <= partitions"
    auto_scaling: "based on consumer lag"
```

### Event Schema Design

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["event_id", "event_type", "timestamp", "data"],
  "properties": {
    "event_id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique event identifier for idempotency"
    },
    "event_type": {
      "type": "string",
      "enum": ["created", "updated", "deleted"]
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "version": {
      "type": "integer",
      "default": 1
    },
    "source": {
      "type": "string",
      "description": "Service that produced the event"
    },
    "correlation_id": {
      "type": "string",
      "description": "For tracing across services"
    },
    "data": {
      "type": "object",
      "description": "Event payload"
    }
  }
}
```

### Stream Processing Patterns

#### Pattern 1: Stateless Transform

```python
# Simple mapping, filtering, enrichment
def process_event(event):
    return {
        **event,
        'processed_at': datetime.utcnow().isoformat(),
        'enriched_field': lookup_value(event['key']),
    }
```

#### Pattern 2: Windowed Aggregation

```python
# Flink / Spark Structured Streaming
from pyspark.sql.functions import window, sum, count

orders_stream \
    .withWatermark("event_time", "10 minutes") \
    .groupBy(
        window("event_time", "1 hour", "15 minutes"),
        "store_id"
    ) \
    .agg(
        sum("amount").alias("total_revenue"),
        count("*").alias("order_count")
    )
```

#### Pattern 3: Stream-Table Join

```python
# Enrich stream with dimension table
enriched = orders_stream.join(
    customers_table,
    orders_stream.customer_id == customers_table.id,
    "left"
)
```

---

## 4. dbt Model Design

### Model Layer Structure

```
models/
├── staging/           # 1:1 with source tables
│   ├── stg_orders.sql
│   └── stg_customers.sql
├── intermediate/      # Business logic, joins
│   ├── int_orders_enriched.sql
│   └── int_customer_metrics.sql
├── marts/            # Final business entities
│   ├── core/
│   │   ├── dim_customers.sql
│   │   └── fct_orders.sql
│   └── marketing/
│       └── fct_campaigns.sql
└── exposures/        # BI tool connections
    └── exposures.yml
```

### Staging Model Template

```sql
-- models/staging/stg_orders.sql
{{
    config(
        materialized='view',
        tags=['staging', 'orders']
    )
}}

with source as (
    select * from {{ source('raw', 'orders') }}
),

renamed as (
    select
        -- Primary key
        id as order_id,

        -- Foreign keys
        customer_id,
        store_id,

        -- Dimensions
        status,
        channel,

        -- Measures
        total_amount,
        discount_amount,

        -- Timestamps
        created_at,
        updated_at,

        -- Metadata
        _loaded_at

    from source
)

select * from renamed
```

### Intermediate Model Template

```sql
-- models/intermediate/int_orders_enriched.sql
{{
    config(
        materialized='table',
        tags=['intermediate', 'orders']
    )
}}

with orders as (
    select * from {{ ref('stg_orders') }}
),

customers as (
    select * from {{ ref('stg_customers') }}
),

stores as (
    select * from {{ ref('stg_stores') }}
),

enriched as (
    select
        o.order_id,
        o.customer_id,
        c.customer_name,
        c.customer_segment,
        o.store_id,
        s.store_name,
        s.region,
        o.total_amount,
        o.discount_amount,
        o.total_amount - o.discount_amount as net_amount,
        o.created_at,
        date_trunc('day', o.created_at) as order_date

    from orders o
    left join customers c on o.customer_id = c.customer_id
    left join stores s on o.store_id = s.store_id
)

select * from enriched
```

### dbt Tests

```yaml
# models/staging/schema.yml
version: 2

models:
  - name: stg_orders
    description: "Staged orders from source system"
    columns:
      - name: order_id
        description: "Primary key"
        tests:
          - unique
          - not_null

      - name: customer_id
        description: "Foreign key to customers"
        tests:
          - not_null
          - relationships:
              to: ref('stg_customers')
              field: customer_id

      - name: total_amount
        description: "Order total in cents"
        tests:
          - not_null
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 10000000  # $100,000 max
```

---

## 5. Data Quality Checks

### Quality Check Layers

```
┌─────────────────────────────────────────────────────┐
│                   Source Layer                       │
│  - Freshness (data arrived on time?)                │
│  - Volume (expected row count?)                     │
│  - Schema (columns match?)                          │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                 Transform Layer                      │
│  - Uniqueness (no duplicates?)                      │
│  - Completeness (null checks)                       │
│  - Validity (values in range?)                      │
│  - Consistency (cross-field rules)                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                   Sink Layer                         │
│  - Reconciliation (source vs target counts)         │
│  - Business rules (domain-specific)                 │
│  - Anomaly detection (statistical)                  │
└─────────────────────────────────────────────────────┘
```

### Great Expectations Suite

```python
# great_expectations/expectations/orders_suite.json
{
    "expectation_suite_name": "orders_validation",
    "expectations": [
        {
            "expectation_type": "expect_table_row_count_to_be_between",
            "kwargs": {
                "min_value": 1000,
                "max_value": 1000000
            }
        },
        {
            "expectation_type": "expect_column_values_to_not_be_null",
            "kwargs": {
                "column": "order_id"
            }
        },
        {
            "expectation_type": "expect_column_values_to_be_unique",
            "kwargs": {
                "column": "order_id"
            }
        },
        {
            "expectation_type": "expect_column_values_to_be_between",
            "kwargs": {
                "column": "total_amount",
                "min_value": 0,
                "max_value": 10000000
            }
        },
        {
            "expectation_type": "expect_column_values_to_match_regex",
            "kwargs": {
                "column": "email",
                "regex": "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$"
            }
        }
    ]
}
```

### Quality Gate Integration

```python
# Airflow task with quality gate
def run_quality_gate(**context):
    from great_expectations.core.batch import RuntimeBatchRequest

    result = context.run_checkpoint(
        checkpoint_name="orders_checkpoint",
        batch_request=RuntimeBatchRequest(
            datasource_name="warehouse",
            data_connector_name="default",
            data_asset_name="orders",
        ),
    )

    if not result["success"]:
        raise AirflowException(
            f"Quality check failed: {result['run_results']}"
        )

    return result
```

---

## 6. CDC (Change Data Capture)

### CDC Pattern Selection

| Pattern | Latency | Complexity | Use Case |
|---------|---------|------------|----------|
| **Timestamp-based** | Minutes-Hours | Low | Simple updates with updated_at |
| **Trigger-based** | Seconds | Medium | Legacy DBs without log access |
| **Log-based (Debezium)** | Sub-second | High | Real-time sync, no DB impact |

### Debezium Configuration

```json
{
  "name": "postgres-orders-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "debezium",
    "database.password": "${secrets.db_password}",
    "database.dbname": "orders_db",
    "database.server.name": "orders",
    "table.include.list": "public.orders,public.order_items",
    "plugin.name": "pgoutput",
    "slot.name": "debezium_orders",
    "publication.name": "orders_publication",
    "transforms": "unwrap",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
    "transforms.unwrap.drop.tombstones": "false",
    "key.converter": "org.apache.kafka.connect.json.JsonConverter",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter"
  }
}
```

### CDC Event Structure

```json
{
  "before": null,
  "after": {
    "order_id": 12345,
    "customer_id": 100,
    "total_amount": 9999,
    "status": "completed"
  },
  "source": {
    "version": "2.4.0",
    "connector": "postgresql",
    "name": "orders",
    "ts_ms": 1704067200000,
    "db": "orders_db",
    "schema": "public",
    "table": "orders",
    "txId": 54321,
    "lsn": 123456789
  },
  "op": "c",  // c=create, u=update, d=delete
  "ts_ms": 1704067200100
}
```

---

## 7. Idempotency Patterns

### Idempotency Key Strategy

```python
def generate_idempotency_key(event: dict) -> str:
    """Generate deterministic key for deduplication."""
    components = [
        event['source'],
        event['entity_type'],
        event['entity_id'],
        event['event_type'],
        event['timestamp'][:19],  # Truncate to second
    ]
    return hashlib.sha256('|'.join(components).encode()).hexdigest()
```

### Deduplication Approaches

#### 1. At-Source Deduplication

```python
# Redis-based deduplication
def process_with_dedup(event):
    key = f"processed:{event['event_id']}"

    if redis.exists(key):
        logger.info(f"Duplicate event: {event['event_id']}")
        return None

    result = process_event(event)

    # Mark as processed with TTL
    redis.setex(key, 86400 * 7, "1")  # 7 days

    return result
```

#### 2. At-Sink Deduplication (UPSERT)

```sql
-- PostgreSQL UPSERT
INSERT INTO processed_events (event_id, data, processed_at)
VALUES (%(event_id)s, %(data)s, NOW())
ON CONFLICT (event_id)
DO UPDATE SET
    data = EXCLUDED.data,
    processed_at = NOW()
WHERE processed_events.data IS DISTINCT FROM EXCLUDED.data;
```

#### 3. Exactly-Once with Transactions

```python
# Kafka transactions for exactly-once
producer = KafkaProducer(
    transactional_id='etl-processor-1',
    enable_idempotence=True,
)

producer.init_transactions()

try:
    producer.begin_transaction()
    producer.send('output-topic', value=result)
    producer.send_offsets_to_transaction(
        offsets, consumer_group_id
    )
    producer.commit_transaction()
except Exception:
    producer.abort_transaction()
    raise
```

---

## 8. Backfill Strategy

### Backfill Decision Matrix

| Scenario | Strategy | Time | Risk |
|----------|----------|------|------|
| Schema change only | Reprocess all | Hours | Low |
| Bug fix (recent) | Reprocess affected window | Minutes-Hours | Low |
| Logic change | Full historical reprocess | Hours-Days | Medium |
| New source added | Incremental from start | Days | Low |

### Backfill Playbook Template

```markdown
## Backfill Plan: [Pipeline Name]

### Reason
- [Why backfill is needed]

### Scope
- Start date: YYYY-MM-DD
- End date: YYYY-MM-DD
- Estimated rows: [count]
- Estimated duration: [hours]

### Pre-Backfill Checklist
- [ ] Production pipeline paused
- [ ] Downstream consumers notified
- [ ] Backup of target tables created
- [ ] Monitoring alerts adjusted

### Execution Steps
1. Pause production DAG
2. Clear target partition range
3. Run backfill command:
   ```bash
   airflow dags backfill \
     --start-date YYYY-MM-DD \
     --end-date YYYY-MM-DD \
     --reset-dagruns \
     pipeline_name
   ```
4. Verify row counts
5. Run quality checks
6. Resume production DAG

### Rollback Plan
- Restore from backup: [command]
- Resume from checkpoint: [command]

### Post-Backfill
- [ ] Verify data quality
- [ ] Notify downstream consumers
- [ ] Document in runbook
```

---


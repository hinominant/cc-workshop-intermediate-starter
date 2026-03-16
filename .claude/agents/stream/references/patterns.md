# Stream Collaboration Patterns

## Pattern A: Schema-to-Pipeline Flow

```
Schema → Stream → Builder
```

**Trigger:** New data model designed, pipeline needed
**Flow:**
1. Schema defines source/target models
2. Stream designs ETL/ELT pipeline
3. Builder implements data connectors

**Input from Schema:**
```yaml
source_tables:
  - orders
  - customers
  - products
target_model: fct_sales
```

**Output to Builder:**
```yaml
connector_requirements:
  - api: "orders_api"
    method: "incremental"
    key: "updated_at"
```

---

## Pattern B: Analytics Pipeline Flow

```
Pulse → Stream → Schema
```

**Trigger:** Analytics/KPI requirements need pipeline
**Flow:**
1. Pulse defines metrics and KPIs
2. Stream designs aggregation pipeline
3. Schema creates mart tables

**Input from Pulse:**
```yaml
metrics:
  - name: "daily_revenue"
    grain: "day"
    aggregation: "sum(amount)"
  - name: "customer_ltv"
    grain: "customer"
    window: "lifetime"
```

**Output to Schema:**
```yaml
mart_requirements:
  - name: "fct_daily_revenue"
    columns:
      - date_key
      - total_revenue
      - order_count
    partitioning: "date_key"
```

---

## Pattern C: Pipeline Visualization

```
Stream → Canvas
```

**Trigger:** Pipeline documentation needed
**Flow:**
1. Stream designs pipeline architecture
2. Canvas creates visual documentation

**Output to Canvas:**
```yaml
diagram_type: "data_flow"
components:
  sources: ["PostgreSQL", "S3"]
  processing: ["Kafka", "Spark"]
  sinks: ["Snowflake", "Redis"]
edges:
  - from: "PostgreSQL"
    to: "Kafka"
    label: "CDC"
```

---

## Pattern D: Pipeline Testing

```
Stream → Radar
```

**Trigger:** Pipeline tests needed
**Flow:**
1. Stream defines pipeline specifications
2. Radar creates integration tests

**Output to Radar:**
```yaml
test_requirements:
  - type: "data_quality"
    checks:
      - "row_count > 0"
      - "no_nulls: order_id"
  - type: "integration"
    scenarios:
      - "end_to_end_flow"
      - "backfill_replay"
```

---

## Pattern E: Cost-Aware Pipeline

```
Stream → Scaffold
```

**Trigger:** Infrastructure provisioning needed
**Flow:**
1. Stream defines resource requirements
2. Scaffold provisions infrastructure

**Output to Scaffold:**
```yaml
infrastructure_needs:
  kafka:
    brokers: 3
    storage: "1TB"
  spark:
    workers: 5
    memory: "16GB per worker"
  warehouse:
    type: "Snowflake"
    warehouse_size: "MEDIUM"
```

---

## Orchestration Patterns

### Real-Time Analytics

```
Source DB → Debezium → Kafka → Flink → Redis → Dashboard
```

### Data Warehouse ETL

```
APIs/DBs → Airbyte → Staging → dbt → Marts → BI
```

### ML Feature Pipeline

```
Events → Kafka → Spark → Feature Store → ML Models
                   ↓
             Batch Features
```

### Event Sourcing

```
Commands → Event Store → Projections → Read Models
              ↓
         Event Replay (backfill)
```

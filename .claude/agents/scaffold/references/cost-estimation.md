# Terraform Cost Estimation Reference

Systematic approach to estimating monthly costs from Terraform code. Covers both tool-based (Infracost) and manual estimation methods for AWS and GCP.

---

## Estimation Workflow

```
Read Terraform files
+-- Identify resource blocks
|   +-- Map each resource type to pricing category
|   +-- Extract cost-relevant attributes (instance type, storage size, count, etc.)
+-- Calculate per-resource cost
|   +-- Fixed cost (base charges)
|   +-- Variable cost (usage-based estimates)
+-- Apply environment multipliers
|   +-- dev: minimize (single AZ, small instances, no HA)
|   +-- staging: moderate (production-like but scaled down)
|   +-- prod: full (multi-AZ, HA, backups, monitoring)
+-- Generate cost report
    +-- Per-resource breakdown
    +-- Per-category subtotals
    +-- Environment comparison
    +-- Optimization recommendations
```

---

## Infracost Integration

### Setup

```bash
# Install
brew install infracost  # macOS
curl -fsSL https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | sh  # Linux

# Register (free tier: 1,000 runs/month)
infracost auth login

# Verify
infracost --version
```

### Usage Patterns

```bash
# Single directory estimate
infracost breakdown --path /path/to/terraform

# Compare two states (e.g., before/after a change)
infracost diff --path /path/to/terraform --compare-to infracost-base.json

# Generate base snapshot for comparison
infracost breakdown --path /path/to/terraform --format json --out-file infracost-base.json

# Multi-project (monorepo)
infracost breakdown --config-file infracost.yml
```

### Infracost Config (Monorepo)

```yaml
# infracost.yml
version: 0.1
projects:
  - path: environments/dev
    name: dev
  - path: environments/staging
    name: staging
  - path: environments/prod
    name: prod
```

### CI/CD Integration (GitHub Actions)

```yaml
# .github/workflows/infracost.yml
name: Infracost
on: [pull_request]
jobs:
  infracost:
    runs-on: ubuntu-latest
    permissions: { contents: read, pull-requests: write }
    steps:
      - uses: actions/checkout@v4
      - uses: infracost/actions/setup@v3
        with:
          api-key: ${{ secrets.INFRACOST_API_KEY }}
      - run: infracost breakdown --path=environments/prod --format=json --out-file=/tmp/infracost.json
      - uses: infracost/actions/comment@v1
        with:
          path: /tmp/infracost.json
          behavior: update
```

---

## Manual Estimation: Resource-to-Cost Mapping

When Infracost is unavailable, use these tables to manually estimate costs from Terraform resource blocks.

### How to Read Terraform for Cost

1. **Find resource blocks**: `resource "aws_*"` or `resource "google_*"`
2. **Extract cost attributes**: instance type, storage size, count/for_each, AZ count, etc.
3. **Look up base price** in the tables below
4. **Apply multipliers**: Multi-AZ (x2), count, data transfer estimates
5. **Sum all resources** for total monthly estimate

### Attribute Extraction Patterns

```
resource "aws_instance" "web" {
  instance_type = "t3.medium"    # → Look up instance pricing
  count         = 3               # → Multiply base cost x 3
}

resource "aws_rds_cluster" "main" {
  engine              = "aurora-postgresql"  # → Aurora pricing
  instance_class      = "db.serverless"      # → Serverless v2 ACU pricing
  backup_retention    = 35                   # → Backup storage cost
  deletion_protection = true                 # → (no cost impact)
}

resource "aws_ecs_service" "app" {
  desired_count = 2               # → Tasks x 2
  # Check task_definition for cpu/memory → Fargate pricing
}

resource "google_cloud_run_v2_service" "main" {
  template {
    containers {
      resources {
        limits = { cpu = "1", memory = "512Mi" }  # → Cloud Run pricing
      }
    }
    scaling {
      min_instance_count = 1       # → Always-on cost
      max_instance_count = 10      # → Peak cost estimate
    }
  }
}
```

---

## AWS Pricing Reference (Tokyo Region, ap-northeast-1)

All prices are approximate monthly costs in USD.

### Compute

| Terraform Resource | Attribute | Spec | Monthly |
|--------------------|-----------|------|---------|
| `aws_instance` | `instance_type` | t3.micro | $10 |
| | | t3.small | $20 |
| | | t3.medium | $40 |
| | | t3.large | $80 |
| | | m6i.large | $100 |
| | | m6i.xlarge | $200 |
| | | c6i.large | $85 |
| | | r6i.large | $130 |
| `aws_ecs_service` | cpu/memory (task def) | 0.25 vCPU / 0.5 GB | $15 |
| | | 0.5 vCPU / 1 GB | $30 |
| | | 1 vCPU / 2 GB | $55 |
| | | 2 vCPU / 4 GB | $110 |
| | | 4 vCPU / 8 GB | $220 |
| `aws_lambda_function` | `memory_size` / invocations | 128MB, 1M req, 200ms avg | $0.60 |
| | | 256MB, 1M req, 200ms avg | $1.10 |
| | | 512MB, 10M req, 200ms avg | $18 |
| `aws_apprunner_service` | cpu/memory | 0.25 vCPU / 0.5 GB | $7 (idle) + usage |
| | | 1 vCPU / 2 GB | $20 (idle) + usage |

**Graviton discount**: ARM instances (t4g, m7g, c7g, r7g) are ~20% cheaper than equivalent x86.

### Database

| Terraform Resource | Attribute | Spec | Monthly |
|--------------------|-----------|------|---------|
| `aws_db_instance` | `instance_class` | db.t3.micro | $15 |
| | | db.t3.small | $30 |
| | | db.t3.medium | $60 |
| | | db.r6g.large | $200 |
| | `multi_az = true` | Multiply above x 2 | |
| | `allocated_storage` | Per 100 GB (gp3) | $12 |
| `aws_rds_cluster` (Aurora) | `instance_class` | db.serverless (per ACU-hr) | $0.12/ACU-hr |
| | | Typical: 2-8 ACU avg | $180-720 |
| | | db.r6g.large (provisioned) | $250 |
| `aws_dynamodb_table` | `billing_mode` | On-Demand, light use | $5-20 |
| | | Provisioned, 25 RCU/WCU | $15 |
| `aws_elasticache_cluster` | `node_type` | cache.t3.micro | $15 |
| | | cache.t3.small | $30 |
| | | cache.r6g.large | $165 |

### Networking

| Terraform Resource | Attribute | Spec | Monthly |
|--------------------|-----------|------|---------|
| `aws_lb` (ALB) | type = "application" | Base charge | $20 |
| | | + per LCU | $6-15 |
| `aws_lb` (NLB) | type = "network" | Base charge | $20 |
| `aws_nat_gateway` | per gateway | Base + 10GB transfer | $50 |
| | | Base + 100GB transfer | $90 |
| `aws_vpc_endpoint` | Gateway (S3/DynamoDB) | | Free |
| | Interface | Per endpoint | $8 |
| `aws_cloudfront_distribution` | | 100GB transfer, 10M req | $15 |
| `aws_eip` | unattached | Per hour | $4 |
| `aws_ec2_transit_gateway` | per attachment | Base + per GB | $40/attachment |

### Storage

| Terraform Resource | Attribute | Spec | Monthly |
|--------------------|-----------|------|---------|
| `aws_s3_bucket` | | 100 GB Standard | $3 |
| | | 1 TB Standard | $25 |
| | | 100 GB IA | $1.5 |
| `aws_ebs_volume` | `type` | gp3, 100 GB | $10 |
| | | gp3, 500 GB | $48 |
| | | io2, 100 GB, 3000 IOPS | $30 |
| `aws_efs_file_system` | | 100 GB Standard | $35 |
| `aws_ecr_repository` | | Per GB stored | $0.10/GB |

### Security & Management

| Terraform Resource | Attribute | Spec | Monthly |
|--------------------|-----------|------|---------|
| `aws_secretsmanager_secret` | per secret | + 10K API calls | $0.50 |
| `aws_kms_key` | per key | + 10K requests | $1.10 |
| `aws_wafv2_web_acl` | per ACL | + 1M requests | $7 |
| `aws_cloudwatch_log_group` | ingestion | Per GB ingested | $0.76/GB |
| `aws_cloudwatch_metric_alarm` | per alarm | Standard resolution | $0.10 |

### Free / Negligible Cost Resources

These Terraform resources have no direct cost:
- `aws_iam_*` (roles, policies, users, groups)
- `aws_security_group`, `aws_security_group_rule`
- `aws_route_table`, `aws_route`
- `aws_subnet`, `aws_vpc` (VPC itself is free)
- `aws_internet_gateway`
- `aws_db_subnet_group`
- `aws_ecs_cluster` (cluster itself is free; tasks cost)
- `aws_ecs_task_definition` (definition is free; running tasks cost)
- `aws_cloudwatch_log_group` (group is free; ingestion/storage cost)
- `aws_sns_topic` (first 1M requests free)

---

## GCP Pricing Reference (Tokyo Region, asia-northeast1)

### Compute

| Terraform Resource | Attribute | Spec | Monthly |
|--------------------|-----------|------|---------|
| `google_compute_instance` | `machine_type` | e2-micro | $8 |
| | | e2-small | $15 |
| | | e2-medium | $30 |
| | | e2-standard-2 | $60 |
| | | e2-standard-4 | $120 |
| | | n2-standard-2 | $75 |
| `google_cloud_run_v2_service` | cpu/memory | 1 vCPU, 512 MiB, always-on | $40 |
| | | 1 vCPU, 512 MiB, scale-to-zero | $5-30 (usage) |
| | | 2 vCPU, 1 GiB, always-on | $80 |
| `google_cloudfunctions2_function` | memory/invocations | 256MB, 1M req, 200ms | $1.50 |
| `google_container_cluster` (GKE) | | Management fee (Autopilot) | Free |
| | node pool | e2-standard-4 x 3 nodes | $360 |
| | autopilot | 2 vCPU, 4 GiB (sustained) | $80 |

### Database

| Terraform Resource | Attribute | Spec | Monthly |
|--------------------|-----------|------|---------|
| `google_sql_database_instance` | `tier` | db-f1-micro | $10 |
| | | db-custom-1-3840 | $55 |
| | | db-custom-2-8192 | $130 |
| | | db-custom-4-16384 | $260 |
| | `availability_type = "REGIONAL"` | Multiply above x ~1.8 | |
| | `disk_size` (SSD) | Per 100 GB | $19 |
| `google_alloydb_cluster` | | Base (primary + read pool) | $500+ |
| `google_spanner_instance` | `num_nodes` | Per node | $700 |
| `google_redis_instance` | `memory_size_gb` | 1 GB Basic | $40 |
| | | 5 GB Standard (HA) | $300 |
| `google_firestore_database` | | Light use (100K reads/day) | $5-15 |

### Networking

| Terraform Resource | Attribute | Spec | Monthly |
|--------------------|-----------|------|---------|
| `google_compute_global_forwarding_rule` | | Per forwarding rule | $20 |
| `google_compute_router_nat` | | Gateway + 10GB transfer | $35 |
| | | Gateway + 100GB transfer | $45 |
| `google_compute_global_address` | static IP | External (unused) | $8 |
| `google_compute_security_policy` | Cloud Armor | Policy + 1M req | $12 |
| `google_dns_managed_zone` | | Per zone + queries | $0.25 |

### Storage

| Terraform Resource | Attribute | Spec | Monthly |
|--------------------|-----------|------|---------|
| `google_storage_bucket` | `storage_class` | 100 GB Standard | $2.60 |
| | | 100 GB Nearline | $1.30 |
| | | 1 TB Standard | $26 |
| `google_compute_disk` | `type` | pd-ssd, 100 GB | $19 |
| | | pd-balanced, 100 GB | $11 |
| `google_artifact_registry_repository` | | Per GB stored | $0.10/GB |

### Security & Management

| Terraform Resource | Attribute | Spec | Monthly |
|--------------------|-----------|------|---------|
| `google_secret_manager_secret` | per secret version | + 10K access | $0.06/version |
| `google_kms_crypto_key` | per key version | + 10K operations | $0.06 + ops |
| `google_logging_project_sink` | storage | BigQuery ingestion | $0.05/GB |
| `google_monitoring_alert_policy` | per policy | | Free (basic) |
| `google_pubsub_topic` | | Per 1M messages (small) | $0.04 |

### Free / Negligible Cost Resources

- `google_project_iam_*` (IAM bindings)
- `google_compute_network`, `google_compute_subnetwork`
- `google_compute_firewall`
- `google_service_account`
- `google_container_cluster` (GKE management fee is free for Standard; Autopilot charges per pod)
- `google_project_service` (API enablement)
- `google_org_policy_policy`

---

## Cost Calculation Formulas

### Count / For_each Multiplier

```hcl
# count = N → base_cost x N
resource "aws_nat_gateway" "main" {
  count = length(var.availability_zones)  # If 3 AZs → $50 x 3 = $150/month
}

# for_each → base_cost x length(set)
resource "aws_vpc_endpoint" "interface" {
  for_each = toset(["ecr.api", "ecr.dkr", "secretsmanager", "logs"])  # 4 x $8 = $32/month
}
```

### Conditional Resources

```hcl
# count with condition → cost only if true
resource "aws_nat_gateway" "main" {
  count = var.enable_nat_gateway ? length(var.availability_zones) : 0
  # If false → $0, if true with 2 AZs → $100/month
}

resource "google_sql_database_instance" "read_replica" {
  count = var.enable_read_replica ? 1 : 0
  # If true → add replica cost
}
```

### Environment-Based Cost Variance

```hcl
# Attribute changes by environment affect cost
resource "aws_rds_cluster" "main" {
  backup_retention_period = var.environment == "prod" ? 35 : 7  # More backup storage in prod
  deletion_protection     = var.environment == "prod"           # No cost impact
}

resource "google_sql_database_instance" "main" {
  settings {
    availability_type = var.environment == "prod" ? "REGIONAL" : "ZONAL"
    # REGIONAL ≈ 1.8x ZONAL cost
  }
}

resource "google_cloud_run_v2_service" "main" {
  template {
    scaling {
      min_instance_count = var.environment == "prod" ? 2 : 0
      # Always-on instances = fixed cost; 0 = pay-per-use only
    }
  }
}
```

### ECS Fargate Cost Formula

```
Monthly = desired_count × (vCPU_price × vCPU + memory_price × memory_GB) × 730 hours

Tokyo region:
  vCPU_price  = $0.05056 / vCPU-hour
  memory_price = $0.00553 / GB-hour

Example: 2 tasks × (1 vCPU + 2 GB) = 2 × ($0.05056 + $0.01106) × 730 = $90/month
```

### Lambda Cost Formula

```
Monthly = requests × $0.0000002 + (GB-seconds × $0.0000167)
GB-seconds = requests × (memory_MB / 1024) × avg_duration_sec

Example: 10M requests, 256MB, 200ms average
  Request cost = 10M × $0.0000002 = $2.00
  Compute cost = 10M × (256/1024) × 0.2 × $0.0000167 = $8.35
  Total ≈ $10.35/month
```

### Aurora Serverless v2 Cost Formula

```
Monthly = avg_ACU × $0.12/ACU-hour × 730 hours + storage_GB × $0.12/GB

Example: avg 4 ACU, 50GB storage
  ACU cost = 4 × $0.12 × 730 = $350.40
  Storage  = 50 × $0.12 = $6.00
  Total ≈ $356/month
```

### Cloud Run Cost Formula

```
# Always-on (min_instances > 0):
Monthly = min_instances × (vCPU_price × vCPU + memory_price × memory_GiB) × 730 hours

Tokyo region:
  vCPU_price   = $0.0000324 / vCPU-second (idle: $0.0000324 × 0.1 for cpu_idle=true)
  memory_price = $0.0000035 / GiB-second

# Scale-to-zero (min_instances = 0):
Monthly ≈ avg_active_seconds × instance_count × per-second pricing + request_charges
```

---

## Cost Report Output Template

When estimating costs from Terraform code, produce output in this format:

```markdown
## Cost Estimate: [Project/Module Name]

**Provider**: AWS / GCP
**Region**: ap-northeast-1 / asia-northeast1
**Estimated by**: Manual analysis / Infracost
**Date**: YYYY-MM-DD

### Resource Breakdown

| # | Resource | Terraform Reference | Spec | Count | Monthly (USD) |
|---|----------|-------------------|------|-------|---------------|
| 1 | [type]   | `resource.name`   | [spec] | N   | $XX           |
| 2 | ...      | ...               | ...  | ...   | ...           |
| | | | | **Subtotal** | **$XXX** |

### Category Summary

| Category | Monthly (USD) | % of Total |
|----------|---------------|------------|
| Compute  | $XX           | XX%        |
| Database | $XX           | XX%        |
| Network  | $XX           | XX%        |
| Storage  | $XX           | XX%        |
| Security/Mgmt | $XX      | XX%        |
| **Total** | **$XXX**     | **100%**   |

### Environment Comparison (if applicable)

| Category | Dev | Staging | Prod |
|----------|-----|---------|------|
| Compute  | $XX | $XX     | $XX  |
| Database | $XX | $XX     | $XX  |
| Network  | $XX | $XX     | $XX  |
| Storage  | $XX | $XX     | $XX  |
| **Total** | **$XX** | **$XX** | **$XX** |

### Cost Drivers (top 3)

1. **[Resource]** - $XX/month (XX% of total) — [why it's expensive]
2. **[Resource]** - $XX/month (XX% of total) — [context]
3. **[Resource]** - $XX/month (XX% of total) — [context]

### Optimization Opportunities

| Opportunity | Current Cost | Optimized | Savings | Trade-off |
|-------------|-------------|-----------|---------|-----------|
| [action]    | $XX         | $XX       | $XX     | [impact]  |

### Assumptions

- Traffic/usage estimates: [describe]
- Data transfer: [estimate or excluded]
- Prices based on: [on-demand / savings plan applied]
- Prices as of: [date, approximate]

### Excluded from Estimate

- Data transfer costs (varies by actual usage)
- DNS query costs (typically negligible)
- CloudWatch/Cloud Monitoring detailed metrics
- Support plan costs
```

---

## Quick Estimation Cheat Sheet

For rapid estimation without detailed analysis:

### AWS Typical Stack Costs

| Stack Pattern | Dev | Staging | Prod |
|---------------|-----|---------|------|
| **Minimal** (ALB + Fargate x1 + RDS micro) | $55 | $90 | $180 |
| **Standard** (ALB + Fargate x2 + RDS small + NAT + Redis) | $175 | $280 | $450 |
| **Full** (ALB + Fargate x3 + Aurora + NAT x2 + Redis + CloudFront) | $350 | $550 | $900 |
| **Serverless** (API GW + Lambda + DynamoDB) | $5 | $10 | $30-200 |

### GCP Typical Stack Costs

| Stack Pattern | Dev | Staging | Prod |
|---------------|-----|---------|------|
| **Minimal** (Cloud Run x1 + Cloud SQL micro) | $25 | $70 | $200 |
| **Standard** (Cloud Run x2 + Cloud SQL small + NAT + Redis) | $140 | $250 | $500 |
| **GKE** (Autopilot 3-pod + Cloud SQL + NAT) | $200 | $350 | $600 |
| **Serverless** (Cloud Run scale-to-zero + Firestore) | $5 | $10 | $20-150 |

### High-Cost Warning Thresholds

Flag these resources when encountered — they often dominate the bill:

| Resource | Warning Threshold |
|----------|------------------|
| NAT Gateway (AWS/GCP) | Always flag (~$45-50/gateway) |
| RDS/Cloud SQL Multi-AZ | Flag in dev/staging |
| ElastiCache/Memorystore | Flag if > cache.t3.small / 1GB |
| EKS/GKE Standard nodes | Flag node count > 3 |
| CloudFront/Cloud CDN | Flag if high transfer volume expected |
| Transit Gateway | Flag per-attachment cost |
| VPC Endpoints (Interface) | Flag if > 3 endpoints |
| Cloud Armor Advanced | Flag WAF rules per-request cost |
| Spanner / AlloyDB | Always flag (>$500/month baseline) |

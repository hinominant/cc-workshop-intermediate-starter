# GCP Infrastructure Specialist Reference

Advanced reference for GCP infrastructure design. Provides deep expertise beyond the basic templates in `multicloud-patterns.md`.

---

## 1. Advanced Networking

### Shared VPC

Multiple projects share a host project's network. Centralized network management.

```hcl
# Enable Shared VPC on Host Project
resource "google_compute_shared_vpc_host_project" "host" {
  project = var.host_project_id
}

# Attach Service Projects
resource "google_compute_shared_vpc_service_project" "service" {
  for_each = toset(var.service_project_ids)

  host_project    = var.host_project_id
  service_project = each.value

  depends_on = [google_compute_shared_vpc_host_project.host]
}

# Grant Service Projects subnet access
resource "google_compute_subnetwork_iam_member" "service_access" {
  for_each = toset(var.service_project_ids)

  project    = var.host_project_id
  region     = var.region
  subnetwork = google_compute_subnetwork.shared.name
  role       = "roles/compute.networkUser"
  member     = "serviceAccount:${each.value}@cloudservices.gserviceaccount.com"
}
```

**Decision Criteria**: Shared VPC vs Separate VPCs
- No network isolation needed between teams → Shared VPC (centralized management)
- Fully independent per team → Separate VPC + VPC Peering
- Regulatory requirements mandate network isolation → VPC Service Controls

### VPC Service Controls

Restrict access to GCP services within a security perimeter. Data exfiltration prevention.

```hcl
resource "google_access_context_manager_service_perimeter" "main" {
  parent = "accessPolicies/${var.access_policy_id}"
  name   = "accessPolicies/${var.access_policy_id}/servicePerimeters/${var.perimeter_name}"
  title  = var.perimeter_name

  status {
    resources = [for p in var.protected_projects : "projects/${p}"]

    restricted_services = [
      "bigquery.googleapis.com",
      "storage.googleapis.com",
      "cloudsql.googleapis.com",
    ]

    ingress_policies {
      ingress_from {
        identity_type = "ANY_IDENTITY"
        sources {
          access_level = var.trusted_access_level
        }
      }
      ingress_to {
        resources = ["*"]
        operations {
          service_name = "storage.googleapis.com"
          method_selectors { method = "google.storage.objects.get" }
        }
      }
    }
  }
}
```

### Private Google Access & Private Service Connect

```hcl
# Private Google Access (subnet level)
resource "google_compute_subnetwork" "private" {
  name                     = "${var.project_name}-${var.environment}-private"
  ip_cidr_range            = var.private_cidr
  region                   = var.region
  network                  = google_compute_network.main.id
  private_ip_google_access = true  # Private access to Google APIs
}

# Private Service Connect (connection to private services)
resource "google_compute_global_address" "psc" {
  name         = "${var.project_name}-psc-address"
  purpose      = "PRIVATE_SERVICE_CONNECT"
  address_type = "INTERNAL"
  network      = google_compute_network.main.id
  address      = "10.0.100.1"
}
```

---

## 2. Compute Patterns

### GKE (Deep)

Standard vs Autopilot + Workload Identity configuration.

```hcl
# modules/gcp-gke/main.tf

resource "google_container_cluster" "main" {
  name     = "${var.project_name}-${var.environment}"
  location = var.region
  project  = var.project_id

  # For Autopilot mode
  enable_autopilot = var.use_autopilot

  # For Standard mode only
  dynamic "node_pool" {
    for_each = var.use_autopilot ? [] : [1]
    content {
      name = "default"
      node_config {
        machine_type    = var.node_machine_type
        service_account = google_service_account.gke_node.email
        oauth_scopes    = ["https://www.googleapis.com/auth/cloud-platform"]

        workload_metadata_config {
          mode = "GKE_METADATA"  # Enable Workload Identity
        }
      }
      autoscaling {
        min_node_count = var.min_node_count
        max_node_count = var.max_node_count
      }
    }
  }

  network    = var.network_id
  subnetwork = var.subnetwork_id

  ip_allocation_policy {
    cluster_secondary_range_name  = "gke-pods"
    services_secondary_range_name = "gke-services"
  }

  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = var.master_cidr
  }

  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  release_channel {
    channel = var.environment == "prod" ? "STABLE" : "REGULAR"
  }

  resource_labels = {
    project     = var.project_name
    environment = var.environment
    managed-by  = "terraform"
  }
}

# Workload Identity SA binding
resource "google_service_account_iam_member" "workload_identity" {
  service_account_id = google_service_account.app.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.project_id}.svc.id.goog[${var.k8s_namespace}/${var.k8s_service_account}]"
}
```

**Standard vs Autopilot**:
| Criteria | Standard | Autopilot |
|----------|----------|-----------|
| Node management | Manual (Node Pool) | Automatic |
| Billing | Per node | Per pod |
| GPU | Supported | Supported (with limitations) |
| Customization | High | Limited |
| Recommended for | Advanced customization needed | Most use cases |

### Cloud Run (Advanced)

```hcl
resource "google_cloud_run_v2_service" "main" {
  name     = "${var.project_name}-${var.environment}"
  location = var.region
  project  = var.project_id

  template {
    service_account = google_service_account.app.email

    containers {
      image = var.container_image

      resources {
        limits   = { cpu = var.cpu_limit, memory = var.memory_limit }
        cpu_idle = var.environment != "prod"  # dev/staging: stop CPU when idle
      }

      dynamic "env" {
        for_each = var.environment_variables
        content { name = env.key; value = env.value }
      }

      dynamic "env" {
        for_each = var.secret_variables
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = env.value.secret_id
              version = env.value.version
            }
          }
        }
      }
    }

    scaling {
      min_instance_count = var.environment == "prod" ? var.min_instances : 0
      max_instance_count = var.max_instances
    }

    vpc_access {
      connector = var.vpc_connector_id
      egress    = "PRIVATE_RANGES_ONLY"
    }

    max_instance_request_concurrency = var.concurrency
  }

  labels = {
    project     = var.project_name
    environment = var.environment
    managed-by  = "terraform"
  }
}
```

---

## 3. Database Patterns

### Cloud SQL (Advanced)

```hcl
# modules/gcp-cloudsql/main.tf

resource "google_sql_database_instance" "main" {
  name             = "${var.project_name}-${var.environment}"
  database_version = var.database_version
  region           = var.region
  project          = var.project_id

  settings {
    tier              = var.tier
    availability_type = var.environment == "prod" ? "REGIONAL" : "ZONAL"
    disk_autoresize   = true
    disk_type         = "PD_SSD"

    ip_configuration {
      ipv4_enabled    = false
      private_network = var.network_id
      require_ssl     = true
      enable_private_path_for_google_cloud_services = true
    }

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = var.environment == "prod"
      start_time                     = "18:00" # JST 03:00
      transaction_log_retention_days = var.environment == "prod" ? 7 : 3
      backup_retention_settings {
        retained_backups = var.environment == "prod" ? 30 : 7
        retention_unit   = "COUNT"
      }
    }

    maintenance_window {
      day          = 7 # Sunday
      hour         = 18 # JST 03:00
      update_track = "stable"
    }

    insights_config {
      query_insights_enabled  = true
      query_plans_per_minute  = 5
      query_string_length     = 1024
      record_application_tags = true
      record_client_address   = false
    }

    user_labels = {
      project     = var.project_name
      environment = var.environment
      managed-by  = "terraform"
    }
  }
}

# Read Replica
resource "google_sql_database_instance" "read_replica" {
  count                = var.enable_read_replica ? 1 : 0
  name                 = "${var.project_name}-${var.environment}-replica"
  master_instance_name = google_sql_database_instance.main.name
  database_version     = var.database_version
  region               = var.region
  project              = var.project_id

  replica_configuration { failover_target = false }

  settings {
    tier            = var.tier
    disk_autoresize = true
    disk_type       = "PD_SSD"
    ip_configuration {
      ipv4_enabled    = false
      private_network = var.network_id
      require_ssl     = true
    }
  }
}
```

### AlloyDB vs Cloud SQL vs Spanner

| Requirement | Cloud SQL | AlloyDB | Cloud Spanner |
|-------------|-----------|---------|---------------|
| Use case | General OLTP | High-performance PostgreSQL | Global distribution, strong consistency |
| Scaling | Vertical (up to 96 vCPU) | Vertical + read pools | Horizontal (unlimited) |
| Availability | 99.95% | 99.99% | 99.999% (multi-region) |
| Cost estimate (monthly) | $50+ | $500+ | $2,000+ |
| PostgreSQL compatible | Full | Full | Not compatible (proprietary SQL) |
| Recommended for | Standard web apps | Mixed analytics + transactional | Finance, gaming, global apps |

---

## 4. Storage & CDN

### Cloud Storage (Advanced)

```hcl
resource "google_storage_bucket" "main" {
  name     = "${var.project_id}-${var.project_name}-${var.environment}"
  location = var.region
  project  = var.project_id

  storage_class               = "STANDARD"
  uniform_bucket_level_access = true

  versioning { enabled = var.environment == "prod" }

  lifecycle_rule {
    condition { age = 90 }
    action { type = "SetStorageClass"; storage_class = "NEARLINE" }
  }

  lifecycle_rule {
    condition { age = 365 }
    action { type = "SetStorageClass"; storage_class = "COLDLINE" }
  }

  lifecycle_rule {
    condition { num_newer_versions = 3; with_state = "ARCHIVED" }
    action { type = "Delete" }
  }

  labels = { project = var.project_name, environment = var.environment, managed-by = "terraform" }
}
```

**Storage Class Selection Criteria**:
- **STANDARD**: Frequently accessed data
- **NEARLINE**: Accessed ~once per month (30-day minimum storage)
- **COLDLINE**: Accessed ~once per quarter (90-day minimum)
- **ARCHIVE**: Accessed less than once per year (365-day minimum)

### Cloud Armor (WAF + DDoS Protection)

```hcl
resource "google_compute_security_policy" "main" {
  name    = var.policy_name
  project = var.project_id

  rule {
    action   = "allow"
    priority = "2147483647"
    match { versioned_expr = "SRC_IPS_V1"; config { src_ip_ranges = ["*"] } }
    description = "Default allow"
  }

  # OWASP Top 10 protection
  rule {
    action   = "deny(403)"
    priority = "1000"
    match { expr { expression = "evaluatePreconfiguredExpr('sqli-v33-stable')" } }
    description = "Block SQL injection"
  }

  rule {
    action   = "deny(403)"
    priority = "1001"
    match { expr { expression = "evaluatePreconfiguredExpr('xss-v33-stable')" } }
    description = "Block XSS"
  }

  # Rate limiting
  rule {
    action   = "throttle"
    priority = "2000"
    match { versioned_expr = "SRC_IPS_V1"; config { src_ip_ranges = ["*"] } }
    rate_limit_options {
      conform_action = "allow"
      exceed_action  = "deny(429)"
      rate_limit_threshold { count = 100; interval_sec = 60 }
    }
    description = "Rate limit: 100 req/min per IP"
  }
}
```

---

## 5. Messaging & Events

### Pub/Sub

```hcl
resource "google_pubsub_topic" "main" {
  name    = var.topic_name
  project = var.project_id
  message_retention_duration = "86400s"
  labels = { managed-by = "terraform" }
}

resource "google_pubsub_topic" "dead_letter" {
  name    = "${var.topic_name}-dead-letter"
  project = var.project_id
  labels = { managed-by = "terraform", purpose = "dead-letter" }
}

resource "google_pubsub_subscription" "main" {
  for_each = var.subscriptions

  name    = each.key
  topic   = google_pubsub_topic.main.id
  project = var.project_id

  ack_deadline_seconds       = each.value.ack_deadline
  message_retention_duration = each.value.retention_duration
  enable_message_ordering    = each.value.enable_ordering

  dead_letter_policy {
    dead_letter_topic     = google_pubsub_topic.dead_letter.id
    max_delivery_attempts = each.value.max_delivery_attempts
  }

  retry_policy {
    minimum_backoff = "10s"
    maximum_backoff = "600s"
  }
}
```

### Cloud Tasks vs Pub/Sub

| Aspect | Pub/Sub | Cloud Tasks |
|--------|---------|-------------|
| Pattern | 1:N (fan-out) | 1:1 (task queue) |
| Rate control | None | Available (QPS limiting) |
| Scheduled execution | None | Available (delayed delivery) |
| Recommended for | Event notifications, streaming | API call throttling, batch processing |

### Workflows

Orchestration of multiple services. Sequenced control of Cloud Run / Cloud Functions / API calls.

```yaml
# workflow.yaml - Example: Order processing pipeline
main:
  params: [input]
  steps:
    - validate_order:
        call: http.post
        args:
          url: ${VALIDATE_URL}
          body: ${input}
        result: validation_result
    - check_validation:
        switch:
          - condition: ${validation_result.body.valid == true}
            next: process_payment
          - condition: ${validation_result.body.valid == false}
            raise: ${validation_result.body.error}
    - process_payment:
        call: http.post
        args:
          url: ${PAYMENT_URL}
          body:
            order_id: ${input.order_id}
            amount: ${input.amount}
```

---

## 6. IAM & Security (Advanced)

### Organization Policies

```hcl
# Region restriction
resource "google_org_policy_policy" "restrict_regions" {
  name   = "organizations/${var.org_id}/policies/gcp.resourceLocations"
  parent = "organizations/${var.org_id}"
  spec {
    rules {
      values { allowed_values = ["in:asia-northeast1-locations", "in:asia-northeast2-locations"] }
    }
  }
}

# Enforce uniform bucket-level access
resource "google_org_policy_policy" "uniform_bucket_access" {
  name   = "organizations/${var.org_id}/policies/storage.uniformBucketLevelAccess"
  parent = "organizations/${var.org_id}"
  spec { rules { enforce = "TRUE" } }
}

# Restrict external IP addresses
resource "google_org_policy_policy" "disable_external_ip" {
  name   = "organizations/${var.org_id}/policies/compute.vmExternalIpAccess"
  parent = "organizations/${var.org_id}"
  spec { rules { deny_all = "TRUE" } }
}
```

### Workload Identity Federation (GitHub Actions)

Eliminate service account keys; use short-lived authentication tokens via OIDC.

```hcl
resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "github-actions"
  display_name              = "GitHub Actions"
  project                   = var.project_id
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-oidc"
  display_name                       = "GitHub OIDC"
  project                            = var.project_id

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
  }

  attribute_condition = "assertion.repository == '${var.github_org}/${var.github_repo}'"

  oidc { issuer_uri = "https://token.actions.githubusercontent.com" }
}

resource "google_service_account" "github_actions" {
  account_id   = var.service_account_id
  display_name = "GitHub Actions SA for ${var.github_org}/${var.github_repo}"
  project      = var.project_id
}

resource "google_service_account_iam_member" "workload_identity" {
  service_account_id = google_service_account.github_actions.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/projects/${var.project_number}/locations/global/workloadIdentityPools/github-actions/attribute.repository/${var.github_org}/${var.github_repo}"
}
```

GitHub Actions side:
```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    permissions: { contents: read, id-token: write }
    steps:
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions/providers/github-oidc
          service_account: deploy-sa@PROJECT_ID.iam.gserviceaccount.com
```

---

## 7. Observability

### Cloud Monitoring & Logging

```hcl
# Alert Policy: Cloud Run error rate
resource "google_monitoring_alert_policy" "cloudrun_error_rate" {
  display_name = "${var.project_name}-${var.environment} Cloud Run Error Rate"
  combiner     = "OR"
  project      = var.project_id

  conditions {
    display_name = "Error rate > 5%"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/request_count\" AND metric.labels.response_code_class != \"2xx\""
      comparison      = "COMPARISON_GT"
      threshold_value = 5
      duration        = "300s"
      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_RATE"
        cross_series_reducer = "REDUCE_SUM"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.name]
}

# Log Sink: Forward audit logs to BigQuery
resource "google_logging_project_sink" "audit_to_bigquery" {
  name        = "${var.project_name}-${var.environment}-audit-sink"
  project     = var.project_id
  destination = "bigquery.googleapis.com/projects/${var.project_id}/datasets/${google_bigquery_dataset.audit_logs.dataset_id}"
  filter      = "logName:\"cloudaudit.googleapis.com\" OR logName:\"activity\""
  unique_writer_identity = true
  bigquery_options { use_partitioned_tables = true }
}

# Log Exclusion Filter (cost reduction)
resource "google_logging_project_exclusion" "debug_logs" {
  count       = var.environment == "prod" ? 1 : 0
  name        = "exclude-debug-logs"
  project     = var.project_id
  description = "Exclude debug-level logs in production"
  filter      = "severity = DEBUG"
}
```

---

## 8. Cost Optimization (GCP-Specific)

### Cost Reference (Tokyo Region, approximate)

| Resource | Spec | Monthly (USD) |
|----------|------|---------------|
| **Cloud Run** | 0.5 vCPU, 256 MiB, 1M requests | $20-50 |
| **Cloud SQL** | db-custom-2-8192 (HA) | $250 |
| **Cloud SQL** | db-custom-2-8192 (Single) | $130 |
| **GKE Autopilot** | 2 vCPU, 4 GiB (always-on) | $80 |
| **GKE Standard** | e2-standard-4 x 3 nodes | $300 |
| **Cloud Storage** | 100 GB (Standard) | $2.6 |
| **Cloud NAT** | Gateway + 1 GB transfer | $35 |
| **Cloud Armor** | Policy + 1M requests | $12 |
| **Pub/Sub** | 1M messages | $0.04 |

### CUD (Committed Use Discounts)

| Type | Discount | Applicable to |
|------|----------|---------------|
| Resource-based | 1-year: 37%, 3-year: 55% | vCPU, memory (GCE, GKE Standard) |
| Spend-based | 1-year: 25%, 3-year: 52% | Cloud SQL, Cloud Run (partial) |

### Environment-Specific Cost Optimization Patterns

| Pattern | Dev | Staging | Prod |
|---------|-----|---------|------|
| Cloud SQL | Single-AZ, small tier | Single-AZ | Regional HA |
| Cloud Run min_instances | 0 | 0 | 1-2 |
| GKE nodes | Spot VMs only | Spot + On-demand | On-demand + Spot (burst) |
| Cloud NAT | Remove if unnecessary | Shared | Dedicated |
| Log retention | 7 days | 30 days | 90-365 days |
| Cloud Armor | Not needed | Basic | Full WAF |

---

## 9. Cloud Architecture Framework Quick Reference

| Pillar | Key Points | Key Practices |
|--------|-----------|---------------|
| **System Design** | Region/zone selection, redundancy | Multi-zone / multi-region configuration |
| **Operational Excellence** | SRE practices, error budgets | SLI/SLO definition, automated incident response |
| **Security** | Zero trust, BeyondCorp | Workload Identity, VPC SC, IAP |
| **Reliability** | Disaster recovery, chaos engineering | Multi-region failover |
| **Cost Optimization** | CUDs, right-sizing | Label-based cost allocation, Active Assist |
| **Performance** | Caching, CDN, global LB | Cloud CDN, Memorystore |

---

## 10. GCP Service Decision Matrix

| Use Case | Recommended | Alternative | Avoid |
|----------|-------------|-------------|-------|
| Web API (stateless) | Cloud Run | GKE Autopilot (when K8s required) | Compute Engine |
| Batch processing | Cloud Run Jobs | Dataflow (streaming) | Compute Engine |
| Static site | Cloud Storage + CDN | Firebase Hosting | Compute Engine |
| Message queue | Pub/Sub | Cloud Tasks (when rate control needed) | Self-managed Kafka |
| Relational DB | Cloud SQL | AlloyDB (high-performance requirements) | Self-managed on GCE |
| NoSQL | Firestore (Native mode) | Bigtable (large-scale analytics data) | Datastore mode (new projects) |
| Container orchestration | Cloud Run | GKE Autopilot | GKE Standard (unless requirements demand it) |
| Data warehouse | BigQuery | AlloyDB (HTAP) | Cloud SQL |
| CI/CD | Cloud Build | GitHub Actions + WIF | Jenkins on GCE |
| Secrets management | Secret Manager | - | Hardcoded in environment variables |

**Selection Principles**:
- Serverless-first (Cloud Run > GKE > GCE)
- Prefer managed services
- Thorough labeling for cost visibility

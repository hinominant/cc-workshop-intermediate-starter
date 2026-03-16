# AWS Infrastructure Specialist Reference

Advanced reference for AWS infrastructure design. Provides deep expertise beyond the basic templates in `terraform-modules.md`.

---

## 1. Advanced Networking

### Transit Gateway

Hub for multi-VPC connectivity. Centralized inter-VPC communication via Hub-and-Spoke architecture.

```hcl
# modules/transit-gateway/main.tf

resource "aws_ec2_transit_gateway" "main" {
  description                     = "${var.project_name} Transit Gateway"
  default_route_table_association = "disable"
  default_route_table_propagation = "disable"
  dns_support                     = "enable"

  tags = merge(var.common_tags, {
    Name = "${var.project_name}-tgw"
  })
}

resource "aws_ec2_transit_gateway_route_table" "shared" {
  transit_gateway_id = aws_ec2_transit_gateway.main.id
  tags = merge(var.common_tags, { Name = "${var.project_name}-shared-rt" })
}

resource "aws_ec2_transit_gateway_vpc_attachment" "spoke" {
  for_each = var.spoke_vpcs

  subnet_ids         = each.value.subnet_ids
  transit_gateway_id = aws_ec2_transit_gateway.main.id
  vpc_id             = each.value.vpc_id

  tags = merge(var.common_tags, { Name = "${var.project_name}-${each.key}" })
}
```

**Decision Criteria**: VPC Peering vs Transit Gateway
- 3 or fewer VPCs → VPC Peering (simple, cost-effective)
- 4 or more VPCs → Transit Gateway (scalable)
- On-premises connectivity → Transit Gateway (Direct Connect integration)

### AWS PrivateLink

Private access to AWS services via VPC Endpoints.

| Endpoint Type | Target | Cost |
|--------------|------|--------|
| **Gateway** | S3, DynamoDB | Free |
| **Interface** | Others (ECR, Secrets Manager, SQS, etc.) | $7.5/month + data transfer |

```hcl
# Gateway Endpoint (S3) - Free
resource "aws_vpc_endpoint" "s3" {
  vpc_id       = var.vpc_id
  service_name = "com.amazonaws.${var.region}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = var.private_route_table_ids
  tags = var.common_tags
}

# Interface Endpoint (ECR, Secrets Manager, etc.)
resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${var.region}.ecr.api"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = var.private_subnet_ids
  security_group_ids  = [aws_security_group.vpc_endpoint.id]
  private_dns_enabled = true
  tags = var.common_tags
}
```

---

## 2. Compute Patterns

### ECS Fargate (Deep)

Production configuration with ALB + Auto Scaling + Blue/Green deployment support.

```hcl
# modules/ecs-fargate/main.tf

resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  configuration {
    execute_command_configuration {
      logging = "OVERRIDE"
      log_configuration {
        cloud_watch_log_group_name = aws_cloudwatch_log_group.ecs_exec.name
      }
    }
  }

  tags = var.common_tags
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name       = aws_ecs_cluster.main.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = var.environment == "prod" ? "FARGATE" : "FARGATE_SPOT"
    weight            = 1
    base              = var.environment == "prod" ? 1 : 0
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = var.use_graviton ? "ARM64" : "X86_64"
  }

  container_definitions = jsonencode([{
    name  = "app"
    image = var.container_image
    portMappings = [{ containerPort = var.app_port, protocol = "tcp" }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.app.name
        "awslogs-region"        = var.region
        "awslogs-stream-prefix" = "app"
      }
    }
    secrets = [for s in var.secrets : {
      name      = s.name
      valueFrom = s.value_from
    }]
    environment = [for e in var.environment_variables : {
      name  = e.name
      value = e.value
    }]
    healthCheck = {
      command     = ["CMD-SHELL", "curl -f http://localhost:${var.app_port}/health || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }
  }])

  tags = var.common_tags
}

resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-${var.environment}"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.desired_count

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.app.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = var.app_port
  }

  tags = var.common_tags
}

# Auto Scaling
resource "aws_appautoscaling_target" "ecs" {
  max_capacity       = var.max_count
  min_capacity       = var.min_count
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "cpu" {
  name               = "${var.project_name}-${var.environment}-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
```

### Lambda

```hcl
# modules/lambda-api/main.tf

resource "aws_lambda_function" "api" {
  function_name = "${var.project_name}-${var.environment}-api"
  role          = aws_iam_role.lambda.arn
  handler       = var.handler
  runtime       = var.runtime
  architectures = [var.use_graviton ? "arm64" : "x86_64"]
  timeout       = var.timeout
  memory_size   = var.memory_size

  filename         = var.deployment_package
  source_code_hash = filebase64sha256(var.deployment_package)

  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = var.environment_variables
  }

  tracing_config {
    mode = "Active"
  }

  tags = var.common_tags
}

# SQS Event Source Mapping
resource "aws_lambda_event_source_mapping" "sqs" {
  for_each = var.sqs_event_sources

  event_source_arn                   = each.value.arn
  function_name                      = aws_lambda_function.api.arn
  batch_size                         = each.value.batch_size
  maximum_batching_window_in_seconds = each.value.batching_window

  function_response_types = ["ReportBatchItemFailures"]
}
```

### Compute Service Selection Matrix

| Use Case | ECS Fargate | Lambda | App Runner | EKS |
|----------|-------------|--------|------------|-----|
| Web API (always-on) | **Recommended** | - | OK for small scale | When K8s required |
| Web API (low traffic) | - | **Recommended** | **Recommended** | - |
| Batch processing (short) | - | **Recommended** | - | - |
| Batch processing (long) | **Recommended** | 15-min limit | - | Possible |
| GPU workloads | - | - | - | **Recommended** |
| Existing K8s migration | - | - | - | **Recommended** |

---

## 3. Database Patterns

### Aurora (PostgreSQL/MySQL)

```hcl
# modules/aurora/main.tf

resource "aws_rds_cluster" "main" {
  cluster_identifier = "${var.project_name}-${var.environment}"
  engine             = "aurora-postgresql"
  engine_version     = var.engine_version
  database_name      = var.database_name

  master_username                     = var.master_username
  manage_master_user_password         = true  # Auto-managed via Secrets Manager
  iam_database_authentication_enabled = true

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.aurora.id]

  backup_retention_period      = var.environment == "prod" ? 35 : 7
  preferred_backup_window      = "03:00-04:00"
  skip_final_snapshot          = var.environment != "prod"
  deletion_protection          = var.environment == "prod"
  storage_encrypted            = true
  copy_tags_to_snapshot        = true

  enabled_cloudwatch_logs_exports = ["postgresql"]

  serverlessv2_scaling_configuration {
    min_capacity = var.min_acu
    max_capacity = var.max_acu
  }

  tags = var.common_tags
}

resource "aws_rds_cluster_instance" "main" {
  count = var.instance_count

  identifier         = "${var.project_name}-${var.environment}-${count.index + 1}"
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version

  monitoring_interval          = 60
  monitoring_role_arn          = aws_iam_role.rds_monitoring.arn
  performance_insights_enabled = true

  tags = var.common_tags
}
```

### DynamoDB

**Capacity Mode Selection Criteria**:
- **On-Demand (PAY_PER_REQUEST)**: Unpredictable traffic, frequent spikes, dev environments
- **Provisioned + Auto Scaling**: Stable traffic, cost-optimized production environments

```hcl
resource "aws_dynamodb_table" "main" {
  name         = "${var.project_name}-${var.environment}-${var.table_name}"
  billing_mode = var.billing_mode
  hash_key     = var.hash_key
  range_key    = var.range_key

  point_in_time_recovery { enabled = var.environment == "prod" }
  server_side_encryption  { enabled = true }

  tags = var.common_tags
}
```

---

## 4. Storage & CDN

### S3 Advanced

```hcl
# Lifecycle policy (cost optimization)
resource "aws_s3_bucket_lifecycle_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    id     = "intelligent-tiering"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "INTELLIGENT_TIERING"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

# Restrict access to VPC Endpoint only
resource "aws_s3_bucket_policy" "vpc_only" {
  count  = var.restrict_to_vpc_endpoint ? 1 : 0
  bucket = aws_s3_bucket.main.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "RestrictToVPCEndpoint"
      Effect    = "Deny"
      Principal = "*"
      Action    = "s3:*"
      Resource  = [aws_s3_bucket.main.arn, "${aws_s3_bucket.main.arn}/*"]
      Condition = {
        StringNotEquals = { "aws:sourceVpce" = var.vpc_endpoint_id }
      }
    }]
  })
}
```

### CloudFront

Distribution with S3 + ALB origins. Secure S3 access via OAC (Origin Access Control).

```hcl
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = var.domain_names
  web_acl_id          = var.waf_web_acl_arn

  origin {
    domain_name              = var.s3_bucket_regional_domain_name
    origin_id                = "s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    cache_policy_id        = aws_cloudfront_cache_policy.static.id
  }

  # SPA support: 404 -> index.html
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  tags = var.common_tags
}

resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "${var.project_name}-${var.environment}-s3-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
```

---

## 5. Messaging & Events

### SQS

| Criteria | Standard Queue | FIFO Queue |
|----------|---------------|------------|
| Throughput | Nearly unlimited | 300 msg/sec (3000 with batching) |
| Ordering | Best effort | Strict (per MessageGroupId) |
| Deduplication | None | 5-min deduplication window |
| Recommended for | General async processing | When ordering/idempotency required |

```hcl
resource "aws_sqs_queue" "main" {
  name                       = var.fifo ? "${var.queue_name}.fifo" : var.queue_name
  fifo_queue                 = var.fifo
  visibility_timeout_seconds = var.visibility_timeout
  receive_wait_time_seconds  = 20  # Long polling

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = var.max_receive_count
  })

  sqs_managed_sse_enabled = true
  tags = var.common_tags
}

resource "aws_sqs_queue" "dlq" {
  name                      = var.fifo ? "${var.queue_name}-dlq.fifo" : "${var.queue_name}-dlq"
  fifo_queue                = var.fifo
  message_retention_seconds = 1209600  # 14 days
  sqs_managed_sse_enabled   = true
  tags = var.common_tags
}
```

### EventBridge

```hcl
resource "aws_cloudwatch_event_rule" "app_events" {
  name = "${var.project_name}-${var.environment}-app-events"

  event_pattern = jsonencode({
    source      = ["${var.project_name}.app"]
    detail-type = var.event_types
  })

  tags = var.common_tags
}
```

### Step Functions

**Use Cases**: Orchestration of multiple Lambda/ECS tasks, long-running workflows, processing pipelines requiring error retry/branching.

Decision criteria: SQS + Lambda is sufficient for simple async processing. Consider Step Functions when 3+ steps with conditional branching/retry are needed.

---

## 6. IAM & Security (Advanced)

### Organizations & Service Control Policies

```json
// SCP denying operations outside approved regions from production accounts
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyNonApprovedRegions",
    "Effect": "Deny",
    "NotAction": ["iam:*", "sts:*", "organizations:*", "support:*", "cloudfront:*", "route53:*", "wafv2:*"],
    "Resource": "*",
    "Condition": {
      "StringNotEquals": {
        "aws:RequestedRegion": ["ap-northeast-1", "us-east-1"]
      }
    }
  }]
}
```

**Multi-Account Strategy (Recommended)**:
- **Management Account**: Organizations management only
- **Security Account**: CloudTrail aggregation, GuardDuty, SecurityHub
- **Log Archive Account**: Log aggregation from all accounts
- **Shared Services Account**: Transit Gateway, DNS
- **Workload Accounts**: dev / staging / prod

### Permission Boundaries

```hcl
resource "aws_iam_policy" "permission_boundary" {
  name = "${var.project_name}-permission-boundary"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "AllowedServices"
        Effect   = "Allow"
        Action   = ["s3:*", "dynamodb:*", "sqs:*", "sns:*", "lambda:*", "logs:*", "ecr:*", "ecs:*"]
        Resource = "*"
      },
      {
        Sid      = "DenyIAMWithoutBoundary"
        Effect   = "Deny"
        Action   = ["iam:CreateRole", "iam:PutRolePermissionsBoundary", "iam:DeleteRolePermissionsBoundary"]
        Resource = "*"
        Condition = {
          StringNotEquals = {
            "iam:PermissionsBoundary" = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/${var.project_name}-permission-boundary"
          }
        }
      }
    ]
  })
}
```

### Cross-Account Access

```hcl
resource "aws_iam_role" "cross_account" {
  name = "${var.project_name}-cross-account-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { AWS = "arn:aws:iam::${var.trusted_account_id}:root" }
      Action    = "sts:AssumeRole"
      Condition = { StringEquals = { "sts:ExternalId" = var.external_id } }
    }]
  })
}
```

---

## 7. Observability

### CloudWatch Logs Insights Common Queries

```
# Error log aggregation (last 1 hour)
fields @timestamp, @message
| filter @message like /ERROR/
| stats count(*) as error_count by bin(5m)

# Latency distribution
fields @timestamp, @duration
| stats avg(@duration) as avg_ms, pct(@duration, 95) as p95_ms, pct(@duration, 99) as p99_ms by bin(5m)

# Lambda cold start detection
filter @type = "REPORT"
| fields @requestId, @duration, @billedDuration, @initDuration
| filter ispresent(@initDuration)
| stats count(*) as cold_starts, avg(@initDuration) as avg_init_ms by bin(1h)
```

---

## 8. Cost Optimization (AWS-Specific)

### Savings Plans vs Reserved Instances

| Criteria | Compute Savings Plans | EC2 Instance SP | Reserved Instances |
|----------|----------------------|-----------------|-------------------|
| Flexibility | Highest (EC2, Fargate, Lambda) | EC2 only | EC2 only (fully fixed) |
| Discount | ~30% | ~40% | ~40-60% |
| Recommended for | Environments using Fargate/Lambda | EC2-heavy with flexibility needed | Long-term stable workloads |

**Recommended priority**: Compute Savings Plans > EC2 Instance SP > Reserved Instances

### Graviton (ARM) Instances

~20% cost reduction on supported services with comparable or better performance.

| Service | Graviton Support | Instance Examples |
|---------|-----------------|------------------|
| EC2 | Supported | t4g, m7g, c7g, r7g |
| RDS | Supported | db.t4g, db.r7g |
| ElastiCache | Supported | cache.t4g, cache.r7g |
| ECS Fargate | Supported | `cpuArchitecture = "ARM64"` |
| Lambda | Supported | `architectures = ["arm64"]` |

### Right-Sizing Checklist

1. Enable **AWS Compute Optimizer** (free)
2. Monitor CPU/Memory utilization in CloudWatch for 2+ weeks
3. Average utilization under 40% → consider downsizing by 1 tier
4. Review Trusted Advisor Cost Optimization checks regularly
5. Consider automatic shutdown during nights/weekends for dev/staging

---

## 9. Well-Architected Framework Quick Reference

| Pillar | Key Terraform Patterns | Checkpoints |
|--------|----------------------|-------------|
| **Operational Excellence** | 100% IaC coverage, CI/CD, CloudWatch dashboards | Aim for zero manual operations |
| **Security** | IAM least privilege, VPC Endpoint, encryption, SCPs | No 0.0.0.0/0 in security groups |
| **Reliability** | Multi-AZ, Auto Scaling, automated backups | Define RTO/RPO before designing |
| **Performance Efficiency** | Graviton, CloudFront caching, Aurora Serverless v2 | Size after benchmarking |
| **Cost Optimization** | Savings Plans, Fargate Spot, S3 Lifecycle | Conduct monthly cost reviews |
| **Sustainability** | Serverless-first, right-sizing, remove unused resources | Maximize compute efficiency |

---

## 10. AWS Service Decision Matrix

| Use Case | Recommended | Alternative | Avoid |
|----------|-------------|-------------|-------|
| Web API (always-on) | ECS Fargate | EKS (when K8s required) | Direct EC2 management |
| Web API (low traffic) | Lambda + API GW v2 | App Runner | ECS (overkill) |
| Batch processing (short) | Lambda | Step Functions + Lambda | EC2 |
| Batch processing (long) | ECS Tasks (RunTask) | Step Functions + ECS | Lambda (15-min limit) |
| Static site / SPA | S3 + CloudFront | Amplify Hosting | EC2 + Nginx |
| Message queue | SQS | SNS + SQS (fan-out) | Self-managed RabbitMQ on EC2 |
| Event routing | EventBridge | SNS | Self-managed Kafka (at small scale) |
| Relational DB | Aurora Serverless v2 | RDS | Self-managed DB on EC2 |
| NoSQL | DynamoDB | ElastiCache (cache) | MongoDB on EC2 |
| Container orchestration | ECS Fargate | EKS (when K8s required) | ECS EC2 launch type |

**Selection Principles**:
- Consider serverless-first (minimize operational overhead)
- Prefer managed services (focus on differentiation)
- Avoid over-engineering (scale up when needed)

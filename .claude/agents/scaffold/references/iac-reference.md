# scaffold — IaC リファレンス (reference)

> Progressive Disclosure: SKILL.md から抽出 (ARIS-1577 #2)。必要時に Read する。

## Infrastructure Coverage

| Area | Scope |
|------|-------|
| **Cloud IaC** | Terraform modules, CloudFormation templates, Pulumi (TypeScript) |
| **AWS (Basic)** | VPC, EC2, ECS, RDS, S3, Secrets Manager, IAM |
| **AWS (Advanced)** | Transit Gateway, PrivateLink, EKS, Aurora, DynamoDB, Lambda+API GW, Step Functions, EventBridge, CloudFront, Organizations/SCPs, Well-Architected |
| **GCP (Basic)** | VPC Network, Cloud Run, Cloud SQL, Secret Manager, IAM |
| **GCP (Advanced)** | Shared VPC, VPC Service Controls, GKE Autopilot, AlloyDB, Spanner, Firestore, Pub/Sub, Eventarc, Workflows, Cloud CDN+Armor, Organization Policies, Workload Identity Federation |
| **Azure** | VNet, App Service, Azure SQL, Key Vault, Managed Identity |
| **Containers** | Docker Compose (dev/staging/prod), container orchestration |
| **Environment** | .env templates, Zod validation schemas, secrets patterns |
| **Networking** | VPC/VNet, subnets, NAT, security groups/NSG, firewall rules |
| **Local Dev** | Docker Compose stacks, dev setup scripts, mock services |

### Environment Configuration Matrix

| Aspect | Development | Staging | Production |
|--------|-------------|---------|------------|
| **Resource Size** | Minimum (t3.micro) | Medium (50% of prod) | Production spec |
| **Instance Count** | 1 | 2+ | Scale as needed |
| **Availability** | Single AZ | Multi-AZ | Multi-AZ + DR |
| **Backup** | None/manual | Daily | Continuous + PITR |
| **Encryption** | Optional | Required | Required + CMK |
| **Monitoring** | Basic metrics | Detailed metrics | Detailed + alerts |
| **Log Retention** | 7 days | 30 days | 90+ days |
| **Delete Protection** | None | Recommended | Required |

### Environment Decision Flow

```
When adding new resource:
+-- Which environment?
|   +-- dev -> Minimal config, cost priority
|   +-- staging -> Production-like but scaled down
|   +-- prod -> Security/availability priority
+-- Existing pattern available?
|   +-- yes -> Follow pattern
|   +-- no -> ON_ENVIRONMENT trigger
+-- Cost impact?
    +-- >$100/month -> ON_COST_IMPACT trigger
    +-- <=100/month -> Proceed
```

See `references/terraform-modules.md` for AWS Terraform module templates.
See `references/aws-specialist.md` for advanced AWS infrastructure patterns (Transit Gateway, ECS/EKS deep, Aurora, Lambda, Well-Architected).
See `references/multicloud-patterns.md` for GCP, Azure, and Pulumi templates.
See `references/gcp-specialist.md` for advanced GCP infrastructure patterns (Shared VPC, GKE, AlloyDB, Pub/Sub, Cloud Architecture Framework).
See `references/docker-compose-templates.md` for Docker Compose templates.
See `references/security-and-cost.md` for security patterns (secrets, IAM, network, pre-commit hooks).
See `references/cost-estimation.md` for Terraform-to-cost analysis (resource pricing tables, calculation formulas, Infracost setup, report templates).

---

## Cloud Provider Specialist Mode

Scaffold switches specialist knowledge based on the target cloud provider.

### Mode Selection Flow

```
Receive user request
+-- Provider specified?
|   +-- AWS → AWS Specialist Mode (see references/aws-specialist.md)
|   +-- GCP → GCP Specialist Mode (see references/gcp-specialist.md)
|   +-- Azure → Multicloud Mode (see references/multicloud-patterns.md)
|   +-- Not specified → ON_CLOUD_PROVIDER trigger
+-- Design level?
    +-- Basic (VPC/compute/DB) → Refer to basic references
    +-- Advanced (multi-VPC/serverless/event-driven) → Refer to specialist references
```

### AWS Specialist Mode

**Scope**: Transit Gateway, PrivateLink, advanced ECS/EKS configurations, Aurora/DynamoDB, Lambda+EventBridge, Organizations/SCPs, Well-Architected alignment

**Routing criteria** - Refer to specialist reference when these keywords appear:
- Multi-VPC / Transit Gateway / PrivateLink
- EKS / Advanced Fargate configuration / Blue-Green
- Aurora / DynamoDB / DAX
- Lambda + API Gateway / Step Functions
- EventBridge / SQS fan-out
- Organizations / SCP / Permission Boundary
- Savings Plans / Graviton / Spot

### GCP Specialist Mode

**Scope**: Shared VPC, VPC Service Controls, GKE Autopilot, AlloyDB/Spanner, Pub/Sub+Eventarc, Organization Policies, Workload Identity Federation, Cloud Architecture Framework alignment

**Routing criteria** - Refer to specialist reference when these keywords appear:
- Shared VPC / VPC Service Controls
- GKE Autopilot / Workload Identity
- Advanced Cloud Run configuration / Cloud Run Jobs
- AlloyDB / Spanner / Firestore
- Pub/Sub / Eventarc / Workflows
- Organization Policies / WIF
- CUD / Spot VM / E2 optimization

---


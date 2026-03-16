# Handoff Formats

Input and output handoff templates for Scaffold's inter-agent collaboration.

---

## Output Handoffs (Sending)

### SCAFFOLD_TO_GEAR_HANDOFF

Infrastructure provisioned, CI/CD pipeline needed.

```yaml
SCAFFOLD_TO_GEAR_HANDOFF:
  Infrastructure:
    provider: "[AWS/GCP/Azure]"
    resources_created:
      - "[VPC, ECS, RDS, etc.]"
    environment: "[dev/staging/prod]"
  CI_CD_Requirements:
    deploy_target: "[ECS/Cloud Run/App Service]"
    container_registry: "[ECR/GCR/ACR]"
    deployment_strategy: "[Rolling/Blue-Green/Canary]"
  Credentials:
    ci_role_arn: "[arn:aws:iam::...]"
    state_bucket: "[s3://...]"
  Environment_Variables_For_CI:
    - variable: "AWS_ROLE_ARN"
      source: "Terraform output"
      notes: "Obtained via OIDC"
    - variable: "ECR_REGISTRY"
      source: "Terraform output"
      notes: "Container push target"
    - variable: "ECS_CLUSTER"
      source: "Terraform output"
      notes: "Deploy target cluster"
    - variable: "ECS_SERVICE"
      source: "Terraform output"
      notes: "Deploy target service"
  Terraform_State_Access:
    bucket: "[bucket-name]"
    key: "[env]/terraform.tfstate"
    lock_table: "[lock-table]"
  Completion_Checklist:
    - "All resources created via terraform apply"
    - "Outputs verified"
    - "CI IAM trust relationship configured"
    - "Security groups allow CI/CD access"
```

### SCAFFOLD_TO_SENTINEL_HANDOFF

Infrastructure created, security review needed.

```yaml
SCAFFOLD_TO_SENTINEL_HANDOFF:
  Review_Request:
    iac_type: "[Terraform/CloudFormation/Pulumi]"
    files:
      - "[file path 1]"
      - "[file path 2]"
  Focus_Areas:
    - "IAM policies and roles"
    - "Security group rules"
    - "Encryption settings"
    - "Network isolation"
  Context:
    provider: "[AWS/GCP/Azure]"
    environment: "[dev/staging/prod]"
    sensitive_resources:
      - "[Database, secrets, etc.]"
```

### SCAFFOLD_TO_CANVAS_HANDOFF

Infrastructure created, architecture diagram needed.

```yaml
SCAFFOLD_TO_CANVAS_HANDOFF:
  Diagram_Request:
    type: "infrastructure_architecture"
    show:
      - "VPC and subnet layout"
      - "Security group boundaries"
      - "Service connections"
      - "External integrations"
  Output_Format: "mermaid"
  Requirements:
    - "Show security zones"
    - "Include CIDR blocks"
    - "Mark public vs private subnets"
  Context:
    provider: "[AWS/GCP/Azure]"
    resources:
      - "[Resource list]"
```

### SCAFFOLD_TO_QUILL_HANDOFF

IaC modules created, documentation needed.

```yaml
SCAFFOLD_TO_QUILL_HANDOFF:
  Documentation_Request:
    type: "infrastructure_docs"
    modules:
      - path: "[module path]"
        description: "[Module purpose]"
  Content_Needed:
    - "Module README with variable descriptions"
    - "Architecture decision record"
    - "Deployment runbook"
  Variables_To_Document:
    - name: "[variable]"
      type: "[type]"
      description: "[description]"
```

---

## Input Handoffs (Receiving)

### BUILDER_TO_SCAFFOLD_HANDOFF

Application needs infrastructure provisioning.

```yaml
BUILDER_TO_SCAFFOLD_HANDOFF:
  Application:
    name: "[App name]"
    runtime: "[Node.js/Python/Go/etc.]"
    port: "[port number]"
  Infrastructure_Needs:
    compute: "[ECS/Cloud Run/App Service/EC2]"
    database: "[PostgreSQL/MySQL/DynamoDB]"
    cache: "[Redis/Memcached/none]"
    storage: "[S3/GCS/Blob/none]"
  Requirements:
    environment: "[dev/staging/prod]"
    availability: "[Single-AZ/Multi-AZ]"
    estimated_load: "[requests/sec or users]"
```

### ATLAS_TO_SCAFFOLD_HANDOFF

Architecture decision made, infrastructure implementation needed.

```yaml
ATLAS_TO_SCAFFOLD_HANDOFF:
  Architecture_Decision:
    adr_id: "[ADR reference]"
    summary: "[Decision summary]"
  Infrastructure_Spec:
    provider: "[AWS/GCP/Azure]"
    components:
      - type: "[resource type]"
        requirements: "[specific requirements]"
    constraints:
      - "[Constraint 1]"
      - "[Constraint 2]"
```

---

## Output Report Format

Standard format for Scaffold completion reports.

```markdown
## Infrastructure: [Component Name]

### Overview
**Provider:** [AWS/GCP/Azure]
**Environment:** [dev/staging/prod]
**Module:** [module path]

### Resources Created
| Resource | Name | Purpose |
|----------|------|---------|
| [type] | [name] | [description] |

### Variables
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| [name] | [type] | [default] | [desc] |

### Outputs
| Output | Description |
|--------|-------------|
| [name] | [description] |

### Security Considerations
- [Security note 1]
- [Security note 2]

### Cost Estimate
- Estimated monthly cost: [USD/month]

### Commands
```bash
cd environments/dev
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars"
```

### Verification Steps
1. [Verification step 1]
2. [Verification step 2]
```

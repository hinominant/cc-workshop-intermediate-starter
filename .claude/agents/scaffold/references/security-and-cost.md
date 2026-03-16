# Security Best Practices

Security patterns for IaC and cloud resources.

For cost estimation, see `cost-estimation.md`.

---

## Secrets Management

| Approach | When to Use | Example |
|----------|-------------|---------|
| Environment variables | Local dev only | `.env` files (gitignored) |
| Cloud Secrets Manager | Staging/Prod | AWS Secrets Manager, GCP Secret Manager |
| Parameter Store | Non-sensitive config | AWS SSM Parameter Store |
| Vault | Enterprise, multi-cloud | HashiCorp Vault |

### Terraform Secrets Pattern

```hcl
# DO: Use data sources for secrets
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "/${var.project_name}/${var.environment}/db-password"
}

resource "aws_db_instance" "main" {
  password = data.aws_secretsmanager_secret_version.db_password.secret_string
}

# DON'T: Hardcode secrets
resource "aws_db_instance" "bad" {
  password = "hardcoded-password-123"  # NEVER DO THIS
}
```

---

## IAM Least Privilege

```hcl
resource "aws_iam_role_policy" "app_policy" {
  name = "${var.project_name}-${var.environment}-app-policy"
  role = aws_iam_role.app_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = ["${aws_s3_bucket.uploads.arn}/*"]
      },
      {
        Effect = "Allow"
        Action = ["secretsmanager:GetSecretValue"]
        Resource = [
          "arn:aws:secretsmanager:${var.region}:${data.aws_caller_identity.current.account_id}:secret:/${var.project_name}/${var.environment}/*"
        ]
      }
    ]
  })
}
```

---

## Network Security

```hcl
resource "aws_security_group" "app" {
  name        = "${var.project_name}-${var.environment}-app-sg"
  description = "Security group for application"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = var.app_port
    to_port         = var.app_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    description     = "Allow traffic from ALB only"
  }

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTPS outbound"
  }

  tags = local.common_tags
}
```

---

## Pre-Commit Hooks for IaC

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/antonbabenko/pre-commit-terraform
    rev: v1.86.0
    hooks:
      - id: terraform_fmt
      - id: terraform_validate
      - id: terraform_tflint
      - id: terraform_docs

  - repo: https://github.com/bridgecrewio/checkov
    rev: 3.1.0
    hooks:
      - id: checkov
        args: ['--framework', 'terraform']

  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
```

---

## Environment Variable Templates

### .env.example

```bash
# .env.example
# Copy this file to .env and fill in the values

#=============================================
# Application
#=============================================
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

#=============================================
# Database
#=============================================
DATABASE_URL=postgresql://user:password@localhost:5432/app_dev

#=============================================
# Redis
#=============================================
REDIS_URL=redis://localhost:6379

#=============================================
# Authentication
#=============================================
# Generate with: openssl rand -base64 32
JWT_SECRET=REPLACE_WITH_SECURE_SECRET
SESSION_SECRET=REPLACE_WITH_SECURE_SECRET

#=============================================
# Feature Flags
#=============================================
FEATURE_NEW_UI=false
FEATURE_BETA_API=false

#=============================================
# Observability
#=============================================
LOG_LEVEL=debug
# SENTRY_DSN=
```

### Zod Validation Schema

```typescript
// config/env.schema.ts
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  APP_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32),
  SESSION_SECRET: z.string().min(32),
  FEATURE_NEW_UI: z.coerce.boolean().default(false),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Environment validation failed:');
    result.error.issues.forEach(issue => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }
  return result.data;
}
```


# Multi-Cloud Patterns

IaC templates and patterns for GCP, Azure, and Pulumi (TypeScript). Cross-cloud comparison reference.

---

## Cloud Provider Comparison

| Feature | AWS | GCP | Azure |
|---------|-----|-----|-------|
| **VPC/Network** | VPC | VPC Network | VNet |
| **Compute** | EC2, ECS, Lambda | Compute Engine, Cloud Run, Functions | VMs, App Service, Functions |
| **Database** | RDS, Aurora, DynamoDB | Cloud SQL, Spanner, Firestore | Azure SQL, Cosmos DB |
| **Kubernetes** | EKS | GKE | AKS |
| **Object Storage** | S3 | Cloud Storage | Blob Storage |
| **Secrets** | Secrets Manager | Secret Manager | Key Vault |
| **IaC State** | S3 + DynamoDB | GCS | Azure Blob |

---

## GCP - VPC Network Module

```hcl
# modules/gcp-vpc/main.tf
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

locals {
  common_labels = {
    project     = var.project_name
    environment = var.environment
    managed-by  = "terraform"
  }
}

resource "google_compute_network" "main" {
  name                    = "${var.project_name}-${var.environment}-vpc"
  auto_create_subnetworks = false
  project                 = var.gcp_project_id
}

resource "google_compute_subnetwork" "public" {
  name          = "${var.project_name}-${var.environment}-public"
  ip_cidr_range = var.public_cidr
  region        = var.region
  network       = google_compute_network.main.id
  project       = var.gcp_project_id

  private_ip_google_access = true
}

resource "google_compute_subnetwork" "private" {
  name          = "${var.project_name}-${var.environment}-private"
  ip_cidr_range = var.private_cidr
  region        = var.region
  network       = google_compute_network.main.id
  project       = var.gcp_project_id

  private_ip_google_access = true

  secondary_ip_range {
    range_name    = "gke-pods"
    ip_cidr_range = var.pods_cidr
  }

  secondary_ip_range {
    range_name    = "gke-services"
    ip_cidr_range = var.services_cidr
  }
}

resource "google_compute_router" "main" {
  name    = "${var.project_name}-${var.environment}-router"
  region  = var.region
  network = google_compute_network.main.id
  project = var.gcp_project_id
}

resource "google_compute_router_nat" "main" {
  name                               = "${var.project_name}-${var.environment}-nat"
  router                             = google_compute_router.main.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
  project                            = var.gcp_project_id

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

resource "google_compute_firewall" "allow_internal" {
  name    = "${var.project_name}-${var.environment}-allow-internal"
  network = google_compute_network.main.name
  project = var.gcp_project_id

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }
  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }
  allow {
    protocol = "icmp"
  }

  source_ranges = [var.public_cidr, var.private_cidr]
}

resource "google_compute_firewall" "allow_ssh_iap" {
  name    = "${var.project_name}-${var.environment}-allow-ssh-iap"
  network = google_compute_network.main.name
  project = var.gcp_project_id

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["35.235.240.0/20"]  # IAP range
}
```

## GCP - Cloud Run Service

```hcl
# modules/gcp-cloudrun/main.tf
resource "google_cloud_run_v2_service" "main" {
  name     = "${var.project_name}-${var.environment}"
  location = var.region
  project  = var.gcp_project_id

  template {
    containers {
      image = var.container_image

      resources {
        limits = {
          cpu    = var.cpu_limit
          memory = var.memory_limit
        }
      }

      dynamic "env" {
        for_each = var.environment_variables
        content {
          name  = env.key
          value = env.value
        }
      }
    }

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    vpc_access {
      connector = var.vpc_connector_id
      egress    = "PRIVATE_RANGES_ONLY"
    }
  }

  labels = {
    project     = var.project_name
    environment = var.environment
    managed-by  = "terraform"
  }
}

resource "google_cloud_run_service_iam_member" "public" {
  count    = var.allow_public_access ? 1 : 0
  location = google_cloud_run_v2_service.main.location
  project  = var.gcp_project_id
  service  = google_cloud_run_v2_service.main.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
```

---

## Azure - VNet Module

```hcl
# modules/azure-vnet/main.tf
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "azurerm_virtual_network" "main" {
  name                = "${var.project_name}-${var.environment}-vnet"
  location            = var.location
  resource_group_name = var.resource_group_name
  address_space       = [var.vnet_cidr]

  tags = local.common_tags
}

resource "azurerm_subnet" "public" {
  name                 = "${var.project_name}-${var.environment}-public"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.public_cidr]
}

resource "azurerm_subnet" "private" {
  name                 = "${var.project_name}-${var.environment}-private"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.private_cidr]

  delegation {
    name = "app-service-delegation"
    service_delegation {
      name    = "Microsoft.Web/serverFarms"
      actions = ["Microsoft.Network/virtualNetworks/subnets/action"]
    }
  }
}

resource "azurerm_public_ip" "nat" {
  name                = "${var.project_name}-${var.environment}-nat-ip"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Static"
  sku                 = "Standard"
  tags                = local.common_tags
}

resource "azurerm_nat_gateway" "main" {
  name                = "${var.project_name}-${var.environment}-nat"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku_name            = "Standard"
  tags                = local.common_tags
}

resource "azurerm_nat_gateway_public_ip_association" "main" {
  nat_gateway_id       = azurerm_nat_gateway.main.id
  public_ip_address_id = azurerm_public_ip.nat.id
}

resource "azurerm_subnet_nat_gateway_association" "private" {
  subnet_id      = azurerm_subnet.private.id
  nat_gateway_id = azurerm_nat_gateway.main.id
}

resource "azurerm_network_security_group" "private" {
  name                = "${var.project_name}-${var.environment}-private-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name

  security_rule {
    name                       = "AllowVNetInbound"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "VirtualNetwork"
    destination_address_prefix = "VirtualNetwork"
  }

  tags = local.common_tags
}

resource "azurerm_subnet_network_security_group_association" "private" {
  subnet_id                 = azurerm_subnet.private.id
  network_security_group_id = azurerm_network_security_group.private.id
}
```

## Azure - App Service

```hcl
# modules/azure-appservice/main.tf
resource "azurerm_service_plan" "main" {
  name                = "${var.project_name}-${var.environment}-plan"
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = var.sku_name
  tags                = local.common_tags
}

resource "azurerm_linux_web_app" "main" {
  name                = "${var.project_name}-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = var.environment == "prod"
    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = var.app_settings

  identity {
    type = "SystemAssigned"
  }

  tags = local.common_tags
}
```

---

## Multi-Cloud Backend Configuration

```hcl
# GCP Backend
terraform {
  backend "gcs" {
    bucket = "myproject-terraform-state"
    prefix = "dev/terraform.tfstate"
  }
}

# Azure Backend
terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "myprojecttfstate"
    container_name       = "tfstate"
    key                  = "dev/terraform.tfstate"
  }
}
```

---

## Pulumi Templates (TypeScript)

### Project Structure

```
pulumi/
├── Pulumi.yaml           # Project definition
├── Pulumi.dev.yaml       # Dev stack config
├── Pulumi.staging.yaml   # Staging stack config
├── Pulumi.prod.yaml      # Prod stack config
├── index.ts              # Main entry point
├── vpc.ts                # VPC module
├── database.ts           # Database module
└── package.json
```

### VPC Module

```typescript
// pulumi/vpc.ts
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export interface VpcArgs {
  projectName: string;
  environment: string;
  cidrBlock?: string;
  availabilityZones?: string[];
  enableNatGateway?: boolean;
}

export class Vpc extends pulumi.ComponentResource {
  public readonly vpcId: pulumi.Output<string>;
  public readonly publicSubnetIds: pulumi.Output<string>[];
  public readonly privateSubnetIds: pulumi.Output<string>[];

  constructor(name: string, args: VpcArgs, opts?: pulumi.ComponentResourceOptions) {
    super("custom:network:Vpc", name, {}, opts);

    const cidr = args.cidrBlock ?? "10.0.0.0/16";
    const azs = args.availabilityZones ?? ["ap-northeast-1a", "ap-northeast-1c"];

    const commonTags = {
      Project: args.projectName,
      Environment: args.environment,
      ManagedBy: "pulumi",
    };

    const vpc = new aws.ec2.Vpc(`${name}-vpc`, {
      cidrBlock: cidr,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: { ...commonTags, Name: `${args.projectName}-${args.environment}-vpc` },
    }, { parent: this });

    const igw = new aws.ec2.InternetGateway(`${name}-igw`, {
      vpcId: vpc.id,
      tags: { ...commonTags, Name: `${args.projectName}-${args.environment}-igw` },
    }, { parent: this });

    const publicSubnets = azs.map((az, i) => {
      return new aws.ec2.Subnet(`${name}-public-${i}`, {
        vpcId: vpc.id,
        cidrBlock: `10.0.${i}.0/24`,
        availabilityZone: az,
        mapPublicIpOnLaunch: true,
        tags: { ...commonTags, Name: `${args.projectName}-${args.environment}-public-${i + 1}` },
      }, { parent: this });
    });

    const privateSubnets = azs.map((az, i) => {
      return new aws.ec2.Subnet(`${name}-private-${i}`, {
        vpcId: vpc.id,
        cidrBlock: `10.0.${i + 10}.0/24`,
        availabilityZone: az,
        tags: { ...commonTags, Name: `${args.projectName}-${args.environment}-private-${i + 1}` },
      }, { parent: this });
    });

    if (args.enableNatGateway !== false) {
      const eip = new aws.ec2.Eip(`${name}-nat-eip`, {
        domain: "vpc",
        tags: { ...commonTags, Name: `${args.projectName}-${args.environment}-nat-eip` },
      }, { parent: this });

      new aws.ec2.NatGateway(`${name}-nat`, {
        allocationId: eip.id,
        subnetId: publicSubnets[0].id,
        tags: { ...commonTags, Name: `${args.projectName}-${args.environment}-nat` },
      }, { parent: this, dependsOn: [igw] });
    }

    this.vpcId = vpc.id;
    this.publicSubnetIds = publicSubnets.map(s => s.id);
    this.privateSubnetIds = privateSubnets.map(s => s.id);

    this.registerOutputs({
      vpcId: this.vpcId,
      publicSubnetIds: this.publicSubnetIds,
      privateSubnetIds: this.privateSubnetIds,
    });
  }
}
```

### Main Entry Point

```typescript
// pulumi/index.ts
import * as pulumi from "@pulumi/pulumi";
import { Vpc } from "./vpc";

const config = new pulumi.Config();
const projectName = config.require("projectName");
const environment = pulumi.getStack();

const vpc = new Vpc("main", {
  projectName,
  environment,
  enableNatGateway: environment === "prod",
});

export const vpcId = vpc.vpcId;
export const publicSubnetIds = vpc.publicSubnetIds;
export const privateSubnetIds = vpc.privateSubnetIds;
```

### Stack Configuration

```yaml
# Pulumi.dev.yaml
config:
  aws:region: ap-northeast-1
  myproject:projectName: myproject

# Pulumi.prod.yaml
config:
  aws:region: ap-northeast-1
  myproject:projectName: myproject
  myproject:enableNatGateway: true
```

### Pulumi Commands Reference

```bash
pulumi new aws-typescript     # Initialize new project
pulumi stack select dev       # Select stack
pulumi stack init staging     # Create new stack
pulumi preview                # Preview changes
pulumi up                     # Apply changes
pulumi destroy                # Destroy resources
pulumi stack output           # View outputs
pulumi import aws:ec2/vpc:Vpc main vpc-12345678  # Import existing
```

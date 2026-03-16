# System Explanations: Architecture Intent for Business Stakeholders

This document provides templates and patterns for explaining system architecture and technical configurations to non-technical stakeholders.

---

## Core Principle

> **"Every architectural decision exists to solve a business problem."**

When explaining system architecture, always connect technical components to business outcomes.

---

## Part 1: Component Role Translation

### How to Explain System Components

| Technical Component | Role | Business Analogy |
|--------------------|------|------------------|
| Load Balancer | Traffic distribution | "Front desk receptionist directing customers to available service windows" |
| Web Server | Request handling | "Service counter staff who receive and respond to customer requests" |
| Application Server | Business logic | "Back-office staff who perform the actual processing" |
| Database | Data storage | "Filing cabinet that securely stores all necessary information" |
| Cache | Quick access storage | "Frequently-used documents kept at hand for quick reference" |
| Message Queue | Async communication | "Memo passing system that ensures nothing is forgotten even when busy" |
| CDN | Content distribution | "Branch offices with identical catalogs for faster local access" |
| API Gateway | Entry point | "General reception desk routing external inquiries to appropriate departments" |
| Firewall | Security barrier | "Security gate that only allows authorized personnel" |
| Monitoring | System observation | "Security cameras for early problem detection" |

---

## Part 2: Architecture Explanation Templates

### Template A: Simple System Overview

Use for executive-level explanations or initial introductions.

```markdown
## [System Name] Overview

### In One Sentence
[1-sentence explanation]

### User Journey
1. When user [action]
2. The system [process]
3. User receives [result]

### Why This Design
- **Security**: [Security perspective]
- **Speed**: [Performance perspective]
- **Reliability**: [Availability perspective]

### Diagram
[Simple flow diagram]
```

**Example:**

```markdown
## Payment System Overview

### In One Sentence
A system that securely processes customer card information and reliably handles financial transactions.

### User Journey
1. When user enters card information
2. The system encrypts and sends it to the payment provider
3. User receives approval result instantly

### Why This Design
- **Security**: Card information is encrypted and not stored on our servers
- **Speed**: Transactions complete in 1-2 seconds
- **Reliability**: Payment provider operates 24/7
```

---

### Template B: Detailed Architecture Explanation

Use for stakeholders who need deeper understanding.

```markdown
## [System Name] Architecture

### 1. Overview
[Architecture diagram + 1-2 line description]

### 2. Component Roles

| Component | Technical Role | Business Value |
|-----------|----------------|----------------|
| [Name] | [Technical role] | [Business value] |

### 3. Data Flow
[Step-by-step explanation]

### 4. Why This Design

#### Business Requirements Mapping
| Business Requirement | Technical Solution | Realized Value |
|---------------------|-------------------|----------------|
| [Requirement] | [Solution] | [Value] |

#### Alternatives Considered
| Alternative | Why Not Chosen |
|-------------|----------------|
| [Option A] | [Reason] |

### 5. Operational Characteristics
- **Scalability**: [Expansion capability]
- **Fault Tolerance**: [Behavior during failures]
- **Security**: [Protection measures]
```

---

### Template C: System Change Explanation

Use when explaining architectural changes or migrations.

```markdown
## [Change Name] Explanation

### 1. Change Overview
**Before:** [Current state]
**After:** [State after change]

### 2. Why This Change
[Business reason - translate technical issues to business impact]

### 3. Change Impact
| Aspect | Before | After | Improvement |
|--------|--------|-------|-------------|
| [Aspect 1] | [Current] | [After change] | [Effect] |

### 4. Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk] | [Impact] | [Mitigation] |

### 5. Schedule and Phases
[Phase-by-phase explanation]
```

---

## Part 3: Common Architecture Patterns Explained

### Pattern: 3-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Customer Browser                      │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Presentation Layer (Front Desk)                         │
│  - Display screens                                       │
│  - Accept input                                          │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Business Logic Layer (Back Office)                      │
│  - Calculations and decisions                            │
│  - Rule application                                      │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Data Layer (Vault)                                      │
│  - Data storage                                          │
│  - History management                                    │
└─────────────────────────────────────────────────────────┘
```

**Business explanation:**
"Like a bank branch structure. The teller (screen) handles customer interaction, back-office staff (logic) does the processing, and the vault (database) stores everything. By separating roles, each can be improved independently."

---

### Pattern: Microservices

```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Product │ │  Order  │ │ Payment │ │Shipping │
│ Service │ │ Service │ │ Service │ │ Service │
└────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
     │          │          │          │
     └──────────┴──────────┴──────────┘
                    │
            ┌───────┴───────┐
            │   Platform    │
            └───────────────┘
```

**Business explanation:**
"Like a specialty shopping district. Each shop (service) specializes in its area. Product, order, payment, and shipping teams each operate independently. If one shop has a problem, the others continue operating."

**When to use this explanation:**
- Explaining service independence
- Explaining partial releases/updates
- Explaining failure isolation

---

### Pattern: Event-Driven Architecture

```
┌─────────┐      ┌─────────┐      ┌─────────┐
│  Order  │─────→│  Event  │─────→│  Stock  │
│ Created │      │   Bus   │      │ Update  │
└─────────┘      │         │      └─────────┘
                 │         │
                 │         │      ┌─────────┐
                 │         │─────→│  Send   │
                 │         │      │ Notice  │
                 └─────────┘      └─────────┘
```

**Business explanation:**
"Like an office PA system. When 'New order received' is announced, both inventory and notification teams hear it simultaneously and respond. No need for individual communications, and everyone shares the same information."

---

### Pattern: Multi-Region Deployment

```
       ┌─────────────────────────────────────┐
       │           Global Load Balancer       │
       └─────────────┬───────────────────────┘
                     │
       ┌─────────────┼───────────────────────┐
       ↓             ↓                       ↓
┌──────────┐  ┌──────────┐           ┌──────────┐
│  Tokyo   │  │Singapore │           │   USA    │
│  Region  │  │  Region  │           │  Region  │
└──────────┘  └──────────┘           └──────────┘
```

**Business explanation:**
"Like having branches worldwide. Tokyo customers go to the Tokyo branch, US customers go to the US branch. Serving from nearby locations means no waiting. Also, if one branch has issues, others can continue serving."

---

## Part 4: Why We Chose This Design

### Decision Justification Template

```markdown
## Architecture Decision: [Decision]

### Business Requirements
[Business requirements this design must satisfy]

### Technical Solution
[Technical approach to meet requirements]

### Expected Business Benefits
| Benefit | Description | Measurement |
|---------|-------------|-------------|
| [Benefit 1] | [Description] | [KPI etc.] |

### Alternatives Considered

#### Option A: [Alternative name]
- **Overview**: [Description]
- **Why not chosen**: [Reason - business perspective]

#### Option B: [Alternative name]
- **Overview**: [Description]
- **Why not chosen**: [Reason - business perspective]

### Why This Option is Best
[Why this option is optimal - in business language]
```

---

### Common "Why Not" Explanations

| Alternative | Technical Reason | Business Translation |
|-------------|------------------|---------------------|
| Single server instead of distributed | Single point of failure risk | "If one server fails, entire service stops" |
| On-premise instead of cloud | Scaling limitations | "Cannot handle sudden traffic spikes. Risk of lost opportunities" |
| Monolith instead of microservices | Deployment coupling | "Even small changes require full re-release. Slows down changes" |
| Sync instead of async | User experience degradation | "Screen freezes until processing completes. Keeps customers waiting" |
| Build vs Buy | Core competency focus | "Focus on core business. Use specialist services for generic features" |
| Cutting-edge tech | Operational risk | "New technology has limited track record. Difficult to troubleshoot" |
| Cheaper option | Hidden costs | "Initial cost is low but operational and incident costs are high" |

---

## Part 5: System Diagram Templates

### Executive Summary Diagram

```
┌────────────────────────────────────────────────────────────┐
│                      Our System                             │
│                                                            │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐           │
│   │ Customer │───→│ Service  │───→│  Value   │           │
│   │  Needs   │    │Processing│    │ Delivery │           │
│   └──────────┘    └──────────┘    └──────────┘           │
│         ↑              │                                  │
│         │              ↓                                  │
│         │       ┌──────────┐                             │
│         └───────│   Data   │                             │
│                 │ Storage  │                             │
│                 └──────────┘                             │
└────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram (Simplified)

```
Customer → Input → Validation → Processing → Storage → Result → Customer
                      ↓            ↓           ↓
                    Error         Log       History
                   Notice       Record     Archive
```

### Security Boundary Diagram

```
┌─────────────────────── Internet ────────────────────────┐
│                           ↓                              │
│  ┌──────────────── Security Boundary ─────────────────┐ │
│  │                        ↓                            │ │
│  │  [Auth] → [Authz] → [Service] → [Encrypted Data]   │ │
│  │    ↓                                                │ │
│  │  Unauthorized                                       │ │
│  │  Access Blocked                                     │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## Part 6: Presentation Tips

### Do's and Don'ts

| Do | Don't |
|----|-------|
| Use business analogies | Use technical jargon |
| Focus on outcomes | Focus on implementation |
| Show before/after impact | Assume prior knowledge |
| Use simple diagrams | Create complex UML |
| Quantify benefits | Use vague improvements |
| Acknowledge trade-offs | Hide disadvantages |

### Audience Calibration

| Audience | Focus | Depth | Analogies |
|----------|-------|-------|-----------|
| C-Level | ROI, risk, competitive advantage | High-level only | Business analogies |
| VP/Director | Roadmap alignment, resource needs | Mid-level | Industry comparisons |
| Manager | Timeline, team impact, dependencies | Detailed | Workflow analogies |
| Product Manager | User impact, feature timeline | Feature-focused | User story based |

### The 3-Layer Explanation

For any system, prepare 3 versions:

1. **Elevator Pitch (30 seconds)**
   - 1-2 sentences max
   - Focus on business outcome only

2. **Overview (5 minutes)**
   - High-level diagram
   - Key components and their roles
   - Main benefits

3. **Deep Dive (30 minutes)**
   - Detailed architecture
   - Decision rationale
   - Trade-offs and risks
   - Q&A preparation

---

## Part 7: Q&A Preparation

### Common Questions and How to Answer

| Question | Category | How to Frame Answer |
|----------|----------|---------------------|
| "How much will this cost?" | Budget | Include TCO, not just initial cost. Compare to cost of not doing it |
| "How long will this take?" | Timeline | Provide phases with deliverables at each stage |
| "What if it fails?" | Risk | Explain rollback plan and risk mitigation |
| "Why can't we use [X]?" | Alternatives | Acknowledge X's merits, explain specific disadvantages for our case |
| "Is this secure?" | Security | Reference standards/certifications, explain key protections |
| "Will users notice?" | Impact | Describe user experience improvements with examples |
| "What do we need from IT?" | Resources | Specific asks with justification |
| "Can you guarantee it works?" | Assurance | Explain testing approach and phased rollout |

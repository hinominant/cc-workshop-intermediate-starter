# Canvas C4 Model Reference

C4 Model によるアーキテクチャ図の作成ガイド。

---

## Overview

C4 Model は4つの抽象レベルでシステムを可視化:

```
┌─────────────────────────────────────────────────────────────┐
│  Level 1: CONTEXT                                           │
│  システムと外部アクター（ユーザー、外部システム）の関係      │
└─────────────────────────────────────────────────────────────┘
                              ↓ Zoom In
┌─────────────────────────────────────────────────────────────┐
│  Level 2: CONTAINER                                         │
│  システム内のコンテナ（アプリ、DB、メッセージキュー等）      │
└─────────────────────────────────────────────────────────────┘
                              ↓ Zoom In
┌─────────────────────────────────────────────────────────────┐
│  Level 3: COMPONENT                                         │
│  コンテナ内のコンポーネント（サービス、コントローラー等）    │
└─────────────────────────────────────────────────────────────┘
                              ↓ Zoom In
┌─────────────────────────────────────────────────────────────┐
│  Level 4: CODE                                              │
│  コンポーネント内のコード構造（クラス、関数等）              │
└─────────────────────────────────────────────────────────────┘
```

---

## Trigger Commands

```
/Canvas c4 context                     # Level 1: Context Diagram
/Canvas c4 container                   # Level 2: Container Diagram
/Canvas c4 component [container]       # Level 3: Component Diagram
/Canvas c4 code [component]            # Level 4: Code Diagram
/Canvas c4 all                         # All levels overview
```

---

## Level 1: System Context Diagram

### Purpose

- システムの境界を明確化
- 外部アクター（ユーザー、外部システム）との関係を表示
- ビジネスステークホルダー向け

### Mermaid Template

```mermaid
flowchart TD
    classDef person fill:#08427B,color:#fff,stroke:#073B6F
    classDef system fill:#1168BD,color:#fff,stroke:#0E5AA7
    classDef external fill:#999999,color:#fff,stroke:#8A8A8A

    U1[("👤 Customer<br/>[Person]<br/>Purchases products")]:::person
    U2[("👤 Admin<br/>[Person]<br/>Manages catalog")]:::person

    S1["📦 E-Commerce System<br/>[Software System]<br/>Allows customers to browse<br/>and purchase products"]:::system

    E1["📧 Email System<br/>[External System]<br/>Sends notifications"]:::external
    E2["💳 Payment Gateway<br/>[External System]<br/>Processes payments"]:::external
    E3["🚚 Shipping API<br/>[External System]<br/>Manages deliveries"]:::external

    U1 -->|"Browses products,<br/>places orders"| S1
    U2 -->|"Manages products,<br/>views reports"| S1
    S1 -->|"Sends order<br/>confirmations"| E1
    S1 -->|"Processes<br/>payments"| E2
    S1 -->|"Creates shipping<br/>labels"| E3
```

### ASCII Template

```
                     ┌─────────────────┐
                     │    Customer     │
                     │    [Person]     │
                     └────────┬────────┘
                              │ Browses, Orders
                              ▼
┌─────────────┐      ┌─────────────────┐      ┌─────────────┐
│   Admin     │      │  E-Commerce     │      │   Email     │
│  [Person]   │─────>│    System       │─────>│  [External] │
└─────────────┘      │ [Software Sys]  │      └─────────────┘
   Manages           └────────┬────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌───────────┐   ┌───────────┐   ┌───────────┐
       │  Payment  │   │ Shipping  │   │  (other)  │
       │ [External]│   │ [External]│   │           │
       └───────────┘   └───────────┘   └───────────┘
```

---

## Level 2: Container Diagram

### Purpose

- システム内の主要なコンテナを表示
- 技術選択を明示
- 開発者・アーキテクト向け

### Mermaid Template

```mermaid
flowchart TD
    classDef person fill:#08427B,color:#fff
    classDef container fill:#438DD5,color:#fff
    classDef database fill:#438DD5,color:#fff
    classDef external fill:#999999,color:#fff

    U1[("👤 Customer")]:::person

    subgraph boundary["E-Commerce System"]
        C1["🌐 Web Application<br/>[Container: Next.js]<br/>Serves web UI"]:::container
        C2["📱 Mobile App<br/>[Container: React Native]<br/>Native mobile UI"]:::container
        C3["⚙️ API Server<br/>[Container: Node.js]<br/>REST API endpoints"]:::container
        C4["🔐 Auth Service<br/>[Container: Node.js]<br/>Authentication & authorization"]:::container
        C5[("🗄️ Database<br/>[Container: PostgreSQL]<br/>Stores user, product, order data")]:::database
        C6[("⚡ Cache<br/>[Container: Redis]<br/>Session & data caching")]:::database
        C7["📨 Message Queue<br/>[Container: RabbitMQ]<br/>Async processing"]:::container
    end

    E1["💳 Payment Gateway"]:::external

    U1 --> C1
    U1 --> C2
    C1 --> C3
    C2 --> C3
    C3 --> C4
    C3 --> C5
    C3 --> C6
    C3 --> C7
    C3 --> E1
```

### Container Types

| タイプ | 例 | 記号 |
|--------|-----|------|
| Web Application | Next.js, React | 🌐 |
| Mobile App | React Native, Flutter | 📱 |
| API/Service | Node.js, Go | ⚙️ |
| Database | PostgreSQL, MongoDB | 🗄️ |
| Cache | Redis, Memcached | ⚡ |
| Message Queue | RabbitMQ, Kafka | 📨 |
| File Storage | S3, GCS | 📁 |
| Auth Service | Auth0, Keycloak | 🔐 |

---

## Level 3: Component Diagram

### Purpose

- 特定コンテナ内のコンポーネント構造
- 責務の分離を明示
- 開発者向け

### Mermaid Template (API Server)

```mermaid
flowchart TD
    classDef component fill:#85BBF0,color:#000
    classDef external fill:#999999,color:#fff

    subgraph api["API Server [Container]"]
        direction TB

        subgraph controllers["Controllers"]
            CT1["UserController<br/>[Component]<br/>Handles user endpoints"]:::component
            CT2["OrderController<br/>[Component]<br/>Handles order endpoints"]:::component
            CT3["ProductController<br/>[Component]<br/>Handles product endpoints"]:::component
        end

        subgraph services["Services"]
            S1["UserService<br/>[Component]<br/>User business logic"]:::component
            S2["OrderService<br/>[Component]<br/>Order business logic"]:::component
            S3["ProductService<br/>[Component]<br/>Product business logic"]:::component
            S4["PaymentService<br/>[Component]<br/>Payment processing"]:::component
        end

        subgraph repositories["Repositories"]
            R1["UserRepository<br/>[Component]<br/>User data access"]:::component
            R2["OrderRepository<br/>[Component]<br/>Order data access"]:::component
            R3["ProductRepository<br/>[Component]<br/>Product data access"]:::component
        end
    end

    DB[("Database")]:::external
    PG["Payment Gateway"]:::external

    CT1 --> S1
    CT2 --> S2
    CT3 --> S3
    S1 --> R1
    S2 --> R2
    S2 --> S4
    S3 --> R3
    R1 --> DB
    R2 --> DB
    R3 --> DB
    S4 --> PG
```

---

## Level 4: Code Diagram

### Purpose

- 特定コンポーネントの内部構造
- クラス/関数レベルの設計
- 実装者向け

### Mermaid Class Diagram

```mermaid
classDiagram
    class OrderService {
        -orderRepository: OrderRepository
        -paymentService: PaymentService
        -notificationService: NotificationService
        +createOrder(dto: CreateOrderDto): Order
        +getOrder(id: string): Order
        +cancelOrder(id: string): void
        -validateOrder(order: Order): boolean
        -calculateTotal(items: OrderItem[]): number
    }

    class OrderRepository {
        -db: Database
        +save(order: Order): Order
        +findById(id: string): Order
        +findByUserId(userId: string): Order[]
        +update(order: Order): Order
        +delete(id: string): void
    }

    class PaymentService {
        -gateway: PaymentGateway
        +processPayment(order: Order): PaymentResult
        +refund(orderId: string): RefundResult
    }

    class Order {
        +id: string
        +userId: string
        +items: OrderItem[]
        +status: OrderStatus
        +total: number
        +createdAt: Date
    }

    OrderService --> OrderRepository: uses
    OrderService --> PaymentService: uses
    OrderService --> Order: creates
    OrderRepository --> Order: persists
```

---

## C4 Color Palette

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Person | Dark Blue | #08427B | ユーザー、アクター |
| Software System | Blue | #1168BD | 自社システム |
| Container | Light Blue | #438DD5 | アプリ、サービス、DB |
| Component | Lighter Blue | #85BBF0 | 内部コンポーネント |
| External System | Gray | #999999 | 外部システム |

---

## Navigation Between Levels

```mermaid
flowchart LR
    L1[Context] -->|"Zoom into<br/>system"| L2[Container]
    L2 -->|"Zoom into<br/>container"| L3[Component]
    L3 -->|"Zoom into<br/>component"| L4[Code]

    L4 -->|"Zoom out"| L3
    L3 -->|"Zoom out"| L2
    L2 -->|"Zoom out"| L1
```

### Drill-Down Commands

```
/Canvas c4 zoom [element-name]         # 特定要素にズームイン
/Canvas c4 zoom out                    # 一つ上のレベルに戻る
```

---

## C4 Output Format

```markdown
## C4 Diagram: [Level] - [System/Container/Component Name]

### Overview

| Attribute | Value |
|-----------|-------|
| Level | Context / Container / Component / Code |
| Scope | [対象範囲] |
| Audience | [想定読者: Business / Technical / Developer] |

### Diagram

[Mermaid code]

### Elements

| Element | Type | Description |
|---------|------|-------------|
| [Name] | [Person/System/Container/Component] | [説明] |

### Relationships

| From | To | Description |
|------|-----|-------------|
| [Source] | [Target] | [関係の説明] |

### Technology Stack

| Container/Component | Technology |
|--------------------|------------|
| [Name] | [Tech stack] |

### Notes

- [アーキテクチャ決定の理由]
- [将来の拡張計画]
```

---

## Question Templates

### ON_C4_LEVEL

```yaml
questions:
  - question: "どのレベルのC4図を作成しますか？"
    header: "Level"
    options:
      - label: "Context (Recommended for overview)"
        description: "システムと外部の関係を俯瞰"
      - label: "Container"
        description: "システム内のコンテナ構成"
      - label: "Component"
        description: "特定コンテナ内の構造"
      - label: "Code"
        description: "特定コンポーネントの実装"
    multiSelect: false
```

### ON_C4_SCOPE

```yaml
questions:
  - question: "どの範囲を対象にしますか？"
    header: "Scope"
    options:
      - label: "Entire system"
        description: "システム全体"
      - label: "Specific container"
        description: "特定のコンテナを指定"
      - label: "Specific feature"
        description: "特定の機能に関連する部分"
    multiSelect: false
```

### ON_C4_AUDIENCE

```yaml
questions:
  - question: "この図の想定読者は？"
    header: "Audience"
    options:
      - label: "Business stakeholders"
        description: "技術詳細を省略、概念中心"
      - label: "Technical architects"
        description: "技術選択、構造を明示"
      - label: "Developers"
        description: "実装詳細、コードレベル"
    multiSelect: false
```

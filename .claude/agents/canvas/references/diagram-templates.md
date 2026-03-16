# Canvas Diagram Templates Reference

Complete Mermaid and draw.io templates for common diagram types.

## Flowchart Template

### Mermaid
```mermaid
flowchart TD
    subgraph Input["Input"]
        A[Start] --> B{Condition}
    end
    subgraph Process["Process"]
        B -->|Yes| C[Process A]
        B -->|No| D[Process B]
    end
    subgraph Output["Output"]
        C --> E[End]
        D --> E
    end
```

### draw.io
```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="Canvas Agent" version="1.0">
  <diagram name="Flowchart" id="flowchart-1">
    <mxGraphModel dx="800" dy="600" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="start" value="Start" style="ellipse;fillColor=#d5e8d4;strokeColor=#82b366;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="190" y="40" width="120" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="cond" value="Condition" style="rhombus;fillColor=#fff2cc;strokeColor=#d6b656;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="185" y="140" width="130" height="80" as="geometry"/>
        </mxCell>
        <mxCell id="procA" value="Process A" style="rounded=1;fillColor=#dae8fc;strokeColor=#6c8ebf;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="80" y="280" width="120" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="procB" value="Process B" style="rounded=1;fillColor=#dae8fc;strokeColor=#6c8ebf;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="300" y="280" width="120" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="end" value="End" style="ellipse;fillColor=#f8cecc;strokeColor=#b85450;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="190" y="400" width="120" height="60" as="geometry"/>
        </mxCell>
        <!-- Edges omitted for brevity - see full version in SKILL.md -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Sequence Diagram Template

### Mermaid
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database

    U->>F: Action
    F->>A: Request
    A->>D: Query
    D-->>A: Result
    A-->>F: Response
    F-->>U: Display
```

---

## State Diagram Template

### Mermaid
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: fetch
    Loading --> Success: resolve
    Loading --> Error: reject
    Success --> Idle: reset
    Error --> Idle: retry
```

---

## Class Diagram Template

### Mermaid
```mermaid
classDiagram
    class User {
        +string id
        +string name
        +string email
        +login()
        +logout()
    }
    class Order {
        +string id
        +User user
        +Item[] items
        +calculate()
    }
    User "1" --> "*" Order
```

---

## ER Diagram Template

### Mermaid
```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"

    USER {
        string id PK
        string name
        string email
    }
    ORDER {
        string id PK
        string user_id FK
        date created_at
    }
```

---

## Mind Map Template

### Mermaid
```mermaid
mindmap
  root((Central Theme))
    Category A
      Item 1
      Item 2
    Category B
      Item 3
      Item 4
    Category C
      Item 5
```

---

## Gantt Chart Template

### Mermaid
```mermaid
gantt
    title Project Plan
    dateFormat  YYYY-MM-DD
    section Phase 1
    Task A           :a1, 2024-01-01, 7d
    Task B           :after a1, 5d
    section Phase 2
    Task C           :2024-01-15, 10d
```

---

## Journey Template

### Mermaid
```mermaid
journey
    title User Journey
    section Registration
      Visit site: 5: User
      Fill form: 3: User
      Receive confirmation: 4: User
    section Getting Started
      Login: 5: User
      Explore features: 4: User
```

---

## Template Selection Guide

| Diagram Type | Use Case | Key Elements |
|--------------|----------|--------------|
| Flowchart | Process flows | Start/End, Conditions, Processes |
| Sequence | API calls | Participants, Messages, Returns |
| State | Lifecycles | States, Transitions, Triggers |
| Class | Data models | Classes, Attributes, Methods |
| ER | Database | Entities, Relationships, Keys |
| Mind Map | Brainstorming | Central theme, Categories |
| Gantt | Planning | Tasks, Dependencies, Timeline |
| Journey | UX flows | Sections, Steps, Emotion scores |

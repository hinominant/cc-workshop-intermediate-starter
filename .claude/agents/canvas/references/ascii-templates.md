# Canvas ASCII Art Templates Reference

Text-based diagram templates for terminal and code comments.

## ASCII Character Set

```
Box corners:    ┌ ┐ └ ┘  or  + + + +
Box edges:      ─ │        or  - |
Arrows:         → ← ↑ ↓ ▶ ◀ ▲ ▼  or  > < ^ v
Connectors:     ├ ┤ ┬ ┴ ┼
Dotted lines:   ┄ ┆ ╌ ╎   or  . :
Emphasis:       ═ ║ ╔ ╗ ╚ ╝
```

---

## ASCII Flowchart Template

```
┌─────────┐
│  Start  │
└────┬────┘
     │
     ▼
┌─────────┐     Yes    ┌─────────┐
│ Cond?   │───────────>│Process A│
└────┬────┘            └────┬────┘
     │ No                   │
     ▼                      │
┌─────────┐                 │
│Process B│                 │
└────┬────┘                 │
     │                      │
     └──────────┬───────────┘
                │
                ▼
          ┌─────────┐
          │   End   │
          └─────────┘
```

---

## ASCII Sequence Template

```
  User          Frontend         API           Database
    │               │              │               │
    │   click       │              │               │
    │──────────────>│              │               │
    │               │   request    │               │
    │               │─────────────>│               │
    │               │              │    query      │
    │               │              │──────────────>│
    │               │              │               │
    │               │              │    result     │
    │               │              │<──────────────│
    │               │   response   │               │
    │               │<─────────────│               │
    │    render     │              │               │
    │<──────────────│              │               │
    │               │              │               │
```

---

## ASCII State Diagram Template

```
                    ┌─────────────────────────────────┐
                    │                                 │
                    ▼                                 │
              ┌──────────┐                            │
     ┌───────>│   Idle   │<───────┐                  │
     │        └────┬─────┘        │                  │
     │             │ fetch        │ reset            │
     │             ▼              │                  │
     │        ┌──────────┐        │                  │
     │        │ Loading  │────────┼──────────────────┘
     │        └────┬─────┘        │         error
     │             │              │
     │ resolve     │    reject    │
     │             ▼              │
     │        ┌──────────┐   ┌────┴─────┐
     └────────│ Success  │   │  Error   │
              └──────────┘   └──────────┘
```

---

## ASCII Tree Template

```
project/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useApi.ts
│   ├── services/
│   │   └── api.ts
│   └── index.ts
├── tests/
│   └── components/
│       └── Button.test.tsx
├── package.json
└── README.md
```

---

## ASCII Table Template

```
┌──────────────┬────────────┬─────────────┬──────────────┐
│    Column    │    Type    │   Default   │  Description │
├──────────────┼────────────┼─────────────┼──────────────┤
│ id           │ UUID       │ auto        │ Primary key  │
│ name         │ VARCHAR    │ ''          │ User name    │
│ email        │ VARCHAR    │ NULL        │ Email addr   │
│ created_at   │ TIMESTAMP  │ now()       │ Creation     │
└──────────────┴────────────┴─────────────┴──────────────┘
```

---

## ASCII Architecture Template

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Browser   │  │  Mobile App │  │     CLI     │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               Load Balancer / Auth                   │   │
│  └─────────────────────────┬───────────────────────────┘   │
└────────────────────────────┼────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  User Svc    │    │  Order Svc   │    │ Product Svc  │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   User DB    │    │   Order DB   │    │  Product DB  │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## ASCII Simple Box Template

```
+-------------+       +-------------+       +-------------+
|   Input     |------>|   Process   |------>|   Output    |
+-------------+       +-------------+       +-------------+
```

---

## ASCII Best Practices

- Create assuming monospace font (display in code blocks)
- Use consistent box styles: +--+ or ┌──┐
- Use arrows: --> or ──> or │ ▼
- Keep width under 80 characters (terminal compatibility)
- Consider splitting if too complex (simplicity is key)
- Japanese characters: full-width = 2 half-width characters

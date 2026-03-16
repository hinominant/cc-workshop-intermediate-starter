# Intent Patterns: Technical Intent to Business Translation

This document provides comprehensive patterns for translating technical intentions into business-understandable language.

---

## How to Use This Document

1. **Find the category** matching your technical intent
2. **Use the template** to structure your explanation
3. **Customize** with your specific context and metrics
4. **Validate** with the "So What" test - does it answer "why should business care?"

---

## Category 1: Availability & Reliability

### Redundancy / High Availability

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Add redundancy for fault tolerance" | "To keep service running without interruption" |
| Why | "Single point of failure elimination" | "Service continues even if one component fails" |
| So What | "99.9% uptime SLA" | "Less than 9 hours downtime per year" |
| Trade-off | "2x infrastructure cost" | "Infrastructure cost increases but prevents outage losses" |

**Business analogy:** "Like having backup generators. Operations continue even during power outages."

### Disaster Recovery

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Implement DR site in another region" | "To continue service even in disasters" |
| Why | "Geographic redundancy" | "Operations continue from another location even in earthquakes" |
| So What | "RTO 4 hours, RPO 1 hour" | "Recovery within 4 hours, maximum 1 hour data loss in worst case" |
| Trade-off | "Additional region cost + complexity" | "Operating cost increases but greatly reduces business continuity risk" |

### Health Checks / Monitoring

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Add health check endpoints and alerts" | "To detect problems early and minimize impact" |
| Why | "Proactive issue detection" | "Detect problems before customers notice" |
| So What | "MTTR reduction from hours to minutes" | "Greatly reduce incident response time, limit impact scope" |
| Trade-off | "Monitoring infrastructure overhead" | "Monitoring system costs occur but prevent outage losses" |

---

## Category 2: Performance & Speed

### Caching

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Add Redis caching layer" | "Remember frequently used data for quick response" |
| Why | "Reduce database load, improve latency" | "Avoid keeping customers waiting" |
| So What | "Page load time 3s → 0.3s" | "10x faster page display, prevent abandonment" |
| Trade-off | "Data staleness (TTL), additional infra" | "Slight delay in reflecting latest data" |

**Business analogy:** "Like keeping FAQ answers handy. No need to look up every time."

### CDN (Content Delivery Network)

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Distribute static assets via CDN" | "Deliver content quickly to customers worldwide" |
| Why | "Geographic proximity reduces latency" | "Serve data from locations near customers" |
| So What | "Global users get same fast experience" | "Provide same experience to overseas users as domestic" |
| Trade-off | "CDN costs, cache invalidation complexity" | "Delivery costs occur but offset by improved experience" |

### Database Indexing

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Add indexes to frequently queried columns" | "Speed up searches" |
| Why | "O(n) → O(log n) lookup" | "Search speed doesn't degrade as data grows" |
| So What | "Search results in milliseconds vs seconds" | "Customers get results without waiting" |
| Trade-off | "More storage, slower writes" | "Slight delay in data registration" |

**Business analogy:** "Like a book index. Find information without reading every page."

### Async Processing / Queue

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Move heavy processing to background queue" | "Process in background, don't make customers wait" |
| Why | "Non-blocking user experience" | "Can proceed to next action without waiting for completion" |
| So What | "Instant response, notify when done" | "Screen responds immediately, notified when complete" |
| Trade-off | "Eventual consistency, complexity" | "Results may not reflect immediately" |

---

## Category 3: Security

### Authentication Strengthening

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Implement OAuth 2.0 / OIDC" | "Protect customer information safely" |
| Why | "Industry-standard secure authentication" | "Adopt world-standard secure authentication" |
| So What | "Prevent unauthorized access, audit trail" | "Prevent unauthorized access, record who did what when" |
| Trade-off | "Implementation complexity, integration effort" | "Development effort increases but prevents security incidents" |

### Encryption (Data at Rest / In Transit)

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Enable TLS 1.3, encrypt database" | "Encrypt data so it's unreadable even if stolen" |
| Why | "Protect sensitive data" | "Contents unreadable even if leaked" |
| So What | "Compliance (GDPR, PCI-DSS), customer trust" | "Regulatory compliance, maintain customer trust" |
| Trade-off | "Slight performance overhead, key management" | "Slightly slower processing, but prioritize security" |

**Business analogy:** "Like putting in a safe. Even if the safe is stolen, contents can't be opened."

### Rate Limiting

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Add rate limiting to APIs" | "Protect system from malicious access" |
| Why | "Prevent abuse and DDoS" | "Protect service from mass access attacks" |
| So What | "Service stability under attack" | "Regular customers unaffected even under attack" |
| Trade-off | "Legitimate heavy users may be throttled" | "High-frequency customers may face restrictions" |

### Input Validation / Sanitization

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Add strict input validation" | "Prevent malicious data input" |
| Why | "Prevent injection attacks" | "Prevent hackers from exploiting the system" |
| So What | "Protect data integrity and customer data" | "Protect customer data, maintain trust" |
| Trade-off | "Some valid edge cases may be rejected" | "Some unusual inputs may be rejected" |

---

## Category 4: Scalability

### Horizontal Scaling

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Add auto-scaling to web tier" | "Automatically handle traffic increases" |
| Why | "Handle traffic spikes without manual intervention" | "Automatically respond to surges like campaigns" |
| So What | "No downtime during peak, cost efficiency" | "Service continues during busy periods, reduce costs during quiet times" |
| Trade-off | "Stateless architecture requirement" | "Some design changes may be needed" |

**Business analogy:** "Like adjusting checkout counter count based on crowding. Add when busy, reduce when quiet."

### Load Balancing

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Distribute traffic across multiple servers" | "Share work across multiple servers" |
| Why | "Prevent single server overload" | "Prevent burden from concentrating on one server" |
| So What | "Consistent performance under load" | "Same speed service no matter how crowded" |
| Trade-off | "Session management complexity" | "Session state management requires consideration" |

### Database Sharding / Partitioning

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Partition data across multiple databases" | "Store data in distributed manner" |
| Why | "Single database can't handle volume" | "One warehouse isn't enough, so we split" |
| So What | "Unlimited growth potential" | "Can handle continued customer growth" |
| Trade-off | "Cross-shard queries become complex" | "Queries across all data become complex" |

### Microservices Architecture

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Split monolith into microservices" | "Separate into independent services by function" |
| Why | "Independent scaling and deployment" | "Scale only popular features, fix only problematic ones" |
| So What | "Faster feature delivery, isolated failures" | "Release new features faster, limit failure impact" |
| Trade-off | "Operational complexity, network overhead" | "Operations become complex, requires expertise" |

---

## Category 5: Maintainability

### Refactoring

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Refactor legacy codebase" | "Organize code to make future changes easier" |
| Why | "Reduce technical debt" | "Pay back existing 'debt'" |
| So What | "Faster future development, fewer bugs" | "Next feature development is faster, fewer bugs" |
| Trade-off | "No immediate visible change" | "No visible change now, but investment in future" |

**Business analogy:** "Like organizing a warehouse. Takes time now but makes things easier to find later."

### Modularization

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Break code into reusable modules" | "Organize components into reusable form" |
| Why | "Reduce duplication, improve testability" | "Avoid building same component multiple times" |
| So What | "Faster development, consistent behavior" | "Improved development efficiency, reduced quality variation" |
| Trade-off | "Upfront design effort" | "Initial design time required" |

### Code Documentation

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Add comprehensive documentation" | "Document knowledge for team sharing" |
| Why | "Knowledge transfer, onboarding" | "Ensure continuity when staff changes" |
| So What | "Reduced dependency on individuals" | "Team structure not dependent on specific people" |
| Trade-off | "Documentation maintenance overhead" | "Effort required to keep documents current" |

### Automated Testing

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Add unit/integration test coverage" | "Build system to automatically detect bugs" |
| Why | "Catch bugs before production" | "Find problems before reaching customers" |
| So What | "Confident deployments, faster iteration" | "Release with confidence, increase development speed" |
| Trade-off | "Test code maintenance" | "Test maintenance required" |

---

## Category 6: Cost Optimization

### Serverless Migration

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Move to serverless architecture" | "Switch to pay-for-what-you-use model" |
| Why | "Pay-per-use instead of always-on" | "Reduce idle time costs" |
| So What | "70% cost reduction for variable workloads" | "Significant cost reduction for variable-load services" |
| Trade-off | "Cold start latency, vendor lock-in" | "Slight startup delay, dependency on specific cloud" |

### Resource Right-sizing

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Right-size instances based on actual usage" | "Optimize resources based on actual usage" |
| Why | "Over-provisioned resources waste money" | "Eliminate waste from paying for unused capacity" |
| So What | "30-50% infrastructure cost reduction" | "Reduce infrastructure costs by 30-50%" |
| Trade-off | "Requires usage monitoring" | "Continuous usage monitoring required" |

### Reserved Instances / Spot Instances

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Use reserved/spot instances for stable workloads" | "Use reservations and spare capacity to reduce costs" |
| Why | "Commit to usage for discount" | "Get discounts through long-term commitment" |
| So What | "Up to 70% savings on compute" | "Reduce computing costs by up to 70%" |
| Trade-off | "Less flexibility, interruption risk (spot)" | "Reduced flexibility, risk of sudden stop (spot)" |

---

## Category 7: Integration & Interoperability

### API Design / REST/GraphQL

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Design RESTful API / GraphQL endpoint" | "Create interface for connecting with other systems" |
| Why | "Enable third-party integrations" | "Enable integration with partners and other services" |
| So What | "Ecosystem expansion, new revenue streams" | "Value increases as integration partners grow" |
| Trade-off | "API maintenance, versioning complexity" | "Compatibility maintenance required when specs change" |

### Webhook Implementation

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Add webhook support" | "System to automatically notify when events occur" |
| Why | "Real-time notifications to external systems" | "Notify immediately when something happens" |
| So What | "Automation enablement for customers" | "Enable automation on customer side" |
| Trade-off | "Delivery guarantees, retry logic" | "Need design for reliable delivery" |

### Message Queue / Event-Driven

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Implement message queue between services" | "Smooth communication between services" |
| Why | "Decouple services, handle spikes" | "Enable each service to operate independently" |
| So What | "Resilient integrations, no data loss" | "No data loss even with temporary failures" |
| Trade-off | "Eventual consistency, debugging complexity" | "Not immediately reflected, complex troubleshooting" |

---

## Category 8: Data Management

### Database Migration

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Migrate from MySQL to PostgreSQL" | "Move database system to new one" |
| Why | "Better performance, features, support" | "Move to more capable, future-proof system" |
| So What | "Future-proof, better query capabilities" | "Easier to add future features" |
| Trade-off | "Migration risk, downtime, learning curve" | "Risk during migration and temporary downtime required" |

### Data Archival

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Archive old data to cold storage" | "Move old data to low-cost storage" |
| Why | "Reduce primary storage costs" | "Lighten main system and reduce costs" |
| So What | "80% storage cost reduction for old data" | "Reduce old data storage costs by 80%" |
| Trade-off | "Slower access to archived data" | "Access to archived data becomes slower" |

### Backup Strategy

| Aspect | Technical | Business Translation |
|--------|-----------|---------------------|
| Intent | "Implement 3-2-1 backup strategy" | "Reliably backup data in multiple ways" |
| Why | "Protect against data loss" | "Enable data recovery in any situation" |
| So What | "Business continuity guaranteed" | "Can continue business even in worst case" |
| Trade-off | "Storage costs, backup window" | "Backup storage costs occur" |

---

## Quick Reference: Common Phrases

### When explaining "Why we need this":

| Technical Reason | Business Translation |
|-----------------|---------------------|
| "Single point of failure" | "Risk of everything stopping if one thing breaks" |
| "Technical debt" | "'Debt' that slows future development speed" |
| "Tight coupling" | "Risk of changes in one place affecting others" |
| "Security vulnerability" | "Risk of data breach or hacking" |
| "Scalability bottleneck" | "Risk of not handling customer growth" |
| "Performance degradation" | "Increased customer wait time" |

### When explaining trade-offs:

| Technical Trade-off | Business Translation |
|--------------------|---------------------|
| "Increased complexity" | "Requires operational expertise" |
| "Higher infrastructure cost" | "Monthly operating costs increase" |
| "Development time" | "Other feature development may be delayed" |
| "Eventual consistency" | "Slight delay in data reflection" |
| "Vendor lock-in" | "Dependency on specific company's service" |
| "Breaking change" | "Affects existing integrations" |

---

## Template: Complete Intent Explanation

Use this template for comprehensive technical intent explanations:

```markdown
## [Technical Initiative Name] Explanation

### 1. What We're Doing (What)
[Concrete action - explain avoiding technical terms]

### 2. Why It's Needed (Why)
**Current issues:**
- [Business-impacting problem 1]
- [Business-impacting problem 2]

**If we don't act:**
- [Risk if left unaddressed]

### 3. Expected Benefits (So What)
**Business benefits:**
- [Specific improvement 1] → [Quantitative effect]
- [Specific improvement 2] → [Quantitative effect]

**Customer benefits:**
- [Customer experience improvement]

### 4. Costs and Trade-offs (Trade-off)
**Required costs:**
- Development effort: [Duration]
- Operating cost: [Increase/decrease]

**Considerations:**
- [Trade-off 1 explanation]
- [Trade-off 2 explanation]

### 5. Conclusion and Recommendation
[Recommended action and reason]
```

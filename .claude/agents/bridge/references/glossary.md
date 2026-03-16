# Bridge Glossary

## Business ↔ Technical Translation Dictionary

### A

**API (Application Programming Interface)**
- Technical definition: Protocol for data exchange between systems
- Business translation: "A common language for systems to talk to each other"
- Example: "Using PayPal API" = "Sending data following PayPal's rules to request payment"

**Agile**
- Technical definition: Methodology with short development/feedback cycles
- Business translation: "Build small, show early, improve quickly"
- Contrast: Waterfall = "Design everything before building"

**Assumption**
- Bridge meaning: Something presumed true without explicit confirmation
- Risk: If wrong, rework occurs
- Example: "User is logged in" assumption

---

### B

**Backlog**
- Technical definition: Prioritized list of tasks to do
- Business translation: "To-do list. Do from the top down"
- Note: "Put in backlog" = "Not doing now, but won't forget"

**Bug**
- Technical definition: Code problem not working as expected
- Business translation: "System defect"
- Contrast: Feature (adding new) vs Bug (fixing)

**Blocker**
- Technical definition: Obstacle stopping work
- Business translation: "Problem that must be solved to proceed"
- Importance: Needs highest priority attention

---

### C

**Cache**
- Technical definition: Mechanism to temporarily store frequently used data for speed
- Business translation: "Remembering answers to frequently asked questions"
- Trade-off: Faster, but data might be stale

**CI/CD (Continuous Integration/Continuous Deployment)**
- Technical definition: Mechanism to automatically test and deploy code changes
- Business translation: "When changes are made, auto quality check, if OK goes to production"
- Benefit: Reduces human error, speeds up releases

**Constraint**
- Bridge meaning: Unchangeable condition
- Example: "Budget is $X", "Release is on date Y"
- Important: Making constraints explicit aligns understanding

---

### D

**Dependency**
- Technical definition: Relationship where one task depends on another's completion
- Business translation: "Can't start B until A is done"
- Risk: If dependency delays, everything delays

**Deploy**
- Technical definition: Placing developed work into production environment
- Business translation: "Putting products on the store shelf"
- Contrast: Development = making the product, Deploy = putting it on display

**DX (Developer Experience)**
- Technical definition: Usability and work comfort for developers
- Business translation: "Environment where engineers can work stress-free"
- Benefit: Improved productivity, reduced turnover

---

### E

**Edge Case**
- Technical definition: Boundary or unusual condition
- Business translation: "Unusual usage"
- Example: "User with 100-character name", "$0 product"

**Effort**
- Bridge meaning: Labor/time required for work
- Expression: Person-days, story points
- Note: Effort ≠ Calendar days

**Expectation Gap**
- Bridge meaning: Different "this is what should happen" perceptions among stakeholders
- Example: PM thinks "release next week", Eng thinks "release next month"
- Solution: Explicit confirmation and documentation

---

### F

**Feasibility**
- Bridge meaning: Whether achievable technically, time-wise, budget-wise
- Evaluation axes: Technical difficulty, effort, risk
- Confirm with: Atlas, Builder

**Feature**
- Technical definition: New capability users can use
- Business translation: "Now you can do this"
- Contrast: Bug Fix = "This is fixed"

**Feedback Loop**
- Technical definition: Cycle returning results to input for improvement
- Business translation: "Build → Show → Listen → Fix cycle"
- Important: Shorter loops mean faster improvement

---

### H

**Handoff**
- Bridge meaning: Transferring to next person/agent
- Important: Prevent information loss at transfer
- Tool: Handoff Template

**Hotfix**
- Technical definition: Emergency production fix
- Business translation: "Must fix right now"
- Characteristic: Skips some normal process for speed

---

### I

**Impact**
- Bridge meaning: Result brought by a change
- Evaluation axes: User count, revenue, risk, effort
- Usage: "High impact" = material for raising priority

**Integration**
- Technical definition: Connecting multiple systems
- Business translation: "Making system A and B able to exchange data"
- Note: Integration requires coordination on both sides

---

### L

**Latency**
- Technical definition: Processing delay time
- Business translation: "Time user waits"
- Guideline: Under 100ms = fast, over 1 second = slow

**Load**
- Technical definition: Processing volume on system
- Business translation: "How many people using simultaneously"
- Risk: Too much load causes slowdown or crash

---

### M

**Migration**
- Technical definition: Moving from old system/data to new
- Business translation: "Moving house"
- Risk: Data loss, downtime

**MVP (Minimum Viable Product)**
- Technical definition: Minimum product that can deliver value
- Business translation: "Minimum set to be usable"
- Purpose: Get to market quickly and get feedback

---

### P

**Priority**
- Bridge meaning: Order of what to do first
- Note: "Everything high priority" = no priority at all
- Method: Stack Ranking (no ties allowed)

**Production**
- Technical definition: Environment used by actual users
- Business translation: "The storefront"
- Contrast: Development environment = "Back workroom"

---

### R

**Refactoring**
- Technical definition: Reorganizing code without changing behavior
- Business translation: "Rearranging furniture to move around easier"
- Benefit: Makes future feature additions easier

**Regression**
- Technical definition: Existing functionality breaking due to changes
- Business translation: "Adding something new broke something that was there before"
- Prevention: Test automation

**Release**
- Technical definition: Publishing a new version
- Business translation: "Making it available to customers"

**Rollback**
- Technical definition: Reverting to previous version
- Business translation: "Actually, let's go back to before"
- Important: Safety valve when problems occur

---

### S

**Scalability**
- Technical definition: Ability to handle increasing users
- Business translation: "Still works even with 10x customers"
- Trade-off: Scalable design has higher initial cost

**Scope**
- Bridge meaning: Range of what to do / not do
- Important: Without explicit definition, it creeps
- Method: Scope Fence

**Scope Creep**
- Technical definition: Gradual expansion from original range
- Business translation: "Work keeps increasing before you know it"
- Countermeasure: Change control process

**Sprint**
- Technical definition: 1-4 week development cycle
- Business translation: "What we're doing this week, bundled"

**Stakeholder**
- Bridge meaning: Everyone involved in the project
- Example: PM, engineers, designers, executives, users

---

### T

**Technical Debt**
- Technical definition: Short-term solutions increasing future work
- Business translation: "Pay later. Easy now, but repayment needed later"
- Example: "Just make it work" code needs cleanup later

**Trade-off**
- Bridge meaning: Relationship of sacrificing something to gain something
- Example: "Speed vs Quality", "Features vs Time"
- Important: Make explicit, don't hide

---

### U

**UX (User Experience)**
- Technical definition: Entire experience of user using product
- Business translation: "Ease of use, how it feels to use"
- Related: UI = appearance, UX = experience

---

### V

**Validation**
- Technical definition: Confirming input is correct
- Business translation: "Checking so weird data doesn't get in"
- Example: Email address format check

**Velocity**
- Technical definition: Team's development speed
- Business translation: "How much progress per week"
- Note: Compare only to own team's past

---

## Commonly Used Bridge Expressions

### When Confirming Requirements
| What to Confirm | How to Ask |
|-----------------|------------|
| Scope confirmation | "Is this included or excluded?" |
| Priority confirmation | "Which comes first, A or B?" |
| Assumption confirmation | "OK to proceed assuming X?" |
| Deadline confirmation | "When is it needed at the latest?" |

### When Explaining Trade-offs
| Situation | Expression |
|-----------|------------|
| Either-or | "Taking A means giving up B" |
| Phased proposal | "How about MVP first, rest in Phase 2?" |
| Risk explanation | "Proceeding as-is risks X" |
| Alternative proposal | "Alternative approach: X" |

### When Building Consensus
| Purpose | Expression |
|---------|------------|
| Confirmation | "Is this understanding correct?" |
| Recording | "Recorded as a decision" |
| Change control | "Approval needed as scope change" |
| Escalation | "There's a point I'd like judgment on" |

---

## Intent Patterns: Why We Do What We Do

This section provides patterns for explaining technical "intent" in business language.

### Infrastructure Intent Patterns

| Technical Intent | Engineer Says | Business Translation | Analogy |
|-----------------|---------------|----------------------|---------|
| Redundancy | "For high availability" | "To keep service running without interruption" | "Having backup generators" |
| Load Balancing | "For load distribution" | "To handle crowds smoothly" | "Adding more checkout counters" |
| Disaster Recovery | "For DR protection" | "To continue operating even in disasters" | "Having a backup office" |
| Auto Scaling | "For scalability" | "To automatically handle peak periods" | "Seasonal staff adjustments" |
| Health Monitoring | "For enhanced monitoring" | "To detect problems early and minimize impact" | "Regular health checkups" |

### Performance Intent Patterns

| Technical Intent | Engineer Says | Business Translation | Analogy |
|-----------------|---------------|----------------------|---------|
| Caching | "For caching" | "To avoid keeping customers waiting" | "Keeping FAQ answers at hand" |
| CDN | "For CDN usage" | "To enable fast access from anywhere" | "Having branches nationwide" |
| Database Index | "For index addition" | "To speed up searches" | "Adding an index to a book" |
| Query Optimization | "For query optimization" | "To make data retrieval efficient" | "Streamlining search procedures" |
| Async Processing | "For async processing" | "To process without making customers wait" | "Taking a queue number at reception" |
| Connection Pooling | "For connection pooling" | "To reduce waste and improve efficiency" | "Sharing phone lines" |

### Security Intent Patterns

| Technical Intent | Engineer Says | Business Translation | Analogy |
|-----------------|---------------|----------------------|---------|
| Encryption | "For encryption" | "To make data unreadable even if stolen" | "Putting in a safe" |
| Authentication | "For enhanced authentication" | "To prevent impersonation" | "Requesting ID verification" |
| Authorization | "For authorization control" | "To prevent unauthorized access" | "Access card restrictions" |
| Rate Limiting | "For rate limiting" | "To prevent malicious mass access" | "Entry restrictions" |
| Input Validation | "For input validation" | "To prevent system damage from bad data" | "Checking items at entrance" |
| Audit Logging | "For audit logging" | "To record and track who did what" | "Security camera recordings" |
| Secret Management | "For secret management" | "To securely store passwords etc." | "Keeping safe keys separate" |

### Maintainability Intent Patterns

| Technical Intent | Engineer Says | Business Translation | Analogy |
|-----------------|---------------|----------------------|---------|
| Refactoring | "For refactoring" | "To make future changes quick and safe" | "Organizing the warehouse" |
| Modularization | "For modularization" | "To reuse components and improve efficiency" | "Standardized parts" |
| Testing | "For test addition" | "To detect bugs before changes go live" | "Pre-shipment inspection" |
| Documentation | "For documentation" | "To ensure continuity when staff changes" | "Creating operation manuals" |
| Code Review | "For code review" | "To check quality with multiple eyes" | "Double-check system" |
| Dependency Update | "For dependency updates" | "To reduce security risks" | "Regular equipment maintenance" |

### Scalability Intent Patterns

| Technical Intent | Engineer Says | Business Translation | Analogy |
|-----------------|---------------|----------------------|---------|
| Horizontal Scaling | "For horizontal scaling" | "To increase capacity by adding units" | "Adding more registers" |
| Sharding | "For sharding" | "To distribute and store large amounts of data" | "Having multiple warehouses" |
| Microservices | "For microservices" | "To change features independently" | "Specialty shopping district" |
| Stateless Design | "For stateless design" | "To provide same service from any server" | "Same service at any counter" |
| Queue-based | "For queue introduction" | "To process in order even during peaks" | "Queuing system" |

### Cost Optimization Intent Patterns

| Technical Intent | Engineer Says | Business Translation | Analogy |
|-----------------|---------------|----------------------|---------|
| Serverless | "For serverless" | "To pay only for what we use" | "From rental to pay-per-use" |
| Right-sizing | "For resource optimization" | "To eliminate unused capacity" | "Office downsizing" |
| Reserved Instances | "For reserved instances" | "To get discounts through long-term commitment" | "Annual contract discount" |
| Spot Instances | "For spot instances" | "To use spare capacity cheaply" | "Discounted empty seats" |
| Data Tiering | "For data tiering" | "To optimize cost by usage frequency" | "Keep frequently used items nearby" |

---

## Common Explanation Phrases

### Opening Phrases

| Situation | English Pattern | Japanese Sample |
|-----------|-----------------|-----------------|
| Problem introduction | "Currently, we have X problem" | 「現在、〇〇という課題があります」 |
| Solution introduction | "By introducing X, we can solve this" | 「〇〇を導入することで解決できます」 |
| Impact introduction | "This change will improve X" | 「この変更により、〇〇が改善されます」 |
| Risk introduction | "Without action, X risk exists" | 「このままでは、〇〇のリスクがあります」 |
| Comparison | "Compared to the previous method, X differs" | 「従来の方法と比べて、〇〇が違います」 |

### Connecting Phrases

| Purpose | English Pattern | Japanese Sample |
|---------|-----------------|-----------------|
| Causation | "For X reason, Y is needed" | 「〇〇のため、△△が必要です」 |
| Contrast | "While X, we also need to consider Y" | 「〇〇ですが、△△も考慮が必要です」 |
| Addition | "Additionally, X benefit exists" | 「さらに、〇〇の効果もあります」 |
| Condition | "In case of X, Y will result" | 「〇〇の場合は、△△となります」 |
| Sequence | "First X, then Y" | 「まず〇〇を行い、次に△△します」 |

### Trade-off Explanation Phrases

| Pattern | English Pattern | Japanese Sample |
|---------|-----------------|-----------------|
| Accept trade-off | "By accepting X, we gain Y" | 「〇〇を受け入れることで、△△を得られます」 |
| Minimize trade-off | "The downside of X is mitigated by Y" | 「〇〇のデメリットは、△△で軽減できます」 |
| Balance trade-off | "We balance X and Y" | 「〇〇と△△のバランスを取ります」 |
| Defer trade-off | "X can be addressed later" | 「〇〇は後から対応できます」 |
| Acknowledge trade-off | "While X costs, Y recovers it" | 「〇〇のコストは発生しますが、△△で回収できます」 |

### Closing Phrases

| Situation | English Pattern | Japanese Sample |
|-----------|-----------------|-----------------|
| Recommendation | "For these reasons, we recommend X" | 「以上の理由から、〇〇を推奨します」 |
| Request | "Please decide on X" | 「〇〇についてご判断をお願いします」 |
| Next steps | "With approval, we will start X" | 「ご承認いただければ、〇〇を開始します」 |
| Timeline | "If started by X, we can meet Y" | 「〇〇までに開始できれば、△△に間に合います」 |
| Alternatives | "If X is difficult, Y is an option" | 「もし〇〇が難しければ、△△という方法もあります」 |

---

## Technical Concept Translations (Extended)

### Architecture Concepts

| Technical Term | Definition | Business Translation | Analogy |
|---------------|------------|---------------------|---------|
| Monolith | All code in one place | "All features in one integrated system" | "Department store" |
| Microservices | Independent small services | "Independent services per function" | "Specialty shopping district" |
| Serverless | No server management | "No server management needed" | "Pay-per-use electricity" |
| Container | Packaged application | "Packaged, portable application" | "Shipping container" |
| Kubernetes | Container orchestration | "Automatic container management" | "Automated port operations" |
| API Gateway | Entry point for APIs | "System reception desk" | "Hotel front desk" |
| Service Mesh | Service-to-service communication | "Inter-service communication management" | "Internal phone system" |

### Data Concepts

| Technical Term | Definition | Business Translation | Analogy |
|---------------|------------|---------------------|---------|
| ACID | Transaction guarantees | "Data integrity guarantee" | "Bank transfer processing" |
| Eventual Consistency | Delayed synchronization | "Slightly delayed full reflection" | "Time for memos to reach branches" |
| Schema | Data structure definition | "Rules defining data format" | "Application form format" |
| Migration | Data/system move | "Data/system relocation" | "Office move" |
| ETL | Data transformation | "Collect, transform, store data" | "Process and store materials" |
| Data Lake | Raw data storage | "Raw data storage location" | "Raw materials warehouse" |
| Data Warehouse | Analyzed data storage | "Organized data for analysis" | "Finished goods warehouse" |

### Operations Concepts

| Technical Term | Definition | Business Translation | Analogy |
|---------------|------------|---------------------|---------|
| SLA | Service guarantee | "Service quality promise" | "Delivery guarantee" |
| SLO | Service target | "Service quality target" | "Delivery target time" |
| SLI | Service measurement | "Service quality measurement" | "Actual delivery time" |
| Incident | Service disruption | "Service abnormality" | "Store trouble" |
| Postmortem | Incident analysis | "Post-incident review" | "Accident investigation" |
| Runbook | Operational guide | "Operations manual" | "Emergency response manual" |
| On-call | Emergency duty | "Emergency response standby" | "Night duty" |

### Development Concepts

| Technical Term | Definition | Business Translation | Analogy |
|---------------|------------|---------------------|---------|
| Git | Version control | "Change history management" | "Document version control" |
| Branch | Parallel development | "Separate workspace from mainline" | "Experiment room" |
| Merge | Combining changes | "Integrate changes to mainline" | "Adopt experiment results" |
| Pull Request | Change review request | "Request to review and incorporate" | "Approval request form" |
| CI/CD | Automated testing/deployment | "Automated testing and release" | "Automated inspection and shipping" |
| Pipeline | Automated workflow | "Automated work flow" | "Conveyor belt" |
| Feature Flag | Gradual release | "Gradual feature release mechanism" | "Phased store rollout" |

---

## Stakeholder-Specific Vocabulary

### For Executives

| Topic | Avoid | Use Instead |
|-------|-------|-------------|
| Performance | "Latency reduction" | "Reduce customer wait time" |
| Security | "Vulnerability response" | "Reduce data breach risk" |
| Infrastructure | "Cloud migration" | "Optimize IT cost and flexibility" |
| Development | "Refactoring" | "Investment to maintain development speed" |
| Operations | "SLA improvement" | "Strengthen service quality guarantee" |

### For Product Managers

| Topic | Avoid | Use Instead |
|-------|-------|-------------|
| Technical debt | "Legacy code" | "Cause of slow feature addition" |
| Dependencies | "External dependencies" | "Waiting for other team's work" |
| Testing | "Test coverage" | "Pre-release quality check scope" |
| Deployment | "Deployment" | "Process to deliver features to customers" |
| Monitoring | "Alert configuration" | "Early problem detection system" |

### For Sales/Marketing

| Topic | Avoid | Use Instead |
|-------|-------|-------------|
| Features | "API integration" | "Integration with other services" |
| Performance | "Scalability" | "Stable operation as users grow" |
| Security | "Compliance" | "System to protect customer data" |
| Reliability | "99.9% availability" | "Less than 9 hours downtime per year" |
| Support | "SLA" | "Guaranteed support response time" |

---

## Quick Reference Cards

### When Explaining "Why This Is Necessary"

| Reason Category | English Pattern | Japanese Sample |
|-----------------|-----------------|-----------------|
| Risk prevention | "Needed to prevent X" | 「〇〇を防ぐために必要です」 |
| Cost saving | "Needed to reduce X cost" | 「〇〇のコストを削減するために必要です」 |
| Speed improvement | "Needed to speed up X" | 「〇〇を速くするために必要です」 |
| Quality improvement | "Needed to improve X quality" | 「〇〇の品質を上げるために必要です」 |
| Compliance | "Needed for X regulation" | 「〇〇の規制に対応するために必要です」 |
| Competitive advantage | "Needed for X advantage over competitors" | 「競合に対して〇〇で優位に立つために必要です」 |

### When Explaining "What Happens If We Don't"

| Consequence | English Pattern | Japanese Sample |
|-------------|-----------------|-----------------|
| Service impact | "If X goes down, Y loss occurs" | 「〇〇がダウンした場合、△△の損失が発生します」 |
| Security impact | "If X leaks, Y liability arises" | 「〇〇が漏洩した場合、△△の責任が生じます」 |
| Cost impact | "If X is left, Y cost keeps increasing" | 「〇〇を放置すると、△△のコストが増え続けます」 |
| Opportunity cost | "Inability to do X means missing Y" | 「〇〇ができないことで、△△の機会を逃します」 |
| Competitive impact | "Delay in X means falling behind in Y" | 「〇〇に遅れると、△△で後れを取ります」 |

### When Asking for Decision

| Request Type | English Pattern | Japanese Sample |
|--------------|-----------------|-----------------|
| Approval | "Please approve X" | 「〇〇について、ご承認をお願いします」 |
| Prioritization | "Please decide priority between X and Y" | 「〇〇と△△、どちらを優先すべきかご判断ください」 |
| Resource | "X requires Y resources" | 「〇〇を実現するには、△△のリソースが必要です」 |
| Timeline | "Decision by X enables meeting Y" | 「〇〇までに決定いただければ、△△に間に合います」 |
| Feedback | "Please share thoughts on X direction" | 「〇〇の方向性について、ご意見をお聞かせください」 |

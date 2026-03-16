# Bridge Examples

## Example 1: Requirement Clarification

### Input
PM: "Users should be able to see sales on the dashboard"

### Bridge Analysis

```markdown
## Requirement Clarification: Dashboard Sales View

### Original Request
> "Users should be able to see sales on the dashboard"

### My Understanding
- Add sales information display to dashboard screen
- Target users are administrators or sales staff

### Hidden Assumptions
| # | Assumption | Risk if Wrong | Validation Needed |
|---|------------|---------------|-------------------|
| 1 | "Users" = admins only | Permission design changes | Confirm with PM |
| 2 | "Sales" = monthly sales | Data granularity differs | Confirm with PM |
| 3 | Data already exists in DB | Additional data collection needed | Confirm with Tech Lead |
| 4 | Real-time update not required | Performance requirements change | Confirm with PM |

### Open Questions
| # | Question | Priority |
|---|----------|----------|
| 1 | Which user roles can view? | High |
| 2 | What granularity? (daily/weekly/monthly) | High |
| 3 | How far back should historical data go? | Medium |
| 4 | Chart or table format? | Medium |
| 5 | Consistency with other dashboards? | Low |

### Technical Implications
| Aspect | Impact | Trade-off |
|--------|--------|-----------|
| Data | Need sales aggregation queries | Performance varies with/without cache |
| Permissions | May need RBAC extension | Consistency with existing permission model |
| UI | Integration with existing dashboard | Consistency with design system |

### Recommended Next Steps
1. Validation meeting with PM on assumptions
2. Confirm existing data model (Atlas)
3. After confirmation, create spec with Scribe
```

---

## Example 2: Scope Creep Detection

### Scenario
Original requirement: "Add search functionality"
Mid-development request: "Also want to save search history"

### Bridge Response

```markdown
## Scope Change Assessment

### Change Request
> "Save search history so users can view it later"

### Original Scope
> "Product search implementation (search box, result display, pagination)"

### Gap Analysis
| Aspect | Original | Requested | Delta |
|--------|----------|-----------|-------|
| Features | 3 | 4 | +1 |
| Effort estimate | 5 person-days | 8 person-days | +3 person-days |
| Risk | Low | Medium | ↑ (data storage added) |

### Impact Assessment

**Schedule:**
- Original: 1 week
- With change: 1.5 weeks (+3 days)

**Resources:**
- Additional DB design/migration needed
- Frontend history UI addition

**Quality:**
- Privacy consideration needed (search history is personal data)
- Delete functionality also required

**Dependencies:**
- Assumes authenticated users (what about guests?)

### Options

| Option | Description | Impact |
|--------|-------------|--------|
| A | Include in current scope | +3 days, delayed release |
| B | Move to Phase 2 | On-time release, add later |
| C | MVP implementation (browser local storage) | +1 day, server-side later |

### Recommendation
**Option B (Recommended)**: Move to Phase 2

**Reasons:**
- Core search value deliverable without history
- Time needed to consider privacy requirements
- Maintains original schedule

### Required Approvals
- [ ] PM: Approve scope change
- [ ] Tech Lead: Confirm technical feasibility
```

---

## Example 3: Trade-off Explanation

### Scenario
PM: "Why does this feature take 2 weeks? A similar feature was done in 3 days"

### Bridge Response

```markdown
## Trade-off Analysis: Feature Implementation Time

### Context
Previous "like" feature: 3 days
Current "comment" feature: 2 weeks

### Comparison

| Aspect | Like Feature (3 days) | Comment Feature (2 weeks) |
|--------|----------------------|---------------------------|
| Data model | 1 table (user_id, item_id) | 3 tables (comments, replies, notifications) |
| UI | 1 button | Text input, thread display, edit/delete |
| State management | 2 states (ON/OFF) | Multiple states (creating, posted, editing, deleted) |
| Real-time | Not required | Required (show other users' comments) |
| Notifications | Not required | Required (reply notifications) |
| Moderation | Not required | Required (spam prevention, reporting) |

### Visual Comparison

```
Like feature:
[User] --click--> [Like button] --save--> [DB]

Comment feature:
[User] --input--> [Text area] --validation--> [Server]
                                                |
                                         [Spam check]
                                                |
                                          [DB save]
                                                |
                                      [WebSocket notify]
                                                |
                                   [Deliver to other users]
```

### Business Translation

| Technical Reason | Business Meaning |
|------------------|------------------|
| Real-time sync | Users see new comments without page refresh |
| Spam prevention | Protect brand from malicious comments |
| Notification system | Improve user engagement |
| Edit/delete functionality | UX quality for correcting mistakes |

### Options

| Option | Time | Scope | Risk |
|--------|------|-------|------|
| Full features | 2 weeks | All features | Low |
| MVP (no notifications) | 1 week | Basic features only | Medium (later addition cost) |
| MVP (no real-time) | 5 days | Page refresh required | Medium (UX degradation) |

### Recommendation
**Full features (2 weeks)** recommended

**Reasons:**
- Comments are core to engagement
- Comments without notifications have low reply rates (industry data)
- Later additions complicate integration testing
```

---

## Example 4: Stakeholder Alignment

### Scenario
PM: "Want to release by end of month"
Tech Lead: "Realistically, early next month for quality"
Design: "No time for user testing"

### Bridge Response

```markdown
## Stakeholder Alignment: Release Timing

### Current Positions

| Stakeholder | Position | Primary Concern |
|-------------|----------|-----------------|
| PM | End of month release | Competitor preparing similar feature |
| Tech Lead | Early next month release | Test coverage, production stability |
| Design | Additional 1 week | Usability testing needed |

### Gap Analysis

```
PM ----[4 days]---- Tech Lead ----[3 days]---- Design
     (quality risk)          (UX risk)
```

### Common Ground
- Everyone wants to release
- Everyone values quality
- Everyone is aware of competition

### Conflict Points
- Time vs. quality trade-off
- Different definitions of "minimum quality"

### Options Analysis

| Option | Timeline | Quality Risk | UX Risk | Competitive Risk |
|--------|----------|--------------|---------|------------------|
| A: PM plan | End of month | High | High | Low |
| B: Tech plan | Early next month | Low | Medium | Medium |
| C: Design plan | Mid next month | Low | Low | High |
| D: Phased release | End of month MVP | Low | Medium | Low |

### Proposed Compromise: Option D (Phased Release)

**Phase 1 (End of month):**
- Core features only
- Limited release as internal beta
- Meets Tech Lead's quality bar

**Phase 2 (Early next month):**
- Full feature release
- User testing feedback incorporated
- Release to all users

### Benefits for Each Stakeholder

| Stakeholder | What They Get |
|-------------|---------------|
| PM | "Release" fact by end of month (competitive response) |
| Tech Lead | Limited release enables production testing |
| Design | User testing possible before Phase 2 |

### Required Agreement
- [ ] PM: OK with phased release
- [ ] Tech Lead: Define Phase 1 scope
- [ ] Design: Plan UX testing for Phase 2

### Next Steps
1. Today: Specify Phase 1 scope
2. Tomorrow: 30-min confirmation meeting with all three
3. This week: Finalize Phase 1 development plan
```

---

## Example 5: Feasibility Communication

### Scenario
PM: "Want to add AI product recommendations. Can it be done quickly?"

### Bridge Response

```markdown
## Feasibility Assessment: AI Recommendation

### Request
> "Add AI product recommendations"

### Clarification Questions Asked
1. What level of accuracy expected? → "Amazon level"
2. Where to display? → "Product detail page and after purchase"
3. Budget? → "As cheap as possible"

### Feasibility Analysis

| Approach | Time | Cost | Quality | Feasibility |
|----------|------|------|---------|-------------|
| A: External API (AWS Personalize, etc.) | 2 weeks | $$$/month | High | ✅ |
| B: Rule-based (popularity, same category) | 3 days | $ (dev only) | Low | ✅ |
| C: In-house ML development | 3 months | $$$ | Medium→High | ⚠️ |
| D: "Amazon level" | Years | $$$$$$ | Very High | ❌ |

### Business Translation

**Reality of "Amazon level":**
- Amazon's recommendation team is hundreds of people
- 10+ years of data accumulation and ML R&D
- Need realistic goal setting

**Achievable Levels:**
| Level | Description | Time |
|-------|-------------|------|
| Bronze | Popular items in same category | 3 days |
| Silver | Purchase history-based collaborative filtering | 1 month |
| Gold | External AI service integration | 2 weeks + monthly cost |

### Recommendation

**Phase 1: Bronze (3 days)**
- Immediate value as "related products"
- Start data collection (for future AI learning)

**Phase 2: Silver or Gold (TBD)**
- Evaluate ROI based on Phase 1 data
- Compare in-house development vs. external service

### Why Not Jump to AI?
| Question | Answer |
|----------|--------|
| Enough data? | Need at least tens of thousands of purchase records |
| Cost effective? | External AI cost may not justify current sales volume |
| Expected improvement? | Industry average 5-15% CVR improvement, but not guaranteed |

### Required Decision
1. Proceed with Phase 1?
2. Budget (max monthly amount?)
3. Success metric (what % CVR improvement target?)
```

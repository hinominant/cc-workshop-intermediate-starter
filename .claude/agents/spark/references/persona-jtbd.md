# Spark Persona & JTBD Reference

Templates for persona definition and Jobs-to-be-Done framework integration.

## PERSONA-BASED PROPOSALS

Define target users and map features to their needs.

### Persona Template

```markdown
## Persona: [Name]

**Demographics**
- Role: [Job title/role]
- Experience: [Novice/Intermediate/Expert]
- Tech Savviness: [Low/Medium/High]
- Usage Frequency: [Daily/Weekly/Monthly]

**Goals**
- Primary: [Main objective when using the product]
- Secondary: [Supporting objectives]

**Pain Points**
- [Current frustration 1]
- [Current frustration 2]
- [Workflow inefficiency]

**Behaviors**
- [Typical usage pattern]
- [Preferred interaction style]
- [Decision-making factors]

**Quote**
> "[Characteristic quote that captures their mindset]"

**Success Metric**
- [How we know this persona is satisfied]
```

### Feature-Persona Matrix

```markdown
### Feature-Persona Matrix

| Feature | Persona A | Persona B | Persona C | Primary Target |
|---------|-----------|-----------|-----------|----------------|
| Dashboard | ★★★ | ★★☆ | ★☆☆ | Persona A |
| Export | ★☆☆ | ★★★ | ★★☆ | Persona B |
| Search | ★★★ | ★★★ | ★★★ | All |
| Automation | ★☆☆ | ★★☆ | ★★★ | Persona C |

★★★ = Critical (must-have)
★★☆ = Important (should-have)
★☆☆ = Nice-to-have (could-have)
```

### Common Persona Archetypes

| Archetype | Characteristics | Feature Focus |
|-----------|-----------------|---------------|
| Power User | Daily user, expert, efficiency-focused | Shortcuts, bulk actions, automation |
| Casual User | Weekly user, moderate skill, simplicity | Guided flows, defaults, presets |
| Admin | Manages others, oversight, control | Reports, permissions, audit logs |
| New User | First-time, learning, exploring | Onboarding, tooltips, examples |

---

## JTBD FRAMEWORK INTEGRATION

Apply Jobs-to-be-Done framework to understand deeper user motivations.

### Three Dimensions of Jobs

Every feature should address at least one job dimension:

| Dimension | Focus | Question | Example |
|-----------|-------|----------|---------|
| **Functional Job** | Task completion | "What are they trying to accomplish?" | "Complete expense report in under 5 minutes" |
| **Emotional Job** | Feelings | "How do they want to feel?" | "Feel confident numbers are accurate" |
| **Social Job** | Perception | "How do they want to be perceived?" | "Appear organized to manager" |

### JTBD Analysis Template

```markdown
## JTBD Analysis: [Feature Name]

### Job Statement
When [situation], I want to [motivation], so I can [expected outcome].

### Job Dimensions

**Functional Job**:
- Primary task: [What they're trying to accomplish]
- Success metric: [How they measure completion]
- Current solution: [How they do it today]

**Emotional Job**:
- Desired feeling: [How they want to feel]
- Current frustration: [Negative emotions today]
- Emotional trigger: [What creates the feeling need]

**Social Job**:
- Desired perception: [How they want others to see them]
- Social context: [Who observes their behavior]
- Status implication: [What success signals to others]

### Progress-Making Forces

**Push (Away from current state)**:
- [Problem with current solution]
- [Frustration driving change]

**Pull (Toward new solution)**:
- [Attraction to proposed feature]
- [Imagined better future]

### Progress-Blocking Forces

**Anxiety (Fear of new solution)**:
- [Uncertainty about new approach]
- [Risk of making things worse]

**Inertia (Attachment to current state)**:
- [Habit of current behavior]
- [Switching cost concerns]

### Force Balance Design

To drive adoption, the feature must:
1. **Amplify Push**: [How we make current pain more visible]
2. **Strengthen Pull**: [How we make benefits tangible]
3. **Reduce Anxiety**: [How we lower risk of trying]
4. **Overcome Inertia**: [How we make switching easy]
```

### JTBD-Driven Feature Prioritization

```markdown
### JTBD Priority Matrix

| Feature | Functional | Emotional | Social | Total Jobs | Priority |
|---------|------------|-----------|--------|------------|----------|
| [Feature A] | ★★★ | ★★☆ | ★☆☆ | 3 | High |
| [Feature B] | ★★☆ | ★★★ | ★★★ | 4 | Highest |
| [Feature C] | ★★★ | ★☆☆ | ★☆☆ | 2 | Medium |

★★★ = Strongly addresses this job
★★☆ = Moderately addresses this job
★☆☆ = Weakly addresses this job
```

### Integrating JTBD with Personas

```markdown
### Persona-Job Alignment

| Persona | Primary Job Type | Key Job Statement |
|---------|------------------|-------------------|
| Power User | Functional | "Complete tasks faster than alternatives" |
| New User | Emotional | "Feel confident I'm doing it right" |
| Manager | Social | "Appear in control to stakeholders" |
| Casual User | Emotional | "Feel productive without complexity" |
```

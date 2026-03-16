# Participant Screening & Consent

Screener survey templates, informed consent forms, and recruitment best practices.

---

## Screener Survey Template

```markdown
## Participant Screener: [Project Name]

### Survey Overview
- **Purpose**: Recruiting participants for [research name]
- **Duration**: ~5 minutes
- **Incentive**: [amount/points]
- **Study format**: [interview/usability test/etc.]
- **Study duration**: [X] minutes

---

### Basic Information (Required)

**Q1. What is your age?**
- [ ] Under 18 -> **TERMINATE** (minor exclusion)
- [ ] 18-24
- [ ] 25-34
- [ ] 35-44
- [ ] 45-54
- [ ] 55-64
- [ ] 65+

**Q2. What is your current occupation?**
- [ ] Full-time employee
- [ ] Part-time employee
- [ ] Self-employed / Freelancer
- [ ] Student
- [ ] Homemaker
- [ ] Other: [free text]

---

### Behavioral Screening

**Q3. How often do you use [product category]?**
- [ ] Daily -> **QUALIFIED**
- [ ] Several times a week -> **QUALIFIED**
- [ ] Several times a month -> **CONDITIONALLY QUALIFIED**
- [ ] A few times a year or less -> **TERMINATE** (insufficient usage)
- [ ] Never used -> **TERMINATE**

**Q4. Have you done [specific behavior/experience]?**
- [ ] Within the past month -> **QUALIFIED**
- [ ] Within the past 3 months -> **QUALIFIED**
- [ ] Within the past year -> **CONDITIONALLY QUALIFIED**
- [ ] Never -> **TERMINATE** (insufficient experience)

**Q5. Which [products/services] do you currently use? (Select all)**
- [ ] [Competitor A] -> qualification flag
- [ ] [Competitor B] -> qualification flag
- [ ] [Own product] -> **NOTE**: heavy user bias
- [ ] Other: [free text]
- [ ] None -> **TERMINATE**

---

### Exclusion Criteria

**Q6. Do you work in any of these industries? (Select all)**
- [ ] Advertising / Marketing -> **TERMINATE**
- [ ] Research / Survey -> **TERMINATE**
- [ ] [Target industry] -> **TERMINATE**
- [ ] IT / Software development -> **CONDITIONAL** (depends on role)
- [ ] None of the above -> **QUALIFIED**

**Q7. Have you participated in user research in the past 6 months?**
- [ ] Yes -> **NOTE**: possible professional participant
- [ ] No -> **QUALIFIED**

---

### Qualification Logic

| Condition | Result |
|-----------|--------|
| Q1 = Under 18 | Exclude |
| Q3 = Few times/year or Never | Exclude |
| Q4 = Never | Exclude |
| Q6 = Industry match | Exclude |
| Q3 = Daily/Weekly AND Q4 = Past month | Priority candidate |
| Other qualified | Candidate |
```

---

## Screener Best Practices

**DO:**
- Use behavior-based questions ("When was the last time you...?" not "Do you...?")
- Set specific time frames ("Within the past month" not "recently")
- Place exclusion criteria early (save ineligible participants' time)
- Include "Other" options where appropriate
- State incentive and duration clearly

**DON'T:**
- Use leading questions ("Do you find [product] useful?")
- Use vague options ("sometimes", "often" - subjective terms)
- Combine multiple conditions in one question
- Reveal study purpose in detail (induces participant bias)
- Exceed 5 minutes total

### Sample Size Guide

| Research Method | Recommended Participants | Screener Target |
|----------------|--------------------------|-----------------|
| User interviews | 5-8 | 20-30 responses |
| Usability testing | 5-6 | 15-25 responses |
| Focus groups | 6-8 per group | 25-35 responses |
| Diary studies | 10-15 | 40-60 responses |

---

## Informed Consent - Standard Form

```markdown
## Research Participation Consent Form

### Study Overview

| Item | Detail |
|------|--------|
| Study name | [Project name] |
| Conducted by | [Company/team name] |
| Purpose | Research to improve [product/service] |
| Duration | Approximately [X] minutes |
| Incentive | [Amount/points/none] |

---

### Study Activities

This study involves the following activities:
- [ ] Interview (one-on-one conversation)
- [ ] Usability test (operating product/prototype)
- [ ] Screen sharing (researcher observes your screen)
- [ ] Survey (answering questions)

---

### Recording

This study may involve the following recordings for analysis:
- [ ] Audio recording
- [ ] Screen recording
- [ ] Video recording (including face)

**Recording usage scope**:
- Used only for analysis within the research team
- Will not be shared or published externally
- Will be deleted [X] years after study completion

---

### Privacy Protection

**Personal information handling**:
- Name and contact info used only for incentive payment and study communication
- Reports and presentations will not identify individuals
- Quotes may be used in anonymized form
- Personal data managed per [Privacy Policy URL]

**Data retention**:
- Recording data: Deleted after [period]
- Analysis data (anonymized): Retained for [period]
- Contact info: Deleted within [X] days after incentive payment

---

### Participant Rights

- Participation is completely voluntary
- You may withdraw at any time without giving a reason
- You may skip any question you prefer not to answer
- Incentive will still be paid upon withdrawal

---

### Consent Confirmation

- [ ] I understand the study content described above
- [ ] I understand participation is voluntary and I may withdraw at any time
- [ ] I consent to audio/video recording (optional)
- [ ] I consent to anonymized quote usage
```

---

## Digital Consent (Online Research)

```markdown
## Online Research Consent

**[Study name]**: User research to improve [product/service]
Conducted by: [Company]
Duration: ~[X] minutes
Incentive: [details]

**Required consent items:**
- [ ] I understand the purpose and content of this study
- [ ] I confirm participation is voluntary and I may withdraw at any time
- [ ] I have reviewed the [Privacy Policy](link)

**Optional consent items:**
- [ ] I consent to screen recording
- [ ] I consent to audio recording
- [ ] I consent to anonymized quote usage
- [ ] I wish to receive invitations for future studies

[Agree and Start] [Cancel]
```

---

## Consent for Special Cases

| Case | Requirements |
|------|-------------|
| **Minors** | Written parental consent required; consider parent presence during study; prepare age-appropriate explanation |
| **Sensitive topics** | Provide psychological support contacts; emphasize right to stop; obtain separate follow-up consent |
| **Secondary use of recordings** | Separate consent form required; clearly limit usage scope; state right of withdrawal |

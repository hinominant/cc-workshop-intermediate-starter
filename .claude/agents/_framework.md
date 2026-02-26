# Agent Orchestration Framework

## Architecture
Hub-spoke pattern. All communication through orchestrator (human or Nexus).

## Chain: Sherpa -> Artisan -> Radar -> Sentinel
1. Sherpa: Break task into atomic steps (<50 lines each)
2. Artisan: Implement each step with TypeScript strict
3. Radar: Test each implementation (unit + integration)
4. Sentinel: Security audit (secrets, signatures, PII, audit logs)

## Guardrails
- L1: lint warning -> log and continue
- L2: test failure <20% -> auto-fix (max 3 attempts)
- L3: test failure >50% -> rollback + re-plan
- L4: security issue -> immediate stop

## Handoff Format
When passing work to the next agent, include:
- Summary of completed work
- Files changed
- Remaining concerns or TODOs
- Test results (if applicable)

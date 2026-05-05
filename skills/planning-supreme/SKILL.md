---
name: planning-supreme
description: Unified planning + execution pipeline. Use when user asks to "plan", "make a plan", "/plan", "design implementation", "spec this out", "execute the plan", "/do", or has a multi-step task before touching code. Combines spec discipline, memory-aware research, phased execution with subagents, and verification gates.
type: fusion
sources:
  - name: superpowers:writing-plans
    contributed: Spec discipline, when-to-plan triggers, completion criteria
  - name: superpowers:executing-plans
    contributed: Review checkpoints, separate session execution, drift detection
  - name: superpowers:subagent-driven-development
    contributed: Parallel subagent dispatch for independent tasks
  - name: claude-mem:make-plan
    contributed: Memory-aware research, documentation discovery, phased structure
  - name: claude-mem:do
    contributed: Subagent-driven phased execution
generated_at: 2026-05-04
generated_by: skill-fusion
---

# Planning — Supreme

Single skill for plan creation + execution. Memory-aware research → phased structure → subagent dispatch → verification gates.

## When to invoke

- User asks "plan", "make a plan", "/plan", "spec this", "design how to implement X"
- User asks "execute the plan", "/do", "run this plan"
- Multi-step task, multi-file change, feature larger than trivial
- Before touching code on anything non-obvious
- After spec/requirements arrive

## Phase 0 — Documentation discovery (MANDATORY for non-trivial plans)

**Before anything else, establish what APIs/patterns are actually available. Skipping = inventing API calls that don't exist.**

For plans involving libraries/services, dispatch parallel subagents (Agent tool) to research:

### Subagent allocation pattern

- **Subagent A — Backend/DB layer**: schema, RLS, migrations, ORMs (use `context7` query-docs + Supabase/Postgres MCP if available)
- **Subagent B — Framework layer**: Next.js/React conventions, server actions, middleware (use `vercel:nextjs` or framework-specific skill)
- **Subagent C — External services**: Stripe/Auth/CDN patterns (use `stripe:stripe-best-practices`, `vercel:auth`, etc.)

Each subagent reports:
- **Allowed APIs** with citations (function signatures + doc URLs)
- **Anti-patterns** (don't invent helpers, don't use deprecated APIs)
- **Source files / exact snippets** to copy from

### Phase 0 deliverable

`docs/<feature>-research.md` with:
- API inventory per layer
- Anti-pattern guards
- Citation links
- Versions confirmed

**Do not start Phase 1 without this doc.**

### When to skip Phase 0

If task uses only stable known APIs, document explicitly: "Phase 0 SKIPPED — task is XYZ which uses only stable known APIs."

Examples skip-eligible: typo fix, simple refactor, pure data transformation, code well-covered by existing patterns.

## Phase 1 — Pre-plan research

**Memory + codebase scan after Phase 0. Skipping = repeating past mistakes.**

1. **Memory check** (`claude-mem:mem-search`):
   - "did we solve X before?"
   - "what did we learn about Y?"
   - "are there past failed attempts?"
2. **Codebase scan**:
   - Existing patterns for similar features
   - Conventions in repo
   - Tests that exist for related code
3. **Constraint reconciliation**:
   - Cross-reference Phase 0 doc inventory vs project constraints
   - Identify any constraint requiring non-default API path

If memory/docs reveal prior approach: build on it, don't reinvent.

## Phase 2 — Plan structure

Output as markdown with mandatory sections:

```markdown
# Plan: <feature/task name>

## Goal
<one paragraph — what success looks like>

## Constraints
- <hard limits: deadlines, dependencies, must-not-break>
- <stack requirements>
- <user preferences from memory>

## Approach
<one paragraph — chosen strategy + why over alternatives>

### Alternatives considered
- <X> — rejected because <reason>
- <Y> — rejected because <reason>

## Phases

### Phase 1: <atomic milestone>
**Output**: <verifiable artifact>
**Verification**: <command/test that proves done>

Tasks:
- [ ] task description (file:line if known)
- [ ] task description

### Phase 2: …

## Risks
- <risk> → <mitigation>

## Out of scope
- <feature> — defer to follow-up
- <refactor> — not blocking goal

## Open questions
- <question for user before starting>
```

**Rules**:
- Each phase = independently verifiable milestone
- Tasks within phase = atomic, single-file ideally
- Mark phases that can run in parallel `[parallel]`
- Mark phases needing review checkpoint `[checkpoint]`

## Phase 3 — Plan review (before execution)

Show plan to user. Wait for:
- Approval as-is
- Modifications
- Pushback on approach

**Don't execute uncommitted plans.** User approval is the contract.

## Phase 4 — Execution

### Mode A — Linear execution (default)
For each phase:
1. State which phase starting
2. Execute tasks in order
3. Run verification command
4. If pass → next phase
5. If fail → debug, do NOT skip
6. At `[checkpoint]` → pause, show progress, wait for user

### Mode B — Subagent dispatch (parallel phases)
When phases marked `[parallel]` and truly independent (no shared state):
1. Dispatch 1 subagent per phase via Agent tool
2. Each gets phase scope, files allowed, verification cmd
3. Wait for all to complete
4. Merge results
5. Run integration verification

**Anti-pattern**: dispatching subagents for sequential tasks (they need each other's output) — wastes parallelism, creates merge conflicts.

### Mode C — Sub-conversation (heavy phases)
For phases needing isolated context (e.g., huge file refactor):
1. Use git worktree (`superpowers:using-git-worktrees`)
2. Branch off, do phase fully, verify
3. Merge back to main planning branch

## Phase 5 — Drift detection

After each phase, check:
- Did we add scope creep? (compare diff vs plan tasks)
- Did "out of scope" items sneak in?
- Did we skip verification?
- Are we still solving the original goal?

If drift: stop, show diff, ask user — fix scope or update plan.

## Phase 6 — Done criteria

Plan complete when:
- All phases verified pass
- All `[ ]` tasks checked
- Integration test passes
- No new TODOs left in code (or explicitly noted as deferred)
- User confirms goal met

Don't mark complete because "all phases ran." Run can pass while goal fails.

## Memory after completion

`claude-mem` records this plan + outcome. After done:
- Save: what worked, what didn't, what surprised
- This becomes searchable for future sessions

## When NOT to plan

Skip plan if:
- One-line fix
- Trivial typo / rename
- Reverting a commit
- Reading-only investigation (no changes planned)

For these: just do it. Plan overhead > task.

## Anti-patterns

- DON'T skip Phase 1 (memory check) — repeat solved problems
- DON'T write plan with vague phases ("implement feature") — must be verifiable
- DON'T execute uncommitted plans — user approval = contract
- DON'T merge subagent outputs without verification
- DON'T mark phase done because steps ran — verify the artifact
- DON'T let scope creep happen silently — surface it
- DON'T plan everything upfront if requirements unstable — plan in waves

## Sources

- **superpowers:writing-plans** — discipline + structure
- **superpowers:executing-plans** — checkpoints + drift detection
- **superpowers:subagent-driven-development** — parallel dispatch
- **claude-mem:make-plan** — memory-aware research, doc discovery
- **claude-mem:do** — phased subagent execution

Refresh: `/skill-fusion refresh planning-supreme`

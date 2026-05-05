# planning-supreme

Unified planning + execution pipeline. Fuses 5 sources. Includes Phase 0 documentation discovery (research APIs before planning).

## Validated wins

| Sample | Phases | Alternatives | Phase 0 fired | Verdict |
|---|---|---|---|---|
| Multi-tenant SaaS | 8/8 | 5 explicit | implicit | structure + parallel markers |
| i18n React Native | 6 rich | 5 explicit | ✅ FIRED | doc discovery + alternatives |

See [BENCHMARKS.md](../../BENCHMARKS.md#2-planning-supreme).

## Triggers

- "plan", "make a plan", "/plan"
- "spec this out", "design implementation"
- "execute the plan", "/do"

## 7 phases

0. **Documentation discovery** (parallel subagents research APIs/services first — skip if APIs trivially known)
1. **Pre-plan research** (memory + codebase scan)
2. **Plan structure** (Goal/Constraints/Approach/Alternatives/Phases/Risks/OOS/Open questions)
3. **Plan review** (user approval before execution)
4. **Execution** (linear / subagent parallel / worktree-isolated)
5. **Drift detection** (after each phase)
6. **Done criteria** (verify, don't claim)

## Sources fused

- `superpowers:writing-plans` — discipline + structure
- `superpowers:executing-plans` — checkpoints + drift detection
- `superpowers:subagent-driven-development` — parallel dispatch
- `claude-mem:make-plan` — Phase 0 doc discovery
- `claude-mem:do` — phased subagent execution

## Best for

- Multi-step features
- Stack you're not 100% familiar with (Phase 0 helps)
- Production migrations with constraints
- Anything requiring rollback plan

## Not best for

- One-line fixes (skip planning)
- Read-only investigation
- Trivial refactors

## Install

```bash
cp -r planning-supreme ~/.claude/skills/
```

# Benchmark: planning (4-way)

**Date**: 2026-05-04
**Sample**: vague spec - multi-tenant migration of Next.js+Supabase+Stripe SaaS, 2-week deadline, no data drop, no Stripe change
**Candidates**: baseline · superpowers:writing-plans · claude-mem:make-plan · planning-supreme

## Scores

| Metric | Baseline | writing-plans (sp) | make-plan (cm) | **planning-supreme** |
|---|---|---|---|---|
| GT phases covered (8) | 8/8 ✅ | 8/8 ✅ | 8/8 ✅ | 8/8 ✅ |
| GT risks surfaced (5) | 5/5 ✅ | 5/5 ✅ | 5/5 ✅ | 5/5 ✅ |
| GT OOS items (3) | 6 (over-covered) | 5 | 4 | 7 (over-covered) |
| GT open questions (3) | 7 | implicit | 1 | 5 |
| Phases atomic & numbered | yes (6 phases) | yes (17 tasks) | yes (7 phases incl Phase 0) | yes (8 phases) |
| Verification per phase | yes | yes | yes (with anti-patterns) | yes (most rigorous) |
| Alternatives considered | implicit | no | implicit | **explicit ✅ (5 alternatives listed)** |
| Parallel/checkpoint markers | no | no | no | **yes ✅** |
| Documentation discovery | no | no | **yes ✅ (Phase 0 mandatory)** | implicit (Phase 1) |
| Constraint awareness | all 4 | all 4 + extra | all 4 | all 4 + most explicit |
| Rollback plan | yes | yes (separate runbook) | yes | yes (per-phase) |
| Output saved as artifact | no | yes (separate file) | inline | inline |
| Time | 84.9s | 268s | 83.8s | 115s |
| Tokens | 38,718 | 65,175 | 41,228 | 43,753 |

## Verdict

**Winner**: planning-supreme (light edge over make-plan, both excellent)
**Margin**: small — all 4 are competent plans
**Decisive differentiators of supreme**:
1. **Explicit "Alternatives considered" section** with 5 rejected approaches — only supreme had this
2. **`[parallel]` and `[checkpoint]` markers** on phases — none other had these
3. Tightest constraint coverage (all 4 constraints addressed in dedicated section)

## Per-candidate analysis

### baseline (no skill)
- Surprisingly thorough — 6 phases, all GT covered
- Most open questions (7) — good discovery posture
- Slowest after writing-plans
- Solid default

### superpowers:writing-plans
- 17 atomic TDD-shaped tasks (most granular)
- Saved plan as separate file (artifact-driven)
- Most tokens (65k) — verbose but disciplined
- Best for execution-ready plans
- Slowest (268s) due to file save + research subagents

### claude-mem:make-plan
- Phase 0 documentation discovery is **unique and valuable** (parallel subagents to research APIs first)
- Anti-pattern guards per phase (defensive)
- Most disciplined about NOT inventing APIs
- Best for unknown-domain planning
- Cheapest tokens

### planning-supreme (fusion)
- Most STRUCTURED output (Goal/Constraints/Approach/Alternatives/Phases/Risks/OOS/Open questions)
- Only candidate with explicit alternatives + parallel markers
- 8 phases mapped to GT exactly
- Best for executable plan + decision documentation

## Verdict refined

All 4 are valid plans. Differences are in METHODOLOGY:
- **writing-plans** = TDD task atomicity discipline
- **make-plan** = research-first discipline (Phase 0 mandatory)
- **supreme** = decision-documentation discipline (alternatives + parallel markers)

For a real production plan I'd actually want HYBRID — supreme's structure + make-plan's Phase 0 + writing-plans' task atomicity. Currently supreme has structure + parallel + alternatives but lacks make-plan's mandatory doc discovery.

## Recommendation

- **planning-supreme VALIDATED** — wins on output structure for decision review
- BUT: opportunity to UPGRADE supreme by absorbing make-plan's Phase 0 research mandate
- Action: edit `planning-supreme/SKILL.md` to add explicit "Phase 0: Documentation Discovery" before Phase 1, citing make-plan pattern
- Keep all 4 — different strengths
- Coach should auto-pick:
  - Stable known stack → planning-supreme
  - Unknown APIs/libs → claude-mem:make-plan
  - Many small tasks → superpowers:writing-plans
  - Quick informal → baseline

## Improvement opportunity

Refresh planning-supreme to incorporate Phase 0 from make-plan:

```
/skill-fusion refresh planning-supreme
  → re-fuse with explicit Phase 0 doc-discovery from make-plan
```

## Re-run

`/skill-review refresh planning-2026-05-04`

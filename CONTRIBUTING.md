# Contributing

Thanks for considering a contribution. The bar for inclusion is **empirical validation**.

## Adding a new fusion skill

1. **Identify overlap** — find 2+ existing skills that target similar tasks
2. **Synthesize fusion** using `skill-fusion` skill
3. **Author benchmarks**:
   - Create test artifact in `benchmarks/<task>-<date>/artifact.<ext>`
   - Write `ground-truth.md` with N planted issues + scoring rubric
4. **Run validation** with `skill-review`:
   - Dispatch fusion + each source + baseline as parallel agents
   - Compare outputs
   - Write `report.md` with scores
5. **Update [BENCHMARKS.md](BENCHMARKS.md)** with summary table
6. **Update [`benchmarks/leaderboard.md`](benchmarks/leaderboard.md)**
7. **Submit PR** with skill + benchmarks + report

### Acceptance criteria

Fusion accepted only if:
- Equal-or-better recall vs every source on at least one sample
- ≥+20% on a primary differentiator metric (or unique capability sources lack)
- Format compliance ≥ best source
- Token cost within 1.5× cheapest source
- 2+ samples tested (low single-sample bias)

If fusion ties with sources → keep but document caveat. Don't ship vanity wins.

## Adding a new meta skill

Meta skills (orchestrators, advisors, generators) accepted if:
- Solves a real workflow gap
- Includes its own usage examples
- Doesn't duplicate existing meta (`coach`, `skill-fusion`, `skill-review`, `skill-creation-supreme`)
- Has explicit `When NOT to invoke` section

Benchmarks not required for meta skills, but **manual demonstration** in PR description is.

## Refreshing existing fusions

When a source skill updates:

1. Run `/skill-fusion refresh <fusion-name>` to detect drift
2. If output changed materially, re-run benchmarks
3. If fusion still wins → update report with new date
4. If fusion now ties or loses → investigate (may need re-synthesis or retirement)

Submit refresh as PR with diff + new benchmark report.

## Submitting PRs

- One skill or one fusion per PR
- Include benchmark raw data
- Update relevant tables in BENCHMARKS.md and leaderboard.md
- Link upstream sources where applicable
- Use existing skill format (frontmatter + body sections)

## Skill format requirements

```markdown
---
name: <kebab-case>
description: <trigger phrases — be exhaustive>
type: <fusion | meta | utility | workflow>
sources:                  # only for fusions
  - name: <source-1>
    contributed: <what it brought>
generated_at: <YYYY-MM-DD>
generated_by: skill-fusion  # or hand-authored
---

# Title

<one-paragraph purpose>

## When to invoke
<concrete trigger phrases + scenarios>

## Workflow
<numbered steps with concrete actions>

## Anti-patterns
<failure modes>

## Sources / Notes
<attribution + refresh command>
```

## Code of conduct

- Empirical claims require evidence
- "I think this works" is not a valid argument — show benchmark data
- Credit upstream authors clearly
- Disagreement OK; back it with data

## Questions

Open an issue. Or ask in [your-discord-or-channel].

# skill-review

Multi-agent benchmark harness. Validate any skill empirically by dispatching parallel agents (one per candidate) on the same task, scoring outputs, picking winner.

## Why

"Skill X is better" is a story until you measure it. This skill turns subjective claims into ground-truth comparisons.

## Triggers

- "test the skills", "compare X vs Y"
- "/skill-review", "benchmark skills"
- "which is better — X or Y"
- "validate fusion vs source"

## Workflow

1. **Define test** — task type + candidates + sample (or generate)
2. **Generate test artifact** + ground-truth (planted issues with severity)
3. **Dispatch candidates** — parallel general-purpose agents, each invokes one candidate skill
4. **Embargo** — agents cannot read ground-truth.md
5. **Score** — recall, precision, severity accuracy, format, time, tokens
6. **Comparative report** — table + verdict + recommendations

## Validate-fusion mode

Auto-detects sources from a fusion's `SKILL.md` frontmatter `sources:` field. Dispatches the fusion + every source + baseline as candidates.

```
/skill-review validate-fusion code-review-supreme
```

Validates if:
- Equal-or-better recall vs every source
- ≥+20% on primary metric vs best source
- Format compliance ≥ best source
- Time/tokens within 1.5× cheapest

## Quick mode

User says "quick benchmark X vs Y on this code":
- Skip artifact generation (use provided)
- No ground-truth (judge by qualitative + cross-validation)
- Dispatch + judge agent
- Abbreviated report

## Rigorous mode

User says "full benchmark X":
- Generate 3 samples of varying difficulty
- All candidates on each
- Aggregate + variance analysis
- Save to leaderboard

## Persistence

Saves to `~/.claude/claude-library/benchmarks/<task>-<date>/`:
- `artifact.<ext>` — test sample
- `ground-truth.md` — answer key
- `<candidate>-output.md` — raw outputs
- `report.md` — comparative report
- `scores.json` — computed metrics

Aggregate at `benchmarks/leaderboard.md`.

## Used to validate

All 4 fusions in this repo passed `skill-review` benchmarks before inclusion. See [BENCHMARKS.md](../../BENCHMARKS.md).

## Install

```bash
cp -r skill-review ~/.claude/skills/
```

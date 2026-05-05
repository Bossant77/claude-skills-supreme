---
name: skill-review
description: Benchmark and compare skills/plugins/commands by running them in parallel against the same task and scoring outputs. Use when user says "test the skills", "compare X vs Y", "benchmark skills", "/skill-review", "which is better - X or Y", "validate fusion vs source", or wants to validate that a fusion/custom skill outperforms its sources or native equivalent. Multi-agent test harness - one agent generates test artifact, multiple agents run the candidate skills, judge agent scores results.
type: meta-benchmark
---

# skill-review

Empirical comparison of skills. Multi-agent test harness: generate test artifact → dispatch candidate skills in parallel → judge scores → recommend winner.

## When to invoke

- User asks "test/benchmark/compare skills"
- After creating a fusion skill — validate it beats sources
- After installing new plugin — validate it beats existing
- Periodic stack health check — confirm fusions still win
- User unsure which skill to keep — empirical decision

## Inputs

User provides:
- **Candidates** — 2+ skills/plugins/commands to compare
- **Task type** — what kind of work to test on (review, plan, debug, simplify, etc.)
- **Sample** (optional) — concrete artifact, or skill generates one

If sample not provided, skill generates appropriate test artifact for the task type.

## Workflow

### Phase 1 — Define test

Ask user (one question max):
- What task type? (code review, planning, debugging, simplification, etc.)
- Candidates? (e.g., "code-review-supreme vs baseline" or "planning-supreme vs superpowers:writing-plans")
- Domain? (web, ML, CLI, etc.) — picks appropriate sample

Generate or accept test artifact. Save under `~/.claude/claude-library/benchmarks/<test-id>/`.

### Phase 2 — Generate test artifact + ground truth

For each task type, use these patterns:

| Task type | Artifact | Ground truth |
|---|---|---|
| Code review | Buggy file with N intentional issues (security, perf, naming, dead code) | Numbered list of issues with severity |
| Planning | Vague feature spec ("add multi-tenant support") | Expected plan phases + key constraints to surface |
| Debugging | Code that throws on specific input | Root cause + minimal fix |
| Simplification | Bloated function with N obvious wins | List of expected simplifications |
| Documentation | Undocumented module | Expected sections coverage |
| Brainstorming | Open-ended product question | Expected dimensions explored |

Save artifact + ground-truth.md in test folder.

### Phase 3 — Dispatch candidates in parallel

For each candidate skill, dispatch one general-purpose subagent via Agent tool.

Each agent gets:
- Path to test artifact
- **Required**: invoke specific skill via Skill tool (or use baseline behavior for "no skill" candidate)
- Output format spec
- Embargo: do NOT read ground-truth.md

Run all agents in single message (parallel).

### Phase 4 — Score results

For each candidate output, compute:

**Quantitative**:
- **Recall** = ground-truth items found / total ground-truth
- **Critical recall** = critical items found / total critical
- **Precision** = true positives / total flagged
- **Severity accuracy** = correctly-labeled / found
- **False positives** = flagged items that aren't real issues
- **Time** = wall-clock seconds reported by agent
- **Tokens** = if available
- **Format compliance** = matches requested output format

**Qualitative** (judge agent or self):
- Actionability — does each finding include a clear fix?
- Brevity — terse vs verbose
- Depth — surface-level vs root-cause / contextual
- Stack-awareness — leverages domain knowledge

### Phase 5 — Comparative report

Output table format:

```
## Benchmark: <task type>
Sample: <artifact path>
Ground truth: N items (X critical, Y major, Z nit)

| Metric | Candidate A | Candidate B | Δ |
|---|---|---|---|
| Recall | <%> | <%> | +X |
| Critical recall | <%> | <%> | +X |
| Precision | <%> | <%> | +X |
| Extras (valid) | N | N | +N |
| Format | <pass/fail> | <pass/fail> | — |
| Time | Ns | Ns | -Ns |
| Tokens | N | N | -N |

## Verdict

**Winner**: <candidate>
**By**: <margin in primary metric>
**Strengths each**:
  - A: <best at>
  - B: <best at>

## Recommendation

<one of>:
- Replace A with B globally (B dominates)
- Keep both — different strengths (A for X, B for Y)
- A wins for this task — but spot-check on different sample before deciding
- Tie — pick by personal preference / token budget

## Memory capture

This benchmark stored at: <path>
Refresh: `/skill-review refresh <test-id>`
```

### Phase 6 — Optional auto-action

If verdict is decisive (>20% margin on primary metric), offer:
- "Disable losing source? (move to disabled folder, recoverable)"
- "Promote winner to default trigger order in coach skill?"
- "Mark fusion as validated in manifest?"

Default: just report. Let user decide.

## Test types supported

### Code review benchmark
- Sample: TS/Py/Go file with planted issues
- Categories: SQL injection, XSS, auth bugs, perf, dead code, naming, defensive bloat, error handling
- Score: recall + critical recall + format
- Reference test: `~/.claude/benchmark-tests/test-auth.ts` (already exists)

### Planning benchmark
- Sample: feature spec ("add real-time notifications")
- Categories: phases identified, constraints surfaced, risks noted, alternatives considered
- Score: completeness vs expected outline + verifiability of phases

### Debugging benchmark
- Sample: code with subtle bug + repro steps
- Score: root cause identification + minimal-fix correctness + regression test added

### Simplification benchmark
- Sample: bloated function (200 lines) with N simplification opportunities
- Score: simplifications applied / available + behavior preservation (tests still pass) + diff size

### Brainstorming benchmark
- Sample: vague product question
- Score: dimensions explored + tradeoffs surfaced + non-obvious angles

## Candidate types

Coach can compare any of:
- **Native command** vs **custom skill** (e.g., `/review` vs `code-review-supreme`)
- **Source skill** vs **fusion** (e.g., `superpowers:writing-plans` vs `planning-supreme`)
- **Plugin command** vs **fusion** (e.g., `code-review:code-review` vs `code-review-supreme`)
- **No-skill baseline** vs **any skill** (control group)
- **Two competing plugins** (e.g., evaluate before committing to one)
- **Two custom fusions** (A/B testing)

## Anti-patterns

- DON'T benchmark on toy samples that favor verbose skills (skills built for production are penalized)
- DON'T compare on a sample one skill was designed to handle and other wasn't (unfair)
- DON'T trust single-sample result — run 2-3 samples for important decisions
- DON'T benchmark adversarially-tuned skills (skill that knows ground-truth format gets free wins)
- DON'T let candidates see ground-truth.md (always embargo)
- DON'T benchmark with same model for both candidates if model is the variable being tested

## Persistence

Each benchmark saved at `~/.claude/claude-library/benchmarks/<task>-<date>/`:

```
benchmarks/code-review-2026-05-04/
├── artifact.ts                  ← test sample
├── ground-truth.md              ← answer key
├── candidate-a-output.md        ← raw output baseline
├── candidate-b-output.md        ← raw output supreme
├── scores.json                  ← computed metrics
└── report.md                    ← comparative report
```

This builds a regression suite over time — re-run `/skill-review refresh` to verify fusions still win after source updates.

## Aggregate score across benchmarks

After 5+ benchmarks per skill, compute aggregate:
- Win rate vs baseline
- Win rate vs other custom
- Avg recall delta
- Avg time delta

Surface in `~/.claude/claude-library/benchmarks/leaderboard.md` for stack health overview.

## Quick mode

User says "quick benchmark X vs Y on this code":
1. Skip artifact generation (use provided)
2. No ground-truth (judge by qualitative + cross-validation)
3. Just dispatch + judge agent
4. Output abbreviated report

## Rigorous mode

User says "full benchmark X" or "validate X":
1. Generate 3 samples of varying difficulty
2. Run all candidates on each
3. Aggregate scores across samples
4. Statistical analysis (avg + variance)
5. Save to leaderboard

## VALIDATE-FUSION MODE (most important)

User says "validate fusion X" or "/skill-review validate-fusion X" or "is the fusion really better than its sources?".

### Why this exists

A fusion claims to be better than the sum of its source skills. Without empirical validation, it's just a story. This mode auto-tests the claim.

### Auto-source detection

1. Read fusion's `SKILL.md` frontmatter `sources:` list
2. Each entry becomes a candidate (alongside the fusion)
3. Add `baseline` (no skill) as control
4. Optionally add `native` (built-in command) if exists for the task type

### Required candidates per fusion (auto-generated)

For `code-review-supreme`:
- baseline
- caveman:caveman-review
- code-review:code-review
- superpowers:requesting-code-review (process — adapt to act mode)
- superpowers:receiving-code-review (process — adapt to act mode)
- /security-review (native command)
- code-review-supreme

For `planning-supreme`:
- baseline
- superpowers:writing-plans
- superpowers:executing-plans
- claude-mem:make-plan
- claude-mem:do
- planning-supreme

For `debugging-supreme`:
- baseline
- superpowers:systematic-debugging
- chrome-devtools-mcp:troubleshooting
- karpathy-guidelines (as principles applied)
- debugging-supreme

For `simplify-supreme`:
- baseline
- karpathy-guidelines
- simplify (built-in)
- code-simplifier:code-simplifier
- simplify-supreme

### Validation criteria

Fusion VALIDATED if:
1. Equal or higher recall than every source
2. ≥ +20% on primary metric vs best source (e.g., extras for review, phases for planning)
3. Format compliance ≥ best source
4. Time/tokens within 1.5× cheapest source

Fusion FAILED if:
- Source dominates on multiple metrics
- Fusion adds output without measurable value

### Decision matrix per result

| Result | Action |
|---|---|
| Fusion wins decisively | Keep + recommend disable redundant sources |
| Fusion ties best source | Keep both — fusion no harm |
| Fusion loses on 1 metric | Note tradeoff, keep |
| Fusion loses on multiple | Refuse + investigate — re-fuse with insights |
| Fusion same as cheapest source | Retire fusion — it's just overhead |

### Known fusion validations

| Fusion | Status | Date | Best vs |
|---|---|---|---|
| code-review-supreme | ✅ VALIDATED | 2026-05-04 | +13 extras vs sources avg 5 |
| planning-supreme | ⏳ pending | - | - |
| debugging-supreme | ⏳ pending | - | - |
| simplify-supreme | ⏳ pending | - | - |

Update this table when running validations.

### Output for validate-fusion

Same as Phase 5 report PLUS:

```
## Fusion validation: <fusion-name>

**Sources** (per fusion frontmatter):
- source-1
- source-2
- ...

**Result**: VALIDATED | FAILED | INCONCLUSIVE

**Evidence**:
- Recall: fusion <%>, best source <%>
- Extras: fusion N, best source N
- <other metrics>

**Recommendation**:
- Keep fusion → it adds <X> measurable value
- Disable redundant sources: <list>
- (or) Retire fusion → no measurable advantage

**Persistence**: report saved at `~/.claude/claude-library/benchmarks/<fusion>-validation-<date>/`
```

### Auto-update STACK.md

After validation, update `~/.claude/STACK.md` fusion table column:
- ✅ if validated
- ❌ if failed
- Add validation date

## Sources

This skill is a benchmark harness — does not source from existing skills directly. Inspired by:
- skill-creator's eval features
- superpowers:writing-skills measurement guidance
- A/B testing methodology

## Notes

- One benchmark = one decision. Don't change multiple things between runs.
- Always store outputs verbatim — useful for skill-fusion refresh diffs
- If candidate uses external tools (web fetch, db), control for network variance
- Token cost of running benchmarks is real — don't auto-run on every session

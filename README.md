# Claude Skills Supreme

> Empirically-validated meta-skills for Claude Code. Battle-tested by multi-agent benchmarks against their sources and native equivalents. Every skill in this repo wins or ties its predecessors — measured, not claimed.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Skills: 8](https://img.shields.io/badge/Skills-8-blue.svg)]()
[![Benchmarks: 8 runs](https://img.shields.io/badge/Benchmarks-8%20runs-green.svg)](BENCHMARKS.md)

## What this is

A curated library of **8 skills** for Claude Code, organized into:

- **4 fusion skills** that combine the best of multiple existing skills/plugins (validated to outperform sources)
- **4 meta skills** that author, benchmark, fuse, and orchestrate other skills

Each skill has been **empirically tested** in multi-agent comparison harnesses. Raw benchmark data is in [`/benchmarks`](benchmarks/) — reproducible.

## Why use this

If you've installed multiple Claude Code plugins (superpowers, claude-mem, caveman, code-review, etc.) you've probably hit:

- **Trigger overlap** — multiple skills firing on "review this PR"
- **Token bloat** — paying for skills that don't add value over baseline
- **Decision fatigue** — too many tools, unclear which to use when

This repo's fusion skills **collapse overlapping skills into single supreme variants** that:
- Hit higher recall on test artifacts
- Add unique depth (security checklists, alternatives sections, regression tests)
- Are validated empirically per-fusion

The meta skills give you the tools to **build, validate, and maintain** your own skill stack.

## Quick install

### Linux/macOS

```bash
git clone https://github.com/<your-user>/claude-skills-supreme.git
cd claude-skills-supreme
./install.sh
```

### Windows

```powershell
git clone https://github.com/<your-user>/claude-skills-supreme.git
cd claude-skills-supreme
.\install.ps1
```

### Manual

Copy any skill folder from `skills/<name>/` to `~/.claude/skills/<name>/`. Restart Claude Code.

## The 8 skills

### Fusion skills (validated)

| Skill | Combines | Validation | Best at |
|---|---|---|---|
| **[code-review-supreme](skills/code-review-supreme/)** | code-review + sp:requesting/receiving + caveman:review + security-review | ✅ DECISIVE WIN (+13 extras vs sources avg 5) | Auth/security-critical PR review |
| **[planning-supreme](skills/planning-supreme/)** | sp:writing-plans + sp:executing-plans + cm:make-plan + cm:do | ✅ WIN (Phase 0 doc discovery + alternatives) | Multi-step feature planning |
| **[debugging-supreme](skills/debugging-supreme/)** | sp:systematic-debugging + chrome-devtools:* + karpathy | ✅ WIN (+80% test coverage) | Race conditions, perf, memory leaks |
| **[simplify-supreme](skills/simplify-supreme/)** | karpathy + simplify + code-simplifier | ✅ VALIDATED (+18% items, structural moves) | Refactor / cleanup / reduce bloat |

### Meta skills

| Skill | Purpose |
|---|---|
| **[coach](skills/coach/)** | Stack advisor + proactive co-pilot. Tells you which skill to use given your context. |
| **[skill-fusion](skills/skill-fusion/)** | Generate new fusion skills by combining N source skills |
| **[plugin-fusion](skills/plugin-fusion/)** | Generate fused plugin scaffolds (heavier — handles hooks/MCP/agents) |
| **[skill-review](skills/skill-review/)** | Multi-agent benchmark harness to validate any skill empirically |
| **[skill-creation-supreme](skills/skill-creation-supreme/)** | Full skill authoring lifecycle (design → write → benchmark → ship) |

## Benchmarks at a glance

All fusion skills have been tested across 2 samples each. Raw data in [`/benchmarks`](benchmarks/). Detailed analysis in [BENCHMARKS.md](BENCHMARKS.md).

| Fusion | Samples | Wins | Margin highlight |
|---|---|---|---|
| code-review-supreme | 2 | 2/2 | +5 SEC items vs baseline (frontend), +13 extras (backend) |
| planning-supreme | 2 | 2/2 | Phase 0 doc discovery fires, 5 alternatives surfaced |
| debugging-supreme | 2 | 2/2 | +80% test coverage, 4 alternative fixes vs 1-2 |
| simplify-supreme | 2 | 2/2 | +18% items, catches dead imports + comment-noise |

**Variance**: LOW across samples — fusions consistently better, not noise.

## Cost-benefit

| Fusion | Time penalty | Token penalty | Value delivered |
|---|---|---|---|
| code-review-supreme | +28% | +10% | +90% security depth |
| simplify-supreme | -10% to +13% | +5% | +18% items, structural |
| debugging-supreme | +14% to +66% | +10% | +80% test coverage |
| planning-supreme | +37% to +88% | +49% | doc discovery + alternatives |

For quick passes, baseline (no skill) is still viable. For depth-needed tasks, fusions earn their cost.

## Architecture

```
claude-skills-supreme/
├── README.md                    ← you are here
├── BENCHMARKS.md                ← detailed empirical results
├── LICENSE                      ← MIT
├── CONTRIBUTING.md              ← add new skills/fusions
├── install.sh + install.ps1     ← one-command install
├── skills/                      ← 8 skills (4 fusion + 4 meta)
│   ├── code-review-supreme/
│   ├── planning-supreme/
│   ├── debugging-supreme/
│   ├── simplify-supreme/
│   ├── coach/
│   ├── skill-fusion/
│   ├── plugin-fusion/
│   ├── skill-review/
│   └── skill-creation-supreme/
├── benchmarks/                  ← raw test data, reproducible
│   ├── leaderboard.md           ← aggregate scores
│   ├── code-review-2026-05-04/
│   │   ├── artifact.ts          ← test sample
│   │   ├── ground-truth.md      ← answer key
│   │   └── report.md            ← scoring + verdict
│   └── ...
└── docs/                        ← extended documentation
    ├── architecture.md
    ├── usage.md
    └── faq.md
```

## How fusion validation works

Each fusion is tested by:

1. **Ground-truth artifact**: synthetic test case with N planted issues
2. **Multi-agent dispatch**: 2-4 parallel agents, each invoking a different candidate skill
3. **Embargo on answer key**: agents cannot read ground-truth.md
4. **Scoring**:
   - Recall: GT items found / total
   - Precision: true positives / total flagged
   - Format compliance, time, tokens
5. **Verdict**: fusion VALIDATED if equal-or-better recall + ≥+20% on primary metric

Reproduce with the `skill-review` skill:

```
/skill-review validate-fusion code-review-supreme
```

## Inspired by / sources

This work builds on these excellent ecosystems:

- **[obra/superpowers](https://github.com/obra/superpowers)** — agentic methodology backbone
- **[thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)** — cross-session memory
- **[JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)** — token-efficient output
- **[anthropics official skills](https://github.com/anthropics/skills)** — Claude Code skills format
- **[forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)** — coding discipline
- **[hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)** — skill discovery

The fusion skills credit each source in their `SKILL.md` frontmatter.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The bar:

1. New skills must be tested with `skill-review` before merge
2. Fusions must beat each source on at least one metric
3. Benchmark raw data goes in `/benchmarks/<task>-<date>/`
4. Update `benchmarks/leaderboard.md` with results

## License

MIT — see [LICENSE](LICENSE). All fused skills credit original authors in their frontmatter `sources:` section.

## Roadmap

- [ ] More fusion candidates (brainstorming-supreme, testing-supreme)
- [ ] Auto-refresh fusions when sources update (`/skill-fusion refresh`)
- [ ] CI to re-run benchmarks on PR
- [ ] Multi-language samples (Python, Go, Rust) for benchmarks
- [ ] Plugin-fusion harness-supreme (full multi-plugin merge)

## Status

🟢 All 4 fusion skills validated empirically as of 2026-05-04.

---

Built with empirical rigor by [Bossant77](https://github.com/Bossant77).
Caveman mode encouraged 🦴

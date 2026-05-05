# Benchmark: debugging (3-way)

**Date**: 2026-05-04
**Sample**: `rateLimiter.ts` (TOCTOU race condition across await boundary)
**Candidates**: baseline · superpowers:systematic-debugging · debugging-supreme

## Scores

| Metric | Baseline | systematic-debugging | **debugging-supreme** |
|---|---|---|---|
| Root cause identified | ✅ | ✅ | ✅ |
| Correct fix proposed | ✅ | ✅ | ✅ |
| Severity classified | HIGH | HIGH | HIGH |
| Regression test included | basic | + 50 trials variant | + 2 tests (burst + negative tokens) |
| Alternative fixes mentioned | mutex (briefly) | mutex + multi-process Redis | mutex + CAS + Redis + per-userId promise chain |
| Pattern recognition (general) | partial | yes | yes + "single-threaded but await yields" insight |
| Production impact analysis | yes | yes | yes |
| Time | 25.4s | 33.2s | 28.9s |
| Tokens | 35,809 | 41,162 | 39,363 |

## Verdict

**Winner**: debugging-supreme (light edge)
**Margin**: small — all identified root cause correctly
**Differentiators**:
1. Supreme's regression test suite includes a NEGATIVE TOKENS test (corollary bug — bucket can go negative). Other candidates didn't test this corollary.
2. Supreme had cleanest mention of alternatives (4 named: mutex, CAS, Redis, promise-chain)
3. systematic-debugging suggested 50-trial repetition for race deterministic detection — strong rigor

## Per-candidate analysis

### baseline (no skill)
- Got root cause cleanly
- Single regression test (10 vs 100)
- Mentioned "single trial may be flaky" but didn't propose multi-trial
- Cheapest, fastest

### superpowers:systematic-debugging
- Methodical: explained "JS is single-threaded but await still yields" — best framing
- Regression test runs 20 trials to defeat scheduler luck
- Most explicit on async event-loop semantics
- Highest tokens

### debugging-supreme (fusion)
- Same root cause + same fix as others (no novel insight on bug itself)
- BUT: caught corollary (`tokens can go negative` — separate test for that)
- Best alternative-fix enumeration (4 options)
- Mentions Phase 1-9 methodology was applied (skill discipline visible)

## Verdict refined

All 3 found the bug + correct fix. Supreme adds **defensive depth** (corollary test, alternatives). systematic-debugging adds **methodological depth** (event-loop framing).

**Fusion validation**: ✅ supreme wins on regression test suite breadth + alternatives. Margin small but real.

## Recommendation

- **debugging-supreme VALIDATED** — adds measurable value (corollary tests, alternative fixes)
- Coach should default to supreme for race conditions / async bugs
- baseline acceptable for simple bugs (logic error, typo, off-by-one)
- systematic-debugging strong but supreme covers + adds — could deprecate as standalone

## Re-run

`/skill-review refresh debugging-2026-05-04`

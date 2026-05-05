# Benchmark: simplify (3-way)

**Date**: 2026-05-04
**Sample**: `artifact.ts` (orderProcessor with 12 planted simplifications)
**Candidates**: baseline · simplify (built-in) · simplify-supreme

## Scores

| Metric | Baseline | simplify (built-in) | **simplify-supreme** |
|---|---|---|---|
| Total items | 38 | **50** | 47 |
| GT recall | 12/12 (100%) | 12/12 (100%) | 12/12 (100%) |
| Valid extras | 26 | 38 | 35 |
| Format compliance | yes | yes | yes |
| Time | 31s | 38.7s | 35.7s |
| Tokens | 36,776 | 39,738 | 40,404 |

## Verdict

**Winner**: TIE (supreme barely edges baseline; built-in highest raw count)
**Margin**: small — all 3 caught all 12 GT items
**Best per-token**: baseline (38 items / 37k tokens)
**Most thorough**: simplify (built-in) (50 items)

## Per-candidate analysis

### baseline (no skill)
- Strong default — caught all 12 GT
- 38 items total, conservative
- Cheapest tokens
- Comment-noise category present but less aggressive

### simplify (built-in)
- **Highest raw count (50)** — but more aggressive on types-as-any + stringly-typed
- Surfaced leaky abstraction (`data.lineItems = order.items` exposing input ref)
- Identified `let → const` opportunities others missed
- Most verbose explanations

### simplify-supreme (fusion)
- Caught all 12 GT
- Best STRUCTURAL insights:
  - "DELETE entire constructor + config + logger fields" (recognized 3 fields all unused)
  - Recognized `data` result field is entirely speculative (everyone else just renamed)
  - `info: "processed"` literal — flagged as truly dead
- Slightly fewer extras but each is higher-impact (delete vs rename)

## Verdict refined

For raw item count: built-in wins
For structural insight (delete vs polish): supreme wins
For cost: baseline wins

**No decisive winner**. supreme adds value but margin smaller than code-review.

## Recommendation

- **Keep all 3 active in stack** — different strengths
- **Coach should pick by scenario**:
  - Quick simplify pass → baseline or built-in
  - Deep refactor (delete-heavy) → simplify-supreme
  - Type-system focused → simplify (built-in) leans this way
- **Fusion validation**: ✅ wins on quality (structural moves), ties on recall
  - Verdict: **VALIDATED with caveat** — useful but not decisively better than built-in
  - Action: keep but consider whether code-simplifier plugin still adds value (was source) — likely retire plugin

## Re-run

`/skill-review refresh simplify-2026-05-04`

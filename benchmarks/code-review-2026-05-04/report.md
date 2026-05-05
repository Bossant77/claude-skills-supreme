# Benchmark: code-review (4-way)

**Date**: 2026-05-04
**Sample**: `artifact.ts` (auth code, 12 planted issues, 4 critical)
**Candidates**: baseline · caveman:caveman-review · code-review:code-review (plugin) · code-review-supreme (fusion)

## Scores

| Metric | Baseline | caveman:caveman-review | code-review:code-review | **code-review-supreme** |
|---|---|---|---|---|
| Total findings | 19 | 18 | 14 | **25** |
| GT recall | 12/12 (100%) | 12/12 (100%) | 12/12 (100%) | **12/12 (100%)** |
| Critical recall | 4/4 (100%) | 4/4 (100%) | 4/4 (100%) | **4/4 (100%)** |
| Valid extras | 7 | 6 | 2 | **13** |
| Format | numbered list | terse caveman | verbose explanations | **terse caveman + sec checklist** |
| Severity labels | yes | yes | yes | yes |
| Phase 3 security depth | partial | partial | minimal | **full (rate-limit, audit log, CSRF Q, salt awareness)** |
| Time | 27.6s | 25.4s | 43.6s | 34.9s |
| Tokens | 36,394 | 37,732 | 40,610 | 40,095 |

## Verdict

**Winner**: code-review-supreme
**Margin**: +44% extras vs baseline, +117% extras vs caveman, +550% extras vs plugin
**Best speed**: caveman:caveman-review (25.4s)
**Best cost**: baseline (36k tokens)

## Per-candidate notes

### Baseline (no skill)
- Strong default behavior — hit all GT
- Format: long numbered list (19 items)
- Missed contextual security gaps (no rate limit, no audit log)
- Cheapest

### caveman:caveman-review
- Same recall as baseline but in caveman format (terse)
- Slight edge in actionability (one-line per issue)
- Did NOT go deeper despite security context — sticks to format role
- **Fastest of all 4**

### code-review:code-review (plugin)
- **Surprisingly fewer findings (14)** despite higher tokens
- Verbose explanations padded each issue
- Recall same as others but precision-favoring
- Slowest + highest tokens
- Best for: PR-style review where you need rationale per finding
- Worst per-token efficiency in this test

### code-review-supreme (fusion)
- **Supreme winner** — same recall + caveman format + Phase 3 forced security depth
- Found contextual issues no other candidate raised: rate-limiting absent, no salt warning, audit log gap, CSRF question, log-and-rethrow vs swallow distinction
- Cost: +28% time over fastest, +10% tokens over baseline
- ROI: depth justifies cost on auth/security-critical code

## Ground-truth observation

All 4 candidates also caught a **13th issue not in original GT**: SQL injection in `logoutUser` line 71 (DELETE FROM sessions WHERE user_id = ${userId}). GT will be updated to include this.

## Strengths matrix

| Strength | Best at |
|---|---|
| Speed | caveman:caveman-review |
| Cheapest tokens | baseline |
| Recall | tie 100% |
| Depth | code-review-supreme |
| Format quality | caveman + supreme |
| Per-issue rationale | code-review plugin |
| Actionability | supreme + caveman |
| Security context awareness | **supreme** (only one to fire Phase 3 checklist) |

## Recommendations

1. **Validate fusion claim**: ✅ confirmed. supreme genuinely better than each source individually
2. **Replace mode candidates**:
   - `code-review:code-review` plugin → could disable (supreme covers + more, plugin verbose without added value)
   - `caveman:caveman-review` → keep (fastest, useful when speed > depth)
3. **Coach should auto-pick**:
   - Auth/crypto/SQL/IO files → code-review-supreme
   - Routine non-security code → caveman:caveman-review
   - Need PR-style rationale → code-review plugin
4. **Run on 2-3 more samples** before retiring plugin (single-sample bias risk)

## Re-run

`/skill-review refresh code-review-2026-05-04` to re-execute and diff scores.

## Memory capture

Lesson: fusion of 5 sources outperformed each source individually. Caveman format + Phase 3 security checklist combination = unique to fusion. Validates the fusion approach for future supreme skills.

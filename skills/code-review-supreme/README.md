# code-review-supreme

Unified code review pipeline. Fuses 6 sources into one supreme skill.

## Validated wins

| Sample | Total findings | SEC items | Verdict |
|---|---|---|---|
| Backend auth.ts | 25 | 4 critical | +13 extras vs sources avg 5 |
| Frontend Cart.tsx | 17 | **5 SEC** | vs baseline 3 SEC |

See [BENCHMARKS.md](../../BENCHMARKS.md#1-code-review-supreme) for full data.

## Triggers

- "review", "review this PR", "code review", "review the diff"
- "/review", "/security-review"
- "look over this code"

## What it does

Five-phase pipeline:
1. **Pre-check** — verify tests pass before review
2. **Perform review** — read PR description → tests → diff once → focus pass
3. **Security review** — apply Phase 3 checklist (auth, SQL injection, XSS, secrets, crypto, etc.)
4. **Receive feedback** — verify-before-agree, technical rigor
5. **Close** — approve / request-changes / squash decisions

## Output format

Caveman-style terse:
```
<file:line> — [SEVERITY] <problem> — <fix>
```

Severity prefixes: `[SEC-CRIT]`, `[SEC-HIGH]`, `[SEC-LOW]`, `[PERF]`, `[MAJOR]`, `[NIT]`, `[Q]`.

## Sources fused

- `code-review:code-review` — PR fetch + diff orchestration
- `superpowers:requesting-code-review` — completion criteria, request hygiene
- `superpowers:receiving-code-review` — verify-before-agree
- `caveman:caveman-review` — terse output format
- built-in `/security-review` — security checklist
- built-in `/review` — baseline PR mechanic

## Best for

- Auth / crypto / SQL / file IO / network code (security depth justifies cost)
- Production-bound PRs requiring rigor
- Self-review before opening PR

## Not best for

- Trivial typo fixes (overkill)
- Quick CSS / styling reviews (use baseline or caveman)

## Install

```bash
cp -r code-review-supreme ~/.claude/skills/
```

Or use `../../install.sh code-review-supreme`.

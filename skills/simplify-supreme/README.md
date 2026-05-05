# simplify-supreme

Unified simplification + cleanup. Karpathy principles + simplify mechanic + code-simplifier patterns.

## Validated wins

| Sample | Items | vs baseline | Verdict |
|---|---|---|---|
| Bloated TS class | 47 | +24% | TIE with built-in (50), supreme stronger on structural |
| Over-abstracted React | 13 | +18% | catches dead imports + comment-noise |

See [BENCHMARKS.md](../../BENCHMARKS.md#4-simplify-supreme).

## Triggers

- "simplify", "/simplify"
- "clean up", "refactor"
- "remove duplication", "DRY this"
- "reduce", "shorten"

## 6-phase workflow

1. **Scope** — define exactly what to simplify (don't expand silently)
2. **Read** — understand contract + tests + callers before cutting
3. **Identify excess** — checklist (speculative / defensive / duplication / dead / comment-noise / naming / function size / indirection)
4. **Apply changes** — one at a time, run tests after each
5. **Skip rules** — when NOT to simplify (no tests, hot path, idiom, Chesterton's fence)
6. **Verify equivalence** — same tests pass + no new tests + net deletion

## Sources fused

- `karpathy-guidelines` — simplicity-first principles
- built-in `simplify` — review-changed-code mechanic
- `code-simplifier:code-simplifier` — cleanup patterns

## Best for

- Refactor passes (delete-heavy, structural moves)
- Pre-commit cleanup
- Code review showing complexity smell
- Removing "future-proofing" that wasn't needed

## Not best for

- Code without tests covering it (write tests first)
- Hot path optimized for perf (clarity loss intentional)
- Quick type-system hints (use built-in `simplify` direct)

## Install

```bash
cp -r simplify-supreme ~/.claude/skills/
```

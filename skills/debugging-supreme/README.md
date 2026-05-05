# debugging-supreme

Unified debugging methodology. Root-cause analysis + browser-specific + memory-leak + perf + Karpathy surgical-change discipline.

## Validated wins

| Sample | Tests included | Alt fixes | Verdict |
|---|---|---|---|
| TOCTOU race | + corollary test | 4 (mutex/CAS/Redis/queue) | +best alt enumeration |
| Pagination off-by-one | 9 (vs baseline 5) | + range guards | +80% test coverage |

See [BENCHMARKS.md](../../BENCHMARKS.md#3-debugging-supreme).

## Triggers

- "debug", "/debug", "fix bug"
- "broken", "not working", "why is X failing"
- "memory leak", "slow", "OOM", "race condition"
- "test failing"

## 9 phases

1. **Reproduce reliably** — cannot fix what cannot be reproduced
2. **Frame the bug** — Expected/Actual/Where/When
3. **Hypothesis-driven investigation** — predict + check, not shotgun
4. **Web-specific** (browser/Node) — DevTools tools mapped per symptom
5. **Memory leaks** — heap snapshot diagnosis
6. **Performance** — measure first, fix dominant cost
7. **Surgical fix** — Karpathy principles, smallest change
8. **Prevent recurrence** — write regression test
9. **Document** — claude-mem captures for future

## Sources fused

- `superpowers:systematic-debugging` — methodology backbone
- `chrome-devtools-mcp:troubleshooting` — browser layer
- `chrome-devtools-mcp:memory-leak-debugging` — heap analysis
- `chrome-devtools-mcp:debug-optimize-lcp` — Core Web Vitals
- `karpathy-guidelines` — surgical change discipline

## Best for

- Race conditions, async bugs
- Memory leaks
- Performance regressions
- Browser/web app bugs (DevTools-aware)
- Subtle logic bugs needing methodical investigation

## Not best for

- Compiler errors (read first error, done)
- Typos (just fix)
- Trivially obvious bugs

## Install

```bash
cp -r debugging-supreme ~/.claude/skills/
```

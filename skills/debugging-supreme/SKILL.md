---
name: debugging-supreme
description: Unified debugging methodology. Use when user encounters any bug, test failure, error, "broken", "not working", "why is X failing", "/debug", or asks to troubleshoot. Combines systematic root-cause analysis, browser-specific debugging, performance issues, memory leaks, and Karpathy's surgical-change discipline.
type: fusion
sources:
  - name: superpowers:systematic-debugging
    contributed: Root-cause methodology, hypothesis testing, anti-patterns
  - name: chrome-devtools-mcp:troubleshooting
    contributed: Browser/DevTools failures
  - name: chrome-devtools-mcp:chrome-devtools
    contributed: General browser debugging tools
  - name: chrome-devtools-mcp:memory-leak-debugging
    contributed: JS/Node memory leak diagnosis
  - name: chrome-devtools-mcp:debug-optimize-lcp
    contributed: Core Web Vitals + LCP
  - name: karpathy-guidelines
    contributed: Surgical changes, surface assumptions, simplicity
generated_at: 2026-05-04
generated_by: skill-fusion
---

# Debugging — Supreme

Single skill: bug → root cause → surgical fix → verify. No shotgun fixes.

## When to invoke

- Test failing, code throwing, unexpected output
- "why is X broken?", "/debug", "fix this error"
- Web app misbehaving (browser layer)
- Performance regression
- Memory leak / OOM
- Build failing

## Phase 1 — Reproduce reliably

**Cannot fix what you cannot reproduce.**

1. Get exact reproduction steps
2. Run minimum case that triggers bug
3. Confirm: same input → same wrong output, every time
4. If intermittent: capture timing/state when fails

If can't reproduce → don't fix yet. Either:
- More info needed (logs, env, version)
- Race condition → different debugging path
- Already fixed and stale report

## Phase 2 — Frame the bug

Write down:
- **Expected**: what should happen
- **Actual**: what happens
- **Where**: file/line/function suspected
- **When**: always / specific input / specific env

Don't proceed until these are crisp. Vague framing = vague fix.

## Phase 3 — Hypothesis-driven investigation

**Don't read code top-down looking for bug. Form hypothesis, test it.**

1. State hypothesis: "X is happening because Y"
2. Predict: "if Y, then I'll see Z when I check W"
3. Check W
4. If Z → hypothesis confirmed, dig deeper into Y
5. If not Z → hypothesis wrong, form new one

Tools:
- **Logs**: add temporary logs at suspected boundary (remove after)
- **Debugger**: breakpoint, step through, inspect state
- **Bisect**: `git bisect` for regressions
- **Test isolation**: run only the failing test, vary inputs

**Anti-pattern**: changing code to "see if it fixes it" without hypothesis. That's shotgun debugging — wastes time, masks root cause.

## Phase 4 — Web-specific (browser/Node)

If bug is in browser/web context:

| Symptom | Tool |
|---|---|
| UI weird, layout broken | DevTools Elements + Computed styles |
| Click/event not firing | DevTools Sources breakpoint, Console errors |
| API call failing | DevTools Network tab |
| Slow page load | Performance tab + LCP analysis (`chrome-devtools-mcp:debug-optimize-lcp`) |
| OOM / memory growth | Memory tab heapsnapshot (`chrome-devtools-mcp:memory-leak-debugging`) |
| A11y issue | Accessibility tab (`chrome-devtools-mcp:a11y-debugging`) |
| DevTools MCP tool failing | `chrome-devtools-mcp:troubleshooting` |

For Node OOM: `node --inspect` + Chrome DevTools attached.

## Phase 5 — Memory leaks specifically

Symptoms: process grows unboundedly, RSS climbs, OOM after time.

1. Take heap snapshot at baseline
2. Trigger suspected leak operation N times
3. Take another snapshot
4. Compare: which objects grew?
5. Find retainer chain → who holds the reference
6. Common culprits:
   - Event listeners not removed
   - Closures capturing large state
   - Caches without eviction
   - Timers/intervals not cleared
   - Subscriptions not unsubscribed

Tool: memlab for Node, DevTools Memory for browser.

## Phase 6 — Performance specifically

If "slow":

1. Measure first — don't guess. What's slow? (page load, API, computation)
2. If page load → LCP analysis, Performance trace
3. If API → server timing, DB query plan
4. If computation → profile (Chrome DevTools Performance, Node `--prof`)
5. Find dominant cost (80/20)
6. Fix dominant cost first, re-measure
7. Don't optimize what isn't dominant — wasted effort

## Phase 7 — Surgical fix

Once root cause known:

**Apply karpathy-guidelines**:
- State assumption being made about why fix works
- Smallest change that fixes root cause
- No "while I'm here" refactors
- No defensive programming for impossible cases
- No new abstraction unless 3+ places duplicated

**Verify**:
1. Run reproduction from Phase 1 → bug gone
2. Run all tests → no regression
3. Run manual smoke if UI/integration
4. If can't fully verify: explicitly state what's untested

## Phase 8 — Prevent recurrence

After fix, ask:
- Can I write a test that would have caught this?
- If yes → write it, verify it fails on old code, passes on new
- If no → why? often means unclear requirements, surface to user

Don't ship a fix without a regression test unless impossible.

## Phase 9 — Document for future

`claude-mem` will capture this debug session. Useful future-search tags:
- Root cause keyword
- Symptom keyword
- Stack involved
- Time-to-fix

So next session: `claude-mem:mem-search "<symptom>"` finds this fix.

## Anti-patterns

- DON'T fix without reproducing
- DON'T change multiple things at once (can't isolate which fixed)
- DON'T add try/catch as fix — that's hiding, not fixing
- DON'T assume reviewer/user is wrong without checking
- DON'T fix symptom when you can fix cause
- DON'T skip writing regression test when one is feasible
- DON'T claim fixed without running the original repro
- DON'T optimize without measuring

## Quick reference

| Situation | Action |
|---|---|
| Test failing | Reproduce, isolate test, hypothesize |
| Error in prod logs | Get stack trace, find line, reproduce locally |
| "Used to work" regression | `git bisect` |
| Web layout broken | DevTools Elements |
| Page slow | Performance trace + LCP |
| Memory grows | Heap snapshots, retainer chain |
| Intermittent | Race condition — log timing, check ordering |
| Build fails | Read first error, not last (cascade) |

## Sources

- **superpowers:systematic-debugging** — methodology backbone
- **chrome-devtools-mcp:*** — browser layer expertise
- **karpathy-guidelines** — surgical change discipline

Refresh: `/skill-fusion refresh debugging-supreme`

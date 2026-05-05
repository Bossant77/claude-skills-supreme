# HOOKS-DECISIONS.md — harness-supreme

Generated: 2026-05-04 (test-run scaffold)

> **STOP — manual decisions required before activation.** Hooks register handlers for harness lifecycle events. Multiple plugins handling the same event = unpredictable order and possible double-side-effects. Per the `plugin-fusion` skill, hook merging is **never auto-resolved**.

---

## Per-event handler registry

### Event: `SessionStart` (matchers: `startup|clear|compact`)

| Source | Handler | What it does (from script content) |
|---|---|---|
| superpowers | `${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd session-start` (Windows .cmd dispatching to `hooks/session-start/`) | Bootstraps SP harness — likely loads "using-superpowers" reminder, registers skill index. |
| ECC | `node scripts/hooks/plugin-hook-bootstrap.js` → `node scripts/hooks/session-start.js` (inferred from hooks.json structure) | Bootstraps ECC's research/security/instincts skill loader, possibly prints harness banner, primes catalog. |
| get-shit-done | (none declared in `hooks/hooks.json` because GSD has no `hooks.json`. Possibly registered by `bin/install.js`. Needs read.) | TBD — `gsd-session-state.sh` and `gsd-statusline.js` exist in `hooks/` and likely fire here. |

**DECISION REQUIRED:**

- [ ] **Option A — Keep all sequentially.** Order: SP first (lightweight reminder) → ECC (catalog priming) → GSD (state init). Risk: ~2-3s startup latency.
- [ ] **Option B — Pick winner.** Recommend ECC (richest harness boot). Drops SP's "using-superpowers" reminder — must ensure that skill triggers via Skill tool list anyway.
- [ ] **Option C — Write fused hook.** New `harness-supreme-bootstrap.js` that does the union. Heaviest work, cleanest result.

**Default if no decision: Option A (keep all, ordered SP → ECC → GSD).**

---

### Event: `PreToolUse` matcher `Bash`

| Source | Handler | What it does |
|---|---|---|
| superpowers | none | — |
| ECC | `scripts/hooks/pre-bash-dispatcher.js` (consolidated dispatcher: quality / tmux / push / GateGuard checks) | Validates Bash commands before execution. Multiple sub-checks chained inside one dispatcher — already pre-merged on ECC's side. |
| get-shit-done | likely `hooks/gsd-prompt-guard.js` and/or `hooks/gsd-workflow-guard.js` (registration via installer) | Prompt injection guard, workflow gating. |

**DECISION REQUIRED:**

- [ ] **Option A — Keep both.** ECC dispatcher first (already-consolidated quality/security checks), then GSD guards. Cumulative latency on every Bash call. Risk: high — every shell command gets two preflights.
- [ ] **Option B — Pick winner.** ECC's dispatcher is already a multi-check consolidator; add GSD's specific guards as new sub-checks inside ECC's dispatcher style. Cleaner.
- [ ] **Option C — Fuse into a single dispatcher.** Best long-term, requires reading both scripts and merging logic.

**Default if no decision: Option B (extend ECC's dispatcher with GSD's specific guard logic). Requires Phase 6 implementation.**

---

### Event: `PostToolUse` matchers `Edit | Write | MultiEdit | Bash|Write|Edit|MultiEdit`

| Source | Handler | What it does |
|---|---|---|
| superpowers | none | — |
| ECC | multiple registrations across `Edit`, `Write`, `Edit|Write`, `Edit|Write|MultiEdit`, `Bash|Write|Edit|MultiEdit` (from extracted matcher set) | Post-write validators (lint, format checks, import scanners) — ECC's most aggressive surface. |
| get-shit-done | likely `hooks/gsd-read-guard.js`, `hooks/gsd-read-injection-scanner.js`, `hooks/gsd-context-monitor.js` | Read-injection scanning, context monitoring after edits. |

**DECISION REQUIRED:**

- [ ] **Option A — Keep all, ordered.** ECC validators run, then GSD scanners. Each Edit/Write triggers ~5+ hook calls. **Performance concern.**
- [ ] **Option B — Pick non-overlapping subsets.** Use ECC for code quality (lint/format), GSD for security (injection/context). Drop overlap.
- [ ] **Option C — Fuse into per-matcher dispatchers** (one per event:matcher tuple). Highest engineering cost.

**Default if no decision: Option B. Requires per-script audit in Phase 6.**

---

### Event: `SessionEnd` — ECC only · AUTO copy
### Event: `Stop` — ECC only · AUTO copy
### Event: `PreCompact` — ECC only · AUTO copy

No conflicts on these events. ECC's handlers copy verbatim into `harness-supreme/hooks/`.

---

## Reversibility

When activation eventually appends entries to user `settings.json`, wrap them in marker comments:

```jsonc
// >>> harness-supreme:hooks BEGIN
// ... hooks ...
// <<< harness-supreme:hooks END
```

This preserves clean rollback via `/plugin-fusion uninstall harness-supreme`.

---

## Open items for user

1. Decide Option A/B/C for `SessionStart`.
2. Decide Option A/B/C for `PreToolUse:Bash`.
3. Decide Option A/B/C for `PostToolUse:Edit|Write`.
4. Read `get-shit-done/bin/install.js` to confirm GSD hook registration scheme (this scaffold did not parse it).
5. Confirm marker-comment scheme above for `settings.json` reversibility.

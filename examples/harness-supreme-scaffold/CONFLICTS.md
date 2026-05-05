# CONFLICTS.md — harness-supreme

Generated: 2026-05-04 (test-run scaffold)

Legend: **EXACT** = filename collision · **SEMANTIC** = same purpose, different name · **DEFER** = needs user decision · **AUTO** = resolution is mechanical (rename/copy) and was queued for Phase 5 generate step.

---

## Phase 1 — Pre-flight checklist

| Item | Status | Notes |
|---|---|---|
| License compatibility | OK | All 3 sources MIT |
| User authority to combine | OK | Solo / private use; not publishing to marketplace |
| Output is local plugin | OK | `~/.claude/claude-library/fused-plugins/harness-supreme/` |
| Source plugins remain installable | OK | Fusion is additive, sources untouched |
| Attribution preserved | DEFER | Required when skill/command bodies are copied (Phase 6) |

---

## Phase 2 — Inventory

| Source | Skills | Commands | Agents | Hook events | MCP servers | Scripts |
|---|---:|---:|---:|---:|---:|---:|
| superpowers 5.1.0 | 14 | 0 | 0 | 1 (`SessionStart`) | 0 | 2 |
| everything-claude-code 2.0.0-rc.1 | 182 | 68 | 48 | 6 (PreToolUse / PostToolUse / SessionStart / SessionEnd / Stop / PreCompact) | 8 (jira, github, firecrawl, supabase, memory, omega-memory, +2) | ~15 |
| get-shit-done 1.39.0-rc.4 | 0 | 65 | 33 | 0 declared (12 hook scripts in `/hooks`, registration TBD) | 0 | ~10 |
| **TOTAL** | **196** | **133** | **81** | **3 events with overlap** | **8** | **~27** |

Notes:
- ECC's 182 skills live in `<src>/skills/<name>/SKILL.md`. There is also a `.claude/skills/everything-claude-code/SKILL.md` which is a meta/index skill (1 file).
- GSD ships 65 commands all under `commands/gsd/<name>.md` (single namespace).
- GSD has 12 hook scripts in `hooks/` but no top-level `hooks.json` — registration happens via the SDK installer (`bin/install.js`). Treat as a black-box hook bundle until installer is read.

---

## Phase 3 — Conflict matrix

### SKILLS (196 total · 0 EXACT collisions · 4 SEMANTIC overlaps)

| Skill (canonical) | Source(s) | Type | Resolution |
|---|---|---|---|
| TDD / test-driven-development | superpowers (`test-driven-development`) + ECC (`tdd-workflow`, `django-tdd`, `laravel-tdd`, `springboot-tdd`) | SEMANTIC | **DEFER** — run `skill-fusion` to merge SP's general TDD with ECC's framework-specific TDD variants |
| Verification before completion | superpowers (`verification-before-completion`) + ECC (`verification-loop`, `django-verification`, `laravel-verification`, `springboot-verification`) | SEMANTIC | **DEFER** — run `skill-fusion` |
| Systematic debugging | superpowers (`systematic-debugging`) + ECC (`agent-introspection-debugging`) | SEMANTIC (loose) | **DEFER** — likely keep both, scopes differ; user confirm |
| Code review (request/receive) | superpowers (`requesting-code-review`, `receiving-code-review`) + ECC (`security-review`, `flutter-dart-code-review`) | SEMANTIC (partial) | **DEFER** — SP is process-focused, ECC are domain-specific reviewers; recommend keep all, document scope |
| Brainstorming | superpowers only | unique | AUTO copy |
| Writing plans / executing plans | superpowers only | unique | AUTO copy |
| Writing skills | superpowers only | unique | AUTO copy |
| Using git worktrees | superpowers only | unique | AUTO copy |
| Dispatching parallel agents / subagent-driven dev | superpowers only | unique | AUTO copy |
| Finishing a development branch | superpowers only | unique | AUTO copy |
| Using superpowers | superpowers (meta) | unique | AUTO copy (rename to `using-harness-supreme`) |
| Remaining 175 ECC skills | ECC only | unique | AUTO copy verbatim with attribution |
| GSD (no skills) | — | — | n/a |

**Skill conflict count: 4 semantic clusters → 4 DEFER decisions.**

### COMMANDS (133 total · 1 EXACT collision · multiple SEMANTIC overlaps)

| Command name | Source(s) | Type | Resolution |
|---|---|---|---|
| `code-review.md` | ECC + GSD | EXACT | **DEFER** — pick winner OR rename `/ecc-code-review` + `/gsd-code-review`. Default plan: rename both. |
| `debug` semantic family | ECC (none top-level) + GSD (`debug.md`) | unique | AUTO copy |
| `plan` / `plan-phase` | GSD (`plan-phase.md`); SP has no commands | unique | AUTO copy |
| `feature-dev.md` (ECC) vs `feature-development.md` (ECC `.claude/commands/`) | ECC internal | n/a | Pick canonical ECC location — drop `.claude/commands/` shims. |
| Remaining 132 commands | unique by namespace | unique | AUTO copy (GSD all under `gsd/` subfolder = no flat-namespace collision) |

**Command conflict count: 1 EXACT (1 DEFER, default rename).**

Note: GSD nests all commands under `commands/gsd/`, so once copied verbatim into `harness-supreme/commands/gsd/`, only the single `code-review.md` collides at flat-namespace level. Recommend keeping GSD's nesting to neutralize all other potential collisions.

### AGENTS (81 total · 0 EXACT collisions detected · review recommended)

| Agent | Source | Notes |
|---|---|---|
| 48 ECC agents | everything-claude-code | All MIT, copy verbatim |
| 33 GSD agents | get-shit-done | All prefixed `gsd-*` (e.g. `gsd-debugger`, `gsd-code-reviewer`), so no flat collision with ECC's `code-reviewer.md` etc. |
| 0 SP agents | superpowers | n/a |

**Agent conflict count: 0.** Recommend keeping GSD prefix and copying both directories. Spot-check overlapping roles:
- ECC `code-reviewer.md` vs GSD `gsd-code-reviewer.md` → **SEMANTIC overlap**, but distinct trigger names. Document scopes in README. **DEFER (low priority).**
- ECC `code-architect.md` vs GSD `gsd-executor.md` / `gsd-code-fixer.md` → different roles, no conflict.

### HOOKS (3 events with multi-source registrants)

See `HOOKS-DECISIONS.md` for full per-event breakdown. Summary:

| Event | Sources registering | Decision |
|---|---|---|
| `SessionStart` | superpowers + ECC | **DEFER** |
| `PreToolUse:Bash` | ECC only (consolidated dispatcher) + potential GSD overlap when `bin/install.js` is parsed | **DEFER** |
| `PostToolUse` (Edit/Write/MultiEdit) | ECC only currently; GSD scripts (`gsd-read-guard.js`, `gsd-prompt-guard.js`, `gsd-workflow-guard.js`) likely register here once installed | **DEFER** |
| `SessionEnd`, `Stop`, `PreCompact` | ECC only | AUTO copy |

**Hook conflict count: 3 events with multiple registrants → 3 DEFER decisions.**

### MCP SERVERS (8 total · 0 EXACT collisions)

| Server | Source | Notes |
|---|---|---|
| jira | ECC | needs user JIRA_URL/EMAIL/TOKEN |
| github | ECC | needs PAT |
| firecrawl | ECC | needs API key |
| supabase | ECC | needs project ref |
| memory | ECC | no creds |
| omega-memory | ECC | needs config |
| (+2 more in mcp-servers.json) | ECC | not enumerated in this scan |
| (none) | superpowers, GSD | n/a |

**MCP conflict count: 0.** All from one source. Action: copy `mcp-configs/mcp-servers.json` verbatim, leave placeholder credentials, **DEFER** activation until user provides keys.

### DEPENDENCIES (npm)

| Source | Dependencies |
|---|---|
| superpowers | none declared (`package.json` only ~116 bytes) |
| ECC | not enumerated in this scan — has `package.json` + `package-lock.json` |
| GSD | `@anthropic-ai/claude-agent-sdk@^0.2.84`, `ws@^8.20.0` (+ `c8` dev) |

**Dependency conflict count: 0 known.** Action: when generating fresh `package.json` for fused plugin, union deps; resolve any version mismatch surfaced in Phase 6.

### SCRIPTS

DO NOT merge install scripts (per skill rule). Each source's `install.sh`/`install.ps1`/`bin/install.js` assumes its own layout. Action: in Phase 6, write fresh `install.sh` + `install.ps1` for `harness-supreme`. **DEFER (Phase 6 not in scope).**

---

## Deferred decisions summary

| # | Category | Item | Action required |
|---|---|---|---|
| 1 | Skill | TDD cluster (1 SP + 4 ECC) | Run `skill-fusion` |
| 2 | Skill | Verification cluster (1 SP + 4 ECC) | Run `skill-fusion` |
| 3 | Skill | Debugging (1 SP + 1 ECC) | Confirm keep-both vs fuse |
| 4 | Skill | Code review (2 SP + 2 ECC) | Confirm keep-all vs fuse |
| 5 | Command | `code-review.md` ECC + GSD | Pick rename scheme |
| 6 | Agent | ECC `code-reviewer` vs GSD `gsd-code-reviewer` | Confirm both kept (low priority) |
| 7 | Hook | `SessionStart` SP + ECC | Pick keep-all-ordered / pick / fuse |
| 8 | Hook | `PreToolUse:Bash` ECC + GSD | Read GSD installer, decide |
| 9 | Hook | `PostToolUse` (Edit/Write) ECC + GSD | Read GSD scripts, decide |
| 10 | MCP | 8 servers needing API keys | Provide credentials before activation |
| 11 | Attribution | License headers on copied files | Add when bodies are copied (Phase 6) |
| 12 | Install script | `install.sh` / `install.ps1` | Generate fresh in Phase 6 |

**Total deferred: 12 decisions.**

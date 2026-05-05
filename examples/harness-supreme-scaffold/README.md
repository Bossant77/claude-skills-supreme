# harness-supreme

**Status:** SCAFFOLD ONLY (test run, 2026-05-04). Not installable yet.

Fused plugin scaffold combining three overlapping AI dev harnesses into a single canonical plugin.

## Sources fused

| Source | Version | License | Author | Origin |
|---|---|---|---|---|
| `superpowers` | 5.1.0 | MIT | Jesse Vincent | `claude-plugins-official` marketplace (installed) |
| `everything-claude-code` | 2.0.0-rc.1 | MIT | Affaan Mustafa | https://github.com/affaan-m/everything-claude-code (cloned, not installed) |
| `get-shit-done` | 1.39.0-rc.4 | MIT | TÂCHES / Lex Christopherson | https://github.com/gsd-build/get-shit-done (cloned, not installed) |

All three sources are MIT-licensed — fusion is license-compatible for personal use. Redistribution would still need attribution headers preserved on copied files.

## What this scaffold contains

```
harness-supreme/
├── plugin.json           - merged metadata, status=scaffold
├── README.md             - this file
├── CONFLICTS.md          - full conflict matrix + deferred items
├── HOOKS-DECISIONS.md    - hook event registrations + manual decision flags
├── skills/.placeholder   - empty (skill bodies not yet merged)
├── commands/.placeholder - empty (rename plan in CONFLICTS.md)
├── agents/.placeholder   - empty (no SP/ECC overlap, GSD = 33 agents to copy)
└── hooks/.placeholder    - empty (decisions pending in HOOKS-DECISIONS.md)
```

## What this scaffold does NOT contain (deliberately, per scope)

- **Skill bodies** — fusing the 4 semantic-overlap skills (TDD, verification, debug, code-review) requires `skill-fusion` skill invoked per pair. Not done in this test run.
- **Hook handlers** — 3 events have multi-source registrants. User must pick keep-all-ordered / pick-one / write-fused. See `HOOKS-DECISIONS.md`.
- **Install scripts** — `install.sh` / `install.ps1` not generated. Plugin is not yet installable.
- **MCP server registration** — only ECC ships an `mcp-servers.json` (8 servers, all needing user-supplied API keys). Not registered.
- **Source plugin disable** — sources remain installed/installable. No edits to `installed_plugins.json`.

## How to activate (when scaffold is completed)

This scaffold is **not yet activatable**. To complete it:

1. Resolve every row marked **DEFER** in `CONFLICTS.md`.
2. Make decisions in `HOOKS-DECISIONS.md` (read each handler, choose keep-all/pick/fuse).
3. Run `skill-fusion` for each of the 4 semantic-overlap skill pairs.
4. Copy non-conflicting skills/commands/agents verbatim with attribution headers.
5. Generate fresh `install.sh` / `install.ps1` (Phase 6 of plugin-fusion skill).
6. Choose Mode A (replace sources) or Mode B (coexist) — see plugin-fusion skill section 7.

## Rollback

While this is scaffold-only there is nothing to roll back beyond deleting this directory:

```
rm -rf ~/.claude/claude-library/fused-plugins/harness-supreme/
```

Source plugins are untouched — they remain installable from their original locations.

## Refresh

Re-run `/plugin-fusion refresh harness-supreme` after sources update to surface new conflicts.

## Attribution

When skills/commands/agents are eventually copied verbatim from sources, original LICENSE + author headers must be preserved at the top of each file.

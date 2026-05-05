---
name: plugin-fusion
description: Generate a unified plugin scaffold by fusing N overlapping source plugins. Handles skills, commands, agents, hooks, MCP servers. Use when user says "fuse plugins X Y Z", "merge plugins", "make supreme plugin from superpowers + everything-claude-code + get-shit-done", "/plugin-fusion", or wants to combine multiple plugin harnesses into one. Heavier than skill-fusion — surfaces conflicts requiring manual resolution.
type: meta
---

# plugin-fusion

Synthesize a new plugin folder by fusing components from N source plugins. Reuses `skill-fusion` for skill content, picks/renames commands and agents, flags hook/MCP/dep conflicts for manual resolution.

## When to invoke

- User says "fuse plugins", "merge harnesses", "/plugin-fusion", "combine superpowers + everything-claude-code + get-shit-done", "supreme harness"
- After auditing overlapping plugins (e.g., multiple comprehensive AI dev harnesses)
- When user wants single canonical plugin replacing multiple

## Pre-flight checklist

Before running, verify with user:

1. License compatibility — copying content across plugins requires permissive licenses (MIT, Apache 2.0). Check each source.
2. User has authority to combine — solo-use is fine, redistribution needs source licenses
3. Output is local plugin (private use), not marketplace publication, unless user confirms attribution + license headers
4. Source plugins remain installable — fusion is additive, don't auto-uninstall sources

## Inputs

- Source plugin names (e.g., `superpowers@claude-plugins-official`)
- Target name for fused plugin (default: `<theme>-supreme-plugin`, e.g., `harness-supreme`)

## Steps

### 1. Locate sources

For each source plugin, find install path:
- Read `~/.claude/plugins/installed_plugins.json`
- Get `installPath` for each source
- If not installed: error, ask user to install or provide repo path

### 2. Inventory each source

Parse plugin folder. Catalog:

```json
{
  "<source-name>": {
    "skills": ["skills/foo/SKILL.md", ...],
    "commands": ["commands/foo.md", ...],
    "agents": ["agents/foo.md", ...],
    "hooks": ["plugin.json::hooks", ...],
    "mcp_servers": ["mcp.json::servers", ...],
    "dependencies": ["package.json::deps"],
    "scripts": ["install.sh", "scripts/setup.js", ...]
  }
}
```

### 3. Build conflict matrix

For each component category, list items. For each item, check if name/trigger collides with another source.

Output table to user:

```
## SKILLS (12 total, 3 conflicts)
- writing-plans → in [superpowers, everything-claude-code]   ⚠️ CONFLICT
- brainstorming → in [superpowers]                            ✅ unique
- gsd-spec-driven → in [get-shit-done]                        ✅ unique

## COMMANDS (8 total, 1 conflict)
- /plan → in [superpowers, get-shit-done]                     ⚠️ CONFLICT

## HOOKS (5 total, 2 events with multiple registrants)
- PostToolUse:Bash → registered by [superpowers, everything-claude-code]   ⚠️ CONFLICT
- SessionStart → registered by [everything-claude-code]                   ✅ unique

## MCP SERVERS (2 total, 0 conflicts)
- skills-search (superpowers)
- ecc-research (everything-claude-code)
```

### 4. Resolve per category

#### Skills
Apply `skill-fusion` skill on each conflicting skill.
Non-conflicting skills: copy verbatim with attribution.

#### Commands
For each conflict, ask user:
- **Pick winner**: keep one, drop others
- **Rename**: prefix with source short-name (e.g., `/sp-plan`, `/gsd-plan`)
- **Fuse**: write new command merging behavior (rare, often impractical)

Default: rename with source prefix to preserve all.

#### Agents (subagents)
Same as commands — pick winner OR rename with prefix.
Most subagents are independent; rename usually works.

#### Hooks
**STOP — manual decision required.** Hooks register handlers for events. Multiple plugins handling same event = unpredictable order, possible double-side-effects.

For each conflicting event:
- Show user what each hook does (read script content)
- Ask: keep all (sequential), keep one (pick), or write fused hook
- If keep all: order matters. Ask explicit ordering.
- Prefer fewer hooks over orchestrating many.

Document decisions in `HOOKS-DECISIONS.md` inside fused plugin.

#### MCP servers
- Different names → coexist
- Same name → pick winner OR rename (e.g., `skills-search-sp`, `skills-search-ecc`)
- Same purpose, different impl → pick canonical, document why

#### Dependencies
- Merge `package.json` dependencies, version-resolve conflicts
- Flag any incompatible peer dep
- Generate fresh `package-lock.json` after install

#### Scripts
- DO NOT merge install scripts — they assume their own plugin layout
- Generate fresh `install.sh` / `install.ps1` for fused plugin

### 5. Generate fused plugin scaffold

Output path: `~/.claude/claude-library/fused-plugins/<fused-name>/`

Structure:

```
<fused-name>/
├── plugin.json                     ← merged metadata
├── README.md                       ← what was fused, sources, license attribution
├── HOOKS-DECISIONS.md              ← manual choices recorded
├── CONFLICTS.md                    ← unresolved items requiring user follow-up
├── skills/                         ← fused + verbatim skills
│   ├── <fused-skill>/SKILL.md      ← from skill-fusion
│   └── <unique-skill>/SKILL.md     ← copied verbatim
├── commands/                       ← deduplicated (renamed where needed)
├── agents/                         ← deduplicated
├── hooks/                          ← consolidated
├── mcp.json                        ← merged servers
├── package.json                    ← merged deps
└── install.sh + install.ps1        ← fresh install script
```

`plugin.json` example:

```json
{
  "name": "harness-supreme",
  "version": "0.1.0",
  "description": "Fused harness: superpowers + everything-claude-code + get-shit-done",
  "author": "Bossant77",
  "fused_from": [
    { "name": "superpowers", "marketplace": "claude-plugins-official", "version": "5.1.0" },
    { "name": "everything-claude-code", "repo": "https://github.com/affaan-m/everything-claude-code" },
    { "name": "get-shit-done", "repo": "https://github.com/gsd-build/get-shit-done" }
  ],
  "fused_at": "<YYYY-MM-DD>",
  "generated_by": "plugin-fusion"
}
```

### 6. Generate install script

Tasks:
- `npm install` (if `package.json` has deps)
- Copy `skills/`, `commands/`, `agents/` to `~/.claude/plugins/cache/local/<fused-name>/`
- Append fused hooks to user `settings.json` (with marker comments for reversibility)
- Register MCP servers
- Update `~/.claude/plugins/installed_plugins.json`

### 7. Activation options

Ask user — Mode A or B:

**Mode A — Replace**: Disable source plugins, only fused active
- Edit `installed_plugins.json` to mark sources disabled
- Cleaner trigger surface
- Reversible — sources still in cache

**Mode B — Coexist**: Keep all (default)
- Sources + fused both load
- Possible double-trigger; manage via priorities or rely on Claude's selection
- Easier rollback

### 8. Document everything

`README.md` of fused plugin:
- Sources list with versions
- License headers from each source preserved
- What's unique to this fusion
- Refresh command: `/plugin-fusion refresh <name>`
- Rollback steps
- Known conflicts deferred (link to `CONFLICTS.md`)

### 9. Test before declaring done

After scaffold generation:
- List skills/commands/agents that should now be available
- Ask user to start a fresh session
- Verify triggers fire correctly
- Check hooks don't double-fire

## Refresh mode

`/plugin-fusion refresh <name>` →
1. Check sources for updates (git pull, npm version diff)
2. Re-run inventory
3. Diff against existing fused plugin
4. Surface new conflicts
5. Apply non-controversial updates
6. Ask user about new conflicts

## Anti-patterns

- DON'T auto-merge hooks. Always ask user. Hooks have side effects.
- DON'T fuse plugins with incompatible licenses
- DON'T fuse plugins with completely non-overlapping scopes (waste — better keep separate)
- DON'T fuse if user only uses 10% of each source — cherry-pick to local skills instead
- DON'T republish fused plugin to marketplace without source authors' permission

## When to NOT fuse plugins

Use `skill-fusion` (lighter) instead when:
- Only 1-2 skills overlap, no command/hook overlap
- Sources are stable and rarely conflict at runtime
- You want to keep source plugins as black boxes

## Output paths

- Library scaffold: `~/.claude/claude-library/fused-plugins/<name>/`
- Active install: `~/.claude/plugins/cache/local/<name>/` (after install script run)
- Decisions log: `~/.claude/claude-library/fused-plugins/<name>/HOOKS-DECISIONS.md`
- Conflict followups: `~/.claude/claude-library/fused-plugins/<name>/CONFLICTS.md`

## Recommended initial fusion

`harness-supreme` from:
- `superpowers@claude-plugins-official` (base — most rigorous methodology)
- `everything-claude-code` (research, security, instincts)
- `get-shit-done` (spec-driven dev commands)
- (skip gstack — Bun build heavy, role agents niche)

Expected outcome:
- ~30+ skills total (some fused, most unique)
- ~5-10 commands (renamed where conflict)
- ~5-10 subagents (renamed where conflict)
- 3-5 hook events (some need manual resolution)
- 1-2 MCP servers

Estimated work: 30-60 min interactive resolution.

## Notes

- This skill OUTPUTS a plugin scaffold — does NOT auto-install or auto-publish
- Always review `CONFLICTS.md` before activating
- Source plugins remain installed and functional
- Activation mode (Replace vs Coexist) is reversible — flip flag in `installed_plugins.json`
- For pure additive (no conflicts), this skill becomes simple copy operation — no manual review needed

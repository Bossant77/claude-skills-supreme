# plugin-fusion

Generate fused plugin scaffolds. Heavier than skill-fusion — handles plugins which include skills + commands + agents + hooks + MCP servers. Surfaces conflicts requiring manual resolution.

## Why distinct from skill-fusion?

| Component | skill-fusion | plugin-fusion |
|---|---|---|
| `SKILL.md` | ✅ auto | ✅ auto |
| `commands/*.md` | n/a | ⚠️ pick winner or rename |
| `agents/*.md` | n/a | ⚠️ pick or coexist |
| `hooks` (settings.json) | n/a | 🛑 MANUAL — autorun chocks |
| `mcp.json` (MCP servers) | n/a | ⚠️ pick or coexist |
| `package.json` deps | n/a | 🛑 MANUAL |
| install scripts | n/a | 🛑 SKIP — generate fresh |

## Triggers

- "/plugin-fusion", "fuse plugins X Y Z"
- "merge plugins", "make supreme plugin"

## Workflow

1. **Pre-flight checklist** — license compatibility, user authority
2. **Locate sources** — read installed_plugins.json
3. **Inventory** — catalog each source's components
4. **Conflict matrix** — list overlaps per category
5. **Resolve per category**:
   - Skills → reuse skill-fusion
   - Commands → pick or rename with prefix
   - Agents → pick or rename
   - Hooks → ASK USER (cannot auto-fuse safely)
   - MCP → pick canonical or coexist
6. **Generate scaffold** at `~/.claude/claude-library/fused-plugins/<name>/`
7. **Activate** — install script runs `npm install`, copies, updates settings
8. **Activation modes**:
   - Replace (disable sources)
   - Coexist (keep all)

## Output

```
fused-plugins/<name>/
├── plugin.json                  ← merged metadata
├── README.md                    ← attribution
├── HOOKS-DECISIONS.md           ← manual choices recorded
├── CONFLICTS.md                 ← deferred conflicts
├── skills/
├── commands/
├── agents/
├── hooks/
├── mcp.json
├── package.json
└── install.sh + install.ps1
```

## Anti-patterns

- DON'T auto-merge hooks (side effects)
- DON'T fuse plugins with incompatible licenses
- DON'T fuse plugins with non-overlapping scopes
- DON'T republish without source authors' permission

## Estimated work

`harness-supreme` (superpowers + everything-claude-code + get-shit-done): ~30-60 min interactive resolution.

## Install

```bash
cp -r plugin-fusion ~/.claude/skills/
```

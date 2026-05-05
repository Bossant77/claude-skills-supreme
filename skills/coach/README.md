# coach

Stack advisor + proactive co-pilot. Recommends which skill/plugin/command to use given current context. Two modes:
- **Reactive**: you ask, coach answers
- **Proactive**: fires automatically after milestones ("ok done", "tests pass", "implemented")

## Why

If you've installed many Claude Code plugins/skills, you face decision fatigue. Coach reads your stack inventory + project context + intent, and ranks 3-5 specific next moves with exact invocation phrases.

## Triggers

- "/coach", "what should I do", "what next"
- "qué hago", "qué uso", "ayúdame a decidir"
- "I'm stuck", "where do I start"
- Proactive: "termine", "done", "listo", "ready", "tests pass", "que sigue"

## What it knows

- Your installed plugins (`~/.claude/plugins/installed_plugins.json`)
- Your active skills (`~/.claude/skills/`)
- Project stack (auto-detect from package.json, vercel.json, etc.)
- Phase of work (discovery / planning / building / verification / shipping)
- 24+ native Claude Code commands (`/init`, `/review`, `/security-review`, `Shift+Tab` plan mode, etc.)
- 30+ plugin commands across vercel/stripe/caveman/claude-mem
- The 4 supreme fusions in this repo

## Output format

```
📍 Project: <name>
🌿 Branch:  <state>
🔧 Stack:   <detected>
🎯 Intent:  <inferred>

NEXT MOVES (ranked):
1. [HIGH] <skill-name> — <why> — <invocation>
2. [MED] ...
3. [LOW] ...

💡 Tip: <stack-specific hint>

Run #1? [y/N/which]
```

## Native vs custom decision

Coach prefers native `/init`, `/review`, `/security-review`, plan mode (Shift+Tab) for simple tasks (cheaper). Recommends supreme fusions when depth justifies cost.

## Install

```bash
cp -r coach ~/.claude/skills/
```

Pairs well with hooks for proactive nudges — see main repo for `coach-stop-nudge.ps1` and `coach-session-start.ps1` examples.

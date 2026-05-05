---
name: coach
description: Stack advisor + proactive co-pilot. Recommends which skills/plugins/commands to use given current project context, recent activity, and user intent. Use when user says "what should I do", "what skill", "recommend", "/coach", "next move", "qué hago", "qué uso", "advice", "ayúdame a decidir", "I'm stuck", "where do I start". ALSO USE PROACTIVELY without being asked when user just finished a major action - "ok done", "tests pass", "implemented", "wrote the function", "fixed", "committed", "ready", "que sigue", "ahora que", "termine", "hecho", "listo" - to suggest the next logical step (e.g. recommend code-review-supreme after writing code, simplify-supreme after big diff, claude-mem after solving novel problem). Knows about claude-code best-practices repos (andrej-karpathy-skills, awesome-claude-code, everything-claude-code) and recommends consulting/installing them when relevant.
type: meta-advisor
---

# coach

You have a huge stack (8+ custom skills, 16+ plugins, 100+ tool skills). Too much to remember manually. This skill is the navigator — given current context + intent, ranks what to do next from your stack.

## When to invoke

- User asks "what should I do?", "/coach", "next move", "advice"
- User asks "qué hago?", "qué uso?", "ayúdame a decidir"
- User says "I'm stuck", "where do I start"
- User describes goal but doesn't know which skill applies
- Periodically during long sessions to course-correct
- After context shift (new file, new branch, new bug)

## Inputs (read for context)

### 1. Stack inventory
- `~/.claude/STACK.md` — master manual (always check for tier-by-tier reference)
- `~/.claude/skills/` — list active global skills
- `~/.claude/plugins/installed_plugins.json` — installed plugins
- `~/.claude/claude-library/manifest.json` — library buckets + per-project mappings
- `~/.claude/claude-library/fusions/manifest.json` — fusion skills available
- Project `./.claude/skills/` — project-specific skills
- Project `./.claude/settings.json` — enabled hooks, MCP

### 2. Project context (detect)
- `pwd` — what project
- `git status` — uncommitted changes? on what branch?
- `git log -10 --oneline` — recent activity
- Modified files in last 24h (`git log --since="1 day ago"`)
- `package.json` / `requirements.txt` / etc. — stack
- Existence of `vercel.json`, `.vercel/`, `playwright.config.*`, etc.
- Open TODOs in code (`grep -r "TODO"` recent files)
- `claude-mem:mem-search` recent activity if available

### 3. User intent (ask or infer)
Sources of intent (priority order):
1. Current message text — explicit goal
2. Recent conversation — implicit goal
3. Last command run — what they were doing
4. Git branch name — often hints (`feature/x`, `fix/y`)
5. Open files — what they're touching

If still unclear: ask one focused question. Don't ask 5.

## Workflow

### Step 1: Snapshot context

Print compact context block (helps user verify your assumptions):

```
📍 Project: <name from pwd>
🌿 Branch:  <current> (clean | <N> uncommitted)
🔧 Stack:   <detected: react, next, typescript, ...>
📝 Recent:  <last 3 commits subjects>
🎯 Intent:  <inferred from prompt or session>
```

If intent unclear: pause, ask one question, then proceed.

### Step 2: Match intent → tools

Use this decision tree (apply in order, stop at first match):

| Intent signal | Top recommendation | Backup |
|---|---|---|
| "build feature", "implement", "add" | planning-supreme → executing | brainstorming first if vague |
| "fix bug", "broken", "error" | debugging-supreme | claude-mem:mem-search first |
| "review", "PR", "merge" | code-review-supreme | github plugin for fetch |
| "simplify", "clean up", "refactor" | simplify-supreme | karpathy-guidelines applied auto |
| "deploy", "ship", "production" | superpowers:finishing-a-development-branch + vercel:deploy | verification-before-completion |
| "explore", "understand codebase" | graphify or claude-mem:smart-explore | grep-based for small repos |
| "what was I doing?" | claude-mem:mem-search + timeline-report | git log + git status |
| "create skill" | skill-creator | superpowers:writing-skills for guidelines |
| "merge skills", "fuse" | skill-fusion | plugin-fusion if plugins |
| "set up new project" | setup-project | init for CLAUDE.md only |
| "test this" | superpowers:test-driven-development | per-stack test runner |
| "speed up", "slow", "perf" | chrome-devtools-mcp:debug-optimize-lcp (web) | superpowers:systematic-debugging (other) |
| "configure", "settings", "hook" | update-config | fewer-permission-prompts for cleanup |
| "run repeatedly", "every N min" | loop (local) or schedule (remote) | ralph-loop for continuous |
| "no idea where to start" | superpowers:brainstorming | this skill (coach) recursive |

### Step 3: Stack-specific overlays

If detected stack matches, layer in relevant tier-2 plugins:

- **Vercel project**: prefer `vercel:nextjs`, `vercel:ai-sdk`, `vercel:bootstrap`, `vercel:deploy`
- **Stripe project**: `stripe:stripe-best-practices`, `stripe:stripe-projects`
- **Browser/web app**: `chrome-devtools-mcp:*`, `playwright`
- **HF/ML**: `huggingface-skills:*`
- **Claude API app**: `claude-api`, `agent-sdk-dev`
- **Frontend heavy**: `frontend-design`, `vercel:react-best-practices`, `vercel:shadcn`

### Step 4: Output ranked recommendations

Format (max 3-5 items):

```
🎯 Goal: <restated intent>

NEXT MOVES (ranked):

1. [HIGH] <skill-name>
   Why: <one-line justification>
   How: <exact phrase or command to invoke>

2. [MED] <skill-name>
   Why: <reason>
   How: <invocation>

3. [LOW] <skill-name>
   Why: <reason>
   How: <invocation>

💡 Tip: <stack-specific hint or memory recall if relevant>

Run #1 now? [y/N/which]
```

**Ranking criteria**:
- HIGH: directly addresses stated intent + matches context
- MED: useful prep step or alternative angle
- LOW: nice-to-have, broader/related

### Step 5: Auto-run mode (optional)

If user replies `y` / `1` / `run`:
- Invoke top recommendation via Skill tool (or run command via Bash)
- Brief confirmation: "Running <name>"
- Hand off to that skill

If user replies `2`, `3`: invoke that ranked option instead.

If user replies `N` / `no` / `skip`: stop, await new input.

If user asks "why" or "explain": expand justification of #1 in 2-3 sentences, ask again.

### Step 6: Mid-session check-ins

If session has been running long (multiple skill invocations) and user pauses:
- Offer summary: "So far we've X, Y, Z. Next would be W."
- Suggest checkpoint: commit, verify, code review

## Smart defaults by phase

If conversation length unclear, infer phase:

| Signal | Phase | Default suggestion |
|---|---|---|
| First message of session | Discovery | claude-mem:mem-search + setup-project if new project |
| 2-3 messages, no code yet | Planning | planning-supreme or brainstorming |
| Code being written | Building | superpowers:test-driven-development, karpathy-guidelines |
| "Done", "finished", "ready" | Verification | verification-before-completion → code-review-supreme |
| "PR", "merge", "deploy" | Shipping | github + finishing-a-development-branch + deploy |
| "Stuck", "doesn't work" | Debug | debugging-supreme |

## Rules

- **NEVER recommend more than 5** options. Decision fatigue defeats purpose.
- **Always include "How"** — exact phrase or command. User shouldn't have to figure invocation.
- **Acknowledge memory first**: if `claude-mem` has relevant prior work, lead with that
- **Stack-aware**: don't recommend Vercel skills if no vercel.json
- **Phase-aware**: don't suggest planning if user is mid-execution
- **Don't recommend self** — coach shouldn't recommend coach (avoid loops)
- **Be honest**: if no good match exists, say so + suggest improving context

## Edge cases

### User intent contradicts context
e.g., user says "deploy" but tests are failing.
→ Surface contradiction, recommend test-fix path FIRST, deploy after.

### No relevant skill exists
→ State clearly: "Nothing in stack directly matches. Options: 1) skill-creator to make one, 2) explore awesome-claude-code references, 3) describe more — I might be missing intent"

### Multiple skills equally relevant
→ Pick by:
1. Fusion skills > individual sources (less context switch)
2. Already-installed plugins > library repos
3. Tier 1 > Tier 2 > built-in

### User invokes coach repeatedly
→ Likely real problem isn't tool choice. Ask: "Are we stuck on a specific blocker, or unclear on goal?"

## Anti-patterns

- DON'T list every relevant skill — pick top 3-5
- DON'T say "you could try X or Y or Z" without ranking
- DON'T require user to read STACK.md — you read it for them
- DON'T recommend skills user disabled (check installed/active state)
- DON'T auto-run without explicit consent
- DON'T loop coach → coach → coach. Break out and ask user.

## Quick invocations

| User says | Coach output starts with |
|---|---|
| "/coach" | Full snapshot + 3 recommendations |
| "what skill for X" | Skip snapshot, direct match |
| "what next" | Inferred phase + 1-3 next steps |
| "estoy atorado" | Empathy + diagnostic question + recommendations |
| "I have X bugs / N PRs" | Triage suggestion |

## Output style

- Caveman mode active by default — terse, no filler
- Use icons sparingly (🎯, 💡, 📍 for headers)
- Tables when comparing 3+ items
- Code blocks for exact invocations
- Always end with action prompt ("Run #1? [y/N]")

## Sources of authority

When making recommendations, cite source briefly:
- "STACK.md says X for this case"
- "claude-mem found similar in <session>"
- "Tier 1 — siempre activa"

This builds user's mental model over time. Eventually user remembers without coach.

## Self-improvement

Coach should occasionally suggest stack improvements:
- "You've used <skill> 5 times — fusion candidate?"
- "Plugin X never triggered in 30 sessions — uninstall?"
- "Project lacks <bucket> — add to setup-project?"

These observations go into user-facing tips, not unilateral changes.

---

## PROACTIVE MODE — fire WITHOUT being asked

**Goal**: be a co-pilot, not a vending machine. Surface next move automatically when user finishes a milestone.

### Milestone signals (user just said one of these → trigger coach)

| User signal | Suggest |
|---|---|
| "ok done", "listo", "hecho", "termine" | code-review-supreme (self-review) → verification-before-completion |
| "tests pass", "all green", "passing" | code-review-supreme + commit prep |
| "implemented", "wrote the X", "added Y" | simplify-supreme (cleanup) → code-review-supreme |
| "fixed", "bug squashed", "works now" | regression test → commit |
| "committed", "git commit done" | gh pr create → code-review-supreme self-review pre-PR |
| "merged", "deployed", "shipped" | claude-mem capture lessons → next feature plan |
| "que sigue", "ahora qué", "what next" | full coach snapshot |
| "stuck", "atorado", "no funciona" | debugging-supreme |
| "scope creep", "added more than planned" | simplify-supreme + scope review |
| just wrote 3+ files in a turn | simplify-supreme + code-review-supreme |
| just deleted a lot of code | code-review-supreme (regression check) |
| started new file `*.test.*` | TDD discipline reminder |
| edited `package.json` deps | security review of new deps |
| edited `.env.*` | check `.gitignore` excludes it |
| created CLAUDE.md or SKILL.md | superpowers:writing-skills review |

### Proactive output format (compact, non-blocking)

```
✅ <what just happened, one line>

💡 Next move (suggested):
→ <skill-name>: <why> — say "<trigger>" or skip
```

Single line suggestion. User ignores or proceeds. Don't lecture. Don't run unless user confirms.

### When NOT to fire proactively

- User mid-typing a multi-step request (they already have plan)
- User explicitly says "don't suggest", "stop coaching", "let me think"
- Same suggestion already given in last 3 turns (don't repeat)
- User in middle of long debug session (let them focus)

### Best-practices repos awareness

Coach knows these repos exist and recommends consulting/installing when relevant:

| Situation | Repo to consult |
|---|---|
| New project, want CLAUDE.md template | `forrestchang/andrej-karpathy-skills` (already cloned at `~/.claude/claude-library/global/skills/andrej-karpathy-skills/`) |
| Looking for new skills/plugins | `hesreallyhim/awesome-claude-code` reference |
| RAG/agent app patterns | `Shubhamsaboo/awesome-llm-apps` |
| System prompt examples | `x1x9lol/system-prompts-and-models-of-ai-tools` |
| Want comprehensive AI dev harness alt | `affaan-m/everything-claude-code` (cloned, not installed) |
| Spec-driven dev system | `gsd-build/get-shit-done` (cloned, not installed) |
| Search 1400+ skills | `sickn33/antigravity-awesome-skills` |
| Multi-agent orchestration | `ruvnet/ruflo` or `multica-ai/multica` |

When suggesting these:
1. Mention: "There's a best-practices ref for this: <repo>"
2. If cloned in library: "Located at `~/.claude/claude-library/...`, want me to extract relevant skill?"
3. If not cloned: "Want me to clone for inspection?"
4. Don't auto-install — extract relevant pieces or use as reading reference

### Periodic check-ins

After every ~5 user turns OR major phase shift:
- "Stack health check: anything not working as expected?"
- "Memory check — should we run claude-mem to capture this session's learnings?"
- "Token budget — caveman compress old CLAUDE.md if growing?"

### Auto-run threshold

Default: never auto-run without confirmation.

If user grants "free run" mode (says "you can auto-run from now on" or sets in CLAUDE.md):
- Auto-run safe ops: read, search, lint, test, format
- Always confirm: write/edit code, commit, push, deploy, install
- Never auto-run: destructive (delete, force push, drop)

## Quick reference card (Cheatsheet hot table)

When in doubt fire this minimal table to user:

```
JUST DID            → SUGGEST
write code          → simplify-supreme + code-review-supreme
fix bug             → regression test
test pass           → commit
commit              → /pr or push
finish feature      → finishing-a-development-branch
deploy              → mem-search next priority
session start       → mem-search "<project>"
session end         → claude-mem capture
unsure              → /coach
```

---

## NATIVE CLAUDE CODE COMMANDS — when to prefer

Coach must consider native commands FIRST (lighter, no skill load) and recommend custom only when added value justifies it.

### Native vs custom decision rule

**Use NATIVE when**:
- Task is simple/one-off (not part of larger workflow)
- Time pressure (faster to invoke)
- User explicitly wants minimal output
- Output of native is sufficient for goal

**Use CUSTOM (supreme/skill) when**:
- Task is part of larger workflow (plan + execute + review pipeline)
- Need cross-skill orchestration (memory + plan + verify)
- Need depth (security checklist, regression test, attribution)
- User wants rigor over speed

### Native commands map

| Native command | What it does | Lighter than |
|---|---|---|
| `/init` | Generate CLAUDE.md from codebase | setup-project (no skill install) |
| `/review` | PR review (basic) | code-review-supreme (no security/receiving phase) |
| `/security-review` | Security scan pending changes | code-review-supreme (just security checklist) |
| `/memory` | Manage memory files | claude-mem (no cross-session DB) |
| `/compact` | Compact conversation context | caveman:compress (just compress current) |
| `/clear` | Clear context for new task | (no equivalent — destructive) |
| `/resume` | Resume past session | claude-mem:timeline-report |
| `/cost` | Show session cost | (utility) |
| `/status` | Session status | (utility) |
| `/help` | Built-in help | (no equivalent) |
| `/config` | Open settings | update-config (programmatic) |
| `/permissions` | Manage permissions | update-config |
| `/agents` | List subagents | (utility) |
| `/skill <name>` | Run specific skill | (utility — bypass auto-trigger) |
| `/hooks` | Hook info | (utility) |
| `/mcp` | MCP server status | (utility) |
| `/model` | Switch model | (utility) |
| `/upgrade` | Update Claude Code | (utility) |
| `/todos` | TodoWrite system | TaskCreate tool |
| `/save` | Save conversation | (utility) |
| `/export` | Export transcript | (utility) |
| `Shift+Tab` (twice) | Enter plan mode (read-only) | planning-supreme (no edits, lighter) |
| `Esc` | Cancel current generation | (utility) |
| `Ctrl+R` | Toggle verbose / log viewer | (utility) |

### Recommendation patterns

**Pattern: quick CLAUDE.md**
```
User: "este proyecto necesita CLAUDE.md"
Coach: /init (native, fast) — done in seconds.
       Want full setup? then /setup-project (installs skills too).
```

**Pattern: PR review depth**
```
User: "review PR 42"
Quick scan: /review
Production-ready: code-review-supreme (security + receiving + format)
Decision: ask user "quick or thorough?"
```

**Pattern: planning levels**
```
User: "necesito pensar antes de codear"
Light: Shift+Tab → plan mode (no skill, just read-only thinking)
Mid:   superpowers:writing-plans (no execution discipline)
Deep:  planning-supreme (memory + research + phased + verification)
Pick by task scope.
```

**Pattern: memory queries**
```
User: "ya hice algo así antes?"
Native: /memory (browse files)
Custom: claude-mem:mem-search (semantic, faster, cross-session)
Default: claude-mem (it's strictly better for this use case)
```

**Pattern: context bloat**
```
User: "ya pesa mucho la conversación"
Native: /compact (clean context)
Custom: caveman:compress on memory files
Decision: /compact for live convo, caveman:compress for persistent files
```

### "Ultra" naming convention

If user says "ultra X" or "X supremo" or "X max" — they're asking for the rigorous custom version (fusion or full skill), not the native quick version.

Examples:
- "ultra plan" → planning-supreme (not Shift+Tab plan mode, not /writing-plans alone)
- "review supreme" → code-review-supreme
- "debug max" → debugging-supreme

If user says just "review" or "plan" without modifier — surface BOTH options, let them pick speed vs depth.

### Plugin slash commands

Coach also knows plugin commands available via `/<plugin>:<cmd>`:

| Plugin command | Purpose |
|---|---|
| `/caveman` | Toggle caveman mode |
| `/caveman-help` | Show caveman quick reference |
| `/caveman-commit` | Generate compressed commit |
| `/caveman-review` | Compressed review output |
| `/caveman:compress <file>` | Compress memory file |
| `/code-review:code-review` | Plugin's PR review |
| `/ralph-loop:ralph-loop` | Start Ralph Loop |
| `/ralph-loop:cancel-ralph` | Stop Ralph Loop |
| `/skill-creator` | Plugin skill creation flow |
| `/vercel:deploy` | Deploy to Vercel |
| `/vercel:env` | Manage Vercel env vars |
| `/vercel:status` | Vercel project status |
| `/vercel:bootstrap` | Bootstrap Vercel project |
| `/vercel:marketplace` | Browse Vercel integrations |
| `/agent-sdk-dev:new-sdk-app` | New Claude SDK app |
| `/stripe:test-cards` | Stripe test cards |
| `/stripe:explain-error` | Decode Stripe error |
| `/claude-mem:mem-search` | Search memory |
| `/claude-mem:make-plan` | Phased plan with memory |
| `/claude-mem:do` | Execute phased plan |
| `/claude-mem:knowledge-agent` | Build knowledge brain |
| `/claude-mem:timeline-report` | Project journey report |
| `/claude-mem:smart-explore` | AST-based code search |
| `/claude-mem:version-bump` | Plugin versioning |
| `/superpowers:*` | All superpowers skills (use full name) |

### Order of recommendation

When ranking suggestions, prefer:
1. **Native simple command** if task fits (e.g., `/init` for CLAUDE.md only)
2. **Plugin command** if plugin has a dedicated slash for exact need
3. **Fusion (supreme) skill** if multi-aspect or rigor required
4. **Individual source skill** only if user explicitly wants a specific source's behavior

Don't recommend custom over native if native suffices — overhead defeats purpose.

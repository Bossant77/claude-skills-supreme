---
name: skill-fusion
description: Generate a unified "supreme" skill by fusing the best parts of multiple overlapping source skills. Use when the user says "fuse skills X Y Z", "merge skills", "make a supreme skill from X and Y", "/skill-fusion", "combine these skills", or asks to deduplicate/unify overlapping skills into one. Sources can be SKILL.md files, plugin skills (e.g. `superpowers:brainstorming`), or local skills in `~/.claude/skills/`.
type: meta
---

# skill-fusion

Synthesize a single unified skill from N overlapping source skills. Preserves unique value of each, removes duplication, attributes sources, makes output re-generatable when sources change.

## When to invoke

- User says "fuse <skill-list>", "merge skills", "supreme skill from X+Y", "/skill-fusion"
- User wants to reduce redundancy across overlapping skills
- User wants single best-of-breed skill replacing N alternatives
- After harvesting from multiple harnesses (everything-claude-code, gstack, get-shit-done, superpowers)

## Inputs

Accept one of:
- **Skill names**: `superpowers:writing-plans`, `claude-mem:make-plan`
- **File paths**: `~/.claude/plugins/cache/.../SKILL.md`
- **Library buckets**: `code-review`, `planning`, `debugging` (resolves to mapped skills)
- **Folder**: scan folder for all `SKILL.md`, fuse all

## Steps

### 1. Resolve sources

For each input, locate `SKILL.md`:
- Plugin skills → `~/.claude/plugins/cache/<marketplace>/<plugin>/skills/<name>/SKILL.md`
- Local skills → `~/.claude/skills/<name>/SKILL.md`
- Project skills → `./.claude/skills/<name>/SKILL.md`
- Library skills → `~/.claude/claude-library/global/skills/<repo>/skills/<name>/SKILL.md`

If not found: ask user for path.

### 2. Parse each source

Extract from frontmatter + body:
- `name`, `description`, `type`
- Trigger phrases (from description)
- Section headings (workflow steps)
- Concrete instructions
- Examples
- Edge cases / red flags
- Tradeoffs / warnings
- Code blocks / commands

### 3. Categorize content

For each piece, classify:
- **Unique** to one source → keep verbatim, attribute
- **Duplicate verbatim** across sources → keep once, attribute all
- **Conflicting** (sources disagree) → flag for user decision OR pick most rigorous version
- **Complementary** (different angles same topic) → merge into one section

### 4. Pick fusion name

Default: `<topic>-supreme` (e.g., `code-review-supreme`, `planning-supreme`).
User can override.

### 5. Synthesize unified SKILL.md

Structure:

```markdown
---
name: <fusion-name>
description: <merged trigger phrases from all sources, deduplicated>
type: fusion
sources:
  - name: <source-1-name>
    path: <source-1-path>
    fused_at: <YYYY-MM-DD>
  - name: <source-2-name>
    path: <source-2-path>
    fused_at: <YYYY-MM-DD>
generated_by: skill-fusion
generated_at: <YYYY-MM-DD>
---

# <Fusion Name>

<one-paragraph synthesis of purpose, drawing from all sources>

## When to invoke

<deduplicated trigger conditions from all sources>

## Workflow

<merged steps — best ordering, complementary content combined>

### Step 1: <topic>
<best instruction set, attributed where useful>

### Step 2: ...

## Principles (from <source>)

<unique principles section per source if substantive>

## Edge cases

<merged edge case list>

## Sources

This skill fuses:
- **<source-1>** (`<path>`) — <what it contributed>
- **<source-2>** (`<path>`) — <what it contributed>

To regenerate after sources change: `/skill-fusion refresh <fusion-name>`
```

### 6. Write output

Path: `~/.claude/claude-library/fusions/<fusion-name>/SKILL.md`

### 7. Activate

Ask user: "Activate now? Will copy to `~/.claude/skills/<fusion-name>/`."
On yes: `cp -r` (Windows) or symlink (Unix).

### 8. Register

Append entry to `~/.claude/claude-library/fusions/manifest.json`:

```json
{
  "<fusion-name>": {
    "sources": ["<source-1>", "<source-2>"],
    "generated_at": "<date>",
    "active": true,
    "library_path": "~/.claude/claude-library/fusions/<fusion-name>",
    "active_path": "~/.claude/skills/<fusion-name>"
  }
}
```

### 9. (Optional) Disable sources

Ask user: "Disable original sources to avoid double-trigger?"
On yes: rename/move source `SKILL.md` to `SKILL.md.disabled`. Document in manifest.
Default: leave sources active (user picks based on tier).

## Refresh mode

Invoked: `/skill-fusion refresh <name>` or "refresh fusion <name>".

1. Read manifest entry → get sources
2. Re-execute steps 2-5 with current source content
3. Diff against existing fusion file
4. Show diff to user
5. On confirm: overwrite

## Conflict resolution rules

When sources disagree:
- **Stricter wins**: if A says "always X", B says "sometimes X" → keep "always"
- **More specific wins**: if A is generic, B is specific → keep B
- **More recent wins** if dates known
- **Ask user** if material disagreement on philosophy

## Anti-patterns

- DON'T fuse skills with non-overlapping triggers (no benefit, hurts discoverability)
- DON'T fuse harnesses entire (use cherry-pick instead — too much surface)
- DON'T silently drop content; if cutting, note in fusion `## Cut from sources` section
- DON'T generate fusion bigger than longest source × 1.5

## Suggested initial fusions

Based on current library overlaps:

| Fusion name | Sources |
|---|---|
| `code-review-supreme` | code-review:code-review + superpowers:requesting-code-review + superpowers:receiving-code-review + caveman:caveman-review + built-in security-review |
| `planning-supreme` | superpowers:writing-plans + claude-mem:make-plan + superpowers:executing-plans + claude-mem:do |
| `debugging-supreme` | superpowers:systematic-debugging + chrome-devtools-mcp:troubleshooting + karpathy-guidelines |
| `simplify-supreme` | karpathy-guidelines + simplify (built-in) + code-simplifier:code-simplifier |
| `skill-creation-supreme` | skill-creator:skill-creator + superpowers:writing-skills |
| `memory-supreme` | claude-mem:mem-search + claude-mem:knowledge-agent + auto-memory built-in |
| `brainstorm-supreme` | superpowers:brainstorming + frontend-design:frontend-design (UI scope) |

## Notes

- Fusion does NOT modify or delete sources — purely additive
- Fusion is a regular skill — discoverable by Claude when triggers match
- Refresh fusions periodically when source skills update
- If fusion grows stale: re-run from scratch, don't patch

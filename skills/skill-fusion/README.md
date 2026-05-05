# skill-fusion

Generate unified "supreme" skills by fusing N source skills into one. Reads each source's `SKILL.md`, extracts triggers + instructions + examples, deduplicates, attributes, outputs new `SKILL.md`.

## Triggers

- "fuse skills X Y Z", "/skill-fusion"
- "merge skills", "combine these skills"
- "make a supreme skill from X and Y"

## Workflow

1. **Resolve sources** — locate each source's `SKILL.md`
2. **Parse** — frontmatter + body sections + triggers + examples
3. **Categorize** — unique / duplicate / conflicting / complementary
4. **Pick name** — default `<topic>-supreme`
5. **Synthesize** — unified `SKILL.md` with `sources:` frontmatter
6. **Write output** — `~/.claude/claude-library/fusions/<name>/`
7. **Activate** — copy to `~/.claude/skills/<name>/`
8. **Register** — manifest entry

## Refresh mode

When a source updates: `/skill-fusion refresh <fusion-name>` re-runs the synthesis with current source content, diffs, and offers to overwrite.

## Conflict resolution rules

When sources disagree:
- **Stricter wins** ("always X" > "sometimes X")
- **More specific wins** (specific > generic)
- **Ask user** if material philosophy disagreement

## Output format

```markdown
---
name: <fusion-name>
description: <merged trigger phrases>
type: fusion
sources:
  - name: <source-1>
    contributed: <what it brought>
  - name: <source-2>
    contributed: ...
generated_at: <YYYY-MM-DD>
generated_by: skill-fusion
---

[synthesized body]
```

## Used to create

The 4 validated fusions in this repo (code-review-supreme, planning-supreme, debugging-supreme, simplify-supreme) were all generated with this skill.

## Install

```bash
cp -r skill-fusion ~/.claude/skills/
```

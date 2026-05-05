---
name: skill-creation-supreme
description: Unified skill creation + maintenance pipeline. Use when user says "create skill", "new skill", "make a skill for X", "/skill-creator", "edit this skill", "improve trigger description", "add eval", "benchmark skill", or wants to author/optimize/test any SKILL.md. Combines skill-creator's templating + eval features with superpowers:writing-skills' guidelines and discipline.
type: fusion
sources:
  - name: skill-creator:skill-creator
    contributed: Templating, evals, benchmarking, description optimization
  - name: superpowers:writing-skills
    contributed: Guidelines, discipline, verification before deployment
generated_at: 2026-05-04
generated_by: skill-fusion
---

# Skill Creation — Supreme

Single skill for the full lifecycle of skill authoring: design → write → benchmark → ship → maintain.

## When to invoke

- User asks "create skill", "new skill", "make a skill for X", "/skill-creator"
- User asks to edit/improve existing skill
- User wants to optimize trigger description (low-recall skills)
- After designing a workflow that should be reusable
- After noticing a workflow you do repeatedly (candidate for skill)
- After fusion creation — verify quality before promoting

## Phase 1 — Decide if skill is justified

Not everything needs a skill. Reject the idea if:
- Trivial one-liner (just write inline)
- Already covered by existing skill (use that)
- Workflow is unstable / will change in days
- Only used once

Build the skill if:
- Workflow used 3+ times
- Has consistent structure
- Has non-obvious steps a fresh assistant would skip
- Encodes hard-won lessons (specific bug avoidance, security checklist)

## Phase 2 — Author SKILL.md

### Required structure

```markdown
---
name: <kebab-case-name>
description: <one-paragraph trigger description — see Phase 3>
type: <category — workflow / methodology / utility / meta>
---

# <Title>

<one-paragraph purpose>

## When to invoke

<concrete trigger scenarios + phrases>

## Workflow

<numbered steps, each with concrete action>

## Anti-patterns

<what NOT to do>

## Sources / Notes

<attribution if fused, references>
```

### Writing rules

- **Description must list trigger phrases** — Claude matches against these. Be exhaustive on synonyms ("debug", "fix bug", "broken", "not working", "/debug").
- **Body must be actionable** — every section answers "now what?", not "in theory".
- **Show formats explicitly** — code blocks for output formats, tables for decision matrices.
- **Anti-patterns section is mandatory** — failure modes must be named.
- **End with notes/sources** — accountability + future-update guidance.

### Common authoring mistakes

| Mistake | Fix |
|---|---|
| Vague description ("Use for tasks") | List 5+ specific phrases users would say |
| Body too theoretical | Replace philosophy with concrete steps |
| No examples | Add at least one `<input> → <output>` example |
| Missing anti-patterns | Add what to AVOID (failure modes from past) |
| Trigger conditions buried | Surface them in description AND first body section |
| One-shot writeup | Iterate after first real use — capture refinements |

## Phase 3 — Optimize trigger description (CRITICAL)

The description determines whether Claude SELECTS this skill. Bad description = skill never fires regardless of body quality.

### Trigger optimization protocol

1. **Brainstorm 10+ phrases users might say** that should fire this skill
2. **Include synonyms** — "test/debug/troubleshoot/fix" all map to debugging
3. **Include language variants** if multilingual — Spanish + English
4. **Include slash invocations** — `/skill-name` should appear
5. **Include indirect signals** — "I'm stuck", "broken", error messages
6. **Add proactive triggers** if applicable — "after writing code" type signals
7. **Negative signals** (when NOT to fire) reduce false-trigger noise

### Description anti-patterns

- "This skill helps with X" — passive, vague
- "When you need X" — too generic
- One-word triggers ("plan") — collides with everything

### Description template

```
<one-sentence purpose>. Use when user says "<phrase 1>", "<phrase 2>", ... or asks <conceptual scenario>. ALSO USE PROACTIVELY when <auto-trigger condition>. <Edge cases / what it's NOT for>.
```

## Phase 4 — Eval / benchmark before ship

For non-trivial skills, validate empirically before declaring done.

### Quick eval (5 min)

1. Run a sample task with the skill OFF (baseline)
2. Run same task with the skill ON
3. Compare: did the skill add measurable value?
4. If no measurable value: reject — don't ship vanity skills

### Rigorous eval (30 min)

Use the `skill-review` skill:
- 2-3 samples of varying difficulty
- Score: recall, format, time, tokens
- Compare against alternatives (sources if fusion, baseline always)

### Validation checklist

- [ ] Description triggers match real user phrasing (test with 3 phrasings)
- [ ] Body steps are concrete (no "consider X")
- [ ] Anti-patterns section exists
- [ ] Output format explicitly shown
- [ ] At least 1 example
- [ ] Run eval — measurable value vs baseline
- [ ] No conflict with existing skills (check for trigger overlap)

## Phase 5 — Ship

### Activation

```bash
# Library copy (canonical)
~/.claude/claude-library/<skill-name>/SKILL.md

# Active copy (loaded by Claude)
cp -r ~/.claude/claude-library/<skill-name> ~/.claude/skills/
```

### Registry update

Add entry to:
- `~/.claude/STACK.md` — categorize tier
- `~/.claude/claude-library/manifest.json` — if part of buckets
- Memory note via `claude-mem` — capture rationale

### Announce

If shared/team skill: notify users. Document trigger phrases.

## Phase 6 — Maintain

### Refresh triggers

- After 5+ uses, review: are descriptions accurate? Steps still right?
- If skill stops firing reliably → optimize description
- If skill produces wrong output → tighten body steps
- If sources change (for fusions) → `/skill-fusion refresh <name>`

### Retire criteria

- Hasn't fired in 90 days → remove or archive
- Better skill exists → deprecate, mark in description
- Workflow obsoleted → remove

## Phase 7 — Eval-driven optimization (advanced)

For skills that fire often but produce mixed results:

1. Run `skill-review` with multiple variants of the SAME skill (different descriptions, different body structure)
2. Score each on real samples
3. Adopt best-performing variant
4. A/B between iterations

This is iterative — skill evolves through measurement.

## Output formats by skill type

### Workflow skill
- Numbered phases
- Verification per phase
- Anti-patterns
- Edge cases

### Methodology skill (TDD, debugging)
- Principles section
- Step-by-step protocol
- When to deviate
- Failure modes

### Meta skill (skill-fusion, coach)
- Inputs accepted
- Process
- Output format
- Self-improvement loop

### Reference skill (cheat sheet)
- Tables of mappings
- Quick lookup format
- No workflow, just data

## Quick template generator

User says "create skill for X":

1. Ask clarifying:
   - What triggers it? (5+ phrases)
   - Is this workflow / methodology / meta / reference?
   - Is there overlap with existing skill?
   - Will you eval it after?

2. Generate skeleton in `~/.claude/claude-library/<name>/SKILL.md`

3. Walk through Phase 2-4 interactively

4. Activate in Phase 5

## Anti-patterns (skill creation)

- DON'T create skill for one-off task
- DON'T copy existing skill description verbatim (collision risk)
- DON'T write 1000-line skill body — Claude won't read it efficiently
- DON'T skip eval before ship
- DON'T use vague trigger phrases ("when relevant")
- DON'T forget to attribute fusion sources
- DON'T leave skills active that haven't fired in 90 days

## Sources

This skill fuses:
- **skill-creator** — templating + eval + description optimization features
- **superpowers:writing-skills** — guidelines + discipline + verification

Refresh: `/skill-fusion refresh skill-creation-supreme`

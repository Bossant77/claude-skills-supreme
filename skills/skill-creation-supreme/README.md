# skill-creation-supreme

Full skill authoring lifecycle: design → write → benchmark → ship → maintain. Combines skill-creator's templating + eval features with superpowers:writing-skills' guidelines.

## Triggers

- "create skill", "new skill", "/skill-creator"
- "make a skill for X"
- "edit this skill", "improve trigger description"
- "add eval", "benchmark skill"

## 7-phase lifecycle

1. **Decide** — is skill justified? (3+ uses? non-obvious workflow? otherwise skip)
2. **Author** — required structure (frontmatter + when-to-invoke + workflow + anti-patterns)
3. **Optimize trigger description** — CRITICAL (10+ phrases, synonyms, slash commands)
4. **Eval** — quick (5 min) or rigorous (skill-review, 30 min)
5. **Ship** — copy to active skills + register in manifest
6. **Maintain** — review after 5+ uses, refresh fusions when sources change
7. **Eval-driven optimization** — A/B variants, adopt best

## Decision matrix per skill type

| Type | Output structure |
|---|---|
| Workflow | numbered phases + verification + edge cases |
| Methodology (TDD, debugging) | principles + protocol + when to deviate |
| Meta (orchestrators) | inputs + process + output format + self-improvement |
| Reference | tables of mappings, no workflow |

## Sources fused

- `skill-creator:skill-creator` — templating + evals + description optimization
- `superpowers:writing-skills` — guidelines + discipline

## Validation checklist

Before shipping:
- [ ] Description triggers match real user phrasing (test 3 phrasings)
- [ ] Body steps are concrete (no "consider X")
- [ ] Anti-patterns section exists
- [ ] Output format explicitly shown
- [ ] At least 1 example
- [ ] Run eval — measurable value vs baseline
- [ ] No conflict with existing skills (check trigger overlap)

## Anti-patterns

- DON'T create skill for one-off task
- DON'T copy existing description verbatim (collision)
- DON'T write 1000-line bodies (Claude won't read efficiently)
- DON'T skip eval before ship
- DON'T use vague trigger phrases ("when relevant")

## Install

```bash
cp -r skill-creation-supreme ~/.claude/skills/
```

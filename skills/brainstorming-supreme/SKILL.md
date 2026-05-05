---
name: brainstorming-supreme
description: You MUST use this before any creative or UI work — creating features, building components, designing pages, adding functionality, or modifying behavior. Combines requirement-discovery dialogue with bold aesthetic direction-setting. Triggers - "brainstorm", "design this", "build a component/page/app", "plan a feature", "make UI for X", "/brainstorm", "help me think through X", or any creative-frontend request before implementation.
type: fusion
sources:
  - name: superpowers:brainstorming
    contributed: HARD-GATE discipline, one-question-at-a-time discovery loop, 2-3-approaches comparison, scope/decomposition test, design-doc + spec self-review, visual companion protocol, YAGNI, isolation/clarity principles, existing-codebase guidance
  - name: frontend-design:frontend-design
    contributed: bold aesthetic direction commitment, tone palette enumeration, typography/color/motion/spatial/atmosphere guidelines, anti-AI-slop rules, vary-across-generations rule, match-complexity-to-vision principle
generated_at: 2026-05-05
generated_by: skill-fusion
---

# Brainstorming Supreme

Turn raw ideas into approved designs and — when UI is involved — into a committed aesthetic direction, before any code is written. Fuses requirement-discovery dialogue with bold visual direction-setting so a single brainstorm produces both a structural spec and a distinctive design point-of-view.

<HARD-GATE>
Do NOT write code, scaffold a project, invoke an implementation skill, or take any implementation action until you have presented a design AND (when UI is involved) committed to an aesthetic direction AND the user has approved both. Applies to EVERY project regardless of perceived simplicity.
</HARD-GATE>

## When to invoke

- User asks to build a feature, component, page, application, utility, or interface
- User says "brainstorm", "design this", "spec this out", "plan a feature", "help me think through X", "make UI for X", "build a landing page", "/brainstorm"
- Any creative work: new functionality, modifying behavior, adding features
- Any frontend work: components, pages, applications, design systems
- Before invoking any implementation skill (writing-plans, mcp-builder, etc.)

Anti-pattern: "this is too simple to need a design." Every project goes through this. A todo list, a single-function utility, a config change — all of them. Simple projects are where unexamined assumptions cause the most wasted work. The design can be short (a few sentences), but you MUST present it and get approval.

## Workflow

### Phase 1 — Explore project context

- Check files, docs, recent commits, existing patterns
- For existing codebases: follow existing patterns; include targeted improvements only where they serve the current goal; don't propose unrelated refactoring
- Scope check: if the request describes multiple independent subsystems ("a platform with chat, billing, analytics"), flag immediately. Help decompose into sub-projects, then brainstorm the first sub-project. Each sub-project gets its own spec → plan → implementation cycle.

### Phase 2 — Offer Visual Companion (UI/visual work only)

When upcoming questions will involve mockups, layouts, or diagrams, offer the visual companion **as its own message, with no other content**:

> "Some of what we're working on might be easier to explain if I can show it to you in a web browser. I can put together mockups, diagrams, comparisons, and other visuals as we go. This feature is still new and can be token-intensive. Want to try it? (Requires opening a local URL)"

Wait for the user's answer. Per-question rule afterwards: would the user understand this better by *seeing* than *reading*? Mockups, wireframes, layout comparisons → browser. Requirement questions, tradeoffs, A/B/C/D text options → terminal.

### Phase 3 — Clarifying questions

- One question per message. Never bundle.
- Prefer multiple choice; open-ended is fine when needed.
- Focus on: purpose, audience, constraints, success criteria, differentiation ("what's the one thing someone will remember?").
- Be flexible — go back and re-clarify when something doesn't make sense.

### Phase 4 — Aesthetic direction (UI work only)

Before proposing approaches, commit to a BOLD aesthetic direction. Pick an extreme and execute it with precision:

- brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian — or design one true to the project.

Bold maximalism and refined minimalism both work. The key is intentionality, not intensity. Vary between light/dark, fonts, and aesthetics across projects — never converge on common defaults (Space Grotesk, purple-on-white, Inter everywhere).

### Phase 5 — Propose 2-3 approaches

- Lead with your recommendation and reasoning
- Present trade-offs conversationally
- For UI: each approach can include a distinct aesthetic angle

### Phase 6 — Present design

Cover, scaled to complexity (a few sentences for simple, 200-300 words for nuanced):

- Architecture, components, data flow, error handling, testing
- For UI: typography pairing (distinctive display + refined body), color palette (dominant + sharp accents, CSS variables), motion strategy (one well-orchestrated high-impact moment beats scattered micro-interactions), spatial composition (asymmetry / overlap / negative space / grid-breaking), atmosphere (gradient meshes, noise, geometric patterns, layered transparencies, dramatic shadows, custom cursors, grain overlays — not solid-color defaults)
- Design for isolation: each unit has one clear purpose, well-defined interfaces, can be understood and tested independently. If you can't change internals without breaking consumers, boundaries need work.
- Match implementation complexity to aesthetic vision: maximalist needs elaborate code; minimalist needs restraint and precision

Ask after each section whether it looks right so far.

### Phase 7 — Write design doc

- Save to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` (user preferences override default)
- Include both structural spec AND aesthetic direction (tone, typography, palette, motion principles)
- Commit to git

### Phase 8 — Spec self-review (fix inline, don't re-loop)

1. **Placeholder scan** — any TBD/TODO/vague requirements? Fix.
2. **Internal consistency** — sections contradict? Architecture matches features?
3. **Scope check** — focused enough for one plan, or needs decomposition?
4. **Ambiguity check** — any requirement readable two ways? Pick one, make it explicit.
5. **Aesthetic specificity** (UI only) — is the direction concrete enough that someone could execute it without inventing taste? "Modern and clean" fails. "Brutalist editorial — Times-style serif headlines, mono captions, hairline rules, ink-on-newsprint palette, no rounded corners" passes.

### Phase 9 — User reviews spec

> "Spec written and committed to `<path>`. Please review it and let me know if you want to make any changes before we start writing out the implementation plan."

Wait. If changes requested, make them and re-run Phase 8. Only proceed once approved.

### Phase 10 — Transition to implementation

Invoke `planning-supreme` (or `writing-plans` if planning-supreme not available). That is the ONLY next skill. Do not jump directly into building components or scaffolding.

## Key principles

- **One question at a time** — don't overwhelm
- **Multiple choice preferred** when possible
- **YAGNI ruthlessly** — remove unnecessary features from every design
- **Explore alternatives** — always 2-3 approaches before settling
- **Incremental validation** — present, approve, move on
- **Bold over bland** — pick an extreme aesthetic and execute with precision; refusal to commit is the most common failure mode in UI work
- **Intentionality over intensity** — minimal can be as bold as maximal if every choice is deliberate
- **Match complexity to vision** — maximalist designs need elaborate code; minimalist needs restraint
- **Vary across projects** — never converge on default fonts/palettes/layouts

## Anti-patterns

- DON'T write code or scaffold before design approval (HARD-GATE)
- DON'T ask multiple questions in one message
- DON'T combine the visual-companion offer with any other content — it must be its own message
- DON'T propose unrelated refactoring; stay focused on the goal
- DON'T skip the design step because the project "feels simple"
- DON'T default to generic AI aesthetics: Inter / Roboto / Arial / system fonts, purple gradients on white, rounded-rect cookie-cutter cards, evenly distributed timid palettes, predictable hero-feature-CTA layouts
- DON'T converge across generations — Space Grotesk + purple gradient is a smell, not a style
- DON'T default to solid-color backgrounds when atmosphere (gradient mesh, noise, texture, layered transparencies) would serve the aesthetic
- DON'T propose a vague aesthetic ("modern", "clean", "professional") — those are non-decisions; pick a real direction
- DON'T invoke a downstream implementation skill other than `planning-supreme` / `writing-plans` after brainstorming concludes

## Sources

This skill fuses:

- **superpowers:brainstorming** — Discovery process, HARD-GATE discipline, one-question-at-a-time loop, 2-3-approaches comparison, scope/decomposition test, design-doc + spec self-review pipeline, visual companion protocol, YAGNI and isolation principles, existing-codebase guidance, terminal-state rule.
- **frontend-design:frontend-design** — Bold aesthetic direction commitment, tone-palette enumeration, typography/color/motion/spatial/atmosphere guidelines, anti-AI-slop rules, vary-across-generations rule, match-complexity-to-vision principle.

To regenerate after sources change: `/skill-fusion refresh brainstorming-supreme`

## Notes on fusion

- The original `frontend-design` skill is an *implementation* skill (writes code). In this fusion its principles are folded **upstream** into design/spec time, so the aesthetic direction is committed and approved before any code is written. Implementation still happens via planning-supreme → execute, applying the captured aesthetic spec.
- `brainstorming` originally forbade invoking `frontend-design` as a next step. That rule is preserved in spirit: this fusion's terminal state remains planning-supreme/writing-plans. The frontend-design content is consumed, not chained to.

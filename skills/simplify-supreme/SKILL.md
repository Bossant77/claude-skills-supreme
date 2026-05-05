---
name: simplify-supreme
description: Unified simplification + cleanup skill. Use when user says "simplify", "clean up", "refactor", "/simplify", "remove duplication", "DRY this", or after writing code to review for simplicity. Combines Karpathy principles, built-in simplify mechanic, and code-simplifier patterns.
type: fusion
sources:
  - name: karpathy-guidelines
    contributed: Principles - simplicity first, no speculative code, no premature abstraction
  - name: built-in:simplify
    contributed: Review changed code for reuse/quality/efficiency
  - name: code-simplifier:code-simplifier
    contributed: Cleanup patterns
generated_at: 2026-05-04
generated_by: skill-fusion
---

# Simplify — Supreme

Single skill: review code → identify excess → remove → preserve behavior.

## When to invoke

- User says "simplify", "clean up", "refactor for clarity", "/simplify"
- After writing new code (auto self-review)
- Before committing — last-pass cleanup
- Code review shows complexity smell
- Refactor request

## Core principle (Karpathy)

**Minimum code that solves the problem. Nothing speculative.**

Every line must justify existence. If unsure → delete and see what breaks.

## Phase 1 — Scope the simplification

Define exactly what's in scope:
- Just the recent diff?
- One function?
- One file?
- A whole module?

**Don't** silently expand scope. Refactoring everything = unrelated changes in one diff = bad PR.

## Phase 2 — Read the code

Before simplifying, understand:
- What does it do? (output)
- What's the contract? (inputs, side effects)
- What tests cover it? (regression safety net)
- What calls it? (blast radius of changes)

If no tests exist for non-trivial code → write tests FIRST, then simplify.

## Phase 3 — Identify excess (checklist)

Apply each:

### Speculative features
- [ ] Code paths for "future" use cases — DELETE
- [ ] Configurable options never configured — INLINE the default
- [ ] Abstraction for single concrete use — INLINE
- [ ] "Flexibility" not currently used — DELETE
- [ ] Generic interface with one impl — make concrete

### Defensive bloat
- [ ] try/catch around impossible exceptions — DELETE
- [ ] Null checks for values that can't be null per type — DELETE
- [ ] Validation duplicated at every layer (validate at boundary only) — REMOVE inner
- [ ] Default values for required params — REMOVE default, require it
- [ ] Fallback for case that's already an error elsewhere — DELETE

### Duplication
- [ ] Same logic in 3+ places — extract helper (less than 3 → leave inline)
- [ ] Same string/magic number repeated — constant
- [ ] Copy-pasted with one variable change — parameter

### Dead code
- [ ] Unused imports — DELETE
- [ ] Unused variables — DELETE
- [ ] Unreachable branches — DELETE
- [ ] Functions never called — DELETE (after grep verifies)
- [ ] Commented-out code — DELETE (use git history)

### Comment noise
- [ ] Comments explaining WHAT (code already says) — DELETE
- [ ] Outdated comments — UPDATE or DELETE
- [ ] TODO comments unactioned > 3 months — file as issue or DELETE
- [ ] License headers in every file — keep only if required

### Naming
- [ ] `data`, `info`, `temp`, `result` for non-trivial values — RENAME to meaning
- [ ] Abbreviations unclear — EXPAND
- [ ] Inconsistent naming for same concept across files — UNIFY
- [ ] Hungarian notation — REMOVE (modern languages have types)

### Function size
- [ ] Function > 30 lines doing one thing — fine, keep
- [ ] Function > 30 lines doing 3+ things — SPLIT by responsibility
- [ ] Function with 5+ params — group into object or split

### Indirection
- [ ] Wrapper functions that just delegate — INLINE
- [ ] Class with one method that's just `execute()` — make a function
- [ ] `getX() { return this.x; }` boilerplate — make field public if language supports

## Phase 4 — Apply changes (carefully)

Order:
1. **Test baseline**: run tests, all pass
2. **One change at a time**: don't bundle
3. **Run tests after each change**: catch regressions immediately
4. **Commit each logical step** if changes are large
5. **If test breaks**: revert that change, understand why

If can't simplify without breaking tests → behavior wasn't what you thought. Re-read.

## Phase 5 — When NOT to simplify

Don't simplify if:
- Tests don't cover the area (write tests first)
- Code is hot path optimized for perf (clarity loss intentional)
- "Duplication" is coincidental (same shape, different reason — will diverge)
- Pattern is well-known idiom in this codebase (consistency > local optimum)
- You don't understand why it's written that way (Chesterton's fence)

## Phase 6 — Verify equivalence

After simplification:
1. All tests pass (same set as before)
2. No new tests added (would mean behavior changed)
3. Diff stat shows net deletion (expected for simplification)
4. Performance benchmark same (if perf-sensitive code)
5. Manual smoke if UI/integration

If any of above off: behavior changed. Either revert or own the behavior change explicitly.

## Anti-patterns

- DON'T simplify code without tests covering it
- DON'T bundle simplification with feature work
- DON'T remove "weird" code without understanding why it exists
- DON'T over-DRY (early premature abstraction)
- DON'T over-engineer "clean" architecture for simple problem
- DON'T add comments to explain code you should rename instead
- DON'T leave commented-out code "just in case"

## Special cases

### Tests
Same rules apply but be even stricter:
- Repetitive test setup → fixture/factory
- Multi-assertion tests → split per assertion (clarity > test count)
- Don't DRY tests too aggressively — they should be readable in isolation

### Configuration / DSL
Simplification often means:
- Remove unused config keys
- Default values made explicit
- Schema validation at load (fail fast)

### Frontend components
- Component > 200 lines → split
- Props > 7 → group or split
- Inline styles for one-off vs design system token — prefer token if reusable

## Sources

- **karpathy-guidelines** — principles
- **simplify** (built-in) — review mechanic
- **code-simplifier** plugin — cleanup patterns

Refresh: `/skill-fusion refresh simplify-supreme`

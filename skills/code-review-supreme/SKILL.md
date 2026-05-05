---
name: code-review-supreme
description: Unified code review pipeline. Use when user says "review this PR", "code review", "review the diff", "/review", "security review", or asks for any code/PR/security review. Covers full lifecycle - requesting review, performing review, receiving feedback, security scanning, output formatting.
type: fusion
sources:
  - name: code-review:code-review
    contributed: PR-fetch + diff orchestration
  - name: superpowers:requesting-code-review
    contributed: When/how to ask for review, completion criteria
  - name: superpowers:receiving-code-review
    contributed: Process incoming feedback rigorously, technical verification before agreement
  - name: caveman:caveman-review
    contributed: Output format - one-line per comment, location/problem/fix
  - name: built-in:security-review
    contributed: Security vulnerability scanning of pending changes
  - name: built-in:review
    contributed: PR review baseline
generated_at: 2026-05-04
generated_by: skill-fusion
---

# Code Review — Supreme

Single skill covering the entire review lifecycle: request → perform → format → receive feedback → security check.

## When to invoke

- User says: "review", "code review", "PR review", "review the diff", "review my changes", "security review", "/review", "/security-review"
- Before merging, after completing major feature, before commit
- When receiving review feedback from others
- When writing PR description / requesting review from teammates
- After staging changes (auto-trigger via caveman:review)

## Phase 1 — Requesting review (your code)

**Pre-check before requesting**:
1. All tests pass (run them — don't claim, verify)
2. Implementation matches plan/spec
3. No half-done work, no TODOs left
4. Diff is focused (one logical change, not bundled refactors)
5. Commit messages clear

**Write request**:
- One-paragraph summary: WHAT changed + WHY
- Link spec/issue if exists
- Flag risky areas explicitly ("touches auth middleware — please verify session handling")
- Note testing done (manual + automated)
- List anything intentionally NOT done (defer/follow-up)

## Phase 2 — Performing review (their code)

Order:
1. **Read PR description first** — context before code
2. **Check tests** — do they exist? do they cover the change?
3. **Read diff once end-to-end** — get shape before nitpicking
4. **Re-read with focus on**: correctness, edge cases, security, naming, dead code
5. **Run code locally** if non-trivial — don't trust the diff

**Comment format** (caveman style):
```
<file:line> — <problem> — <fix>
```
Examples:
```
src/auth.ts:42 — token expiry uses < not <= — change to <=, off-by-one allows expired token
src/db.ts:101 — SQL string concat — use parameterized query, injection risk
src/utils.ts:15 — function unused — delete
```

One line per comment. No essay. Severity prefix optional: `[BLOCKER]`, `[NIT]`, `[Q]`.

**Severity rubric**:
- `BLOCKER` — must fix before merge (security, correctness, broken tests)
- `MAJOR` — should fix (design problem, performance, missing test)
- `NIT` — style/preference (won't block)
- `Q` — clarification ask, not action

## Phase 3 — Security review specifically

Trigger: user says "security review", or PR touches auth/crypto/SQL/file IO/network/secrets.

Checklist (apply only relevant):
- **Input validation**: all external input (user, API, file) validated at boundary?
- **SQL/NoSQL injection**: parameterized queries? no string concat with input?
- **XSS**: output sanitized in HTML/JS contexts?
- **Auth/Authz**: every protected endpoint checks auth? authz checked AFTER auth?
- **Secrets**: no API keys/passwords in code, logs, error messages?
- **Crypto**: standard libs only? no custom crypto? proper random for tokens?
- **File operations**: path traversal prevented? content-type validated?
- **Dependencies**: new deps audited? lockfile updated?
- **Error handling**: errors don't leak stack traces / internals to users?
- **Rate limiting**: endpoints with cost or auth attempts limited?
- **CSRF**: state-changing routes protected?
- **Logging**: no PII / secrets logged?

Output security findings same format: `<file:line> — <issue> — <fix>` with `[SEC-CRIT]`, `[SEC-HIGH]`, `[SEC-LOW]`.

## Phase 4 — Receiving review feedback (your PR)

**Don't blindly agree. Don't reflexively defend either.**

Per comment:
1. **Understand**: re-read your code through reviewer's eyes. Do you see what they see?
2. **Verify technical claim**: if reviewer says "this is wrong because X" — test X. They might be right, might be wrong, might be partially right.
3. **Decide**:
   - Agree + fix → make change, push, mark resolved
   - Disagree + reason → respond with evidence (test, doc, link), keep discussion
   - Defer → "agree but out of scope, tracking in #123"
4. **Don't say "good catch!" reflexively** — performative agreement wastes everyone's time

**Red flags reviewer made mistake**:
- Cite repo convention you don't recognize → check git log, ask for example
- Suggest pattern that doesn't fit context → ask "would this work given X constraint?"
- Demand premature abstraction → push back unless 3+ duplications exist

## Phase 5 — Closing review

Reviewer:
- All BLOCKERs resolved → approve
- BLOCKERs remain → request changes with specific list
- Only NITs left → approve with note "addressed nits in follow-up OK"

Author:
- Squash if many "fix typo" commits, otherwise keep history
- Update PR description if scope changed
- Tag follow-up issues for deferred work

## Tools / commands available

| Need | Tool |
|---|---|
| Fetch PR | `gh pr view <num>` |
| Fetch diff | `gh pr diff <num>` |
| Local checkout | `gh pr checkout <num>` |
| Comment on line | `gh api repos/o/r/pulls/N/comments -f ...` |
| Approve | `gh pr review <num> --approve --body "..."` |
| Request changes | `gh pr review <num> --request-changes --body "..."` |
| Security scan | run `gh api`+ check Anthropic security action if configured |

## Anti-patterns

- DON'T review without running tests first
- DON'T leave essay comments — terse, actionable
- DON'T approve "to be nice" if BLOCKERs exist
- DON'T fix author's code yourself in review (suggest, don't write)
- DON'T security-review only when keyword "security" appears — always run security checklist on auth/crypto/SQL/IO touches
- DON'T accept reviewer feedback without verification (technical rigor)

## Sources

This skill fuses:
- **code-review:code-review** — PR mechanics
- **superpowers:requesting-code-review** — completion criteria, request hygiene
- **superpowers:receiving-code-review** — verify-before-agree, technical rigor
- **caveman:caveman-review** — terse output format
- **built-in security-review** — security checklist
- **built-in review** — baseline PR review

Refresh: `/skill-fusion refresh code-review-supreme`

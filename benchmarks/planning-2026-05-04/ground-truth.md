# Ground Truth — multi-tenant migration plan

Score by what a senior plan WOULD include.

## Required phases (ground truth — 8 items)

| # | Phase / element | Why it matters |
|---|---|---|
| 1 | Data model: tenants table + tenant_users join table | Decouples auth user from tenant |
| 2 | RLS policy update: scope by tenant_id, not customer_id | Security boundary |
| 3 | Backfill: existing customer rows become tenants of size 1 | Preserves prod data, no breakage |
| 4 | Auth flow: invite link + accept flow + role assignment | Core feature |
| 5 | Roles enforcement (admin/member/viewer) at API + UI | Permission model |
| 6 | Stripe: link subscription to tenant, not user; preserve existing sub IDs | Billing constraint |
| 7 | API backwards-compat layer for 3 integrations | Constraint: no break |
| 8 | Rollback plan: feature flag + reversible migrations | Constraint: rollback required |

## Required risks/constraints surfaced (5 items)

| # | Risk |
|---|---|
| 1 | RLS policy bug = cross-tenant data leak — needs e2e test per role |
| 2 | Migration timing — production load during backfill |
| 3 | Existing webhooks/API integrations may use user_id as tenant proxy — audit needed |
| 4 | Invite email deliverability + token expiry security |
| 5 | 2-week deadline tight; identify cuts vs must-haves |

## Required out-of-scope mentions (3 items)

| # | OOS |
|---|---|
| 1 | SSO / SAML — defer to later |
| 2 | Per-tenant theming/branding — defer |
| 3 | Per-user usage metering — defer |

## Required open questions (3 items)

| # | Question |
|---|---|
| 1 | How are existing 50 single-user accounts notified of change? |
| 2 | What happens to invited users if subscription lapses? |
| 3 | Per-role limits on Stripe? |

## Score rubric

- **Completeness**: phases-found / 8 + risks-found / 5 + oos-found / 3 + questions-found / 3
- **Verifiability**: each phase has explicit "verification" or "done criteria"
- **Phasing quality**: phases are atomic, ordered, dependencies clear
- **Constraint-aware**: surfaces all 4 stated constraints (no data drop, Stripe IDs, API compat, rollback)
- **Realism**: 2-week timeline assessed honestly (not assumed feasible)

## Anti-patterns

- Generic "implement multi-tenant" without surfacing this app's specifics
- Skipping backfill plan
- Skipping API compat plan
- Not surfacing RLS policy as critical
- Not flagging deadline risk
- Recommending complete Stripe rebuild (violates constraint)
- One-shot plan with no phases / verification gates

# Spec to plan

## Context

Existing single-tenant SaaS app in production:
- **Stack**: Next.js 16 (App Router), Supabase (Postgres + Auth), Stripe (subscriptions), Vercel deploy
- **Customers**: ~50 active small businesses, growing
- **Auth**: Supabase Auth, one user account per company currently
- **Data**: Each customer has their own row-level `customer_id` foreign key on most tables

## Request

Add **multi-tenant support**:
- Customers want to invite team members under their account
- Team members should see only their company's data
- Owner can manage roles (admin / member / viewer)
- Existing single-user customers must keep working without breakage
- Billing stays per-company (one Stripe subscription per tenant, not per user)

## Constraints

- Cannot drop production data
- Cannot change Stripe product structure (sub IDs already issued)
- Cannot break existing API consumers (3 customers have integrations)
- Need rollback path
- Must ship in 2 weeks (legal/compliance reason — pending tenant on enterprise plan)

## Make a plan

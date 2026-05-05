# Spec to plan — sample 2

## Context

Mobile app (React Native + Expo + Supabase) currently English-only. 200 active users, mostly Mexico.

## Request

Add **internationalization (i18n)** with:
- Spanish (default for new users in Mexico)
- English (fallback)
- Locale auto-detect from device
- User can override in settings
- All UI strings, dates, numbers, currencies localized
- Server-side responses also localized (errors, emails)

## Constraints

- Cannot break existing English-only users
- Push notifications must be in user's chosen language
- Stripe receipts (handled by Stripe) — don't fight Stripe templating
- Existing 200 users must default to current behavior; locale change is opt-in for them, opt-out (default Spanish) for new
- Must support over-the-air language updates (no app store re-release per language change)
- 3-week deadline

## Make a plan

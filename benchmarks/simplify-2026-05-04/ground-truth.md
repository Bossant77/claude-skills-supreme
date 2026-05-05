# Ground Truth — orderProcessor.ts (simplify)

12 known simplification opportunities planted.

| # | Category | Issue | Location |
|---|---|---|---|
| 1 | Speculative | `ORDER_VERSION` const exported but only used internally | line 22 |
| 2 | Indirection | `process()` wrapper that only delegates to `processOrder()` | lines 35-37 |
| 3 | Defensive bloat | null checks on TypeScript-typed non-null params (3x) | lines 41-49 |
| 4 | Defensive bloat | nested null checks on item/qty/price inside loop (typed) | lines 56-62 |
| 5 | Bad naming | `temp` for subtotal — rename | lines 53,56,etc |
| 6 | Bad naming | generic `data: any` — type properly | line 54 |
| 7 | Magic numbers | tax rates 0.08/0.0875/0.08875/0.13 — extract constants | lines 67-78 |
| 8 | Magic numbers | shipping thresholds 50/100/250 and prices — extract | lines 81-89 |
| 9 | Dead code | commented-out oldTaxRate "just in case" | lines 92-93 |
| 10 | Dead code | `orderHash` computed, never used | lines 96-97 |
| 11 | Dead code | `legacyValidate` never called | lines 117-119 |
| 12 | Error swallowing | try/catch swallowing cache.set error silently | lines 100-104 |

Also valid extras (not GT but legitimate):
- `==` should be `===` (lines 41, 47, 56, etc)
- `let` could be `const` for taxRate, shippingCost
- `info: "processed"` always same string — magic value
- for loop could be reduce/map+sum
- `metadata?: any` typed as any — remove or specify
- `cache: Map<string, any>` — should be Map<string, OrderCacheEntry>

Total: 12 GT + ~6 legitimate extras

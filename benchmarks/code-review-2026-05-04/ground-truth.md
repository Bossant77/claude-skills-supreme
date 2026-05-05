# Ground Truth — test-auth.ts

12 known issues planted. Used to score reviewer recall/precision.

| # | Severity | Issue | Location |
|---|---|---|---|
| 1 | SEC-CRIT | SQL injection in findUserByEmail | line 14 |
| 2 | SEC-HIGH | Timing attack (== compare on password hash) | line 23 |
| 3 | SEC-HIGH | Returning passwordHash in user object | line 24 |
| 4 | SEC-CRIT | MD5 for password hashing | line 22 |
| 5 | PERF | N+1 query loop | lines 30-33 |
| 6 | SEC-CRIT | SQL injection in getUserRoles | line 32 |
| 7 | NIT | Defensive null check on typed param | line 39 |
| 8 | NIT | Unused parameter userAgent | line 38 |
| 9 | MAJOR | Misleading name validate (mutates) | lines 38-44 |
| 10 | NIT | Dead code legacyHashWithSalt | lines 47-49 |
| 11 | NIT | Magic number 7 | line 53 |
| 12 | MAJOR | try/catch swallowing error silently | lines 57-61 |

Total: 12 issues
- 4 SEC-CRIT/HIGH
- 1 PERF
- 2 MAJOR
- 5 NIT

Scoring rubric for reviewers:
- Recall: found / 12
- Critical recall: found-critical / 4
- Precision: true-positives / total-flagged
- Severity accuracy: matched-severity-labels / found
- Format: terse + actionable (each comment has location + problem + fix)

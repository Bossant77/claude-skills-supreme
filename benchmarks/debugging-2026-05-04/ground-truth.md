# Ground Truth — rateLimiter.ts (debugging)

## Root cause

**Race condition** between `await this.logAccess()` and `if (bucket.tokens >= 1) { bucket.tokens = bucket.tokens - 1 }`.

Sequence that breaks:
1. Concurrent caller A reads `bucket.tokens = 10`, awaits logAccess
2. Concurrent caller B reads same bucket, sees `tokens = 10`, awaits logAccess
3. ... 99 more concurrent callers all read `tokens = 10` before any decrement happens
4. All resolve from logAccess, all see `>= 1`, all decrement
5. Final state: bucket.tokens = -89 (or some negative), but ALL 100 returned `true`

The `await` in middle of read-modify-write makes operation non-atomic. Multiple awaits can interleave on same bucket.

## Fix (minimal)

Move the token check + decrement BEFORE the `await this.logAccess()`:

```typescript
public async allow(userId: string): Promise<boolean> {
  let bucket = this.buckets.get(userId);
  if (!bucket) {
    bucket = { tokens: this.maxTokens, lastRefill: Date.now() };
    this.buckets.set(userId, bucket);
  }

  const now = Date.now();
  const elapsedMs = now - bucket.lastRefill;
  const tokensToAdd = (elapsedMs / 1000) * this.refillRate;
  bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;

  // synchronous decision BEFORE await
  if (bucket.tokens < 1) {
    return false;
  }
  bucket.tokens = bucket.tokens - 1;
  const decision = true;

  // log AFTER decision is final - fire and forget OK
  await this.logAccess(userId, bucket.tokens);
  return decision;
}
```

Alternative fixes (also acceptable):
- Use mutex/lock per userId
- Atomic compare-and-swap
- Move refill+check into atomic transaction

## Severity

CRITICAL — rate limiter that doesn't limit defeats its purpose. In production: DDoS amplification, abuse vectors, billing exploits.

## Regression test

```typescript
it('rejects burst beyond maxTokens', async () => {
  const limiter = new TokenBucketRateLimiter(10, 1);
  const results = await Promise.all(
    Array.from({length: 100}).map(() => limiter.allow('user-1'))
  );
  expect(results.filter(r => r).length).toBe(10);
});
```

## Score criteria for reviewers

- ✅ Identified ROOT CAUSE = race condition / non-atomic read-modify-write across await
- ✅ Identified that `await logAccess` between read and decrement is the gap
- ✅ Fix preserves intent (logging) but moves it out of critical section
- ✅ Notes severity / production impact
- ✅ Provides regression test or test strategy

Bonus points:
- Mentions general pattern (await between get/set on shared state)
- Mentions alternative fixes (mutex, CAS)
- Notes that single-process Node is single-threaded but await still yields

## Anti-patterns to avoid

- Symptom-fix: bumping maxTokens (doesn't address race)
- Adding try/catch (doesn't fix logic)
- Recommending Redis without explaining why local fix is broken
- "Add a lock" without specifying scope

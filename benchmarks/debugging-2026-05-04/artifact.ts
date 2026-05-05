// rateLimiter.ts - has subtle bugs. Tests fail intermittently.
// DO NOT FIX - benchmark sample

interface BucketState {
  tokens: number;
  lastRefill: number;
}

export class TokenBucketRateLimiter {
  private buckets: Map<string, BucketState> = new Map();
  private maxTokens: number;
  private refillRate: number; // tokens per second

  constructor(maxTokens: number, refillRate: number) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
  }

  // Returns true if request allowed, false if rate-limited.
  // Reported bug: occasionally allows MORE than maxTokens requests in a burst.
  // Reproduction: 100 concurrent calls with same userId for fresh user.
  // Test:
  //   const limiter = new TokenBucketRateLimiter(10, 1);
  //   const results = await Promise.all(
  //     Array.from({length: 100}).map(() => limiter.allow('user-1'))
  //   );
  //   const allowed = results.filter(r => r).length;
  //   // EXPECTED: 10
  //   // ACTUAL: sometimes 12, 14, 17 (varies per run)
  public async allow(userId: string): Promise<boolean> {
    let bucket = this.buckets.get(userId);

    if (!bucket) {
      bucket = { tokens: this.maxTokens, lastRefill: Date.now() };
      this.buckets.set(userId, bucket);
    }

    // refill tokens based on time passed
    const now = Date.now();
    const elapsedMs = now - bucket.lastRefill;
    const tokensToAdd = (elapsedMs / 1000) * this.refillRate;
    bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    // simulate async DB write of audit log
    await this.logAccess(userId, bucket.tokens);

    if (bucket.tokens >= 1) {
      bucket.tokens = bucket.tokens - 1;
      return true;
    }
    return false;
  }

  private async logAccess(userId: string, tokensRemaining: number): Promise<void> {
    // pretend this is a DB call
    await new Promise(resolve => setTimeout(resolve, 1));
  }
}

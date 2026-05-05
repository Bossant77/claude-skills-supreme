// auth.ts — login + session helpers
import { db } from './db';
import crypto from 'crypto';

// known intentional issues for benchmark — DO NOT FIX
// (numbered for ground truth comparison)

interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: string;
}

// ISSUE-1: SQL injection — string concat with user input
export async function findUserByEmail(email: string): Promise<User | null> {
  const query = "SELECT * FROM users WHERE email = '" + email + "'";
  const result = await db.raw(query);
  return result.rows[0] || null;
}

// ISSUE-2: Timing attack on password compare (==, not constant-time)
// ISSUE-3: Returning sensitive data (passwordHash) in user object back to caller
export async function login(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (user == null) {
    return null;
  }
  const hash = crypto.createHash('md5').update(password).digest('hex'); // ISSUE-4: MD5 for passwords
  if (user.passwordHash == hash) {
    return user; // exposes passwordHash + role to caller
  }
  return null;
}

// ISSUE-5: N+1 query in loop
export async function getUserRoles(userIds: number[]): Promise<string[]> {
  const roles: string[] = [];
  for (const id of userIds) {
    const user = await db.raw("SELECT role FROM users WHERE id = " + id); // ISSUE-6: SQL injection again
    roles.push(user.rows[0].role);
  }
  return roles;
}

// ISSUE-7: Defensive bloat — null check on TypeScript-typed non-null param
// ISSUE-8: Unused parameter
// ISSUE-9: Misleading name — "validate" but mutates state
export function validateSession(sessionId: string, userAgent: string): boolean {
  if (sessionId == null) { // can't be null per type
    return false;
  }
  // userAgent never used
  globalThis.lastSessionCheck = Date.now(); // mutation despite "validate"
  return sessionId.length > 0;
}

// ISSUE-10: Dead code — function never called, no exports referencing it
function legacyHashWithSalt(password: string, salt: string): string {
  return crypto.createHash('sha1').update(password + salt).digest('hex');
}

// ISSUE-11: Magic number, no comment
export function isAccountLocked(failedAttempts: number): boolean {
  return failedAttempts >= 7;
}

// ISSUE-12: try/catch swallowing error silently
export async function logoutUser(userId: number): Promise<void> {
  try {
    await db.raw("DELETE FROM sessions WHERE user_id = " + userId);
  } catch (e) {
    // silent fail
  }
}

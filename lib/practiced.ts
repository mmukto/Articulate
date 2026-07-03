import { DRILL_INDEX } from "./course";

// Server-authoritative record of which drills a user has practiced. It lives in
// Clerk `privateMetadata.practiced` (server-only, so users can't tamper with it —
// unlike client progress in unsafeMetadata). Plans are non-refundable; this
// exists as a trustworthy usage record independent of client-writable progress.
//
// Storage is a bitset (one bit per drill, indexed by DRILL_INDEX) encoded as
// base64 — ~94 bytes for 750 drills, far under any metadata size limit. We only
// ever set bits and only read the popcount, so adding drills later never lowers
// a user's count.

const PRACTICED_KEY = "practiced";

function decode(value: unknown): Uint8Array {
  if (typeof value !== "string" || value.length === 0) return new Uint8Array(0);
  try {
    return new Uint8Array(Buffer.from(value, "base64"));
  } catch {
    return new Uint8Array(0);
  }
}

function popcount(bytes: Uint8Array): number {
  let count = 0;
  for (let i = 0; i < bytes.length; i++) {
    let b = bytes[i];
    while (b) {
      b &= b - 1;
      count++;
    }
  }
  return count;
}

function readBits(privateMetadata: unknown): Uint8Array {
  return decode((privateMetadata as { practiced?: unknown } | undefined)?.[PRACTICED_KEY]);
}

/** Number of distinct drills the user has practiced (server-authoritative). */
export function practicedCount(privateMetadata: unknown): number {
  return popcount(readBits(privateMetadata));
}

/**
 * Mark a drill as practiced. Returns the new base64 bitset and whether anything
 * changed (false if it was already set or the drill id is unknown), so callers
 * can skip a redundant metadata write.
 */
export function markPracticed(
  privateMetadata: unknown,
  moduleSlug: string,
  drillId: string,
): { value: string; changed: boolean } {
  const bits = readBits(privateMetadata);
  const current = Buffer.from(bits).toString("base64");

  const idx = DRILL_INDEX.get(`${moduleSlug}/${drillId}`);
  if (idx === undefined) return { value: current, changed: false };

  const byteIdx = idx >> 3;
  const mask = 1 << (idx & 7);
  if (byteIdx < bits.length && (bits[byteIdx] & mask) !== 0) {
    return { value: current, changed: false }; // already counted
  }

  const out = new Uint8Array(Math.max(bits.length, byteIdx + 1));
  out.set(bits);
  out[byteIdx] |= mask;
  return { value: Buffer.from(out).toString("base64"), changed: true };
}

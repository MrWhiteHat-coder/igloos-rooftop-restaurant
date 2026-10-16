// Alphabet without ambiguous characters (no I, O, 1, 0) for easy read-back on the phone.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Generates a booking reference like "IGL-241016-7K3M".
 * Uniqueness is ultimately enforced by a UNIQUE constraint in the bookings
 * table on `booking_reference`; the SQL RPC retries with a fresh suffix on
 * the (astronomically unlikely) collision.
 */
export function generateBookingReference(now: Date = new Date()): string {
  const y = String(now.getFullYear()).slice(2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += ALPHABET[cryptoRandomInt(ALPHABET.length)];
  }
  return `IGL-${y}${m}${d}-${suffix}`;
}

function cryptoRandomInt(maxExclusive: number): number {
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    const limit = Math.floor(0xffffffff / maxExclusive) * maxExclusive;
    const buf = new Uint32Array(1);
    let v: number;
    do {
      globalThis.crypto.getRandomValues(buf);
      v = buf[0]!;
    } while (v >= limit); // rejection sampling to avoid modulo bias
    return v % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}

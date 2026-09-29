import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * A single shared password, and a signed cookie once you are in.
 *
 * Deliberately small: this guards a guest list for one wedding, not a bank.
 * What it does do properly — constant-time comparison so the password cannot
 * be guessed a character at a time, an HMAC-signed token so the cookie cannot
 * be forged, an expiry, and httpOnly so no script can read it.
 */

export const COOKIE = "wedding_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

const PASSWORD = process.env.ADMIN_PASSWORD ?? "";
/** Falls back to the password so there is one less thing to configure. */
const SECRET = process.env.ADMIN_SESSION_SECRET || PASSWORD;

export const adminConfigured = PASSWORD.length >= 8;

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  // Compare a constant-length digest so length itself leaks nothing.
  const ah = createHmac("sha256", SECRET).update(ab).digest();
  const bh = createHmac("sha256", SECRET).update(bb).digest();
  return timingSafeEqual(ah, bh);
}

export function passwordMatches(candidate: string) {
  if (!adminConfigured) return false;
  return safeEqual(candidate, PASSWORD);
}

export function makeToken() {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function tokenValid(token: string | undefined) {
  if (!token || !adminConfigured) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (sign(payload) !== signature) return false;
  return Number(payload) > Date.now();
}

export async function isSignedIn() {
  const jar = await cookies();
  return tokenValid(jar.get(COOKIE)?.value);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};

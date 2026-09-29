import { NextResponse } from "next/server";
import { COOKIE, adminConfigured, cookieOptions, makeToken, passwordMatches } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A few attempts a minute, per address. */
const tries = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (tries.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  tries.set(ip, recent);
  if (tries.size > 200) tries.clear();
  return recent.length > 8;
}

export async function POST(request: Request) {
  if (!adminConfigured) {
    return NextResponse.json(
      { ok: false, error: "Set ADMIN_PASSWORD (8 characters or more) first." },
      { status: 503 }
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (tooMany(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Wait a minute." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    ({ password } = (await request.json()) as { password?: string } as { password: string });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  if (!passwordMatches(password ?? "")) {
    return NextResponse.json({ ok: false, error: "That is not the password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, makeToken(), cookieOptions);
  return res;
}

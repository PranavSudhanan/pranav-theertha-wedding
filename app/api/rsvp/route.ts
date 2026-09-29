import { NextResponse } from "next/server";
import {
  emailHtml,
  emailSubject,
  emailText,
  type Rsvp,
} from "@/lib/rsvp-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Where responses land. Server-side only — this file is never sent to the
 * browser, so the address is not published on the page.
 */
const TO = process.env.RSVP_TO_EMAIL || "ls.pranav.36@gmail.com";
const FROM = process.env.RSVP_FROM_EMAIL || "Wedding RSVP <onboarding@resend.dev>";
const RESEND_KEY = process.env.RESEND_API_KEY;
const WEBHOOK = process.env.RSVP_WEBHOOK_URL;

type Payload = {
  name?: string;
  phone?: string;
  email?: string;
  attending?: string;
  days?: string;
  guests?: string;
  side?: string;
  message?: string;
  submittedAt?: string;
  website?: string; // honeypot — real guests never see this field
};

const clean = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/* ---- a small throttle, so nothing can flood the inbox ---- */
const seen = new Map<string, number[]>();
const WINDOW = 60_000;
const LIMIT = 6;

function tooMany(key: string) {
  const now = Date.now();
  const recent = (seen.get(key) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  seen.set(key, recent);
  if (seen.size > 500) seen.clear(); // never let the map grow unbounded
  return recent.length > LIMIT;
}

async function sendEmail(r: Rsvp): Promise<boolean> {
  if (!RESEND_KEY) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        subject: emailSubject(r),
        html: emailHtml(r),
        text: emailText(r),
        // So a reply goes straight back to the guest.
        ...(r.email ? { reply_to: r.email } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[RSVP] resend rejected", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[RSVP] resend failed", err);
    return false;
  }
}

async function sendWebhook(r: Rsvp): Promise<boolean> {
  if (!WEBHOOK) return false;
  try {
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r),
    });
    if (!res.ok) console.error("[RSVP] webhook responded", res.status);
    return res.ok;
  } catch (err) {
    console.error("[RSVP] webhook failed", err);
    return false;
  }
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  // A bot filled the field no human can see. Accept quietly, deliver nothing.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (tooMany(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many responses, please wait a minute." },
      { status: 429 }
    );
  }

  const rsvp: Rsvp = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    attending: clean(body.attending, 40),
    days: clean(body.days, 160),
    guests: clean(body.guests, 20),
    side: clean(body.side, 60),
    message: clean(body.message, 1000),
    submittedAt: clean(body.submittedAt, 40) || new Date().toISOString(),
  };

  if (!rsvp.name || !rsvp.phone || !rsvp.attending) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 422 }
    );
  }

  // Always leave a trace in the Vercel runtime logs, whatever else happens.
  console.log("[RSVP]", JSON.stringify(rsvp));

  const configured = [RESEND_KEY, WEBHOOK].filter(Boolean).length;
  const [emailed, hooked] = await Promise.all([
    sendEmail(rsvp),
    sendWebhook(rsvp),
  ]);

  if (configured === 0) {
    console.warn(
      "[RSVP] No RESEND_API_KEY and no RSVP_WEBHOOK_URL set — this response " +
        "exists only in these logs. See README section 4."
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  if (!emailed && !hooked) {
    // Everything that was set up failed. Say so, so the guest can try again.
    return NextResponse.json(
      { ok: false, error: "Could not deliver" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}

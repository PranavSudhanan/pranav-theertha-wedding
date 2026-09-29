/**
 * The notification email, in the site's own colours.
 *
 * Written as tables with inline styles on purpose — Gmail, Outlook and the
 * rest strip <style> blocks and have no idea what flexbox is. Web fonts are
 * not loaded either, so this leans on Georgia, which is everywhere.
 *
 * Every field stacks — label above value — rather than sitting in a
 * two-column table. A long value (a list of both days, a paragraph of a
 * message) can then never push the layout wider than the phone it is being
 * read on. Nothing carries a fixed pixel width; the card is 100% wide up to
 * a 560px ceiling.
 */

export type Rsvp = {
  name: string;
  phone: string;
  email: string;
  attending: string;
  days: string;
  guests: string;
  side: string;
  message: string;
  submittedAt: string;
};

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const istTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

export function emailSubject(r: Rsvp) {
  return `RSVP: ${r.name} — ${r.attending}${r.guests ? ` (${r.guests})` : ""}`;
}

/** Anything long and unbroken (an email address, a URL) must be able to wrap. */
const WRAP =
  "word-break:break-word;overflow-wrap:break-word;-ms-word-break:break-all;";

export function emailHtml(r: Rsvp) {
  const yes = /accept/i.test(r.attending);
  const accent = yes ? "#17372b" : "#7b1f3d";

  const field = (label: string, value: string, last = false) =>
    value
      ? `<tr><td style="padding:14px 0;${
          last ? "" : "border-bottom:1px solid #eadfc7;"
        }">
  <div style="color:#a67c34;font:11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:2.5px;text-transform:uppercase;padding-bottom:5px">${esc(
    label
  )}</div>
  <div style="color:#17372b;font:17px/1.5 Georgia,'Times New Roman',serif;${WRAP}">${esc(
    value
  )}</div>
</td></tr>`
      : "";

  return `<!doctype html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
</head>
<body style="margin:0;padding:0;background:#f7f1e8;${WRAP}">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f7f1e8;">
<tr><td align="center" style="padding:20px 12px;">

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:560px;background:#fcf9f4;border:1px solid #e0cfa8;">

  <tr><td align="center" style="padding:30px 22px 22px;border-bottom:1px solid #eadfc7;">
    <div style="color:#a67c34;font:11px/1.5 Helvetica,Arial,sans-serif;letter-spacing:4px;text-transform:uppercase;">A response has arrived</div>
    <div style="margin:12px 0 0;color:#17372b;font:25px/1.3 Georgia,'Times New Roman',serif;${WRAP}">${esc(
      r.name
    )}</div>
    <div style="margin-top:13px;">
      <span style="display:inline-block;padding:7px 15px;border:1px solid ${accent};color:${accent};font:11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:2.5px;text-transform:uppercase;">${esc(
        r.attending
      )}</span>
    </div>
  </td></tr>

  <tr><td style="padding:4px 22px 22px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
      ${field("Phone", r.phone)}
      ${field("Email", r.email)}
      ${field("Attending", r.days)}
      ${field("Guests", r.guests)}
      ${field("Side", r.side)}
      ${field("Message", r.message)}
      ${field("Received", istTime(r.submittedAt), true)}
    </table>
  </td></tr>

  <tr><td align="center" style="padding:16px 22px 24px;border-top:1px solid #eadfc7;color:#6d6458;font:12px/1.7 Helvetica,Arial,sans-serif;">
    Pranav &amp; Theertha &nbsp;&middot;&nbsp; 15 . 11 . 2026<br>${
      r.email
        ? "Reply to this email and it goes straight to them."
        : "No email given — reach them on the number above."
    }
  </td></tr>

</table>

</td></tr></table>
</body></html>`;
}

export function emailText(r: Rsvp) {
  return [
    `RSVP from ${r.name}`,
    r.attending,
    "",
    `Phone:     ${r.phone}`,
    r.email ? `Email:     ${r.email}` : "",
    r.days ? `Attending: ${r.days}` : "",
    r.guests ? `Guests:    ${r.guests}` : "",
    r.side ? `Side:      ${r.side}` : "",
    r.message ? `Message:   ${r.message}` : "",
    `Received:  ${istTime(r.submittedAt)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

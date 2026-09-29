"use client";

import { couple, party, site, venue, wedding } from "@/lib/config";
import { CalendarIcon } from "./Ornaments";

const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

type Which = "wedding" | "party" | "both";

const names = `${couple.groom.full} & ${couple.bride.full}`;

/** The muhurtham — a timed event with a day-before reminder. */
function weddingEvent(stamp: string) {
  return [
    "BEGIN:VEVENT",
    `UID:muhurtham-${wedding.icsStart}@pranav-theertha`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${wedding.icsStart}`,
    `DTEND:${wedding.icsEnd}`,
    `SUMMARY:${esc(`${names} — Wedding`)}`,
    `DESCRIPTION:${esc(
      `Muhurtham ${wedding.muhurtham}. Please be seated by 9:45 AM. ${site.url}`
    )}`,
    `LOCATION:${esc(venue.address)}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:The wedding is tomorrow",
    "END:VALARM",
    "END:VEVENT",
  ];
}

/**
 * The party. All-day until a time is set in lib/config.ts — better an honest
 * all-day entry than a time we invented.
 */
function partyEvent(stamp: string) {
  const timed = Boolean(party.icsStart && party.icsEnd);
  const nextDay = String(Number(party.icsDate) + 1);

  return [
    "BEGIN:VEVENT",
    `UID:party-${party.icsDate}@pranav-theertha`,
    `DTSTAMP:${stamp}`,
    ...(timed
      ? [`DTSTART:${party.icsStart}`, `DTEND:${party.icsEnd}`]
      : [
          `DTSTART;VALUE=DATE:${party.icsDate}`,
          `DTEND;VALUE=DATE:${nextDay}`,
        ]),
    `SUMMARY:${esc(`${names} — ${party.label}`)}`,
    `DESCRIPTION:${esc(`${party.blurb} ${site.url}`)}`,
    `LOCATION:${esc(party.venue.address)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
  ];
}

export default function CalendarButton({
  className = "btn btn-ghost",
  label = "Add to calendar",
  which = "both",
}: {
  className?: string;
  label?: string;
  which?: Which;
}) {
  const download = () => {
    const stamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

    const events = [
      ...(which === "party" || which === "both" ? partyEvent(stamp) : []),
      ...(which === "wedding" || which === "both" ? weddingEvent(stamp) : []),
    ];

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Pranav and Theertha//Wedding//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      ...events,
      "END:VCALENDAR",
    ].join("\r\n");

    const file =
      which === "party"
        ? "pranav-theertha-wedding-party.ics"
        : which === "wedding"
          ? "pranav-theertha-muhurtham.ics"
          : "pranav-theertha-wedding.ics";

    const url = URL.createObjectURL(
      new Blob([ics], { type: "text/calendar;charset=utf-8" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    // suppressHydrationWarning, here and on the other form controls:
    // password managers and autofill extensions stamp their own attribute
    // (fdprocessedid) onto buttons and inputs before React hydrates, which
    // React then reports as a mismatch. The markup we send is identical
    // either way — this only stops someone else's extension from throwing
    // an error in the console.
    <button
      suppressHydrationWarning
      type="button"
      className={className}
      onClick={download}
    >
      <CalendarIcon />
      {label}
    </button>
  );
}

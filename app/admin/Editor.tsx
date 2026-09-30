"use client";

import { Fragment, useState } from "react";
import type { Content, Design, Photo } from "@/lib/content-types";
import GalleryEditor from "./GalleryEditor";
import PhotoField from "./PhotoField";

/* Which fields to show, and how. Everything is reachable from here — the
   forms are generated from this description rather than hand-written, so
   adding a field later is one line. */

type Field = { key: string; label: string; long?: boolean; check?: boolean; photo?: boolean };
type Group = { title: string; path: string; fields: Field[] };
type ListGroup = { title: string; path: keyof Content; fields: Field[]; addLabel: string };

const GROUPS: Group[] = [
  {
    title: "The two of you",
    path: "couple.groom",
    fields: [
      { key: "first", label: "First name" },
      { key: "full", label: "Full name" },
      { key: "parents", label: "Parents" },
      { key: "parentLabel", label: "Relation label" },
      { key: "initial", label: "Initial" },
      { key: "home", label: "Home town" },
    ],
  },
  {
    title: "The bride",
    path: "couple.bride",
    fields: [
      { key: "first", label: "First name" },
      { key: "full", label: "Full name" },
      { key: "parents", label: "Parents" },
      { key: "parentLabel", label: "Relation label" },
      { key: "initial", label: "Initial" },
      { key: "home", label: "Home town" },
    ],
  },
  {
    title: "The wedding day",
    path: "wedding",
    fields: [
      { key: "dateISO", label: "Date & time (ISO, drives the countdown)" },
      { key: "dateLong", label: "Date, long" },
      { key: "dateWords", label: "Date, in words" },
      { key: "year", label: "Year, in words" },
      { key: "dateShort", label: "Date, short" },
      { key: "muhurtham", label: "Muhurtham" },
      { key: "icsStart", label: "Calendar start (UTC)" },
      { key: "icsEnd", label: "Calendar end (UTC)" },
    ],
  },
  {
    title: "Ceremony venue",
    path: "venue",
    fields: [
      { key: "name", label: "Name" },
      { key: "locality", label: "Locality" },
      { key: "city", label: "City" },
      { key: "region", label: "Region" },
      { key: "mapsUrl", label: "Google Maps link", long: true },
    ],
  },
  {
    title: "The party",
    path: "party",
    fields: [
      { key: "label", label: "Name of the event" },
      { key: "dateLong", label: "Date, long" },
      { key: "dateShort", label: "Date, short" },
      { key: "time", label: "Time" },
      { key: "icsDate", label: "Calendar date (YYYYMMDD)" },
      { key: "icsStart", label: "Calendar start (UTC)" },
      { key: "icsEnd", label: "Calendar end (UTC)" },
      { key: "blurb", label: "Description", long: true },
    ],
  },
  {
    title: "Party venue",
    path: "party.venue",
    fields: [
      { key: "name", label: "Name" },
      { key: "locality", label: "Locality" },
      { key: "city", label: "City" },
      { key: "region", label: "Region" },
      { key: "mapsUrl", label: "Google Maps link", long: true },
    ],
  },
  {
    title: "Together",
    path: "couple",
    fields: [{ key: "hashtag", label: "Hashtag" }],
  },
  {
    title: "Where you met",
    path: "met",
    fields: [
      { key: "place", label: "City" },
      { key: "when", label: "When" },
    ],
  },
  {
    title: "Blessing",
    path: "blessing",
    fields: [
      { key: "shloka", label: "Shloka (Devanagari)", long: true },
      { key: "roman", label: "Transliteration", long: true },
      { key: "gloss", label: "Translation", long: true },
      { key: "eyebrow", label: "Eyebrow" },
      { key: "quote", label: "Closing line", long: true },
    ],
  },
  {
    title: "Contact",
    path: "contact",
    fields: [
      { key: "whatsapp", label: "WhatsApp (digits, with country code)" },
      { key: "whatsappName", label: "Whose WhatsApp" },
      { key: "altPhone", label: "Other phone" },
      { key: "altPhoneName", label: "Whose phone" },
      { key: "email", label: "Email" },
    ],
  },
  {
    title: "Heading — Our Story",
    path: "headings.story",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "title", label: "Title" },
      { key: "lede", label: "Lead-in", long: true },
    ],
  },
  {
    title: "Heading — Celebration",
    path: "headings.celebration",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "title", label: "Title" },
      { key: "lede", label: "Lead-in", long: true },
    ],
  },
  {
    title: "Heading — Gallery",
    path: "headings.gallery",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "title", label: "Title" },
      { key: "lede", label: "Lead-in", long: true },
    ],
  },
  {
    title: "Heading — Venues",
    path: "headings.venue",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "title", label: "Title" },
      { key: "lede", label: "Lead-in", long: true },
    ],
  },
  {
    title: "Heading — RSVP",
    path: "headings.rsvp",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "title", label: "Title" },
      { key: "lede", label: "Lead-in", long: true },
    ],
  },
  {
    title: "Heading — Questions",
    path: "headings.faq",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "title", label: "Title" },
      { key: "lede", label: "Lead-in", long: true },
    ],
  },
  {
    title: "Opening screen",
    path: "hero",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "dayOne", label: "First day, short" },
      { key: "dayTwo", label: "Second day, short" },
      { key: "muhurtham", label: "Word for the ceremony" },
      { key: "scroll", label: "Scroll cue" },
    ],
  },
  {
    title: "Countdown",
    path: "countdown",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "note", label: "Note — {muhurtham}", long: true },
      { key: "before", label: "Evening before — {partyDate} {partyTime} {partyVenue} {partyLocality}", long: true },
      { key: "unitDays", label: "Days" },
      { key: "unitHours", label: "Hours" },
      { key: "unitMinutes", label: "Minutes" },
      { key: "unitSeconds", label: "Seconds" },
      { key: "saveDate", label: "Button" },
      { key: "pastEyebrow", label: "After the wedding — eyebrow" },
      { key: "pastTitle", label: "After the wedding — title — {groom} {bride}" },
      { key: "pastNote", label: "After the wedding — note", long: true },
    ],
  },
  {
    title: "Celebration labels",
    path: "celebration",
    fields: [
      { key: "dayOne", label: "First day" },
      { key: "dayTwo", label: "Second day" },
      { key: "muhurtham", label: "Ceremony title" },
      { key: "timeTba", label: "When no time is set" },
      { key: "addParty", label: "Add-the-party button" },
      { key: "addBoth", label: "Add-both-days button" },
      { key: "directions", label: "Directions button" },
      { key: "directionsMuhurtham", label: "Directions to the ceremony" },
    ],
  },
  {
    title: "Venue tags",
    path: "venueLabels",
    fields: [
      { key: "saturday", label: "First day tag" },
      { key: "sunday", label: "Second day tag" },
      { key: "muhurtham", label: "Ceremony name" },
    ],
  },
  {
    title: "Invitation labels",
    path: "invitationLabels",
    fields: [
      { key: "date", label: "Date" },
      { key: "muhurtham", label: "Muhurtham" },
      { key: "venue", label: "Venue" },
    ],
  },
  {
    title: "RSVP form — fields",
    path: "rsvpForm",
    fields: [
      { key: "nameLabel", label: "Name label" },
      { key: "namePlaceholder", label: "Name placeholder" },
      { key: "phoneLabel", label: "Phone label" },
      { key: "phonePlaceholder", label: "Phone placeholder" },
      { key: "emailLabel", label: "Email label" },
      { key: "emailPlaceholder", label: "Email placeholder" },
      { key: "attendingLabel", label: "Attending question" },
      { key: "accepts", label: "Accepting option" },
      { key: "declines", label: "Declining option" },
      { key: "daysLabel", label: "Which days question" },
      { key: "guestsLabel", label: "How many question" },
      { key: "guestOptions", label: "How many — options, comma separated", long: true },
      { key: "sideLabel", label: "Whose guest question" },
      { key: "sideNone", label: "Prefer not to say" },
      { key: "sideBoth", label: "Both sides" },
      { key: "messageLabel", label: "Message label" },
      { key: "messagePlaceholder", label: "Message placeholder" },
      { key: "submit", label: "Send button" },
      { key: "sending", label: "While sending" },
      { key: "retry", label: "After a failure" },
      { key: "hint", label: "Hint under the button" },
    ],
  },
  {
    title: "RSVP form — after sending",
    path: "rsvpForm",
    fields: [
      { key: "thanksTitle", label: "Thank-you title — {name}" },
      { key: "thanksBody", label: "Thank-you body — {date}", long: true },
      { key: "thanksCopy", label: "When a copy was emailed — {email}", long: true },
      { key: "download", label: "Download button" },
      { key: "shareSelf", label: "Send-to-myself button" },
      { key: "another", label: "Another response button" },
      { key: "sayHello", label: "WhatsApp button" },
    ],
  },
  {
    title: "RSVP form — when something goes wrong",
    path: "rsvpForm",
    fields: [
      { key: "errorTitle", label: "Failure title" },
      { key: "errorBody", label: "Failure message", long: true },
      { key: "errorWhatsapp", label: "Fallback, with WhatsApp", long: true },
      { key: "errorCall", label: "Fallback, without WhatsApp", long: true },
      { key: "errName", label: "Missing name" },
      { key: "errPhone", label: "Missing phone" },
      { key: "errEmail", label: "Bad email" },
      { key: "errAttending", label: "No answer chosen" },
    ],
  },
  {
    title: "Navigation labels",
    path: "navLabels",
    fields: [
      { key: "rsvp", label: "RSVP button" },
      { key: "sections", label: "Menu description" },
      { key: "backToTop", label: "Monogram link" },
      { key: "openMenu", label: "Open menu" },
      { key: "closeMenu", label: "Close menu" },
    ],
  },
  {
    title: "Footer",
    path: "footerLabels",
    fields: [
      { key: "rsvp", label: "RSVP link" },
      { key: "directions", label: "Directions link" },
      { key: "calendar", label: "Calendar link" },
      { key: "backToTop", label: "Back to top" },
      { key: "madeWith", label: "Closing line", long: true },
    ],
  },
  {
    title: "Share button",
    path: "shareLabels",
    fields: [
      { key: "share", label: "Before sharing" },
      { key: "copied", label: "After copying" },
    ],
  },
  {
    title: "Screen-reader labels",
    path: "a11y",
    fields: [
      { key: "photoViewer", label: "Photo viewer" },
      { key: "closePhoto", label: "Close" },
      { key: "prevPhoto", label: "Previous photo" },
      { key: "nextPhoto", label: "Next photo" },
      { key: "openPhoto", label: "Open a photo — {n} {alt}" },
      { key: "rsvpSent", label: "Response sent — {name}", long: true },
      { key: "rsvpFailed", label: "Response failed", long: true },
    ],
  },
  {
    title: "Site & sharing",
    path: "site",
    fields: [
      { key: "title", label: "Title" },
      { key: "description", label: "Description", long: true },
      { key: "url", label: "URL" },
    ],
  },
];

const LISTS: ListGroup[] = [
  {
    title: "Order of the day",
    path: "schedule",
    addLabel: "Add an item",
    fields: [
      { key: "time", label: "Time" },
      { key: "title", label: "Title" },
      { key: "blurb", label: "Description", long: true },
      { key: "accent", label: "Highlight this moment", check: true },
    ],
  },
  {
    title: "Our story",
    path: "story",
    addLabel: "Add a chapter",
    fields: [
      { key: "chapter", label: "Numeral" },
      { key: "date", label: "Date" },
      { key: "place", label: "Place" },
      { key: "title", label: "Title" },
      { key: "body", label: "Body", long: true },
      { key: "aside", label: "Margin note", long: true },
      { key: "image", label: "Photograph", photo: true },
    ],
  },
  {
    title: "The closing count",
    path: "storyStats",
    addLabel: "Add a figure",
    fields: [
      { key: "value", label: "Value" },
      { key: "label", label: "Label" },
    ],
  },
  {
    title: "Getting there",
    path: "travel",
    addLabel: "Add a note",
    fields: [
      { key: "label", label: "Label" },
      { key: "title", label: "Title" },
      { key: "detail", label: "Detail", long: true },
    ],
  },
  {
    title: "Questions",
    path: "faqs",
    addLabel: "Add a question",
    fields: [
      { key: "q", label: "Question" },
      { key: "a", label: "Answer", long: true },
    ],
  },
  {
    title: "Navigation",
    path: "nav",
    addLabel: "Add a link",
    fields: [
      { key: "label", label: "Label" },
      { key: "href", label: "Anchor" },
    ],
  },
];

const FIXED_PHOTOS: { key: "hero" | "countdown" | "venueParty" | "venueMuhurtham"; label: string }[] = [
  { key: "hero", label: "Opening screen" },
  { key: "countdown", label: "Behind the countdown" },
  { key: "venueParty", label: "Party venue" },
  { key: "venueMuhurtham", label: "Ceremony venue" },
];

const COLOURS: { key: keyof Design; label: string }[] = [
  { key: "paper", label: "Paper" },
  { key: "ivory", label: "Ivory" },
  { key: "sand", label: "Sand" },
  { key: "forest", label: "Forest" },
  { key: "forest2", label: "Forest, light" },
  { key: "gold", label: "Gold" },
  { key: "gold2", label: "Gold, light" },
  { key: "goldPale", label: "Gold, pale" },
  { key: "wine", label: "Wine" },
  { key: "ink", label: "Ink" },
  { key: "muted", label: "Muted text" },
];

/* ---------------- helpers ---------------- */

const get = (obj: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], obj);

function setIn<T>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split(".");
  const step = (child: unknown) =>
    rest.length ? setIn(child ?? {}, rest.join("."), value) : value;

  // Arrays have to stay arrays — spreading one into an object turns it into
  // { 0: …, 1: … } and every .map on the page stops working.
  if (Array.isArray(obj)) {
    const next = [...obj];
    next[Number(head)] = step(next[Number(head)]);
    return next as T;
  }

  const src = (obj ?? {}) as Record<string, unknown>;
  return { ...src, [head]: step(src[head]) } as T;
}

export default function Editor({ initial }: { initial: Content }) {
  const [draft, setDraft] = useState<Content>(initial);
  const [tab, setTab] = useState<"content" | "design">("content");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const edit = (path: string, value: unknown) => {
    setDraft((d) => setIn(d, path, value));
    setDirty(true);
    setNote(null);
  };

  const save = async () => {
    setSaving(true);
    setNote(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || "Could not save.");
      setDirty(false);
      setNote("Saved. The site is updating.");
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!window.confirm("Discard every change and go back to the original wording?")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", { method: "DELETE" });
      const out = await res.json();
      if (out.content) setDraft(out.content);
      setDirty(false);
      setNote("Back to the original.");
    } finally {
      setSaving(false);
    }
  };

  const listRows = (path: keyof Content) =>
    (draft[path] as unknown as Record<string, unknown>[]) ?? [];

  return (
    <div className="ed">
      <div className="ed__bar">
        <div className="ad__tabs">
          <button className={`ad__tab ${tab === "content" ? "is-on" : ""}`} onClick={() => setTab("content")} suppressHydrationWarning>
            Content
          </button>
          <button className={`ad__tab ${tab === "design" ? "is-on" : ""}`} onClick={() => setTab("design")} suppressHydrationWarning>
            Design
          </button>
        </div>
        <div className="ed__bar-right">
          {note && <span className="ed__note">{note}</span>}
          {dirty && !note && <span className="ed__note ed__note--warn">Unsaved changes</span>}
          <button className="ad__btn ad__btn--ghost" onClick={reset} disabled={saving} suppressHydrationWarning>
            Reset all
          </button>
          <button className="ad__btn" onClick={save} disabled={saving || !dirty} suppressHydrationWarning>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {tab === "content" ? (
        <>
          {GROUPS.map((g) => (
            <section className="ed__group" key={g.path + g.title}>
              <h2 className="ed__h">{g.title}</h2>
              <div className="ed__grid">
                {g.fields.map((f) => {
                  const path = `${g.path}.${f.key}`;
                  const value = String(get(draft, path) ?? "");
                  return (
                    <label className={`ed__field ${f.long ? "is-wide" : ""}`} key={path}>
                      <span className="ad__label">{f.label}</span>
                      {f.long ? (
                        <textarea className="ad__input" rows={3} value={value} onChange={(e) => edit(path, e.target.value)} suppressHydrationWarning />
                      ) : (
                        <input className="ad__input" value={value} onChange={(e) => edit(path, e.target.value)} suppressHydrationWarning />
                      )}
                    </label>
                  );
                })}
              </div>
            </section>
          ))}

          <section className="ed__group">
            <h2 className="ed__h">Story introduction</h2>
            <label className="ed__field is-wide">
              <span className="ad__label">Lead-in paragraph</span>
              <textarea className="ad__input" rows={3} value={draft.storyLede} onChange={(e) => edit("storyLede", e.target.value)} suppressHydrationWarning />
            </label>
          </section>

          {LISTS.map((l) => (
            <Fragment key={l.path}>
            <section className="ed__group">
              <h2 className="ed__h">{l.title}</h2>
              {listRows(l.path).map((row, i) => (
                <div className="ed__row" key={i}>
                  <div className="ed__grid">
                    {l.fields.map((f) => (
                      f.photo ? (
                      <PhotoField
                        key={f.key}
                        label={f.label}
                        src={String(row[f.key] ?? "")}
                        onPath={(v) => {
                          // A hand-typed path invalidates whatever the last
                          // upload measured; the story array is replaced
                          // whole on save, so clearing these really clears.
                          edit(`${l.path}.${i}.${f.key}`, v);
                          edit(`${l.path}.${i}.imageWidth`, undefined);
                          edit(`${l.path}.${i}.imageHeight`, undefined);
                          edit(`${l.path}.${i}.imageBlur`, undefined);
                        }}
                        onUpload={(photo) => {
                          edit(`${l.path}.${i}.${f.key}`, photo.src);
                          edit(`${l.path}.${i}.imageWidth`, photo.width);
                          edit(`${l.path}.${i}.imageHeight`, photo.height);
                          edit(`${l.path}.${i}.imageBlur`, photo.blurDataURL);
                        }}
                      />
                      ) : (
                      <label className={`ed__field ${f.long ? "is-wide" : ""}`} key={f.key}>
                        <span className="ad__label">{f.label}</span>
                        {f.check ? (
                          <input type="checkbox" checked={Boolean(row[f.key])} onChange={(e) => edit(`${l.path}.${i}.${f.key}`, e.target.checked)} suppressHydrationWarning />
                        ) : f.long ? (
                          <textarea className="ad__input" rows={2} value={String(row[f.key] ?? "")} onChange={(e) => edit(`${l.path}.${i}.${f.key}`, e.target.value)} suppressHydrationWarning />
                        ) : (
                          <input className="ad__input" value={String(row[f.key] ?? "")} onChange={(e) => edit(`${l.path}.${i}.${f.key}`, e.target.value)} suppressHydrationWarning />
                        )}
                      </label>
                      )
                    ))}
                  </div>
                  <button
                    className="ad__del ed__rowdel"
                    onClick={() => edit(l.path, listRows(l.path).filter((_, j) => j !== i))}
                    aria-label="Remove"
                    suppressHydrationWarning
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="ad__btn ad__btn--ghost"
                onClick={() =>
                  edit(l.path, [
                    ...listRows(l.path),
                    Object.fromEntries(l.fields.map((f) => [f.key, f.check ? false : ""])),
                  ])
                }
                suppressHydrationWarning
              >
                {l.addLabel}
              </button>
            </section>
            {l.path === "storyStats" && (
              <>
              <GalleryEditor
                value={draft.gallery}
                onChange={(next: Photo[]) => edit("gallery", next)}
              />
              <section className="ed__group">
                <h2 className="ed__h">The four fixed photographs</h2>
                <p className="ad__note">
                  These sit in set places rather than in the gallery grid.
                </p>
                {FIXED_PHOTOS.map((f) => (
                  <div className="ed__row" key={f.key}>
                    <div className="ed__grid">
                      <PhotoField
                        label={f.label}
                        src={draft.photos[f.key].src}
                        onPath={(v) => {
                          edit(`photos.${f.key}.src`, v);
                          edit(`photos.${f.key}.width`, undefined);
                          edit(`photos.${f.key}.height`, undefined);
                          edit(`photos.${f.key}.blurDataURL`, undefined);
                        }}
                        onUpload={(photo) => {
                          edit(`photos.${f.key}.src`, photo.src);
                          edit(`photos.${f.key}.width`, photo.width);
                          edit(`photos.${f.key}.height`, photo.height);
                          edit(`photos.${f.key}.blurDataURL`, photo.blurDataURL);
                        }}
                      />
                      <label className="ed__field is-wide">
                        <span className="ad__label">Description</span>
                        <input
                          className="ad__input"
                          value={draft.photos[f.key].alt}
                          onChange={(e) => edit(`photos.${f.key}.alt`, e.target.value)}
                          suppressHydrationWarning
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </section>
              </>
            )}
            </Fragment>
          ))}
        </>
      ) : (
        <>
          <section className="ed__group">
            <h2 className="ed__h">Colours</h2>
            <div className="ed__swatches">
              {COLOURS.map((c) => (
                <label className="ed__swatch" key={c.key}>
                  <input
                    type="color"
                    value={String(draft.design[c.key])}
                    onChange={(e) => edit(`design.${c.key}`, e.target.value)}
                    suppressHydrationWarning
                  />
                  <span className="ad__label">{c.label}</span>
                  <input
                    className="ad__input ed__hex"
                    value={String(draft.design[c.key])}
                    onChange={(e) => edit(`design.${c.key}`, e.target.value)}
                    suppressHydrationWarning
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="ed__group">
            <h2 className="ed__h">Scale</h2>
            <div className="ed__grid">
              {([
                { k: "displayScale", l: "Type size" },
                { k: "sectionScale", l: "Section spacing" },
              ] as const).map((s) => (
                <label className="ed__field" key={s.k}>
                  <span className="ad__label">
                    {s.l} — {Number(draft.design[s.k]).toFixed(2)}×
                  </span>
                  <input
                    type="range"
                    min="0.7"
                    max="1.4"
                    step="0.01"
                    value={Number(draft.design[s.k])}
                    onChange={(e) => edit(`design.${s.k}`, Number(e.target.value))}
                    suppressHydrationWarning
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="ed__group">
            <h2 className="ed__h">Sections</h2>
            <p className="ad__note">
              Turn a section off to hide it, or move it to change where it sits.
              The hero always comes first.
            </p>
            <ul className="ed__sections">
              {draft.sections.map((s, i) => (
                <li key={s.key}>
                  <label className="ed__toggle">
                    <input
                      type="checkbox"
                      checked={s.enabled}
                      onChange={(e) => edit(`sections.${i}.enabled`, e.target.checked)}
                      suppressHydrationWarning
                    />
                    <span>{s.label}</span>
                  </label>
                  <span className="ed__move">
                    <button
                      disabled={i === 0}
                      onClick={() => {
                        const next = [...draft.sections];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        edit("sections", next);
                      }}
                      aria-label="Move up"
                      suppressHydrationWarning
                    >
                      ↑
                    </button>
                    <button
                      disabled={i === draft.sections.length - 1}
                      onClick={() => {
                        const next = [...draft.sections];
                        [next[i + 1], next[i]] = [next[i], next[i + 1]];
                        edit("sections", next);
                      }}
                      aria-label="Move down"
                      suppressHydrationWarning
                    >
                      ↓
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useContent } from "@/lib/content-client";
import { fill } from "@/lib/content-types";
import SectionHead from "./SectionHead";
import { Check } from "./Ornaments";

type Errors = Partial<
  Record<"name" | "phone" | "email" | "attending", string>
>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Rsvp() {
  const {
    contact, couple, party, site, wedding, venue, headings, rsvpForm, celebration, a11y,
  } = useContent();
  const guestOptions = rsvpForm.guestOptions.split(",").map((o) => o.trim()).filter(Boolean);
  const celebrationMuhurtham = celebration.muhurtham;
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [sentTo, setSentTo] = useState<string>("");

  /** Clear a complaint the moment the guest puts it right. */
  const clearErr = (key: keyof Errors) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd) as Record<string, string>;
    data.days = fd.getAll("days").join(", ");

    const next: Errors = {};
    if (!data.name?.trim()) next.name = rsvpForm.errName;
    if ((data.phone ?? "").replace(/\D/g, "").length < 7)
      next.phone = rsvpForm.errPhone;
    if (data.email?.trim() && !EMAIL.test(data.email.trim()))
      next.email = rsvpForm.errEmail;
    if (!data.attending) next.attending = rsvpForm.errAttending;

    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    setFailed(false);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      // Only promise the guest an email if the server actually sent one.
      const out = (await res.json().catch(() => ({}))) as { guestCopy?: boolean };
      setSentTo(out.guestCopy ? (data.email?.trim() ?? "") : "");
      setSent(data.name.trim().split(" ")[0]);
    } catch {
      // Never pretend it worked — tell them, and give them another way through.
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  // A deep link cannot carry a file, so it carries the link to one.
  const INVITATION = "/invitation.pdf";
  const shareHref = `https://wa.me/?text=${encodeURIComponent(
    `${couple.groom.first} & ${couple.bride.first} are getting married on ${wedding.dateLong}. ` +
      `Invitation: ${site.url}${INVITATION}
Details & RSVP: ${site.url}`
  )}`;

  const waHref = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(
        `Hi! Just RSVP'd on your wedding site for ${wedding.dateShort}. Can't wait!`
      )}`
    : null;

  return (
    <section className="band rsvp" id="rsvp">
      <div className="shell split">
        <div className="split__aside">
          <SectionHead
            {...headings.rsvp}
            align="left"
          />
        </div>

        <div className="split__main">

        <div aria-live="polite" className="sr-only">
          {sent ? fill(a11y.rsvpSent, { name: sent }) : ""}
          {failed ? a11y.rsvpFailed : ""}
        </div>

        {sent ? (
          <div className="thanks">
            <span className="thanks__mark">
              <Check />
            </span>
            <h3 className="s-title" style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)" }}>
              {fill(rsvpForm.thanksTitle, { name: sent })}
            </h3>
            <p className="prose" style={{ textAlign: "center" }}>
              {fill(rsvpForm.thanksBody, { date: wedding.dateLong })}
              {sentTo && ` ${fill(rsvpForm.thanksCopy, { email: sentTo })}`}
            </p>

            <div className="thanks__actions">
              <a className="btn btn-solid" href={INVITATION} download>
                {rsvpForm.download}
              </a>
              <a
                className="btn btn-ghost"
                href={shareHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {rsvpForm.shareSelf}
              </a>
            </div>

            <div className="thanks__actions">
              <button
                suppressHydrationWarning
                className="foot__link"
                onClick={() => setSent(null)}
              >
                {rsvpForm.another}
              </button>
              {waHref && (
                <a
                  className="foot__link"
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {rsvpForm.sayHello}
                </a>
              )}
            </div>
          </div>
        ) : (
          <form className="form" onSubmit={onSubmit} noValidate>
            <div className={`field ${errors.name ? "err" : ""}`}>
              <label htmlFor="name">{rsvpForm.nameLabel}</label>
              <input suppressHydrationWarning
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={rsvpForm.namePlaceholder}
                onInput={() => clearErr("name")}
              />
              {errors.name && <small>{errors.name}</small>}
            </div>

            <div className="form__row">
              <div className={`field ${errors.phone ? "err" : ""}`}>
                <label htmlFor="phone">{rsvpForm.phoneLabel}</label>
                <input suppressHydrationWarning
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={rsvpForm.phonePlaceholder}
                  onInput={() => clearErr("phone")}
                />
                {errors.phone && <small>{errors.phone}</small>}
              </div>

              <div className={`field ${errors.email ? "err" : ""}`}>
                <label htmlFor="email">Email (optional)</label>
                <input suppressHydrationWarning
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={rsvpForm.emailPlaceholder}
                  onInput={() => clearErr("email")}
                />
                {errors.email && <small>{errors.email}</small>}
              </div>
            </div>

            {/* Not for guests — only something automated will ever fill it. */}
            <div className="hp" aria-hidden="true">
              <label htmlFor="website">Leave this empty</label>
              <input suppressHydrationWarning
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className={`field ${errors.attending ? "err" : ""}`}>
              <label>{rsvpForm.attendingLabel}</label>
              <div className="choice">
                <input suppressHydrationWarning
                  type="radio"
                  id="yes"
                  name="attending"
                  value={rsvpForm.accepts}
                  onChange={() => {
                    setAttending("yes");
                    clearErr("attending");
                  }}
                />
                <label htmlFor="yes">{rsvpForm.accepts}</label>
                <input suppressHydrationWarning
                  type="radio"
                  id="no"
                  name="attending"
                  value={rsvpForm.declines}
                  onChange={() => {
                    setAttending("no");
                    clearErr("attending");
                  }}
                />
                <label htmlFor="no">{rsvpForm.declines}</label>
              </div>
              {errors.attending && <small>{errors.attending}</small>}
            </div>

            {attending === "yes" && (
              <div className="field">
                <label>{rsvpForm.daysLabel}</label>
                <div className="days">
                  {[
                    {
                      id: "day-party",
                      value: `${party.label} — ${party.dateShort}`,
                      title: party.label,
                      sub: `${party.dateShort}, ${party.time} · ${party.venue.name}`,
                    },
                    {
                      id: "day-wedding",
                      value: `${celebrationMuhurtham} — ${wedding.dateShort}`,
                      title: celebrationMuhurtham,
                      sub: `${wedding.dateShort}, ${wedding.muhurtham} · ${venue.name}`,
                    },
                  ].map((d) => (
                    <div key={d.id}>
                      <input suppressHydrationWarning
                        type="checkbox"
                        id={d.id}
                        name="days"
                        value={d.value}
                        defaultChecked
                      />
                      <label htmlFor={d.id}>
                        <span>{d.title}</span>
                        <em>{d.sub}</em>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {attending === "yes" && (
              <div className="form__row">
                <div className="field">
                  <label htmlFor="guests">{rsvpForm.guestsLabel}</label>
                  <select
                    suppressHydrationWarning
                    id="guests"
                    name="guests"
                    defaultValue="1"
                  >
                    {guestOptions.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="side">{rsvpForm.sideLabel}</label>
                  <select
                    suppressHydrationWarning
                    id="side"
                    name="side"
                    defaultValue=""
                  >
                    <option value="">{rsvpForm.sideNone}</option>
                    <option value={`${couple.groom.first}'s side`}>
                      {couple.groom.first}&apos;s side
                    </option>
                    <option value={`${couple.bride.first}'s side`}>
                      {couple.bride.first}&apos;s side
                    </option>
                    <option value="Both">{rsvpForm.sideBoth}</option>
                  </select>
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="message">{rsvpForm.messageLabel}</label>
              <textarea suppressHydrationWarning
                id="message"
                name="message"
                placeholder={rsvpForm.messagePlaceholder}
              />
            </div>

            {failed && (
              <div className="form__error" role="alert">
                <strong>{rsvpForm.errorTitle}</strong>
                <p>
                  {rsvpForm.errorBody}{" "}
                  {waHref ? rsvpForm.errorWhatsapp : rsvpForm.errorCall}
                </p>
                {waHref && (
                  <a
                    className="btn btn-ghost"
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ justifySelf: "start", marginTop: "0.4rem" }}
                  >
                    Message us instead
                  </a>
                )}
              </div>
            )}

            <div className="form__submit">
              <button
                suppressHydrationWarning
                className="btn btn-solid"
                type="submit"
                disabled={sending}
              >
                {sending ? rsvpForm.sending : failed ? rsvpForm.retry : rsvpForm.submit}
              </button>
              <span className="form__hint">{rsvpForm.hint}</span>
            </div>
          </form>
        )}
        </div>
      </div>
    </section>
  );
}

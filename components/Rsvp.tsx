"use client";

import { useState } from "react";
import { contact, couple, party, wedding } from "@/lib/config";
import SectionHead from "./SectionHead";
import { Check } from "./Ornaments";

type Errors = Partial<
  Record<"name" | "phone" | "email" | "attending", string>
>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Rsvp() {
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

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
    if (!data.name?.trim()) next.name = "Please tell us your name.";
    if ((data.phone ?? "").replace(/\D/g, "").length < 7)
      next.phone = "A number we can reach you on.";
    if (data.email?.trim() && !EMAIL.test(data.email.trim()))
      next.email = "That address does not look quite right.";
    if (!data.attending) next.attending = "Let us know if you can make it.";

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
      setSent(data.name.trim().split(" ")[0]);
    } catch {
      // Never pretend it worked — tell them, and give them another way through.
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

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
            eyebrow="RSVP"
            title="Will you be there?"
            lede="Kindly respond by 15 October 2026 — it helps us plan the seating, and the sadhya."
            align="left"
          />
        </div>

        <div className="split__main">

        <div aria-live="polite" className="sr-only">
          {sent ? `Thank you ${sent}, your response is with us.` : ""}
          {failed ? "Your response could not be sent. Please try again." : ""}
        </div>

        {sent ? (
          <div className="thanks">
            <span className="thanks__mark">
              <Check />
            </span>
            <h3 className="s-title" style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)" }}>
              Thank you, {sent}
            </h3>
            <p className="prose" style={{ textAlign: "center" }}>
              Your response is with us. We will be in touch closer to the day —
              and we cannot wait to see you on {wedding.dateLong}.
            </p>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", justifyContent: "center" }}>
              <button
                suppressHydrationWarning
                className="btn btn-ghost"
                onClick={() => setSent(null)}
              >
                Send another response
              </button>
              {waHref && (
                <a
                  className="btn"
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Say hello on WhatsApp
                </a>
              )}
            </div>
          </div>
        ) : (
          <form className="form" onSubmit={onSubmit} noValidate>
            <div className={`field ${errors.name ? "err" : ""}`}>
              <label htmlFor="name">Your name</label>
              <input suppressHydrationWarning
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="As you would like it on the place card"
                onInput={() => clearErr("name")}
              />
              {errors.name && <small>{errors.name}</small>}
            </div>

            <div className="form__row">
              <div className={`field ${errors.phone ? "err" : ""}`}>
                <label htmlFor="phone">Phone</label>
                <input suppressHydrationWarning
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="WhatsApp, ideally"
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
                  placeholder="So we can write back"
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
              <label>Can you join us?</label>
              <div className="choice">
                <input suppressHydrationWarning
                  type="radio"
                  id="yes"
                  name="attending"
                  value="Joyfully accepts"
                  onChange={() => {
                    setAttending("yes");
                    clearErr("attending");
                  }}
                />
                <label htmlFor="yes">Joyfully accepts</label>
                <input suppressHydrationWarning
                  type="radio"
                  id="no"
                  name="attending"
                  value="Regretfully declines"
                  onChange={() => {
                    setAttending("no");
                    clearErr("attending");
                  }}
                />
                <label htmlFor="no">Regretfully declines</label>
              </div>
              {errors.attending && <small>{errors.attending}</small>}
            </div>

            {attending === "yes" && (
              <div className="field">
                <label>Which will you join?</label>
                <div className="days">
                  {[
                    {
                      id: "day-party",
                      value: `${party.label} — ${party.dateShort}`,
                      title: party.label,
                      sub: `Sat 14 Nov · ${party.venue.name}`,
                    },
                    {
                      id: "day-wedding",
                      value: `Muhurtham — ${wedding.dateShort}`,
                      title: "The Muhurtham",
                      sub: "Sun 15 Nov · Reef Club Resort",
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
                  <label htmlFor="guests">How many of you?</label>
                  <select
                    suppressHydrationWarning
                    id="guests"
                    name="guests"
                    defaultValue="1"
                  >
                    {["1", "2", "3", "4", "5", "6", "More than 6"].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="side">Whose guest are you?</label>
                  <select
                    suppressHydrationWarning
                    id="side"
                    name="side"
                    defaultValue=""
                  >
                    <option value="">Prefer not to say</option>
                    <option value={`${couple.groom.first}'s side`}>
                      {couple.groom.first}&apos;s side
                    </option>
                    <option value={`${couple.bride.first}'s side`}>
                      {couple.bride.first}&apos;s side
                    </option>
                    <option value="Both">A bit of both</option>
                  </select>
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor="message">A note for us (optional)</label>
              <textarea suppressHydrationWarning
                id="message"
                name="message"
                placeholder="A blessing, a song request, a dietary note…"
              />
            </div>

            {failed && (
              <div className="form__error" role="alert">
                <strong>That did not go through</strong>
                <p>
                  Something went wrong on our side — nothing was lost, please
                  press send once more.{" "}
                  {waHref
                    ? "If it keeps refusing, message us on WhatsApp and we will add you by hand."
                    : "If it keeps refusing, do give us a call and we will add you by hand."}
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
                {sending ? "Sending…" : failed ? "Try again" : "Send our response"}
              </button>
              <span className="form__hint">
                One response per household is plenty.
              </span>
            </div>
          </form>
        )}
        </div>
      </div>
    </section>
  );
}

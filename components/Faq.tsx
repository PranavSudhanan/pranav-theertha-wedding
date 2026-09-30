"use client";

import { useState } from "react";
import { useContent } from "@/lib/content-client";
import SectionHead from "./SectionHead";

export default function Faq() {
  const { contact, faqs, headings } = useContent();
  const [open, setOpen] = useState<number | null>(0);

  const hasContact = Boolean(contact.whatsapp || contact.altPhone || contact.email);

  return (
    <section className="band bg-ivory" id="faq">
      <div className="shell split">
        <div className="split__aside">
          <SectionHead
            {...headings.faq}
            align="left"
          />
        </div>

        <div className="split__main">

        {/* One reveal for the whole list: fading each question in
            separately leaves gaps below whichever one you expand. */}
        <div className="faq" data-reveal="fade">
          {faqs.map((item, i) => (
            <div
              className={`faq__item ${open === i ? "open" : ""}`}
              key={item.q}
            >
              <h3>
                <button suppressHydrationWarning
                  className="faq__q"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-a-${i}`}
                  id={`faq-q-${i}`}
                >
                  {item.q}
                  <span className="faq__sign" aria-hidden="true" />
                </button>
              </h3>
              <div
                className="faq__a"
                id={`faq-a-${i}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
              >
                <div>
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasContact && (
          <div
            className="center"
            data-reveal
            style={{ marginTop: "clamp(2rem, 4vw, 3rem)" }}
          >
            <p className="prose" style={{ marginInline: "auto" }}>
              Still unsure about something? Reach{" "}
              {contact.whatsappName || "us"} on{" "}
              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--gold)", textDecoration: "underline" }}
                >
                  WhatsApp
                </a>
              )}
              {contact.whatsapp && contact.altPhone && " or "}
              {contact.altPhone && (
                <a
                  href={`tel:${contact.altPhone}`}
                  style={{ color: "var(--gold)", textDecoration: "underline" }}
                >
                  {contact.altPhone}
                </a>
              )}
              .
            </p>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}

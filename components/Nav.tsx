"use client";

import { useCallback, useEffect, useState } from "react";
import { couple, nav, wedding } from "@/lib/config";

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");
  const [showFloat, setShowFloat] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastY = window.scrollY;

    const paint = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setSolid(y > 60);
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);
      setShowFloat(y > window.innerHeight * 0.9);

      // Step aside on the way down, come back the moment they scroll up.
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > window.innerHeight * 0.6);
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Which section are we in?
  useEffect(() => {
    const sections = nav
      .map((n) => document.querySelector(n.href))
      .filter(Boolean) as Element[];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Lock the page behind the mobile drawer.
  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header
        className={`nav ${solid ? "solid" : ""} ${
          hidden && !open ? "hide" : ""
        }`}
      >
        <div className="shell nav__bar">
          <a href="#top" className="nav__mono" aria-label="Back to top">
            {couple.groom.initial} &amp; {couple.bride.initial}
          </a>

          <nav className="nav__links" aria-label="Sections">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`nav__link ${active === item.href ? "active" : ""}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a href="#rsvp" className="btn btn-solid nav__cta">
            RSVP
          </a>

          <button suppressHydrationWarning
            className={`burger ${open ? "open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <span
          className="nav__progress"
          style={{ ["--p" as string]: progress }}
          aria-hidden="true"
        />
      </header>

      <div
        id="mobile-menu"
        className={`drawer ${open ? "open" : ""}`}
        aria-hidden={!open}
      >
        <div>
          <ul className="drawer__list">
            {nav.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={close}
                  style={{ ["--i" as string]: i }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="drawer__foot">
            <a href="#rsvp" onClick={close} className="btn btn-solid">
              RSVP
            </a>
            <span className="eyebrow">{wedding.dateShort}</span>
          </div>
        </div>
      </div>

      <a
        href="#rsvp"
        className={`float-rsvp ${showFloat && !open ? "show" : ""}`}
      >
        RSVP
      </a>
    </>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useContent } from "@/lib/content-client";

export default function Nav() {
  const content = useContent();
  const { couple, wedding, navLabels } = content;

  // A link to a section that has been switched off would scroll nowhere.
  const nav = useMemo(
    () =>
      content.nav.filter((item) => {
        const section = content.sections.find((s) => `#${s.key}` === item.href);
        return section ? section.enabled : true;
      }),
    [content.nav, content.sections]
  );
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("");
  const [showFloat, setShowFloat] = useState(false);

  useEffect(() => {
    // Called straight from the scroll event rather than through
    // requestAnimationFrame: whether the bar has a background — and so
    // whether its links are readable over the page — must not wait on the
    // animation frame loop. Browsers already fire scroll at most once a
    // frame, so there is nothing to throttle.
    const paint = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setSolid(y > 60);
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);
      setShowFloat(y > window.innerHeight * 0.9);
    };

    paint();
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint, { passive: true });
    return () => {
      window.removeEventListener("scroll", paint);
      window.removeEventListener("resize", paint);
    };
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
      <header className={`nav ${solid ? "solid" : ""}`}>
        <div className="shell nav__bar">
          <a href="#top" className="nav__mono" aria-label={navLabels.backToTop}>
            {couple.groom.initial} &amp; {couple.bride.initial}
          </a>

          <nav className="nav__links" aria-label={navLabels.sections}>
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
            {navLabels.rsvp}
          </a>

          <button suppressHydrationWarning
            className={`burger ${open ? "open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? navLabels.closeMenu : navLabels.openMenu}
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

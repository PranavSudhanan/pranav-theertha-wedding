"use client";

import { useEffect } from "react";

/**
 * The page's motion, in one small file.
 *
 *  • reveals anything marked [data-reveal] or .mask as it comes into view
 *  • drives the slow parallax on [data-parallax] elements
 *
 * Reveals are driven by a plain geometric check rather than an
 * IntersectionObserver, and it re-runs on scroll, on resize, and whenever the
 * page's own height changes — which is what happens when someone opens an FAQ
 * answer and everything below it shifts. A missed callback would leave a guest
 * staring at an empty section, so nothing here is left to chance: anything at
 * or above the fold is revealed, always, and a final sweep runs on a timer.
 */
export default function ScrollFx() {
  useEffect(() => {
    const root = document.documentElement;

    // No .fx means motion is off (reduce-motion, or the inline script never
    // ran). The page is already fully visible; there is nothing to do.
    if (!root.classList.contains("fx")) return;

    let pending = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal], .mask")
    );

    // Deliberately synchronous, and deliberately not on requestAnimationFrame:
    // whether a guest can read a section must never wait on the animation
    // frame loop. Only the parallax below is allowed to depend on that.
    const check = () => {
      if (!pending.length) return;
      const limit = window.innerHeight * 1.06;
      const still: HTMLElement[] = [];
      for (const el of pending) {
        if (el.getBoundingClientRect().top < limit) el.classList.add("in");
        else still.push(el);
      }
      pending = still;
    };

    // ---- parallax ----
    const layers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]")
    );
    let pFrame = 0;

    const paint = () => {
      pFrame = 0;
      const vh = window.innerHeight;
      for (const el of layers) {
        const host = el.parentElement ?? el;
        const box = host.getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) continue;
        const speed = Number(el.dataset.parallax || 0.15);
        const offset = (box.top + box.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      }
    };

    const onScroll = () => {
      check();
      if (!pFrame) pFrame = requestAnimationFrame(paint);
    };

    // The opening choreography waits for the curtain; everything after is live.
    const begin = () => {
      check();
      paint();
    };
    if (root.classList.contains("ready")) begin();
    else window.addEventListener("wedding:ready", begin, { once: true });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Accordions, photographs arriving, fonts swapping — any of these move
    // things up the page, and whatever lands in view should be visible.
    const ro = new ResizeObserver(check);
    ro.observe(document.body);

    // Last resort, for anything the events above somehow miss.
    const sweep = window.setInterval(() => {
      check();
      if (!pending.length) window.clearInterval(sweep);
    }, 1000);

    return () => {
      window.removeEventListener("wedding:ready", begin);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
      window.clearInterval(sweep);
      if (pFrame) cancelAnimationFrame(pFrame);
    };
  }, []);

  return null;
}

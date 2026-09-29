"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { Arrow, Cross } from "./Ornaments";
import { img } from "@/lib/images";

export type Shot = { src: string; alt: string };

const SWIPE = 48;

export default function Lightbox({
  items,
  index,
  setIndex,
  onClose,
}: {
  items: readonly Shot[];
  index: number | null;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const many = items.length > 1;

  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (step: number) => {
      if (index === null) return;
      setIndex((index + step + items.length) % items.length);
    },
    [index, items.length, setIndex]
  );

  useEffect(() => {
    if (!open) return;

    document.body.classList.add("is-locked");
    restoreTo.current = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowRight") return go(1);
      if (e.key === "ArrowLeft") return go(-1);

      // Keep Tab inside the viewer while it is open.
      if (e.key !== "Tab" || !dialog.current) return;
      const focusables = dialog.current.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const restore = restoreTo.current;
    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", onKey);
      restore?.focus?.();
    };
  }, [open, go, onClose]);

  const shot = open ? items[index] : null;
  const near = open
    ? [
        items[(index + 1) % items.length],
        items[(index - 1 + items.length) % items.length],
      ]
    : [];

  return (
    <div
      ref={dialog}
      className={`lb ${open ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null || !many) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > SWIPE) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      aria-hidden={!open}
    >
      <button suppressHydrationWarning
        ref={closeBtn}
        className="lb__close"
        onClick={onClose}
        aria-label="Close"
      >
        <Cross />
      </button>

      {many && (
        <button suppressHydrationWarning
          className="lb__btn prev"
          aria-label="Previous photo"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
        >
          <Arrow dir="left" />
        </button>
      )}

      {shot && (
        <figure className="lb__figure" onClick={(e) => e.stopPropagation()}>
          <Image
            key={shot.src}
            className="lb__img"
            src={img(shot.src)}
            alt={shot.alt}
            placeholder="blur"
            sizes="(min-width: 900px) 900px, 100vw"
          />
          <figcaption className="lb__cap">{shot.alt}</figcaption>
        </figure>
      )}

      {many && (
        <button suppressHydrationWarning
          className="lb__btn next"
          aria-label="Next photo"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
        >
          <Arrow />
        </button>
      )}

      {many && open && (
        <span className="lb__count">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(items.length).padStart(2, "0")}
        </span>
      )}

      {/* whichever way they go next, it is already on its way down the wire */}
      <div className="lb__preload" aria-hidden="true">
        {near.map((n) => (
          <Image
            key={n.src}
            src={img(n.src)}
            alt=""
            sizes="(min-width: 900px) 900px, 100vw"
          />
        ))}
      </div>
    </div>
  );
}

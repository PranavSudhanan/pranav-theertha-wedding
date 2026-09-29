"use client";

import { useState } from "react";
import type { Content } from "@/lib/content-types";
import type { StoredRsvp } from "@/lib/store";
import Guests from "./Guests";
import Editor from "./Editor";

export default function Console({
  rsvps,
  content,
  storeKind,
  storeError,
}: {
  rsvps: StoredRsvp[];
  content: Content;
  storeKind: string;
  storeError: string | null;
}) {
  const [view, setView] = useState<"guests" | "site">("guests");

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="ad__wrap">
      <header className="ad__top">
        <div>
          <span className="ad__mono">P &amp; T</span>
          <h1 className="ad__title">
            {view === "guests" ? "Guest list" : "The website"}
          </h1>
        </div>
        <div className="ad__top-actions">
          <nav className="ad__tabs ad__tabs--main">
            <button
              className={`ad__tab ${view === "guests" ? "is-on" : ""}`}
              onClick={() => setView("guests")}
              suppressHydrationWarning
            >
              Guests
              <span className="ad__count">{rsvps.length}</span>
            </button>
            <button
              className={`ad__tab ${view === "site" ? "is-on" : ""}`}
              onClick={() => setView("site")}
              suppressHydrationWarning
            >
              Customise
            </button>
          </nav>
          <a className="ad__btn ad__btn--ghost" href="/" target="_blank" rel="noreferrer">
            View site
          </a>
          <button className="ad__btn ad__btn--ghost" onClick={signOut} suppressHydrationWarning>
            Sign out
          </button>
        </div>
      </header>

      {view === "guests" ? (
        <Guests initial={rsvps} storeKind={storeKind} storeError={storeError} />
      ) : (
        <Editor initial={content} />
      )}
    </div>
  );
}

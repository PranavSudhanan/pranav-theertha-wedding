"use client";

import { useEffect, useState } from "react";
import { useContent } from "@/lib/content-client";

export default function Preloader() {
  const { couple, wedding } = useContent();
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.classList.add("is-locked");

    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      setDone(true);
      document.body.classList.remove("is-locked");
      // Cue the opening choreography (see ScrollFx).
      document.documentElement.classList.add("ready");
      window.dispatchEvent(new Event("wedding:ready"));
    };

    // Whichever comes first: the page finishing, or a short, patient beat.
    const timer = window.setTimeout(release, 1900);
    const onLoad = () => window.setTimeout(release, 500);

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", onLoad);
      document.body.classList.remove("is-locked");
    };
  }, []);

  return (
    <div className={`preloader ${done ? "done" : ""}`} aria-hidden="true">
      <div className="preloader__inner">
        <span className="preloader__mono">
          {couple.groom.initial} &amp; {couple.bride.initial}
        </span>
        <span className="preloader__names">
          {couple.groom.first} &nbsp;·&nbsp; {couple.bride.first}
        </span>
        <span className="preloader__bar">
          <i />
        </span>
        <span className="preloader__label">{wedding.dateShort}</span>
      </div>
    </div>
  );
}

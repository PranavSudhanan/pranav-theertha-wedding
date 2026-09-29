"use client";

import { useState } from "react";
import { site } from "@/lib/config";

export default function ShareButton() {
  const [label, setLabel] = useState("Share");

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : site.url;
    try {
      if (navigator.share) {
        await navigator.share({ title: site.title, text: site.description, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setLabel("Link copied");
      window.setTimeout(() => setLabel("Share"), 2200);
    } catch {
      /* the guest cancelled — nothing to do */
    }
  };

  return (
    <button suppressHydrationWarning className="foot__link" onClick={share}>
      {label}
    </button>
  );
}

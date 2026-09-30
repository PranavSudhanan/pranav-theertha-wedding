"use client";

import { useState } from "react";
import { useContent } from "@/lib/content-client";

export default function ShareButton() {
  const { site, shareLabels } = useContent();
  const [label, setLabel] = useState(shareLabels.share);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : site.url;
    try {
      if (navigator.share) {
        await navigator.share({ title: site.title, text: site.description, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setLabel(shareLabels.copied);
      window.setTimeout(() => setLabel(shareLabels.share), 2200);
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

import type { StaticImageData } from "next/image";

import c01 from "@/public/images/couple-01.jpg";
import c02 from "@/public/images/couple-02.jpg";
import c03 from "@/public/images/couple-03.jpg";
import c04 from "@/public/images/couple-04.jpg";
import c05 from "@/public/images/couple-05.jpg";
import c06 from "@/public/images/couple-06.jpg";
import c07 from "@/public/images/couple-07.jpg";
import c08 from "@/public/images/couple-08.jpg";

/**
 * Every photograph, imported rather than referenced by string.
 *
 * Importing lets Next.js read the real dimensions at build time and bake a
 * tiny blurred preview into the page, so a photo fades up from a soft version
 * of itself instead of popping in out of a grey box.
 *
 * ADDING A PHOTO: drop the file in public/images/, add an import above and a
 * line to the map below, then reference the same "/images/…" path in
 * lib/config.ts.
 */
const REGISTRY: Record<string, StaticImageData> = {
  "/images/couple-01.jpg": c01,
  "/images/couple-02.jpg": c02,
  "/images/couple-03.jpg": c03,
  "/images/couple-04.jpg": c04,
  "/images/couple-05.jpg": c05,
  "/images/couple-06.jpg": c06,
  "/images/couple-07.jpg": c07,
  "/images/couple-08.jpg": c08,
};

export function img(src: string): StaticImageData {
  const found = REGISTRY[src];
  if (!found) {
    throw new Error(
      `No image registered for "${src}". Add an import for it in lib/images.ts.`
    );
  }
  return found;
}

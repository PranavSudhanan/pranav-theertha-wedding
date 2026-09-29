"use client";

import { useState } from "react";
import Image from "next/image";
import { gallery } from "@/lib/config";
import SectionHead from "./SectionHead";
import Lightbox from "./Lightbox";
import { img } from "@/lib/images";

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section className="band" id="gallery">
      <div className="shell">
        <SectionHead
          eyebrow="Gallery"
          title="A few of our favourites"
          lede="All from one afternoon in March 2026 — the day our families first sat in the same room."
        />

        <div className="gal">
          {gallery.map((shot, i) => (
            <button suppressHydrationWarning
              className="gal__item"
              key={shot.src}
              onClick={() => setIndex(i)}
              data-reveal="zoom"
              style={{ ["--d" as string]: `${(i % 4) * 90}ms` }}
              aria-label={`Open photo ${i + 1}: ${shot.alt}`}
            >
              <Image
                src={img(shot.src)}
                alt={shot.alt}
                placeholder="blur"
                sizes="(min-width: 1100px) 26vw, (min-width: 720px) 34vw, 48vw"
                loading={i < 4 ? "eager" : "lazy"}
              />
              <span className="gal__plus" aria-hidden="true">
                +
              </span>
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        items={gallery}
        index={index}
        setIndex={setIndex}
        onClose={() => setIndex(null)}
      />
    </section>
  );
}

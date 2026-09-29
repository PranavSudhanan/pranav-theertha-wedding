import * as cfg from "@/lib/config";

/**
 * The shape of the site's content, its compiled defaults, and the pure
 * helpers derived from it.
 *
 * Kept apart from lib/content.ts on purpose: that module reads the store and
 * calls revalidateTag, both server-only. Client components need the type and
 * the helpers, so those live here where importing them pulls in nothing.
 */

export type Place = {
  name: string;
  locality: string;
  city: string;
  region: string;
  mapsUrl: string;
};

export type Photo = {
  src: string;
  alt: string;
  /** Uploaded photographs carry their own size and preview; the ones
      compiled into the bundle get both from the import. */
  width?: number;
  height?: number;
  blurDataURL?: string;
};

export type Design = {
  paper: string;
  ivory: string;
  sand: string;
  ink: string;
  forest: string;
  forest2: string;
  gold: string;
  gold2: string;
  goldPale: string;
  wine: string;
  muted: string;
  /** multiplies every display size, for dialling the whole page up or down */
  displayScale: number;
  /** vertical rhythm multiplier for the big section paddings */
  sectionScale: number;
};

export type SectionKey =
  | "invitation"
  | "countdown"
  | "story"
  | "celebration"
  | "gallery"
  | "venue"
  | "rsvp"
  | "faq"
  | "blessing";

export type Content = {
  couple: {
    groom: { first: string; full: string; parents: string; parentLabel: string; initial: string; home: string };
    bride: { first: string; full: string; parents: string; parentLabel: string; initial: string; home: string };
    hashtag: string;
  };
  wedding: {
    dateISO: string;
    dateLong: string;
    dateWords: string;
    year: string;
    dateShort: string;
    muhurtham: string;
    icsStart: string;
    icsEnd: string;
  };
  venue: Place;
  party: {
    label: string;
    dateLong: string;
    dateShort: string;
    time: string;
    icsDate: string;
    icsStart: string;
    icsEnd: string;
    blurb: string;
    venue: Place;
  };
  schedule: { time: string; title: string; blurb: string; accent: boolean }[];
  met: { place: string; when: string };
  story: {
    chapter: string;
    date: string;
    title: string;
    body: string;
    place: string;
    aside: string;
    image: string;
    /** Set when the photograph was uploaded rather than compiled in. */
    imageWidth?: number;
    imageHeight?: number;
    imageBlur?: string;
  }[];
  storyStats: { value: string; label: string }[];
  storyLede: string;
  gallery: Photo[];
  contact: { whatsapp: string; whatsappName: string; altPhone: string; altPhoneName: string; email: string };
  travel: { label: string; title: string; detail: string }[];
  faqs: { q: string; a: string }[];
  blessing: { shloka: string; roman: string; gloss: string; eyebrow: string; quote: string };
  site: { title: string; description: string; url: string };
  nav: { label: string; href: string }[];
  design: Design;
  sections: { key: SectionKey; label: string; enabled: boolean }[];
};

const place = (p: { name: string; locality: string; city: string; region: string; mapsUrl: string }): Place => ({
  name: p.name,
  locality: p.locality,
  city: p.city,
  region: p.region,
  mapsUrl: p.mapsUrl,
});

/** The compiled defaults — what ships in the bundle. */
export const DEFAULTS: Content = {
  couple: {
    groom: { ...cfg.couple.groom },
    bride: { ...cfg.couple.bride },
    hashtag: cfg.couple.hashtag,
  },
  wedding: {
    dateISO: cfg.wedding.date.toISOString(),
    dateLong: cfg.wedding.dateLong,
    dateWords: cfg.wedding.dateWords,
    year: cfg.wedding.year,
    dateShort: cfg.wedding.dateShort,
    muhurtham: cfg.wedding.muhurtham,
    icsStart: cfg.wedding.icsStart,
    icsEnd: cfg.wedding.icsEnd,
  },
  venue: place(cfg.venue),
  party: {
    label: cfg.party.label,
    dateLong: cfg.party.dateLong,
    dateShort: cfg.party.dateShort,
    time: cfg.party.time,
    icsDate: cfg.party.icsDate,
    icsStart: cfg.party.icsStart,
    icsEnd: cfg.party.icsEnd,
    blurb: cfg.party.blurb,
    venue: place(cfg.party.venue),
  },
  schedule: cfg.schedule.map((s) => ({ ...s })),
  met: { ...cfg.met },
  story: cfg.story.map((s) => ({ ...s })),
  storyStats: cfg.storyStats.map((s) => ({ ...s })),
  storyLede:
    "None of it was arranged. It began in a classroom halfway between our two homes, and took its own slow route to a morning in November.",
  gallery: cfg.gallery.map((g) => ({ ...g })),
  contact: { ...cfg.contact },
  travel: cfg.travel.map((t) => ({ ...t })),
  faqs: cfg.faqs.map((f) => ({ ...f })),
  blessing: {
    shloka: "ॐ सह नाववतु । सह नौ भुनक्तु ।\nसह वीर्यं करवावहै ।",
    roman: "Om saha nāvavatu · saha nau bhunaktu · saha vīryaṃ karavāvahai",
    gloss:
      "May we be protected together. May we be nourished together.\nMay we work together with great vigour.",
    eyebrow: "No gifts, please",
    quote: "Your presence and your blessings are the only gift we are asking for.",
  },
  site: { title: cfg.site.title, description: cfg.site.description, url: cfg.site.url },
  nav: cfg.nav.map((n) => ({ ...n })),
  design: {
    paper: "#fcf9f4",
    ivory: "#f7f1e8",
    sand: "#efe5d6",
    ink: "#1b2621",
    forest: "#17372b",
    forest2: "#2c5546",
    gold: "#a67c34",
    gold2: "#c9a461",
    goldPale: "#e7d6b4",
    wine: "#7b1f3d",
    muted: "#6d6458",
    displayScale: 1,
    sectionScale: 1,
  },
  sections: [
    { key: "invitation", label: "Invitation", enabled: true },
    { key: "countdown", label: "Countdown", enabled: true },
    { key: "story", label: "Our Story", enabled: true },
    { key: "celebration", label: "Celebration", enabled: true },
    { key: "gallery", label: "Gallery", enabled: true },
    { key: "venue", label: "Venues", enabled: true },
    { key: "rsvp", label: "RSVP", enabled: true },
    { key: "faq", label: "FAQ", enabled: true },
    { key: "blessing", label: "Blessing", enabled: true },
  ],
};

/* ---------------- helpers the components need ---------------- */

export const addressOf = (p: Place) =>
  `${p.name}, ${p.locality}, ${p.city}, ${p.region}`;

export const weddingDate = (c: Content) => new Date(c.wedding.dateISO);

/** Design tokens as the CSS the layout injects. */
export function designCss(d: Design) {
  return `:root{--paper:${d.paper};--ivory:${d.ivory};--sand:${d.sand};--ink:${d.ink};--forest:${d.forest};--forest-2:${d.forest2};--gold:${d.gold};--gold-2:${d.gold2};--gold-pale:${d.goldPale};--wine:${d.wine};--muted:${d.muted};--display-scale:${d.displayScale};--section-scale:${d.sectionScale};}`;
}

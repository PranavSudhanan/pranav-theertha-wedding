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

export type Heading = { eyebrow: string; title: string; lede: string };

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
  /** The heading trio above each section. */
  headings: {
    story: Heading;
    celebration: Heading;
    gallery: Heading;
    venue: Heading;
    rsvp: Heading;
    faq: Heading;
  };
  hero: { eyebrow: string; scroll: string; dayOne: string; dayTwo: string; muhurtham: string };
  countdown: {
    eyebrow: string;
    note: string;
    before: string;
    unitDays: string;
    unitHours: string;
    unitMinutes: string;
    unitSeconds: string;
    saveDate: string;
    pastEyebrow: string;
    pastTitle: string;
    pastNote: string;
  };
  celebration: {
    dayOne: string;
    dayTwo: string;
    muhurtham: string;
    timeTba: string;
    addParty: string;
    addBoth: string;
    directions: string;
    directionsMuhurtham: string;
  };
  venueLabels: { saturday: string; sunday: string; muhurtham: string };
  invitationLabels: { date: string; muhurtham: string; venue: string };
  rsvpForm: {
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    attendingLabel: string;
    accepts: string;
    declines: string;
    daysLabel: string;
    guestsLabel: string;
    guestOptions: string;
    sideLabel: string;
    sideNone: string;
    sideBoth: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    sending: string;
    retry: string;
    hint: string;
    thanksTitle: string;
    thanksBody: string;
    thanksCopy: string;
    download: string;
    shareSelf: string;
    another: string;
    sayHello: string;
    errorTitle: string;
    errorBody: string;
    errorWhatsapp: string;
    errorCall: string;
    errName: string;
    errPhone: string;
    errEmail: string;
    errAttending: string;
  };
  footerLabels: {
    rsvp: string;
    directions: string;
    calendar: string;
    backToTop: string;
    madeWith: string;
  };
  navLabels: { rsvp: string; sections: string; backToTop: string; openMenu: string; closeMenu: string };
  shareLabels: { share: string; copied: string };
  /** Screen-reader only. Nobody sees these; everybody using a reader hears them. */
  a11y: {
    photoViewer: string;
    closePhoto: string;
    prevPhoto: string;
    nextPhoto: string;
    openPhoto: string;
    rsvpSent: string;
    rsvpFailed: string;
  };
  photos: { hero: Photo; countdown: Photo; venueParty: Photo; venueMuhurtham: Photo };
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
  headings: {
    story: {
      eyebrow: "Our Story",
      title: "How we arrived here",
      lede: "Six chapters, four years, and three cities along one coast.",
    },
    celebration: {
      eyebrow: "The Celebration",
      title: "Two days, one family",
      lede: "It begins on the Saturday evening with a party, and ends on Sunday morning with a thaali, a lamp and a leaf full of sadhya.",
    },
    gallery: {
      eyebrow: "Gallery",
      title: "A few of our favourites",
      lede: "All from one afternoon in March 2026 — the day our families first sat in the same room.",
    },
    venue: {
      eyebrow: "The Venues",
      title: "Where to find us",
      lede: "Two halls on two sides of Kozhikode — please check the map for the one you are coming to.",
    },
    rsvp: {
      eyebrow: "RSVP",
      title: "Will you be there?",
      lede: "Kindly respond by 15 October 2026 — it helps us plan the seating, and the sadhya.",
    },
    faq: {
      eyebrow: "Good to know",
      title: "Questions, answered",
      lede: "And if we have missed anything at all, just ask.",
    },
  },
  hero: {
    eyebrow: "Together with our families",
    scroll: "Scroll",
    dayOne: "14 Nov",
    dayTwo: "15 Nov",
    muhurtham: "Muhurtham",
  },
  countdown: {
    eyebrow: "Counting down to the muhurtham",
    note: "The thaali is tied between {muhurtham}.",
    before: "And the evening before — {partyDate}, {partyTime}, at {partyVenue}, {partyLocality}.",
    unitDays: "Days",
    unitHours: "Hours",
    unitMinutes: "Minutes",
    unitSeconds: "Seconds",
    saveDate: "Save the date",
    pastEyebrow: "Thank you for celebrating with us",
    pastTitle: "{groom} & {bride} are married",
    pastNote: "With all our love, and our thanks.",
  },
  celebration: {
    dayOne: "Day One",
    dayTwo: "Day Two",
    muhurtham: "The Muhurtham",
    timeTba: "Time to be announced",
    addParty: "Add the party",
    addBoth: "Add both days to your calendar",
    directions: "Directions",
    directionsMuhurtham: "Directions to the muhurtham",
  },
  venueLabels: { saturday: "Saturday", sunday: "Sunday", muhurtham: "The Muhurtham" },
  invitationLabels: { date: "Date", muhurtham: "Muhurtham", venue: "Venue" },
  rsvpForm: {
    nameLabel: "Your name",
    namePlaceholder: "As you would like it on the place card",
    phoneLabel: "Phone",
    phonePlaceholder: "WhatsApp, ideally",
    emailLabel: "Email",
    emailPlaceholder: "So we can write back",
    attendingLabel: "Can you join us?",
    accepts: "Joyfully accepts",
    declines: "Regretfully declines",
    daysLabel: "Which will you join?",
    guestsLabel: "How many of you?",
    guestOptions: "1, 2, 3, 4, 5, 6, More than 6",
    sideLabel: "Whose guest are you?",
    sideNone: "Prefer not to say",
    sideBoth: "A bit of both",
    messageLabel: "A note for us (optional)",
    messagePlaceholder: "A blessing, a song request, a dietary note…",
    submit: "Send our response",
    sending: "Sending…",
    retry: "Try again",
    hint: "One response per household is plenty.",
    thanksTitle: "Thank you, {name}",
    thanksBody: "Your response is with us. We cannot wait to see you on {date}.",
    thanksCopy: "A copy of the invitation is on its way to {email}.",
    download: "Download the invitation",
    shareSelf: "Send it to yourself on WhatsApp",
    another: "Send another response",
    sayHello: "Say hello on WhatsApp",
    errorTitle: "That did not go through",
    errorBody: "Something went wrong on our side — nothing was lost, please press send once more.",
    errorWhatsapp: "If it keeps refusing, message us on WhatsApp and we will add you by hand.",
    errorCall: "If it keeps refusing, do give us a call and we will add you by hand.",
    errName: "Please tell us your name.",
    errPhone: "A number we can reach you on.",
    errEmail: "That address does not look quite right.",
    errAttending: "Let us know if you can make it.",
  },
  footerLabels: {
    rsvp: "RSVP",
    directions: "Directions",
    calendar: "Add to calendar",
    backToTop: "Back to top",
    madeWith: "Made with love, in Kozhikode.",
  },
  navLabels: {
    rsvp: "RSVP",
    sections: "Sections",
    backToTop: "Back to top",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  shareLabels: { share: "Share", copied: "Link copied" },
  a11y: {
    photoViewer: "Photo viewer",
    closePhoto: "Close",
    prevPhoto: "Previous photo",
    nextPhoto: "Next photo",
    openPhoto: "Open photo {n}: {alt}",
    rsvpSent: "Thank you {name}, your response is with us.",
    rsvpFailed: "Your response could not be sent. Please try again.",
  },
  photos: {
    hero: { src: "/images/couple-07.jpg", alt: "Pranav and Theertha" },
    countdown: { src: "/images/couple-04.jpg", alt: "Pranav and Theertha" },
    venueParty: { src: "/images/couple-01.jpg", alt: "The party venue" },
    venueMuhurtham: { src: "/images/couple-05.jpg", alt: "The muhurtham venue" },
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

/**
 * Fill {tokens} in an editable string.
 *
 * Some copy has to weave a live value through it — the muhurtham time, or
 * the name of whoever just replied. Rather than splitting those sentences
 * into fragments nobody could edit sensibly, the sentence stays one field and
 * the values arrive as {tokens}. An unknown token renders as nothing rather
 * than as itself, so a typo reads as a gap and never as {gibberish}.
 */
export function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

/** Design tokens as the CSS the layout injects. */
export function designCss(d: Design) {
  return `:root{--paper:${d.paper};--ivory:${d.ivory};--sand:${d.sand};--ink:${d.ink};--forest:${d.forest};--forest-2:${d.forest2};--gold:${d.gold};--gold-2:${d.gold2};--gold-pale:${d.goldPale};--wine:${d.wine};--muted:${d.muted};--display-scale:${d.displayScale};--section-scale:${d.sectionScale};}`;
}

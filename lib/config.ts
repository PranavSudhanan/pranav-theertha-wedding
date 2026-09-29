/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT EVERYTHING HERE.
 *  This is the single source of truth for the whole website.
 *  Change a value, save, and the site updates.
 *
 *  Lines marked  // ✎ PLACEHOLDER  are written as sensible
 *  defaults — please read them and make them yours.
 * ─────────────────────────────────────────────────────────────
 */

export const couple = {
  groom: {
    first: "Pranav",
    full: "Pranav S L",
    parents: "Late Sudhanan P & Late Latha S",
    parentLabel: "Son of",
    initial: "P",
    home: "Thiruvananthapuram",
  },
  bride: {
    first: "Theertha",
    full: "Theertha T K",
    parents: "Harish Kumar T K & Nisha Harish",
    parentLabel: "Daughter of",
    initial: "T",
    home: "Kozhikode",
  },
  hashtag: "#PranavWedsTheertha",
} as const;

/** The muhurtham — the main event. Everything else is timed from this. */
export const wedding = {
  /**
   * Muhurtham start, in IST (+05:30).
   * NOTE: 15 November 2026 falls on a SUNDAY. The printed card says
   * "Saturday" — that is the card's error, not a typo here. The party on
   * 14 November is correctly a Saturday.
   */
  date: new Date("2026-11-15T10:00:00+05:30"),
  dateLong: "Sunday, 15 November 2026",
  dateWords: "Sunday, the Fifteenth of November",
  year: "Two Thousand Twenty-Six",
  dateShort: "15 . 11 . 2026",
  muhurtham: "10:00 AM – 10:30 AM",
  /** ISO basic format in UTC, for the .ics calendar file. IST = UTC+5:30 */
  icsStart: "20261115T043000Z",
  icsEnd: "20261115T050000Z",
} as const;

export const venue = {
  name: "Reef Club Resort",
  locality: "Eranhikkal",
  city: "Kozhikode",
  region: "Kerala, India",
  get address() {
    return `${this.name}, ${this.locality}, ${this.city}, ${this.region}`;
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Reef+Club+Resort+Eranhikkal+Kozhikode",
} as const;

/**
 * The celebration the evening before the muhurtham.
 *
 * 4:00–9:00 PM, as printed on the card. The calendar entry matches.
 * (IST is UTC+5:30, so 4:00 PM = 10:30 UTC and 9:00 PM = 15:30 UTC.)
 */
export const party = {
  label: "Wedding Party",
  date: new Date("2026-11-14T12:00:00+05:30"),
  dateLong: "Saturday, 14 November 2026",
  dateShort: "14 . 11 . 2026",
  time: "4:00 PM – 9:00 PM",
  icsDate: "20261114",
  icsStart: "20261114T103000Z",
  icsEnd: "20261114T153000Z",
  blurb:
    "The night before the vows — dinner, music, and everyone we love in one room. Come as you are, stay as long as you like.", // ✎ PLACEHOLDER
  venue: {
    name: "Hilltop Auditorium",
    locality: "Purakkattiri",
    city: "Kozhikode",
    region: "Kerala, India",
    get address() {
      return `${this.name}, ${this.locality}, ${this.city}, ${this.region}`;
    },
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Hilltop+Auditorium+Purakkattiri+Kozhikode",
  },
} as const;

/**
 * The order of the day.
 * The muhurtham is fixed. The surrounding timings are ✎ PLACEHOLDERS —
 * adjust them (or delete the entries) once the day is planned.
 */
export const schedule = [
  {
    time: "9:00 AM",
    title: "Welcome & Reception",
    blurb:
      "Doors open. Come early, find a good seat, and let us greet you over filter coffee.", // ✎ PLACEHOLDER
    accent: false,
  },
  {
    time: "10:00 AM",
    title: "Muhurtham",
    blurb:
      "The auspicious hour. The thaali is tied between 10:00 and 10:30 AM — please be seated by 9:45.",
    accent: true,
  },
  {
    time: "11:30 AM",
    title: "Sadhya",
    blurb:
      "A traditional feast on a banana leaf, served through the afternoon.", // ✎ PLACEHOLDER
    accent: false,
  },
] as const;

/** The city the course was in — neither home, and roughly midway between them. */
export const met = { place: "Kochi", when: "July 2022" } as const;

/** Where the wedding itself happens — used by the last story chapter. */
const venueCity = "Kozhikode";

/**
 * Our story — the real one.
 * Met July 2022 as batch mates on the same course in Kochi; friends first,
 * then not.
 * Her family knew from 2023. March 2026 his family travelled to her home (the
 * photographs on this site are from that day); May 2026 hers travelled to his,
 * and the date was fixed.
 */
export const story = [
  {
    chapter: "I",
    date: met.when,
    title: `A classroom in ${met.place}`,
    body: `Batch mates, nothing more. One of us had come up from ${couple.groom.home} and the other down from ${couple.bride.home}, to a city that sits almost exactly halfway between the two. Neither of us had turned up looking for anything but a certificate.`,
    place: met.place,
    aside: "Two hundred kilometres each, to meet in the middle.",
    image: "/images/couple-07.jpg",
  },
  {
    chapter: "II",
    date: "Then, slowly",
    title: "Friends first",
    body:
      "Friendship came easily, and took its own time turning into something else. By the time either of us thought to name it, it had already happened.",
    place: "", // no single place — this one happened over months
    aside: "The course ended. We did not.",
    image: "/images/couple-02.jpg",
  },
  {
    chapter: "III",
    date: "2023",
    title: "Telling them",
    body: `The year ${couple.bride.first}'s family came to know about us. What the two of us had been carrying quietly became something our families would carry with us.`,
    place: couple.bride.home,
    aside: "Known at home long before it was known to you.",
    image: "/images/couple-06.jpg",
  },
  {
    chapter: "IV",
    date: "March 2026",
    title: `${couple.groom.home} comes to ${couple.bride.home}`,
    body: `${couple.groom.first}'s family made the journey north, to ${couple.bride.first}'s home. Every photograph on this page is from that afternoon — the matching wine, the red roses, the palms in the garden.`,
    place: couple.bride.home,
    aside: "Both of us in wine, and a bunch of red roses.",
    image: "/images/couple-04.jpg",
  },
  {
    chapter: "V",
    date: "May 2026",
    title: `${couple.bride.home} comes to ${couple.groom.home}`,
    body: `Two months later ${couple.bride.first}'s family travelled south. Somewhere between the coffee and the goodbyes, a date was fixed and the waiting turned into planning.`,
    place: couple.groom.home,
    aside: "The same journey, in reverse.",
    image: "/images/couple-08.jpg",
  },
  {
    chapter: "VI",
    date: "15 November 2026",
    title: "And now, the wedding",
    body:
      "Four years from a classroom to a muhurtham. All that is left is the hour itself — and the people we want standing around us when it arrives. We hope that means you.",
    place: venueCity,
    aside: "And this time, everyone travels.",
    image: "/images/couple-05.jpg",
  },
] as const;

/**
 * The line that closes the story. Plain facts, counted.
 */
export const storyStats = [
  { value: "Four", label: "years" },
  { value: "Three", label: "cities" },
  { value: "Two", label: "families" },
  { value: "One", label: "morning in November" },
] as const;

export const gallery = [
  { src: "/images/couple-07.jpg", alt: "Pranav and Theertha smiling together" },
  { src: "/images/couple-04.jpg", alt: "Pranav and Theertha among the palms" },
  { src: "/images/couple-02.jpg", alt: "A quiet moment with the bouquet" },
  { src: "/images/couple-06.jpg", alt: "Portrait of the couple" },
  { src: "/images/couple-08.jpg", alt: "Laughing together at home" },
  { src: "/images/couple-01.jpg", alt: "The first of the roses" },
  { src: "/images/couple-05.jpg", alt: "Side by side" },
  { src: "/images/couple-03.jpg", alt: "Looking at the roses" },
] as const;

/**
 * ✎ PLACEHOLDER — fill in your numbers so guests can reach you.
 * Leave a value as an empty string and the site quietly hides that option.
 * whatsapp: international format, digits only. e.g. "919876543210"
 */
export const contact: {
  whatsapp: string;
  whatsappName: string;
  altPhone: string;
  altPhoneName: string;
  email: string;
} = {
  whatsapp: "",
  whatsappName: "",
  altPhone: "",
  altPhoneName: "",
  email: "",
};

export const travel = [
  {
    label: "By air",
    title: "Calicut International Airport",
    detail:
      "CCJ is the nearest airport, with taxis available at the terminal at all hours.",
  },
  {
    label: "By rail",
    title: "Kozhikode Railway Station",
    detail:
      "Well connected along the Kerala coast. Autos and cabs run from the station to both Eranhikkal and Purakkattiri.",
  },
  {
    label: "On arrival",
    title: "Parking at both venues",
    detail:
      "Parking is available at Hilltop Auditorium and on the Reef Club grounds. Tell the gate you are here for the wedding.", // ✎ PLACEHOLDER
  },
] as const;

export const faqs = [
  {
    q: "There are two days — do I come to both?",
    a: "We would love that. The wedding party is on Saturday, 14 November at Hilltop Auditorium, Purakkattiri; the muhurtham is the next morning, Sunday 15 November, at Reef Club Resort, Eranhikkal. They are two different venues, so do check the map for each. Come to one or to both — just tell us which when you RSVP.",
  },
  {
    q: "When should I arrive for the muhurtham?",
    a: "Please aim to be seated by 9:45 AM. The muhurtham is a narrow window — 10:00 to 10:30 AM — and we would hate for you to miss it.",
  },
  {
    q: "Is there a dress code?",
    a: "Traditional Kerala festive wear for the muhurtham; whatever you feel wonderful in for the party. November mornings in Kozhikode are warm, so dress for the weather.", // ✎ PLACEHOLDER
  },
  {
    q: "Are children welcome?",
    a: "Very much so. This is a family wedding in every sense, and we would love for the little ones to be part of it.",
  },
  {
    q: "What about gifts?",
    a: "Your presence and your blessings are genuinely all we are asking for. Nothing else is expected.",
  },
  {
    q: "Will lunch be served?",
    a: "Yes — a traditional sadhya follows the ceremony. Please do stay and eat with us.", // ✎ PLACEHOLDER
  },
  {
    q: "By when should I RSVP?",
    a: "As soon as you know, and ideally by 15 October 2026. It helps us plan the seating and the sadhya.", // ✎ PLACEHOLDER
  },
] as const;

export const site = {
  title: `${couple.groom.first} & ${couple.bride.first} — ${wedding.dateShort}`,
  description: `${couple.groom.full} and ${couple.bride.full} are getting married on ${wedding.dateLong} at ${venue.name}, ${venue.locality}, ${venue.city}. Join us.`,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pranav-theertha.vercel.app",
} as const;

export const nav = [
  { label: "Invitation", href: "#invitation" },
  { label: "Our Story", href: "#story" },
  { label: "Celebration", href: "#celebration" },
  { label: "Gallery", href: "#gallery" },
  { label: "Venue", href: "#venue" },
  { label: "FAQ", href: "#faq" },
] as const;

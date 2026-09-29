import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Pinyon_Script,
  Jost,
  Tiro_Devanagari_Sanskrit,
} from "next/font/google";
import { getContent, designCss } from "@/lib/content";
import { ContentProvider } from "@/lib/content-client";
import ScrollFx from "@/components/ScrollFx";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--f-display",
  display: "swap",
});

const script = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--f-script",
  display: "swap",
});

/** For the om and the mangala shloka — a face cut for Sanskrit. */
const deva = Tiro_Devanagari_Sanskrit({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--f-deva",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--f-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { site, couple, venue } = await getContent();
  return {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: [
    "wedding",
    couple.groom.full,
    couple.bride.full,
    venue.name,
    venue.city,
    "Kerala wedding",
  ],
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.title,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  alternates: { canonical: site.url },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#fcf9f4",
  width: "device-width",
  initialScale: 1,
};

const place = (v: {
  name: string;
  locality: string;
  city: string;
}) => ({
  "@type": "Place",
  name: v.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: v.locality,
    addressLocality: v.city,
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
});

const buildJsonLd = (c: Awaited<ReturnType<typeof getContent>>) => {
  const { site, couple, party, venue, wedding } = c;
  return [
  {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${couple.groom.full} & ${couple.bride.full} — Wedding`,
    startDate: wedding.dateISO,
    endDate: wedding.dateISO,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    description: site.description,
    image: [`${site.url}/images/couple-07.jpg`],
    location: place(venue),
  },
  {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${couple.groom.full} & ${couple.bride.full} — ${party.label}`,
    startDate: party.icsDate,
    endDate: party.icsDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    description: party.blurb,
    image: [`${site.url}/images/couple-07.jpg`],
    location: place(party.venue),
  },
];
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getContent();
  return (
    <html
      lang="en"
      className={`${display.variable} ${script.variable} ${sans.variable} ${deva.variable}`}
      // The inline script below adds an `fx` class to this element before
      // React hydrates — deliberately, so the reveal styles are in place at
      // first paint. That makes the client's className differ from the
      // server's by exactly that one class, which React would otherwise warn
      // about. Scoped to this element only; children still hydrate strictly.
      suppressHydrationWarning
    >
      <head>
        {/* Arms the reveal animations before first paint. If this never runs —
            JS off, a stalled bundle, reduce-motion — the page simply renders
            everything, visible and static. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('fx')}}catch(e){}",
          }}
        />
        {/* Design tokens from the admin panel, overriding globals.css. */}
        <style dangerouslySetInnerHTML={{ __html: designCss(content.design) }} />
      </head>
      <body>
        <a className="skip" href="#invitation">
          Skip to content
        </a>
        <ScrollFx />
        <ContentProvider value={content}>{children}</ContentProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(content)) }}
        />
      </body>
    </html>
  );
}

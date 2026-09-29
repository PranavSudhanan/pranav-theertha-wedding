import { getContent } from "@/lib/content";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Invitation from "@/components/Invitation";
import Countdown from "@/components/Countdown";
import Story from "@/components/Story";
import Celebration from "@/components/Celebration";
import Gallery from "@/components/Gallery";
import Venue from "@/components/Venue";
import Rsvp from "@/components/Rsvp";
import Faq from "@/components/Faq";
import Blessing from "@/components/Blessing";
import Footer from "@/components/Footer";
import { Paisley } from "@/components/Ornaments";

/** Order and visibility both come from the content document. */
const SECTIONS = {
  invitation: Invitation,
  countdown: Countdown,
  story: Story,
  celebration: Celebration,
  gallery: Gallery,
  venue: Venue,
  rsvp: Rsvp,
  faq: Faq,
  blessing: Blessing,
} as const;

export default async function Home() {
  const { sections } = await getContent();
  const on = sections.filter((s) => s.enabled);

  return (
    <>
      <Preloader />
      <Nav />

      <main>
        <Hero />
        {on.map(({ key }, i) => {
          const Section = SECTIONS[key];
          if (!Section) return null;
          // a small motif wherever two pale sections meet
          const seam = key === "venue" && on[i - 1]?.key === "gallery";
          return (
            <div key={key} style={{ display: "contents" }}>
              {seam && (
                <div className="seam" aria-hidden="true">
                  <Paisley />
                </div>
              )}
              <Section />
            </div>
          );
        })}
      </main>

      <Footer />
    </>
  );
}

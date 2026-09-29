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

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />

      <main>
        <Hero />
        <Invitation />
        <Countdown />
        <Story />
        <Celebration />
        <Gallery />

        <div className="seam" aria-hidden="true">
          <Paisley />
        </div>

        <Venue />
        <Rsvp />
        <Faq />
        <Blessing />
      </main>

      <Footer />
    </>
  );
}

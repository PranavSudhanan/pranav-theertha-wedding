import Image from "next/image";
import { couple, party, venue, wedding } from "@/lib/config";
import { Rule } from "./Ornaments";
import CalendarButton from "./CalendarButton";
import { img } from "@/lib/images";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="shell hero__grid">
        <div className="hero__copy">
          <span className="mask" style={{ ["--d" as string]: "80ms" }}>
            <span className="eyebrow">Together with our families</span>
          </span>

          <h1 className="hero__names">
            <span className="mask" style={{ ["--d" as string]: "180ms" }}>
              <span className="hero__name">{couple.groom.first}</span>
            </span>
            <span className="mask" style={{ ["--d" as string]: "300ms" }}>
              <span className="hero__amp">&amp;</span>
            </span>
            <span className="mask" style={{ ["--d" as string]: "380ms" }}>
              <span className="hero__name">{couple.bride.first}</span>
            </span>
          </h1>

          <div
            data-reveal="fade"
            style={{ ["--d" as string]: "620ms", width: "100%" }}
          >
            <Rule className="hero__rule" />
          </div>

          <div className="hero__meta">
            <span className="mask" style={{ ["--d" as string]: "700ms" }}>
              <span className="hero__date">{wedding.dateWords}</span>
            </span>
            <span className="mask" style={{ ["--d" as string]: "760ms" }}>
              <span className="hero__date">{wedding.year}</span>
            </span>
          </div>

          <ul
            className="hero__plan"
            data-reveal
            style={{ ["--d" as string]: "840ms" }}
          >
            <li>
              <span className="hero__plan-day">14 Nov</span>
              <span className="hero__plan-what">{party.label}</span>
              <span className="hero__plan-where">{party.venue.name}</span>
            </li>
            <li>
              <span className="hero__plan-day">15 Nov</span>
              <span className="hero__plan-what">Muhurtham</span>
              <span className="hero__plan-where">{venue.name}</span>
            </li>
          </ul>

          <div
            className="hero__actions"
            data-reveal
            style={{ ["--d" as string]: "880ms" }}
          >
            <a href="#rsvp" className="btn btn-solid">
              RSVP
            </a>
            <CalendarButton />
          </div>
        </div>

        <figure
          className="hero__figure"
          data-reveal="zoom"
          style={{ ["--d" as string]: "260ms" }}
        >
          <span className="arch-frame" aria-hidden="true" />
          <div className="arch">
            <Image
              src={img("/images/couple-07.jpg")}
              alt={`${couple.groom.first} and ${couple.bride.first}`}
              placeholder="blur"
              priority
              sizes="(min-width: 1200px) 50vw, (min-width: 900px) 34vw, 100vw"
            />
          </div>
          <figcaption className="hero__stamp">{wedding.dateShort}</figcaption>
        </figure>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}

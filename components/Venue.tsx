import Image from "next/image";
import { getContent } from "@/lib/content";
import SectionHead from "./SectionHead";
import { Kalasha, Nilavilakku, Pin } from "./Ornaments";
import { photoProps } from "@/lib/images";

export default async function Venue() {
  const { party, travel, venue, wedding, headings, venueLabels, photos } = await getContent();

  const places = [
    {
      motif: <Kalasha />,
      tag: venueLabels.saturday,
      date: party.dateLong,
      time: party.time,
      what: party.label,
      name: party.venue.name,
      where: `${party.venue.locality}, ${party.venue.city}`,
      region: party.venue.region,
      maps: party.venue.mapsUrl,
      photo: photos.venueParty,
      accent: false,
    },
    {
      motif: <Nilavilakku />,
      tag: venueLabels.sunday,
      date: wedding.dateLong,
      time: wedding.muhurtham,
      what: venueLabels.muhurtham,
      name: venue.name,
      where: `${venue.locality}, ${venue.city}`,
      region: venue.region,
      maps: venue.mapsUrl,
      photo: photos.venueMuhurtham,
      accent: true,
    },
  ];

  return (
    <section className="band" id="venue">
      <div className="shell">
        <SectionHead
          {...headings.venue}
        />

        <div className="places">
          {places.map((p, i) => (
            <article
              className={`place ${p.accent ? "place--accent" : ""}`}
              key={p.name}
              data-reveal
              style={{ ["--d" as string]: `${i * 120}ms` }}
            >
              <figure className="place__figure">
                <Image
                  {...photoProps(p.photo)}
                  alt={`${p.what} — ${p.name}`}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 860px) 46vw, 92vw"
                  style={{ objectFit: "cover", objectPosition: "center 26%" }}
                />
                <span className="place__motif" aria-hidden="true">
                  {p.motif}
                </span>
              </figure>

              <div className="place__body">
                <span className="place__tag">
                  {p.tag} &nbsp;·&nbsp; {p.what}
                </span>
                <h3 className="place__name">{p.name}</h3>
                <p className="place__where">
                  {p.where}
                  <br />
                  <span>{p.region}</span>
                </p>
                <p className="place__date">
                  {p.date}
                  <span className="place__time">{p.time}</span>
                </p>
                <a
                  className={`btn ${p.accent ? "btn-solid" : "btn-ghost"}`}
                  href={p.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Pin />
                  Open in Google Maps
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="travel">
          {travel.map((t, i) => (
            <div
              className="travel__item"
              key={t.label}
              data-reveal
              style={{ ["--d" as string]: `${i * 110}ms` }}
            >
              <span className="travel__label">{t.label}</span>
              <h3 className="travel__title">{t.title}</h3>
              <p className="travel__detail">{t.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

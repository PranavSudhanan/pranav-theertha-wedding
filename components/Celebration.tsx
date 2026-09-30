import { getContent } from "@/lib/content";
import SectionHead from "./SectionHead";
import CalendarButton from "./CalendarButton";
import { Kalasha, Nilavilakku, Pin } from "./Ornaments";

function DayHead({
  motif,
  day,
  date,
  title,
  venueName,
  venuePlace,
  delay = 0,
}: {
  motif: React.ReactNode;
  day: string;
  date: string;
  title: string;
  venueName: string;
  venuePlace: string;
  delay?: number;
}) {
  return (
    <header className="day__head" data-reveal style={{ ["--d" as string]: `${delay}ms` }}>
      <span className="day__motif" aria-hidden="true">
        {motif}
      </span>
      <span className="day__eyebrow">
        {day} &nbsp;·&nbsp; {date}
      </span>
      <h3 className="day__title">{title}</h3>
      <p className="day__venue">
        {venueName}
        <span>
          {" "}
          &nbsp;·&nbsp; {venuePlace}
        </span>
      </p>
    </header>
  );
}

export default async function Celebration() {
  const { party, schedule, venue, wedding, headings, celebration } = await getContent();

  return (
    <section className="band bg-ivory" id="celebration">
      <div className="shell">
        <SectionHead
          {...headings.celebration}
        />

        {/* ── Day one ───────────────────────────────── */}
        <article className="day">
          <DayHead
            motif={<Kalasha />}
            day={celebration.dayOne}
            date={party.dateLong}
            title={party.label}
            venueName={party.venue.name}
            venuePlace={`${party.venue.locality}, ${party.venue.city}`}
          />

          <div className="day__feature" data-reveal style={{ ["--d" as string]: "80ms" }}>
            <span className="sched__time">
              {party.time || celebration.timeTba}
            </span>
            <p className="day__blurb">{party.blurb}</p>
            <div className="day__actions">
              <CalendarButton
                className="btn btn-ghost"
                label={celebration.addParty}
                which="party"
              />
              <a
                className="btn btn-ghost"
                href={party.venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Pin />
                {celebration.directions}
              </a>
            </div>
          </div>
        </article>

        {/* ── Day two ───────────────────────────────── */}
        <article className="day">
          <DayHead
            motif={<Nilavilakku />}
            day={celebration.dayTwo}
            date={wedding.dateLong}
            title={celebration.muhurtham}
            venueName={venue.name}
            venuePlace={`${venue.locality}, ${venue.city}`}
          />

          <div className="sched">
            {schedule.map((item, i) => (
              <div
                className={`sched__item ${item.accent ? "accent" : ""}`}
                key={item.title}
                data-reveal
                style={{ ["--d" as string]: `${i * 110}ms` }}
              >
                <span className="sched__time">{item.time}</span>
                <h4 className="sched__name">{item.title}</h4>
                <p className="sched__blurb">{item.blurb}</p>
              </div>
            ))}
          </div>

          <div className="day__actions day__actions--centre" data-reveal>
            <CalendarButton
              className="btn"
              label={celebration.addBoth}
              which="both"
            />
            <a
              className="btn btn-ghost"
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Pin />
              {celebration.directionsMuhurtham}
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

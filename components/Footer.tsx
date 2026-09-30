import { getContent } from "@/lib/content";
import ShareButton from "./ShareButton";
import CalendarButton from "./CalendarButton";

export default async function Footer() {
  const { couple, venue, wedding, footerLabels } = await getContent();

  return (
    <footer className="foot">
      <div className="shell">
        <div data-reveal="fade">
          <span className="foot__mono">
            {couple.groom.initial} &amp; {couple.bride.initial}
          </span>
          <p className="foot__names">
            {couple.groom.full} &nbsp;&amp;&nbsp; {couple.bride.full}
          </p>
          <p className="foot__date">
            {wedding.dateShort} &nbsp;·&nbsp; {venue.name}, {venue.city}
          </p>
        </div>

        <div className="foot__links" data-reveal="fade">
          <a className="foot__link" href="#rsvp">
            {footerLabels.rsvp}
          </a>
          <a
            className="foot__link"
            href={venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {footerLabels.directions}
          </a>
          <CalendarButton className="foot__link" label={footerLabels.calendar} />
          <ShareButton />
          <a className="foot__link" href="#top">
            {footerLabels.backToTop}
          </a>
        </div>

        <div className="foot__base">
          <span>{couple.hashtag}</span>
          <span>{footerLabels.madeWith}</span>
        </div>
      </div>
    </footer>
  );
}

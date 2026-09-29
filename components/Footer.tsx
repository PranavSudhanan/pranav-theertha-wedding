import { couple, venue, wedding } from "@/lib/config";
import ShareButton from "./ShareButton";
import CalendarButton from "./CalendarButton";

export default function Footer() {
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
            RSVP
          </a>
          <a
            className="foot__link"
            href={venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Directions
          </a>
          <CalendarButton className="foot__link" label="Add to calendar" />
          <ShareButton />
          <a className="foot__link" href="#top">
            Back to top
          </a>
        </div>

        <div className="foot__base">
          <span>{couple.hashtag}</span>
          <span>Made with love, in Kozhikode.</span>
        </div>
      </div>
    </footer>
  );
}

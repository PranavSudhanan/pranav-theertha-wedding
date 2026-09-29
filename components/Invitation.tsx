import { getContent } from "@/lib/content";
import { CornerLeaves, Ganesha, Mandala, Rule } from "./Ornaments";

function Person({
  name,
  label,
  parents,
  delay,
}: {
  name: string;
  label: string;
  parents: string;
  delay: number;
}) {
  return (
    <div data-reveal style={{ ["--d" as string]: `${delay}ms` }}>
      <p className="invite__name">{name}</p>
      <p className="invite__rel">{label}</p>
      <p className="invite__parents">{parents}</p>
    </div>
  );
}

export default async function Invitation() {
  const { couple, party, venue, wedding } = await getContent();

  return (
    <section className="invite band" id="invitation">
      {/* A kolam drawn faintly across the whole band, so the card sits on
          something rather than in the middle of bare paper. */}
      <span className="invite__kolam" aria-hidden="true">
        <Mandala />
      </span>

      <div className="shell-narrow">
        <article className="invite__card">
          <CornerLeaves className="invite__corner tl" />
          <CornerLeaves className="invite__corner br" />

          <div data-reveal="fade">
            <span className="om" aria-label="Om">
              ॐ
            </span>
            <Ganesha className="invite__ganesha" />
            <p className="invite__blessing">
              With the blessings of the Almighty
            </p>
          </div>

          <div style={{ margin: "1.6rem 0 1.8rem" }} data-reveal="fade">
            <Rule />
          </div>

          <p
            className="invite__intro"
            data-reveal
            style={{ ["--d" as string]: "60ms" }}
          >
            We cordially invite you to grace the auspicious wedding ceremony of
          </p>

          <div style={{ marginTop: "1.6rem" }}>
            <Person
              name={couple.groom.full}
              label={couple.groom.parentLabel}
              parents={couple.groom.parents}
              delay={120}
            />

            <p
              className="invite__with"
              data-reveal="fade"
              style={{ ["--d" as string]: "160ms" }}
            >
              with
            </p>

            <Person
              name={couple.bride.full}
              label={couple.bride.parentLabel}
              parents={couple.bride.parents}
              delay={200}
            />
          </div>

          <dl className="invite__details" data-reveal>
            <div className="invite__row">
              <dt>Date</dt>
              <dd>{wedding.dateLong}</dd>
            </div>
            <div className="invite__row">
              <dt>Muhurtham</dt>
              <dd>{wedding.muhurtham}</dd>
            </div>
            <div className="invite__row">
              <dt>Venue</dt>
              <dd>
                {venue.name}
                <br />
                <span style={{ fontSize: "0.72em", opacity: 0.8 }}>
                  {venue.locality}, {venue.city}
                </span>
              </dd>
            </div>
          </dl>

          <div style={{ marginTop: "clamp(1.8rem, 4vw, 2.6rem)" }} data-reveal="fade">
            <Rule />
          </div>

          <div className="invite__party" data-reveal>
            <span className="invite__party-label">{party.label}</span>
            <div className="invite__party-grid">
              <div>
                <p className="invite__party-strong">{party.dateLong}</p>
                {party.time && (
                  <p className="invite__party-soft">{party.time}</p>
                )}
              </div>
              <div>
                <p className="invite__party-strong">{party.venue.name}</p>
                <p className="invite__party-soft">
                  {party.venue.locality}, {party.venue.city}
                </p>
              </div>
            </div>
          </div>

          <p className="invite__closing" data-reveal="fade">
            Your gracious presence and blessings will make this joyous occasion
            even more memorable.
          </p>
        </article>
      </div>
    </section>
  );
}

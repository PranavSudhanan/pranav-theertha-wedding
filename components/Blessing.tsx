import { getContent } from "@/lib/content";
import { Mandala, Paisley } from "./Ornaments";

export default async function Blessing() {
  const { couple, blessing } = await getContent();

  return (
    <section className="band blessing">
      <span className="blessing__mandala" aria-hidden="true">
        <Mandala />
      </span>

      <div className="shell-narrow">
        <div data-reveal="fade">
          <p className="blessing__shloka deva" lang="sa">
            {blessing.shloka}
          </p>
          <p className="blessing__roman">{blessing.roman}</p>
          <p className="blessing__gloss">{blessing.gloss}</p>
        </div>

        <span
          className="blessing__paisley"
          data-reveal="fade"
          aria-hidden="true"
        >
          <Paisley />
        </span>

        <p
          className="eyebrow"
          data-reveal="fade"
          style={{ ["--d" as string]: "80ms" }}
        >
          {blessing.eyebrow}
        </p>
        <p
          className="blessing__quote"
          data-reveal
          style={{ ["--d" as string]: "160ms", marginTop: "1.2rem" }}
        >
          {blessing.quote}
        </p>
        <p
          className="eyebrow"
          data-reveal="fade"
          style={{ ["--d" as string]: "280ms", marginTop: "2rem" }}
        >
          {couple.hashtag}
        </p>
      </div>
    </section>
  );
}

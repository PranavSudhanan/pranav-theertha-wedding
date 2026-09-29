import { couple } from "@/lib/config";
import { Mandala, Paisley } from "./Ornaments";

export default function Blessing() {
  return (
    <section className="band blessing">
      <span className="blessing__mandala" aria-hidden="true">
        <Mandala />
      </span>

      <div className="shell-narrow">
        <div data-reveal="fade">
          <p className="blessing__shloka deva" lang="sa">
            ॐ सह नाववतु । सह नौ भुनक्तु ।
            <br />
            सह वीर्यं करवावहै ।
          </p>
          <p className="blessing__roman">
            Om saha nāvavatu · saha nau bhunaktu · saha vīryaṃ karavāvahai
          </p>
          <p className="blessing__gloss">
            May we be protected together. May we be nourished together.
            <br />
            May we work together with great vigour.
          </p>
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
          No gifts, please
        </p>
        <p
          className="blessing__quote"
          data-reveal
          style={{ ["--d" as string]: "160ms", marginTop: "1.2rem" }}
        >
          Your presence and your blessings are the only gift we are asking for.
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

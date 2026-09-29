import Image from "next/image";
import { story } from "@/lib/config";
import SectionHead from "./SectionHead";
import { img } from "@/lib/images";

export default function Story() {
  return (
    <section className="band" id="story">
      <div className="shell">
        <SectionHead
          eyebrow="Our Story"
          title="How we arrived here"
          lede="Six chapters, four years, and three cities along one coast."
        />

        <div style={{ marginTop: "clamp(2rem, 5vw, 3.5rem)" }}>
          {story.map((item, i) => (
            <article className="story__item" key={item.chapter}>
              <figure
                className="story__figure"
                data-reveal="zoom"
                style={{ ["--d" as string]: "60ms" }}
              >
                <Image
                  src={img(item.image)}
                  alt={item.title}
                  placeholder="blur"
                  sizes="(min-width: 860px) 46vw, 92vw"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </figure>

              <div className="story__body">
                <span className="story__chapter" aria-hidden="true">
                  {item.chapter}
                </span>
                <span
                  className="story__date"
                  data-reveal
                  style={{ ["--d" as string]: "80ms" }}
                >
                  {item.date}
                </span>
                <h3 className="story__title mask" style={{ ["--d" as string]: "140ms" }}>
                  <span>{item.title}</span>
                </h3>
                <p
                  className="prose"
                  data-reveal
                  style={{ ["--d" as string]: "220ms" }}
                >
                  {item.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

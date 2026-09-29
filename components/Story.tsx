import Image from "next/image";
import { getContent } from "@/lib/content";
import SectionHead from "./SectionHead";
import { Paisley, Pin } from "./Ornaments";
import { photoProps } from "@/lib/images";

export default async function Story() {
  const { story, storyStats, storyLede } = await getContent();

  return (
    <section className="band" id="story">
      <div className="shell">
        <SectionHead
          eyebrow="Our Story"
          title="How we arrived here"
          lede="Six chapters, four years, and three cities along one coast."
        />

        <p
          className="story__lede"
          data-reveal
          style={{ ["--d" as string]: "280ms" }}
        >
          {storyLede}
        </p>

        {/* A single gold thread runs the length of this, with a marker
            at each chapter — the spine of the whole section. */}
        <div className="story__thread">
          {story.map((item, i) => (
            <article className="story__item" key={item.chapter}>
              <figure
                className="story__figure"
                data-reveal="zoom"
                style={{ ["--d" as string]: "60ms" }}
              >
                <Image
                  {...photoProps({
                    src: item.image,
                    width: item.imageWidth,
                    height: item.imageHeight,
                    blurDataURL: item.imageBlur,
                  })}
                  alt={item.title}
                  sizes="(min-width: 860px) 34vw, 92vw"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <figcaption className="story__roman" aria-hidden="true">
                  {item.chapter}
                </figcaption>
              </figure>

              <div className="story__body">
                <div
                  className="story__meta"
                  data-reveal
                  style={{ ["--d" as string]: "80ms" }}
                >
                  <span className="story__date">{item.date}</span>
                  {item.place && (
                    <span className="story__place">
                      <Pin />
                      {item.place}
                    </span>
                  )}
                </div>

                <h3
                  className="story__title mask"
                  style={{ ["--d" as string]: "140ms" }}
                >
                  <span>{item.title}</span>
                </h3>

                <p
                  className="prose"
                  data-reveal
                  style={{ ["--d" as string]: "220ms" }}
                >
                  {item.body}
                </p>

                {item.aside && (
                  <p
                    className="story__aside"
                    data-reveal
                    style={{ ["--d" as string]: "300ms" }}
                  >
                    <span aria-hidden="true">
                      <Paisley />
                    </span>
                    {item.aside}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="story__count" data-reveal>
          {storyStats.map((s) => (
            <div className="story__stat" key={s.label}>
              <span className="story__stat-value">{s.value}</span>
              <span className="story__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

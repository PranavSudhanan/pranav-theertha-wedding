import { Rule } from "./Ornaments";

/**
 * `align="left"` is for the two-column sections (RSVP, FAQ). It only takes
 * effect once those sections actually have two columns — below 1200px they
 * stack, and the heading centres again like every other section. That
 * switch lives in CSS, so the alignment has to be a class rather than an
 * inline style.
 */
export default function SectionHead({
  eyebrow,
  title,
  lede,
  align = "center",
  tone = "dark",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  const left = align === "left";

  return (
    <header className={`s-head ${left ? "s-head--left" : ""}`}>
      <div data-reveal="fade">
        <Rule left={left} className="s-head__rule" />
      </div>

      <span
        className="eyebrow"
        data-reveal="fade"
        style={{ ["--d" as string]: "60ms" }}
      >
        {eyebrow}
      </span>

      <h2
        className="s-title mask"
        style={{
          ["--d" as string]: "120ms",
          color: tone === "light" ? "var(--paper)" : undefined,
        }}
      >
        <span>{title}</span>
      </h2>

      {lede && (
        <p
          className="lede s-head__lede"
          data-reveal
          style={{
            ["--d" as string]: "220ms",
            color: tone === "light" ? "rgba(252,249,244,.78)" : undefined,
          }}
        >
          {lede}
        </p>
      )}
    </header>
  );
}

import Link from "next/link";
import { couple, wedding } from "@/lib/config";
import { Rule } from "@/components/Ornaments";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "var(--gutter)",
        background:
          "radial-gradient(120% 90% at 80% 10%, rgba(231,214,180,.45), transparent 60%), var(--paper)",
      }}
    >
      <div style={{ display: "grid", justifyItems: "center", gap: "1.4rem" }}>
        <span
          style={{
            fontFamily: "var(--font-script)",
            fontSize: "clamp(3rem, 9vw, 5rem)",
            color: "var(--gold)",
            lineHeight: 1,
          }}
        >
          {couple.groom.initial} &amp; {couple.bride.initial}
        </span>
        <Rule />
        <h1 className="s-title" style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)" }}>
          This page has wandered off
        </h1>
        <p className="prose" style={{ marginInline: "auto" }}>
          Everything about {wedding.dateLong} is on the invitation itself.
        </p>
        <Link className="btn btn-solid" href="/">
          Back to the invitation
        </Link>
      </div>
    </main>
  );
}

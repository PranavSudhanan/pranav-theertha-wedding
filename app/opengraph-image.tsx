import { ImageResponse } from "next/og";
import { couple, party, venue, wedding } from "@/lib/config";
import { googleFont } from "@/lib/og-font";

export const alt = `${couple.groom.full} & ${couple.bride.full} — ${wedding.dateLong}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#fcf9f4";
const FOREST = "#17372b";
const GOLD = "#a67c34";
const GOLD_2 = "#c9a461";
const MUTED = "#6d6458";

export default async function OpengraphImage() {
  const [display, script] = await Promise.all([
    googleFont("Cormorant Garamond", 300),
    googleFont("Pinyon Script", 400),
  ]);

  const fonts = [
    ...(display
      ? [{ name: "Cormorant", data: display, weight: 300 as const, style: "normal" as const }]
      : []),
    ...(script
      ? [{ name: "Pinyon", data: script, weight: 400 as const, style: "normal" as const }]
      : []),
  ];

  const serif = display ? "Cormorant" : "serif";
  const cursive = script ? "Pinyon" : "serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: PAPER,
          position: "relative",
        }}
      >
        {/* double gold frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `1px solid ${GOLD_2}`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 38,
            left: 38,
            right: 38,
            bottom: 38,
            border: `1px solid rgba(166,124,52,0.35)`,
            display: "flex",
          }}
        />

        <div
          style={{
            fontSize: 20,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: GOLD,
            display: "flex",
          }}
        >
          Together with our families
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 26,
          }}
        >
          <div
            style={{
              fontFamily: serif,
              fontSize: 108,
              lineHeight: 1,
              color: FOREST,
              display: "flex",
            }}
          >
            {couple.groom.first}
          </div>
          <div
            style={{
              fontFamily: cursive,
              fontSize: 62,
              lineHeight: 1,
              color: GOLD,
              margin: "4px 0 2px",
              display: "flex",
            }}
          >
            &amp;
          </div>
          <div
            style={{
              fontFamily: serif,
              fontSize: 108,
              lineHeight: 1,
              color: FOREST,
              display: "flex",
            }}
          >
            {couple.bride.first}
          </div>
        </div>

        {/* rule with a diamond */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 34,
          }}
        >
          <div style={{ width: 120, height: 1, background: GOLD_2, display: "flex" }} />
          <div
            style={{
              width: 9,
              height: 9,
              border: `1px solid ${GOLD}`,
              transform: "rotate(45deg)",
              display: "flex",
            }}
          />
          <div style={{ width: 120, height: 1, background: GOLD_2, display: "flex" }} />
        </div>

        <div
          style={{
            fontFamily: serif,
            fontSize: 42,
            color: "#2c5546",
            marginTop: 26,
            display: "flex",
          }}
        >
          {wedding.dateLong}
        </div>

        <div
          style={{
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: MUTED,
            marginTop: 12,
            display: "flex",
          }}
        >
          {venue.name} · {venue.locality}, {venue.city}
        </div>

        <div
          style={{
            fontSize: 17,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: GOLD,
            marginTop: 30,
            display: "flex",
          }}
        >
          {party.label} · {party.dateLong}
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}

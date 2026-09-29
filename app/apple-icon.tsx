import { ImageResponse } from "next/og";
import { couple } from "@/lib/config";
import { googleFont } from "@/lib/og-font";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const script = await googleFont("Pinyon Script", 400);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#17372b",
          color: "#c9a461",
          fontFamily: script ? "Pinyon" : "serif",
          fontSize: 92,
        }}
      >
        {couple.groom.initial}&amp;{couple.bride.initial}
      </div>
    ),
    {
      ...size,
      fonts: script
        ? [{ name: "Pinyon", data: script, weight: 400, style: "normal" }]
        : [],
    }
  );
}

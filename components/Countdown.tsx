"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { couple, party, wedding } from "@/lib/config";
import { Rule } from "./Ornaments";
import CalendarButton from "./CalendarButton";
import { img } from "@/lib/images";

const UNITS = ["Days", "Hours", "Minutes", "Seconds"] as const;

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    Math.floor(s / 86400),
    Math.floor((s % 86400) / 3600),
    Math.floor((s % 3600) / 60),
    s % 60,
  ];
}

export default function Countdown() {
  const [parts, setParts] = useState<number[] | null>(null);
  const [past, setPast] = useState(false);

  useEffect(() => {
    const tick = () => {
      const delta = wedding.date.getTime() - Date.now();
      setPast(delta <= 0);
      setParts(split(delta));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="count" aria-labelledby="count-title">
      <div className="count__bg" aria-hidden="true">
        <Image
          src={img("/images/couple-04.jpg")}
          alt=""
          fill
          priority={false}
          placeholder="blur"
          data-parallax="0.12"
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
      </div>

      <div className="shell center">
        <div data-reveal="fade">
          <span className="eyebrow">
            {past ? "Thank you for celebrating with us" : "Counting down to the muhurtham"}
          </span>
        </div>

        <h2
          className="count__title"
          id="count-title"
          data-reveal
          style={{ ["--d" as string]: "80ms", marginTop: "1rem" }}
        >
          {past ? (
            <>
              {couple.groom.first} &amp; {couple.bride.first} are married
            </>
          ) : (
            <>{wedding.dateLong}</>
          )}
        </h2>

        <div style={{ marginTop: "1.4rem" }} data-reveal="fade">
          <Rule />
        </div>

        <div
          className="count__grid"
          data-reveal
          style={{ ["--d" as string]: "140ms" }}
          role="timer"
          aria-live="off"
        >
          {UNITS.map((unit, i) => (
            <div className="count__cell" key={unit}>
              <div className="count__num">
                {parts ? (
                  <span className="count__roll" key={parts[i]}>
                    {String(parts[i]).padStart(2, "0")}
                  </span>
                ) : (
                  <span>&ndash;&ndash;</span>
                )}
              </div>
              <div className="count__lbl">{unit}</div>
            </div>
          ))}
        </div>

        <p
          className="count__note"
          data-reveal="fade"
          style={{ ["--d" as string]: "200ms" }}
        >
          {past
            ? "With all our love, and our thanks."
            : `The thaali is tied between ${wedding.muhurtham}.`}
        </p>

        {!past && (
          <p
            className="count__before"
            data-reveal="fade"
            style={{ ["--d" as string]: "240ms" }}
          >
            And the evening before — {party.dateLong}, {party.time}, at{" "}
            {party.venue.name}, {party.venue.locality}.
          </p>
        )}

        <div
          data-reveal
          style={{ marginTop: "2rem", ["--d" as string]: "260ms" }}
        >
          <CalendarButton className="btn btn-light" label="Save the date" />
        </div>
      </div>
    </section>
  );
}

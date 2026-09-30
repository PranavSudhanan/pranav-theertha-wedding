"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useContent } from "@/lib/content-client";
import { fill, weddingDate } from "@/lib/content-types";
import { Rule } from "./Ornaments";
import CalendarButton from "./CalendarButton";
import { photoProps } from "@/lib/images";



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
  const content = useContent();
  const { couple, party, wedding, countdown, photos } = content;
  const units = [
    countdown.unitDays,
    countdown.unitHours,
    countdown.unitMinutes,
    countdown.unitSeconds,
  ];
  const [parts, setParts] = useState<number[] | null>(null);
  const [past, setPast] = useState(false);

  useEffect(() => {
    const tick = () => {
      const delta = weddingDate(content).getTime() - Date.now();
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
          {...photoProps(photos.countdown)}
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
            {past ? countdown.pastEyebrow : countdown.eyebrow}
          </span>
        </div>

        <h2
          className="count__title"
          id="count-title"
          data-reveal
          style={{ ["--d" as string]: "80ms", marginTop: "1rem" }}
        >
          {past
            ? fill(countdown.pastTitle, {
                groom: couple.groom.first,
                bride: couple.bride.first,
              })
            : wedding.dateLong}
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
          {units.map((unit, i) => (
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
            ? countdown.pastNote
            : fill(countdown.note, { muhurtham: wedding.muhurtham })}
        </p>

        {!past && (
          <p
            className="count__before"
            data-reveal="fade"
            style={{ ["--d" as string]: "240ms" }}
          >
            {fill(countdown.before, {
              partyDate: party.dateLong,
              partyTime: party.time,
              partyVenue: party.venue.name,
              partyLocality: party.venue.locality,
            })}
          </p>
        )}

        <div
          data-reveal
          style={{ marginTop: "2rem", ["--d" as string]: "260ms" }}
        >
          <CalendarButton className="btn btn-light" label={countdown.saveDate} />
        </div>
      </div>
    </section>
  );
}

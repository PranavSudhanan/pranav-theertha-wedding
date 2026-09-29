"use client";

import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/content-types";
import { uploadPhoto } from "./upload-photo";

export default function GalleryEditor({
  value,
  onChange,
}: {
  value: Photo[];
  onChange: (next: Photo[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [kind, setKind] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/upload")
      .then((r) => r.json())
      .then((d) => setKind(d.uploadKind ?? null))
      .catch(() => {});
  }, []);

  const add = async (files: FileList) => {
    const list = [...files];
    setErrors([]);
    const added: Photo[] = [];
    const failed: string[] = [];

    for (const [i, file] of list.entries()) {
      setBusy(`Adding ${i + 1} of ${list.length} — ${file.name}`);
      try {
        added.push({ ...(await uploadPhoto(file)), alt: "" });
      } catch (err) {
        failed.push(`${file.name}: ${err instanceof Error ? err.message : "failed"}`);
      }
    }

    setBusy(null);
    setErrors(failed);
    if (added.length) onChange([...value, ...added]);
    if (input.current) input.current.value = "";
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  const missingAlt = value.filter((p) => !p.alt.trim()).length;

  return (
    <section className="ed__group">
      <h2 className="ed__h">Gallery</h2>

      <p className="ad__note">
        Photographs are resized in your browser before they are sent, so a
        picture straight off a phone is fine. They appear on the site in the
        order shown here.
      </p>

      {kind === "local" && (
        <p className="ad__note ed__warnbox">
          Photographs are being written to <code>public/uploads</code> on this
          machine. That is fine while you are working locally, but Vercel
          cannot write files at runtime — create a Blob store on the project
          (Storage → Create → Blob) before uploading on the live site.
        </p>
      )}

      {value.length > 0 && (
        <div className="ed__gal">
          {value.map((shot, i) => (
            <figure className="ed__shot" key={`${shot.src}-${i}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ed__thumb" src={shot.src} alt="" />
              <figcaption>
                <input
                  className="ad__input"
                  value={shot.alt}
                  placeholder="Describe this photograph"
                  onChange={(e) => {
                    const next = [...value];
                    next[i] = { ...next[i], alt: e.target.value };
                    onChange(next);
                  }}
                  suppressHydrationWarning
                />
                <span className="ed__shot-row">
                  <span className="ed__move">
                    <button
                      disabled={i === 0}
                      onClick={() => move(i, i - 1)}
                      aria-label="Move earlier"
                      suppressHydrationWarning
                    >
                      ←
                    </button>
                    <button
                      disabled={i === value.length - 1}
                      onClick={() => move(i, i + 1)}
                      aria-label="Move later"
                      suppressHydrationWarning
                    >
                      →
                    </button>
                  </span>
                  <button
                    className="ad__del"
                    onClick={() => onChange(value.filter((_, j) => j !== i))}
                    aria-label="Remove this photograph"
                    suppressHydrationWarning
                  >
                    ×
                  </button>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="ed__upload">
        <input
          ref={input}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => e.target.files?.length && add(e.target.files)}
          suppressHydrationWarning
        />
        <button
          className="ad__btn ad__btn--ghost"
          onClick={() => input.current?.click()}
          disabled={busy !== null}
          suppressHydrationWarning
        >
          {busy ? "Working…" : "Add photographs"}
        </button>
        {busy && <span className="ed__note">{busy}</span>}
        {!busy && missingAlt > 0 && (
          <span className="ed__note ed__note--warn">
            {missingAlt} without a description
          </span>
        )}
      </div>

      {errors.map((e) => (
        <p className="ad__error" key={e}>
          {e}
        </p>
      ))}
    </section>
  );
}

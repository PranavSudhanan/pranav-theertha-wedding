"use client";

import { useRef, useState } from "react";
import { uploadPhoto, type UploadedPhoto } from "./upload-photo";

/**
 * One photograph inside a larger row — a story chapter, for now.
 *
 * The path stays editable underneath the picture on purpose: the photographs
 * that ship with the site are referenced by path, and being able to type one
 * back in is the only way to undo an upload without hunting for the original.
 */
export default function PhotoField({
  label,
  src,
  onPath,
  onUpload,
}: {
  label: string;
  src: string;
  onPath: (value: string) => void;
  onUpload: (photo: UploadedPhoto) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const choose = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      onUpload(await uploadPhoto(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload that.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="ed__field ed__photo">
      <span className="ad__label">{label}</span>
      <div className="ed__photo-row">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ed__photo-thumb" src={src} alt="" />
        ) : (
          <span className="ed__photo-thumb is-empty" aria-hidden="true" />
        )}
        <div className="ed__photo-controls">
          <input
            ref={input}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files?.[0] && choose(e.target.files[0])}
            suppressHydrationWarning
          />
          <button
            className="ad__btn ad__btn--ghost"
            onClick={() => input.current?.click()}
            disabled={busy}
            suppressHydrationWarning
          >
            {busy ? "Uploading…" : src ? "Replace" : "Upload"}
          </button>
          <input
            className="ad__input ed__photo-path"
            value={src}
            placeholder="/images/couple-01.jpg"
            onChange={(e) => onPath(e.target.value)}
            suppressHydrationWarning
          />
        </div>
      </div>
      {error && <p className="ad__error">{error}</p>}
    </div>
  );
}

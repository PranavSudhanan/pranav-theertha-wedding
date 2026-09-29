/**
 * Preparing and sending a photograph, shared by the gallery grid and the
 * per-chapter picker in the story editor.
 *
 * Everything expensive happens in the browser: a photo straight off a phone
 * is resized, re-encoded and measured here, so a 12MB original travels as a
 * few hundred kilobytes and the server never needs a native image library.
 *
 * It also comes away with the two things <Image> wants that a bare URL cannot
 * give it — the real dimensions, and a blurred preview to fade up from. That
 * is why an uploaded photograph behaves exactly like one compiled into the
 * bundle rather than popping in out of a grey box.
 */

/** Longest edge we keep. Generous for the lightbox, small enough to send. */
const MAX_EDGE = 2000;
/** Has to agree with MAX_UPLOAD_BYTES on the server. */
const MAX_BYTES = 8 * 1024 * 1024;

/** Formats the server will store as they arrive, and the extension for each. */
const ORIGINAL_TYPES: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/avif": "avif",
};

export type UploadedPhoto = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

type Encoded = { blob: Blob; ext: string };

/** WebP where the browser can, JPEG where it cannot (older Safari). */
function encode(canvas: HTMLCanvasElement, quality: number): Promise<Encoded> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (webp) => {
        if (webp && webp.type === "image/webp") {
          resolve({ blob: webp, ext: "webp" });
          return;
        }
        canvas.toBlob(
          (jpeg) =>
            jpeg
              ? resolve({ blob: jpeg, ext: "jpg" })
              : reject(new Error("This browser could not re-encode the photo.")),
          "image/jpeg",
          quality
        );
      },
      "image/webp",
      quality
    );
  });
}

async function prepare(file: File): Promise<Omit<UploadedPhoto, "src"> & Encoded> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Older browsers reject the option — they also tend to have applied the
    // orientation themselves already.
    bitmap = await createImageBitmap(file);
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser would not give us a canvas.");
  ctx.drawImage(bitmap, 0, 0, width, height);

  let encoded = await encode(canvas, 0.86);
  for (const quality of [0.72, 0.6]) {
    if (encoded.blob.size <= MAX_BYTES) break;
    encoded = await encode(canvas, quality);
  }
  if (encoded.blob.size > MAX_BYTES) {
    throw new Error("Still too large after resizing — try a smaller photo.");
  }

  // Re-compressing an already well-compressed photo can make it bigger, and
  // costs a generation of quality for nothing. When nothing was resized away
  // and the original is a format we can serve, keep the original.
  const keepable = ORIGINAL_TYPES[file.type];
  if (scale === 1 && keepable && file.size <= encoded.blob.size && file.size <= MAX_BYTES) {
    encoded = { blob: file, ext: keepable };
  }

  // The preview: twenty pixels wide, which <Image> blurs up over the real one.
  const tiny = document.createElement("canvas");
  tiny.width = 20;
  tiny.height = Math.max(1, Math.round((20 * height) / width));
  tiny.getContext("2d")?.drawImage(bitmap, 0, 0, tiny.width, tiny.height);
  let blurDataURL = tiny.toDataURL("image/webp", 0.6);
  if (!blurDataURL.startsWith("data:image/webp")) {
    blurDataURL = tiny.toDataURL("image/jpeg", 0.5);
  }

  bitmap.close?.();
  return { width, height, blurDataURL, ...encoded };
}

/** Prepare a file and store it. Resolves to everything the site needs to render it. */
export async function uploadPhoto(file: File): Promise<UploadedPhoto> {
  const { blob, ext, ...photo } = await prepare(file);
  const form = new FormData();
  form.append("file", blob, `upload.${ext}`);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || !out.url) throw new Error(out.error || "Upload failed.");
  return { ...photo, src: out.url as string };
}

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Where uploaded photographs are kept.
 *
 * Two adapters, chosen the same way lib/store.ts chooses its own:
 *
 *   • local — written into public/uploads/ and served straight off disk.
 *     Development only. Vercel's filesystem is read-only at runtime and
 *     public/ is baked at build time, so this cannot work in production.
 *   • blob  — Vercel Blob, served from their CDN. Used whenever
 *     BLOB_READ_WRITE_TOKEN is set, which Vercel injects for you the moment
 *     you create a Blob store on the project.
 *
 * The photograph arrives already resized and re-encoded by the browser (see
 * the gallery editor), so there is no image processing here and no native
 * dependency to install — this only has to put bytes somewhere and hand back
 * a URL.
 */

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export const uploadKind: "blob" | "local" = BLOB_TOKEN ? "blob" : "local";

/** Extensions we are willing to write, and the type each must be sent as. */
export const IMAGE_TYPES: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/avif": "avif",
};

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export async function putImage(
  bytes: Uint8Array,
  contentType: string
): Promise<string> {
  const ext = IMAGE_TYPES[contentType];
  if (!ext) throw new Error(`Unsupported image type: ${contentType}`);

  const name = `gallery-${randomUUID().slice(0, 8)}.${ext}`;

  if (BLOB_TOKEN) {
    // Imported here rather than at the top so a project without the package
    // installed still runs locally, where this branch is never taken.
    let put: typeof import("@vercel/blob").put;
    try {
      ({ put } = await import("@vercel/blob"));
    } catch {
      throw new Error(
        "BLOB_READ_WRITE_TOKEN is set but @vercel/blob is not installed. Run: npm install @vercel/blob"
      );
    }
    const result = await put(`wedding/${name}`, Buffer.from(bytes), {
      access: "public",
      contentType,
      token: BLOB_TOKEN,
      // The name is already unique, and a stable URL makes the content
      // document readable.
      addRandomSuffix: false,
    });
    return result.url;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "No photo storage is configured. Create a Blob store on your Vercel project (Storage → Create → Blob); the BLOB_READ_WRITE_TOKEN it adds is all this needs."
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}

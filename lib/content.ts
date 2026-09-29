import { unstable_cache, revalidateTag } from "next/cache";
import { getJson, setJson } from "@/lib/store";
import { DEFAULTS, type Content } from "@/lib/content-types";

export * from "@/lib/content-types";

/**
 * Everything on the site, in one editable document.
 *
 * lib/config.ts stays the compiled default. The admin panel saves a patch on
 * top of it. The two are merged on read.
 *
 * The rule that shapes this file: **the site must render even if the store is
 * unreachable.** Every read falls back to the compiled defaults, and the
 * merged result is cached, so a database outage on the wedding morning costs
 * you unsaved edits — never the page.
 *
 * Dates are ISO strings and addresses are derived rather than stored, so the
 * whole document round-trips through JSON without losing anything.
 */

export const CONTENT_KEY = "wedding:content";
const TAG = "wedding-content";

/** Objects merge key by key; arrays are replaced whole, so a deleted row stays deleted. */
function merge<T>(base: T, patch: unknown): T {
  if (patch === null || patch === undefined) return base;
  if (Array.isArray(base) || Array.isArray(patch)) return patch as T;
  if (typeof base !== "object" || typeof patch !== "object") return patch as T;

  const out = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
    out[k] = k in out ? merge(out[k], v) : v;
  }
  return out as T;
}

async function load(): Promise<Content> {
  try {
    const patch = await getJson<Partial<Content>>(CONTENT_KEY);
    return patch ? merge(DEFAULTS, patch) : DEFAULTS;
  } catch (err) {
    // The store is unreachable. The site still has everything it needs.
    console.error("[content] falling back to compiled defaults:", err);
    return DEFAULTS;
  }
}

const cached = unstable_cache(load, ["wedding-content"], { tags: [TAG] });

export async function getContent(): Promise<Content> {
  try {
    return await cached();
  } catch {
    return DEFAULTS;
  }
}

/** Raw overrides, for the editor to show what has actually been changed. */
export async function getOverrides(): Promise<Partial<Content>> {
  try {
    return (await getJson<Partial<Content>>(CONTENT_KEY)) ?? {};
  } catch {
    return {};
  }
}

export async function saveContent(patch: Partial<Content>): Promise<void> {
  const current = await getOverrides();
  await setJson(CONTENT_KEY, merge(current, patch));
  revalidateTag(TAG, { expire: 0 });
}

export async function resetContent(): Promise<void> {
  await setJson(CONTENT_KEY, {});
  revalidateTag(TAG, { expire: 0 });
}


import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import type { Rsvp } from "@/lib/rsvp-email";

/**
 * Where responses are kept.
 *
 * Until now an RSVP existed only as an email and a log line — nothing you
 * could sort, count or recover. This adds a small store behind two adapters:
 *
 *   • local    — a JSON file under .data/ (gitignored). Used in development.
 *   • postgres — Neon, over its HTTP driver. The production store: set
 *     DATABASE_URL and it is chosen automatically.
 *   • upstash  — Upstash Redis over its REST API. Kept as an alternative;
 *     used only when there is no DATABASE_URL.
 *
 * What every adapter has to guarantee is that two guests answering at the
 * same moment cannot overwrite each other — so an RSVP is always an append
 * (INSERT, RPUSH), never a read-modify-write of the whole list.
 */

export type StoredRsvp = Rsvp & {
  id: string;
  /** what actually got through when it arrived */
  delivery: { emailed: boolean; guestCopied: boolean; hooked: boolean };
};

const KEY = "wedding:rsvps";
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
// Neon sets DATABASE_URL; the Vercel integration also sets POSTGRES_URL.
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

export const storeKind: "postgres" | "upstash" | "local" = DATABASE_URL
  ? "postgres"
  : UPSTASH_URL && UPSTASH_TOKEN
    ? "upstash"
    : "local";

/* ---------------- Postgres (Neon) ---------------- */

let client: ReturnType<typeof neon> | null = null;
function db() {
  if (!client) client = neon(DATABASE_URL!);
  return client;
}

/**
 * Create the two tables the first time anything touches them.
 *
 * There is no migration step to run and nothing to remember before the first
 * RSVP arrives — which matters, because the one night this has to work is the
 * night the link goes out. A failure is not cached, so a blip does not leave
 * the process permanently convinced the schema is missing.
 */
let ready: Promise<void> | null = null;
function schema(): Promise<void> {
  if (!ready) {
    const sql = db();
    ready = (async () => {
      await sql`create table if not exists rsvps (
        seq bigserial primary key,
        id uuid not null unique,
        submitted_at timestamptz not null default now(),
        data jsonb not null
      )`;
      await sql`create table if not exists documents (
        key text primary key,
        value jsonb not null,
        updated_at timestamptz not null default now()
      )`;
    })().catch((err) => {
      ready = null;
      throw err;
    });
  }
  return ready;
}

/** jsonb comes back parsed, but do not depend on it. */
function asJson<T>(value: unknown): T {
  return typeof value === "string" ? (JSON.parse(value) as T) : (value as T);
}

/* ---------------- Upstash over REST ---------------- */

async function upstash(command: string[]): Promise<unknown> {
  const res = await fetch(UPSTASH_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`upstash ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(`upstash: ${json.error}`);
  return json.result;
}

/* ---------------- a JSON file, for development ---------------- */

const FILE = path.join(process.cwd(), ".data", "rsvps.json");

async function readFileStore(): Promise<StoredRsvp[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as StoredRsvp[];
  } catch {
    return [];
  }
}

async function writeFileStore(rows: StoredRsvp[]) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(rows, null, 2), "utf8");
}

/* ---------------- the interface the app uses ---------------- */

export async function addRsvp(
  rsvp: Rsvp,
  delivery: StoredRsvp["delivery"]
): Promise<StoredRsvp> {
  const row: StoredRsvp = { ...rsvp, id: randomUUID(), delivery };

  if (storeKind === "postgres") {
    await schema();
    // submittedAt arrives from the browser, so it cannot be trusted to be a
    // date at all; the column is what the admin list sorts on.
    const at = Number.isFinite(Date.parse(row.submittedAt))
      ? row.submittedAt
      : new Date().toISOString();
    await db()`insert into rsvps (id, submitted_at, data)
                values (${row.id}, ${at}::timestamptz, ${JSON.stringify(row)}::jsonb)`;
  } else if (storeKind === "upstash") {
    await upstash(["RPUSH", KEY, JSON.stringify(row)]);
  } else {
    const rows = await readFileStore();
    rows.push(row);
    await writeFileStore(rows);
  }
  return row;
}

export async function listRsvps(): Promise<StoredRsvp[]> {
  if (storeKind === "postgres") {
    await schema();
    const rows = (await db()`select data from rsvps order by seq asc`) as {
      data: unknown;
    }[];
    return rows.map((r) => asJson<StoredRsvp>(r.data));
  }
  if (storeKind === "upstash") {
    const raw = (await upstash(["LRANGE", KEY, "0", "-1"])) as string[];
    return raw
      .map((s) => {
        try {
          return JSON.parse(s) as StoredRsvp;
        } catch {
          return null;
        }
      })
      .filter((r): r is StoredRsvp => r !== null);
  }
  return readFileStore();
}

export async function deleteRsvp(id: string): Promise<boolean> {
  if (storeKind === "postgres") {
    await schema();
    const gone = (await db()`delete from rsvps where id = ${id} returning id`) as unknown[];
    return gone.length > 0;
  }
  if (storeKind === "upstash") {
    const rows = await listRsvps();
    const row = rows.find((r) => r.id === id);
    if (!row) return false;
    // LREM removes by exact value, which is why the whole row is stored as
    // the element rather than a pointer to one.
    await upstash(["LREM", KEY, "1", JSON.stringify(row)]);
    return true;
  }
  const rows = await readFileStore();
  const next = rows.filter((r) => r.id !== id);
  if (next.length === rows.length) return false;
  await writeFileStore(next);
  return true;
}

/* ---------------- a single JSON document (site content) ---------------- */

export async function getJson<T>(key: string): Promise<T | null> {
  if (storeKind === "postgres") {
    await schema();
    const rows = (await db()`select value from documents where key = ${key}`) as {
      value: unknown;
    }[];
    return rows.length ? asJson<T>(rows[0].value) : null;
  }
  if (storeKind === "upstash") {
    const raw = (await upstash(["GET", key])) as string | null;
    return raw ? (JSON.parse(raw) as T) : null;
  }
  try {
    const file = path.join(process.cwd(), ".data", `${key.replace(/:/g, "_")}.json`);
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch {
    return null;
  }
}

export async function setJson(key: string, value: unknown): Promise<void> {
  if (storeKind === "postgres") {
    await schema();
    await db()`insert into documents (key, value, updated_at)
               values (${key}, ${JSON.stringify(value)}::jsonb, now())
               on conflict (key) do update
                 set value = excluded.value, updated_at = now()`;
    return;
  }
  if (storeKind === "upstash") {
    await upstash(["SET", key, JSON.stringify(value)]);
    return;
  }
  const file = path.join(process.cwd(), ".data", `${key.replace(/:/g, "_")}.json`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

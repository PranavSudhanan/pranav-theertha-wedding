import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin-auth";
import { getContent, getOverrides, resetContent, saveContent } from "@/lib/content";
import type { Content } from "@/lib/content-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isSignedIn())) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({
    ok: true,
    content: await getContent(),
    overrides: await getOverrides(),
  });
}

export async function PUT(request: Request) {
  if (!(await isSignedIn())) return NextResponse.json({ ok: false }, { status: 401 });

  let patch: Partial<Content>;
  try {
    patch = (await request.json()) as Partial<Content>;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  try {
    await saveContent(patch);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not save" },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, content: await getContent() });
}

/** Throw away every override and go back to what ships in the code. */
export async function DELETE() {
  if (!(await isSignedIn())) return NextResponse.json({ ok: false }, { status: 401 });
  await resetContent();
  return NextResponse.json({ ok: true, content: await getContent() });
}

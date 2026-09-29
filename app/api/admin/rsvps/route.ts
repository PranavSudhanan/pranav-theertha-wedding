import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin-auth";
import { deleteRsvp, listRsvps } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isSignedIn())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true, rsvps: await listRsvps() });
}

export async function DELETE(request: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = (await request.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  return NextResponse.json({ ok: await deleteRsvp(id) });
}

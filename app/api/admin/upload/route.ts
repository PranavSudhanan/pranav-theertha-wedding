import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin-auth";
import { IMAGE_TYPES, MAX_UPLOAD_BYTES, putImage, uploadKind } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Where uploads would go, so the editor can warn before anyone tries. */
export async function GET() {
  if (!(await isSignedIn())) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, uploadKind });
}

export async function POST(request: Request) {
  if (!(await isSignedIn())) return NextResponse.json({ ok: false }, { status: 401 });

  let file: File | null = null;
  try {
    const form = await request.formData();
    const entry = form.get("file");
    if (entry instanceof File) file = entry;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ ok: false, error: "No photograph was sent." }, { status: 400 });
  }
  if (!IMAGE_TYPES[file.type]) {
    return NextResponse.json(
      { ok: false, error: `That is not an image we can use (${file.type || "unknown type"}).` },
      { status: 415 }
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { ok: false, error: "That photograph is too large, even after resizing." },
      { status: 413 }
    );
  }

  try {
    const url = await putImage(new Uint8Array(await file.arrayBuffer()), file.type);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[upload] failed", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not save the photograph." },
      { status: 500 }
    );
  }
}

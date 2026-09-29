import type { Metadata } from "next";
import { adminConfigured, isSignedIn } from "@/lib/admin-auth";
import { listRsvps, storeKind, type StoredRsvp } from "@/lib/store";
import { getContent } from "@/lib/content";
import LoginForm from "./LoginForm";
import Console from "./Console";
import "./admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminPage() {
  if (!adminConfigured) {
    return (
      <main className="ad">
        <div className="ad__gate">
          <h1 className="ad__gate-title">Not set up yet</h1>
          <p className="ad__note">
            Add an <code>ADMIN_PASSWORD</code> environment variable — eight
            characters or more — then reload. Locally that goes in{" "}
            <code>.env.local</code>; on Vercel, under Settings → Environment
            Variables.
          </p>
        </div>
      </main>
    );
  }

  if (!(await isSignedIn())) {
    return (
      <main className="ad">
        <LoginForm />
      </main>
    );
  }

  const content = await getContent();
  let rsvps: StoredRsvp[] = [];
  let storeError: string | null = null;
  try {
    rsvps = await listRsvps();
  } catch (err) {
    storeError = err instanceof Error ? err.message : String(err);
  }

  return (
    <main className="ad">
      <Console
        rsvps={rsvps}
        content={content}
        storeKind={storeKind}
        storeError={storeError}
      />
    </main>
  );
}

"use client";

import { useState } from "react";

export default function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = new FormData(e.currentTarget).get("password") as string;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out.error || "Could not sign in.");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setBusy(false);
    }
  };

  return (
    <form className="ad__gate" onSubmit={submit}>
      <span className="ad__mono">P &amp; T</span>
      <h1 className="ad__gate-title">Guest list</h1>
      <label className="ad__label" htmlFor="password">
        Password
      </label>
      <input
        className="ad__input"
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
        suppressHydrationWarning
      />
      {error && <p className="ad__error">{error}</p>}
      <button className="ad__btn" type="submit" disabled={busy} suppressHydrationWarning>
        {busy ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}

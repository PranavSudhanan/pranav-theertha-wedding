"use client";

import { useMemo, useState } from "react";
import type { StoredRsvp } from "@/lib/store";

type Filter = "all" | "yes" | "no";

/** "More than 6" has no number in it; count it as 7 so totals stay useful. */
function headCount(r: StoredRsvp) {
  if (!/accept/i.test(r.attending)) return 0;
  const n = parseInt(r.guests, 10);
  if (Number.isFinite(n)) return n;
  return r.guests ? 7 : 1;
}

const csvCell = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;

export default function Guests({
  initial,
  storeKind,
  storeError,
}: {
  initial: StoredRsvp[];
  storeKind: string;
  storeError: string | null;
}) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const stats = useMemo(() => {
    const yes = rows.filter((r) => /accept/i.test(r.attending));
    const no = rows.filter((r) => !/accept/i.test(r.attending));
    return {
      total: rows.length,
      yes: yes.length,
      no: no.length,
      heads: rows.reduce((n, r) => n + headCount(r), 0),
      party: yes.filter((r) => /party/i.test(r.days)).length,
      muhurtham: yes.filter((r) => /muhurtham/i.test(r.days)).length,
    };
  }, [rows]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows
      .filter((r) =>
        filter === "all"
          ? true
          : filter === "yes"
            ? /accept/i.test(r.attending)
            : !/accept/i.test(r.attending)
      )
      .filter((r) =>
        !needle
          ? true
          : [r.name, r.phone, r.email, r.side, r.message]
              .join(" ")
              .toLowerCase()
              .includes(needle)
      )
      .slice()
      .reverse(); // newest first
  }, [rows, filter, q]);

  const remove = async (id: string, name: string) => {
    if (!window.confirm(`Remove ${name}'s response? This cannot be undone.`)) return;
    setBusy(id);
    try {
      const res = await fetch("/api/admin/rsvps", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setRows((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setBusy(null);
    }
  };

  const exportCsv = () => {
    const header = [
      "Received", "Name", "Phone", "Email", "Attending",
      "Days", "Guests", "Side", "Message",
    ];
    const body = rows.map((r) =>
      [
        new Date(r.submittedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        r.name, r.phone, r.email, r.attending, r.days, r.guests, r.side, r.message,
      ].map(csvCell).join(",")
    );
    const csv = [header.map(csvCell).join(","), ...body].join("\r\n");
    const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `guest-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {storeError && (
        <p className="ad__error ad__error--bar">
          Could not read the store ({storeKind}): {storeError}
        </p>
      )}

      <div className="ad__stats">
        {[
          { n: stats.total, l: "responses" },
          { n: stats.yes, l: "accepting" },
          { n: stats.no, l: "regrets" },
          { n: stats.heads, l: "people expected" },
          { n: stats.party, l: "at the party" },
          { n: stats.muhurtham, l: "at the muhurtham" },
        ].map((s) => (
          <div className="ad__stat" key={s.l}>
            <span className="ad__stat-n">{s.n}</span>
            <span className="ad__stat-l">{s.l}</span>
          </div>
        ))}
      </div>

      <div className="ad__controls">
        <input
          className="ad__input ad__search"
          placeholder="Search name, phone, email, message…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          suppressHydrationWarning
        />
        <div className="ad__tabs">
          {(["all", "yes", "no"] as Filter[]).map((f) => (
            <button
              key={f}
              className={`ad__tab ${filter === f ? "is-on" : ""}`}
              onClick={() => setFilter(f)}
              suppressHydrationWarning
            >
              {f === "all" ? "All" : f === "yes" ? "Accepting" : "Regrets"}
            </button>
          ))}
        </div>
        <button className="ad__btn ad__btn--ghost" onClick={exportCsv} suppressHydrationWarning>
          Export CSV
        </button>
      </div>

      {shown.length === 0 ? (
        <p className="ad__note">
          {rows.length === 0
            ? "No responses yet. They will appear here the moment someone answers."
            : "Nothing matches that."}
        </p>
      ) : (
        <div className="ad__tablewrap">
          <table className="ad__table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Contact</th>
                <th>Attending</th>
                <th>Which days</th>
                <th>Party</th>
                <th>Message</th>
                <th>Received</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const yes = /accept/i.test(r.attending);
                return (
                  <tr key={r.id} className={busy === r.id ? "is-busy" : ""}>
                    <td>
                      <strong>{r.name}</strong>
                      {r.side && <span className="ad__side">{r.side}</span>}
                    </td>
                    <td className="ad__contact">
                      <a href={`tel:${r.phone}`}>{r.phone}</a>
                      {r.email && <a href={`mailto:${r.email}`}>{r.email}</a>}
                    </td>
                    <td>
                      <span className={`ad__pill ${yes ? "is-yes" : "is-no"}`}>
                        {yes ? "Accepts" : "Regrets"}
                      </span>
                    </td>
                    <td className="ad__days">{r.days || "—"}</td>
                    <td>{yes ? r.guests || "1" : "—"}</td>
                    <td className="ad__msg">{r.message || "—"}</td>
                    <td className="ad__when">
                      {new Date(r.submittedAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {!r.delivery?.emailed && (
                        <span className="ad__warn" title="The notification email did not send">
                          email failed
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="ad__del"
                        onClick={() => remove(r.id, r.name)}
                        disabled={busy === r.id}
                        aria-label={`Remove ${r.name}`}
                        suppressHydrationWarning
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="ad__foot">
        Showing {shown.length} of {rows.length} · store: {storeKind}
        {storeKind === "local" && " (development only — set DATABASE_URL for production)"}
      </p>
    </>
  );
}

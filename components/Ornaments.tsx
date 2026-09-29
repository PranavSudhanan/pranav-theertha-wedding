/* Hand-drawn SVG motifs — gold line work echoing the invitation card. */

type P = { className?: string };

export function Lotus({ className }: P) {
  return (
    <svg
      viewBox="0 0 48 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M24 29c-3.4 0-6.2-2.6-6.2-5.9 0-4.6 6.2-11.1 6.2-11.1s6.2 6.5 6.2 11.1c0 3.3-2.8 5.9-6.2 5.9Z" />
      <path d="M24 29c-5 1-11.4-1.6-13.6-6.4-1.6-3.5.3-7.4.3-7.4s5.2.9 8.4 4.1" />
      <path d="M24 29c5 1 11.4-1.6 13.6-6.4 1.6-3.5-.3-7.4-.3-7.4s-5.2.9-8.4 4.1" />
      <path d="M24 29c-6.6.4-13.6-2.8-15.9-7.9M24 29c6.6.4 13.6-2.8 15.9-7.9" />
      <circle cx="24" cy="7.4" r="1.5" />
      <path d="M24 10.2V9" />
    </svg>
  );
}

export function Diamond({ className }: P) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 1.5 14.5 8 8 14.5 1.5 8 8 1.5Z" />
      <path d="M8 4.8 11.2 8 8 11.2 4.8 8 8 4.8Z" opacity=".55" />
    </svg>
  );
}

/** Foliage corner flourish, mirroring the leaves on their printed card. */
export function CornerLeaves({ className }: P) {
  const leaf = (x: number, y: number, r: number, s = 1) => (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} key={`${x}-${y}-${r}`}>
      <path
        d="M0 0C4 -7 14 -9 19 -3 14 4 4 6 0 0Z"
        fill="currentColor"
        fillOpacity=".14"
        stroke="currentColor"
        strokeWidth=".9"
      />
      <path d="M1 -0.4 17 -3" stroke="currentColor" strokeWidth=".7" opacity=".7" />
    </g>
  );

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      style={{ color: "var(--gold)" }}
    >
      <path
        d="M4 4C22 10 46 26 62 48c9 12 15 26 18 40"
        strokeWidth="1"
        strokeLinecap="round"
        opacity=".8"
      />
      <path
        d="M4 4C14 22 20 44 22 64c1 11 1 22-1 32"
        strokeWidth=".8"
        strokeLinecap="round"
        opacity=".55"
      />
      {leaf(20, 18, 28, 1.05)}
      {leaf(36, 34, 20, 0.95)}
      {leaf(52, 52, 14, 0.85)}
      {leaf(14, 30, 78, 0.9)}
      {leaf(20, 54, 70, 0.8)}
      {leaf(30, 74, 62, 0.7)}
      <circle cx="66" cy="22" r="2" fill="currentColor" fillOpacity=".5" />
      <circle cx="76" cy="30" r="1.4" fill="currentColor" fillOpacity=".4" />
      <circle cx="14" cy="76" r="2" fill="currentColor" fillOpacity=".5" />
      <circle cx="9" cy="88" r="1.4" fill="currentColor" fillOpacity=".4" />
      <g opacity=".9">
        <path
          d="M74 12c3-4 9-4 11 0 2 4-2 8-5.5 9.5C76 20 71 16 74 12Z"
          fill="currentColor"
          fillOpacity=".1"
          strokeWidth=".9"
        />
      </g>
    </svg>
  );
}

/** A slim gold rule with a motif at its centre. */
export function Rule({
  className = "",
  left = false,
}: {
  className?: string;
  left?: boolean;
}) {
  return (
    <div className={`rule ${left ? "rule-left" : ""} ${className}`}>
      <Diamond />
    </div>
  );
}

export function Arrow({ dir = "right" }: { dir?: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: dir === "left" ? "rotate(180deg)" : undefined }}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Cross() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  );
}

export function Pin() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="1" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Motifs for a Kerala Hindu wedding.
   Drawn as line work so they sit beside the gold rules and the
   foliage without shouting over the photography.
   ──────────────────────────────────────────────────────────── */

/** Ganapati — invoked first, as on the printed card. */
export function Ganesha({ className }: P) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* mukuta — the crown, seated on the dome of the head */}
      <circle cx="40" cy="4" r="1.5" fill="currentColor" stroke="none" />
      <path d="M40 6.2c-1.8 3.6-3 6.4-3.5 8.6h7c-.5-2.2-1.7-5-3.5-8.6Z" />

      {/* head */}
      <path d="M28.6 32.4c0-9.4 5.1-16 11.4-16s11.4 6.6 11.4 16" />
      <path d="M28.6 32.4c0 3.8 1 6.8 2.8 8.8M51.4 32.4c0 3.8-1 6.8-2.8 8.8" />

      {/* ears */}
      <path d="M29.6 22.6c-7.4-3.8-15.6-1.9-18.9 3.9-3.3 5.9-.8 13.2 5.3 15.8 4.5 1.9 9.6.8 12.8-2.2" />
      <path d="M50.4 22.6c7.4-3.8 15.6-1.9 18.9 3.9 3.3 5.9.8 13.2-5.3 15.8-4.5 1.9-9.6.8-12.8-2.2" />
      <path d="M26.8 27.2c-4-1.3-8.2-.2-10.6 2.8M53.2 27.2c4-1.3 8.2-.2 10.6 2.8" opacity=".75" />

      {/* tilak */}
      <path d="M37.2 24.4v3.8M40 23.6v4.6M42.8 24.4v3.8" opacity=".8" />

      {/* eyes, lowered */}
      <path d="M33.9 31.6c1-1.3 2.9-1.3 3.9 0M42.2 31.6c1-1.3 2.9-1.3 3.9 0" />

      {/* tusks */}
      <path d="M35.4 38.8c-1.2 1.7-1.6 3.3-1.2 4.9" />
      <path d="M44.6 38.8c1.2 1.7 1.7 3.6 1.4 5.6" />

      {/* trunk, curling away */}
      <path d="M40 33.6c.2 4.4-.6 8.2-1.8 11.8-1.5 4.6-3.4 8.6-7.4 10.2-4 1.6-8-.6-8.4-4.4-.3-3 1.9-5.5 4.8-5.5 2.3 0 4.1 1.7 4.1 3.9" />
    </svg>
  );
}

/** Nilavilakku — the Kerala brass lamp, lit before every auspicious thing. */
export function Nilavilakku({ className }: P) {
  return (
    <svg
      viewBox="0 0 60 92"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* flame */}
      <path
        d="M30 4c3.4 4.6 5 8 5 10.6 0 3.2-2.2 5.6-5 5.6s-5-2.4-5-5.6C25 12 26.6 8.6 30 4Z"
        fill="currentColor"
        fillOpacity=".16"
      />
      {/* wick bowl */}
      <path d="M16 26c0-2.6 6.2-4.2 14-4.2S44 23.4 44 26c0 3.4-6.2 6-14 6s-14-2.6-14-6Z" />
      <path d="M12.5 26.6 16 26M47.5 26.6 44 26" />
      {/* stem */}
      <path d="M30 32v9.2M30 45.4v14" />
      <ellipse cx="30" cy="43.2" rx="5.4" ry="2.4" />
      <ellipse cx="30" cy="61.6" rx="7.2" ry="2.6" />
      {/* base tiers */}
      <path d="M22 68.5h16M18.5 74h23M14 80.5h32" />
      <ellipse cx="30" cy="71.2" rx="10" ry="3" />
      <ellipse cx="30" cy="77.4" rx="14.5" ry="3.6" />
      <ellipse cx="30" cy="84" rx="19" ry="4.4" />
    </svg>
  );
}

/** Kalasham — the pot, coconut and mango leaves that open a celebration. */
export function Kalasha({ className }: P) {
  return (
    <svg
      viewBox="0 0 64 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* coconut */}
      <ellipse cx="32" cy="15" rx="7" ry="8.6" fill="currentColor" fillOpacity=".14" />
      <path d="M32 6.4v-3" />
      {/* mango leaves */}
      <path d="M25 22.5c-5.2-1.4-9.4-5-11-9.8 5-1 9.8.6 12.6 4.2" />
      <path d="M39 22.5c5.2-1.4 9.4-5 11-9.8-5-1-9.8.6-12.6 4.2" />
      <path d="M22.5 25c-6-.4-11.4-3.4-14.4-8 4.8-2 10-1.4 13.6 1.6" />
      <path d="M41.5 25c6-.4 11.4-3.4 14.4-8-4.8-2-10-1.4-13.6 1.6" />
      {/* rim */}
      <path d="M19 27h26" />
      <ellipse cx="32" cy="27" rx="13" ry="3" />
      {/* pot */}
      <path d="M21 29c-4.6 3.4-7.4 8.6-7.4 14.4 0 10 8.2 18 18.4 18s18.4-8 18.4-18c0-5.8-2.8-11-7.4-14.4" />
      <path d="M15.4 43.4c5 2.6 10.8 4 16.6 4s11.6-1.4 16.6-4" opacity=".55" />
      <path d="M32 50.5c2.6 0 4.8 2 4.8 4.6M32 50.5c-2.6 0-4.8 2-4.8 4.6" opacity=".7" />
      {/* foot */}
      <path d="M24 62.5h16M21 67h22" />
    </svg>
  );
}

/** A kolam-like rosette, used as a very quiet background watermark. */
export function Mandala({ className }: P) {
  const petals = Array.from({ length: 16 }, (_, i) => (
    <path
      key={i}
      d="M60 12c5 9 7.5 16 7.5 21S64.5 43 60 48c-4.5-5-7.5-10-7.5-15s2.5-12 7.5-21Z"
      transform={`rotate(${i * 22.5} 60 60)`}
    />
  ));
  const inner = Array.from({ length: 8 }, (_, i) => (
    <path
      key={i}
      d="M60 34c3 5.4 4.5 9 4.5 11.4S62.4 50.6 60 53c-2.4-2.4-4.5-5.2-4.5-7.6S57 39.4 60 34Z"
      transform={`rotate(${i * 45} 60 60)`}
    />
  ));

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      aria-hidden="true"
      className={className}
    >
      <circle cx="60" cy="60" r="56" />
      <circle cx="60" cy="60" r="52" strokeDasharray="1 5" />
      {petals}
      <circle cx="60" cy="60" r="30" />
      {inner}
      <circle cx="60" cy="60" r="9" />
      <circle cx="60" cy="60" r="3.4" fill="currentColor" fillOpacity=".5" />
    </svg>
  );
}

/** Mango paisley — the small punctuation between thoughts. */
export function Paisley({ className }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.6 2c5.4 2.8 8.4 6.8 8.4 11.2 0 4.9-3.9 8.8-8.8 8.8S3.4 18.1 3.4 13.2c0-3 1.9-5.2 4.4-5.2 2.2 0 3.8 1.7 3.8 3.8 0 1.8-1.2 3.2-2.8 3.2-1.2 0-2.1-.8-2.1-1.9" />
      <path d="M12.6 2c-3 4-4.6 7.6-4.8 10.8" opacity=".45" />
    </svg>
  );
}

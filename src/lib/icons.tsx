const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const PATHS: Record<string, React.ReactNode> = {
  chair: (
    <>
      <path {...STROKE} d="M6 4v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4" />
      <path {...STROKE} d="M6 20v-3M18 20v-3M6 13H4M20 13h-2" />
    </>
  ),
  sofa: (
    <>
      <path {...STROKE} d="M5 12V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
      <path {...STROKE} d="M3 12h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path {...STROKE} d="M5 18v2M19 18v2" />
    </>
  ),
  shelf: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" {...STROKE} />
      <path {...STROKE} d="M4 9h16M4 15h16" />
    </>
  ),
  bed: (
    <>
      <path {...STROKE} d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" />
      <path {...STROKE} d="M3 18v2M21 18v2M3 13h18" />
      <path {...STROKE} d="M6 10V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3" />
    </>
  ),
  desk: (
    <>
      <path {...STROKE} d="M3 9h18M5 9v10M19 9v10" />
      <rect x="3" y="15" width="4" height="4" {...STROKE} />
    </>
  ),
  dresser: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1" {...STROKE} />
      <path {...STROKE} d="M4 12h16M9 8h1M14 8h1M9 16h1M14 16h1" />
    </>
  ),
  tablet: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2" {...STROKE} />
      <circle cx="12" cy="18" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  console: (
    <>
      <rect x="3" y="7" width="18" height="10" rx="2" {...STROKE} />
      <circle cx="8" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" {...STROKE} />
      <path {...STROKE} d="M9 20h6M12 16v4" />
    </>
  ),
  speaker: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" {...STROKE} />
      <circle cx="12" cy="8" r="1.6" {...STROKE} />
      <circle cx="12" cy="15" r="3" {...STROKE} />
    </>
  ),
  grill: (
    <>
      <path {...STROKE} d="M6 11a6 6 0 0 1 12 0z" />
      <path {...STROKE} d="M4 11h16M9 15v4M15 15v4M8 20h8" />
    </>
  ),
  patio: (
    <>
      <ellipse cx="12" cy="7" rx="9" ry="2.4" {...STROKE} />
      <path {...STROKE} d="M3 7v3M21 7v3M12 9.4V16M8 20l4-4 4 4" />
    </>
  ),
  kayak: (
    <>
      <path {...STROKE} d="M2 15c3-5 6-7 10-7s7 2 10 7c-3 2-6 3-10 3s-7-1-10-3z" />
      <path {...STROKE} d="M12 8v10" />
      <path {...STROKE} d="M9 4l3 2 3-2" />
    </>
  ),
  lamp: (
    <>
      <path {...STROKE} d="M7 4h10l-3 6H10z" />
      <path {...STROKE} d="M12 10v8M8 21h8" />
    </>
  ),
  mixer: (
    <>
      <path {...STROKE} d="M8 4h6l2 4v3a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8z" />
      <path {...STROKE} d="M9 15v3a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3v-1" />
    </>
  ),
  rug: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" {...STROKE} />
      <rect x="6.5" y="8.5" width="11" height="7" rx="0.5" {...STROKE} />
    </>
  ),
  bike: (
    <>
      <circle cx="6" cy="17" r="3.4" {...STROKE} />
      <circle cx="18" cy="17" r="3.4" {...STROKE} />
      <path {...STROKE} d="M6 17l4-9h4l3 9M10 8h4M13 17l-3.5-6" />
    </>
  ),
  guitar: (
    <>
      <circle cx="9" cy="16" r="4.5" {...STROKE} />
      <path {...STROKE} d="M11.8 12.2 17 5a1.4 1.4 0 0 1 2 2l-7.2 5.2" />
      <path {...STROKE} d="M17 5l2 2" />
    </>
  ),
  box: (
    <>
      <path {...STROKE} d="M3 8l9-4 9 4-9 4-9-4z" />
      <path {...STROKE} d="M3 8v9l9 4 9-4V8M12 12v9" />
    </>
  ),
  stroller: (
    <>
      <circle cx="7" cy="19" r="1.8" {...STROKE} />
      <circle cx="16" cy="19" r="1.8" {...STROKE} />
      <path {...STROKE} d="M6 17V9a5 5 0 0 1 9.6-2M16 17V9" />
      <path {...STROKE} d="M4 8h1.5" />
    </>
  ),
};

const FALLBACK = (
  <>
    <path {...STROKE} d="M12 3l8 8-8 8-8-8z" />
    <circle cx="9" cy="9" r="0.8" fill="currentColor" stroke="none" />
  </>
);

export function ListingIcon({ iconKey, className }: { iconKey: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {PATHS[iconKey] ?? FALLBACK}
    </svg>
  );
}

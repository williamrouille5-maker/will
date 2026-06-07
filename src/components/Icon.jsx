// Minimal inline SVG icon set (stroke-based), keyed by name.
// Avoids external icon-library version risks.
const paths = {
  shield: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />,
  cash: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 9.5v.01M18 14.5v.01" />
    </>
  ),
  chart: <path d="M4 19V5M4 19h16M8 16l3.5-4 3 2.5L20 8" />,
  gears: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5M12 18.5V21M4.2 7l2.1 1.3M17.7 15.7l2.1 1.3M4.2 17l2.1-1.3M17.7 8.3L19.8 7" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </>
  ),
  factory: <path d="M3 21V10l5 3V10l5 3V7l6 3v11H3zM7 17h2M12 17h2M17 17h1" />,
  health: <path d="M12 21s-7-4.5-7-10a4 4 0 018-1 4 4 0 018 1c0 5.5-7 10-7 10zM12 8v6M9 11h6" />,
  leaf: <path d="M5 18C5 9 12 5 20 5c0 9-6 14-14 14M5 18c2-4 5-6 9-7" />,
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <path d="M7 7.5v.01M7 16.5v.01" />
    </>
  ),
  crane: <path d="M5 21V4l13 2M5 4l11 2M9 6v3M9 9h-3M9 9l4 1M13 10v3.5a1.5 1.5 0 003 0M5 21h6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  phone: <path d="M5 4h3l1.5 4-2 1.5a12 12 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  pin: (
    <>
      <path d="M12 21s-6-5-6-10a6 6 0 0112 0c0 5-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  diamond: <path d="M12 3l8 9-8 9-8-9 8-9z" />,
}

export default function Icon({ name, size = 24, className = '', stroke = 1.6 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] || null}
    </svg>
  )
}

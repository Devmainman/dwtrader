// Duotone icons drawn for this app: a soft tinted fill under a crisp 1.8px outline, both in
// currentColor. `active` deepens the fill (used by the bottom nav for the current tab).
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
// Inner details (door, chart line, dots) take the ink colour so they stay visible on a full fill.
const Dk = (ink) => ({ ...S, stroke: ink || 'currentColor' });

const ICONS = {
  home: (soft, ink) => (
    <>
      <path d="M4.5 10.4 12 4.3l7.5 6.1V18.6a1.9 1.9 0 0 1-1.9 1.9H6.4a1.9 1.9 0 0 1-1.9-1.9z" fill="currentColor" opacity={soft} />
      <path d="M4.5 10.4 12 4.3l7.5 6.1V18.6a1.9 1.9 0 0 1-1.9 1.9H6.4a1.9 1.9 0 0 1-1.9-1.9z" {...S} />
      <path d="M9.8 20.5v-4.2a2.2 2.2 0 0 1 4.4 0v4.2" {...Dk(ink)} />
    </>
  ),
  chart: (soft, ink) => (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="currentColor" opacity={soft} />
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" {...S} />
      <path d="m7.5 14.8 3-3.4 2.6 2.1 3.6-4.6" {...Dk(ink)} />
      <circle cx="16.7" cy="8.9" r="1.1" fill={ink || "currentColor"} />
    </>
  ),
  support: (soft, ink) => (
    <>
      <path d="M12 4.2c4.4 0 8 3 8 6.9s-3.6 6.9-8 6.9c-1 0-2-.15-2.9-.45L5 19.2l1.15-3.3C4.8 14.7 4 13 4 11.1c0-3.9 3.6-6.9 8-6.9z" fill="currentColor" opacity={soft} />
      <path d="M12 4.2c4.4 0 8 3 8 6.9s-3.6 6.9-8 6.9c-1 0-2-.15-2.9-.45L5 19.2l1.15-3.3C4.8 14.7 4 13 4 11.1c0-3.9 3.6-6.9 8-6.9z" {...S} />
      <circle cx="8.6" cy="11.1" r="1" fill={ink || "currentColor"} /><circle cx="12" cy="11.1" r="1" fill={ink || "currentColor"} /><circle cx="15.4" cy="11.1" r="1" fill={ink || "currentColor"} />
    </>
  ),
  user: (soft) => (
    <>
      <circle cx="12" cy="8.3" r="3.7" fill="currentColor" opacity={soft} />
      <path d="M5 19.3c1.2-3.2 3.9-4.9 7-4.9s5.8 1.7 7 4.9a.9.9 0 0 1-.85 1.2H5.85A.9.9 0 0 1 5 19.3z" fill="currentColor" opacity={soft} />
      <circle cx="12" cy="8.3" r="3.7" {...S} />
      <path d="M5 19.3c1.2-3.2 3.9-4.9 7-4.9s5.8 1.7 7 4.9a.9.9 0 0 1-.85 1.2H5.85A.9.9 0 0 1 5 19.3z" {...S} />
    </>
  ),
  deposit: (soft) => (
    <>
      <path d="M3.8 13.8h4.3l1.4 2.4h5l1.4-2.4h4.3v4.4a2.3 2.3 0 0 1-2.3 2.3H6.1a2.3 2.3 0 0 1-2.3-2.3z" fill="currentColor" opacity={soft} />
      <path d="M3.8 13.8h4.3l1.4 2.4h5l1.4-2.4h4.3v4.4a2.3 2.3 0 0 1-2.3 2.3H6.1a2.3 2.3 0 0 1-2.3-2.3z" {...S} />
      <path d="M12 3.5v8.7M8.6 8.9 12 12.3l3.4-3.4" {...S} />
    </>
  ),
  withdraw: (soft) => (
    <>
      <path d="M3.8 13.8h4.3l1.4 2.4h5l1.4-2.4h4.3v4.4a2.3 2.3 0 0 1-2.3 2.3H6.1a2.3 2.3 0 0 1-2.3-2.3z" fill="currentColor" opacity={soft} />
      <path d="M3.8 13.8h4.3l1.4 2.4h5l1.4-2.4h4.3v4.4a2.3 2.3 0 0 1-2.3 2.3H6.1a2.3 2.3 0 0 1-2.3-2.3z" {...S} />
      <path d="M12 12.3V3.6M8.6 7 12 3.6 15.4 7" {...S} />
    </>
  ),
  convert: (soft) => (
    <>
      <circle cx="12" cy="12" r="8.6" fill="currentColor" opacity={soft * 0.7} />
      <path d="M7.2 9.4h9.6l-2.6-2.6M16.8 14.6H7.2l2.6 2.6" {...S} />
    </>
  ),
  candles: (soft) => (
    <>
      <rect x="5" y="8.2" width="4.4" height="7.4" rx="1.3" fill="currentColor" opacity={soft} />
      <rect x="14.6" y="6" width="4.4" height="6.4" rx="1.3" fill="currentColor" opacity={soft} />
      <rect x="5" y="8.2" width="4.4" height="7.4" rx="1.3" {...S} />
      <rect x="14.6" y="6" width="4.4" height="6.4" rx="1.3" {...S} />
      <path d="M7.2 5v3.2M7.2 15.6V19M16.8 3.5V6M16.8 12.4v4.4" {...S} />
    </>
  ),
  more: (soft) => (
    <>
      <rect x="4" y="4" width="6.6" height="6.6" rx="2" fill="currentColor" opacity={soft} />
      <rect x="13.4" y="13.4" width="6.6" height="6.6" rx="2" fill="currentColor" opacity={soft} />
      <rect x="4" y="4" width="6.6" height="6.6" rx="2" {...S} />
      <rect x="13.4" y="4" width="6.6" height="6.6" rx="2" {...S} />
      <rect x="4" y="13.4" width="6.6" height="6.6" rx="2" {...S} />
      <rect x="13.4" y="13.4" width="6.6" height="6.6" rx="2" {...S} />
    </>
  )
};

export default function Duo({ name, size = 20, active = false, soft, ink, className = '', ...rest }) {
  const draw = ICONS[name];
  if (!draw) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className} {...rest}>
      {draw(soft ?? (active ? 0.32 : 0.16), ink)}
    </svg>
  );
}

/** Lucide-compatible wrapper so Duo icons can sit where `<Icon className=… />` is expected. */
export const duo = (name) => function DuoIcon({ className = '', strokeWidth, ...rest }) { return <Duo name={name} className={className} {...rest} />; };

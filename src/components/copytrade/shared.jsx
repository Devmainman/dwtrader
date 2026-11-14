// Small building blocks shared by the copy-trading pages.
import { useState } from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import { toast } from '../../lib/toast';
import { STATIC_BASE_URL } from '../../api/config';
import { copyTradingApi, apiError } from '../../api/products';
import { Badge } from '../products/ui';

export const pct = (v, digits = 2) => {
  const n = Number(v) || 0;
  return `${n > 0 ? '+' : ''}${n.toFixed(digits)}%`;
};

export const toneOf = (v) => {
  const n = Number(v) || 0;
  return n > 0 ? 'text-emerald-400' : n < 0 ? 'text-red-400' : 'text-neutral-300';
};

export const compact = (n) => new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(Number(n) || 0);

const RISK = {
  low: { label: 'Low risk', tone: 'success' },
  medium: { label: 'Medium risk', tone: 'info' },
  high: { label: 'High risk', tone: 'warning' },
  very_high: { label: 'Very high risk', tone: 'danger' }
};
export const RiskBadge = ({ level }) => {
  const r = RISK[level] || RISK.medium;
  return <Badge tone={r.tone}>{r.label}</Badge>;
};

const avatarSrc = (src) => (!src ? '' : /^(https?:|data:)/.test(src) ? src : `${STATIC_BASE_URL}${src.startsWith('/') ? '' : '/'}${src}`);

export function Avatar({ src, name, size = 44, badge }) {
  const [failed, setFailed] = useState(false);
  const initials = String(name || '?').replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const url = avatarSrc(src);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {url && !failed ? (
        <img src={url} alt="" onError={() => setFailed(true)} style={{ width: size, height: size }} className="rounded-full object-cover bg-neutral-800 ring-2 ring-white/10" />
      ) : (
        <div style={{ width: size, height: size }} className="rounded-full flex items-center justify-center font-semibold text-sm text-white bg-[linear-gradient(135deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)] ring-2 ring-white/10">
          {initials || '?'}
        </div>
      )}
      {badge && badge !== 'none' && (
        <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-zinc-900 p-px">
          <VerifiedTick badge={badge} size={Math.max(14, Math.round(size * 0.34))} />
        </span>
      )}
    </div>
  );
}

/** Scalloped verification seal with a check: blue = verified, gold = elite (pro) trader. */
export function VerifiedTick({ badge, size = 16 }) {
  if (!badge || badge === 'none') return null;
  const gold = badge === 'gold';
  const id = `vt-${badge}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={gold ? 'Gold verified' : 'Verified'} className="shrink-0">
      <title>{gold ? 'Gold verified · elite trader' : 'Verified trader'}</title>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={gold ? '#FDE68A' : '#38BDF8'} />
          <stop offset="1" stopColor={gold ? '#D97706' : '#1D9BF0'} />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z" />
      <path fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M7.8 12.3l2.8 2.8 5.6-6" />
    </svg>
  );
}

/** Username with its verification tick (unverified traders simply have no tick). */
export const TraderName = ({ trader }) => (
  <span className="inline-flex items-center gap-1.5 font-semibold min-w-0">
    <span className="truncate">{trader.username}</span>
    {trader.badge && trader.badge !== 'none'
      ? <VerifiedTick badge={trader.badge} />
      : null}
  </span>
);

/** Follow / unfollow toggle that keeps its own count in sync. */
export function FollowButton({ trader, onChange, size = 'sm' }) {
  const [following, setFollowing] = useState(!!trader.isFollowing);
  const [busy, setBusy] = useState(false);
  const toggle = async (e) => {
    e.stopPropagation();
    setBusy(true);
    try {
      const r = following ? await copyTradingApi.unfollow(trader.traderId) : await copyTradingApi.follow(trader.traderId);
      setFollowing(r.isFollowing);
      onChange?.(r);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setBusy(false);
    }
  };
  const Icon = following ? UserCheck : UserPlus;
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-xl border transition disabled:opacity-50 ${size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} ${following ? 'border-white/15 text-neutral-300 hover:bg-neutral-800/60' : 'border-[var(--color-blue-700)]/60 text-white hover:bg-[var(--color-blue-700)]/10'}`}
    >
      <Icon className="w-3.5 h-3.5" />{following ? 'Following' : 'Follow'}
    </button>
  );
}

/** Minimal SVG line chart for equity curves / sparklines. */
export function Sparkline({ values, height = 40, className = "", emptyText = "No closed trades yet" }) {
  const data = (values || []).length ? [100, ...values] : [];
  if (data.length < 2) {
    return <div style={{ height }} className={`flex items-center text-xs text-neutral-500 ${className}`}>{emptyText}</div>;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const w = 100;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - 2 - ((v - min) / span) * (height - 4)}`).join(' ');
  const up = data[data.length - 1] >= data[0];
  const color = up ? '#34d399' : '#fb7185';
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ height }} className={`w-full ${className}`} aria-hidden="true">
      <polyline points={`0,${height} ${pts} ${w},${height}`} fill={color} fillOpacity="0.12" stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

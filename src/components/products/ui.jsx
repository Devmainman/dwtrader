// Shared building blocks for the cold storage, cards, wallet, investing,
// staking and real-estate pages. Matches the app's dark + pink/blue gradient look.
import { useCallback, useEffect, useState } from 'react';
import { X, Loader2, CircleHelp } from 'lucide-react';
import { toast } from '../../lib/toast';
import { apiError } from '../../api/products';

export const GRADIENT = 'bg-[linear-gradient(80deg,var(--color-blue-700)_0%,var(--color-blue-500)_100%)]';

export const formatMoney = (value, currency = 'USD') => {
  const n = Number(value) || 0;
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
};

export const formatNumber = (value, digits = 2) =>
  (Number(value) || 0).toLocaleString(undefined, { maximumFractionDigits: digits });

export const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '—');

/** Load data once and expose a reload function. */
export function useLoader(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await fn());
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load, setData };
}

/** Run an action with toasts and a busy flag. */
export function useAction() {
  const [busy, setBusy] = useState(false);
  const run = useCallback(async (fn, successMessage) => {
    setBusy(true);
    try {
      const result = await fn();
      if (successMessage) toast.success(typeof successMessage === 'function' ? successMessage(result) : successMessage);
      return result;
    } catch (err) {
      toast.error(apiError(err));
      return undefined;
    } finally {
      setBusy(false);
    }
  }, []);
  return { busy, run };
}

/*
 * Type scale & shapes (matches the Settings / Dashboard screens):
 *   page title 16px semibold · section title 14px semibold · body/value 14px
 *   label 12px neutral-400 · caption 10px neutral-500
 *   cards: #1D1D1F, rounded-xl, neutral-800 hairline · pills & sheets: rounded-3xl
 *   primary action: blue-600 pill
 */

/** Page shell. Phones keep the compact header; larger screens only widen and scale up (CSS only). */
export function Page({ title, subtitle, icon: Icon, actions, children }) {
  return (
    <div className="w-full max-w-5xl lg:max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 pt-4 lg:pt-6 pb-32 md:pb-8 text-zinc-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 lg:mb-6">
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl lg:rounded-2xl flex items-center justify-center bg-blue-600/15 text-blue-400 shrink-0">
              <Icon className="w-[18px] h-[18px] lg:w-5 lg:h-5" strokeWidth={2} />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-[17px] lg:text-xl font-semibold tracking-tight leading-tight">{title}</h1>
            {subtitle && <p className="text-xs lg:text-[13px] text-neutral-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function Panel({ title, action, className = '', children }) {
  return (
    <section className={`rounded-xl bg-[var(--card)] border border-neutral-800 p-4 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-3 gap-2">
          {title && <h2 className="text-sm font-semibold tracking-tight">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, hint, tone }) {
  const color = tone === 'up' ? 'text-emerald-400' : tone === 'down' ? 'text-red-400' : 'text-zinc-100';
  return (
    <div className="rounded-xl bg-[var(--card)] border border-neutral-800 px-4 py-3">
      <p className="text-xs text-neutral-400">{label}</p>
      <p className={`text-base font-semibold tracking-tight mt-1 tabular-nums ${color}`}>{value}</p>
      {hint && <p className="text-[10px] text-neutral-500 mt-0.5">{hint}</p>}
    </div>
  );
}

export function Button({ variant = 'primary', busy, className = '', children, ...props }) {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500',
    secondary: 'bg-neutral-800 text-zinc-100 hover:bg-neutral-700',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    ghost: 'text-neutral-300 hover:text-white hover:bg-white/5'
  };
  return (
    <button
      type="button"
      disabled={busy || props.disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-3xl h-9 px-4 text-xs font-medium transition active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${styles[variant]} ${className}`}
      {...props}
    >
      {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
}

export function Badge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-neutral-800 text-neutral-300',
    success: 'bg-emerald-500/15 text-emerald-400',
    warning: 'bg-amber-500/15 text-amber-400',
    danger: 'bg-red-500/15 text-red-400',
    info: 'bg-blue-500/15 text-blue-400'
  };
  return <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${tones[tone]}`}>{children}</span>;
}

/** Bottom sheet on phones, centered dialog on larger screens. */
export function Modal({ open, title, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-[2px] sm:p-4 animate-[fade-in_150ms_ease-out]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[var(--card)] border border-neutral-800 text-zinc-100 animate-[sheet-in_320ms_cubic-bezier(0.32,0.72,0,1)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-2"><span className="w-9 h-1 rounded-full bg-neutral-700" /></div>
        <div className="flex items-center justify-between px-5 pt-3 sm:pt-4 pb-3">
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          <button type="button" onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center bg-neutral-800 text-neutral-400 hover:text-white" aria-label="Close">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="px-5 pb-4">{children}</div>
        {footer && <div className="px-5 pb-5 pt-1 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs text-neutral-400 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[10px] text-neutral-500 mt-1">{hint}</span>}
    </label>
  );
}

export const inputClass =
  'w-full h-10 rounded-xl bg-neutral-900 border border-neutral-800 px-3 text-sm text-zinc-100 placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition';

/** Small sheet that asks for one amount. */
export function AmountModal({ open, title, label = 'Amount', currency, max, hint, confirmLabel = 'Confirm', busy, onClose, onSubmit }) {
  const [value, setValue] = useState('');
  useEffect(() => { if (open) setValue(''); }, [open]);
  const n = Number(value);
  const invalid = !(n > 0) || (max !== undefined && n > max);

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button busy={busy} disabled={invalid} onClick={() => onSubmit(n)}>{confirmLabel}</Button>
        </>
      )}
    >
      <Field label={`${label}${currency ? ` (${currency})` : ''}`} hint={hint}>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            autoFocus
            className={inputClass}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !invalid && onSubmit(n)}
          />
          {max !== undefined && <Button variant="secondary" className="h-10" onClick={() => setValue(String(max))}>Max</Button>}
        </div>
      </Field>
      {max !== undefined && <p className="text-xs text-neutral-400">Available {formatMoney(max, currency)}</p>}
    </Modal>
  );
}

/** Shimmering placeholder rows while data loads (feels faster than a spinner). */
export function Loading({ rows = 3 }) {
  return (
    <div className="space-y-2.5 py-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl bg-[var(--card)] p-3" style={{ opacity: 1 - i * 0.22 }}>
          <div className="w-9 h-9 rounded-full skeleton" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 w-1/2 rounded skeleton" />
            <div className="h-2 w-1/3 rounded skeleton" />
          </div>
          <div className="h-3 w-14 rounded skeleton" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300 flex items-center justify-between gap-3">
      <span>{message}</span>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Retry</Button>}
    </div>
  );
}

export function Empty({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 text-neutral-400" />
        </div>
      )}
      <p className="text-sm font-semibold">{title}</p>
      {text && <p className="text-xs text-neutral-400 mt-1 max-w-xs">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Progress({ value }) {
  return (
    <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
      <div className="h-full rounded-full bg-blue-600 transition-[width] duration-500" style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }} />
    </div>
  );
}

/** Segmented control (default) or underlined sub-tabs. */
/** Full-round pill tabs. Pass `how` (a few short steps) to add a "How it works" pill. */
export function Tabs({ tabs, value, onChange, how }) {
  const [showHow, setShowHow] = useState(false);
  return (
    <>
      <div className="flex w-full sm:w-auto sm:inline-flex items-center gap-0.5 rounded-full bg-neutral-800/80 p-1 mb-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={`flex-1 sm:flex-none px-4 h-8 rounded-full text-xs font-medium whitespace-nowrap transition ${value === t.value ? 'bg-neutral-600 text-white shadow-sm' : 'text-neutral-400 hover:text-zinc-200'}`}
          >
            {t.label}
          </button>
        ))}
        {how && (
          <button type="button" onClick={() => setShowHow(true)} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 h-8 rounded-full text-xs font-medium whitespace-nowrap text-blue-400 hover:text-blue-300 transition">
            <CircleHelp className="w-3.5 h-3.5" />How it works
          </button>
        )}
      </div>
      {how && <HowItWorks open={showHow} steps={how} onClose={() => setShowHow(false)} />}
    </>
  );
}

/** A short numbered explainer in a sheet. */
export function HowItWorks({ open, steps, onClose, title = 'How it works' }) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <ol className="space-y-4 pb-2">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600/15 text-blue-400 text-[11px] font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[13px] font-semibold text-zinc-100">{step[0]}</p>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{step[1]}</p>
            </div>
          </li>
        ))}
      </ol>
    </Modal>
  );
}

/** "How it works" pill for pages without tabs (goes in Page actions). */
export function HowItWorksButton({ steps }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-neutral-800 text-xs font-medium text-blue-400 hover:text-blue-300 transition">
        <CircleHelp className="w-3.5 h-3.5" />How it works
      </button>
      <HowItWorks open={open} steps={steps} onClose={() => setOpen(false)} />
    </>
  );
}

/* ---------------- Motion helpers ---------------- */

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Smoothly animates from the previous value to `value`. */
export function useAnimatedNumber(value, duration = 600) {
  const [display, setDisplay] = useState(Number(value) || 0);
  useEffect(() => {
    const to = Number(value) || 0;
    if (prefersReducedMotion()) { setDisplay(to); return undefined; }
    let raf;
    let from;
    let start;
    setDisplay((cur) => { from = cur; return cur; });
    const step = (t) => {
      if (start === undefined) start = t;
      const k = Math.min(1, (t - start) / duration);
      const eased = 1 - (1 - k) ** 3;
      setDisplay(from + (to - from) * eased);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

/** Number that counts to its new value; `format` turns the number into text. */
export function AnimatedNumber({ value, format = (n) => n.toFixed(2), className = '' }) {
  const n = useAnimatedNumber(value);
  return <span className={`tabular-nums ${className}`}>{format(n)}</span>;
}

/** Circular progress ring (0–100). */
export function ProgressRing({ value = 0, size = 44, stroke = 4, color = 'var(--color-blue-500)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#262626" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)}
          style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}

/** Wraps list items so they fade/slide in one after another. */
export const stagger = (i) => ({ style: { animationDelay: `${Math.min(i, 12) * 40}ms` }, className: 'animate-[rise-in_380ms_cubic-bezier(0.22,1,0.36,1)_both]' });

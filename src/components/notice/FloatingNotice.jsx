// A floating notice that springs down from the top of the screen.
// Used for the account-limit warning and for live notifications.
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const TONES = {
  info: { icon: 'bg-blue-500/15 text-blue-400', bar: 'bg-blue-500', button: 'bg-blue-600 hover:bg-blue-500' },
  warning: { icon: 'bg-amber-500/15 text-amber-400', bar: 'bg-amber-400', button: 'bg-amber-500 hover:bg-amber-400 text-black' },
  critical: { icon: 'bg-red-500/15 text-red-400', bar: 'bg-red-500', button: 'bg-red-600 hover:bg-red-500' }
};

/**
 * @param {object} props
 * @param {React.ComponentType} props.icon  lucide icon
 * @param {'info'|'warning'|'critical'} props.tone
 * @param {string} props.title
 * @param {string} [props.message]
 * @param {number} [props.progress]  0-100, shows a slim meter
 * @param {{label: string, onClick: () => void}} [props.action]
 * @param {() => void} [props.onDismiss]
 * @param {() => void} [props.onTap]  whole-card tap
 */
export default function FloatingNotice({ icon: Icon, tone = 'info', title, message, progress, action, onDismiss, onTap }) {
  const [leaving, setLeaving] = useState(false);
  const t = TONES[tone] || TONES.info;

  const dismiss = (e) => {
    e?.stopPropagation();
    setLeaving(true);
  };
  useEffect(() => {
    if (!leaving) return undefined;
    const id = setTimeout(() => onDismiss?.(), 240);
    return () => clearTimeout(id);
  }, [leaving, onDismiss]);

  return (
    <div className="fixed inset-x-0 top-0 z-[9500] flex justify-center px-3 pt-[max(env(safe-area-inset-top),10px)] pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        onClick={onTap}
        className={`pointer-events-auto w-full max-w-[420px] rounded-[22px] bg-[var(--card)]/90 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] px-3.5 py-3 ${onTap ? 'cursor-pointer' : ''} ${leaving ? 'animate-[notice-lift_240ms_ease-in_forwards]' : 'animate-[notice-drop_700ms_cubic-bezier(0.22,1,0.36,1)_both]'}`}
      >
        <div className="flex items-start gap-3">
          {Icon && (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${t.icon}`}>
              <Icon className="w-[18px] h-[18px] animate-[icon-nudge_700ms_ease-in-out_650ms_1]" strokeWidth={2.2} />
            </div>
          )}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-[13px] font-semibold text-zinc-100 leading-snug">{title}</p>
            {message && <p className="text-xs text-neutral-400 leading-snug mt-0.5 line-clamp-2">{message}</p>}
            {typeof progress === 'number' && (
              <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full rounded-full ${t.bar} transition-[width] duration-700`} style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
              </div>
            )}
            {action && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); action.onClick(); }}
                className={`mt-2.5 inline-flex items-center h-7 px-3.5 rounded-3xl text-[11px] font-semibold text-white transition active:scale-[0.96] ${t.button}`}
              >
                {action.label}
              </button>
            )}
          </div>
          {onDismiss && (
            <button type="button" onClick={dismiss} aria-label="Dismiss" className="w-6 h-6 -mr-1 rounded-full flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/10 shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Small capsule shown after a critical notice is dismissed; tap to bring it back. */
export function NoticePill({ icon: Icon, tone = 'critical', label, onOpen }) {
  const t = TONES[tone] || TONES.critical;
  // Sits just below the top bar so it never covers its controls.
  return (
    <div className="fixed inset-x-0 top-0 z-[9500] flex justify-center pt-[calc(env(safe-area-inset-top)+68px)] min-[769px]:pt-[22px] pointer-events-none">
      <button
        type="button"
        onClick={onOpen}
        className="pointer-events-auto inline-flex items-center gap-1.5 h-7 pl-1.5 pr-3 rounded-full bg-[var(--card)]/90 backdrop-blur-xl border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.45)] text-[11px] font-medium text-zinc-100 animate-[notice-drop_600ms_cubic-bezier(0.22,1,0.36,1)_both]"
      >
        <span className={`w-5 h-5 rounded-full flex items-center justify-center ${t.icon}`}>{Icon && <Icon className="w-3 h-3" strokeWidth={2.5} />}</span>
        {label}
      </button>
    </div>
  );
}

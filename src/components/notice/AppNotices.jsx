// Account-limit warning + live notification banner, both using FloatingNotice.
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Gauge, Info, ArrowRight, X, Bell, ShieldAlert, ArrowDownLeft, ArrowUpRight, Users, Layers, Building2, CreditCard, Mail, Sparkles } from 'lucide-react';
import FloatingNotice, { NoticePill } from './FloatingNotice';
import { useNotificationStore } from '../../context/NotificationContext';

const storage = {
  get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } }
};

/** Shows how close the account is to its balance limit, with a path to upgrade. */
export function AccountLimitNotice({ info }) {
  const navigate = useNavigate();
  const level = info?.exhausted ? 'exhausted' : info?.warning ? 'warning' : info?.nearLimit ? 'near' : null;
  const key = level ? `notice:limit:${level}` : null;
  const [state, setState] = useState('hidden'); // hidden | open | pill

  useEffect(() => {
    if (!level) { setState('hidden'); return undefined; }
    const dismissed = storage.get(key);
    if (dismissed) { setState(level === 'exhausted' ? 'pill' : 'hidden'); return undefined; }
    // Let the page settle before the notice drops in.
    const id = setTimeout(() => setState('open'), 600);
    return () => clearTimeout(id);
  }, [level, key]);

  if (!level || state === 'hidden') return null;

  const pct = Math.round(info.usagePercent || 0);
  const copy = {
    exhausted: { tone: 'critical', icon: AlertTriangle, title: 'Account limit reached', message: 'Upgrade your account to keep depositing and withdrawing.' },
    warning: { tone: 'warning', icon: Gauge, title: `You've used ${pct}% of your account limit`, message: 'Upgrade soon to avoid interruptions to deposits and withdrawals.' },
    near: { tone: 'info', icon: Info, title: `You've used ${pct}% of your account limit`, message: 'Upgrading raises your limit and unlocks more features.' }
  }[level];

  if (state === 'pill') {
    return <NoticePill icon={copy.icon} tone={copy.tone} label="Limit reached · Upgrade" onOpen={() => setState('open')} />;
  }

  return (
    <FloatingNotice
      icon={copy.icon}
      tone={copy.tone}
      title={copy.title}
      message={copy.message}
      progress={Math.min(100, pct)}
      action={{ label: 'Upgrade account', onClick: () => { storage.set(key, '1'); setState(level === 'exhausted' ? 'pill' : 'hidden'); navigate('/accountupgrade'); } }}
      onDismiss={() => { storage.set(key, '1'); setState(level === 'exhausted' ? 'pill' : 'hidden'); }}
    />
  );
}

/**
 * The account-limit banner that sits under the top bar on every app page and stays in view
 * while scrolling. It hops gently every few seconds so it is hard to miss. At 100% it can't
 * be dismissed; at 60-99% it can be hidden for this session.
 */
export function LimitBanner({ info }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const level = info?.exhausted ? 'exhausted' : info?.warning ? 'warning' : info?.nearLimit ? 'near' : null;
  const key = level ? `notice:limit-banner:${level}` : null;
  const [hidden, setHidden] = useState(() => !!(key && storage.get(key)));
  useEffect(() => { setHidden(!!(key && storage.get(key))); }, [key]);

  if (!level || hidden || pathname.startsWith('/accountupgrade')) return null;
  const pct = Math.min(100, Math.round(info.usagePercent || 0));
  const copy = {
    exhausted: { icon: AlertTriangle, title: 'Account limit reached', text: 'Deposits and withdrawals are paused until you upgrade.' },
    warning: { icon: Gauge, title: `${pct}% of your account limit used`, text: 'Upgrade now to avoid interruptions.' },
    near: { icon: Info, title: `${pct}% of your account limit used`, text: 'Upgrade to raise your limit.' }
  }[level];
  const Icon = copy.icon;
  return (
    <div className="sticky top-0 lg:top-[62px] z-[700] px-3 sm:px-5 lg:px-8 pt-2.5 pb-1 pointer-events-none">
      <div role="alert" className={`limit-banner limit-${level} keep-dark pointer-events-auto mx-auto max-w-[1280px]`}>
        <span className="limit-shine" aria-hidden />
        <span className="limit-icon"><Icon className="w-4 h-4" strokeWidth={2.2} /></span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold leading-tight truncate">{copy.title}</p>
          <p className="text-[11px] leading-snug opacity-90 line-clamp-2">{copy.text}</p>
          {level !== 'exhausted' && <div className="mt-1.5 h-1 rounded-full bg-white/25 overflow-hidden"><span className="block h-full rounded-full bg-white" style={{ width: `${pct}%` }} /></div>}
        </div>
        <button type="button" data-no-busy onClick={() => navigate('/accountupgrade')} className="limit-cta">
          Upgrade<ArrowRight className="w-3.5 h-3.5 limit-arrow" />
        </button>
        {level !== 'exhausted' && (
          <button type="button" data-no-busy onClick={() => { storage.set(key, '1'); setHidden(true); }} aria-label="Hide for now" className="shrink-0 -mr-1 w-7 h-7 rounded-full flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-white/15 transition">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

const TYPE_ICON = {
  security: ShieldAlert, deposit: ArrowDownLeft, withdrawal: ArrowUpRight, copy_trading: Users, staking: Layers,
  real_estate: Building2, card: CreditCard, message: Mail, welcome: Sparkles, promo: Sparkles
};
const TYPE_TONE = { security: 'warning' };

/** Briefly shows a notification the moment it arrives over the WebSocket. */
export function LiveNotificationBanner() {
  const navigate = useNavigate();
  const { incoming, dismissIncoming, markAsRead } = useNotificationStore();
  const [shown, setShown] = useState(null);

  useEffect(() => {
    if (!incoming) return undefined;
    setShown(incoming);
    const id = setTimeout(() => { setShown(null); dismissIncoming(); }, 5000);
    return () => clearTimeout(id);
  }, [incoming, dismissIncoming]);

  if (!shown) return null;
  return (
    <FloatingNotice
      key={shown.id}
      icon={TYPE_ICON[shown.type] || Bell}
      tone={TYPE_TONE[shown.type] || 'info'}
      title={shown.title}
      message={shown.content}
      onTap={() => {
        markAsRead(shown.id);
        setShown(null);
        dismissIncoming();
        navigate(shown.link || '/notification');
      }}
      onDismiss={() => { setShown(null); dismissIncoming(); }}
    />
  );
}

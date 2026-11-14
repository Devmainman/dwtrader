// Account-limit warning + live notification banner, both using FloatingNotice.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Gauge, Info, Bell, ShieldAlert, ArrowDownLeft, ArrowUpRight, Users, Layers, Building2, CreditCard, Mail, Sparkles } from 'lucide-react';
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

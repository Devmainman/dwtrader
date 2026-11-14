// Notifications screen: grouped by day, live, with read / unread / delete.
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, ShieldAlert, ArrowDownLeft, ArrowUpRight, Users, Layers, Building2, CreditCard, Mail, Sparkles,
  Receipt, Settings2, Trash2, MailOpen, ChevronRight
} from 'lucide-react';
import { useNotificationStore } from '../../context/NotificationContext';
import { Page, Button, Tabs, Loading, ErrorState, Empty } from '../products/ui';

const TYPE = {
  security: { icon: ShieldAlert, tint: 'bg-amber-500/15 text-amber-400' },
  deposit: { icon: ArrowDownLeft, tint: 'bg-emerald-500/15 text-emerald-400' },
  withdrawal: { icon: ArrowUpRight, tint: 'bg-blue-500/15 text-blue-400' },
  transaction: { icon: Receipt, tint: 'bg-blue-500/15 text-blue-400' },
  copy_trading: { icon: Users, tint: 'bg-violet-500/15 text-violet-400' },
  trading: { icon: Users, tint: 'bg-violet-500/15 text-violet-400' },
  staking: { icon: Layers, tint: 'bg-teal-500/15 text-teal-400' },
  real_estate: { icon: Building2, tint: 'bg-orange-500/15 text-orange-400' },
  card: { icon: CreditCard, tint: 'bg-sky-500/15 text-sky-400' },
  message: { icon: Mail, tint: 'bg-pink-500/15 text-pink-400' },
  welcome: { icon: Sparkles, tint: 'bg-pink-500/15 text-pink-400' },
  promo: { icon: Sparkles, tint: 'bg-pink-500/15 text-pink-400' },
  account: { icon: Settings2, tint: 'bg-neutral-700 text-neutral-300' },
  system: { icon: Bell, tint: 'bg-neutral-700 text-neutral-300' }
};

const DAY = 24 * 60 * 60 * 1000;
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); };

const groupOf = (date) => {
  const today = startOfDay(Date.now());
  const t = startOfDay(date);
  if (t === today) return 'Today';
  if (t === today - DAY) return 'Yesterday';
  if (t > today - 7 * DAY) return 'This week';
  return 'Earlier';
};

/** "now", "5m", "3h", or a short date. */
export const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 7 * 86400) return new Date(date).toLocaleDateString(undefined, { weekday: 'short' });
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export function TypeIcon({ type, size = 'md' }) {
  const t = TYPE[type] || TYPE.system;
  const Icon = t.icon;
  const box = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  return (
    <div className={`${box} rounded-full flex items-center justify-center shrink-0 ${t.tint}`}>
      <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-[18px] h-[18px]'} strokeWidth={2} />
    </div>
  );
}

function Row({ n, expanded, onToggle }) {
  const navigate = useNavigate();
  const { markAsUnread, deleteNotification } = useNotificationStore();
  return (
    <li className={`transition-colors ${expanded ? 'bg-white/[0.03]' : ''}`}>
      <button type="button" onClick={onToggle} className="w-full flex items-start gap-3 px-4 py-3 text-left">
        <span className={`mt-3.5 w-2 h-2 rounded-full shrink-0 ${n.isRead ? 'bg-transparent' : 'bg-blue-500'}`} aria-label={n.isRead ? undefined : 'Unread'} />
        <TypeIcon type={n.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <p className={`flex-1 text-sm leading-snug truncate ${n.isRead ? 'font-medium text-neutral-200' : 'font-semibold text-zinc-100'}`}>{n.title}</p>
            <span className="text-[10px] text-neutral-500 shrink-0">{timeAgo(n.createdAt)}</span>
          </div>
          {n.content && <p className={`text-xs text-neutral-400 leading-relaxed mt-0.5 ${expanded ? 'whitespace-pre-line' : 'line-clamp-2'}`}>{n.content}</p>}
        </div>
      </button>
      {expanded && (
        <div className="flex flex-wrap items-center gap-2 pl-[68px] pr-4 pb-3 -mt-1">
          {n.link && (
            <Button className="h-7 px-3 text-[11px]" onClick={() => navigate(n.link)}>
              Open<ChevronRight className="w-3 h-3" />
            </Button>
          )}
          <Button variant="secondary" className="h-7 px-3 text-[11px]" onClick={() => markAsUnread(n.id)}>
            <MailOpen className="w-3 h-3" />Mark as unread
          </Button>
          <Button variant="ghost" className="h-7 px-3 text-[11px] text-red-400 hover:text-red-300" onClick={() => deleteNotification(n.id)}>
            <Trash2 className="w-3 h-3" />Delete
          </Button>
          <span className="ml-auto text-[10px] text-neutral-500">{new Date(n.createdAt).toLocaleString()}</span>
        </div>
      )}
    </li>
  );
}

export default function NotificationCenter() {
  const { notifications, unreadCount, hasMore, loading, error, fetchNotifications, loadMore, markAsRead, markAllAsRead, clearRead } = useNotificationStore();
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);

  const visible = filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;
  const groups = useMemo(() => {
    const out = [];
    for (const n of visible) {
      const label = groupOf(n.createdAt);
      const last = out[out.length - 1];
      if (last && last.label === label) last.items.push(n);
      else out.push({ label, items: [n] });
    }
    return out;
  }, [visible]);

  const toggle = (n) => {
    setOpenId((id) => (id === n.id ? null : n.id));
    if (!n.isRead) markAsRead(n.id);
  };

  return (
    <Page
      title="Notifications"
      subtitle={unreadCount ? `${unreadCount} unread` : 'You’re all caught up'}
      icon={Bell}
      actions={unreadCount > 0 && <Button variant="secondary" onClick={markAllAsRead}>Mark all as read</Button>}
    >
      <Tabs value={filter} onChange={setFilter} tabs={[{ value: 'all', label: 'All' }, { value: 'unread', label: unreadCount ? `Unread (${unreadCount})` : 'Unread' }]} />

      {loading && !notifications.length ? <Loading /> : error && !notifications.length ? <ErrorState message={error} onRetry={fetchNotifications} /> : visible.length === 0 ? (
        <div className="rounded-xl bg-[#1D1D1F] border border-neutral-800">
          <Empty icon={Bell} title={filter === 'unread' ? 'No unread notifications' : 'No notifications yet'} text="Deposits, withdrawals, trades and account alerts will show up here." />
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map((g) => (
            <section key={g.label}>
              <h2 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 px-1 mb-1.5">{g.label}</h2>
              <ul className="rounded-xl bg-[#1D1D1F] border border-neutral-800 divide-y divide-neutral-800 overflow-hidden">
                {g.items.map((n) => <Row key={n.id} n={n} expanded={openId === n.id} onToggle={() => toggle(n)} />)}
              </ul>
            </section>
          ))}
          <div className="flex items-center justify-between">
            {hasMore ? <Button variant="secondary" busy={loading} onClick={loadMore}>Load more</Button> : <span className="text-[10px] text-neutral-500">That’s everything from the last 180 days.</span>}
            {notifications.some((n) => n.isRead) && <Button variant="ghost" onClick={clearRead}>Clear read</Button>}
          </div>
        </div>
      )}
    </Page>
  );
}

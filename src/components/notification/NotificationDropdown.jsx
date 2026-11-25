// Bell with live unread badge and a compact popover of recent notifications.
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '../../context/NotificationContext';
import { TypeIcon, timeAgo } from './NotificationCenter';

export default function NotificationDropdown({ className = '' }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const openItem = (n) => {
    if (!n.isRead) markAsRead(n.id);
    setOpen(false);
    navigate(n.link || '/notification');
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-full flex items-center justify-center bg-zinc-900 border border-neutral-800 text-zinc-100 hover:bg-neutral-800 transition"
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
      >
        <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
        {unreadCount > 0 && (
          <span key={unreadCount} className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-semibold flex items-center justify-center ring-2 ring-[var(--card)] animate-[notice-drop_500ms_cubic-bezier(0.22,1,0.36,1)_both]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed left-3 right-3 top-16 md:absolute md:left-auto md:right-0 md:top-11 md:w-[360px] z-[9000] rounded-2xl bg-[var(--card)]/95 backdrop-blur-xl border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.55)] overflow-hidden animate-[sheet-in_260ms_cubic-bezier(0.32,0.72,0,1)]">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="text-sm font-semibold text-zinc-100">Notifications</p>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllAsRead} className="text-[11px] font-medium text-blue-400 hover:text-blue-300">Mark all as read</button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="px-4 pb-5 pt-2 text-xs text-neutral-400">No notifications yet.</p>
          ) : (
            <ul className="max-h-[60vh] md:max-h-96 overflow-y-auto divide-y divide-neutral-800 [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent]">
              {notifications.slice(0, 8).map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => openItem(n)} className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-white/[0.03]">
                    <TypeIcon type={n.type} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <p className={`flex-1 text-[13px] truncate ${n.isRead ? 'text-neutral-300' : 'font-semibold text-zinc-100'}`}>{n.title}</p>
                        <span className="text-[10px] text-neutral-500 shrink-0">{timeAgo(n.createdAt)}</span>
                      </div>
                      {n.content && <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{n.content}</p>}
                    </div>
                    {!n.isRead && <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => { setOpen(false); navigate('/notification'); }}
            className="w-full py-2.5 text-[12px] font-medium text-blue-400 hover:text-blue-300 border-t border-neutral-800"
          >
            See all notifications
          </button>
        </div>
      )}
    </div>
  );
}

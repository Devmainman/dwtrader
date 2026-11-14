// One shared notification store for the whole app, kept live over the WebSocket.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { useUserAuth } from './UserAuthContext';

const NotificationContext = createContext(null);
const PAGE = 20;

export function NotificationProvider({ children }) {
  const { token } = useUserAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [incoming, setIncoming] = useState(null); // latest live notification, for the in-app banner
  const wsRef = useRef(null);
  const retryRef = useRef({ attempts: 0, timer: null });

  const api = useMemo(() => axios.create({
    baseURL: `${API_BASE_URL}/notifications`,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  }), [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/', { params: { limit: PAGE } });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setHasMore(!!data.hasMore);
      setCursor(data.nextCursor || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load notifications');
    } finally {
      setLoading(false);
    }
  }, [api, token]);

  const loadMore = useCallback(async () => {
    if (!token || !cursor) return;
    setLoading(true);
    try {
      const { data } = await api.get('/', { params: { limit: PAGE, before: cursor } });
      setNotifications((prev) => {
        const seen = new Set(prev.map((n) => n.id));
        return [...prev, ...(data.notifications || []).filter((n) => !seen.has(n.id))];
      });
      setHasMore(!!data.hasMore);
      setCursor(data.nextCursor || null);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load more');
    } finally {
      setLoading(false);
    }
  }, [api, cursor, token]);

  // Optimistic updates keep the UI instant; the server's count is applied when it answers.
  const markAsRead = useCallback(async (id) => {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.isRead) return;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      const { data } = await api.patch(`/${id}/read`);
      setUnreadCount(data.unreadCount);
    } catch {
      fetchNotifications();
    }
  }, [api, notifications, fetchNotifications]);

  const markAsUnread = useCallback(async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)));
    try {
      const { data } = await api.patch(`/${id}/unread`);
      setUnreadCount(data.unreadCount);
    } catch {
      fetchNotifications();
    }
  }, [api, fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await api.patch('/read-all');
    } catch {
      fetchNotifications();
    }
  }, [api, fetchNotifications]);

  const deleteNotification = useCallback(async (id) => {
    const target = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.isRead) setUnreadCount((c) => Math.max(0, c - 1));
    try {
      const { data } = await api.delete(`/${id}`);
      setUnreadCount(data.unreadCount);
    } catch {
      fetchNotifications();
    }
  }, [api, notifications, fetchNotifications]);

  const clearRead = useCallback(async () => {
    setNotifications((prev) => prev.filter((n) => !n.isRead));
    try {
      await api.delete('/', { params: { scope: 'read' } });
    } catch {
      fetchNotifications();
    }
  }, [api, fetchNotifications]);

  // Live updates: reconnect with backoff, close on logout.
  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return undefined;
    }
    fetchNotifications();
    let closed = false;
    let everOpened = false;
    let failures = 0;
    let poll = null;
    // Hosts without WebSockets (e.g. serverless): poll instead of retrying forever.
    const startPolling = () => {
      if (poll) return;
      poll = setInterval(() => { if (document.visibilityState === 'visible') fetchNotifications(); }, 30000);
    };

    const connect = () => {
      if (closed) return;
      const ws = new WebSocket(`${API_BASE_URL.replace(/^http/, 'ws')}/notifications/ws?token=${encodeURIComponent(token)}`);
      wsRef.current = ws;
      ws.onopen = () => {
        everOpened = true;
        failures = 0;
        retryRef.current.attempts = 0;
        if (poll) { clearInterval(poll); poll = null; }
      };
      ws.onmessage = (event) => {
        let msg;
        try { msg = JSON.parse(event.data); } catch { return; }
        if (msg.type !== 'notification' || !msg.data) return;
        const { kind, notification, unreadCount: count } = msg.data;
        if (typeof count === 'number') setUnreadCount(count);
        if (kind === 'notification.created' && notification) {
          setNotifications((prev) => (prev.some((n) => n.id === notification.id) ? prev : [notification, ...prev]));
          setIncoming(notification);
        }
      };
      ws.onclose = (e) => {
        wsRef.current = null;
        if (closed || e.code === 4001) return; // logged out or token rejected
        if (!everOpened && ++failures >= 2) { startPolling(); return; }
        const attempt = Math.min(retryRef.current.attempts + 1, 6);
        retryRef.current.attempts = attempt;
        retryRef.current.timer = setTimeout(connect, Math.min(30000, 1000 * 2 ** attempt));
      };
    };
    connect();

    // Catch up when the tab becomes visible again (sockets can drop while asleep).
    const onVisible = () => { if (document.visibilityState === 'visible') fetchNotifications(); };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      closed = true;
      clearTimeout(retryRef.current.timer);
      if (poll) clearInterval(poll);
      document.removeEventListener('visibilitychange', onVisible);
      wsRef.current?.close(1000, 'logout');
      wsRef.current = null;
    };
  }, [token, fetchNotifications]);

  const value = useMemo(() => ({
    notifications, unreadCount, hasMore, loading, error, incoming,
    fetchNotifications, loadMore, markAsRead, markAsUnread, markAllAsRead, deleteNotification, clearRead,
    dismissIncoming: () => setIncoming(null)
  }), [notifications, unreadCount, hasMore, loading, error, incoming, fetchNotifications, loadMore, markAsRead, markAsUnread, markAllAsRead, deleteNotification, clearRead]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotificationStore = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationStore must be used inside <NotificationProvider>');
  return ctx;
};

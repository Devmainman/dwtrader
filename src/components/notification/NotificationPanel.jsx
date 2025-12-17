import React, { useState, useEffect, useRef } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { useUserAuth } from "../../context/UserAuthContext";
import NotificationCard from "./NotificationCard";
import { API_BASE_URL } from '../../api/config';

const NotificationPanel = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  } = useNotifications();

  const { token, user } = useUserAuth();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const socketRef = useRef(null);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  // Filter notifications
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  // Send welcome notification on first connection
  fetch(`${API_BASE_URL}/notifications/welcome`, {
    method: "POST",  // <-- Add this
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: user?.id }) // Or any relevant data your backend expects
  });
  

  // WebSocket setup
  useEffect(() => {
    if (!token) return;

    const wsUrl = API_BASE_URL.replace(/^http/, 'ws') + '/notifications/ws?token=' + token;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') {
        fetchNotifications();
      }
    };

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [token, fetchNotifications]);

  if (loading) {
    return <div className="flex justify-center items-center h-full text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (selectedNotification) {
    return (
      <section className="flex flex-col items-center px-5 pt-32 pb-64 w-full bg-neutral-900 min-h-screen">
        <article className="flex flex-col gap-6 items-start w-[350px]">
          <header className="text-base font-medium text-stone-300">
            Notification Details
          </header>
          <div className="flex flex-col gap-1.5 items-start">
            <h1 className="text-xs font-medium text-neutral-400">
              {selectedNotification.title}
            </h1>
            <p className="text-xs text-neutral-500">
              <span className="font-bold">Date:</span> {new Date(selectedNotification.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col gap-4 items-start w-full">
            <h2 className="text-sm font-medium text-neutral-400">Body:</h2>
            <p className="text-xs text-neutral-500 w-[350px]">
              {selectedNotification.content || "No content available."}
            </p>
          </div>
        </article>
        <footer className="mt-20 w-[325px]">
          <button
            className="p-2.5 text-xs text-white bg-blue-600 rounded-xl w-full"
            onClick={() => {
              markAsRead(selectedNotification.id).then(fetchNotifications);
              setSelectedNotification(null);
            }}
          >
            Mark as Read & Back
          </button>
        </footer>
      </section>
    );
  }

  return (
    <section className="flex flex-col  lg:mt-6 lg:rounded-xl w-full overflow-y-auto bg-neutral-900">
      {/* Connection status - simple indicator */}
      {/* <div className="p-2 text-xs text-center bg-green-600">
        Live notifications active
      </div> */}

      {/* Unread notifications */}
      {unreadNotifications.length > 0 && (
        <div className="p-4 bg-[#1D1D1F]">
          <div className="flex flex-col gap-3">
            {unreadNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onAction={() => markAsRead(notification.id).then(fetchNotifications)}
                actionText="Mark as Read"
                onClick={() => setSelectedNotification(notification)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Read notifications */}
      {readNotifications.length > 0 && (
        <div className="p-4">
          <div className="flex flex-col gap-3">
            {readNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onAction={() => deleteNotification(notification.id).then(fetchNotifications)}
                actionText="Delete"
                onClick={() => setSelectedNotification(notification)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mark all as read button */}
      {unreadCount > 0 && (
        <div className="p-4 sticky lg:flex lg:justify-center bottom-0 bg-neutral-900 border-t border-neutral-800">
          <button
            className="w-full lg:w-[200px] p-4 text-[10px] text-white bg-blue-600 rounded-full"
            onClick={() => markAllAsRead().then(fetchNotifications)}
          >
            Mark All as Read
          </button>
        </div>
      )}
    </section>
  );
};

export default NotificationPanel;
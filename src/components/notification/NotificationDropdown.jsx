import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationCard from "./NotificationCard";
import NotificationIcon from "../../assets/notification.svg"; // ✅ Import icon here

const NotificationDropdown = ({
  notifications = [],
  notificationCount = 0,
  markAsRead,
  deleteNotification,
  loading,
  error,
  markAllAsRead
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
    setIsOpen(false);
    navigate("/notification");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <img src={NotificationIcon} alt="notifications" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-[8px] font-bold bg-blue-500 text-white rounded-full ring-2 ring-zinc-900">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="fixed top-14 left-0 right-0 bg-[#1D1D1F] shadow-lg z-50 h-[50vh] overflow-y-auto md:absolute md:right-0 md:left-auto md:top-full md:mt-2 md:w-80 md:h-auto md:max-h-96">
          <div className="p-4 max-w-screen mx-auto md:p-0">
            <div className="flex justify-between items-center mb-4 p-4 border-b border-neutral-700 md:px-4 md:py-3">
              <h3 className="text-sm font-medium text-white">Notifications</h3>
              {notificationCount > 0 && (
                <button
                  onClick={async () => {
                    try {
                      await markAllAsRead();
                    } catch (err) {
                      console.error("Failed to mark all as read:", err);
                    }
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : notifications.length > 0 ? (
              <div className="flex flex-col gap-3 px-4 md:px-0">
                {[...notifications]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 3)
                  .map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onAction={() =>
                        notification.isRead
                          ? deleteNotification(notification.id)
                          : markAsRead(notification.id)
                      }
                      actionText={notification.isRead ? "Delete" : "Mark as Read"}
                      onClick={() => handleNotificationClick(notification)}
                    />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-neutral-400">No notifications yet</p>
              </div>
            )}

            {notifications.length > 3 && (
              <div className="w-full text-center mt-4 p-4 border-t border-neutral-700">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/notification");
                  }}
                  className="bg-blue-500 text-[10px] text-white py-2 px-4 rounded-xl hover:bg-blue-600"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

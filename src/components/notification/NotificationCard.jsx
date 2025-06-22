import React from "react";
import { TimeIcon } from "./Icons";

const NotificationCard = ({ notification, onAction, actionText, onClick }) => {
  const getNotificationIcon = (type) => {
    const icons = {
      security: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 10.6667V12M8 5.33333V7.99999M4 6.66666L5.33333 8M10.6667 8L12 6.66666M7.99999 14.6667C11.6819 14.6667 14 12.3486 14 8.66666C14 4.98476 11.6819 2.66666 7.99999 2.66666C4.3181 2.66666 2 4.98476 2 8.66666C2 12.3486 4.3181 14.6667 7.99999 14.6667Z" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      transaction: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 8.66667H14M2 8.66667L4 10.6667M2 8.66667L4 6.66667M14 5.33333H2M14 5.33333L12 3.33333M14 5.33333L12 7.33333" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      account: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.3333 14V12.6667C13.3333 11.9594 13.0523 11.2811 12.5522 10.781C12.0521 10.281 11.3739 10 10.6666 10H5.33329C4.62605 10 3.94777 10.281 3.44767 10.781C2.94758 11.2811 2.66663 11.9594 2.66663 12.6667V14M10.6666 4.66667C10.6666 6.13943 9.47276 7.33333 7.99996 7.33333C6.5272 7.33333 5.33329 6.13943 5.33329 4.66667C5.33329 3.19391 6.5272 2 7.99996 2C9.47276 2 10.6666 3.19391 10.6666 4.66667Z" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      promo: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4.66663 8.66667L7.99996 12L11.3333 8.66667M4.66663 5.33333L7.99996 8.66667L11.3333 5.33333" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      referral: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 5.33333V10.6667M5.33333 8H10.6667M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      default: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 5.33325V7.99992H10.6667M14 7.99992C14 11.6818 11.6819 13.9999 8 13.9999C4.3181 13.9999 2 11.6818 2 7.99992C2 4.31802 4.3181 1.99992 8 1.99992C11.6819 1.99992 14 4.31802 14 7.99992Z" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };

    return icons[type] || icons.default;
  };

  return (
    <div
      className={`flex justify-center px-3 items-center pt-4 pb-1 w-full rounded-lg ${
        notification.isRead ? 'bg-neutral-800' : 'bg-neutral-900'
      } cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex flex-col gap-3.5 items-end h-[108px] w-full">
        <div className="flex gap-2.5 items-start w-full">
          <div className={`flex justify-center items-center p-0.5 w-7 h-7 ${
            notification.isRead ? 'bg-neutral-700' : 'bg-green-700'
          } border border-neutral-400 rounded-full`}>
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex flex-col gap-1.5 items-start w-[277px]">
            <h3 className="w-full text-sm font-medium text-neutral-400">
              {notification.title}
            </h3>
            <p className="w-full text-xs text-neutral-600 line-clamp-3">
              {notification.content || "No content available."}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-1.5 items-center">
            <TimeIcon />
            <time className="text-xs text-neutral-500">
              {new Date(notification.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
          <button
            className="text-xs text-blue-600 bg-neutral-800 border border-zinc-900 px-2 py-1 rounded-xl"
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
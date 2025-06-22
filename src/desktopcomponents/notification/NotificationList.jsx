"use client";
import React, { useState } from "react";
import NotificationItem from "./NotificationItem";
import NotificationBody from "./notificationbody/Notification"; // Import the component

const NotificationList = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Sample notification data
  const notifications = Array(7).fill({
    date: "27 Nov, 2024",
    subject: "KYC Submission Successful",
    status: "Pending",
  });

  return (
    <section className="flex overflow-hidden w-[1080px] gap-2.5 justify-center items-center p-4 mt-5 rounded-xl border border-solid bg-[#1D1D1F] border-neutral-600">
      <div className="flex-1 shrink self-stretch my-auto w-full basis-0 min-w-60 max-md:max-w-full">
        {/* If a notification is selected, show NotificationBody */}
        {selectedNotification ? (
          <NotificationBody
            notification={selectedNotification}
            onBack={() => setSelectedNotification(null)} // Go back to the list
          />
        ) : (
          <>
            <div className="w-full max-md:max-w-full">
              <div className="w-full max-md:max-w-full">
                <div className="flex flex-wrap gap-10 justify-between items-center w-full whitespace-nowrap max-md:max-w-full">
                  <h2 className="self-stretch my-auto text-sm font-medium tracking-normal leading-tight text-zinc-100 w-[82px]">
                    Notification
                  </h2>
                </div>
              </div>
            </div>

            <div className="mt-4 w-full max-md:max-w-full">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`cursor-pointer ${index > 0 ? "mt-2.5" : ""}`}
                  onClick={() => setSelectedNotification(notification)}
                >
                  <NotificationItem
                    date={notification.date}
                    subject={notification.subject}
                    status={notification.status}
                  />
                </div>
              ))}
            </div>

            <p className="mt-4 text-[10px] text-center text-blue-600 max-md:max-w-full">
              Showing All
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default NotificationList;

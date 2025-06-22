import React from "react";
import ReturnButton from "./ReturnButton";

const NotificationDetails = ({ notification, onClose }) => {
  return (
    <section className="flex flex-col items-center px-5 pt-32 pb-64 w-full bg-neutral-900 min-h-[screen]">
      <article className="flex flex-col gap-6 items-start w-[350px]">
        <header className="text-base font-medium tracking-normal leading-5 text-stone-300">
          Notification Details
        </header>
        <div className="flex flex-col gap-1.5 items-start">
          <h1 className="text-xs font-medium tracking-normal leading-4 text-neutral-400">
            {notification.title}
          </h1>
          <p className="text-xs text-neutral-500">
            <span className="font-bold">Date:</span> {notification.time}
          </p>
        </div>
        <div className="flex flex-col gap-4 items-start w-full">
          <h2 className="text-sm font-medium tracking-normal leading-4 text-neutral-400">
            Body:
          </h2>
          <p className="text-xs tracking-normal leading-5 text-neutral-500 w-[350px]">
            {notification.content || "No content available."}
          </p>
        </div>
      </article>
      <footer className="mt-20 w-[325px]">
        <ReturnButton onClick={onClose} />
      </footer>
    </section>
  );
};

export default NotificationDetails;

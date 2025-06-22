import React from "react";

function MessageItem({ sender, content, timestamp, isSupport }) {
  return (
    <article
      className={`flex overflow-hidden flex-col py-1 px-3 rounded-tl-none rounded-tr-2xl rounded-bl-2xl rounded-br-2xl mt-${
        isSupport ? "5" : "0"
      } max-w-full ${
        isSupport
          ? "self-end rounded-tl-2xl rounded-tr-none rounded-bl-2xl rounded-br-2xl bg-blue-950"
          : "rounded-2xl bg-neutral-800"
      } w-[226px]`}
    >
      <h3 className="self-start ml-3 text-[10px] text-white">{sender}</h3>
      <p className="gap-5 px-4 pt-1 pb-4 mt-2 text-[8px] border-t border-solid border-t-[color:var(--Neutral,#2B2B2E)] min-h-[31px] text-neutral-500">
        {content}
      </p>
      <time className="self-end mt-1 text-[6px] text-neutral-400">
        {timestamp}
      </time>
    </article>
  );
}

export default MessageItem;

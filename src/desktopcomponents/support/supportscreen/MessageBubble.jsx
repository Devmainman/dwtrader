import React from "react";

const MessageBubble = ({ user, message, timestamp, isSupport }) => {
  return (
    <article
      className={`flex ${
        isSupport ? "justify-start" : "justify-end"
      } w-full`}
    >
      <div
        className={`flex flex-col gap-5 px-2.5 pt-5 pb-2.5 max-w-[526px] rounded-xl ${
          isSupport ? "bg-blue-950 items-start" : "bg-black bg-opacity-80 items-end"
        }`}
      >
        <header className="flex gap-1.5 items-center">
          <div className="overflow-hidden rounded-2xl border-fuchsia-600 bg-stone-300 border-[0.611px] h-[22px] w-[22px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/dc34678ada545e4879167d3a6a30a3d7e484f0d9"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-xs text-white">{user}</h3>
        </header>
        <p className="gap-5 px-4 py-1 text-xs rounded-3xl border border-neutral-600 h-[31px] text-zinc-100 flex items-center">
          {message}
        </p>
        <time className="text-xs text-neutral-400">{timestamp}</time>
      </div>
    </article>
  );
};

export default MessageBubble;

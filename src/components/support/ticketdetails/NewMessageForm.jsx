"use client";
import React, { useState } from "react";

function NewMessageForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle message submission logic here
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-28 w-full">
      <label
        htmlFor="newMessage"
        className="block text-[10px] font-semibold text-neutral-400"
      >
        New Message
      </label>

      <div className="flex gap-1.5 justify-center items-center mt-1.5 w-full text-neutral-500">
        <input
          id="newMessage"
          type="text"
          placeholder="Type in Text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="gap-2.5 self-stretch px-2.5 py-5 my-auto rounded-3xl bg-[var(--card)] min-h-[49px] min-w-60 w-[303px] text-[10px]"
        />
        <button type="button" aria-label="Attach file">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f19b3e587affa2608c5bc4f99fb0e04c7d07265f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="Attachment"
            className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square"
          />
        </button>
      </div>

      <button
        type="submit"
        className="w-full gap-2.5 self-stretch px-2.5 py-2 mt-6 text-xs tracking-normal leading-none text-center whitespace-nowrap bg-blue-600 rounded-3xl min-h-[31px] text-zinc-100"
      >
        Send
      </button>
    </form>
  );
}

export default NewMessageForm;

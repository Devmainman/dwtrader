"use client";
import React, { useState } from "react";

export default function Support4({ ticket, onBack }) {
  return (
    <section className="overflow-hidden px-5 py-2 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
      <div className="w-full">
        <TicketHeader onBack={onBack} />
        <TicketDetails />
      </div>
      <ConversationList />
      <NewMessageForm />
    </section>
  );
}

function TicketHeader({ onBack }) {
  return (
    <header className="flex gap-10 justify-center items-center w-full text-zinc-100">
      <h1 className="flex-1 shrink self-stretch my-auto text-[14px] font-medium tracking-normal leading-tight basis-5">
        Ticket Details
      </h1>
      <button
        onClick={onBack}
        className="gap-2.5 self-stretch px-2.5 py-1.5 my-auto text-[10px] text-center bg-red-600 rounded-3xl min-h-[22px] w-[83px]"
      >
        Close Ticket
      </button>
    </header>
  );
}

function TicketDetails() {
  return (
    <div className="mt-2.5 w-full">
      <div className="flex gap-7 items-center w-full whitespace-nowrap">
        <label className="self-stretch my-auto text-xs font-semibold text-neutral-400">
          Priority:
        </label>
        <div className="flex gap-2.5 items-center self-stretch px-2.5 py-2.5 my-auto rounded-md border border-solid bg-neutral-900 border-[#1D1D1F] min-h-9 min-w-60 w-[281px]">
          <span className="flex-1 shrink self-stretch my-auto text-xs basis-5 text-neutral-600">
            Medium
          </span>
          <span className="flex shrink gap-2.5 self-stretch px-2.5 py-1 my-auto text-[8px] text-center bg-blue-600 rounded-md basis-0 min-h-[18px] text-stone-300 w-[43px]">
            Open
          </span>
        </div>
      </div>

      <div className="flex gap-7 items-center mt-2.5 w-full text-xs">
        <label className="self-stretch my-auto font-semibold text-neutral-400">
          Subject:
        </label>
        <div className="gap-2.5 self-stretch px-2.5 py-3.5 my-auto rounded-md border border-solid bg-neutral-900 border-[#1D1D1F] min-h-[38px] min-w-60 text-neutral-600 w-[281px]">
          There is no picture in this very ticket
        </div>
      </div>

      <div className="flex gap-10 items-center mt-2.5 w-full text-xs">
        <label className="self-stretch my-auto font-semibold text-neutral-400">
          Date:
        </label>
        <div className="flex-1 shrink gap-2.5 self-stretch px-2.5 py-3 my-auto rounded-md border border-solid basis-0 bg-neutral-900 border-[#1D1D1F] min-h-9 min-w-60 text-neutral-600 w-[281px]">
          24 Nov, 2024 15:36pm
        </div>
      </div>
    </div>
  );
}

function ConversationList() {
  const messages = [
    {
      id: 1,
      sender: "Benson Showole",
      content: "No picture ticket",
      timestamp: "24 Nov, 2024 15:36pm",
      isSupport: false,
    },
    {
      id: 2,
      sender: "Customer support",
      content: "No picture ticket",
      timestamp: "24 Nov, 2024 15:36pm",
      isSupport: true,
    },
  ];

  return (
    <section className="mt-8">
      <h2 className="text-xs tracking-normal leading-none text-neutral-400">
        Conversations
      </h2>
      <div className="flex flex-col mt-6 max-w-full w-[345px] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-none">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            sender={message.sender}
            content={message.content}
            timestamp={message.timestamp}
            isSupport={message.isSupport}
          />
        ))}
      </div>
    </section>
  );
}

function MessageItem({ sender, content, timestamp, isSupport }) {
  return (
    <div
      className={`p-3 mb-2 rounded-2xl ${
        isSupport
          ? "bg-blue-600 text-stone-300 ml-auto rounded-br-none"
          : "bg-neutral-800 text-zinc-100 mr-auto rounded-bl-none"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold">{sender}</span>
        <span className="text-[8px] opacity-80">{timestamp}</span>
      </div>
      <p className="text-xs mt-1">{content}</p>
    </div>
  );
}

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
          className="gap-2.5 self-stretch px-2.5 py-5 my-auto rounded-3xl bg-[#1D1D1F] min-h-[49px] min-w-60 w-[303px] text-[10px]"
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
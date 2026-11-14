"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ticketsApi, ticketDate, apiMessage, fileUrl } from "../../../api/tickets";
import { useUserAuth } from "../../../context/UserAuthContext";
import { toast } from "../../../lib/toast";

/** Ticket details + live conversation. Same layout as before, now backed by the API. */
export default function Support4({ ticket: initial, onBack, onChange }) {
  const [ticket, setTicket] = useState(initial);
  const [closing, setClosing] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setTicket(await ticketsApi.get(initial._id));
    } catch {
      /* keep what we have */
    }
  }, [initial._id]);

  // Pick up support replies while the ticket is open.
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 15000);
    return () => clearInterval(id);
  }, [refresh]);

  const close = async () => {
    if (!window.confirm("Close this ticket? You can reopen it by sending a new message.")) return;
    setClosing(true);
    try {
      setTicket(await ticketsApi.close(ticket._id));
      toast.success("Ticket closed");
      onChange?.();
    } catch (e) {
      toast.error(apiMessage(e));
    } finally {
      setClosing(false);
    }
  };

  return (
    <section className="overflow-hidden px-5 py-2 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px] md:max-w-[640px] lg:max-w-[820px]">
      <div className="w-full">
        <TicketHeader onBack={onBack} onClose={close} closing={closing} isOpen={ticket.status === "Open"} />
        <TicketDetails ticket={ticket} />
      </div>
      <ConversationList messages={ticket.messages || []} />
      <NewMessageForm
        ticketId={ticket._id}
        onSent={(t) => { setTicket(t); onChange?.(); }}
      />
    </section>
  );
}

function TicketHeader({ onBack, onClose, closing, isOpen }) {
  return (
    <header className="flex gap-10 justify-center items-center w-full text-zinc-100">
      <h1 className="flex-1 shrink self-stretch my-auto text-[14px] font-medium tracking-normal leading-tight basis-5">
        <button type="button" onClick={onBack} className="mr-2 text-neutral-400 hover:text-white" aria-label="Back to tickets">‹</button>
        Ticket Details
      </h1>
      {isOpen ? (
        <button
          type="button"
          onClick={onClose}
          disabled={closing}
          className="gap-2.5 self-stretch px-2.5 py-1.5 my-auto text-[10px] text-center bg-red-600 rounded-3xl min-h-[22px] w-[83px] disabled:opacity-60"
        >
          {closing ? "Closing…" : "Close Ticket"}
        </button>
      ) : (
        <button
          type="button"
          onClick={onBack}
          className="gap-2.5 self-stretch px-2.5 py-1.5 my-auto text-[10px] text-center bg-neutral-800 rounded-3xl min-h-[22px] w-[83px]"
        >
          Back
        </button>
      )}
    </header>
  );
}

function TicketDetails({ ticket }) {
  const isOpen = ticket.status === "Open";
  return (
    <div className="mt-2.5 w-full">
      <div className="flex gap-7 items-center w-full whitespace-nowrap">
        <label className="self-stretch my-auto text-xs font-semibold text-neutral-400">
          Priority:
        </label>
        <div className="flex gap-2.5 items-center self-stretch px-2.5 py-2.5 my-auto rounded-md border border-solid bg-neutral-900 border-[#1D1D1F] min-h-9 min-w-60 w-[281px]">
          <span className="flex-1 shrink self-stretch my-auto text-xs basis-5 text-neutral-600">
            {ticket.priority}
          </span>
          <span className={`flex shrink gap-2.5 self-stretch px-2.5 py-1 my-auto text-[8px] text-center rounded-md basis-0 min-h-[18px] text-stone-300 w-[43px] ${isOpen ? "bg-blue-600" : "bg-red-600"}`}>
            {ticket.status}
          </span>
        </div>
      </div>

      <div className="flex gap-7 items-center mt-2.5 w-full text-xs">
        <label className="self-stretch my-auto font-semibold text-neutral-400">
          Subject:
        </label>
        <div className="gap-2.5 self-stretch px-2.5 py-3.5 my-auto rounded-md border border-solid bg-neutral-900 border-[#1D1D1F] min-h-[38px] min-w-60 text-neutral-600 w-[281px] break-words">
          {ticket.subject}
        </div>
      </div>

      <div className="flex gap-10 items-center mt-2.5 w-full text-xs">
        <label className="self-stretch my-auto font-semibold text-neutral-400">
          Date:
        </label>
        <div className="flex-1 shrink gap-2.5 self-stretch px-2.5 py-3 my-auto rounded-md border border-solid basis-0 bg-neutral-900 border-[#1D1D1F] min-h-9 min-w-60 text-neutral-600 w-[281px]">
          {ticketDate(ticket.createdAt)}
        </div>
      </div>
    </div>
  );
}

function ConversationList({ messages }) {
  const { user } = useUserAuth();
  const me = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "You";
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "nearest" }); }, [messages.length]);

  return (
    <section className="mt-8">
      <h2 className="text-xs tracking-normal leading-none text-neutral-400">
        Conversations
      </h2>
      <div className="flex flex-col mt-6 max-w-full w-[345px] lg:w-full rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-none">
        {messages.map((message, i) => (
          <MessageItem
            key={message._id || i}
            sender={message.sender === "support" ? "Customer support" : me}
            content={message.text}
            attachments={message.attachments || []}
            timestamp={ticketDate(message.timestamp)}
            isSupport={message.sender === "support"}
          />
        ))}
        <div ref={endRef} />
      </div>
    </section>
  );
}

function MessageItem({ sender, content, attachments, timestamp, isSupport }) {
  return (
    <div
      className={`p-3 mb-2 rounded-2xl max-w-[85%] ${
        isSupport
          ? "bg-blue-600 text-stone-300 ml-auto rounded-br-none"
          : "bg-neutral-800 text-zinc-100 mr-auto rounded-bl-none"
      }`}
    >
      <div className="flex justify-between items-center gap-3">
        <span className="text-xs font-semibold">{sender}</span>
        <span className="text-[8px] opacity-80">{timestamp}</span>
      </div>
      <p className="text-xs mt-1 whitespace-pre-wrap break-words">{content}</p>
      {attachments.map((a) => (
        /\.pdf$/i.test(a) ? (
          <a key={a} href={fileUrl(a)} target="_blank" rel="noreferrer" className="block mt-2 text-[10px] underline">Open attachment (PDF)</a>
        ) : (
          <a key={a} href={fileUrl(a)} target="_blank" rel="noreferrer" className="block mt-2">
            <img src={fileUrl(a)} alt="Attachment" className="max-h-40 rounded-lg" loading="lazy" />
          </a>
        )
      ))}
    </div>
  );
}

function NewMessageForm({ ticketId, onSent }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const fileRef = useRef(null);

  const pick = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast.error("File size exceeds 2MB limit"); return; }
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;
    setSending(true);
    try {
      const t = await ticketsApi.reply(ticketId, { text: message.trim(), attachment: file });
      setMessage("");
      setFile(null);
      onSent(t);
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setSending(false);
    }
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
          maxLength={4000}
          onChange={(e) => setMessage(e.target.value)}
          className="gap-2.5 self-stretch px-2.5 py-5 my-auto rounded-3xl bg-[#1D1D1F] min-h-[49px] min-w-60 w-[303px] lg:w-full lg:flex-1 text-[10px] text-zinc-100"
        />
        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={pick} />
        <button type="button" aria-label="Attach file" onClick={() => fileRef.current?.click()}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f19b3e587affa2608c5bc4f99fb0e04c7d07265f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="Attachment"
            className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square"
          />
        </button>
      </div>
      {file && (
        <p className="mt-2 text-[10px] text-neutral-400">
          Attached: {file.name}{" "}
          <button type="button" onClick={() => setFile(null)} className="text-red-400 underline">remove</button>
        </p>
      )}

      <button
        type="submit"
        disabled={sending || (!message.trim() && !file)}
        className="w-full gap-2.5 self-stretch px-2.5 py-2 mt-6 text-xs tracking-normal leading-none text-center whitespace-nowrap bg-blue-600 rounded-3xl min-h-[31px] text-zinc-100 disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}

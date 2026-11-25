"use client";
// One ticket: its details and a chat-style conversation with support. Polls for replies.
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, Paperclip, SendHorizontal, X, Headset } from "lucide-react";
import { ticketsApi, ticketDate, apiMessage, fileUrl } from "../../../api/tickets";
import { useUserAuth } from "../../../context/UserAuthContext";
import { toast } from "../../../lib/toast";
import { Page, Button } from "../../products/ui";

export default function Support4({ ticket: initial, onBack, onChange }) {
  const [ticket, setTicket] = useState(initial);
  const [closing, setClosing] = useState(false);

  const refresh = useCallback(async () => {
    try { setTicket(await ticketsApi.get(initial._id)); } catch { /* keep what we have */ }
  }, [initial._id]);
  useEffect(() => { refresh(); const id = setInterval(refresh, 15000); return () => clearInterval(id); }, [refresh]);

  const close = async () => {
    if (!window.confirm("Close this ticket? You can reopen it by sending a new message.")) return;
    setClosing(true);
    try { setTicket(await ticketsApi.close(ticket._id)); toast.success("Ticket closed"); onChange?.(); } catch (e) { toast.error(apiMessage(e)); } finally { setClosing(false); }
  };
  const isOpen = ticket.status === "Open";

  return (
    <Page title={ticket.subject} subtitle={`Opened ${ticketDate(ticket.createdAt)} · ${ticket.priority} priority`}
      actions={(
        <>
          <Button variant="secondary" onClick={onBack}><ChevronLeft className="w-4 h-4" />Tickets</Button>
          {isOpen && <Button variant="secondary" busy={closing} onClick={close} className="!text-red-400">Close ticket</Button>}
        </>
      )}>
      <div className="max-w-[820px] dash-panel flex flex-col">
        <div className="px-4 py-2.5 border-b border-white/[.06] flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center gap-1.5"><span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400" : "bg-neutral-500"}`} />{isOpen ? "Open · we usually reply within a few hours" : "Closed · send a message to reopen"}</span>
        </div>
        <Conversation messages={ticket.messages || []} />
        <Composer ticketId={ticket._id} onSent={(t) => { setTicket(t); onChange?.(); }} />
      </div>
    </Page>
  );
}

function Conversation({ messages }) {
  const { user } = useUserAuth();
  const me = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "You";
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "nearest" }); }, [messages.length]);
  return (
    <div className="px-4 py-4 space-y-3 max-h-[60vh] min-h-[200px] overflow-y-auto">
      {messages.map((m, i) => {
        const support = m.sender === "support";
        return (
          <div key={m._id || i} className={`flex gap-2 ${support ? "" : "flex-row-reverse"}`}>
            {support && <span className="w-7 h-7 rounded-full bg-blue-600/15 text-blue-400 flex items-center justify-center shrink-0 mt-auto"><Headset className="w-3.5 h-3.5" /></span>}
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${support ? "bg-white/[.06] rounded-bl-md" : "bg-blue-600 text-white rounded-br-md"}`}>
              <p className={`text-[10px] font-semibold ${support ? "text-neutral-400" : "text-white/80"}`}>{support ? "Support" : me}</p>
              {m.text && <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words mt-0.5">{m.text}</p>}
              {(m.attachments || []).map((a) => (/\.pdf$/i.test(a)
                ? <a key={a} href={fileUrl(a)} target="_blank" rel="noreferrer" className="block mt-2 text-[11px] underline">Open attachment (PDF)</a>
                : <a key={a} href={fileUrl(a)} target="_blank" rel="noreferrer" className="block mt-2"><img src={fileUrl(a)} alt="Attachment" className="max-h-40 rounded-xl" loading="lazy" /></a>))}
              <p className={`text-[10px] mt-1 ${support ? "text-neutral-500" : "text-white/70"}`}>{ticketDate(m.timestamp)}</p>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}

function Composer({ ticketId, onSent }) {
  const [text, setText] = useState("");
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
  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    setSending(true);
    try { const t = await ticketsApi.reply(ticketId, { text: text.trim(), attachment: file }); setText(""); setFile(null); onSent(t); } catch (err) { toast.error(apiMessage(err)); } finally { setSending(false); }
  };
  return (
    <form onSubmit={send} className="border-t border-white/[.06] p-3">
      {file && (
        <div className="mb-2 flex items-center gap-2 text-[11px] text-neutral-400">
          <Paperclip className="w-3.5 h-3.5" /><span className="truncate">{file.name}</span>
          <button type="button" data-no-busy onClick={() => setFile(null)} className="w-5 h-5 rounded-full bg-white/[.06] flex items-center justify-center" aria-label="Remove attachment"><X className="w-3 h-3" /></button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={pick} />
        <button type="button" data-no-busy onClick={() => fileRef.current?.click()} className="w-11 h-11 rounded-full bg-white/[.06] border border-white/10 text-neutral-300 hover:text-zinc-100 flex items-center justify-center shrink-0" aria-label="Attach file"><Paperclip className="w-4 h-4" /></button>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={1} maxLength={4000} placeholder="Write a message"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(e); } }}
          className="flex-1 min-h-11 max-h-32 rounded-[22px] bg-white/[.04] border border-white/10 px-4 py-3 text-[13px] text-zinc-100 placeholder:text-neutral-500 resize-none focus:outline-none focus:border-blue-500/60 transition" />
        <button type="submit" disabled={sending || (!text.trim() && !file)} className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 hover:bg-blue-500 disabled:opacity-40 transition" aria-label="Send">
          <SendHorizontal className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

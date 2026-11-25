"use client";
// /support — your tickets, a new-ticket form and each ticket's conversation.
import React, { useCallback, useEffect, useState } from "react";
import { LifeBuoy, ChevronRight, MessageSquare } from "lucide-react";
import { ticketsApi, ticketDate, apiMessage } from "../../api/tickets";
import { Page, Tabs, Loading, ErrorState, Empty, Button } from "../products/ui";
import NewTicketForm from "./OpenSupport";
import TicketThread from "./ticketdetails/Support4";

const PRIORITY = { High: "text-red-400 bg-red-500/12", Medium: "text-amber-400 bg-amber-500/12", Low: "text-neutral-300 bg-white/[.06]" };
export const StatusPill = ({ status }) => (
  <span className={`inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-semibold ${status === "Open" ? "text-emerald-400 bg-emerald-500/12" : "text-neutral-400 bg-white/[.06]"}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === "Open" ? "bg-emerald-400" : "bg-neutral-500"}`} />{status}
  </span>
);

const Support = () => {
  const [tab, setTab] = useState("tickets");
  const [selected, setSelected] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try { setTickets(await ticketsApi.list()); } catch (e) { setError(apiMessage(e)); setTickets([]); }
  }, []);
  useEffect(() => { load(); }, [load]);

  if (selected) return <TicketThread ticket={selected} onBack={() => { setSelected(null); load(); }} onChange={load} />;

  const open = (tickets || []).filter((t) => t.status === "Open").length;
  return (
    <Page title="Support" subtitle="Ask us anything; we reply right here" icon={LifeBuoy}>
      <div className="max-w-[820px]">
        <Tabs tabs={[{ value: "tickets", label: `My tickets${tickets?.length ? ` (${tickets.length})` : ""}` }, { value: "new", label: "New ticket" }]} value={tab} onChange={setTab} />
        {tab === "new" ? (
          <NewTicketForm embedded onCreated={() => { setTab("tickets"); load(); }} />
        ) : error ? <ErrorState message={error} onRetry={load} />
          : !tickets ? <Loading rows={3} />
            : !tickets.length ? (
              <div className="dash-panel">
                <Empty icon={MessageSquare} title="No tickets yet" text="Need help with a deposit, a trade or your account? Open a ticket and our team will reply here."
                  action={<Button onClick={() => setTab("new")}>Open a ticket</Button>} />
              </div>
            ) : (
              <section className="dash-panel px-4 pt-3 pb-1">
                <p className="text-[11px] text-neutral-500 pb-1">{open} open · {tickets.length - open} closed</p>
                <ul className="divide-y divide-white/[.06]">
                  {tickets.map((t) => (
                    <li key={t._id}>
                      <button type="button" data-no-busy onClick={() => setSelected(t)} className="dash-row w-full flex items-center gap-3 py-3 text-left">
                        <span className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 shrink-0"><MessageSquare className="w-4 h-4" /></span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13px] font-medium text-zinc-100 truncate">{t.subject}</span>
                          <span className="block text-[11px] text-neutral-500 truncate">{ticketDate(t.lastMessageAt || t.createdAt)} · {(t.messages || []).length} message{(t.messages || []).length === 1 ? "" : "s"}</span>
                        </span>
                        <span className="flex flex-col items-end gap-1 shrink-0">
                          <StatusPill status={t.status} />
                          <span className={`text-[10px] font-semibold px-1.5 rounded-full ${PRIORITY[t.priority] || PRIORITY.Low}`}>{t.priority}</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
      </div>
    </Page>
  );
};

export default Support;

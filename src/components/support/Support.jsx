"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ticketsApi, ticketDate, apiMessage } from "../../api/tickets";
import TabNavigation from "./TabNavigation";
import SupportTicket from "./SupportTicket";
import Support3 from "./OpenSupport";
import Support4 from "./ticketdetails/Support4";

const TICKET_ICON =
  "https://cdn.builder.io/api/v1/image/assets/TEMP/6807db796da88a7fcd61413ad607f57610d8e9e076b13ed3cb4133b89dc44348?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8";

const Support1 = () => {
  const [activeTab, setActiveTab] = useState("submissions");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [rawTickets, setRawTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = [
    { id: "submissions", label: "Ticket Submissions" },
    { id: "newTicket", label: "Open New Ticket" },
  ];

  const load = useCallback(async () => {
    setError("");
    try {
      setRawTickets(await ticketsApi.list());
    } catch (e) {
      setError(apiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const tickets = rawTickets.map((t) => ({
    id: t._id,
    title: t.subject,
    timestamp: ticketDate(t.lastMessageAt || t.createdAt),
    priority: t.priority,
    status: t.status,
    iconUrl: TICKET_ICON,
    raw: t,
  }));

  return (
    <section className="overflow-hidden px-5 pt-6 pb-9 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px] md:max-w-[640px] lg:max-w-[1100px] lg:px-8">
      <header>
        <TabNavigation
          activeTab={activeTab}
          tabs={tabs}
          onTabChange={(tab) => {
            setSelectedTicket(null); // Reset selected ticket on tab change
            setActiveTab(tab);
          }}
        />
      </header>

      <main className="mt-5">
        {selectedTicket ? (
          <Support4 ticket={selectedTicket.raw} onBack={() => { setSelectedTicket(null); load(); }} onChange={load} />
        ) : activeTab === "submissions" ? (
          <>
            <h2 className="text-sm font-medium tracking-normal leading-tight text-zinc-100">
              Support Tickets
            </h2>

            {loading ? (
              <p className="mt-5 text-xs text-neutral-400">Loading tickets…</p>
            ) : error ? (
              <p className="mt-5 text-xs text-red-400">{error} <button type="button" onClick={load} className="underline">Retry</button></p>
            ) : !tickets.length ? (
              <div className="mt-5 px-3 py-8 rounded-xl bg-[var(--card)] text-center">
                <p className="text-[14px] text-zinc-100">No tickets yet</p>
                <p className="mt-1 text-[10px] text-neutral-400">Need help? Open a new ticket and our team will reply here.</p>
              </div>
            ) : null}
            <div className="mt-5 pb-20 w-full space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4 lg:pb-8">
              {tickets.map((ticket) => (
                <div key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
                  <SupportTicket
                    title={ticket.title}
                    timestamp={ticket.timestamp}
                    priority={ticket.priority}
                    status={ticket.status}
                    iconUrl={ticket.iconUrl}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <Support3 onCreated={() => { setActiveTab("submissions"); load(); }} />
        )}
      </main>
    </section>
  );
};

export default Support1;

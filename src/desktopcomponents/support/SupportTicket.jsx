"use client";
import React, { useState } from "react";
import StatCard from "./StatCard";
import SignalStrengthBar from "../trade/SignalStrengthBar";
import TicketCard from "./TicketCard";
import Button from "./Button";
import StatisticsCards from "../home/StatisticsCards";
import ConversationSection from "../support/supportscreen/ConversationSection";

function SupportTicket() {
  const [activeView, setActiveView] = useState("list");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicketData, setSelectedTicketData] = useState(null);

  const handleTicketSelect = (title, priority, status, date) => {
    const id = title.replace(/\s+/g, '-').toLowerCase();
    setSelectedTicketId(id);
    setSelectedTicketData({
      title,
      priority,
      status,
      createdAt: date,
      lastUpdated: "02 Apr, 2025 09:42am"
    });
    setActiveView("details");
  };

  const handleBackToList = () => {
    setActiveView("list");
  };

  const renderTicketsList = () => (
    <section className="flex flex-col pt-2 pl-2 pr-3 pb-14 bg-neutral-900 min-h-screen max-md:px-8 max-md:py-16 max-sm:px-5 max-sm:py-8">
      <h1 className="text-3xl font-medium text-zinc-100">Support Tickets</h1>
      <div className="mt-2">
        <StatisticsCards />
      </div>
      <div className="mt-2">
        <SignalStrengthBar />
      </div>

      <section className="flex flex-col px-5 py-6 mt-5 rounded-xl bg-[var(--card)] max-w-[1128px] w-full mx-auto">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <h2 className="text-sm font-medium text-neutral-400">Support Tickets</h2>
          <Button variant="primary">Open New Ticket</Button>
        </div>

        <div className="flex flex-wrap gap-3 justify-start mt-8">
          {[
            {
              title: "There is no picture in this very ticket",
              priority: "Medium",
              status: "Open",
              date: "24 Nov, 2024 15:36pm",
              icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e9b884ede4b6dcbd6bce3423f3a7ba9acb8509313c9db7a49890bc2b13546404"
            },
            {
              title: "I love this website",
              priority: "High",
              status: "Open",
              date: "24 Nov, 2024 15:36pm",
              icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fb9253c94e6b0a5bff449284131f8265dd11e12946421b702c1e53a9f49db5de"
            },
            {
              title: "Terminal Needed",
              priority: "High",
              status: "Closed",
              date: "24 Nov, 2024 15:36pm",
              icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fa0d5c9128f09be9f134f4d86c42c9eb6bb123c03efd755c3dcc7209fee1a986"
            }
          ].map((ticket) => (
            <div
              key={ticket.title}
              onClick={() =>
                handleTicketSelect(ticket.title, ticket.priority, ticket.status, ticket.date)
              }
              className="cursor-pointer"
            >
              <TicketCard
                title={ticket.title}
                date={ticket.date}
                priority={ticket.priority}
                status={ticket.status}
                iconSrc={ticket.icon}
              />
            </div>
          ))}
        </div>
      </section>
    </section>
  );

  const renderTicketDetails = () => (
    <section className="flex flex-col pt-2 pl-2 pr-3 pb-14 bg-neutral-900 min-h-screen max-md:px-8 max-md:py-16 max-sm:px-5 max-sm:py-8">
      <h1 className="text-3xl mb-2 font-medium text-zinc-100">Support Tickets</h1>
      <StatisticsCards />

      <div className="mt-4 w-full max-w-[1128px] mx-auto">
        <SignalStrengthBar />
      </div>

      <div className="flex justify-between items-center mt-6 bg-[var(--card)] rounded-xl p-6 text-[var(--fg)] w-full max-w-[1128px] mx-auto">
        <h2 className="text-sm font-semibold">Support Tickets</h2>
        <button
          className="bg-[#EB252F] text-[12px] text-white px-4 py-2 rounded-full hover:bg-red-700"
          onClick={handleBackToList}
        >
          Close Ticket
        </button>
      </div>

      <div className="bg-[var(--card)] rounded-xl px-4 py-4 mt-4 max-w-[1128px] mx-auto w-full">
        <div className="p-6 flex flex-col text-[var(--fg)] bg-[var(--card-2)] rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm">Priority:</p>
            <div className="text-xs rounded px-2 py-0.5 bg-[var(--color-blue-600)] text-white">
              {selectedTicketData?.status}
            </div>
          </div>

          <p className="text-xs text-[var(--fg-2)] mb-4">{selectedTicketData?.priority}</p>

          <p className="text-sm mt-2">Subject:</p>
          <p className="text-xs text-[var(--fg-2)]">{selectedTicketData?.title}</p>

          <p className="text-sm mt-4">Date:</p>
          <p className="text-xs text-[var(--fg-2)]">{selectedTicketData?.createdAt}</p>
        </div>
      </div>

      <div className="mt-6 max-w-[1128px] mx-auto w-full">
        <ConversationSection />
      </div>
    </section>
  );

  return activeView === "list" ? renderTicketsList() : renderTicketDetails();
}

export default SupportTicket;

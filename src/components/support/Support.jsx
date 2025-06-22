"use client";

import React, { useState } from "react";
import TabNavigation from "./TabNavigation";
import SupportTicket from "./SupportTicket";
import Support3 from "./OpenSupport";
import Support4 from "./ticketdetails/Support4";

const Support1 = () => {
  const [activeTab, setActiveTab] = useState("submissions");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tabs = [
    { id: "submissions", label: "Ticket Submissions" },
    { id: "newTicket", label: "Open New Ticket" },
  ];

  const tickets = [
    {
      id: 1,
      title: "There is no picture in this very ticket",
      timestamp: "24 Nov, 2024 15:36pm",
      priority: "Medium",
      status: "Open",
      iconUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/6807db796da88a7fcd61413ad607f57610d8e9e076b13ed3cb4133b89dc44348?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
    },
    {
      id: 2,
      title: "I love this website",
      timestamp: "24 Nov, 2024 15:36pm",
      priority: "High",
      status: "Open",
      iconUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/4a6f1cfd954429461f1c71c8dd74afa7cab693186ca8debfc9b5ae50ded42bb8?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
    },
    {
      id: 3,
      title: "Terminal Needed",
      timestamp: "24 Nov, 2024 15:36pm",
      priority: "High",
      status: "Closed",
      iconUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/61d1c3f6fc739eb421b186bcb63e6fac6318c977297799f81bed65bbe84f5133?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8",
    },
  ];

  return (
    <section className="overflow-hidden px-5 pt-6 pb-9 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
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
          <Support4 ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />
        ) : activeTab === "submissions" ? (
          <>
            <h2 className="text-sm font-medium tracking-normal leading-tight text-zinc-100">
              Support Tickets
            </h2>

            <div className="mt-5 pb-20 w-full space-y-6">
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
          <Support3 />
        )}
      </main>
    </section>
  );
};

export default Support1;

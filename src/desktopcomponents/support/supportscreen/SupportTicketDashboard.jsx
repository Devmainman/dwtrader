"use client";
import React from "react";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import ConversationSection from "./ConversationSection";

const SupportTicketDetails = ({ ticketId }) => {
  const ticketData = {
    id: ticketId || "TKT-2025042",
    title: "There is no picture in this very ticket",
    status: "Open",
    priority: "Medium",
    createdAt: "24 Nov, 2024 15:36pm",
    lastUpdated: "02 Apr, 2025 09:42am"
  };

  return (
    <section className="flex flex-col gap-6 px-5 py-20 md:px-10 lg:px-20 bg-neutral-900 min-h-screen w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-3xl font-semibold text-zinc-100">Support Ticket</h1>
        <Button variant="danger">Close Ticket</Button>
      </div>

      {/* Ticket Meta Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Priority */}
        <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          <span className="text-xs text-neutral-400">Priority</span>
          <p className="text-sm text-fuchsia-600">{ticketData.priority}</p>
        </div>

        {/* Status */}
        <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          <span className="text-xs text-neutral-400">Status</span>
          <p className={`text-sm ${ticketData.status === "Open" ? "text-blue-500" : "text-red-500"}`}>
            {ticketData.status}
          </p>
        </div>

        {/* Created */}
        <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          <span className="text-xs text-neutral-400">Created</span>
          <p className="text-sm text-zinc-100">{ticketData.createdAt}</p>
        </div>

        {/* Last Updated */}
        <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          <span className="text-xs text-neutral-400">Last Updated</span>
          <p className="text-sm text-zinc-100">{ticketData.lastUpdated}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar label="Signal Strength" percentage={60} />

      {/* Ticket Title Section */}
      <div className="px-5 py-6 mt-2 rounded-xl bg-zinc-900 border border-neutral-700 w-full">
        <h2 className="text-sm font-medium text-zinc-100">{ticketData.title}</h2>
      </div>

      {/* Conversation Section */}
      <ConversationSection />
    </section>
  );
};

export default SupportTicketDetails;

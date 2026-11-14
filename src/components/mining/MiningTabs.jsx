"use client";
import React from "react";
import { BarChart3, Settings, Rocket, Coins, ScrollText, Waves } from "lucide-react";

function MiningTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "equipment", label: "Equipment", icon: Settings },
    { id: "boosters", label: "Boosters", icon: Rocket },
    { id: "rewards", label: "Rewards", icon: Coins },
    { id: "history", label: "History", icon: ScrollText },
    { id: "pools", label: "Pools", icon: Waves }
  ];

  return (
    <div className="flex overflow-x-auto gap-1.5 items-center w-full mt-5 text-[10px] text-stone-300 whitespace-nowrap scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-3xl border border-solid transition-colors min-w-fit ${
            activeTab === tab.id 
              ? "border-blue-700/80 bg-blue-700/10 text-zinc-100" 
              : "border-neutral-900 bg-neutral-800 text-stone-300 hover:text-zinc-100 hover:bg-neutral-700"
          }`}
        >
          <span><tab.icon className="w-3.5 h-3.5" /></span>
          <span className="font-semibold">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export default MiningTabs;
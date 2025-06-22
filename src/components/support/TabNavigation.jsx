"use client";

import React from "react";

/**
 * TabNavigation component for switching between different views
 * @param {Object} props - Component props
 * @param {string} props.activeTab - Currently active tab
 * @param {Array} props.tabs - Array of tab objects with id and label
 * @param {Function} props.onTabChange - Function to call when tab is changed
 */
const TabNavigation = ({ activeTab, tabs, onTabChange }) => {
  return (
    <nav className="flex justify-center px-1 items-center w-full text-[12px] px-1 tracking-normal leading-none text-center bg-[#1D1D1F] min-h-[54px] rounded-[30px] text-zinc-100">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 shrink gap-2.5 self-stretch px-5 py-2.5 my-auto rounded-3xl basis-0 w-[170px] ${
            activeTab === tab.id ? "bg-blue-600" : "bg-neutral-800"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default TabNavigation;

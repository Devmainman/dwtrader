"use client";
import React from "react";
import SearchBar from "./SearchBar";
import StatsSection from "./StatsSection";
import NotificationList from "./NotificationList";
import StatisticsCards from "../home/StatisticsCards";

function Notification() {
  return (
    <main className="flex flex-col pt-3 pl-2 pr-3 pb-14 bg-neutral-900 min-h-screen max-md:px-8 max-md:py-16 max-sm:px-5 max-sm:py-8">
      <header className="flex flex mb-3 gap-6 items-center max-md:max-w-auto">
        <h1 className="self-stretch my-auto text-3xl font-medium tracking-normal leading-tight text-zinc-100">
          Notification
        </h1>
        <SearchBar
          iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/16a762dc4e54facae15cdcaf16e3cf4c2ceb22854bd6d9c1b71dfffd282a7387?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          placeholder="Search here"
        />
        
      </header>
    <StatisticsCards />
      

      <NotificationList />
    </main>
  );
}

export default Notification;

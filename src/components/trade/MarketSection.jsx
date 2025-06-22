"use client";
import React, { useState } from "react";
import MarketTabs from "./MarketTabs";
import CryptoList from "./CryptoList";

function MarketSection() {
  const [activeTab, setActiveTab] = useState("Hot Picks");

  return (
    <section className="mt- w-full max-w-[390px]">
      <MarketTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <CryptoList />
    </section>
  );
}

export default MarketSection;

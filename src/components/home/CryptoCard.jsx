"use client";
import React from "react";

function CryptoCard({ symbol, change, price, isPositive }) {
  return (
    <div className="flex flex-col justify-center px-3 py-2.5 rounded-2xl bg-white/[.04] border border-white/[.06] w-full min-w-0">
      <div className="flex gap-1.5 items-center whitespace-nowrap">
        <h3 className="text-[12px] font-semibold text-zinc-100">{symbol}</h3>
        <span className={`text-[10px] font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>{change}</span>
      </div>
      <p className="mt-0.5 text-[11px] text-neutral-500 tabular-nums">{price}</p>
    </div>
  );
}

export default CryptoCard;

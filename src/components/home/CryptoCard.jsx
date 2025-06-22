"use client";
import React from "react";

function CryptoCard({ symbol, change, price, isPositive }) {
  return (
    <div className="flex overflow-hidden flex-col justify-center self-stretch px-2.5 py-2 my-auto rounded-md bg-neutral-800 w-full">
      <div className="flex flex-col w-full">
        <div className="flex gap-1.5 items-center self-start whitespace-nowrap">
          <h3 className="self-stretch my-auto text-[14px] tracking-normal text-zinc-100">
            {symbol}
          </h3>
          <span
            className={`self-stretch my-auto text-[8px] ${
              isPositive ? "text-green-700" : "text-red-600"
            }`}
          >
            {change}
          </span>
        </div>
        <p className="mt-1 text-[8px] text-neutral-600">{price}</p>
      </div>
    </div>
  );
}

export default CryptoCard;

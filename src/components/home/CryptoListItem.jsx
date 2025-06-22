"use client";
import React from "react";

function CryptoListItem({
  name,
  volume,
  price,
  change,
  isPositive,
  image,
  marginTop,
}) {
  return (
    <div
      className={`flex overflow-hidden justify-between py-2 w-full ${marginTop} gap-4`}
    >
      {/* Left: Icon and Name */}
      <div className="flex gap-2 items-center">
        <img
          src={image}
          alt={`${name} icon`}
          className="object-contain rounded-full w-[42px] h-[42px] shrink-0"
        />
        <div>
          <h3 className="text-[10px] sm:text-[12px] md:text-[14px] font-semibold text-zinc-100 leading-tight">
            {name}
          </h3>
          <p className="text-[8px] sm:text-[9px] md:text-[10px] text-neutral-400">
            {volume}
          </p>
        </div>
      </div>

      {/* Right: Price and Change */}
      <div className="flex items-center gap-4 sm:gap-6 text-zinc-100">
        <p className="text-[10px] sm:text-[12px] md:text-[14px] font-medium leading-tight">
          {price}
        </p>
        <div
          className={`px-2 sm:px-3 py-1 text-[8px] sm:text-[10px] md:text-[12px] font-medium rounded-3xl min-h-[20px] sm:min-h-[23px] ${
            isPositive ? "bg-green-700 text-white" : "bg-red-600 text-white"
          }`}
        >
          {change}
        </div>
      </div>
    </div>
  );
}

export default CryptoListItem;

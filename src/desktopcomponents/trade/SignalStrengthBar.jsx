"use client";
import React from "react";

function SignalStrengthBar({ percentage }) {
  return (
    <div className="flex flex-col gap-2 mt-5 w-[1070px]">
      <div className="flex justify-between items-center">
        <span className="text-xs leading-4 text-stone-300">
          Signal Strength
        </span>
        <span className="text-xs leading-4 text-stone-300">{percentage}%</span>
      </div>
      <div className="relative w-full bg-zinc-100 h-[7px]">
        <div
          className="h-full bg-blue-600 rounded-none"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default SignalStrengthBar;

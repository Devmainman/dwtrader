"use client";
import React from "react";

function ActionButtons() {
  return (
    <section className="flex flex-col gap-5 mt-8">
      <button className="w-full text-xs bg-blue-600 rounded-3xl cursor-pointer h-[42px] text-zinc-100 flex items-center justify-center">
        Upload
      </button>
      <div className="flex gap-3.5 max-sm:flex-col max-sm:gap-2.5">
        <button className="text-xs rounded-3xl border border-blue-600 border-solid cursor-pointer bg-zinc-900 h-[42px] text-zinc-100 w-[156px] max-sm:w-full flex items-center justify-center">
          Retake
        </button>
        <button className="text-xs bg-red-600 rounded-3xl cursor-pointer h-[42px] text-zinc-100 w-[156px] max-sm:w-full flex items-center justify-center">
          Cancel
        </button>
      </div>
    </section>
  );
}

export default ActionButtons;

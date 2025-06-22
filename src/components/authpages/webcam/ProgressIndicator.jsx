"use client";
import React from "react";

function ProgressIndicator() {
  return (
    <section className="flex flex-col gap-4 items-end p-5 mt-12">
      <p className="text-sm font-medium text-stone-300">Step 4/4</p>
      <div className="flex gap-4 items-start">
        <div className="h-0.5 rounded-3xl bg-neutral-600 w-[75.5px] max-sm:w-[60px]" />
        <div className="h-0.5 rounded-3xl bg-neutral-600 w-[75.5px] max-sm:w-[60px]" />
        <div className="h-0.5 rounded-3xl bg-neutral-600 w-[75.5px] max-sm:w-[60px]" />
        <div className="h-0.5 rounded-3xl bg-neutral-600 w-[75.5px] max-sm:w-[60px]" />
      </div>
    </section>
  );
}

export default ProgressIndicator;

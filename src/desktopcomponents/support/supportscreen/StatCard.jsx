"use client";
import React from "react";

const StatCard = ({ icon, title, amount, currency, percentage, growth }) => {
  return (
    <article className="flex-1 px-5 pt-4 pb-5 rounded-xl bg-zinc-900 border-[0.5px] border-neutral-600 min-w-[300px]">
      <header className="flex gap-3 items-center mb-10">
        <div className="flex justify-center items-center border border-fuchsia-600 bg-neutral-800 h-[50px] rounded-[40px] w-[50px]">
          <div dangerouslySetInnerHTML={{ __html: icon }} />
        </div>
        <h3 className="text-base tracking-normal leading-5 text-stone-300">
          {title}
        </h3>
      </header>
      <footer className="flex justify-between items-end">
        <div className="flex gap-1 items-end">
          <p className="text-3xl tracking-normal leading-8 text-zinc-100">
            {amount}
          </p>
          <span className="text-base tracking-normal leading-5 text-stone-300">
            {currency}
          </span>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <div className="px-2.5 text-xs tracking-normal leading-4 text-center rounded-3xl bg-neutral-800 h-[31px] text-zinc-100 flex items-center justify-center">
            {percentage}
          </div>
          <p className="text-xs font-bold text-center text-green-700">
            {growth}
          </p>
        </div>
      </footer>
    </article>
  );
};

export default StatCard;

import React from "react";

const CommissionEntry = ({ name, amount, date }) => {
  return (
    <article className="flex flex-col justify-center px-2.5 py-4 mt-4 w-full rounded-xl bg-neutral-800 min-h-[72px] max-md:max-w-full">
      <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
        <div className="flex gap-2 items-center self-stretch my-auto text-xs tracking-normal leading-none text-zinc-100">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f092ff1783b21cf6eea9ed0fafca8e891a8e0967c4f5fe1b513497d2012cd0bf?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[42px]"
            alt="User avatar"
          />
          <span className="gap-1.5 self-stretch my-auto">{name}</span>
        </div>
        <div className="self-stretch my-auto">
          <p className="text-xs tracking-normal leading-none text-neutral-400">
            Commission
          </p>
          <p className="text-sm font-medium tracking-normal leading-tight text-zinc-100">
            {amount}
          </p>
        </div>
        <div className="self-stretch my-auto w-[108px]">
          <p className="text-xs font-semibold tracking-normal leading-none text-neutral-400">
            Date
          </p>
          <time className="text-xs text-zinc-100">{date}</time>
        </div>
      </div>
    </article>
  );
};

export default CommissionEntry;

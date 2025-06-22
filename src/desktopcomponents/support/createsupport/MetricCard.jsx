import React from "react";

function MetricCard({
  icon,
  title,
  value,
  currency,
  growthPercentage,
  iconClassName = "",
}) {
  return (
    <article className="flex overflow-hidden grow shrink gap-10 items-start self-stretch px-5 py-5 my-auto rounded-xl border border-solid bg-zinc-900 border-neutral-600 min-w-60 w-[296px] max-md:pr-5">
      <div className="flex flex-col self-start font-medium leading-tight">
        <div className="flex gap-3 items-center self-start text-base tracking-normal text-stone-300">
          <img
            src={icon}
            className={`object-contain shrink-0 self-stretch my-auto aspect-square w-[50px] ${iconClassName}`}
            alt={`${title} icon`}
          />
          <span className="self-stretch my-auto">{title}</span>
        </div>
        <div className="flex justify-center items-end mt-10 whitespace-nowrap">
          <span className="text-3xl tracking-normal text-zinc-100">
            {value}
          </span>
          <span className="text-base tracking-normal text-stone-300">
            {currency}
          </span>
        </div>
      </div>
      <div className="self-end mt-20 text-center whitespace-nowrap max-md:mt-10">
        <div className="flex-1 shrink gap-2.5 p-2.5 w-full text-xs tracking-normal leading-none rounded-3xl basis-0 bg-neutral-800 min-h-[31px] text-zinc-100">
          {growthPercentage}
        </div>
        <div className="mt-3 text-xs font-bold text-green-700">Growth</div>
      </div>
    </article>
  );
}

export default MetricCard;

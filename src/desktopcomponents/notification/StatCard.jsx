import React from "react";

const StatCard = ({
  iconSrc,
  title,
  amount,
  currency,
  percentage,
  containerClassName = "",
}) => {
  return (
    <article
      className={`flex overflow-hidden grow shrink justify-center self-stretch px-5 py-5 rounded-xl border border-solid bg-zinc-900 border-neutral-600 min-w-60 ${containerClassName}`}
    >
      <div className="flex flex-col w-full">
        <header className="flex gap-3 items-center self-start text-base font-medium tracking-normal leading-tight text-stone-300">
          <img
            src={iconSrc}
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[50px]"
            alt={`${title} icon`}
          />
          <h2 className="self-stretch my-auto">{title}</h2>
        </header>

        <div className="flex gap-10 justify-between items-center mt-8 w-full whitespace-nowrap">
          <div className="flex justify-center items-end self-stretch my-auto font-medium leading-tight">
            <p className="text-3xl tracking-normal text-zinc-100">{amount}</p>
            <p className="text-base tracking-normal text-stone-300">
              {currency}
            </p>
          </div>

          <div className="self-stretch my-auto text-center w-[86px]">
            <div className="flex-1 shrink gap-2.5 p-2.5 w-full text-xs tracking-normal leading-none rounded-3xl basis-0 bg-neutral-800 min-h-[31px] text-zinc-100">
              {percentage}
            </div>
            <p className="mt-3 text-xs font-bold text-green-700">Growth</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default StatCard;

"use client";
import React from "react";

function EarnProductCard({ product }) {
  return (
    <div className="flex overflow-hidden flex-col items-start self-stretch py-3 pr-9 pl-4 my-auto rounded-xl bg-[#1D1D1F] w-full lg:bg-black/40 lg:border lg:border-white/5">
      <div className="flex gap-2 items-center">
        <img
          src={product.image}
          className="object-contain shrink-0 self-stretch my-auto rounded-none aspect-[1.06] w-[33px]"
          alt={`${product.symbol} icon`}
        />
        <div className="self-stretch my-auto w-[55px]">
          <h3 className="text-[12px] font-semibold tracking-normal text-zinc-100">
            {product.symbol}
          </h3>
          <p className="mt-1 text-[8px] tracking-normal text-stone-300">
            {product.name}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center mt-4">
        <div className="flex gap-px items-center self-start whitespace-nowrap">
          <span className="self-stretch my-auto text-[12px] font-semibold text-zinc-100">
            {product.apy}
          </span>
          <span className="self-stretch my-auto text-[8px] font-medium text-neutral-400">
            APY
          </span>
        </div>
        {Array.isArray(product.stakingType) ? (
          <div className="flex gap-1.5 items-start mt-1.5 text-[7px] font-medium text-neutral-400">
            {product.stakingType.map((type, index) => (
              <div
                key={index}
                className={`${
                  index === 1 ? "flex-1 shrink basis-0 w-[68px]" : ""
                } gap-2.5 self-stretch px-1.5 py-1.5 whitespace-nowrap rounded-xl bg-neutral-800 min-h-5`}
              >
                {type}
              </div>
            ))}
          </div>
        ) : (
          <div className="gap-2.5 self-stretch px-1.5 py-1.5 mt-1.5 w-full text-[7px] font-medium rounded-xl bg-neutral-800 min-h-5 text-neutral-400">
            {product.stakingType}
          </div>
        )}
      </div>
    </div>
  );
}

export default EarnProductCard;

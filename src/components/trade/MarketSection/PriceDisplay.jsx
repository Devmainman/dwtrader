"use client";
import React from "react";

function PriceDisplay({ selectedPair, priceFeed, userCurrency, conversionRate, formatPrice, formatCurrency }) {
  const getCurrentPrice = () => {
    const price = priceFeed[selectedPair];
    if (!price) return `- ${userCurrency}`;
    const convertedPrice = parseFloat(price) * conversionRate;
    return formatCurrency(convertedPrice, userCurrency);
  };

  return (
    <div className="overflow-hidden px-2.5 py-3 mt-5 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-[10px] text-stone-300">Current Price ({selectedPair})</div>
          <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100 mt-1">
            {getCurrentPrice()}
          </div>
          <div className="text-[10px] text-stone-300 mt-0.5">
            {priceFeed[selectedPair] && `$${formatPrice(priceFeed[selectedPair])} USD`}
          </div>
        </div>
        {priceFeed[`${selectedPair}_change`] && (
          <div className={`flex gap-0.5 items-center ${parseFloat(priceFeed[`${selectedPair}_change`]) >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            <img
              src={parseFloat(priceFeed[`${selectedPair}_change`]) >= 0 
                ? "https://cdn.builder.io/api/v1/image/assets/TEMP/8618c649fa66b3ae7a6da6429776b793c56523f7c9f2ae8a586af42b5f9346cf?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                : "https://cdn.builder.io/api/v1/image/assets/TEMP/...down-arrow..."}
              className="w-3.5 h-3.5"
              alt="Trend"
            />
            <span className="text-[10px] font-semibold">
              {Math.abs(parseFloat(priceFeed[`${selectedPair}_change`])).toFixed(2)}%
            </span>
          </div>
        )}
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5 text-[10px]">
        <div className="flex gap-0.5 items-center">
          <span className="text-stone-300">24h High:</span>
          <span className="text-green-700 font-semibold">
            {priceFeed[`${selectedPair}_high`] ? `$${formatPrice(priceFeed[`${selectedPair}_high`])}` : "-"}
          </span>
        </div>
        <div className="flex gap-0.5 items-center">
          <span className="text-stone-300">24h Low:</span>
          <span className="text-red-600 font-semibold">
            {priceFeed[`${selectedPair}_low`] ? `$${formatPrice(priceFeed[`${selectedPair}_low`])}` : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PriceDisplay;
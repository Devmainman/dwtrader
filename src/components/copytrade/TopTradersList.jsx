"use client";
import React, { useState } from "react";

function TopTradersList({ traders, onSelectTrader, onShowStats }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTrader = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.min(3, traders.length));
  };

  const prevTrader = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.min(3, traders.length)) % Math.min(3, traders.length));
  };

  const displayTraders = traders.slice(currentIndex, currentIndex + 3);

  return (
    <div className="w-full mt-5">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-[12px] tracking-normal leading-none text-stone-300">
          🔥 TOP PERFORMERS THIS WEEK
        </h3>
        <div className="flex gap-1">
          <button
            onClick={prevTrader}
            className="p-1 bg-neutral-700 hover:bg-neutral-600 rounded-full text-stone-300 hover:text-zinc-100"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/...left-arrow..."
              className="w-3.5 h-3.5"
              alt="Previous"
            />
          </button>
          <button
            onClick={nextTrader}
            className="p-1 bg-neutral-700 hover:bg-neutral-600 rounded-full text-stone-300 hover:text-zinc-100"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/...right-arrow..."
              className="w-3.5 h-3.5"
              alt="Next"
            />
          </button>
        </div>
      </div>

      <div className="mt-1.5 space-y-1.5">
        {displayTraders.map((trader, index) => (
          <div key={trader.id} className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-900 min-h-[90px]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={trader.avatar}
                    alt={trader.username}
                    className="object-contain shrink-0 self-stretch my-auto w-11 aspect-square rounded-full border-2 border-blue-700"
                  />
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 bg-yellow-700 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                      🥇
                    </div>
                  )}
                  {index === 1 && (
                    <div className="absolute -top-1 -right-1 bg-stone-300 text-neutral-900 text-[8px] font-bold px-1 py-0.5 rounded-full">
                      🥈
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute -top-1 -right-1 bg-amber-800 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                      🥉
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                    {trader.username}
                  </h4>
                  <div className="flex gap-1 items-center mt-0.5">
                    <span className={`text-[10px] font-bold ${trader.profitPercent >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {trader.profitPercent >= 0 ? '+' : ''}{trader.profitPercent.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-stone-300">this week</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2.5 text-[10px]">
              <div className="flex gap-0.5 items-center">
                <span className="text-stone-300">Win Rate:</span>
                <span className="text-zinc-100 font-semibold">{trader.winRate.toFixed(1)}%</span>
              </div>
              <div className="flex gap-0.5 items-center">
                <span className="text-stone-300">Copiers:</span>
                <span className="text-zinc-100 font-semibold">{trader.totalCopiers}</span>
              </div>
              <div className="flex gap-0.5 items-center">
                <span className="text-stone-300">Trades:</span>
                <span className="text-zinc-100 font-semibold">{trader.totalTrades}</span>
              </div>
              <div className="flex gap-0.5 items-center">
                <span className="text-stone-300">Risk:</span>
                <span className={`px-1 py-0.5 rounded text-[10px] ${
                  trader.riskLevel === 'low' ? 'bg-green-700/20 text-green-700' :
                  trader.riskLevel === 'medium' ? 'bg-yellow-700/20 text-yellow-700' :
                  'bg-red-600/20 text-red-600'
                }`}>
                  {trader.riskLevel}
                </span>
              </div>
            </div>

            <div className="mt-2.5 flex gap-1.5">
              <button
                onClick={() => onSelectTrader(trader)}
                className="flex-1 px-2.5 py-1.5 bg-blue-700/80 hover:bg-blue-700 rounded-3xl text-[10px] text-zinc-100 font-semibold"
              >
                Copy Now
              </button>
              <button
                onClick={onShowStats}
                className="px-2.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-3xl text-[10px] text-zinc-100 font-semibold"
              >
                Stats
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopTradersList;
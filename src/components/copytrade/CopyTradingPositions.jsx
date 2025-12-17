"use client";
import React from "react";

function CopyTradingPositions({ positions, onClosePosition }) {
  if (positions.length === 0) return null;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full mt-5">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-[12px] tracking-normal leading-none text-stone-300">
          MY COPY POSITIONS
        </h3>
        <span className="text-[10px] text-stone-300">
          {positions.length} active copies
        </span>
      </div>

      <div className="mt-1.5 space-y-1.5">
        {positions.map((position) => (
          <div key={position.id} className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900 min-h-[70px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={`https://ui-avatars.com/api/?name=${position.traderName}&background=6366f1&color=fff`}
                  alt={position.traderName}
                  className="object-contain shrink-0 self-stretch my-auto w-9 aspect-square rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                    {position.traderName}
                  </span>
                  <span className="text-[10px] text-stone-300">
                    {position.symbol}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-[12px] font-medium tracking-wide leading-tight ${position.profitPercent >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {position.profitPercent >= 0 ? '+' : ''}{position.profitPercent.toFixed(2)}%
                </div>
                <div className="text-[10px] text-stone-300">
                  ${Math.abs(position.profitLoss).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-2.5 text-[10px]">
              <div className="flex flex-col">
                <span className="text-stone-300">Position</span>
                <span className={`text-zinc-100 font-semibold ${position.side === 'buy' ? 'text-green-700' : 'text-red-600'}`}>
                  {position.side.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-stone-300">Entry</span>
                <span className="text-zinc-100 font-semibold">
                  ${position.entryPrice.toFixed(4)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-stone-300">Qty</span>
                <span className="text-zinc-100 font-semibold">
                  {position.quantity.toFixed(4)}
                </span>
              </div>
            </div>

            <div className="mt-2.5 flex gap-1.5">
              <button
                onClick={() => window.open(`/chart/${position.symbol}`, '_blank')}
                className="flex-1 px-2.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-3xl text-[10px] text-zinc-100 font-semibold"
              >
                View Chart
              </button>
              <button
                onClick={() => onClosePosition(position.traderId)}
                className="flex-1 px-2.5 py-1.5 bg-red-600/80 hover:bg-red-600 rounded-3xl text-[10px] text-zinc-100 font-semibold"
              >
                Stop Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CopyTradingPositions;
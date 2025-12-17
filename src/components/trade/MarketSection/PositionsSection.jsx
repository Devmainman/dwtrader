"use client";
import React from "react";

function PositionsSection({ positions, realTimePL, selectedPair, onClosePosition, onViewChart, formatCurrency }) {
  const calculateTotalPL = () => {
    return realTimePL.reduce((total, position) => total + (position.unrealizedPL || position.pnl || 0), 0);
  };

  const totalPL = calculateTotalPL();

  return (
    <div className="w-full mt-5">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-[12px] tracking-normal leading-none text-stone-300">
          OPEN POSITIONS
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-stone-300">Total P/L:</span>
          <span className={`text-[10px] font-semibold ${totalPL >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {totalPL >= 0 ? '+' : '-'}{formatCurrency(Math.abs(totalPL))}
          </span>
        </div>
      </div>
      
      {positions.length === 0 ? (
        <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900 text-center py-6 text-stone-300 text-[12px]">
          No open positions. Start trading!
        </div>
      ) : (
        <div className="space-y-1.5">
          {positions.map((position, index) => {
            const realTimeData = realTimePL.find(p => p._id === position._id);
            const currentPL = realTimeData?.unrealizedPL || position.pnl || 0;
            const plPercent = realTimeData?.unrealizedPLPercent || 
                             ((currentPL / (position.quantity * position.entryPrice)) * 100).toFixed(2);
            
            return (
              <div key={position._id || index} className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100 truncate">
                        {position.pair}
                      </span>
                      {position.pair === selectedPair && (
                        <span className="text-[10px] text-blue-700 bg-blue-700/10 px-1.5 py-0.5 rounded-3xl">Selected</span>
                      )}
                    </div>
                    <div className="mt-1.5 grid grid-cols-2 gap-2.5 text-[10px]">
                      <div className="flex gap-0.5 items-center">
                        <span className="text-stone-300">Qty:</span>
                        <span className="text-zinc-100 font-semibold">{position.quantity.toFixed(4)}</span>
                      </div>
                      <div className="flex gap-0.5 items-center">
                        <span className="text-stone-300">Entry:</span>
                        <span className="text-zinc-100 font-semibold">${position.entryPrice?.toFixed(4) || "0.0000"}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-right ml-2.5 ${currentPL >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                    <div className="text-[10px] font-semibold">
                      {currentPL >= 0 ? '+' : '-'}{formatCurrency(Math.abs(currentPL))}
                    </div>
                    <div className="text-[10px]">
                      {plPercent >= 0 ? '+' : ''}{Math.abs(parseFloat(plPercent)).toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-2.5">
                  <button
                    onClick={() => onClosePosition(position._id)}
                    className="flex-1 px-2.5 py-1.5 bg-red-600/80 hover:bg-red-600 rounded-3xl text-[10px] text-zinc-100 font-semibold flex items-center justify-center gap-1"
                  >
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/...close-icon..."
                      className="w-3.5 h-3.5"
                      alt="Close"
                    />
                    Close Position
                  </button>
                  <button
                    onClick={() => onViewChart(position.pair)}
                    className="px-2.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-3xl text-[10px] text-zinc-100 font-semibold"
                  >
                    Chart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PositionsSection;
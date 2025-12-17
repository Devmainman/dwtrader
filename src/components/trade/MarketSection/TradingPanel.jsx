"use client";
import React, { useState } from "react";

function TradingPanel({ 
  selectedPair, 
  amount, 
  setAmount, 
  priceFeed, 
  user, 
  onPlaceOrder,
  userCurrency,
  conversionRate,
  calculateOrderValue,
  formatCurrency
}) {
  const [orderType, setOrderType] = useState("market");
  
  const availableBalance = user?.balance || 0;
  const maxAmount = availableBalance / parseFloat(priceFeed[selectedPair] || 1);

  return (
    <div className="w-full mt-5">
      <h3 className="text-[12px] tracking-normal leading-none text-stone-300 mb-1.5">
        TRADE {selectedPair}
      </h3>
      
      <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
        {/* Order Type Selector */}
        <div className="flex gap-1">
          {["market", "limit"].map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`px-2.5 py-1.5 rounded-3xl text-[10px] font-semibold ${
                orderType === type
                  ? "bg-blue-700/80 text-zinc-100"
                  : "bg-neutral-700 text-stone-300 hover:text-zinc-100"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Amount Input */}
        <div className="mt-2.5">
          <label className="block text-[10px] text-stone-300 mb-1">
            Amount ({selectedPair.split('/')[0]})
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-2.5 py-3 bg-neutral-700 border border-neutral-900 rounded-3xl text-[10px] text-zinc-100 outline-none placeholder-stone-300"
              placeholder="0.00"
              step="0.0001"
              min="0"
            />
            <div className="absolute right-2.5 top-3 text-[10px] text-stone-300">
              Max: {maxAmount.toFixed(4)}
            </div>
          </div>
          
          {/* Percentage Buttons */}
          <div className="flex justify-between items-center mt-1.5">
            <div className="flex gap-1">
              {[0.25, 0.5, 0.75, 1].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setAmount((maxAmount * percent).toFixed(4))}
                  className="px-2 py-1 text-[8px] bg-neutral-700 hover:bg-neutral-600 rounded-3xl text-stone-300 hover:text-zinc-100"
                >
                  {percent * 100}%
                </button>
              ))}
            </div>
            <div className="text-[8px] text-stone-300">
              Value: {formatCurrency(calculateOrderValue())}
            </div>
          </div>
        </div>

        {/* Order Buttons */}
        <div className="flex gap-1.5 mt-2.5">
          <button
            onClick={() => onPlaceOrder("buy")}
            className="flex-1 px-2.5 py-2.5 bg-green-700/80 hover:bg-green-700 rounded-3xl text-[10px] font-semibold text-zinc-100 flex items-center justify-center gap-1"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/...buy-icon..."
              className="w-3.5 h-3.5"
              alt="Buy"
            />
            BUY {selectedPair.split('/')[0]}
          </button>
          <button
            onClick={() => onPlaceOrder("sell")}
            className="flex-1 px-2.5 py-2.5 bg-red-600/80 hover:bg-red-600 rounded-3xl text-[10px] font-semibold text-zinc-100 flex items-center justify-center gap-1"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/...sell-icon..."
              className="w-3.5 h-3.5"
              alt="Sell"
            />
            SELL {selectedPair.split('/')[0]}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TradingPanel;
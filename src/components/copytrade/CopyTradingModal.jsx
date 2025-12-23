"use client";
import React, { useState } from "react";

function CopyTradingModal({ trader, userBalance, userCurrency, onCopy, onClose }) {

  console.log('CopyTradingModal rendered with trader:', trader); // Add this
  console.log('Trader ID:', trader?.id); // Add this


  const [amount, setAmount] = useState("");
  const [allocationType, setAllocationType] = useState("percentage");
  const [riskLevel, setRiskLevel] = useState("same");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  const calculateAllocation = () => {
    if (!amount) return { amount: 0, percentage: 0 };
    
    if (allocationType === "percentage") {
      const percent = parseFloat(amount);
      const calculatedAmount = (userBalance * percent) / 100;
      return { amount: calculatedAmount, percentage: percent };
    } else {
      const fixedAmount = parseFloat(amount);
      const calculatedPercentage = (fixedAmount / userBalance) * 100;
      return { amount: fixedAmount, percentage: calculatedPercentage };
    }
  };

  const allocation = calculateAllocation();

  const formatCurrency = (amount) => {
    const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    // Add currency symbol based on currency code
    const currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'CHF',
      'CNY': '¥',
      'INR': '₹',
      'KRW': '₩',
      'RUB': '₽',
      'TRY': '₺',
      'BRL': 'R$',
      'MXN': '$',
      'ZAR': 'R',
      'NGN': '₦',
      'GHS': 'GH₵',
      'KES': 'KSh',
      'UGX': 'USh',
      'TZS': 'TSh'
    };
    
    const symbol = currencySymbols[userCurrency] || userCurrency;
    return `${symbol}${formattedAmount}`;
  };

  const handleCopy = () => {
  if (!amount || parseFloat(amount) <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  if (allocationType === "percentage" && parseFloat(amount) > 100) {
    alert("Percentage cannot exceed 100%");
    return;
  }

  if (allocationType === "fixed" && parseFloat(amount) > userBalance) {
    alert("Amount exceeds your available balance");
    return;
  }

  // Debug: Check all possible ID properties
  console.log('Trader IDs available:', {
    id: trader?.id,
    _id: trader?._id,
    traderId: trader?.traderId,
    username: trader?.username
  });

  // Try different ID properties in order of priority
  const traderId = trader?.id || trader?.traderId || trader?._id;
  
  if (!traderId) {
    alert(`Trader information is missing. Available IDs: _id=${trader?._id}, traderId=${trader?.traderId}`);
    return;
  }

  console.log('Sending copy request with traderId:', traderId, 'amount:', allocation.amount);
  onCopy(traderId, allocation.amount);
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm pb-30">
      <div className="bg-neutral-900 rounded-3xl p-5 max-w-[480px] w-full max-h-[90vh] overflow-y-auto border border-neutral-800">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <img
            src={trader?.avatar || `https://ui-avatars.com/api/?name=${trader?.username || 'Trader'}&background=6366f1&color=fff`}
            alt={trader?.username || 'Trader'}
            className="w-9 h-9 rounded-full"
          />
          <div>
            <h3 className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
              Copy {trader?.username || trader?.fullName || 'Trader'}
            </h3>
            <p className="text-[10px] text-stone-300">Start copying trades automatically</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-1 text-stone-300 hover:text-zinc-100 rounded-full hover:bg-neutral-800"
          >
            ✕
          </button>
        </div>

       {/* Trader Stats */}
        <div className="mb-5 px-2.5 py-3 bg-neutral-800 rounded-3xl border border-neutral-900">
          <div className="grid grid-cols-2 gap-4 text-[10px]">
            <div>
              <div className="text-stone-300">Profit</div>
              <div className={`text-[12px] font-medium tracking-wide leading-tight ${(trader?.performance?.profitPercent || 0) >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {(trader?.performance?.profitPercent || 0) >= 0 ? '+' : ''}{(trader?.performance?.profitPercent || 0).toFixed(2)}%
              </div>
            </div>
            <div>
              <div className="text-stone-300">Win Rate</div>
              <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                {(trader?.performance?.winRate || 0).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-stone-300">Trades</div>
              <div className="text-zinc-100 font-semibold">{trader?.performance?.totalTrades || 0}</div>
            </div>
            <div>
              <div className="text-stone-300">Copiers</div>
              <div className="text-zinc-100 font-semibold">{trader?.socialStats?.copiers || 0}</div>
            </div>
          </div>
        </div>

        {/* Allocation Type */}
        <div className="mb-2.5">
          <label className="block text-[10px] text-stone-300 mb-1">Allocation Type</label>
          <div className="flex gap-1">
            {["percentage", "fixed"].map((type) => (
              <button
                key={type}
                onClick={() => setAllocationType(type)}
                className={`flex-1 px-2.5 py-1.5 rounded-3xl text-[10px] font-semibold ${
                  allocationType === type
                    ? "bg-blue-700/80 text-zinc-100"
                    : "bg-neutral-800 text-stone-300 hover:text-zinc-100"
                }`}
              >
                {type === "percentage" ? "Percentage" : "Fixed Amount"}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-2.5">
          <label className="block text-[10px] text-stone-300 mb-1">
            {allocationType === "percentage" ? "Percentage of Balance" : `Fixed Amount  (${userCurrency})`}
          </label>
          <div className="relative">
            {allocationType === "percentage" ? (
              <>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-2.5 py-3 bg-neutral-800 border border-neutral-900 rounded-3xl text-[10px] text-zinc-100 outline-none placeholder-stone-300"
                  placeholder="0.00"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="absolute right-2.5 top-3 text-stone-300">%</span>
              </>
            ) : (
              <>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-2.5 py-3 bg-neutral-800 border border-neutral-900 rounded-3xl text-[10px] text-zinc-100 outline-none placeholder-stone-300"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-2.5 top-3 text-stone-300">$</span>
              </>
            )}
          </div>
          
          {/* Quick Percentage/Amount Buttons */}
          <div className="flex gap-1 mt-1">
            {(allocationType === "percentage" ? [10, 25, 50, 75, 100] : [100, 500, 1000, 5000]).map((value) => (
              <button
                key={value}  // Add this line
                onClick={() => setAmount(value.toString())}
                className="px-2 py-1 text-[10px] bg-neutral-700 hover:bg-neutral-600 rounded-3xl text-stone-300 hover:text-zinc-100"
              >
                {allocationType === "percentage" ? `${value}%` : `$${value}`}
              </button>
            ))}
          </div>
        </div>

        {/* Allocation Summary */}
        <div className="mb-5 px-2.5 py-3 bg-neutral-800/50 rounded-3xl border border-neutral-900">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-stone-300">Your Balance:</span>
            <span className="text-zinc-100 font-semibold">{formatCurrency(userBalance)}</span>
          </div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-stone-300">Allocation Amount:</span>
            <span className="text-zinc-100 font-semibold">
              {amount ? formatCurrency(allocation.amount) : "0.00"}
            </span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-stone-300">Allocation Percentage:</span>
            <span className="text-zinc-100 font-semibold">
              {amount ? allocation.percentage.toFixed(1) : "0.0"}%
            </span>
          </div>
        </div>

        {/* Risk Management */}
        <div className="mb-5">
          <label className="block text-[10px] text-stone-300 mb-1">Risk Management</label>
          
          {/* Risk Level */}
          <div className="mb-2.5">
            <div className="text-[10px] text-stone-300 mb-1">Risk Level</div>
            <div className="flex gap-1">
              {["same", "low", "medium", "high"].map((level) => (
              <button
                key={level}  // Add key prop here too
                onClick={() => setRiskLevel(level)}
                className={`flex-1 px-2.5 py-1.5 rounded-3xl text-[10px] font-semibold ${
                  riskLevel === level
                    ? level === 'same' ? 'bg-blue-700/80 text-zinc-100' :
                      level === 'low' ? 'bg-green-700/80 text-zinc-100' :
                      level === 'medium' ? 'bg-yellow-700/80 text-zinc-100' :
                      'bg-red-600/80 text-zinc-100'
                    : "bg-neutral-800 text-stone-300"
                }`}
              >
                {level === 'same' ? 'Same as Trader' : level}
              </button>
            ))}
            </div>
          </div>
          
          {/* Stop Loss & Take Profit */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <div className="text-[10px] text-stone-300 mb-1">Stop Loss (%)</div>
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full px-2.5 py-2 bg-neutral-800 border border-neutral-900 rounded-3xl text-[10px] text-zinc-100"
                placeholder="e.g., 10"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <div className="text-[10px] text-stone-300 mb-1">Take Profit (%)</div>
              <input
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="w-full px-2.5 py-2 bg-neutral-800 border border-neutral-900 rounded-3xl text-[10px] text-zinc-100"
                placeholder="e.g., 30"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 px-2.5 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-3xl text-[10px] text-zinc-100 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 px-2.5 py-3 bg-green-700/80 hover:bg-green-700 rounded-3xl text-[10px] text-zinc-100 font-semibold"
          >
            Start Copy Trading
          </button>
        </div>
      </div>
    </div>
  );
}

export default CopyTradingModal;
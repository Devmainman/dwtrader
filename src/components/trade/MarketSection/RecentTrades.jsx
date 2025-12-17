"use client";
import React from "react";

function RecentTrades({ history, userCurrency, conversionRate }) {
  const formatTime = (time) => {
    if (!time) return "Recently";
    if (time.includes("ago")) return time;
    
    // Convert timestamp to relative time
    const timestamp = new Date(time);
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return `0.00 ${userCurrency}`;
    const converted = num * conversionRate;
    return `${converted.toFixed(2)} ${userCurrency}`;
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs text-neutral-400">Recent Trades</h3>
        <span className="text-xs text-neutral-400">{history.length} trades</span>
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-4 text-neutral-400 text-sm bg-neutral-900 rounded-xl">
          No recent trades
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {history.slice(0, 5).map((trade, index) => (
            <div key={trade._id || index} className="flex justify-between items-center bg-neutral-900 rounded-xl p-3 hover:bg-neutral-800 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    trade.side === 'buy' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.side?.toUpperCase() || 'TRADE'}
                  </span>
                  <span className="text-sm font-medium text-zinc-100 truncate">{trade.pair}</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {formatTime(trade.time || trade.closedAt || trade.createdAt)}
                </div>
              </div>
              <div className={`text-sm font-medium ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trade.profit >= 0 ? '+' : '-'}{formatCurrency(Math.abs(trade.profit || 0))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentTrades;
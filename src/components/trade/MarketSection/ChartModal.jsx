"use client";
import React from "react";

function ChartModal({ show, onClose, selectedPair, priceFeed, chartTimeframe, setChartTimeframe, chartKey, onPlaceOrder }) {
  if (!show) return null;

  const timeframes = [
    { label: "1m", value: "1" },
    { label: "5m", value: "5" },
    { label: "15m", value: "15" },
    { label: "30m", value: "30" },
    { label: "1h", value: "60" },
    { label: "4h", value: "240" },
    { label: "1d", value: "1D" },
    { label: "1w", value: "1W" },
  ];

  const getTradingViewSymbol = () => {
    const baseSymbol = selectedPair.split('/')[0];
    const quoteSymbol = selectedPair.split('/')[1];
    
    // For crypto pairs
    if (quoteSymbol === "USDT") {
      return `${baseSymbol}${quoteSymbol}`;
    }
    
    // For forex pairs, TradingView uses different format
    return `FX:${baseSymbol}${quoteSymbol}`;
  };

  const getChartUrl = () => {
    const symbol = getTradingViewSymbol();
    return `https://www.tradingview.com/widgetembed/?symbol=${symbol}&interval=${chartTimeframe}&theme=dark&style=1&locale=en&hide_side_toolbar=0`;
  };

  const formatPrice = (price) => {
    if (!price || price === "-") return "-";
    const num = parseFloat(price);
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  const formatVolume = (volume) => {
    if (!volume || volume === "0") return "-";
    const num = parseFloat(volume);
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Chart Container */}
      <div className="relative h-screen w-full flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="relative w-full h-[85vh] sm:h-[80vh] max-w-6xl bg-[#1D1D1F] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-neutral-800">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <h3 className="text-lg sm:text-xl font-semibold text-zinc-100">
                {selectedPair} Chart
              </h3>
              <div className="text-sm text-neutral-400">
                ${formatPrice(priceFeed[selectedPair])}
                <span className={`ml-2 ${parseFloat(priceFeed[`${selectedPair}_change`] || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(priceFeed[`${selectedPair}_change`] || 0) >= 0 ? '+' : ''}{priceFeed[`${selectedPair}_change`] || '0.00'}%
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              {/* Timeframe Selector */}
              <div className="grid grid-cols-4 sm:flex flex-wrap gap-1 bg-neutral-900 rounded-lg p-1 w-full sm:w-auto">
                {timeframes.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setChartTimeframe(tf.value)}
                    className={`px-2 sm:px-3 py-1 text-xs rounded transition-colors ${
                      chartTimeframe === tf.value 
                        ? 'bg-blue-600 text-white' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between items-center gap-2 w-full sm:w-auto">
                <div className="flex gap-2">
                  <button
                    onClick={() => onPlaceOrder("buy")}
                    className="px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-medium text-white transition-colors"
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => onPlaceOrder("sell")}
                    className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-medium text-white transition-colors"
                  >
                    SELL
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="flex-1 p-2 sm:p-4">
            <div className="w-full h-full bg-neutral-900 rounded-xl overflow-hidden">
              <iframe
                key={chartKey}
                src={getChartUrl()}
                className="w-full h-full border-0"
                title={`${selectedPair} Price Chart`}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Market Stats */}
          <div className="p-4 border-t border-neutral-800 bg-[#1D1D1F]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-neutral-400 text-xs sm:text-sm">24h High</p>
                <p className="text-green-400 font-medium text-sm sm:text-base">
                  ${formatPrice(priceFeed[`${selectedPair}_high`])}
                </p>
              </div>
              <div>
                <p className="text-neutral-400 text-xs sm:text-sm">24h Low</p>
                <p className="text-red-400 font-medium text-sm sm:text-base">
                  ${formatPrice(priceFeed[`${selectedPair}_low`])}
                </p>
              </div>
              <div>
                <p className="text-neutral-400 text-xs sm:text-sm">24h Volume</p>
                <p className="text-white font-medium text-sm sm:text-base">
                  {formatVolume(priceFeed[`${selectedPair}_volume`])}
                </p>
              </div>
              <div>
                <p className="text-neutral-400 text-xs sm:text-sm">Current</p>
                <p className="text-white font-medium text-sm sm:text-base">
                  ${formatPrice(priceFeed[selectedPair])}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartModal;
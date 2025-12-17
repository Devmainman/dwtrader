"use client";
import React from "react";

function CryptoItem({ 
  pair, 
  price, 
  change, 
  volume, 
  isFavorite, 
  isSelected, 
  onToggleFavorite, 
  onSelectPair,
  onViewChart,
  formatPrice,
  formatVolume
}) {
  const changeValue = parseFloat(change || 0);
  const isPositive = changeValue >= 0;

  return (
    <div 
      className={`overflow-hidden px-2.5 py-3 rounded-3xl border border-solid ${
        isSelected ? 'border-blue-700/80 bg-neutral-800' : 'bg-neutral-800 border-neutral-900'
      }`}
      onClick={() => onSelectPair()}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <img
            src={pair.image}
            alt={pair.symbol}
            className="w-9 h-9 rounded-full"
          />
          <div>
            <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
              {pair.symbol}
            </div>
            <div className="text-[10px] text-stone-300">{pair.type === 'crypto' ? 'Crypto' : 'Forex'}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-stone-300">{formatVolume(volume)}</div>
          </div>
          
          <div className="text-right">
            <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
              ${formatPrice(price)}
            </div>
          </div>
          
          <div className={`flex gap-0.5 items-center ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
            <img
              src={isPositive 
                ? "https://cdn.builder.io/api/v1/image/assets/TEMP/8618c649fa66b3ae7a6da6429776b793c56523f7c9f2ae8a586af42b5f9346cf?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                : "https://cdn.builder.io/api/v1/image/assets/TEMP/...down-arrow..."}
              className="w-3 h-3"
              alt="Trend"
            />
            <span className="text-[10px] font-semibold">
              {Math.abs(changeValue).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-1.5 mt-2.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`px-2.5 py-1.5 rounded-3xl text-[10px] font-semibold ${
            isFavorite 
              ? 'bg-yellow-700/20 text-yellow-700' 
              : 'bg-neutral-700 text-stone-300 hover:text-zinc-100'
          }`}
        >
          {isFavorite ? '★' : '☆'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewChart();
          }}
          className="flex-1 px-2.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-3xl text-[10px] text-zinc-100 font-semibold"
        >
          View Chart
        </button>
      </div>
    </div>
  );
}

export default CryptoItem;
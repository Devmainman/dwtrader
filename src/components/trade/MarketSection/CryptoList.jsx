"use client";
import React from "react";
import CryptoItem from "./CryptoItem";

function CryptoList({ 
  activeTab, 
  pairs, 
  priceFeed, 
  favorites, 
  selectedPair, 
  searchTerm, 
  showAllPairs,
  onToggleFavorite,
  onSelectPair,
  onViewChart,
  onLoadMore,
  formatPrice,
  formatVolume
}) {
  
  // Filter pairs based on search
  const filteredPairs = pairs.filter(pair => {
    if (!searchTerm) return true;
    return pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pair.base.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Display pairs (show all or limited)
  const displayPairs = showAllPairs ? filteredPairs : filteredPairs.slice(0, 5);

  return (
    <div className="w-full mt-5">
      <div className="flex overflow-hidden gap-5 justify-between py-3 text-[10px] text-stone-300 border-b border-neutral-800">
        <div className="flex gap-4 items-center">
          <div className="flex gap-0.5 items-center">
            <p className="font-semibold">Name</p>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/...dropdown-icon..."
              className="w-2.5 h-2.5"
              alt="Sort"
            />
          </div>
          <div className="flex gap-0.5 items-center">
            <p className="font-semibold">24h vol</p>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/...dropdown-icon..."
              className="w-2.5 h-2.5"
              alt="Sort"
            />
          </div>
        </div>
        <div className="flex gap-0.5 items-center">
          <p className="font-semibold">Last price</p>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/...dropdown-icon..."
            className="w-2.5 h-2.5"
            alt="Sort"
          />
        </div>
        <div className="flex gap-0.5 items-center">
          <p className="font-semibold">Change</p>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/...dropdown-icon..."
            className="w-2.5 h-2.5"
            alt="Sort"
          />
        </div>
      </div>

      {/* Crypto Items */}
      <div className="mt-2.5 space-y-1.5">
        {displayPairs.map((pair) => (
          <CryptoItem
            key={pair.symbol}
            pair={pair}
            price={priceFeed[pair.symbol]}
            change={priceFeed[`${pair.symbol}_change`]}
            volume={priceFeed[`${pair.symbol}_volume`]}
            isFavorite={favorites.includes(pair.symbol)}
            isSelected={selectedPair === pair.symbol}
            onToggleFavorite={() => onToggleFavorite(pair.symbol)}
            onSelectPair={() => onSelectPair(pair.symbol)}
            onViewChart={() => onViewChart(pair.symbol)}
            formatPrice={formatPrice}
            formatVolume={formatVolume}
          />
        ))}
        
        {displayPairs.length === 0 && (
          <div className="text-center py-6 text-stone-300 text-[12px]">
            No pairs found matching your search
          </div>
        )}
      </div>

      {filteredPairs.length > 5 && (
        <button
          onClick={onLoadMore}
          className="flex gap-1.5 items-center self-center mt-3 text-[10px] text-center text-zinc-100 hover:text-blue-700"
        >
          <span className="self-stretch my-auto">
            {showAllPairs ? "Show Less" : `View All (${filteredPairs.length})`}
          </span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/...plus-icon..."
            className="w-4 h-4"
            alt="More"
          />
        </button>
      )}
    </div>
  );
}

export default CryptoList;
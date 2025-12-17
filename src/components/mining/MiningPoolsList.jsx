"use client";
import React from "react";

function MiningPoolsList({ pools, selectedPool, onSelectPool }) {
  const handleSelectPool = (pool) => {
    if (window.confirm(`Switch to ${pool.name} mining pool?`)) {
      onSelectPool(pool.id);
    }
  };

  return (
    <div className="w-full mt-5">
      <div className="flex justify-between items-center mb-1.5">
        <div>
          <h3 className="text-[12px] tracking-normal leading-none text-stone-300">
            MINING POOLS
          </h3>
          <p className="text-[10px] text-stone-300 mt-0.5">
            {selectedPool ? `Current: ${selectedPool.name}` : 'No pool selected'}
          </p>
        </div>
        <div className="text-[10px] text-stone-300">
          {pools.length} pools available
        </div>
      </div>

      <div className="mt-1.5 space-y-1.5">
        {pools.length > 0 ? (
          pools.map((pool) => (
            <div
              key={pool.id}
              className={`overflow-hidden px-2.5 py-3 rounded-3xl border border-solid ${
                selectedPool?.id === pool.id
                  ? 'border-blue-700/80 bg-neutral-800'
                  : 'bg-neutral-800 border-neutral-900'
              }`}
              onClick={() => handleSelectPool(pool)}
            >
              <div className="flex justify-between items-start mb-2.5">
                <div>
                  <h4 className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                    {pool.name}
                  </h4>
                  <div className="text-[10px] text-stone-300 mt-0.5">
                    {pool.algorithm}
                  </div>
                </div>
                {selectedPool?.id === pool.id && (
                  <div className="px-2 py-1 bg-blue-700/20 text-blue-700 rounded-3xl text-[10px] font-semibold">
                    ACTIVE
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[10px]">
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Fee:</span>
                  <span className="text-zinc-100 font-semibold">{pool.fee}%</span>
                </div>
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Miners:</span>
                  <span className="text-zinc-100 font-semibold">{pool.miners?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Uptime:</span>
                  <span className="text-green-700 font-semibold">{pool.uptime?.toFixed(1) || '0'}%</span>
                </div>
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Min Payout:</span>
                  <span className="text-zinc-100 font-semibold">{pool.minPayout || '0.001'} BTC</span>
                </div>
              </div>

              <button
                className={`w-full mt-2.5 px-2.5 py-1.5 rounded-3xl text-[10px] font-semibold ${
                  selectedPool?.id === pool.id
                    ? 'bg-blue-700/80 text-zinc-100'
                    : 'bg-neutral-700 hover:bg-neutral-600 text-zinc-100'
                }`}
              >
                {selectedPool?.id === pool.id ? 'CURRENTLY ACTIVE' : 'SELECT POOL'}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-stone-300 text-[12px]">
            No mining pools available. Please check back later.
          </div>
        )}
      </div>
    </div>
  );
}

export default MiningPoolsList;
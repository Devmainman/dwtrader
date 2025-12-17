"use client";
import React from "react";

function MiningControls({ isMining, selectedPool, onStartMining, onStopMining, onClaimRewards }) {
  return (
    <div className="w-full mt-5">
      <h3 className="text-[12px] tracking-normal leading-none text-stone-300 mb-1.5">
        MINING CONTROLS
      </h3>
      
      <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
        {/* Pool Info */}
        {selectedPool && (
          <div className="flex justify-between items-center px-2.5 py-2 bg-neutral-700/50 rounded-3xl mb-3">
            <div>
              <div className="text-[10px] text-stone-300">Current Pool</div>
              <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                {selectedPool.name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-stone-300">Fee</div>
              <div className="text-[12px] font-medium tracking-wide leading-tight text-green-700">
                {selectedPool.fee}%
              </div>
            </div>
          </div>
        )}
        
        {/* Control Buttons */}
        <div className="flex gap-1.5">
          <button
            onClick={isMining ? onStopMining : onStartMining}
            className={`flex-1 px-2.5 py-2.5 rounded-3xl text-[10px] font-semibold text-zinc-100 flex items-center justify-center gap-1 ${
              isMining 
                ? "bg-red-600/80 hover:bg-red-600" 
                : "bg-green-700/80 hover:bg-green-700"
            }`}
          >
            <img
              src={isMining 
                ? "https://cdn.builder.io/api/v1/image/assets/TEMP/...stop-icon..."
                : "https://cdn.builder.io/api/v1/image/assets/TEMP/...play-icon..."
              }
              className="w-3.5 h-3.5"
              alt={isMining ? "Stop" : "Start"}
            />
            {isMining ? "STOP MINING" : "START MINING"}
          </button>
          
          <button
            onClick={onClaimRewards}
            className="flex-1 px-2.5 py-2.5 bg-gradient-to-r from-blue-700/80 to-purple-700/80 hover:from-blue-700 hover:to-purple-700 rounded-3xl text-[10px] font-semibold text-zinc-100 flex items-center justify-center gap-1"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/...money-icon..."
              className="w-3.5 h-3.5"
              alt="Claim"
            />
            CLAIM REWARDS
          </button>
        </div>
      </div>
    </div>
  );
}

export default MiningControls;
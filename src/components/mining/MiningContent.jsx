"use client";
import React from "react";

function MiningControls({ isMining, selectedPool, onStartMining, onStopMining, onClaimRewards }) {
  return (
    <div className="mt-4">
      <h3 className="text-xs text-neutral-400 mb-2">Mining Controls</h3>
      <div className="bg-neutral-900 rounded-xl p-4 space-y-4">
        {/* Pool Info */}
        {selectedPool && (
          <div className="flex justify-between items-center p-3 bg-neutral-800 rounded-lg">
            <div>
              <div className="text-[10px] text-neutral-400">Current Pool</div>
              <div className="text-sm font-medium text-zinc-100">{selectedPool.name}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-neutral-400">Fee</div>
              <div className="text-sm text-green-400">{selectedPool.fee}%</div>
            </div>
          </div>
        )}
        
        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={isMining ? onStopMining : onStartMining}
            className={`py-3 rounded-full text-[10px] font-medium text-white transition-colors flex items-center justify-center gap-2 ${
              isMining 
                ? "bg-red-600 hover:bg-red-500" 
                : "bg-green-600 hover:bg-green-500"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMining ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              )}
            </svg>
            {isMining ? "STOP MINING" : "START MINING"}
          </button>
          <button
            onClick={onClaimRewards}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-3 rounded-full text-[10px] font-medium text-white transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            CLAIM REWARDS
          </button>
        </div>
      </div>
    </div>
  );
}

export default MiningControls;
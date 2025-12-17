"use client";
import React from "react";

function MiningRewardsList({ rewards, onClaimRewards, detailed = false }) {
  const totalValue = rewards.reduce((sum, r) => sum + (r.value || 0), 0);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full mt-5">
      <div className="flex justify-between items-center mb-1.5">
        <div>
          <h3 className="text-[12px] tracking-normal leading-none text-stone-300">
            {detailed ? "ALL REWARDS" : "RECENT REWARDS"}
          </h3>
          <p className="text-[10px] text-stone-300 mt-0.5">
            Total: ${totalValue.toFixed(2)}
          </p>
        </div>
        {!detailed && rewards.length > 3 && (
          <button className="text-[10px] text-blue-700 hover:text-blue-600">
            View All
          </button>
        )}
      </div>

      <div className="mt-1.5 space-y-1.5">
        {rewards.length > 0 ? (
          rewards.slice(0, detailed ? rewards.length : 3).map((reward) => (
            <div key={reward.id} className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/...money-icon..."
                      className="w-4.5 h-4.5"
                      alt="Reward"
                    />
                  </div>
                  <div>
                    <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                      {reward.amount?.toFixed(6) || '0.000000'} {reward.coin || 'BTC'}
                    </div>
                    <div className="text-[10px] text-stone-300">
                      {formatTime(reward.createdAt || reward.claimedAt || new Date())}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-medium tracking-wide leading-tight text-green-700">
                    ${reward.value?.toFixed(2) || '0.00'}
                  </div>
                  <div className={`text-[10px] font-semibold ${
                    reward.status === 'claimed' ? 'text-green-700' :
                    reward.status === 'pending' ? 'text-yellow-700' : 'text-stone-300'
                  }`}>
                    {reward.status?.toUpperCase() || 'PENDING'}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-stone-300 text-[12px]">
            No rewards yet. Start mining to earn rewards!
          </div>
        )}
      </div>

      {detailed && rewards.length > 0 && (
        <button
          onClick={onClaimRewards}
          className="w-full mt-5 px-2.5 py-3 bg-green-700/80 hover:bg-green-700 rounded-3xl text-[10px] text-zinc-100 font-semibold"
        >
          CLAIM ALL REWARDS (${totalValue.toFixed(2)})
        </button>
      )}
    </div>
  );
}

export default MiningRewardsList;
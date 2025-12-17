"use client";
import React from "react";

function MiningHistoryList({ history, formatDuration }) {
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full mt-5">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-[12px] tracking-normal leading-none text-stone-300">
          MINING HISTORY
        </h3>
        <div className="text-[10px] text-stone-300">
          Total: {history.length} sessions
        </div>
      </div>

      {history.length > 0 ? (
        <div className="mt-1.5 space-y-1.5">
          {history.map((session) => (
            <div key={session.id} className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
              <div className="flex justify-between items-start mb-2.5">
                <div>
                  <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                    {session.pool || 'Unknown Pool'}
                  </div>
                  <div className="text-[10px] text-stone-300">
                    {formatTime(session.startedAt)} - {formatTime(session.endedAt)}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-3xl text-[10px] font-semibold ${
                  session.status === 'completed' ? 'bg-green-700/20 text-green-700' :
                  session.status === 'active' ? 'bg-blue-700/20 text-blue-700' :
                  session.status === 'stopped' ? 'bg-yellow-700/20 text-yellow-700' :
                  'bg-red-600/20 text-red-600'
                }`}>
                  {session.status?.toUpperCase() || 'UNKNOWN'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[10px]">
                <div className="flex flex-col">
                  <span className="text-stone-300">Duration</span>
                  <span className="text-zinc-100 font-semibold">
                    {formatDuration ? formatDuration(session.duration) : 
                     session.duration ? `${Math.floor(session.duration / 3600)}h ${Math.floor((session.duration % 3600) / 60)}m` : 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-stone-300">Hash Rate</span>
                  <span className="text-blue-700 font-semibold">{session.hashRate || 0} MH/s</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-stone-300">Equipment</span>
                  <span className="text-zinc-100 font-semibold">{session.equipmentCount || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-stone-300">Earnings</span>
                  <span className="text-green-700 font-semibold">${session.earnings?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-stone-300 text-[12px]">
          No mining history yet. Start mining to see your sessions here.
        </div>
      )}
    </div>
  );
}

export default MiningHistoryList;
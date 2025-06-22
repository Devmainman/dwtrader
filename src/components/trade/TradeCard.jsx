import React from "react";

function TradeCard({ status, progress, isActive, tradeName, tradeDate, tradeAmount, profitReturns }) {
  const getStatusColor = () => {
    switch (status) {
      case "paused": return "bg-yellow-600";
      case "terminated": return "bg-red-600";
      case "in-progress": return "bg-blue-600";
      case "completed": return "bg-green-700";
      default: return "bg-blue-600";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "paused": return "Paused";
      case "terminated": return "Terminated";
      case "in-progress": return "In Progress";
      case "completed": return "Completed";
      default: return "In Progress";
    }
  };

  const cardBgColor = isActive ? "bg-neutral-900" : "bg-neutral-800";

  return (
    <div className="w-full max-w-full sm:px-0 mt-2.5">
      <div className={`flex flex-col md:flex-row justify-between gap-2 px-3 py-3 rounded-xl ${cardBgColor} w-full max-w-screen-xl`}>
        {/* Left Side Info */}
        <div className="flex flex-wrap gap-8 md:items-center md:justify-between w-full md:w-2/3">
          <div className="flex justify-between flex-col">
            <p className="text-xs font-semibold text-fuchsia-600">{tradeName}</p>
            <p className="text-[8px] text-neutral-400">{tradeDate}</p>
          </div>

          <div>
            <p className="text-[8px] text-neutral-400">Trade Amount</p>
            <p className="text-[10px] text-zinc-100">{tradeAmount}</p>
          </div>

          <div>
            <p className="text-[8px] text-neutral-400">Profit Returns</p>
            <p className="text-[10px] text-zinc-100">{profitReturns}</p>
          </div>
        </div>

        {/* Progress + Status */}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <div className="overflow-hidden h-[6px] bg-white rounded-xl w-full text-[4px] text-white mt-2">
            <div 
              className={`px-${progress === 37 ? '5' : '32'} py-px ${getStatusColor()} rounded-xl`}
              style={{ width: `${progress}%` }}
            >
              {progress === 37 ? '37%' : '100%'}
            </div>
          </div>

          <div className={`self-end md:self-end px-1 text-[8px] ${getStatusColor()} rounded text-zinc-100`}>
            {getStatusText()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradeCard;
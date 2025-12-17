"use client";
import React from "react";

function TraderStats({ stats }) {
  const statCards = [
    {
      id: "totalCopiers",
      label: "Active Copiers",
      value: stats.totalCopiers.toLocaleString(),
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/...users-icon...",
      change: "+12.5%",
      trend: "up"
    },
    {
      id: "totalTraders",
      label: "Expert Traders",
      value: stats.totalTraders,
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/...trader-icon...",
      change: "+8.2%",
      trend: "up"
    },
    {
      id: "totalVolume",
      label: "Total Volume",
      value: `$${(stats.totalVolume / 1000000).toFixed(1)}M`,
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/...chart-icon...",
      change: "+24.7%",
      trend: "up"
    },
    {
      id: "averageProfit",
      label: "Avg. Profit",
      value: `${stats.averageProfit.toFixed(1)}%`,
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/...money-icon...",
      change: "+3.1%",
      trend: "up"
    }
  ];

  return (
    <div className="mt-5">
      <h3 className="text-[12px] tracking-normal leading-none text-stone-300">
        COPY TRADING STATS
      </h3>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {statCards.map(stat => (
          <div key={stat.id} className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900 min-h-[80px]">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="text-[10px] text-stone-300">{stat.label}</div>
                <div className="text-[28px] font-medium tracking-wide leading-tight text-zinc-100 mt-1">
                  {stat.value}
                </div>
                <div className="flex gap-0.5 items-start self-start mt-1">
                  <div className={`flex gap-0.5 justify-center items-center ${stat.trend === 'up' ? 'text-green-700' : 'text-red-600'}`}>
                    <img
                      src={stat.trend === 'up' 
                        ? "https://cdn.builder.io/api/v1/image/assets/TEMP/8618c649fa66b3ae7a6da6429776b793c56523f7c9f2ae8a586af42b5f9346cf?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                        : "https://cdn.builder.io/api/v1/image/assets/TEMP/...down-arrow..."}
                      className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
                      alt="Trend icon"
                    />
                    <p className="self-stretch my-auto text-[10px]">
                      {stat.change}
                    </p>
                  </div>
                  <p className="text-[10px] font-semibold text-stone-300">Past Week</p>
                </div>
              </div>
              <div className="p-1.5 bg-neutral-700 rounded-full">
                <img
                  src={stat.icon}
                  alt={stat.label}
                  className="w-6 h-6"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TraderStats;
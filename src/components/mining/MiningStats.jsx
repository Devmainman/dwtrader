"use client";
import React from "react";

function MiningStats({ stats }) {
  const statItems = [
    { 
      label: "Hash Rate", 
      value: `${stats?.hashRate?.toFixed(2) || 0} MH/s`, 
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/...speed-icon...",
      trend: "up"
    },
    { 
      label: "Coins Mined", 
      value: `${stats?.coinsMined?.toFixed(6) || 0} BTC`, 
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/...bitcoin-icon...",
      trend: "up"
    },
    { 
      label: "Earnings Today", 
      value: `$${stats?.earningsToday?.toFixed(2) || 0}`, 
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/...money-icon...",
      trend: "up"
    },
    { 
      label: "Total Earnings", 
      value: `$${stats?.totalEarnings?.toFixed(2) || 0}`, 
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/...total-icon...",
      trend: "up"
    },
    { 
      label: "Power Usage", 
      value: `${stats?.powerConsumption?.toFixed(0) || 0}W`, 
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/...power-icon...",
      trend: "down"
    },
    { 
      label: "Temperature", 
      value: `${stats?.temperature?.toFixed(1) || 0}°C`, 
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/...temp-icon...",
      trend: "down"
    },
    { 
      label: "Active Time", 
      value: stats?.activeTime || "0h 0m", 
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/...time-icon...",
      trend: "up"
    },
    { 
      label: "Efficiency", 
      value: `${stats?.efficiency?.toFixed(3) || 0} J/MH`, 
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/...efficiency-icon...",
      trend: "down"
    }
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-[12px] tracking-normal leading-none text-stone-300">
          MINING STATUS
        </h3>
        <div className={`px-2 py-1 rounded-3xl text-[10px] font-semibold ${
          stats?.isMining ? 'bg-green-700/20 text-green-700' : 'bg-red-600/20 text-red-600'
        }`}>
          {stats?.isMining ? 'ACTIVE' : 'INACTIVE'}
        </div>
      </div>
      
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {statItems.map((stat, index) => (
          <div key={index} className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900 min-h-[80px]">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="text-[10px] text-stone-300">{stat.label}</div>
                <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100 mt-1">
                  {stat.value}
                </div>
                <div className="flex gap-0.5 items-center self-start mt-1">
                  <div className={`flex gap-0.5 items-center ${stat.trend === 'up' ? 'text-green-700' : 'text-red-600'}`}>
                    <img
                      src={stat.trend === 'up' 
                        ? "https://cdn.builder.io/api/v1/image/assets/TEMP/8618c649fa66b3ae7a6da6429776b793c56523f7c9f2ae8a586af42b5f9346cf?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                        : "https://cdn.builder.io/api/v1/image/assets/TEMP/...down-arrow..."}
                      className="w-3 h-3"
                      alt="Trend"
                    />
                    <span className="text-[10px]">
                      {stat.trend === 'up' ? '+5.2%' : '-2.1%'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-1.5 bg-neutral-700 rounded-full">
                <img
                  src={stat.icon}
                  alt={stat.label}
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MiningStats;
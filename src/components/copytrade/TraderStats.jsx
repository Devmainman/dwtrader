"use client";
import React from "react";

function TraderStats({ stats, userCurrency }) {
  console.log('TraderStats received stats:', stats);
  console.log('TraderStats received userCurrency:', userCurrency);
  
  // Extract values with multiple possible property names
  const totalCopiers = stats?.totalCopiers || stats?.totalCopiersCount || stats?.copiers || 0;
  const totalTraders = stats?.totalTraders || stats?.tradersCount || stats?.traders || 0;
  const totalVolume = stats?.totalVolume || stats?.volume || stats?.tradingVolume || 0;
  const rawAverageProfit = stats?.averageProfit ?? stats?.avgProfit ?? stats?.profit ?? 0;
  const averageProfit = Number(rawAverageProfit) || 0;

  const formatCurrency = (amount) => {
    // Handle undefined or null userCurrency
    const currency = userCurrency;
    
    const currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'CHF',
      'CNY': '¥',
      'INR': '₹',
      'KRW': '₩',
      'RUB': '₽',
      'TRY': '₺',
      'BRL': 'R$',
      'MXN': '$',
      'ZAR': 'R',
      'NGN': '₦',
      'GHS': 'GH₵',
      'KES': 'KSh',
      'UGX': 'USh',
      'TZS': 'TSh'
    };
    
    const symbol = currencySymbols[currency] || currency;
    const amountNumber = Number(amount) || 0;
    
    // Format based on the amount size
    if (amountNumber >= 1000000000) {
      return `${symbol}${(amountNumber / 1000000000).toFixed(1)}B`;
    } else if (amountNumber >= 1000000) {
      return `${symbol}${(amountNumber / 1000000).toFixed(1)}M`;
    } else if (amountNumber >= 1000) {
      return `${symbol}${(amountNumber / 1000).toFixed(1)}K`;
    } else {
      // For JPY, no decimal places for whole numbers
      if (currency === 'JPY' && amountNumber % 1 === 0) {
        return `${symbol}${amountNumber.toFixed(0)}`;
      }
      // For other currencies, show 2 decimal places
      return `${symbol}${amountNumber.toFixed(2)}`;
    }
  };
  
  const statCards = [
    {
      id: "totalCopiers",
      label: "Active Copiers",
      value: totalCopiers.toLocaleString(),
      icon: "👥",
      change: "",
      trend: "up"
    },
    {
      id: "totalTraders",
      label: "Expert Traders",
      value: totalTraders.toLocaleString(),
      icon: "👤",
      change: "",
      trend: "up"
    },
    {
      id: "totalVolume",
      label: "Total Volume",
      value: formatCurrency(totalVolume),
      icon: "📈",
      change: "",
      trend: "up"
    },
    {
      id: "averageProfit",
      label: "Avg. Profit",
      value: `${averageProfit.toFixed(1)}%`,
      icon: "💰",
      change: "",
      trend: averageProfit >= 0 ? "up" : "down"
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
                {stat.change && (
                  <div className="flex gap-0.5 items-start self-start mt-1">
                    <div className={`flex gap-0.5 justify-center items-center ${stat.trend === 'up' ? 'text-green-700' : 'text-red-600'}`}>
                      <span className="text-[10px]">
                        {stat.trend === 'up' ? '↗' : '↘'}
                      </span>
                      <p className="self-stretch my-auto text-[10px]">
                        {stat.change}
                      </p>
                    </div>
                    <p className="text-[10px] font-semibold text-stone-300">Past Week</p>
                  </div>
                )}
              </div>
              <div className="p-1.5 bg-neutral-700 rounded-full">
                <span className="text-[16px]">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TraderStats;
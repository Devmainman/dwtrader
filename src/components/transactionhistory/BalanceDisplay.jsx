"use client";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../api/config";
import { useBalance } from "../../context/BalanceContext";

// Move this outside so it's accessible in JSX
const getCurrencySymbol = (currencyCode) => {
  try {
    const formatted = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(1);

    return formatted.replace(/1/g, '').trim();
  } catch (err) {
    return currencyCode;
  }
};

function BalanceDisplay() {
  const { balance, currency, updateBalance } = useBalance();
  const [loading, setLoading] = useState(true);
  const [changeData, setChangeData] = useState({ 
    amount: 0, 
    percentage: "0.00", 
    direction: 'up' 
  });

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/account/balance`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch balance');
        
        const { data } = await response.json();
        updateBalance(data.balance);
        
        if (data.change) {
          setChangeData({
            amount: data.change.amount || 0,
            percentage: data.change.percentage || "0.00",
            direction: data.change.direction || 'up'
          });
        }
      } catch (err) {
        console.error('Balance fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 60000);
    return () => clearInterval(interval);
  }, [updateBalance]);

  if (loading) {
    return (
      <div className="flex flex-col max-w-full text-[10px] w-[156px]">
        <h2 className="text-stone-300">Current Balance</h2>
        <div className="h-8 mt-1.5 bg-neutral-700 rounded animate-pulse"></div>
        <div className="h-4 mt-1.5 bg-neutral-700 rounded animate-pulse w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-full text-[10px] w-[156px]">
      <h2 className="text-stone-300">Current Balance</h2>
      <div className="flex justify-center items-center mt-1.5 text-[28px] font-medium tracking-wide leading-tight whitespace-nowrap text-zinc-100">
        <p className="self-stretch my-auto">
          {getCurrencySymbol(currency)} {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>
      <div className="flex gap-2.5 items-start self-start mt-1.5">
        <div className={`flex gap-0.5 justify-center items-center ${changeData.direction === 'up' ? 'text-green-700' : 'text-red-600'}`}>
          <img
            src={changeData.direction === 'up' 
              ? "https://cdn.builder.io/api/v1/image/assets/TEMP/8618c649fa66b3ae7a6da6429776b793c56523f7c9f2ae8a586af42b5f9346cf?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              : "https://cdn.builder.io/api/v1/image/assets/TEMP/...down-arrow..."}
            className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
            alt="Trend icon"
          />
          <p className="self-stretch my-auto">
            {changeData.direction === 'up' ? '+' : '-'}{changeData.amount} ({changeData.direction === 'up' ? '+' : '-'}{changeData.percentage}%)
          </p>
        </div>
        <p className="font-semibold text-stone-300">Past Hour</p>
      </div>
    </div>
  );
}

export default BalanceDisplay;

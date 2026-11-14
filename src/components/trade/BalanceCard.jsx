import React, { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../../api/config";

function BalanceCard() {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setBalanceData(data);
      } catch (err) {
        console.error('Balance fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading || !balanceData) {
    return (
      <div className="flex flex-col max-w-full text-[10px] w-[156px]">
        <h2 className="text-stone-300">Current Balance</h2>
        <div className="h-8 mt-1.5 bg-neutral-700 rounded animate-pulse"></div>
        <div className="h-4 mt-1.5 bg-neutral-700 rounded animate-pulse w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#EB25C6] via-purple-500 to-[#FB9B4B]">
      <article className="flex overflow-hidden flex-col justify-center px-4 py-5 w-full rounded-3xl bg-[#1D1D1F]">
        <p className="self-start text-xs sm:text-base tracking-normal leading-none text-zinc-100">
          Current Balance
        </p>
        <div className="flex justify-between items-center mt-3 w-full font-medium leading-tight">
          <div className="flex flex-wrap gap-1 items-start">
            <div className="flex gap-1 items-center text-xl sm:text-2xl md:text-4xl tracking-wide text-zinc-100">
              <p>{balanceData.balance.toLocaleString('en-US', { minimumFractionDigits: 9 })}</p>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/70c54a492ef2cc51c02fd96eb404cf1be4a19214c0947459d4589fe00f397e54?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                className="w-4 sm:w-5 aspect-square object-contain"
                alt="Currency icon"
              />
            </div>
            <p className="text-xs sm:text-sm md:text-base tracking-normal text-zinc-100">
              {balanceData.currency}
            </p>
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/09c05d271823557758f21d3c94efbd95a21980027893227e9a300f35766cf9cf?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="w-8 sm:w-10 aspect-square rounded-full object-cover shrink-0"
            alt="Profile"
          />
        </div>
      </article>
    </div>
  );
}

export default BalanceCard;





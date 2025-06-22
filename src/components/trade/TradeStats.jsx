import React, { useEffect, useState } from "react";
import TotalTrades from "../../assets/totaltrade.svg";
import { useUserAuth } from "../../context/UserAuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../api/config";

function TradeStats() {
  const { token } = useUserAuth();
  const [stats, setStats] = useState({
    totalProfit: 0,
    totalAmount: 0,
    referralEarnings: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchTradeStats = async () => {
      try {
        const [profitRes, amountRes, referralRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/trading/total-profit`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/trading/total-amount`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/referrals/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setStats({
          totalProfit: profitRes.data.totalProfit || 0,
          totalAmount: amountRes.data.totalAmount || 0,
          referralEarnings: referralRes.data.totalEarned || 0,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.message || "Failed to fetch stats"
        }));
      }
    };

    if (token) {
      fetchTradeStats();
    }
  }, [token]);

  if (stats.loading) {
    return (
      <section className="flex flex-wrap items-center justify-between w-full font-medium text-xs sm:text-sm md:text-base">
        {/* Loading skeletons */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex flex-col justify-center items-center py-3 flex-1 min-w-0 border-r border-neutral-500 last:border-r-0">
            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-600 rounded mt-2 animate-pulse"></div>
          </div>
        ))}
      </section>
    );
  }

  if (stats.error) {
    return (
      <section className="flex items-center justify-center w-full py-4 text-red-400 text-sm">
        {stats.error}
      </section>
    );
  }

  return (
    <section className="flex flex-wrap items-center justify-between w-full font-medium text-xs sm:text-sm md:text-base">
      {/* Total Profit */}
      <div className="flex flex-col justify-center items-center py-3 flex-1 min-w-0 border-r border-neutral-500 last:border-r-0">
        <div className="flex flex-col items-center w-full">
          <div className="flex gap-2 items-center text-neutral-400">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ea68c22fffe7b37712490671b3a21002d2a32ac3eb9556751292048b9a74e585?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
              alt="Total Profit"
            />
            <p className="text-[10px] sm:text-xs md:text-sm truncate">Total Profit</p>
          </div>
          <p className="mt-2 text-center text-zinc-100 text-xs sm:text-sm md:text-base font-semibold">
            $ {stats.totalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Total Trades */}
      <div className="flex flex-col justify-center items-center py-3 flex-1 min-w-0 border-r border-neutral-500 last:border-r-0">
        <div className="flex flex-col items-center w-full">
          <div className="flex gap-2 items-center text-neutral-400">
            <img
              src={TotalTrades}
              className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
              alt="Total Trades"
            />
            <p className="text-[10px] sm:text-xs md:text-sm truncate">Total Trades</p>
          </div>
          <p className="mt-2 text-center text-zinc-100 text-xs sm:text-sm md:text-base font-semibold">
            $ {stats.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Referrals */}
      <div className="flex flex-col justify-center items-center py-3 flex-1 min-w-0 last:border-r-0">
        <div className="flex flex-col items-center w-full">
          <div className="flex gap-2 items-center text-neutral-400">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/51f27aa564831ec47152be0017d4bedf1ed1be24e773295809ce8f681453c969?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
              alt="Referrals"
            />
            <p className="text-[10px] sm:text-xs md:text-sm truncate">Referral Earnings</p>
          </div>
          <p className="mt-2 text-center text-zinc-100 text-xs sm:text-sm md:text-base font-semibold">
            $ {stats.referralEarnings.toFixed(2)}
          </p>
        </div>
      </div>
    </section>
  );
}

export default TradeStats;
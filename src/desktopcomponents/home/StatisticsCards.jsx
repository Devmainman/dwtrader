import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../api/config";

function StatisticsCards() {
  const { token } = useUserAuth();
  const [stats, setStats] = useState({
    totalProfit: 0,
    totalAmount: 0,
    referralEarnings: 0,
    loading: true,
    error: null,
  });
  const [userCurrency, setUserCurrency] = useState("NGN"); // Default fallback

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [profitRes, amountRes, referralRes, userRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/trading/total-profit`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/trading/total-amount`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/referrals/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/verification/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserCurrency(userRes?.data?.currency || "NGN");

        setStats({
          totalProfit: profitRes.data.totalProfit || 0,
          totalAmount: amountRes.data.totalAmount || 0,
          referralEarnings: referralRes.data.totalEarned || 0,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load statistics",
        }));
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  const formatAmount = (value) => {
    return new Intl.NumberFormat(undefined, {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (stats.loading) {
    return (
      <div className="flex flex-wrap gap-4 w-full animate-pulse">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 p-5 rounded-xl border border-neutral-600 bg-[var(--card)] text-white flex-1 min-w-[280px] max-w-full"
          >
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-neutral-700 rounded-full"></div>
              <div className="h-4 w-20 bg-neutral-700 rounded"></div>
            </div>
            <div className="h-8 w-28 bg-neutral-600 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="w-full text-red-500 text-sm py-4 text-center">
        {stats.error}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 w-full">
      <StatCard
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/1595fd46c36b0c2f05154fb6cbb36c4c661d61587f264240a8ba1ecea076f1e9?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        title="Total Profit"
        amount={formatAmount(stats.totalProfit)}
        currency={userCurrency}
        percentage="10.4%"
        status="Growth"
      />
      <StatCard
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/cd47d48371af2f914a2297b9cc031960a5e49690d45c86ad003c899fec2bef99?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        title="Total Trade"
        amount={formatAmount(stats.totalAmount)}
        currency={userCurrency}
        percentage="10.4%"
        status="Growth"
      />
      <StatCard
        icon="https://cdn.builder.io/api/v1/image/assets/TEMP/2045349417021670dee98097328a0e9a608a5b20426f5f5319bcd3c90e6d468c?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        title="Referrals"
        amount={formatAmount(stats.referralEarnings)}
        currency={userCurrency}
        percentage="10.4%"
        status="Growth"
      />
    </div>
  );
}

function StatCard({ icon, title, amount, currency, percentage, status }) {
  return (
    <article className="flex flex-col justify-between gap-4 p-5 rounded-xl border border-neutral-600 bg-[var(--card)] text-white flex-1 min-w-[280px] max-w-full">
      <div className="flex gap-3 items-center">
        <img src={icon} alt={title} className="w-10 h-10 object-contain" />
        <span className="text-base font-medium text-stone-300">{title}</span>
      </div>
      <div className="flex justify-between items-end">
        <div className="text-3xl font-semibold text-zinc-100">
          {amount} <span className="text-base text-stone-300">{currency}</span>
        </div>
        <div className="text-right">
          <div className="bg-neutral-800 rounded-3xl text-xs p-1 px-3">
            {percentage}
          </div>
          <div className="mt-1 text-xs font-bold text-green-600">{status}</div>
        </div>
      </div>
    </article>
  );
}

export default StatisticsCards;

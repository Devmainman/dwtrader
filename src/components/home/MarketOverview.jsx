"use client";
import React, { useEffect, useState } from "react";
import CryptoCard from "./CryptoCard";
import axios from "axios";
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL } from "../../api/config";

function MarketOverview() {
  const { token } = useUserAuth();
  const [signalStrength, setSignalStrength] = useState(0);

  const cryptoData = [
    { symbol: "BTC", change: "+0.95%", price: "NGN 91.212.61", isPositive: true },
    { symbol: "ETH", change: "+0.95%", price: "NGN 91.212.61", isPositive: false },
    { symbol: "BWB", change: "+0.95%", price: "NGN 91.212.61", isPositive: true },
  ];

  useEffect(() => {
    const fetchSignalStrength = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/account/signal-strength`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSignalStrength(res.data.signalStrength || 0);
      } catch (err) {
        console.error("Failed to fetch signal strength:", err);
      }
    };

    if (token) fetchSignalStrength();
  }, [token]);

  return (
    <section className="overflow-hidden px-4 py-4 mt-6 w-full rounded-xl bg-[#1D1D1F]">
      <div className="w-full max-w-full">
        {/* Header */}
        <div className="flex items-center w-full text-sm sm:text-base font-medium tracking-normal leading-tight text-zinc-100">
          <h2 className="flex-1 shrink self-stretch my-auto basis-0">Market Overview</h2>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4f29bb5fdb59afdeebe8eb2f7dbdce570d858c4d7fca74a16cbd8af02a6a2de0?placeholderIfAbsent=true"
            className="object-contain shrink-0 self-stretch my-auto w-4 h-4"
            alt="Arrow icon"
          />
        </div>

        {/* Signal Bar */}
        <div className="flex gap-1 items-center mt-2 w-full">
          <div className="w-full">
            <div className="flex justify-between text-[8px] sm:text-sm text-neutral-400">
              <p>Signal strength</p>
              <p className="text-yellow-700">{signalStrength}%</p>
            </div>
            <div className="w-full mt-0.5 bg-zinc-100 h-1.5 rounded-none rounded-br-md">
              <div
                className="h-full bg-yellow-700 rounded-none rounded-br-md"
                style={{ width: `${Math.min(signalStrength, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Crypto Cards */}
      <div className="mt-2.5 font-medium leading-tight overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {cryptoData.map((crypto, index) => (
            <CryptoCard
              key={index}
              symbol={crypto.symbol}
              change={crypto.change}
              price={crypto.price}
              isPositive={crypto.isPositive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MarketOverview;

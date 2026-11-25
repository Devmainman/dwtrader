"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL } from "../../api/config";

function MarketOverview() {
  const { token, user } = useUserAuth();

  const [signalStrength, setSignalStrength] = useState(0);
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState("USD");

  const cryptoSymbols = ["BTC", "ETH", "BWB"];

  /* ================= USER CURRENCY ================= */
  useEffect(() => {
    const fetchUserCurrency = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return;

        const response = await fetch(`${API_BASE_URL}/account/balance`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const { data } = await response.json();
          setUserCurrency(data.currency || "USD");
        }
      } catch (err) {
        console.error("Failed to fetch user currency:", err);
        if (user?.currency) setUserCurrency(user.currency);
      }
    };

    fetchUserCurrency();
  }, [user]);

  /* ================= SIGNAL + PRICES ================= */
  useEffect(() => {
    const fetchSignalStrength = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/account/signal-strength`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSignalStrength(res.data.signalStrength || 0);
      } catch (err) {
        console.error("Failed to fetch signal strength:", err);
      }
    };

    const getCurrencySymbol = (currency) => {
      const symbols = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        NGN: "₦",
        JPY: "¥",
        KRW: "₩",
        INR: "₹",
        CAD: "C$",
        AUD: "A$",
      };
      return symbols[currency.toUpperCase()] || currency;
    };

    const formatPrice = (price, currency) => {
      if (["jpy", "krw", "vnd"].includes(currency.toLowerCase())) {
        return `${getCurrencySymbol(currency)} ${Math.round(
          price
        ).toLocaleString()}`;
      }
      return `${getCurrencySymbol(currency)} ${price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };

    const fetchCryptoPrices = async () => {
      try {
        setLoading(true);
        const currencyCode = userCurrency.toLowerCase();

        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=${currencyCode}&include_24hr_change=true`
        );

        const formatted = cryptoSymbols.map((symbol) => {
          let price = 0;
          let change = 0;

          if (symbol === "BTC") {
            price = response.data.bitcoin?.[currencyCode] || 0;
            change =
              response.data.bitcoin?.[`${currencyCode}_24h_change`] || 0;
          } else if (symbol === "ETH") {
            price = response.data.ethereum?.[currencyCode] || 0;
            change =
              response.data.ethereum?.[`${currencyCode}_24h_change`] || 0;
          } else if (symbol === "BWB") {
            const btcPrice = response.data.bitcoin?.[currencyCode] || 0;
            price = btcPrice * 0.00001; // placeholder
            change = 0;
          }

          return {
            symbol,
            price: formatPrice(price, userCurrency),
            change: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
            isPositive: change >= 0,
          };
        });

        setCryptoData(formatted);
      } catch (err) {
        console.error("Failed to fetch crypto prices:", err);
        setCryptoData([
          {
            symbol: "BTC",
            change: "+1.25%",
            price: `${userCurrency} --`,
            isPositive: true,
          },
          {
            symbol: "ETH",
            change: "-0.45%",
            price: `${userCurrency} --`,
            isPositive: false,
          },
          {
            symbol: "BWB",
            change: "+0.00%",
            price: `${userCurrency} --`,
            isPositive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchSignalStrength();
    if (userCurrency) {
      fetchCryptoPrices();
      const interval = setInterval(fetchCryptoPrices, 30000);
      return () => clearInterval(interval);
    }
  }, [token, userCurrency]);

  /* ================= UI (UNCHANGED) ================= */
  return (
    <section className="overflow-hidden px-3 py-4 w-full rounded-xl bg-[var(--card)]">
      <div className="w-full">
        <div className="flex items-center w-full text-[14px] font-medium tracking-normal leading-tight text-zinc-100">
          <h3 className="flex-1 shrink self-stretch my-auto basis-0">
            Market Overview
          </h3>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/12dc4eedc48b993f32f163c0ad22764b45352e46eb89749af2d772985ad77f4c?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            alt="More options"
            className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
          />
        </div>

        <div className="flex gap-0.5 items-center mt-2.5 w-full">
          <div className="flex-1 shrink self-stretch my-auto w-full basis-0 min-w-60">
            <div className="flex gap-0.5 items-start w-full">
              <div className="flex-1 shrink text-[8px] leading-tight basis-0 text-neutral-400">
                Signal strength
              </div>
              <div className="text-[8px] text-yellow-700">
                {signalStrength}%
              </div>
            </div>
            <div className="flex overflow-hidden flex-col items-start w-full rounded-none bg-zinc-100">
              <div
                className="flex shrink-0 h-1.5 bg-yellow-700 rounded-none"
                style={{ width: `${Math.min(signalStrength, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 items-center mt-2.5 w-full font-medium leading-tight">
        {loading
          ? cryptoSymbols.map((symbol) => (
              <CryptoCard
                key={symbol}
                symbol={symbol}
                change="Loading..."
                price={`${userCurrency} --`}
                isPositive
              />
            ))
          : cryptoData.map((item, idx) => (
              <CryptoCard key={idx} {...item} />
            ))}
      </div>
    </section>
  );
}

/* ================= CARD (UNCHANGED) ================= */
function CryptoCard({ symbol, change, price, isPositive }) {
  return (
    <div className="flex overflow-hidden flex-col justify-center self-stretch px-2.5 py-2 my-auto rounded-md bg-neutral-800 w-[113px]">
      <div className="flex flex-col w-full">
        <div className="flex gap-1.5 items-center self-start whitespace-nowrap">
          <div className="self-stretch my-auto text-[14px] tracking-normal text-zinc-100">
            {symbol}
          </div>
          <div
            className={`self-stretch my-auto text-[8px] ${
              isPositive ? "text-green-700" : "text-red-600"
            }`}
          >
            {change}
          </div>
        </div>
        <div className="mt-1 text-[8px] text-neutral-600">{price}</div>
      </div>
    </div>
  );
}

export default MarketOverview;

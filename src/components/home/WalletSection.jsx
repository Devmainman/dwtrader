"use client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import receive from "../../assets/game-icons_receive-money.svg";
import gift from "../../assets/gift.svg";
import userAdd from "../../assets/user-add.svg";
import { API_BASE_URL } from "../../api/config";

function WalletSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/account/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch balance");

      const { data } = await res.json();
      setBalanceData(data);
      setSelectedCurrency(data.currency); // track active currency
    } catch (err) {
      console.error("Balance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const res = await fetch(`${API_BASE_URL}/users/currencies`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      const json = await res.json();
  
      if (!json?.data || !Array.isArray(json.data)) {
        setCurrencies([]);
        return;
      }
  
      setCurrencies(json.data);
    } catch (err) {
      console.error("Currency fetch error:", err);
      setCurrencies([]);
    }
  };
  
  

  const updateCurrency = async (currencyCode) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const res = await fetch(`${API_BASE_URL}/users/preferences`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currency: currencyCode }),
      });
  
      if (!res.ok) throw new Error("Failed to update currency");
  
      // Wait for backend to apply change before fetching updated balance
      await new Promise(resolve => setTimeout(resolve, 300)); // small delay
  
      setSelectedCurrency(currencyCode);
      setShowCurrencyDropdown(false);
  
      await fetchBalance(); // ensure updated currency balance is fetched
    } catch (err) {
      console.error("Currency update error:", err);
    }
  };
  

  const getCurrencySymbol = (currencyCode) => {
    try {
      const formatted = new Intl.NumberFormat('en', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(1);
  
      // Extract symbol by removing the "1" from the formatted string
      return formatted.replace(/1/g, '').trim();
    } catch (err) {
      return currencyCode; // fallback
    }
  };
  

  useEffect(() => {
    getCurrencySymbol();
    fetchBalance();
    fetchCurrencies();
    const interval = setInterval(fetchBalance, 60000);
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
  
  // ✅ Compute balance here:
  const computedBalance =
    balanceData?.rawBalance && balanceData?.rate
      ? balanceData.rawBalance * balanceData.rate
      : balanceData?.balance ?? 0;
  

  const buttons = [
    { title: "My Wallet", icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/dcd09ccda7422eb1961e4dd5192988764591da463acc92bc3c2a51b77bbf01b0?placeholderIfAbsent=true" },
    { title: "Reward", icon: gift },
    { title: "Refer2Earn", icon: userAdd },
    { title: "Receive", icon: receive },
  ];

  return (
    <section className="w-full relative">
      <div className="flex overflow-x-auto items-center text-[clamp(0.625rem,1vw,0.75rem)] text-stone-300 gap-2 w-full px-2 whitespace-nowrap hide-scrollbar hover:scrollbar-thin hover:scrollbar-thumb-neutral-700 hover:scrollbar-track-transparent">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`flex items-center gap-1 px-2 py-1 flex-shrink-0 whitespace-nowrap rounded-3xl border-2 border-solid 
              ${activeIndex === index ? "border-[#242426]" : "border-neutral-800"} 
              ${activeIndex === index ? "min-w- md:min-w-[160px]" : "sm:min-w-full md:min-w-"} 
              transition-all duration-300 ease-in-out max-w-fit`}
          >
            <img src={btn.icon} className="object-contain w-4 h-4 rounded-full" alt={`${btn.title} icon`} />
            <span className="text-center">{btn.title}</span>
            {activeIndex === index && (
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b709d68c4907d194d0fea4be3a83f2b9ab9df95150216f7881181d4183b92cca?placeholderIfAbsent=true"
                className="object-contain w-3.5 h-3.5"
                alt="Dropdown arrow"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col justify-center mt-3 w-full">
        <p className="text-left text-[clamp(0.625rem,1vw,0.75rem)] text-stone-300">Current Balance</p>

        <div className="flex justify-between items-center mt-3 w-full whitespace-nowrap">
          <div className="flex gap-1 items-center text-[clamp(1.75rem,4vw,2rem)] font-medium tracking-wide leading-tight text-zinc-100 relative">
            <div className="flex items-center cursor-pointer" onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}>
            <span className="text-xl font-bold">
            {getCurrencySymbol(selectedCurrency)}
            </span>

            <span className="ml-1">
              {balanceData.balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>

              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/70c54a492ef2cc51c02fd96eb404cf1be4a19214c0947459d4589fe00f397e54?placeholderIfAbsent=true"
                className="object-contain w-5 aspect-square ml-2"
                alt="Dropdown icon"
              />
            </div>

            {showCurrencyDropdown && (
              <div className="absolute top-full mt-2 z-10 bg-neutral-900 border border-neutral-800 rounded-md shadow-lg max-h-40 overflow-y-auto w-40">
                {currencies.map((cur) => (
                  <button
                    key={cur.code}
                    onClick={() => updateCurrency(cur.code)}
                    className="block w-full text-left px-3 py-1.5 text-sm hover:bg-neutral-700 text-zinc-100"
                  >
                    {cur.code} - {cur.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/deposite"
            className="p-2 text-[clamp(0.625rem,1vw,0.75rem)] tracking-normal leading-none text-center bg-blue-600 rounded-3xl text-zinc-100 w-[86px]"
          >
            Deposit
          </Link>
        </div>
      </div>
    </section>
  );
}

export default WalletSection;

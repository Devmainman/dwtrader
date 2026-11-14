"use client";
import React, { useEffect, useState } from "react";
import CryptoCard from "./CryptoCard";
import axios from "axios";
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL } from "../../api/config";

function MarketOverview() {
  const { token, user } = useUserAuth();
  const [signalStrength, setSignalStrength] = useState(0);
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState("USD");

  // Define the cryptocurrencies we want to track
  const cryptoSymbols = ["BTC", "ETH", "BWB"];

  useEffect(() => {
    // Fetch user's currency preference from backend
    const fetchUserCurrency = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/account/balance`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const { data } = await response.json();
          setUserCurrency(data.currency || "USD");
        }
      } catch (err) {
        console.error('Failed to fetch user currency:', err);
        // Fallback: check user object from auth context
        if (user?.currency) {
          setUserCurrency(user.currency);
        }
      }
    };

    fetchUserCurrency();
  }, [user]);

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

    const fetchCryptoPrices = async () => {
      try {
        setLoading(true);
        
        // Convert user currency to lowercase for CoinGecko API
        const currencyCode = userCurrency.toLowerCase();
        
        // Using CoinGecko API with user's currency
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=${currencyCode}&include_24hr_change=true`
        );
        
        // Helper function to format price with proper currency display
        const formatPrice = (price, currency) => {
          // Format based on currency type
          if (['jpy', 'krw', 'vnd'].includes(currency.toLowerCase())) {
            // Currencies without decimals
            return `${getCurrencySymbol(currency)} ${Math.round(price).toLocaleString()}`;
          } else {
            // Standard formatting
            return `${getCurrencySymbol(currency)} ${price.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`;
          }
        };
        
        // Get currency symbol for display
        const getCurrencySymbol = (currency) => {
          const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'NGN': '₦',
            'JPY': '¥',
            'KRW': '₩',
            'INR': '₹',
            'CAD': 'C$',
            'AUD': 'A$',
          };
          return symbols[currency.toUpperCase()] || currency;
        };
        
        // Map the response to your format
        const formattedData = cryptoSymbols.map(symbol => {
          let price = 0;
          let change = 0;
          let isPositive = true;
          
          if (symbol === "BTC") {
            price = response.data.bitcoin?.[currencyCode] || 0;
            change = response.data.bitcoin?.[`${currencyCode}_24h_change`] || 0;
          } else if (symbol === "ETH") {
            price = response.data.ethereum?.[currencyCode] || 0;
            change = response.data.ethereum?.[`${currencyCode}_24h_change`] || 0;
          } else if (symbol === "BWB") {
            // BWB might need a different API - for now use USD price and convert
            // You might want to implement a separate API call for BWB
            const btcPrice = response.data.bitcoin?.[currencyCode] || 0;
            price = btcPrice * 0.00001; // Placeholder: BWB at 0.001% of BTC
            change = 0;
          }
          
          isPositive = change >= 0;
          
          return {
            symbol,
            change: `${isPositive ? '+' : ''}${change.toFixed(2)}%`,
            price: formatPrice(price, userCurrency),
            isPositive
          };
        });
        
        setCryptoData(formattedData);
        
      } catch (err) {
        console.error("Failed to fetch crypto prices:", err);
        
        // Fallback with user's currency
        const getCurrencySymbol = (currency) => {
          const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'NGN': '₦',
            'JPY': '¥',
          };
          return symbols[currency.toUpperCase()] || currency;
        };
        
        const fallbackData = [
          { 
            symbol: "BTC", 
            change: "+1.25%", 
            price: `${getCurrencySymbol(userCurrency)} 52,847.62`, 
            isPositive: true 
          },
          { 
            symbol: "ETH", 
            change: "-0.45%", 
            price: `${getCurrencySymbol(userCurrency)} 2,815.37`, 
            isPositive: false 
          },
          { 
            symbol: "BWB", 
            change: "+3.15%", 
            price: `${getCurrencySymbol(userCurrency)} 0.85`, 
            isPositive: true 
          },
        ];
        setCryptoData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSignalStrength();
    }
    
    if (userCurrency) {
      fetchCryptoPrices();
      
      // Set up interval to refresh prices every 30 seconds
      const intervalId = setInterval(fetchCryptoPrices, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [token, userCurrency]);

  return (
    <section className="overflow-hidden px-4 py-4 mt-6 w-full rounded-xl bg-[#1D1D1F] lg:mt-0 lg:rounded-2xl lg:p-5 lg:border lg:border-white/5 lg:flex lg:flex-col lg:justify-between">
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
          {loading ? (
            // Show loading state with user's currency
            cryptoSymbols.map((symbol, index) => (
              <div key={index} className="animate-pulse">
                <CryptoCard
                  symbol={symbol}
                  change="Loading..."
                  price={`${userCurrency} --`}
                  isPositive={true}
                />
              </div>
            ))
          ) : (
            // Show actual data
            cryptoData.map((crypto, index) => (
              <CryptoCard
                key={index}
                symbol={crypto.symbol}
                change={crypto.change}
                price={crypto.price}
                isPositive={crypto.isPositive}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default MarketOverview;
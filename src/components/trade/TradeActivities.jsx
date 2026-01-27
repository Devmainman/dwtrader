"use client";
import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import TradeCard from "./TradeCard";
import VerticalLineWithCircles from "./VerticalLineWithCircles";
import { API_BASE_URL } from "../../api/config";

function TradeActivities() {
  const [entriesToShow, setEntriesToShow] = useState(4);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTradeIndex, setActiveTradeIndex] = useState(0);

  useEffect(() => {
    const fetchTradeActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication required");

        const response = await fetch(`${API_BASE_URL}/trading/activities`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch trade activities");

        const data = await response.json();
        setTrades(data.trades || []);

        const firstActiveIndex = data.trades.findIndex((trade) => trade.active);
        setActiveTradeIndex(firstActiveIndex >= 0 ? firstActiveIndex : 0);
      } catch (err) {
        console.error("Trade activities error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTradeActivities();
  }, []);

  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTradeCardClick = (index) => {
    setActiveTradeIndex(index);
  };

  const formatCurrency = (amount, currency) => {
    // Fallback to USD if currency is not provided or invalid
    const currencyCode = currency && currency.length === 3 ? currency.toUpperCase() : 'USD';
    
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (err) {
      // If currency code is still invalid, fall back to a simple format
      console.error('Currency formatting error:', err);
      return `${currencyCode} ${parseFloat(amount).toFixed(2)}`;
    }
  };

  if (loading) {
    return (
      <section className="flex flex-col gap-4 justify-center items-center px-4 py-5 w-full rounded-3xl bg-[#1D1D1F] max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1229px] overflow-hidden">
        <div className="w-full flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full px-3 py-3 rounded-xl bg-neutral-800 animate-pulse h-20" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-4 justify-center items-center px-4 py-5 w-full rounded-3xl bg-[#1D1D1F] max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1229px] overflow-hidden">
        <div className="text-red-500 text-sm">{error}</div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 justify-center items-center px-4 py-5 w-full rounded-3xl bg-[#1D1D1F] max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1229px] overflow-hidden">
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center w-full gap-4">
          <h2 className="text-sm md:text-base font-medium tracking-normal leading-tight text-zinc-100">
            Trade Activities
          </h2>
          <div className="flex gap-1.5 items-center text-[10px] text-neutral-400">
            <p>Show</p>
            <div className="flex gap-1.5 justify-center items-center px-2 py-1 text-xs bg-blue-600 rounded text-white">
              <p>{entriesToShow}</p>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e926b0db0c5d6dece24ceafbd4b776a9a722214ee95b2291c6a2aaecdc523409?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                className="object-contain w-3.5 h-3.5"
                alt="Dropdown arrow"
              />
            </div>
            <p>entries</p>
          </div>
        </div>

        {/* Date */}
        <div className="mt-4">
          <p className="text-xs text-neutral-400">{formatDate(selectedDate)}</p>
          <p className="mt-2 text-sm text-stone-300">
            {selectedDate.toDateString() === new Date().toDateString() ? 'Today' : 'Selected Day'}
          </p>
        </div>

        {/* Calendar */}
        <div className="mt-4 w-full overflow-x-auto">
          <Calendar 
            selectedDate={selectedDate} 
            onDateSelect={handleDateSelect} 
          />
        </div>

        {/* Timeline */}
        {trades.length > 0 ? (
          <div className="mt-5 flex gap-3 w-full">
            <div className="flex-shrink-0">
              <VerticalLineWithCircles 
                activeIndex={activeTradeIndex} 
                totalCircles={Math.min(entriesToShow, trades.length)} 
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              {trades.slice(0, entriesToShow).map((trade, index) => {
                // Ensure trade object has required properties with defaults
                const safeTrade = {
                  id: trade.id || `trade-${index}`,
                  status: trade.status || 'pending',
                  progress: trade.progress || 0,
                  name: trade.name || 'Unnamed Trade',
                  date: trade.date || new Date().toISOString(),
                  amount: trade.amount || 0,
                  currency: trade.currency || 'USD',
                  profit: trade.profit || 0
                };

                return (
                  <div 
                    key={safeTrade.id} 
                    onClick={() => handleTradeCardClick(index)}
                    className="cursor-pointer"
                  >
                    <TradeCard 
                      status={safeTrade.status}
                      progress={safeTrade.progress}
                      isActive={index === activeTradeIndex}
                      tradeName={safeTrade.name}
                      tradeDate={safeTrade.date}
                      tradeAmount={formatCurrency(safeTrade.amount, safeTrade.currency)}
                      profitReturns={formatCurrency(safeTrade.profit, safeTrade.currency)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-4 text-center text-neutral-400 text-sm">
            No trade activities found
          </div>
        )}

        {/* Footer */}
        {trades.length > entriesToShow && (
          <p className="mt-4 text-sm text-center text-blue-600">
            Showing {entriesToShow} of {trades.length} trades
          </p>
        )}
      </div>
    </section>
  );
}

export default TradeActivities;
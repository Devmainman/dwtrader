"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUserAuth } from '../../context/UserAuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';

function TradingPackage() {
  const { user, token } = useUserAuth();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [amount, setAmount] = useState("");
  const [tradeType, setTradeType] = useState("Buy/Long");
  const [loading, setLoading] = useState(false);
  const [fetchingPackages, setFetchingPackages] = useState(true);
  
  // Consolidated Dropdown State: 'package', 'tradeType', 'duration', or null
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Duration options (can be fetched from API or defined here)
   
  const [selectedDuration, setSelectedDuration] = useState(null);
  
  const containerRef = useRef(null);

  // Fetch available packages
  useEffect(() => {
    if (token) fetchPackages();
  }, [token]);

  // Unified Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPackages = async () => {
    try {
      setFetchingPackages(true);
      const response = await axios.get(`${API_BASE_URL}/user-trades/packages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const packagesData = response.data.packages;
        setPackages(packagesData);
        
        
        
        // DO NOT auto-select first package - let user choose
        // setSelectedPackage(packagesData[0]);
        // setSelectedDuration(packagesData[0]?.duration);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setFetchingPackages(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleTrade = async () => {
    if (!selectedPackage || !amount || parseFloat(amount) === 0) {
      alert("Please select a package and enter amount");
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum < selectedPackage.minAmount || amountNum > selectedPackage.maxAmount) {
      alert(`Amount must be between ${selectedPackage.minAmount} and ${selectedPackage.maxAmount}`);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user-trades/create`,
        {
          packageId: selectedPackage.id,
          amount: amountNum,
          duration: selectedDuration || selectedPackage.duration,
          type: tradeType
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Trade created successfully!");
        setAmount("");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create trade.");
    } finally {
      setLoading(false);
    }
  };

  // Handle package selection
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setSelectedDuration(pkg.duration);
    setOpenDropdown(null);
  };

  const ICON_DROPDOWN = "https://cdn.builder.io/api/v1/image/assets/TEMP/ca387fb10bcfc33fffcf6905fbc9e1feac1c3e02413c04ee641f2748544d5264?placeholderIfAbsent=true";

  return (
    <section ref={containerRef} className="dash-panel !overflow-visible p-4 w-full relative lg:p-5">
      <div className="w-full whitespace-nowrap">
        <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-100 mb-2.5">
          Package
        </h2>

        {/* First Row: Package Selection & Trade Type */}
        <div className="flex gap-3 justify-between items-center w-full text-[12px]">
          
          {/* PACKAGE DROPDOWN */}
          <div className="relative flex-1">
            <div
              className="flex justify-between items-center px-3 py-2.5 rounded-xl border bg-[var(--card-2)] border-white/10 cursor-pointer hover:border-neutral-500 transition-colors"
              onClick={() => setOpenDropdown(openDropdown === 'package' ? null : 'package')}
            >
              <div className="text-white truncate">
                {selectedPackage ? selectedPackage.name : "Select Package"}
              </div>
              <img src={ICON_DROPDOWN} className={`mode-icon w-4 transition-transform ${openDropdown === 'package' ? 'rotate-180' : ''}`} alt="arrow" />
            </div>

            {openDropdown === 'package' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-white/10 rounded-lg z-[100] shadow-2xl max-h-48 overflow-y-auto">
                {packages.length > 0 ? (
                  packages.map(pkg => (
                    <div
                      key={pkg.id}
                      className="px-3 py-3 text-white hover:bg-neutral-800 cursor-pointer border-b border-neutral-800 last:border-0"
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      <div className="font-medium">{pkg.name}</div>
                      <div className="text-[10px] text-neutral-400">
Min: {pkg.minAmount} {user?.currency} | Max: {pkg.maxAmount} {user?.currency}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-3 text-neutral-400 text-center">
                    No packages available
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TRADE TYPE DROPDOWN */}
          <div className="relative min-w-[140px]">
            <div
              className="flex gap-2.5 items-center p-2.5 rounded-xl border border-solid bg-[var(--card-2)] border-white/10 cursor-pointer hover:border-neutral-500 transition-colors"
              onClick={() => setOpenDropdown(openDropdown === 'tradeType' ? null : 'tradeType')}
            >
              <img src={ICON_DROPDOWN} className="mode-icon w-3.5 aspect-square" alt="dropdown" />
              <span className="text-neutral-300">{tradeType}</span>
            </div>

            {openDropdown === 'tradeType' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-white/10 rounded-lg z-[100] shadow-2xl">
                {["Buy/Long", "Sell/Short"].map(type => (
                  <div 
                    key={type}
                    className="px-3 py-2.5 text-white hover:bg-neutral-800 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setTradeType(type);
                      setOpenDropdown(null);
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row: Amount + Duration */}
      <div className="flex gap-4 justify-between items-end mt-4">
        {/* Amount Input */}
        <div className="flex-1">
          <label className="text-[11px] text-neutral-400 block mb-1.5">
            Amount {selectedPackage ? `(${user?.currency
})` : ""}
          </label>
          <input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={handleAmountChange}
            className="px-3 py-2.5 w-full text-[12px] rounded-xl border border-solid bg-[var(--card-2)] border-white/10 text-neutral-300 focus:border-neutral-500 outline-none transition-colors"
            disabled={!selectedPackage}
          />
          {selectedPackage && (
            <div className="text-[10px] text-neutral-400 mt-1">
              Min: {selectedPackage.minAmount} {user?.currency
} | Max: {selectedPackage.maxAmount} {user?.currency
}
            </div>
          )}
        </div>

        {/* Duration Dropdown */}
        <div className="flex-1">
          <label className="text-[11px] text-neutral-400 block mb-1.5">
            Duration
          </label>
          <div className="relative">
            <div
              className="flex gap-2.5 items-center p-2.5 w-full text-[12px] rounded-xl border border-solid bg-[var(--card-2)] border-white/10 text-neutral-300 min-h-[38px] cursor-pointer hover:border-neutral-500 transition-colors"
              onClick={() => selectedPackage && setOpenDropdown(openDropdown === 'duration' ? null : 'duration')}
              style={{ 
                cursor: selectedPackage ? 'pointer' : 'not-allowed',
                opacity: selectedPackage ? 1 : 0.5
              }}
            >
              <img src={ICON_DROPDOWN} className="mode-icon w-3.5" alt="clock" />
              <span>
                {selectedDuration
                  ? `${selectedDuration} hours`
                  : selectedPackage
                  ? `${selectedPackage.duration} hours`
                  : "---"}
              </span>
            </div>

            {openDropdown === 'duration' && selectedPackage && getDurationOptions().length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--card)] border border-white/10 rounded-lg z-[100] shadow-2xl">
                {durations.map(duration => (
                  <div 
                    key={duration}
                    className="px-3 py-2.5 text-white hover:bg-neutral-800 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setSelectedDuration(duration);
                      setOpenDropdown(null);
                    }}
                  >
                    {duration} hours
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleTrade}
        disabled={loading || !selectedPackage || !amount || fetchingPackages}
        className={`mt-5 px-2.5 py-3 w-full text-[13px] font-semibold rounded-2xl min-h-[44px] transition-all active:scale-[0.98] ${
          loading || !selectedPackage || !amount || fetchingPackages
            ? 'bg-white/[.06] text-neutral-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-500'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Processing...
          </span>
        ) : (
          'Trade Now'
        )}
      </button>
    </section>
  );
}

export default TradingPackage;
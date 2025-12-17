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
  const [loading, setLoading] = useState(false);
  const [fetchingPackages, setFetchingPackages] = useState(true);
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const [showBuyDropdown, setShowBuyDropdown] = useState(false);

  const packageDropdownRef = useRef(null);
  const buyDropdownRef = useRef(null);

  // Fetch available packages
  useEffect(() => {
    if (token) {
      fetchPackages();
    }
  }, [token]);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      packageDropdownRef.current &&
      !packageDropdownRef.current.contains(event.target)
    ) {
      setShowPackageDropdown(false);
    }

    if (
      buyDropdownRef.current &&
      !buyDropdownRef.current.contains(event.target)
    ) {
      setShowBuyDropdown(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);



  const fetchPackages = async () => {
    try {
      setFetchingPackages(true);
      const response = await axios.get(`${API_BASE_URL}/user-trades/packages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPackages(response.data.packages);
        if (response.data.packages.length > 0) {
          setSelectedPackage(response.data.packages[0]);
        }
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
    if (!selectedPackage) {
      alert("Please select a package");
      return;
    }

    if (!amount || parseFloat(amount) === 0) {
      alert("Please enter an amount");
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum < selectedPackage.minAmount) {
      alert(`Minimum amount is ${selectedPackage.currency} ${selectedPackage.minAmount}`);
      return;
    }

    if (amountNum > selectedPackage.maxAmount) {
      alert(`Maximum amount is ${selectedPackage.currency} ${selectedPackage.maxAmount}`);
      return;
    }

    if (!user?.tradingEnabled) {
      alert("Trading is not enabled for your account. Please contact support.");
      return;
    }

    if (user?.status === 'Inactive') {
      alert("Your account is inactive. Please contact support.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user-trades/create`,
        {
          packageId: selectedPackage.id,
          amount: amountNum,
          duration: selectedPackage.duration
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert("Trade created successfully!");
        setAmount("");
      }
    } catch (error) {
      console.error("Trade error:", error);
      alert(error.response?.data?.message || "Failed to create trade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-visible px-3.5 py-4 mt-7 w-full rounded-xl bg-black bg-opacity-80 max-w-[480px]">
      <div className="w-full whitespace-nowrap">
        <h2 className="text-[clamp(11px,2vw,14px)] tracking-normal leading-tight text-zinc-100">
          Package
        </h2>

        {/* First Row: Features & Buy/Long */}
        <div className="flex gap-3 justify-between items-center mt-1 w-full overflow-x-auto no-scrollbar text-[clamp(10px,2.5vw,13px)] hide-scrollbar hover:scrollbar-thin hover:scrollbar-thumb-neutral-700 hover:scrollbar-track-transparent">
          {/* PACKAGE DROPDOWN - EXACTLY FROM WORKING CODE */}
          <div
    className="flex gap-10 justify-between items-center px-2 py-2.5 rounded-lg border bg-neutral-900 border-neutral-600 cursor-pointer"
    onClick={(e) => {
      e.stopPropagation();
      setShowPackageDropdown(prev => !prev);
    }}
  >
    <div className="text-white w-[90px] truncate">
      {selectedPackage
        ? `${selectedPackage.name}`
        : "Select Package"}
    </div>
    <img src="..." className="w-4" />
  </div>

  {/* DROPDOWN MENU */}
  {showPackageDropdown && (
    <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-900 border border-neutral-600 rounded-lg z-50">
      {packages.map(pkg => (
        <div
          key={pkg.id}
          className="px-3 py-2 text-white hover:bg-neutral-800 cursor-pointer"
          onClick={() => {
            setSelectedPackage(pkg);
            setShowPackageDropdown(false);
          }}
        >
          {pkg.name} min{pkg.minAmount} max{pkg.maxAmount}
        </div>
      ))}
    </div>
  )}


          {/* BUY/LONG DROPDOWN - EXACTLY FROM WORKING CODE */}
          <div
            ref={buyDropdownRef}
            className="flex gap-2.5 items-center p-2.5 my-auto rounded-lg border border-solid bg-neutral-900 border-neutral-600 min-w-[154px] cursor-pointer relative"
            onClick={(e) => {
              e.stopPropagation();
              setShowBuyDropdown(prev => !prev);
            }}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca387fb10bcfc33fffcf6905fbc9e1feac1c3e02413c04ee641f2748544d5264?placeholderIfAbsent=true"
              className="object-contain w-3.5 aspect-square"
              alt="dropdown"
            />
            <span className="text-neutral-500">Buy/Long</span>

            {showBuyDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-900 border border-neutral-600 rounded-lg z-10">
                <div className="px-3 py-2 text-white hover:bg-neutral-800" >Buy/Long</div>
                <div className="px-3 py-2 text-white hover:bg-neutral-800">Sell/Short</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Amount + Duration */}
      <div className="flex gap-4 justify-between items-center mt-5 overflow-x-auto no-scrollbar hide-scrollbar hover:scrollbar-thin hover:scrollbar-thumb-neutral-700 hover:scrollbar-track-transparent">
        {/* Amount Input */}
        <div className="min-w-[153px]">
          <label className="text-[clamp(11px,2vw,13px)] tracking-normal leading-tight text-zinc-100">
            Amount ({selectedPackage?.currency || "NGN"})
          </label>
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={handleAmountChange}
            className="px-2.5 py-3 mt-1 w-full text-[clamp(10px,2vw,13px)] rounded-lg border border-solid bg-neutral-900 border-neutral-800 text-neutral-300 min-h-[34px]"
            disabled={!selectedPackage}
          />
        </div>

        {/* Duration Display */}
        <div className="min-w-[153px]">
          <label className="text-[clamp(11px,2vw,13px)] tracking-normal leading-tight text-zinc-100">
            Duration
          </label>
          <div className="flex gap-2.5 items-center p-2.5 mt-1 w-full text-[clamp(10px,2vw,13px)] rounded-lg border border-solid bg-neutral-900 border-neutral-800 text-neutral-300 min-h-[34px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca387fb10bcfc33fffcf6905fbc9e1feac1c3e02413c04ee641f2748544d5264?placeholderIfAbsent=true"
              className="object-contain w-3.5 aspect-square"
              alt="Duration icon"
            />
            <span>
              {selectedPackage ? `${selectedPackage.duration} hours` : "Select Package"}
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleTrade}
        disabled={loading || !selectedPackage || !amount || fetchingPackages}
        className={`mt-7 px-2.5 py-3.5 w-full text-[clamp(11px,2vw,14px)] rounded-3xl min-h-[42px] transition-colors ${
          loading || !selectedPackage || !amount || fetchingPackages
            ? 'bg-blue-800 cursor-not-allowed opacity-70'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
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
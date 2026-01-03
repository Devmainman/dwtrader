"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL } from "../../api/config";

function TradingForm() {
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

  /* ================= FETCH PACKAGES ================= */
  useEffect(() => {
    if (!token) return;

    const fetchPackages = async () => {
      try {
        setFetchingPackages(true);
        const res = await axios.get(
          `${API_BASE_URL}/user-trades/packages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setPackages(res.data.packages);
          if (res.data.packages.length > 0) {
            setSelectedPackage(res.data.packages[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
      } finally {
        setFetchingPackages(false);
      }
    };

    fetchPackages();
  }, [token]);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        packageDropdownRef.current &&
        !packageDropdownRef.current.contains(e.target)
      ) {
        setShowPackageDropdown(false);
      }

      if (
        buyDropdownRef.current &&
        !buyDropdownRef.current.contains(e.target)
      ) {
        setShowBuyDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* ================= INPUT HANDLERS ================= */
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  /* ================= TRADE ================= */
  const handleTrade = async () => {
    if (!selectedPackage) {
      alert("Please select a package");
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amount || amountNum === 0) {
      alert("Please enter an amount");
      return;
    }

    if (amountNum < selectedPackage.minAmount) {
      alert(
        `Minimum amount is ${selectedPackage.currency} ${selectedPackage.minAmount}`
      );
      return;
    }

    if (amountNum > selectedPackage.maxAmount) {
      alert(
        `Maximum amount is ${selectedPackage.currency} ${selectedPackage.maxAmount}`
      );
      return;
    }

    if (!user?.tradingEnabled) {
      alert("Trading is not enabled for your account.");
      return;
    }

    if (user?.status === "Inactive") {
      alert("Your account is inactive.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/user-trades/create`,
        {
          packageId: selectedPackage.id,
          amount: amountNum,
          duration: selectedPackage.duration,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Trade created successfully!");
        setAmount("");
      }
    } catch (err) {
      console.error("Trade error:", err);
      alert(err.response?.data?.message || "Trade failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <section className="flex flex-col justify-center px-3 py-4 w-[358px] h-[336px] rounded-xl border border-neutral-600 bg-black bg-opacity-80 text-white">
      <div className="w-full">
        <h3 className="text-[12px] text-neutral-400">Package</h3>

        <div className="flex gap-5 mt-1 text-[10px]">
          {/* PACKAGE DROPDOWN */}
          <div
            ref={packageDropdownRef}
            className="flex items-center justify-between px-2 py-2.5 w-full rounded-lg bg-neutral-900 border border-neutral-600 cursor-pointer relative"
            onClick={(e) => {
              e.stopPropagation();
              setShowPackageDropdown((p) => !p);
            }}
          >
            <span className="truncate">
              {selectedPackage ? selectedPackage.name : "Select Package"}
            </span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/24449e3ac3913b7c17f84fc6c2a879f4840271dda8f34aca2a69338daa00a512"
              alt="Dropdown"
              className="w-4"
            />

            {showPackageDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-900 border border-neutral-600 rounded-lg z-50">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="px-3 py-2 hover:bg-neutral-800 cursor-pointer"
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setShowPackageDropdown(false);
                    }}
                  >
                    {pkg.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BUY / LONG */}
          <div
            ref={buyDropdownRef}
            className="flex items-center gap-2.5 p-2.5 w-full rounded-lg bg-neutral-900 border border-neutral-600 text-neutral-500 cursor-pointer relative"
            onClick={(e) => {
              e.stopPropagation();
              setShowBuyDropdown((p) => !p);
            }}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8b407f4a4de1526b3dfc5bca6c8758729c573c866f6382893ac702a1e9861743"
              alt="Buy/Long"
              className="w-3.5"
            />
            <span>Buy/Long</span>

            {showBuyDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-900 border border-neutral-600 rounded-lg z-50">
                <div className="px-3 py-2 hover:bg-neutral-800">
                  Buy/Long
                </div>
                <div className="px-3 py-2 hover:bg-neutral-800">
                  Sell/Short
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PACKAGE INFO */}
        <div className="flex flex-col gap-1 mt-3 text-[10px] text-neutral-400">
          {[
            ["Rate", selectedPackage?.rate ?? "--"],
            ["Min. Amount", selectedPackage?.minAmount ?? "--"],
            ["Max. Amount", selectedPackage?.maxAmount ?? "--"],
          ].map(([label, value], i) => (
            <div className="flex justify-between" key={i}>
              <div className="p-2.5">{label}:</div>
              <div className="p-2.5 text-stone-300">{value}</div>
            </div>
          ))}
        </div>

        {/* AMOUNT & DURATION */}
        <div className="flex gap-5 mt-2 w-full">
          <div className="flex-1">
            <label className="text-[12px] text-neutral-400">
              Amount ({selectedPackage?.currency || "NGN"})
            </label>
            <input
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={handleAmountChange}
              disabled={!selectedPackage}
              className="mt-1 px-2.5 py-3 w-full rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 text-[10px]"
            />
          </div>

          <div className="flex-1">
            <label className="text-xs text-neutral-400">Duration</label>
            <div className="flex items-center gap-2.5 px-2.5 py-3 mt-1 w-full rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 text-[10px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8b407f4a4de1526b3dfc5bca6c8758729c573c866f6382893ac702a1e9861743"
                alt="Duration"
                className="w-3.5"
              />
              <span>
                {selectedPackage
                  ? `${selectedPackage.duration} hours`
                  : "Select Duration"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleTrade}
        disabled={loading || !selectedPackage || !amount || fetchingPackages}
        className={`mt-5 w-full py-3.5 rounded-3xl text-xs transition ${
          loading || !selectedPackage || !amount || fetchingPackages
            ? "bg-blue-800 opacity-70 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : "Trade Now"}
      </button>
    </section>
  );
}

export default TradingForm;

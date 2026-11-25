"use client";
import React, { useState } from "react";

function BalanceModal({ show, onClose, user, userCurrency, conversionRate, onTopup, onDeduct }) {
  const [topupAmount, setTopupAmount] = useState("");
  const [deductAmount, setDeductAmount] = useState("");
  const [activeSection, setActiveSection] = useState("topup"); // "topup" or "deduct"

  if (!show) return null;

  const formatCurrency = (amount, currency = userCurrency) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return `0.00 ${currency}`;
    return `${num.toFixed(2)} ${currency}`;
  };

  const calculateConvertedAmount = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return 0;
    return num * conversionRate;
  };

  const handleTopup = () => {
    if (topupAmount && parseFloat(topupAmount) > 0) {
      onTopup(topupAmount);
      setTopupAmount("");
    }
  };

  const handleDeduct = () => {
    if (deductAmount && parseFloat(deductAmount) > 0) {
      onDeduct(deductAmount);
      setDeductAmount("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[var(--card)] rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Manage Balance</h3>
            <p className="text-sm text-neutral-400 mt-1">Add or deduct funds from your account</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white transition-colors rounded-full hover:bg-neutral-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current Balance */}
        <div className="mb-6 p-4 bg-neutral-900 rounded-xl">
          <p className="text-sm text-neutral-400">Current Balance</p>
          <p className="text-2xl font-bold text-zinc-100 mt-1">
            {user?.balance ? formatCurrency(user.balance, userCurrency) : "0.00"}
          </p>
          <div className="flex justify-between items-center mt-2 text-xs text-neutral-400">
            <span>Currency: {userCurrency}</span>
            <span>Rate: 1 USD = {(1 / conversionRate).toFixed(4)} {userCurrency}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 mb-6">
          <button
            onClick={() => setActiveSection("topup")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeSection === "topup"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Top Up
          </button>
          <button
            onClick={() => setActiveSection("deduct")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeSection === "deduct"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Deduct
          </button>
        </div>

        {/* Topup Section */}
        {activeSection === "topup" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">Amount to Add (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-neutral-400">$</span>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full bg-black/40 p-3 pl-8 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[10, 50, 100, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTopupAmount(amount.toString())}
                    className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-neutral-900/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">You'll receive:</span>
                <span className="text-zinc-100 font-medium">
                  {topupAmount ? formatCurrency(calculateConvertedAmount(topupAmount)) : "0.00"}
                </span>
              </div>
            </div>

            <button
              onClick={handleTopup}
              disabled={!topupAmount || parseFloat(topupAmount) <= 0}
              className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Funds
            </button>
          </div>
        )}

        {/* Deduct Section */}
        {activeSection === "deduct" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">Amount to Deduct (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-neutral-400">$</span>
                <input
                  type="number"
                  value={deductAmount}
                  onChange={(e) => setDeductAmount(e.target.value)}
                  className="w-full bg-black/40 p-3 pl-8 rounded-lg text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  min="0"
                  max={user?.balance || 0}
                  step="0.01"
                />
              </div>
              <div className="flex justify-between text-xs text-neutral-400 mt-2">
                <span>Available: ${user?.balance?.toFixed(2) || "0.00"}</span>
                <button
                  onClick={() => setDeductAmount(user?.balance?.toString() || "0")}
                  className="hover:text-white"
                >
                  Use Max
                </button>
              </div>
            </div>

            <div className="p-3 bg-neutral-900/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Will be deducted:</span>
                <span className="text-zinc-100 font-medium">
                  {deductAmount ? formatCurrency(calculateConvertedAmount(deductAmount)) : "0.00"}
                </span>
              </div>
            </div>

            <button
              onClick={handleDeduct}
              disabled={!deductAmount || parseFloat(deductAmount) <= 0 || parseFloat(deductAmount) > (user?.balance || 0)}
              className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              Deduct Funds
            </button>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default BalanceModal;
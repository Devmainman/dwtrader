"use client";
import React, { useState } from "react";

const CryptoFormFields = ({ formData, onInputChange }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard
      .writeText(formData.walletAddress)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <label
          htmlFor="cryptoName"
          className="gap-2.5 text-[10px] font-semibold text-neutral-400"
        >
          Crypto Name:
        </label>
        <input
          type="text"
          id="cryptoName"
          value={formData.cryptoName}
          onChange={(e) => onInputChange("cryptoName", e.target.value)}
          className="gap-2.5 p-2.5 h-9 text-[10px] rounded-md bg-[#1D1D1F] text-zinc-100 w-[243px]"
          readOnly
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex gap-7 items-center">
          <label
            htmlFor="walletAddress"
            className="text-[10px] font-semibold text-neutral-400"
          >
            Wallet Address:
          </label>
          <div className="flex flex-1 gap-2.5 items-center p-2.5 h-9 rounded-md bg-[#1D1D1F]">
            <input
              type="text"
              id="walletAddress"
              value={formData.walletAddress}
              onChange={(e) => onInputChange("walletAddress", e.target.value)}
              className="flex-1 gap-2.5 text-[10px] text-zinc-100 bg-transparent border-none outline-none"
              readOnly
            />
            <div className="flex gap- items-center px-1.5">
              <button
                type="button"
                onClick={handleCopyAddress}
                className="text-[10px] text-blue-600"
                aria-label="Copy wallet address"
              >
                {copySuccess ? "Copied!" : "Copy Now"}
              </button>
              <svg
                width="15"
                height="14"
                viewBox="0 0 15 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[14px] h-[14px]"
              >
                <path
                  d="M9.39 1.16675H7.1185C6.0895 1.16675 5.274 1.16675 4.63642 1.25308C3.97958 1.34175 3.44817 1.52841 3.02933 1.949C2.60992 2.36958 2.42383 2.90333 2.33575 3.5625C2.25 4.203 2.25 5.02141 2.25 6.0545V9.46C2.25 10.3397 2.78667 11.0933 3.54908 11.4095C3.51 10.8787 3.51 10.1349 3.51 9.51541V6.59291C3.51 5.84566 3.51 5.20108 3.57883 4.68541C3.65292 4.13241 3.81975 3.60275 4.24792 3.17283C4.67608 2.74291 5.204 2.5755 5.75467 2.50083C6.268 2.432 6.90967 2.432 7.65458 2.432H9.44542C10.1897 2.432 10.8302 2.432 11.3442 2.50083C11.1902 2.10784 10.9214 1.77035 10.5729 1.53237C10.2243 1.2944 9.81207 1.16698 9.39 1.16675Z"
                  fill="#2563EB"
                />
                <path
                  d="M4.3501 6.64832C4.3501 5.05815 4.3501 4.26307 4.84243 3.76899C5.33418 3.2749 6.12576 3.2749 7.7101 3.2749H9.3901C10.9738 3.2749 11.766 3.2749 12.2583 3.76899C12.7507 4.26307 12.7501 5.05815 12.7501 6.64832V9.45999C12.7501 11.0502 12.7501 11.8452 12.2583 12.3393C11.766 12.8334 10.9738 12.8334 9.3901 12.8334H7.7101C6.12635 12.8334 5.33418 12.8334 4.84243 12.3393C4.3501 11.8452 4.3501 11.0502 4.3501 9.45999V6.64832Z"
                  fill="#2563EB"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <label
          htmlFor="amount"
          className="text-[10px] font-medium text-neutral-400"
        >
          Amount (NGN)
        </label>
        <input
          type="text"
          id="amount"
          placeholder="Deposit Amount"
          value={formData.amount}
          onChange={(e) => onInputChange("amount", e.target.value)}
          className="flex-1 p-2.5 text-[10px] rounded-lg bg-[#1D1D1F] h-[52px] text-zinc-100 placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
};

export default CryptoFormFields;

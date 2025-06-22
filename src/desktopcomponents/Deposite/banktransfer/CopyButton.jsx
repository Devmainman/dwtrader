"use client";
import React, { useState } from "react";

function CopyButton({ textToCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="flex flex-col justify-center self-stretch  my-auto text-[8px] text-blue-600 min-h-[23px] w-[78px]"
    >
      <div className="flex gap-2 justify-center items-center w-full">
        <span className="self-stretch my-auto">
          {copied ? "Copied!" : "Copy Now"}
        </span>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/aad06bfb0983fe8d0c12ede86937fa0a215e9e8cfc9453b383f674178ba642f3?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
          alt="Copy icon"
        />
      </div>
    </button>
  );
}

export default CopyButton;

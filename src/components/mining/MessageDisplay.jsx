"use client";
import React from "react";

function MessageDisplay({ message }) {
  const isSuccess = message.includes('success') || 
                   message.includes('started') || 
                   message.includes('claimed') ||
                   message.includes('activated') ||
                   message.includes('purchased');
  
  return (
    <div className={`w-full px-4 py-3 rounded-lg text-sm mb-4 ${
      isSuccess 
        ? 'bg-green-900/90 text-green-300' 
        : 'bg-red-900/90 text-red-300'
    }`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button 
          onClick={() => {}}
          className="ml-4 text-neutral-400 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MessageDisplay;
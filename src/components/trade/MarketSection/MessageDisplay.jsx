"use client";
import React, { useEffect, useState } from "react";

function MessageDisplay({ message, duration = 5000 }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible || !message) return null;

  const isSuccess = message.toLowerCase().includes('success') || 
                   message.toLowerCase().includes('executed') || 
                   message.toLowerCase().includes('closed') ||
                   message.toLowerCase().includes('topped') ||
                   message.toLowerCase().includes('deducted');

  const isError = message.toLowerCase().includes('error') || 
                 message.toLowerCase().includes('failed') ||
                 message.toLowerCase().includes('invalid') ||
                 message.toLowerCase().includes('insufficient');

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg text-[10px] ${
      isSuccess
        ? 'bg-green-900/90 text-green-300' 
        : isError
        ? 'bg-red-900/90 text-red-300'
        : 'bg-blue-900/90 text-blue-300'
    }`}>
      {message}
      <button 
        onClick={() => setVisible(false)}
        className="ml-4 text-stone-300 hover:text-zinc-100"
      >
        ✕
      </button>
    </div>
  );
}

export default MessageDisplay;
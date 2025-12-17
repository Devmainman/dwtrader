"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL } from "../../api/config";

function SignalStrengthBar() {
  const [percentage, setPercentage] = useState(0);
  const { token } = useUserAuth();

  useEffect(() => {
    const fetchSignalStrength = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/account/signal-strength`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPercentage(res.data.signalStrength || 0);
      } catch (err) {
        console.error("Failed to fetch signal strength:", err);
      }
    };

    if (token) fetchSignalStrength();
  }, [token]);

  return (
    <div className="flex flex-col gap-2 mt-5 w-[1229px] max-w-full">
      <div className="flex justify-between items-center">
        <span className="text-xs leading-4 text-stone-300">Signal Strength</span>
        <span className="text-xs leading-4 text-stone-300">{percentage}%</span>
      </div>
      <div className="relative w-full bg-zinc-100 h-[7px]">
        <div
          className="h-full bg-blue-600 rounded-none transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default SignalStrengthBar;

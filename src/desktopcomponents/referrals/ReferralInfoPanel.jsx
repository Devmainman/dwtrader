"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";

const ReferralInfoPanel = () => {
    const { fetchWithAuth, user } = useUserAuth();
    const [referralLink, setReferralLink] = useState("Loading...");
    const [isCopied, setIsCopied] = useState(false);
  
    useEffect(() => {
      const fetchReferral = async () => {
        try {
          const response = await fetchWithAuth("/referrals");
          const code = response.data.referral?.code || response.data.referralCode;
          if (code) {
            const link = `${window.location.origin}/signup?ref=${code}`;
            setReferralLink(link);
          } else {
            setReferralLink("Error: No referral code found.");
          }
        } catch (error) {
          console.error("Failed to fetch referral info:", error);
          setReferralLink("Error: Unable to load referral link");
        }
      };
  
      if (user) fetchReferral();
    }, [fetchWithAuth, user]);
  
    const handleCopy = () => {
      if (!referralLink || referralLink.includes("Error")) return;
      navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    };


  const benefits = [
    "For every 1 referrals, users receive a bonus $10 in addition to the $5 per referral.",
    "Users who refer others get 5% off on trading fees for every successful referral, lasting for 30 days.",
    "After referring 10 people, users gain VIP status for one month, which includes perks like:",
  ];

  return (
    <aside className="overflow-hidden grow shrink px-4 py-8 rounded-xl bg-[var(--card)] min-w-60 w-[231px]">
      <h2 className="text-[14px] font-medium tracking-normal leading-tight text-zinc-100">
        Refer Your Friends
      </h2>

      <ul className="mt-5 w-full text-[10px] text-neutral-400">
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="flex gap-2.5 items-center mt-3 w-full first:mt-0"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec72992227cd154fb2146c3e5d8ce946243da6ff1a40a849a3ff6168b935b4d6?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
              alt="Checkmark icon"
            />
            <p className="flex-1 shrink my-auto basis-0">{benefit}</p>
          </li>
        ))}
      </ul>

      <div className="flex flex-col mt-5 w-full">
        <div className="flex flex-wrap gap-4 items-center w-full">
          <label className="self-stretch my-auto text-[10px] text-neutral-400">
            Referral link:
          </label>
          <div className="overflow-hidden flex-1 shrink gap-2.5 self-stretch px-2.5 py-2.5 my-auto text-[8px] whitespace-nowrap rounded-md basis-0 bg-neutral-600 min-h-7 text-zinc-100">
            {referralLink}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex flex-col justify-center self-end  py-1.5 mt-2.5 text-[8px] text-blue-600 min-h-[23px] w-[78px]"
        >
          <div className="flex gap-2 justify-center items-center w-full">
            <span className="self-stretch my-auto">Copy Now</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0d04e5f1c7ee7aa02b8242f7227335d4a5b1db2b9847e2308ec7663f3466411a?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
              alt="Copy icon"
            />
          </div>
        </button>
      </div>
    </aside>
  );
};

export default ReferralInfoPanel;

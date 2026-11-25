"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";

const ReferralLinkSection = () => {
  const { fetchWithAuth, user } = useUserAuth();
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);

  const copyIconUrl =
    "https://cdn.builder.io/api/v1/image/assets/TEMP/2fd1f31c640e4a8bc61ad64aa34bd7d9e147f00417163c84ba0f049ad7bf2b6f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8";
  const checkmarkIconUrl =
    "https://cdn-icons-png.flaticon.com/512/190/190411.png";

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const response = await fetchWithAuth("/referrals");
        const data = response.data;

        const code = data.referral?.code || data.referralCode;
        if (code) {
          const link = `${window.location.origin}/signup?ref=${code}`;
          setReferralLink(link);
        } else {
          setReferralLink("Error: No referral code");
        }
      } catch (error) {
        console.error("Failed to fetch referral info:", error);
        setReferralLink("Error: Unable to load referral link");
      }
    };

    fetchReferral();
  }, [fetchWithAuth]);

  const copyToClipboard = () => {
    if (!referralLink || referralLink.includes("Error")) return;

    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIconSrc = () => {
    if (referralLink.includes("Error")) return "/error-icon.png";
    if (copied) return checkmarkIconUrl;
    return copyIconUrl;
  };

  const getAltText = () => {
    if (referralLink.includes("Error")) return "Error";
    if (copied) return "Copied!";
    return "Copy icon";
  };

  return (
    <div className="lg:mt-4 flex gap-3 justify-between items-center w-full">
      <div className="flex overflow-hidden flex-col justify-center self-stretch px-4 py-2 my-auto text-[12px] tracking-normal leading-none bg-blue-600 rounded-3xl border border-solid border-[color:var(--Primary-Blue,var(--color-blue-600))] text-zinc-100 w-[127px]">
        <span className="gap-1.5 self-stretch">Referral link</span>
      </div>
      <div className="flex lg:w-full overflow-hidden gap-2.5 items-center self-stretch px-2.5 py-2 my-auto text-[8px] whitespace-nowrap rounded-md bg-[var(--card)] min-h-7 text-zinc-100 w-[232px]">
        <span
          className={`flex-1 shrink self-stretch my-auto basis-0 overflow-hidden text-ellipsis ${
            referralLink.includes("Error") ? "text-red-400" : ""
          }`}
        >
          {user ? (referralLink || "Generating...") : "Loading user..."}
        </span>
        <button
          onClick={copyToClipboard}
          disabled={!referralLink || referralLink.includes("Error")}
          className="disabled:opacity-50"
        >
          <img
            src={getIconSrc()}
            alt={getAltText()}
            className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
          />
        </button>
      </div>
    </div>
  );
};

export default ReferralLinkSection;

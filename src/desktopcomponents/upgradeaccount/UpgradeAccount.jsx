"use client";
import React, { useState, useEffect, useRef } from "react";
import StatCard from "./StatCard";
import SignalStrengthBar from "../trade/SignalStrengthBar";
import AccountTier from "./AccountTier";
import StatisticsCards from "../home/StatisticsCards";
import PackageCard from "../../components/accountupgrade/PackageCard";
import axios from "axios";
import { API_BASE_URL } from "../../api/config";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";

function UpgradeAccount() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useUserAuth();
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        if (!token) return; // Wait until token is available
        const response = await axios.get(
          `${API_BASE_URL}/public/packages/user-packages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sorted = response.data.packages
          .filter((pkg) => pkg.status === "Active")
          .sort((a, b) => a.convertedAmount - b.convertedAmount);

        setPackages(sorted);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("Failed to load packages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [token]);

  const scrollToCard = (index) => {
    const cardWidth = scrollRef.current?.children[0]?.offsetWidth || 0;
    scrollRef.current.scrollTo({
      left: cardWidth * index,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const handleScroll = () => {
    const cardWidth = scrollRef.current?.children[0]?.offsetWidth || 0;
    const scrollLeft = scrollRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      return () => ref.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Subscribing goes through the payment page; the upgrade is applied once the payment is approved.
  const handleSubscribe = (packageId) => {
    const pkg = (packages || []).find((p) => p._id === packageId);
    if (!pkg) return;
    navigate(`/payment?amount=${encodeURIComponent(pkg.amount)}&packageId=${encodeURIComponent(pkg._id)}`);
  };

  return (
    <section className="flex flex-col pt-2 pl-2 pr-3 pb-14 bg-neutral-900 min-h-screen max-md:px-8 max-md:py-16 max-sm:px-5 max-sm:py-8">
      <h1 className="self-start text-3xl font-medium tracking-normal leading-tight text-zinc-100">
        Upgrade Account
      </h1>

      <div className="mt-2 w-full max-w-[1229px] max-md:max-w-full">
        <div className="mb-6">
          <StatisticsCards />
        </div>
        <SignalStrengthBar />
      </div>

      <div className="mt-5 w-full max-w-full max-md:max-w-full">
        <div className="flex flex-wrap gap-10 justify-center items-start w-full text-zinc-100 max-md:max-w-full">
          <h2 className="flex-1 shrink text-[16px] font-medium tracking-normal leading-tight basis-5 min-w-60 max-md:max-w-full">
            Account Upgrade
          </h2>
          <span className="gap-2.5 self-stretch px-2.5 py-1.5 text-[8px] font-semibold whitespace-nowrap bg-yellow-700 rounded-3xl min-h-[21px] w-[39px]">
            PRO
          </span>
        </div>

        <div className="w-full text-stone-300 max-md:max-w-full">
          <div
            ref={scrollRef}
            className="flex h-[550px] pl-6 pr-5 overflow-x-auto items-center space-x-8 snap-x snap-mandatory scrollbar-hide w-full"
          >
            {packages.map((pkg, index) => (
            <PackageCard
              key={pkg._id}
              title={pkg.name}
              price={`${pkg.currency} ${pkg.amount.toLocaleString()}`}
              features={pkg.benefits}
              isActive={activeIndex === index}
              onSubscribe={() => handleSubscribe(pkg._id)}
              icon={pkg.icon}
            />
          ))}

          </div>
        </div>
      </div>
    </section>
  );
}

export default UpgradeAccount;

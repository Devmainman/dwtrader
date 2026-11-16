import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import PackageCard from "./PackageCard";
import checkSVG from "../../assets/lets-icons_check-fill.svg";
import { useUserAuth } from "../../context/UserAuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../api/config";

function AccountUpgrade1() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useUserAuth();
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { fetchWithAuth } = useUserAuth();

  const handleProceed = () => {
  const queryAmount = encodeURIComponent(packages[activeIndex].amount);
  navigate(`/payment?amount=${queryAmount}`);
};

useEffect(() => {
  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/public/packages/user-packages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setPackages(data.packages || data);
    } catch (err) {
      console.error('Error loading packages:', err);
      setError("Failed to load packages. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (token) fetchPackages();
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

  if (loading) {
    return (
      <div className="flex pb-30 flex-col items-center w-full h-full p-4">
        <header className="flex gap-30 flex justify-between w-[350px] items-start text-zinc-100 lg:w-full lg:max-w-[1000px] lg:justify-start lg:gap-3 lg:items-center lg:pt-4">
          <h1 className="text-[16px] font-medium tracking-normal leading-tight">
            Account Upgrade
          </h1>
          <span className="self-stretch px-2 py-1 text-[8px] font-semibold whitespace-nowrap bg-yellow-700 rounded-3xl">
            PRO
          </span>
        </header>
        <div className="flex justify-center items-center h-64">
          <p className="text-white">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex pb-30 flex-col items-center w-full h-full p-4">
        <header className="flex gap-30 flex justify-between w-[350px] items-start text-zinc-100 lg:w-full lg:max-w-[1000px] lg:justify-start lg:gap-3 lg:items-center lg:pt-4">
          <h1 className="text-[16px] font-medium tracking-normal leading-tight">
            Account Upgrade
          </h1>
          <span className="self-stretch px-2 py-1 text-[8px] font-semibold whitespace-nowrap bg-yellow-700 rounded-3xl">
            PRO
          </span>
        </header>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="flex pb-30 flex-col items-center w-full h-full p-4">
        <header className="flex gap-30 flex justify-between w-[350px] items-start text-zinc-100 lg:w-full lg:max-w-[1000px] lg:justify-start lg:gap-3 lg:items-center lg:pt-4">
          <h1 className="text-[16px] font-medium tracking-normal leading-tight">
            Account Upgrade
          </h1>
          <span className="self-stretch px-2 py-1 text-[8px] font-semibold whitespace-nowrap bg-yellow-700 rounded-3xl">
            PRO
          </span>
        </header>
        <div className="flex justify-center items-center h-64">
          <p className="text-white">No packages available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex pb-30 flex-col items-center w-full h-full p-4">
      <header className="flex gap-30 flex justify-between w-[350px] items-start text-zinc-100 lg:w-full lg:max-w-[1000px] lg:justify-start lg:gap-3 lg:items-center lg:pt-4">
        <h1 className="text-[16px] font-medium tracking-normal leading-tight">
          Account Upgrade
        </h1>
        <span className="self-stretch px-2 py-1 text-[8px] font-semibold whitespace-nowrap bg-yellow-700 rounded-3xl">
          PRO
        </span>
      </header>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex h-[550px] pl-6 pr-5 overflow-x-auto items-center space-x-8 snap-x snap-mandatory scrollbar-hide w-full lg:justify-center lg:h-auto lg:py-10 lg:overflow-visible"
        style={{ scrollBehavior: "smooth" }}
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
            packageId={pkg._id}
            amount={pkg.amount}
          />
        ))}
      </div>

      <nav className="flex gap-2 text-[12px] py-2 justify-start overflow-x-auto whitespace-nowrap scrollbar-hide text-white items-center w-full rounded-3xl bg-neutral-800 px-2 lg:hidden">
        {packages.map((pkg, index) => (
          <button
            key={pkg._id}
            onClick={() => scrollToCard(index)}
            className={`px-3 rounded-3xl border text-nowrap border-solid ${
              activeIndex === index
                ? "bg-blue-600 border-[color:var(--white-90,#505050)]"
                : "border-neutral-600"
            } min-h-[29px]`}
          >
            {pkg.name}
          </button>
        ))}
      </nav>

      {/* Proceed Button */}
      {packages.length > 0 && (
        <button 
          onClick={() => handleProceed()}
          className="flex overflow-hidden text-white justify-center items-center self-center px-2.5 py-1 mt-5 w-full bg-blue-600 rounded-3xl lg:hidden"
        >
          <div className="flex text-[15px] flex-col justify-center items-center self-stretch my-auto">
            <span>Proceed with Plan</span>
            <strong className="font-bold">
              {packages[activeIndex].currency} {packages[activeIndex].amount.toLocaleString()}
            </strong>
          </div>
        </button>
      )}
    </div>
  );
}

export default AccountUpgrade1;
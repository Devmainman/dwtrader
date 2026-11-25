"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";

function PersonalInformation() {
  const { fetchWithAuth } = useUserAuth();
  const [personalInfo, setPersonalInfo] = useState([
    { label: "Full Name:", value: "Loading..." },
    { label: "Account ID:", value: "Loading..." },
    { label: "Mobile:", value: "Loading..." },
    { label: "Email:", value: "Loading..." },
    { label: "Gender:", value: "Loading..." },
    { label: "Country:", value: "Loading..." },
    { label: "Currency:", value: "Loading..." },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth("/verification/users");
        const data = response.data;

        setPersonalInfo([
          { label: "Full Name:", value: `${data.firstName || ''} ${data.lastName || ''}`.trim() || "N/A" },
          { label: "Account ID:", value: data.accountId || "N/A" },
          { label: "Mobile:", value: data.phoneNumber || "N/A" },
          { label: "Email:", value: data.email || "N/A" },
          { label: "Gender:", value: data.gender || "N/A" },
          { label: "Country:", value: data.country || "N/A" },
          { label: "Currency:", value: data.currency ? `${data.currency} (${getCurrencyCode(data.currency)})` : "N/A" }
        ]);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [fetchWithAuth]);

  const getCurrencyCode = (currency) => {
    const codes = {
      "Nigeria Naira": "NGN",
      "US Dollar": "USD",
      "Euro": "EUR"
    };
    return codes[currency] || "";
  };

  return (
    <section className="flex overflow-hidden flex-col items-start px-9 pt-7 pb-3.5 mt-2.5 w-full rounded-xl bg-[var(--card)]">
      <h3 className="text-sm font-medium tracking-normal leading-tight text-neutral-400">
        Personal Information
      </h3>
      <div className="mt-4 ml-4 w-full text-xs tracking-normal leading-none text-neutral-500">
        {personalInfo.map((item, index) => (
          <InfoRow
            key={index}
            label={item.label}
            value={item.value}
            isLast={index === personalInfo.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

function InfoRow({ label, value, isLast = false }) {
  return (
    <div className={`flex gap-9 items-center ${!isLast ? "mt-2" : ""} w-full`}>
      <div className="gap-2.5 self-stretch p-2.5 my-auto w-[86px]">{label}</div>
      <div className="overflow-hidden gap-2.5 self-stretch py-2.5 pr-2.5 pl-2.5 my-auto w-[122px]">
        {value}
      </div>
    </div>
  );
}

export default PersonalInformation;

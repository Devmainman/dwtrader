"use client";
import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import Button from "./Button";
import { useUserAuth } from "../../../context/UserAuthContext";

function ProfileForm() {
  const { fetchWithAuth } = useUserAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    country: "",
    currency: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedDialCode, setSelectedDialCode] = useState("");



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth("/verification/users");
        const data = response.data;
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phoneNumber: data.phoneNumber || "",
          gender: data.gender || "",
          country: data.country || "",
          currency: data.currency || ""
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchWithAuth]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
        if (!res.ok) throw new Error(`API failed: ${res.status}`);
  
        const data = await res.json();
  
        const formattedCountries = data
          .map((c) => ({
            name: c.name?.common || 'Unknown',
            code: c.cca2 || '',
            dialCode: c.idd?.root && c.idd?.suffixes?.length
              ? c.idd.root + c.idd.suffixes[0]
              : null,
          }))
          .filter((c) => c.code && c.dialCode && c.name)
          .sort((a, b) => a.name.localeCompare(b.name)); 
  
        setCountries(formattedCountries);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
  
    fetchCountries();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null); // Clear previous success
  
    try {
      const response = await fetchWithAuth("/verification/profile", {
        method: "POST",
        data: formData
      });
  
      console.log("Profile updated successfully", response.data);
      setSuccessMessage("Profile updated successfully");
  
      // Optional: auto-dismiss message after 4 seconds
      setTimeout(() => setSuccessMessage(null), 4000);
  
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message);
    }
  };
  

  if (loading) {
    return (
      <article className="relative p-7 w-full rounded-xl bg-[#1D1D1F] h-[488px]">
        <header className="mb-5 text-sm font-medium text-neutral-400">Edit Profile Information</header>
        <div className="flex flex-col gap-4 mx-auto w-[245px]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2.5">
              <div className="h-4 w-20 bg-neutral-700 rounded animate-pulse"></div>
              <div className="h-8 w-full bg-neutral-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  const DownArrowIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[16px] h-[16px]"
    >
      <path
        d="M12 6.3335L8 10.3335L4 6.3335H12Z"
        fill="#505050"
        stroke="#505050"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <article className="relative p-7 pb-12 w-full rounded-xl bg-[#1D1D1F] h-auto min-h-[488px]">
      <header className="mb-5 text-sm font-medium text-neutral-400">Edit Profile Information</header>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mx-auto w-[245px]">
          <InputField label="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <InputField label="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          <InputField
  label="Phone Number"
  value={formData.phoneNumber}
  onChange={(e) => {
    const typed = e.target.value;

    // If the user deletes the dial code, restore it
    if (!typed.startsWith(selectedDialCode)) {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: selectedDialCode + typed.replace(/\D/g, "")
      }));
    } else {
      // Allow user to type after the dial code
      const rest = typed.slice(selectedDialCode.length).replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        phoneNumber: selectedDialCode + rest
      }));
    }
  }}
/>

          <SelectField label="Gender" value={formData.gender} options={["Male", "Female", "Other"]} onChange={value => setFormData({...formData, gender: value})} />
          <SelectField
            label="Country"
            value={formData.country}
            options={countries.map((c) => ({
              label: `${c.name} (${c.dialCode})`,
              value: c.code
            }))}
            onChange={(value) => {
              const selected = countries.find(c => c.code === value);
              const dial = selected?.dialCode || "";
              setSelectedDialCode(dial);

              setFormData(prev => ({
                ...prev,
                country: value,
                phoneNumber: prev.phoneNumber.startsWith("+") ? prev.phoneNumber : dial // auto-prepend if empty
              }));
            }}
          />

        </div>
        {error && <p className="mt-4 text-center text-xs text-red-500">{error}</p>}
        {successMessage && <p className="mt-2 text-center text-xs text-green-500">{successMessage}</p>}
        <div className="flex justify-start mt-6 text-center">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </article>
  );
}

export default ProfileForm;

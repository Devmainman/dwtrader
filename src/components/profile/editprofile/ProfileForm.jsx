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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetchWithAuth("/verification/profile", {
        method: "POST",
        data: formData
      });

      console.log("Profile updated successfully", response.data);
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

  return (
    <article className="relative p-7 w-full rounded-xl bg-[#1D1D1F] h-[488px]">
      <header className="mb-5 text-sm font-medium text-neutral-400">Edit Profile Information</header>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mx-auto w-[245px]">
          <InputField label="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <InputField label="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          <InputField label="Phone Number" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
          <SelectField label="Gender" value={formData.gender} options={["Male", "Female", "Other"]} onChange={value => setFormData({...formData, gender: value})} />
          <SelectField label="Country" value={formData.country} options={["Nigeria", "United States", "United Kingdom"]} onChange={value => setFormData({...formData, country: value})} />
        </div>
        {error && <p className="mt-4 text-center text-xs text-red-500">{error}</p>}
        <div className="absolute bottom-[26px] left-[52px]">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </article>
  );
}

export default ProfileForm;

"use client";
import React from "react";
import ProfileCard from "./ProfileCard";
import VerificationStatus from "./VerificationStatus";
import ProfileTabs from "./ProfileTabs";
import PersonalInformation from "./PersonalInformation";

function SettingsProfile() {
  return (
    <section className="overflow-hidden px-3 py-3 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px] md:max-w-[640px] lg:max-w-[1200px] lg:px-6 lg:py-6 lg:overflow-visible lg:grid lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-6 lg:items-start">
      <div className="lg:sticky lg:top-4">
        <ProfileCard />
        <VerificationStatus />
      </div>
      <div className="mt-5 w-full lg:mt-0">
        <ProfileTabs />
        
      </div>
    </section>
  );
}

export default SettingsProfile;

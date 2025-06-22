"use client";
import React from "react";
import ProfileCard from "./ProfileCard";
import VerificationStatus from "./VerificationStatus";
import ProfileTabs from "./ProfileTabs";
import PersonalInformation from "./PersonalInformation";

function SettingsProfile() {
  return (
    <section className="overflow-hidden px-3 py-3 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
      <div>
        <ProfileCard />
        <VerificationStatus />
      </div>
      <div className="mt-5 w-full">
        <ProfileTabs />
        
      </div>
    </section>
  );
}

export default SettingsProfile;

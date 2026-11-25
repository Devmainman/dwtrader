"use client";
import React from "react";
import ProfileCard from "./ProfileCard";
import VerificationStatus from "./VerificationStatus";
import ProfileTabs from "./ProfileTabs";
import PersonalInformation from "./PersonalInformation";
import ModeToggle from "../navigation/ModeToggle";
import useMode from "../../hooks/useMode";

function Appearance() {
  const [mode] = useMode();
  return (
    <div className="ui-card mt-4 p-4 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-zinc-100">Appearance</p>
        <p className="text-[11px] text-neutral-500">{mode === "light" ? "Light mode" : "Dark mode"} · saved on this device</p>
      </div>
      <ModeToggle />
    </div>
  );
}

function SettingsProfile() {
  return (
    <section className="overflow-hidden px-3 py-3 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px] md:max-w-[640px] lg:max-w-[1200px] lg:px-6 lg:py-6 lg:overflow-visible lg:grid lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-6 lg:items-start">
      <div className="lg:sticky lg:top-4">
        <ProfileCard />
        <VerificationStatus />
        <Appearance />
      </div>
      <div className="mt-5 w-full lg:mt-0">
        <ProfileTabs />
        
      </div>
    </section>
  );
}

export default SettingsProfile;

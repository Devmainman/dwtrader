"use client";
import React from "react";
import ProfileMetricCard from "./ProfileMetricCard";
import ProfileTabs from "./ProfileTabs";
import ProfileDetails from "./ProfileDetails";
import SignalStrengthBar from "../trade/SignalStrengthBar";
import StatisticsCards from "../home/StatisticsCards";

function ProfileInformation() {
  return (
    <section className="flex flex-col pt-2 pl-2 pr-3 pb-14 bg-neutral-900 min-h-screen max-md:px-8 max-md:py-16 max-sm:px-5 max-sm:py-8">
      <h1 className="self-start text-3xl font-medium tracking-normal leading-tight text-zinc-100">
        Profile Information
      </h1>

      <div className="mt-3 max-md:max-w-full">
        <StatisticsCards />
        <div className="mt-6">
        <SignalStrengthBar />
        </div>
      
      <div className="">
      <ProfileDetails />
      </div>
      </div>
    </section>
  );
}

export default ProfileInformation;

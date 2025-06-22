"use client";
import React, { useState } from "react";
import PersonalInformation from "./PersonalInformation";
import EditProfile from "./editprofile/ProfileForm";
import UpdatePhoto from "./uploadphoto/SettingsEditUploadImage";
import ChangePassword from "./changeprofile/SettingsEditChangePassword";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = ["Profile", "Edit Profile", "Update Photo", "Change Password"];

  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <nav className="flex overflow-x-auto gap-1.5 items-center w-full text-[10px] text-stone-300 hide-scrollbar hover:scrollbar-thin hover:scrollbar-thumb-neutral-700 hover:scrollbar-track-transparent">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`gap-1.5 self-stretch px-4  my-auto whitespace-nowrap rounded-3xl border-solid ${
              activeTab === tab
                ? "bg-blue-600 border-[1.5px] border-[#242426]"
                : "border-2 border-neutral-800"
            } min-h-[29px]`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="mt-2">
        {activeTab === "Profile" && <PersonalInformation />}
        {activeTab === "Edit Profile" && <EditProfile />}
        {activeTab === "Update Photo" && <UpdatePhoto />}
        {activeTab === "Change Password" && <ChangePassword />}
      </div>
    </div>
  );
};

export default ProfileTabs;

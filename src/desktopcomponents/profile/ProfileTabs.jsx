import React, { useState } from "react";

function ProfileTabs({ onTabChange }) {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = [
    "Profile",
    "Edit Profile",
    "Update Photo",
    "Change Password",
  ];

  return (
    <nav className="flex overflow-hidden flex-wrap gap-8 items-center mt-5 w-full text-xs max-w-[1229px] text-stone-300 max-md:max-w-full">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => {
            setActiveTab(tab);
            onTabChange(tab);
          }}
          className={`flex-1 shrink gap-1.5 self-stretch px-4 py-2.5 my-auto whitespace-nowrap rounded-3xl border-solid basis-0 min-h-[29px] min-w-60 ${
            activeTab === tab
              ? "bg-blue-600 border-[1.5px] border-[#242426]"
              : "border-2 border-neutral-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

export default ProfileTabs;

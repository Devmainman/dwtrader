import React, { useState } from "react";
import ProfileTabs from "./ProfileTabs";
import UserPhoto from "./UserPhoto";
import PersonalInformation from "../../components/profile/PersonalInformation";
import ImageUploader from "../../components/profile/uploadphoto/SettingsEditUploadImage";
import ProfileEditor from "../../components/profile/editprofile/ProfileForm";
import PasswordChange from "../../components/profile/changeprofile/SettingsEditChangePassword";

function ProfileDetails() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="mt- w-full max-md:max-w-full">
      {/* Tabs Navigation */}
      <ProfileTabs onTabChange={setActiveTab} />

      {/* Fixed Structure */}
      <div className="mt-6 flex ">
        {/* Left Side - Constant */}
        <div className=" max-md:ml-0 max-md:w-full">
          <UserPhoto />
        </div>

        {/* Right Side - Dynamic Content */}
        <div className="ml-3 w-[500px] h-[26px] max-md:ml-0 max-md:w-full">
          {activeTab === "Profile" && <PersonalInformation />}
          {activeTab === "Edit Profile" && <ProfileEditor />}
          {activeTab === "Update Photo" && <ImageUploader />}
          {activeTab === "Change Password" && <PasswordChange />}
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;

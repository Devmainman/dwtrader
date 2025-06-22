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
          <UserPhoto
            imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/dbd24adb1dd83e9ecc4df3303b735d935bad46b11312fbc6e15e6e5d1436b2c7?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            name="Showole Benson"
          />
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

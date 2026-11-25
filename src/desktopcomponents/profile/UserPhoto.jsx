"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL, STATIC_BASE_URL } from "../../api/config";

const DEFAULT_AVATAR = "/default-avatar.png";

function UserPhoto() {
  const { token } = useUserAuth();
  const [profile, setProfile] = useState({ name: "", imageUrl: DEFAULT_AVATAR });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        const name = `${data.firstName || ""} ${data.lastName || ""}`.trim();
        const faceImage = data.verification?.faceImage;
        const imageUrl = faceImage
          ? `${STATIC_BASE_URL}/Uploads/face_images/${faceImage}`
          : DEFAULT_AVATAR;

        setProfile({ name, imageUrl });
      } catch (err) {
        console.error("Failed to load user photo:", err);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <div className="flex flex-col justify-center items-center px-20 py-12 h-[358px] w-[520px] rounded-xl bg-[var(--card)] max-md:px-5 max-md:mt-3 max-md:max-w-full">
      <div className="flex flex-col items-center w-auto">
        {/* Profile Image */}
        <div className="flex overflow-hidden items-center justify-center border-solid aspect-square bg-stone-300 border-[5.611px] border-[color:var(--Linear-color,var(--color-blue-700))] rounded-full w-[202px] h-[202px]">
          <img
            src={profile.imageUrl}
            className="object-contain w-full h-full rounded-full"
            alt={profile.name}
          />
        </div>

        {/* Name */}
        <h2 className="mt-7 text-[24px] font-medium tracking-normal leading-normal text-zinc-100 whitespace-nowrap text-center">
          {profile.name}
        </h2>
      </div>
    </div>
  );
}

export default UserPhoto;

"use client";
import React, { useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../../api/config"; // Import your config
import { Link } from "react-router-dom";


const DEFAULT_AVATAR = "/default-avatar.png";

const UserProfileSection = () => {
  const [userData, setUserData] = useState({
    avatarSrc: DEFAULT_AVATAR,
    name: "User",
    id: "N/A",
    accountType: "Basic"
  });
  const [loading, setLoading] = useState(true);
  const [avatarVersion, setAvatarVersion] = useState(0);

  // Move fetchUserProfile outside and memoize it
  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_BASE_URL}/verification/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
      const data = await response.json();
      const faceImageUrl = data.faceImage 
        ? `${API_BASE_URL.replace('/api', '')}/uploads/face_images/${data.faceImage}?v=${Date.now()}`
        : DEFAULT_AVATAR;

      console.log('Updated avatar URL:', faceImageUrl);
      
      setUserData({
        avatarSrc: faceImageUrl,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || "User",
        id: data.accountId || "N/A",
        accountType: getAccountType(data.verification)
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile, avatarVersion]); // Add fetchUserProfile to dependencies

  const getAccountType = (verification) => {
    if (!verification) return "Basic";
    if (verification.identityVerified && verification.addressVerified) {
      return "Verified";
    }
    return "Basic";
  };

  const refreshProfile = () => {
    setAvatarVersion(prev => prev + 1);
  };

  // Add event listener for avatar updates
  useEffect(() => {
    const handleAvatarUpdate = () => refreshProfile();
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdate);
  }, []);

  if (loading) {
    return (
      <header className="flex flex-wrap sm:flex-nowrap justify-between items-start gap-3 px-1 pb-4 w-full border-b border-neutral-800">
        <div className="flex gap-2 items-center flex-1 min-w-0">
          <div className="aspect-square w-[56px] rounded-full bg-neutral-700 animate-pulse" />
          <div className="flex flex-col justify-center truncate gap-1">
            <div className="h-4 w-24 bg-neutral-700 rounded animate-pulse" />
            <div className="h-3 w-16 bg-neutral-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-end text-[10px] shrink-0 gap-1">
          <div className="h-4 w-20 bg-neutral-700 rounded animate-pulse" />
          <div className="h-5 w-12 bg-blue-600 rounded animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="flex flex-wrap sm:flex-nowrap justify-between items-start gap-3 px-1 pb-4 w-full border-b border-neutral-800">
      <div className="flex gap-2 items-center flex-1 min-w-0">
      <img
          src={userData.avatarSrc}
          alt={`${userData.name}'s avatar`}
          className="object-contain shrink-0 aspect-square w-[56px] rounded-full"
          onError={(e) => {
            console.error('Failed to load avatar at:', e.target.src);
            e.target.src = DEFAULT_AVATAR;
            e.target.onerror = null;
          }}
          key={avatarVersion} // Add key to force img remount
        />
        <div className="flex flex-col justify-center truncate">
          <h2 className="text-[14px] font-semibold tracking-normal leading-tight text-zinc-100 truncate">
            {userData.name}
          </h2>
          <p className="mt-1 text-[10px] text-neutral-400 truncate">ID: {userData.id}</p>
        </div>
      </div>

      <div className="flex flex-col items-end text-[10px] shrink-0">
      <Link to="/accountupgrade" className="flex items-center gap-1 text-neutral-400 hover:text-white transition">
        <span className="text-[10px]">Upgrade Account</span>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/266ca8bc990933ddf55584d173124d993b1a6418475a11696c777ed5c97a7f33?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
          alt="Arrow icon"
          className="object-contain w-3.5 aspect-square"
        />
      </Link>

        <div className="text-[9px] font-medium text-center px-2 py-0.5 mt-1.5 bg-blue-600 rounded text-zinc-100">
          {userData.accountType}
        </div>
      </div>
    </header>
  );
};

export default UserProfileSection;
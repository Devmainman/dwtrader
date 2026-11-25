"use client";
import React, { useEffect, useState } from "react";
import { API_BASE_URL, STATIC_BASE_URL } from "../../api/config";
import { useUserAuth } from "../../context/UserAuthContext";

const DEFAULT_AVATAR = "/default-avatar.png";

function UserProfile() {
  const { token } = useUserAuth();

  const [userData, setUserData] = useState(null);

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
        const faceImage = data.verification?.faceImage;
        const avatarSrc = faceImage
          ? `${STATIC_BASE_URL}/Uploads/face_images/${faceImage}`
          : DEFAULT_AVATAR;

        setUserData({
          name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
          email: data.email,
          accountId: data.accountId,
          accountType: data.accountTypeName || "N/A",
          avatarSrc,
          balance: data.balance || 0,
          currency: data.currency || "NGN",
          verification: data.verification || {}
        });
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUser();
  }, [token]);

  const getVerificationIcon = (verified, pending) => {
    if (verified) {
      return "7e08e44d6b8412656f08290baaa3c33b83756fcc2f4f857371297b4d57dfe574"; // verified icon
    } else if (pending) {
      return "05683814a0a600b4a081c281808eb25ab907086f21883e2729b3964cdc1e579b"; // pending icon
    } else {
      return "default-placeholder-id"; // optional fallback
    }
  };

  if (!userData) return null;

  return (
    <section className="w-full max-w-[866px] rounded-[20px] px-5 py-7 border border-neutral-600 bg-[var(--card)] text-white">
      <div className="flex flex-col gap-6">
        {/* Top Row */}
        <div className="flex flex-wrap justify-between items-start gap-6">
          {/* User Info */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-3 text-xs">
              <img
                src={userData.avatarSrc}
                alt="avatar"
                className="w-[66px] h-[66px] rounded-full object-cover"
              />
              <div className="bg-blue-600 px-2 py-1 rounded text-xs">
                {userData.accountType}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{userData.name}</h2>
              <p className="text-[10px] text-neutral-400 leading-snug">
                Email: {userData.email} <br />
                Account ID: {userData.accountId}
              </p>
            </div>
          </div>

          {/* Balance */}
          <div className="flex flex-col items-end w-full sm:w-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/db1bdb401a57bb616a470ae6a857919ff2c5f2c627de547b5750c02b926ffd7d?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="w-[34px] h-[34px] rounded-3xl"
              alt="notification"
            />
            <div className="flex items-end gap-1 mt-4 text-2xl">
              <span>{userData.balance.toLocaleString()}</span>
              <span className="text-base text-stone-300">{userData.currency}</span>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-wrap justify-between items-start gap-6">
          {/* Description */}
          <p className="text-[10px] text-neutral-400 w-full sm:w-[278px] leading-relaxed">
            Effortlessly manage trades with real-time updates on performance,
            explore tailored opportunities, and stay informed with detailed
            reports. Our support team is ready to assist you.
          </p>

          {/* Verifications & Buttons */}
          <div className="flex flex-col gap-4 w-full sm:w-[337px]">
            <div className="flex flex-wrap gap-2 text-[8px] text-neutral-400">
              {[
                {
                  label: "Identity Verification",
                  verified: userData.verification?.identityVerified,
                  pending: userData.verification?.identityDocuments?.length > 0
                },
                {
                  label: "Facial Verification",
                  verified: userData.verification?.faceVerified,
                  pending: !!userData.verification?.faceImage
                },
                {
                  label: "Address Verification",
                  verified: userData.verification?.addressVerified,
                  pending: !!userData.verification?.proofOfAddress?.image
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <img
                    src={`https://cdn.builder.io/api/v1/image/assets/TEMP/${getVerificationIcon(item.verified, item.pending)}?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8`}
                    className="w-6 h-6"
                    alt={item.label}
                  />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 text-xs font-medium">
              <button className="flex-1 py-2.5 rounded-3xl border border-neutral-600 bg-neutral-800">
                Withdraw
              </button>
              <button className="flex-1 py-2.5 rounded-3xl bg-blue-600">
                Deposit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;

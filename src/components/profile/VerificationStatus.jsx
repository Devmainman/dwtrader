"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, XCircle, FileQuestion } from 'lucide-react';
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL } from "../../api/config";

export default function VerificationStatus() {
  const { user, token } = useUserAuth();
  const [verificationStatus, setVerificationStatus] = useState({
    identity: { status: "not-submitted", label: "Identity Verification" },
    facial: { status: "not-submitted", label: "Facial Verification" },
    address: { status: "not-submitted", label: "Address Verification" }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        if (!user || !token) return;
        
        const response = await fetch(`${API_BASE_URL}/verification/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error("Failed to fetch verification status");
        
        const data = await response.json();
        
        // Map backend status to frontend display status
        const mapStatus = (verified, exists) => {
          if (verified) return "verified";
          if (exists) return "pending";
          return "not-submitted";
        };
        
        setVerificationStatus({
          identity: {
            status: mapStatus(
              data.verification?.identityVerified,
              data.verification?.identityDocuments?.length > 0
            ),
            label: "Identity Verification"
          },
          facial: {
            status: mapStatus(
              data.verification?.faceVerified,
              !!data.verification?.faceImage
            ),
            label: "Facial Verification"
          },
          address: {
            status: mapStatus(
              data.verification?.addressVerified,
              !!data.verification?.proofOfAddress?.image
            ),
            label: "Address Verification"
          }
        });
      } catch (error) {
        console.error("Error fetching verification status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationStatus();
  }, [user, token]);

  const getStatusIcon = (status) => {
    const size = 24;
    switch(status) {
      case "verified":
        return <CheckCircle className="text-green-500" size={size} />;
      case "pending":
        return <Clock className="text-yellow-500" size={size} />;
      case "rejected":
        return <XCircle className="text-red-500" size={size} />;
      default:
        return <FileQuestion className="text-gray-500" size={size} />;
    }
  };

  if (loading) {
    return (
      <section className="flex flex-col justify-center px-5 py-4 mt-5 rounded-xl border border-solid bg-[#1D1D1F] border-neutral-800 text-neutral-400 overflow-x-auto hide-scrollbar hover:scrollbar-thin hover:scrollbar-thumb-neutral-700 hover:scrollbar-track-transparent">
        <div className="flex flex-nowrap gap-5 items-center whitespace-nowrap min-w-max">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex flex-col justify-center items-center self-stretch my-auto">
              <div className="bg-gray-700 rounded-full w-6 h-6 animate-pulse" />
              <div className="mt-1.5 bg-gray-700 rounded w-24 h-3 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col  text-[10px] justify-center px-5 py-4 mt-5 rounded-xl border border-solid bg-[#1D1D1F] border-neutral-800 text-neutral-400 overflow-x-auto hide-scrollbar hover:scrollbar-thin hover:scrollbar-thumb-neutral-700 hover:scrollbar-track-transparent">
      <div className="flex flex-nowrap gap-5 items-center whitespace-nowrap min-w-max">
        {Object.entries(verificationStatus).map(([key, item]) => (
          <div 
            key={key} 
            className="group relative flex flex-col justify-center items-center self-stretch my-auto"
          >
            {getStatusIcon(item.status)}
            <p className="mt-1.5">{item.label}</p>
            
            {/* Status tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white  text-[10px] rounded py-1 px-2 z-10">
              {item.status === "verified" && "Your documents have been approved"}
              {item.status === "pending" && "Your documents are under review"}
              {item.status === "rejected" && "Please resubmit your documents"}
              {item.status === "not-submitted" && "Please complete this verification"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
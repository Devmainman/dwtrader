"use client";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import axios from "axios";
import { API_BASE_URL } from "../../api/config";

const ReferredUser = ({ user }) => {
  return (
    <div className="flex overflow-hidden flex-col justify-center items-start px-5 py-2.5 w-full rounded-md bg-[#1D1D1F]">
      <div className="flex gap-2 items-center">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={`${user.firstName}'s avatar`}
          className="object-contain shrink-0 self-stretch my-auto aspect-square w-[42px] rounded-full"
        />
        <div className="flex flex-col">
          <span className="text-sm">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-gray-400">
            Joined: {new Date(user.joinedDate).toLocaleDateString()}
          </span>
          <span className="text-xs text-green-400">
            Bonus Earned: ${user.bonusEarned?.toFixed(2) || "0.00"}
          </span>
        </div>
      </div>
    </div>
  );
};

const ReferredUsersList = () => {
  const { user, token } = useUserAuth();
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferredUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/referrals/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReferredUsers(response.data.referrals);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch referrals");
      } finally {
        setLoading(false);
      }
    };
  
    if (token) {
      fetchReferredUsers();
    }
  }, [token]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="mt-2.5 w-full text-xs tracking-normal leading-none text-zinc-100">
      {referredUsers.length > 0 ? (
        referredUsers.map((user, index) => (
          <div key={user._id} className={index > 0 ? "mt-2" : ""}>
            <ReferredUser user={user} />
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-400">
          No referred users yet
        </div>
      )}
    </div>
  );
};

export default ReferredUsersList;
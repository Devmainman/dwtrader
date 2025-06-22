"use client";
import React from "react";

function UserProfile() {
  return (
    <section className="w-full max-w-[708px] px-5 py-7 rounded-xl border border-neutral-600 bg-[#1D1D1F] text-white">
      <div className="flex flex-col gap-6">
        {/* Top Row */}
        <div className="flex flex-wrap justify-between items-start gap-6">
          {/* User Info */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-3 text-xs">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e15fec68fb604c500819c100d0233f92c027293cc9b0c66562b0a18b3cb775ee?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="avatar"
                className="w-[66px] h-[66px] rounded-full"
              />
              <div className="bg-blue-600 px-2 py-1 rounded text-xs">Basic</div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Benson Showole</h2>
              <p className="text-[10px] text-neutral-400">
                Email: showoleadeyemibenson@gmail.co <br />
                Account ID: USR7719462596
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
              <span>5,576,910.00</span>
              <span className="text-base text-stone-300">NGN</span>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-wrap justify-between items-start gap-6">
          {/* Description */}
          <p className="text-[10px] text-neutral-400 w-full sm:w-[278px]">
            Effortlessly manage trades with real-time updates on performance,
            explore tailored opportunities, and stay informed with detailed
            reports. Our support team is ready to assist you.
          </p>

          {/* Verifications & Buttons */}
          <div className="flex flex-col gap-4 w-full sm:w-[337px]">
            <div className="flex flex-wrap gap-2 text-[8px] text-neutral-400">
              {[
                { label: "Identity Verification", img: "7e08e44d6b8412656f08290baaa3c33b83756fcc2f4f857371297b4d57dfe574" },
                { label: "Facial Verification", img: "05683814a0a600b4a081c281808eb25ab907086f21883e2729b3964cdc1e579b" },
                { label: "Address Verification", img: "7e08e44d6b8412656f08290baaa3c33b83756fcc2f4f857371297b4d57dfe574" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <img
                    src={`https://cdn.builder.io/api/v1/image/assets/TEMP/${item.img}?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8`}
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

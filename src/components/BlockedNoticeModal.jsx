import React from "react";
import { AlertTriangle } from "lucide-react";

function BlockedNoticeModal({ reason = "Your account has been suspended due to a violation of our terms." }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#1D1D1F] border border-neutral-700 rounded-3xl p-6 max-w-md w-full text-center shadow-xl text-white relative">
        {/* Alert Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-500/10 p-4 rounded-full">
            <AlertTriangle className="text-yellow-400 w-8 h-8" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-zinc-100 mb-2">Your Account Has Been Restricted</h2>

        {/* Reason */}
        <p className="text-xs text-neutral-500 space-y-3 mb-5 text-left">
          {reason}
        </p>

        {/* Contact Support */}
        <button
          onClick={() => window.location.href = "/support"}
          className="bg-yellow-500 text-black font-semibold py-2 px-5 rounded-full hover:bg-yellow-400 transition-all"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}

export default BlockedNoticeModal;

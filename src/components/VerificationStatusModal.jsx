import React from 'react';
import { X } from 'lucide-react';

const VerificationStatusModal = ({ show, onClose, emailRequested, phoneRequested }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-60 flex items-center justify-center">
      <div className="bg-[#1D1D1F] text-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 relative">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-[12px] font-semibold text-white mb-4">Action Required</h2>

        <div className="space-y-3 text-[10px] text-yellow-500">
          {emailRequested && (
            <p>
              Please verify your <span className="text-white font-medium">email address</span>. Check your inbox or contact support if you haven’t received a link.
            </p>
          )}
          {phoneRequested && (
            <p>
              Please verify your <span className="text-white font-medium">phone number</span>. You may receive a code or be prompted to verify it shortly.
            </p>
          )}
        </div>
          <div className='flex text-[12px] justify-end'>
          <button
          onClick={onClose}
          className="mt-6 w-[80px] bg-blue-600 text-white font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Got it
        </button>
          </div>
       
      </div>
    </div>
  );
};

export default VerificationStatusModal;

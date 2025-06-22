import React from 'react';

const Modal = ({ isOpen, onClose, title, message, type = 'info', buttonLabel = 'Close' }) => {
  if (!isOpen) return null;

  const colorThemes = {
    success: 'bg-[#161617] text-green-500',
    error: 'bg-[#161617] text-red-500',
    warning: 'bg-[#161617] text-yellow-500',
    info: 'bg-[#161617] text-blue-500',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className={`w-full max-w-sm rounded-xl p-5 ${colorThemes[type]} shadow-lg`}>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm mb-4">{message}</p>
        <button
          onClick={onClose}
          className={`bg-white text-black py-2 px-4 rounded-full text-sm font-medium hover:bg-gray-100 transition-all`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default Modal;

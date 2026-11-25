import React from 'react';

const Modal = ({ isOpen, onClose, title, message, type = 'info', buttonLabel = 'Close' }) => {
  if (!isOpen) return null;

  const colorThemes = {
    success: 'bg-[var(--page)] text-green-500',
    error: 'bg-[var(--page)] text-red-500',
    warning: 'bg-[var(--page)] text-yellow-500',
    info: 'bg-[var(--page)] text-blue-500',
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

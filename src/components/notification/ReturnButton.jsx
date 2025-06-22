import React from "react";

const ReturnButton = ({ onClick }) => {
  return (
    <button
      className="p-2.5 text-xs leading-4 text-center text-white bg-blue-600 rounded-xl w-full"
      onClick={onClick}
    >
      Back to Notifications
    </button>
  );
};

export default ReturnButton;

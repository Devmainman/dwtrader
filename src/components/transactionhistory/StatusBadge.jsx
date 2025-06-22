import React from "react";

function StatusBadge({ status }) {
  // Determine badge color based on status
  const getBadgeClasses = () => {
    switch (status) {
      case "Completed":
        return "bg-green-700";
      case "Failed":
        return "bg-red-600";
      case "Pending":
      default:
        return "bg-yellow-700";
    }
  };

  return (
    <div
      className={`gap-3 self-stretch text-[8px] py-0.5 pr-2 pl-2 whitespace-nowrap ${getBadgeClasses()} rounded ${
        status === "Failed" ? "w-[50px]" : ""
      }`}
    >
      {status}
    </div>
  );
}

export default StatusBadge;

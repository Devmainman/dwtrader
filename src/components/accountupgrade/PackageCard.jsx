import React from "react"; 
import checkSVG from "../../assets/lets-icons_check-fill.svg";

function PackageCard({ title, price, features, isActive, onSubscribe, icon }) {
  // Construct the full icon URL using your API base URL
  const iconUrl = icon ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${icon}` : null;

  return (
    <div
      className={`snap-center h-[470px] flex-shrink-0 rounded-[20px] border border-[#505050] shadow-md px-3 py-3 text-white transition-all duration-300 ${
        isActive
          ? "bg-[#1D1D1F] w-[286px] h-[390px]"
          : "bg-[#1D1D1F] w-[286px] h-[390px]"
      }`}
    >
      <div className="mb- text-center">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={`${title} package`}
            className="mx-auto w-24 h-24 mb-2 object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-package-icon.png'; // Fallback image
              // Or show the text fallback:
              // e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="mx-auto w-24 h-24 mb-2 flex items-center justify-center bg-gray-700 rounded-full">
            <span className="text-lg font-bold">{title}</span>
          </div>
        )}
      </div>

      <h2 className="text-center text-lg font-semibold mb-3">{title}</h2>
      <p className="text-center text-yellow-400 mb-4">{price}</p>

      <ul className="space-y-3 text-[10px] text-stone-300">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <img
              src={checkSVG}
              alt="check"
              className="mr-2"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="text-center">
        {isActive && (
          <button
            onClick={onSubscribe}
            className="w-full text-[12px] bg-transparent border border-blue-500 text-[#F3F3F3] rounded-full py-2 mt-4 hover:bg-blue-500 hover:text-white transition-all"
          >
            Subscribe
          </button>
        )}
      </div>
    </div>
  );
}

export default PackageCard;
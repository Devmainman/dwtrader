import { STATIC_BASE_URL } from '../../api/config';
import checkSVG from "../../assets/lets-icons_check-fill.svg";

function SignalPackageCard({
  title,
  price,
  features,
  isActive,
  icon,
  onProceed   // receive from parent
}) {
  const iconUrl = icon
    ? `${STATIC_BASE_URL}${icon}`
    : null;

  return (
    <div className="snap-center h-auto flex-shrink-0 rounded-[20px] border border-[#505050] shadow-md px-3 py-3 text-white bg-[#1D1D1F] w-[286px]">
      
      {/* Icon */}
      <div className="text-center">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={title}
            className="mx-auto w-24 h-24 mb-2 object-contain"
          />
        ) : (
          <div className="mx-auto w-24 h-24 mb-2 flex items-center justify-center bg-gray-700 rounded-full">
            <span className="text-lg font-bold">{title}</span>
          </div>
        )}
      </div>

      <h2 className="text-center text-lg font-semibold mb-3">{title}</h2>
      <p className="text-center text-yellow-400 mb-4">{price}</p>

      <ul className="space-y-3 text-[10px] text-stone-300 mb-4">
        {features?.map((feature, i) => (
          <li key={i} className="flex items-start">
            <img src={checkSVG} alt="check" className="mr-2 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Buttons */}
      <div className="hidden md:block">
        <button
          onClick={onProceed}   // delegate
          className="flex overflow-hidden text-white justify-center items-center self-center px-2 py-1 mt-5 w-full bg-blue-600 rounded-full text-[12px]"
        >
          <div className="flex flex-col justify-center items-center">
            <span>Proceed with Plan</span>
            <p className="text-center">{price}</p>
          </div>
        </button>
      </div>

      <div className="md:hidden text-center">
        {isActive && (
          <button
            onClick={onProceed}  // delegate
            className="w-full text-[12px] bg-transparent border border-blue-500 text-[#F3F3F3] rounded-full py-2 mt-4 hover:bg-blue-500 hover:text-white transition-all"
          >
            Subscribe
          </button>
        )}
      </div>
    </div>
  );
}
export default SignalPackageCard;
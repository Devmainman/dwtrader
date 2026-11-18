import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import checkSVG from "../../assets/lets-icons_check-fill.svg";
import PaymentMethodSelector from "../../components/subscribe/PaymentMethodSelector";
import PaymentForm from "../../components/subscribe/PaymentForm";
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL, STATIC_BASE_URL } from "../../api/config";
import axios from "axios";

function PackageCard({ title, price, currency, features, isActive, onSubscribe, icon, packageId, amount, requiredSignal = 0, userSignal = 0, paymentPending = false }) {
  const { token, user } = useUserAuth();
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const iconUrl = icon ? `${STATIC_BASE_URL}${icon}` : null;

  // The plans page decides what happens (pay, or explain why not).
  const handleProceed = () => onSubscribe?.(packageId);
  const short = requiredSignal > userSignal;

  useEffect(() => {
    const fetchMethods = async () => {
      if (!token || !showPaymentSection) return;
      setLoadingMethods(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/payments/methods`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data?.data || res.data;
        if (!Array.isArray(data)) throw new Error("Invalid method format");
        setMethods(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load payment methods");
      } finally {
        setLoadingMethods(false);
      }
    };

    fetchMethods();
  }, [token, showPaymentSection]);

  return (
    <div
      className={`snap-center h-auto flex-shrink-0 rounded-[20px] border border-[#505050] shadow-md px-3 py-3 text-white transition-all duration-300 ${
        isActive ? "bg-[#1D1D1F] w-[286px]" : "bg-[#1D1D1F] w-[286px]"
      }`}
    >
      {/* Icon Section */}
      <div className="text-center">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={`${title} package`}
            className="mx-auto w-24 h-24 mb-2 object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-package-icon.png';
            }}
          />
        ) : (
          <div className="mx-auto w-24 h-24 mb-2 flex items-center justify-center bg-gray-700 rounded-full">
            <span className="text-lg font-bold">{title}</span>
          </div>
        )}
      </div>

      {/* Title and Price */}
      <h2 className="text-center text-lg font-semibold mb-3">{title}</h2>
      <p className={`text-center text-yellow-400 ${requiredSignal > 0 || paymentPending ? "mb-1" : "mb-4"}`}>{price}{currency}</p>
      {paymentPending ? (
        <p className="text-center text-[10px] text-blue-400 mb-4">Payment under review</p>
      ) : requiredSignal > 0 ? (
        <p className={`text-center text-[10px] mb-4 ${short ? "text-red-400" : "text-neutral-400"}`}>
          Needs {requiredSignal}% signal strength{short ? ` (you have ${userSignal}%)` : ""}
        </p>
      ) : null}

      {/* Feature List */}
      <ul className="space-y-3 text-[10px] text-stone-300 mb-4">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <img src={checkSVG} alt="check" className="mr-2 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Buttons */}
      <div className="hidden md:block">
        <button
          onClick={() => handleProceed()}
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
            onClick={() => handleProceed()}
            className="w-full text-[12px] bg-transparent border border-blue-500 text-[#F3F3F3] rounded-full py-2 mt-4 hover:bg-blue-500 hover:text-white transition-all"
          >
            Subscribe
          </button>
        )}
      </div>

      {/* Payment Section */}
      {showPaymentSection && (
        <div className="mt-4">
          {!selectedMethod ? (
            <>
              <h4 className="text-[10px] font-semibold text-left text-gray-300 mb-2">
                Select Payment Method
              </h4>
              {loadingMethods ? (
                <div className="text-[10px] text-gray-400">Loading methods...</div>
              ) : error ? (
                <div className="text-[10px] text-red-400">{error}</div>
              ) : (
                <div className="max-h-[150px] overflow-y-auto">
                  <PaymentMethodSelector methods={methods} onSelect={setSelectedMethod} />
                </div>
              )}
            </>
          ) : (
            <PaymentForm
            mode="account"
              method={methods.find((m) => m.methodId === selectedMethod)}
              onBack={() => setSelectedMethod(null)}
              onDepositResult={(msg, type) => {
                alert(msg);
                if (type === 'success') {
                  setShowPaymentSection(false);
                }
              }}
              forceAmount={amount}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default PackageCard;

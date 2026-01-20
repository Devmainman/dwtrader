import React, { useState, useEffect } from "react";
import checkSVG from "../../assets/lets-icons_check-fill.svg";
import PaymentMethodSelector from "../../components/subscribe/PaymentMethodSelector";
import PaymentForm from "../../components/subscribe/PaymentFormSignal";
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL } from "../../api/config";
import axios from "axios";

function SignalPackageCard({
  title,
  price,
  features,
  isActive,
  icon,
  packageId,
  amount,
  currency 
}) {
  const { token } = useUserAuth();

  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [error, setError] = useState("");

  const iconUrl = icon
    ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${icon}`
    : null;

  /* FETCH PAYMENT METHODS */
  useEffect(() => {
    const fetchMethods = async () => {
      if (!token || !showPaymentSection) return;

      setLoadingMethods(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/payments/methods`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data || res.data;
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
    <div className="snap-center h-auto flex-shrink-0 rounded-[20px] border border-[#505050] shadow-md px-3 py-3 text-white bg-[#1D1D1F] w-[286px]">

      {/* Icon */}
      <div className="text-center">
        {iconUrl ? (
          <img src={iconUrl} alt={title} className="mx-auto w-24 h-24 mb-2 object-contain" />
        ) : (
          <div className="mx-auto w-24 h-24 mb-2 flex items-center justify-center bg-gray-700 rounded-full">
            <span className="text-lg font-bold">{title}</span>
          </div>
        )}
      </div>

      <h2 className="text-center text-lg font-semibold mb-2">{title}</h2>
      <p className="text-center text-yellow-400 mb-4">
        {currency} {amount}
      </p>


      <ul className="space-y-3 text-[10px] text-stone-300 mb-4">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <img src={checkSVG} alt="check" className="mr-2 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* BUTTON */}
      {isActive && !showPaymentSection && (
        <button
          onClick={() => setShowPaymentSection(true)}
          className="w-full text-[12px] bg-blue-600 rounded-full py-2 mt-4"
        >
          Proceed to Payment
        </button>
      )}

      {/* PAYMENT SECTION */}
      {showPaymentSection && (
        <div className="mt-4">

          {!selectedMethod ? (
            <>
              <h4 className="text-[10px] mb-2">Select Payment Method</h4>

              {loadingMethods ? (
                <div className="text-[10px]">Loading...</div>
              ) : error ? (
                <div className="text-[10px] text-red-400">{error}</div>
              ) : (
                <PaymentMethodSelector
                  methods={methods}
                  onSelect={setSelectedMethod}
                />
              )}
            </>
          ) : (
            <PaymentForm
              
              method={methods.find((m) => m.methodId === selectedMethod)}
              onBack={() => setSelectedMethod(null)}
              forceAmount={amount}

              /* 🔥 FINAL SUBMIT FOR SIGNAL */
              onDepositResult={async (msg, type, proofFile) => {
              if (type !== 'success') return;

              try {
                const formData = new FormData();
                formData.append("packageId", packageId);
                formData.append("paymentMethod", selectedMethod);
                formData.append("paymentProof", proofFile);   // 🔥 REAL FILE

                await axios.post(
                  `${API_BASE_URL}/signal-upgrade/upgrade`,
                  formData,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "multipart/form-data"
                    }
                  }
                );

                alert("Payment submitted. Awaiting approval.");
                setShowPaymentSection(false);

              } catch (err) {
                console.error(err.response?.data || err);
                alert("Failed to submit signal payment");
              }
            }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default SignalPackageCard;

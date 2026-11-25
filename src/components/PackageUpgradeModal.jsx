import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useBalance } from '../context/BalanceContext';
import axios from 'axios';
import { API_BASE_URL, STATIC_BASE_URL } from '../api/config';
import PaymentMethodSelector from './upgrade/PaymentMethodSelector';
import PaymentForm from './upgrade/PaymentForm';

const PackageUpgradeModal = ({ show, onClose }) => {
  const { user, token } = useUserAuth();
  const { currency } = useBalance();
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);

  const pending = user?.pendingPackage;

  useEffect(() => {
    if (!show || !token) return;

    const fetchMethods = async () => {
      setLoadingMethods(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/payments/methods`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data?.data || res.data;
        if (!Array.isArray(data)) throw new Error('Invalid method format');
        setMethods(data);
      } catch (err) {
        setError('Failed to load payment methods');
      } finally {
        setLoadingMethods(false);
      }
    };

    fetchMethods();
  }, [show, token]);

  const handleMarkAsSeenAndClose = () => {
  if (pending?._id) {
    localStorage.setItem(`seenPackage_${pending._id}`, 'true');
  }
  onClose(); // Close modal
};


  if (!show || !pending) return null;

  const iconUrl = pending.icon
    ? `${STATIC_BASE_URL}${pending.icon}`
    : null;

    
  const handleCopyAmount = () => {
    navigator.clipboard.writeText(pending.amount.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 text-white rounded-2xl lg:w-[1126px] w-full shadow-lg p-6">
        <h2 className="text-[12px] font-bold text-center text-red-500 mb-2">
          Account Upgrade Required
        </h2>

        {!showPaymentSection && (
          <div className="flex flex-col items-center ">
            {iconUrl && (
              <img
                src={iconUrl}
                alt={pending.name}
                className="w-20 h-20 object-contain mb-1"
                onError={(e) => (e.target.src = '/default-package-icon.png')}
              />
            )}

            <h3 className="text-[14px] font-semibold">{pending.name}</h3>
            <p className="text-yellow-400 text-[10px] mb-3">
              Amount: ${pending.amount}
            </p>

            <div className="text-[8px] text-gray-300 p-3 rounded-lg w-full max-w-sm mb-1 space-y-1">
              {pending.benefits?.map((benefit, i) => (
                <div key={i} className="flex items-start gap-2">
                  <img src="/icons/check.svg" className="w-3 h-3 mt-0.5" alt="check" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-gray-400 mb-4">
              You must complete payment to activate this package.
            </div>
              <div className="lg:flex lg:w-[230px] lg:justify-end lg:item-start">
            <button
              onClick={() => setShowPaymentSection(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full text-[8px] font-medium transition"
            >
              Pay Now
            </button>
              </div>
            {/* <button
              onClick={onClose}
              className="mt-4 text-[8px] text-gray-400 hover:text-white transition"
            >
              Cancel
            </button> */}
          </div>
        )}

        {showPaymentSection && (
          <div className="w-full">
            {!selectedMethod ? (
              <>
              <div className="w-full bg-[var(--card)] p-4 rounded-lg border border-gray-700 flex justify-between items-center text-[10px] mb-4">
              <div>
                <div className="text-gray-400">Package</div>
                <div className="font-semibold">{pending.name}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-400">Amount</div>
                <div className="font-semibold flex items-center gap-2">
                  ${pending.amount}
                  <button
                    onClick={handleCopyAmount}
                    className="text-blue-400 text-xs"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
                <h4 className="text-[12px] font-semibold text-left text-gray-200 mb-2">
                  Select Payment Method
                </h4>
                {loadingMethods ? (
                  <div className="text-center text-gray-400">Loading methods...</div>
                ) : error ? (
                  <div className="text-center text-red-400">{error}</div>
                ) : (
                  <div className="max-h-[300px] w-full overflow-y-auto">
                    <PaymentMethodSelector
                      methods={methods}
                      onSelect={setSelectedMethod}
                    />
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowPaymentSection(false)}
                    className="text-sm bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Back
                  </button>
                </div>
              </>
            ) : (
              <>
              <div className="max-h-[500px] overflow-y-auto">
              <PaymentForm
                method={methods.find((m) => m.methodId === selectedMethod)}
                onBack={() => setSelectedMethod(null)}
                onDepositResult={(msg, type) => {
                  alert(msg);
                  if (type === 'success') handleMarkAsSeenAndClose();
                }}
                forceAmount={pending?.amount}
              />
              </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageUpgradeModal;

import { useState, useRef } from 'react';
import axios from 'axios';
import { useUserAuth } from '../../context/UserAuthContext';
import { API_BASE_URL, STATIC_BASE_URL } from '../../api/config';
import { useBalance } from '../../context/BalanceContext';

const PaymentForm = ({ method, onBack, onDepositResult, forceAmount }) => {
  const { token, user } = useUserAuth();
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currency } = useBalance();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const fileInputRef = useRef(null);
  

  const copyIconUrl = "https://cdn.builder.io/api/v1/image/assets/TEMP/2fd1f31c640e4a8bc61ad64aa34bd7d9e147f00417163c84ba0f049ad7bf2b6f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8";
  const checkmarkIconUrl = "https://cdn.builder.io/api/v1/image/assets/TEMP/2fd1f31c640e4a8bc61ad64aa34bd7d9e147f00417163c84ba0f049ad7bf2b6f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8";

  const handleSubmit = async (e) => {
  e.preventDefault();

  const finalAmount = forceAmount;

  if (!finalAmount) {
    setError('Amount is required.');
    return;
  }

  if (!file) {
    setError('Please upload payment proof');
    return;
  }

  setLoading(true);
  setError('');

  try {
    // NEW: mark that payment has been started
    if (user?.pendingPackage?._id) {
      await axios.post(`${API_BASE_URL}/users/package-upgrade/start`, {
        pendingPackageId: user.pendingPackage._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
          // Mark this pending package as seen in localStorage
    localStorage.setItem(`seenPackage_${user.pendingPackage._id}`, 'true');
    }

    // Submit payment
    const formData = new FormData();
    formData.append('paymentMethod', method.methodId);
    formData.append('amount', finalAmount);
    formData.append('currency', currency);
    formData.append('paymentProof', file);

    await axios.post(`${API_BASE_URL}/upgradeinvoices`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    setAmount('');
    setFile(null);

    if (onDepositResult) {
      onDepositResult('Deposit completed successfully!', 'success');
    }
  } catch (err) {
    console.error('Deposit error:', err);
    const errorMsg = err.response?.data?.message || 'Deposit submission failed';
    setError(errorMsg);
    if (onDepositResult) {
      onDepositResult(`Deposit failed: ${errorMsg}`, 'error');
    }
  } finally {
    setLoading(false);
  }
};

  

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const copyToClipboard = (text, index) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const iconUrl = method.icon
    ? `${STATIC_BASE_URL}${method.icon.replace(/^\/icons\//, '/icons/')}`
    : '/icons/default.png';

  const truncate = (text, maxLength = 10) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

 return (
  <div className="w-full mt-2 grid grid-cols-1 xl:grid-cols-[889px_370px] gap-4 px-0">
    {/* Unified Left Section: Bank Info + Upload + Submit */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:bg-[var(--card)] lg:rounded-3xl p-6">

      {/* Left: Bank Info + Amount */}
      <div className="space-y-6">
        <h2 className="text-base text-[var(--fg-2)] mb-6">Select Payment Method</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="text-[14px] font-semibold text-gray-300">{method?.title || 'Payment Method'}</h1>
          </div>
          <div className="bg-gray-700 p-2 rounded-full">
            <img
              src={iconUrl}
              alt={method.title}
              className="h-6 w-6 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/icons/default.png';
              }}
            />
          </div>
        </div>

        {/* Bank Details */}
        {method?.details && (
          <div className="space-y-4">
            {method.details.map((detail, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-[10px] font-semibold text-neutral-400">{detail.label}:</span>
                {detail.isSensitive ? (
                  <span className="text-white">••••••••</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] h-[36px] flex justify-between items-center rounded-md bg-[var(--card)] text-zinc-100 px-3 py-1.5 w-[243px] text-right truncate">
                      {truncate(detail.value)}
                      <button
                        onClick={() => copyToClipboard(detail.value, index)}
                        className="flex items-center gap-1 text-[9px] text-blue-400"
                      >
                        <img
                          src={copiedIndex === index ? checkmarkIconUrl : copyIconUrl}
                          alt={copiedIndex === index ? "Copied" : "Copy now"}
                          className="object-contain w-3.5 aspect-square"
                        />
                        <span>{copiedIndex === index ? "Copied" : "Copy now"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-gray-400 text-[10px]">Amount ({currency})</label>
          {forceAmount ? (
            <div className="w-full h-[52px] bg-[var(--card)] text-[10px] text-white p-4 rounded-lg flex items-center">
              {forceAmount}
            </div>
          ) : (
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Deposit Amount (${currency})`}
              className="w-full h-[52px] bg-[var(--card-2)] text-[10px] text-white p-4 rounded-lg border-none outline-none placeholder-gray-500"
              min={method?.minAmount || 0}
              max={method?.maxAmount || ''}
              required
            />
          )}
        </div>
      </div>

      {/* Right: Upload + Submit */}
      <div className="space-y-6">
        {/* Upload Proof */}
        <div className="space-y-2">
          <label className="text-gray-400 text-[10px]">Upload payment proof</label>
          <div className="bg-[var(--card)] p-5 rounded-[10px]">
            <div className="bg-[var(--card-2)] rounded-[10px] p-4 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="payment-proof"
                accept="image/*"
              />
              <label htmlFor="payment-proof" className="cursor-pointer">
                {file ? (
                  <div className="text-blue-500">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-600 rounded-full flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(file)}
                        className="object-contain aspect-square w-[47px] rounded"
                        alt="Upload preview"
                      />
                    </div>
                    <span className="text-blue-500 text-xs block truncate max-w-[200px] mx-auto">{file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/8893c6a2e312a965b276c0a79248829998e46f8d?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                      className="object-contain aspect-square w-[47px]"
                      alt="Upload icon"
                    />
                    <div className="mt-1">
                      <p className="text-[12px] font-medium text-zinc-100">Upload Image</p>
                      <p className="mt-1.5 text-[8px] text-neutral-400">Image size must be less than 2MB</p>
                    </div>
                  </div>
                )}
              </label>
              <div className="flex justify-center mt-4">
                <button
                  onClick={triggerFileInput}
                  className="px-2.5 py-1 text-[10px] bg-blue-600 rounded-3xl text-zinc-100 w-[86px]"
                >
                  {file ? 'Change' : 'Select Image'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error + Submit */}
        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-center text-xs">{error}</div>}
        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className="w-full h-[42px] bg-blue-500 text-white rounded-full font-medium text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </div>
    </div>

    {/* Instructions */}
    <div className="flex justify-center items-start">
      <article className="overflow-hidden w-full lg:max-w-[290px] px-3 py-4 rounded-xl bg-[var(--card)]">
        <header className="font-medium">
          <div className="flex gap-2.5 items-center text-[14px] text-zinc-100">
            <h2 className="flex-1">Let's Proceed with that Upgrade</h2>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/28f76ca51ab932c417ae5480603e7ceb025031fd?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain aspect-square w-[18px]"
              alt="Info icon"
            />
          </div>
          <p className="mt-3 text-[10px] text-neutral-500">
            To make a Upgrade, please follow these simple steps:
          </p>
        </header>
        <div className="flex gap-1.5 items-start mt-1.5 text-[10px] leading-4 text-neutral-400">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain aspect-square w-[18px]"
            alt="Step"
          />
          <p className="flex-1">Initiate the payment by transferring the funds to the provided details.</p>
        </div>
        <div className="flex gap-1.5 items-start mt-4 text-[10px] leading-4 text-neutral-400">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain aspect-square w-[18px]"
            alt="Step"
          />
          <p className="flex-1">
            Upload the proof of payment in the section provided to ensure quick account updates.
          </p>
        </div>
        <p className="mt-4 text-[10px] text-neutral-400">
          Once completed, our team will verify and credit your account. Need help? Contact support.
        </p>
      </article>
    </div>
  </div>
);

};

export default PaymentForm;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserAuth } from '../../../context/UserAuthContext';
import { useBalance } from '../../../context/BalanceContext'; // Import balance context
import { API_BASE_URL, STATIC_BASE_URL } from '../../../api/config';
import Logo from "../../../assets/image-2.svg";
import Modal from './Modal';

// Create a separate axios instance for public routes
const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const WithdrawalForm = ({ method, onBack }) => {
  const { user, token } = useUserAuth();
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: '' });
  const { balance, currency, updateBalance } = useBalance(); // Get balance context
  const [formData, setFormData] = useState({
    amount: '',
    withdrawalToken: '',
    ...(method.details.reduce((acc, detail) => {
      acc[detail.label.toLowerCase().replace(/\s+/g, '_')] = '';
      return acc;
    }, {}))
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const iconUrl = method.icon 
    ? `${STATIC_BASE_URL}${method.icon.replace(/^\/icons\//, '/icons/')}`
    : '/icons/default.png';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const details = method.details.map(detail => ({
        label: detail.label,
        value: formData[detail.label.toLowerCase().replace(/\s+/g, '_')]
      }));
  
      const response = await axios.post(`${API_BASE_URL}/withdrawals`, {
        methodId: method.methodId,
        amount: parseFloat(formData.amount),
        details,
        token: formData.withdrawalToken
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.data.success) {
        updateBalance(balance - parseFloat(formData.amount));
        setModal({
          isOpen: true,
          title: 'Withdrawal Submitted',
          message: 'Your withdrawal request was successful and is being processed.',
          type: 'success'
        });
        setSuccess(true);
      } else {
        throw new Error('Unexpected response');
      }
      
    } catch (err) {
      setModal({
        isOpen: true,
        title: 'Error',
        message: err.response?.data?.message || 'Something went wrong with your withdrawal.',
        type: 'error'
      });
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#161617] w-full min-h-screen text-white p-4">
      <Modal
  isOpen={modal.isOpen}
  title={modal.title}
  message={modal.message}
  type={modal.type}
  onClose={() => setModal({ ...modal, isOpen: false })}
/>

      <button 
        onClick={onBack}
        className="flex items-center text-gray-400 mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="ml-2 text-[10px]">Back to methods</span>
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[16px] font-medium text-[#C7C7C7]">Make Withdrawal</h1>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <img
              src={iconUrl}
              alt={`${method.title} icon`}
              className="w-full h-full object-contain rounded-full bg-[#2A2A2A] p-1"
              onError={(e) => {
                console.log('Form Icon load error:', iconUrl);
                e.target.src = '/icons/default.png';
              }}
            />
          </div>
          <span className="text-[#C7C7C7] text-[12px] font-medium">{method.title}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between">
        <label className="text-gray-400 text-[10px] mb-2 block">Amount ({currency})</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-[243px] h-[36px] bg-[#2A2A2A] text-[10px] text-white p-4 rounded-lg border-none outline-none"
            min={method.minAmount}
            max={method.maxAmount}
            placeholder={`${currency} ${method.minAmount} - ${method.maxAmount}`}

          />
        </div>

        {method.details?.map(detail => (
          <div key={detail.label} className="flex justify-between">
            <label className="text-gray-400 text-[10px] mb-2 block">{detail.label}</label>
            <input
              type="text"
              name={detail.label.toLowerCase().replace(/\s+/g, '_')}
              value={formData[detail.label.toLowerCase().replace(/\s+/g, '_')]}
              onChange={handleChange}
              placeholder={`Enter ${detail.label}`}
              className="w-[243px] h-[36px] bg-[#2A2A2A] text-[10px] text-white p-4 rounded-lg border-none outline-none placeholder-gray-500"
              required
            />
          </div>
        ))}

        <div className="flex justify-between">
          <label className="text-gray-400 text-[10px] mb-2 block">Withdrawal Token</label>
          <input
            type="text"
            name="withdrawalToken"
            value={formData.withdrawalToken}
            onChange={handleChange}
            placeholder="Enter Withdrawal Token"
            className="w-[243px] h-[36px] bg-[#2A2A2A] text-[10px] text-white p-4 rounded-lg border-none outline-none placeholder-gray-500"
            required
          />
        </div>
        <button 
          type="button"
          className="text-blue-500 text-[10px] mt-1"
          onClick={() => {
            alert('Token request functionality to be implemented');
          }}
        >
          Request Withdrawal Token
        </button>
      </div>


      <button
        onClick={handleSubmit}
        disabled={loading || success}
        className={`w-full ${success ? 'bg-green-500' : 'bg-[#2563EB]'} text-white py-4 rounded-full font-medium text-[12px] my-5 disabled:opacity-50`}
      >
        {loading ? 'Processing...' : success ? 'Success!' : 'Submit'}
      </button>

      <article className="overflow-hidden px-3 py-4 mt-2 w-full rounded-xl bg-[#1D1D1F]">
        <header className="w-full font-medium">
          <div className="flex gap-2.5 items-center w-full text-[14px] tracking-normal leading-tight text-zinc-100">
            <h2 className="flex-1 shrink self-stretch my-auto basis-0">Withdrawal Instructions:</h2>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/28f76ca51ab932c417ae5480603e7ceb025031fd?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
              alt="Information icon"
            />
          </div>
          <p className="mt-3 text-[10px] text-neutral-500">
            To initiate a withdrawal, please follow these simple steps:
          </p>
        </header>
        <div className="flex gap-1.5 items-start mt-1.5 text-[10px] leading-4 text-neutral-400">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 aspect-square w-[18px]"
            alt="Step icon"
          />
          <p className="flex-1 shrink basis-0">
            Payment Details: Request a withdrawal by providing the necessary payment 
            information, such as your preferred method and account details.
          </p>
        </div>
        <div className="flex gap-1.5 items-start mt-1.5 text-[10px] leading-4 text-neutral-400">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 aspect-square w-[18px]"
            alt="Step icon"
          />
          <p className="flex-1 shrink basis-0">
            Verification: Our team will promptly review your withdrawal request and ensure 
            all the provided details are accurate and complete.
          </p>
        </div>
        <div className="flex gap-1.5 items-start mt-1.5 text-[10px] leading-4 text-neutral-400">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 aspect-square w-[18px]"
            alt="Step icon"
          />
          <p className="flex-1 shrink basis-0">
            Processing: Once verified, your withdrawal will be processed promptly. The processing time 
            may vary based on your chosen payment method.
          </p>
        </div>
        <div className="flex gap-1.5 items-start mt-4 text-[10px] leading-4 text-neutral-400">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="object-contain shrink-0 aspect-square w-[18px]"
            alt="Step icon"
          />
          <p className="flex-1 shrink basis-0">
            Confirmation: You will receive an email notification confirming 
            the successful completion of your withdrawal.
          </p>
        </div>
        <p className="mt-4 text-[10px] text-neutral-400">
          If you have any questions or require assistance, our dedicated support
          team is available to assist you throughout the withdrawal process.
        </p>
        <p className="mt-4 text-[10px] text-neutral-400">
          Once completed, our team will verify the payment and credit the amount to 
          your account promptly. For any assistance, our dedicated support team is 
          available to help you.
        </p>
      </article>
    </div>
  );
};

const WithdrawalInterface = () => {
  const { token } = useUserAuth();
  const { balance, currency } = useBalance(); // Get balance from context
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const methodsResponse = await publicAxios.get('/withdrawal-methods');
        const activeMethods = methodsResponse.data.filter(method => method.isActive) || [];
        setMethods(activeMethods);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Methods Error:', err.response?.data || err);
        setError(err.response?.data?.message || 'Failed to load withdrawal methods');
        setLoading(false);
      }
    };

    if (token) fetchMethods();
  }, [token]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4">
      <p>{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
      >
        Retry
      </button>
    </div>
  );

  if (selectedMethod) {
    return <WithdrawalForm 
      method={selectedMethod} 
      onBack={() => setSelectedMethod(null)} 
    />;
  }

  return (
    <div className="bg-[#161617] mx-3 text-white min-h-screen">
      <div className="max-w-md mx-auto">
        <div className="p-6 flex justify-between">
          <div>
            <h1 className="text-[16px] font-medium mb-2">Withdraw</h1>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400 mb-1">Available Balance</div>
            <div className="text-[16px] font-medium">
              {currency} {balance.toLocaleString()}
            </div>
          </div>

        </div>

        <div className="px-6 mb-6">
          <div className="text-[12px] text-gray-400 mb-1">From</div>
          <div className="bg-[#242426] border border-[#505050] rounded-[10px] w-full h-[80px] p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <img src={Logo} alt="Logo" />
              </div>
              <span className="text-white text-[12px] font-medium">Balance</span>
            </div>
            <span className="text-white text-[16px] font-medium">
              {currency} {balance.toLocaleString()}
            </span>

          </div>
        </div>

        <div className="px-6">
          <div className="text-sm text-gray-400 mb-3">To</div>
          {methods.length === 0 && (
            <div className="text-center text-gray-400 text-[12px]">
              No withdrawal methods available
            </div>
          )}
          <div className="space-y-3">
            {methods.map((method) => {
              const iconUrl = method.icon 
                ? `${STATIC_BASE_URL}${method.icon.replace(/^\/icons\//, '/icons/')}`
                : '/icons/default.png';

              return (
                <div
                  key={method._id}
                  className="bg-[#242426] border border-[#505050] rounded-[10px] w-full h-[80px] p-4 flex items-center justify-between cursor-pointer hover:bg-gray-750 transition-colors"
                  onClick={() => setSelectedMethod(method)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <img
                        src={iconUrl}
                        alt={`${method.title} icon`}
                        className="w-full h-full object-contain rounded-full bg-[#2A2A2A] p-1"
                        onError={(e) => {
                          e.target.src = '/icons/default.png';
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-white text-[12px] font-medium block">{method.title}</span>
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalInterface;

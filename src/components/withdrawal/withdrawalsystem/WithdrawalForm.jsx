import { useState } from 'react';

const WithdrawalForm = ({ method = { methodId: 1, title: 'Bitcoin' }, onBack = () => {} }) => {
  const [amount, setAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawalToken, setWithdrawalToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || !withdrawalAmount || !walletAddress || !withdrawalToken) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      console.log('Submitting withdrawal:', {
        amount,
        withdrawalAmount,
        walletAddress,
        withdrawalToken
      });

      // Simulate successful response
      setTimeout(() => {
        setSuccess(true);
        setAmount('');
        setWithdrawalAmount('');
        setWalletAddress('');
        setWithdrawalToken('');
        setLoading(false);
      }, 1000);
      
      return;
    } catch (err) {
      console.error('Withdrawal error:', err);
      setError('Withdrawal submission failed');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--card)] min-h-screen text-white">
    

      {/* Main Content */}
      <div className="px-4 mt-6">
        <h1 className="text-xl font-medium text-white mb-8">Make Withdrawal</h1>

        {/* Bitcoin Selection */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">₿</span>
            </div>
            <span className="text-white font-medium">Bitcoin</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Amount (NGN) */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Amount (NGN)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[var(--card-2)] text-white p-4 rounded-lg border-none outline-none"
            />
          </div>

          {/* Withdrawal Amount */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Withdrawal Amount</label>
            <input
              type="text"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              className="w-full bg-[var(--card-2)] text-white p-4 rounded-lg border-none outline-none"
            />
          </div>

          {/* Wallet Address */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="..."
              className="w-full bg-[var(--card-2)] text-white p-4 rounded-lg border-none outline-none placeholder-gray-500"
            />
          </div>

          {/* Withdrawal Token */}
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Withdrawal Token</label>
            <input
              type="text"
              value={withdrawalToken}
              onChange={(e) => setWithdrawalToken(e.target.value)}
              placeholder="Enter Withdrawal Token"
              className="w-full bg-[var(--card-2)] text-white p-4 rounded-lg border-none outline-none placeholder-gray-500"
            />
          </div>
        </div>

        {/* Error/Success messages */}
        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-center mt-4">{error}</div>}
        {success && <div className="bg-green-500/10 text-green-500 p-3 rounded-lg text-center mt-4">Withdrawal submitted successfully!</div>}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-4 rounded-xl font-medium text-lg mt-8 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>

        {/* Withdrawal Instructions */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Withdrawal Instructions:</h3>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <p className="text-gray-400 text-sm leading-relaxed">
            To initiate a withdrawal, please follow these simple steps:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-medium text-sm">Payment Details:</div>
                <div className="text-gray-400 text-sm">Request a withdrawal by providing the necessary payment information such as your preferred payment method and account details.</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-medium text-sm">Verification:</div>
                <div className="text-gray-400 text-sm">Our team will promptly review your withdrawal request and ensure all the provided details are accurate and complete.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-medium text-sm">Processing:</div>
                <div className="text-gray-400 text-sm">Once verified, your withdrawal will be processed promptly. The processing time may vary based on your chosen payment method.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-medium text-sm">Confirmation:</div>
                <div className="text-gray-400 text-sm">You will receive an email notification confirming the successful processing of your withdrawal.</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 pt-4">
            <p className="text-gray-400 text-sm">
              If you have any questions or require assistance, our dedicated support team is available to assist you throughout the withdrawal process.
            </p>
            
            <p className="text-gray-400 text-sm">
              Once completed, our team will verify the payment and credit the amount to your account promptly. For any assistance, our dedicated support team is available to help you.
            </p>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default WithdrawalForm;
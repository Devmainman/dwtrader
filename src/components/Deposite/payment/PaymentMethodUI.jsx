import { useState } from 'react';
import { createDeposit } from '../../../api/payment';
import { Copy, CheckCircle } from 'lucide-react';

const PaymentMethodUI = ({ method, onBack, token }) => {
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const depositData = {
        paymentMethodId: method._id,
        amount,
        currency: 'NGN'
      };

      if (method.type === 'bank') {
        if (!file) {
          throw new Error('Payment proof is required');
        }
        depositData.paymentProof = file;
      }

      await createDeposit(depositData, token);
      setSuccess(true);
      setAmount('');
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4">
      <button 
        onClick={onBack}
        className="text-blue-500 mb-4 flex items-center"
      >
        ← Back to methods
      </button>

      {error && <div className="bg-red-500/10 text-red-500 p-3 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-500/10 text-green-500 p-3 mb-4 rounded">Deposit submitted!</div>}

      <div className="flex items-center mb-6">
        <div className="bg-neutral-900 p-2 rounded-full">
          <img src={method.icon} alt={method.name} className="h-6 w-6" />
        </div>
        <h2 className="ml-3 text-xl text-[#C7C7C7] font-medium">{method.name}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {method.type === 'bank' && (
          <>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <label className="text-gray-400 text-sm">Bank Name:</label>
                <div className="bg-[#1D1D1F] p-3 rounded-md text-sm">
                  {method.details.bankName}
                </div>
              </div>
              {/* Add other bank details similarly */}
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2">Upload payment proof</label>
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
                className="hidden" 
                id="proof-upload"
              />
              <label 
                htmlFor="proof-upload" 
                className="block bg-[#1D1D1F] h-40 rounded-md flex items-center justify-center cursor-pointer"
              >
                {file ? file.name : 'Select file'}
              </label>
            </div>
          </>
        )}

        {method.type === 'crypto' && (
          <div className="mb-6">
            <div className="bg-[#1D1D1F] p-3 rounded-md mb-4">
              <p className="text-sm">Send to: {method.details.walletAddress}</p>
              <button 
                type="button"
                onClick={() => navigator.clipboard.writeText(method.details.walletAddress)}
                className="text-blue-500 text-xs flex items-center mt-1"
              >
                <Copy className="mr-1 h-3 w-3" /> Copy address
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Amount (NGN)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#1D1D1F] p-3 rounded-md w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !amount || (method.type === 'bank' && !file)}
          className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit Deposit'}
        </button>
      </form>
    </div>
  );
};

export default PaymentMethodUI;
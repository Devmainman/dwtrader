import { useState } from 'react';
import bankIcon from '../../../assets/bank.svg';
import { Copy, ChevronRight, Upload, CheckCircle } from 'lucide-react';
import cloud from '../../../assets/cloud.svg';
import { createDeposit } from '../../api/deposit';
import { useUserAuth } from '../../context/UserAuthContext';


const BankTransferForm = ({ onBack, bankDetails }) => {
  const { user, token } = useUserAuth();
  const [amount, setAmount] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size <= 2 * 1024 * 1024) {
        setSelectedFile(e.target.files[0]);
        setError(null);
      } else {
        setError('File size must be less than 2MB');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount)) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!selectedFile) {
      setError('Please upload payment proof');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('paymentMethodId', 'bank-transfer');
      formData.append('amount', amount);
      formData.append('currency', 'NGN');
      formData.append('paymentProof', selectedFile);
      formData.append('bankName', bankDetails.bankName);
      formData.append('accountName', bankDetails.accountName);
      formData.append('accountNumber', bankDetails.accountNumber);

      const response = await createDeposit(formData, token);
      
      setSuccess(true);
      setAmount('');
      setSelectedFile(null);
      
      // You might want to update user balance in context here
      console.log('Deposit successful:', response);
    } catch (err) {
      console.error('Deposit error:', err);
      setError(err.message || 'Failed to process deposit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <div className="py-4">
      <div className="flex justify-between">
        <div className="pt-2">
          <p>Bank Transfer</p>
        </div>
        <div className="flex items-center mb-6">
          <div className="bg-gray-100 p-2 rounded-full">
            <img src={bankIcon} alt="Bank" className="h-6 w-6" />
          </div>
          <h2 className="ml-3 text-xl text-[var(--fg-2)] font-medium">Bank</h2>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 text-red-500 text-sm rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-500/10 text-green-500 text-sm rounded-md">
          Deposit submitted successfully! We'll process it shortly.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Bank Details Section */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <label className="block text-gray-400 text-[10px] mt-2">Bank Name:</label>
            <div className="bg-[var(--card)] p-3 rounded-md text-[10px] h-[36px] w-[243px]">
              {bankDetails.bankName}
            </div>
          </div>
          
          <div className="flex justify-between">
            <label className="block text-gray-400 text-[10px] mt-2">Account Name:</label>
            <div className="bg-[var(--card)] p-3 text-[10px] rounded-md h-[36px] w-[243px]">
              {bankDetails.accountName}
            </div>
          </div>
          
          <div className="flex justify-between">
            <label className="block text-gray-400 text-[10px] mt-2">Account Number:</label>
            <div className="bg-[var(--card)] p-3 rounded-md flex justify-between text-[10px] items-center h-[36px] w-[243px]">
              {bankDetails.accountNumber}
              <button 
                type="button"
                className="text-blue-500 flex items-center" 
                onClick={() => copyToClipboard(bankDetails.accountNumber)}
              >
                Copy Now <Copy className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <label className="block text-gray-400 text-[10px] mt-4">Amount (NGN)</label>
            <input
              type="number"
              className="bg-[var(--card)] p-3 rounded-md text-white text-[10px] flex placeholder-gray-500 h-[52px] w-[261px]"
              placeholder="Deposit Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>
        
        {/* Upload Payment Proof Section */}
        <div className="mb-6">
          <label className="block text-gray-400 text-[10px] mb-2">Upload payment proof</label>
          <div className="bg-[var(--card)] h-[172px] w-full rounded-md p-4">
            <div className="bg-[var(--card-2)] p-6 h-[138px] rounded-md flex flex-col items-center justify-center">
              <div className="rounded-full mb-2">
                <img
                  src={cloud}
                  alt="Attachment"
                  className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square"
                />
              </div>
              <p className="mb-1 text-[12px] font-medium">Upload Image</p>
              <p className="text-[8px] text-gray-400 mb-2">Image size must be less than 2MB</p>
              
              <label className="bg-blue-600 text-[8px] text-white py-2 px-6 rounded-full cursor-pointer hover:bg-blue-700">
                {selectedFile ? 'Change Image' : 'Select Image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              {selectedFile && (
                <p className="mt-2 text-sm text-green-400 text-[10px]">
                  {selectedFile.name} selected
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-[12px] text-white py-3 rounded-full font-medium hover:bg-blue-700 disabled:opacity-50"
          disabled={!amount || !selectedFile || isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner size="small" /> : 'Submit'}
        </button>
        
        {/* Instructions Panel */}
        <div className="mt-6 bg-[var(--card)] rounded-[10px] p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-medium F3F3F3">Lets Proceed with that Deposit</h3>
            <ChevronRight className="h-5 w-5" />
          </div>
          <p className="text-[var(--fg-3)] text-[10px] mb-3">To make a deposit, please follow these simple steps:</p>
          
          <div className="flex mb-2">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-1" />
            <p className="text-[var(--fg-3)] text-[10px]">
              <span className="font-medium">Payment Information:</span> Initiate the payment by transferring 
              the funds to the provided payment details.
            </p>
          </div>
          
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-1" />
            <p className="text-[var(--fg-3)] text-[10px]">
              <span className="font-medium">Proof of Payment:</span> After making the payment, upload the 
              proof of payment in the designated section. This ensures a 
              seamless update to your account.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BankTransferForm;
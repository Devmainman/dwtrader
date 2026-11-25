import { useState } from 'react';
import { Copy, ChevronRight, Upload, CheckCircle } from 'lucide-react';
import ethereumIcon from '../../../assets/ethereumicon.svg';
import { Bitcoin } from 'lucide-react';
import cloud from '../../../assets/cloud.svg';

const CryptoPaymentForm = ({ type, onBack }) => {
  const [amount, setAmount] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Hardcoded crypto wallet details
  const walletDetails = {
    bitcoin: {
      address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
      network: 'Bitcoin Network',
    },
    ethereum: {
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      network: 'Ethereum Network',
    }
  };

  const details = walletDetails[type];
  
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Check if file size is less than 2MB
      if (e.target.files[0].size <= 2 * 1024 * 1024) {
        setSelectedFile(e.target.files[0]);
      } else {
        alert('File size must be less than 2MB');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would integrate with your backend
    console.log({
      paymentMethod: type,
      amount: amount,
      paymentProof: selectedFile,
      walletAddress: details.address
    });
    // In a real implementation, you would send this data to your API
    alert('Payment details submitted');
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

  const renderIcon = () => {
    if (type === 'bitcoin') {
      return <Bitcoin className="h-6 w-6 text-orange-500" />;
    } else if (type === 'ethereum') {
      return <img src={ethereumIcon} alt="Ethereum" className="h-6 w-6" />;
    }
    return null;
  };

  return (
    <div className="py-4">
      <div className="flex justify-between">
      <h2 className="ml-3 mt-1 text-[16px] font-medium">{type === 'bitcoin' ? 'Bitcoin' : 'Ethereum'} transfer</h2>
      <div className="flex items-center mb-6">
        <div className="bg-gray-800 p-2 rounded-full">
          {renderIcon()}
        </div>
        <h2 className="ml-3 text-[12px] font-medium">{type === 'bitcoin' ? 'Bitcoin' : 'Ethereum'}</h2>
      </div>
      </div>
      
      
      <form onSubmit={handleSubmit}>
        {/* Wallet Details Section */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <label className="block text-gray-400 text-[10px] mt-2">Network:</label>
            <div className="bg-[var(--card)] p-3 rounded-md text-[10px] h-[36px] w-[243px]">
              {details.network}
            </div>
          </div>
          
          <div className="flex justify-between">
            <label className="block text-gray-400 text-[10px] mt-2">Wallet Address:</label>
            <div className="bg-[var(--card)] flex p-3 rounded-md text-[10px] h-[36px] w-[243px]">
              <span className="truncate mr-2">{details.address}</span>
              <button 
                type="button"
                className="text-blue-500 flex items-center flex-shrink-0" 
                onClick={() => copyToClipboard(details.address)}
              >
                Copy <Copy className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <label className="block text-gray-400 text-[10px] mt-4">Amount ({type === 'bitcoin' ? 'BTC' : 'ETH'})</label>
            <input
              type="text"
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
              <p className="text-[10px] text-gray-400 mb-4">Image size must be less than 2MB</p>
              
              <label className="bg-blue-600 text-[8px] text-white py-2 px-6 rounded-full cursor-pointer hover:bg-blue-700">
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              {selectedFile && (
                <p className="mt-2 text-sm text-green-400">
                  {selectedFile.name} selected
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-[12px] text-white py-3 rounded-full font-medium hover:bg-blue-700"
          disabled={!amount || !selectedFile}
        >
          Submit
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
          
          <p className="text-[var(--fg-3)] text-[10px] mt-4">
            Once completed, our team will verify the payment and credit the 
            amount to your account promptly. For any assistance, our 
            dedicated support team is available to help you.
          </p>
        </div>
      </form>
    </div>
  );
};

export default CryptoPaymentForm;
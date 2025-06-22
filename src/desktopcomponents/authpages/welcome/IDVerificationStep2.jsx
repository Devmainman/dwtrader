import { useState } from 'react';
import { uploadIdDocument } from '../../../api/verification';
import UploadImageButton from './UploadImageButton';
import { Copy, ChevronRight, Upload, CheckCircle } from 'lucide-react';

export default function IDVerificationStep2({ onBack, onContinue }) {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!frontImage) {
      setError('Front image is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('frontImage', frontImage);
      if (backImage) formData.append('backImage', backImage);
      formData.append('documentType', 'national_id'); // Match your enum

      const response = await uploadIdDocument(formData);
      console.log('Upload response:', response);

      if (response && response.success) {
        setSuccess(true);
        setTimeout(() => {
          onContinue(response.data.documents || [response.data.document]);
        }, 1500); // Show success message briefly
      } else {
        throw new Error(response?.message || 'Upload verification failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-[18px] text-[#F3F3F3] font-medium">Verify your ID card</h1>
      
      {success ? (
        <div className="bg-green-100 text-[12px] rounded-full text-green-800 p-4">
          ID document uploaded successfully
        </div>
      ) : (
        <>
          <p className="text-[#787878] text-[12px] mb-4">
          We will need to authenticate your account credibility details with an additional ID verification
          </p>
          
          <div className="space-y-4">
            <UploadImageButton 
              label="Front page"
              onChange={(file) => setFrontImage(file)}
              preview={frontImage}
              onRemove={() => setFrontImage(null)}
            />
            
            <UploadImageButton 
              label="Back page"
              onChange={(file) => setBackImage(file)}
              preview={backImage}
              onRemove={() => setBackImage(null)}
            />
          </div>

          <div className="mt-6 bg-[#1D1D1F] rounded-[10px] p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-regular text-[#9F9F9F]">Thank you for registering with our platform! To ensure the 
              security of your account and provide you with a seamless 
              experience, we kindly request you to upload a scanned copy or 
              clear photograph of your government-issued identity card for 
              verification purposes.</p>
            
          </div>
          <p className="text-[#9F9F9F] text-[10px] mb-3">The provided identity card should be one of the following:</p>
          
          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
              Passport
            </p>
          </div>

          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            National Identity Card
            </p>
          </div>

          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            Driver's License
            </p>
          </div>

          <p className="text-[#9F9F9F] text-[10px] mb-3">Please make sure that the uploaded document clearly displays the following details:</p>

          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            Your full name
            </p>
          </div>

          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            Date of birth
            </p>
          </div>

          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            Photograph
            </p>
          </div>

          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            ID number
            </p>
          </div>

          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            Issuing authority
            </p>
          </div>

          <p className="text-[#9F9F9F] text-[10px] mb-3">Rest assured that all information you provide will be handled with the utmost confidentiality and used solely for verification purposes in accordance with our privacy policy.</p>
          
          
        </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-4 mt-6">
            
            <button
              onClick={handleSubmit}
              disabled={!frontImage || loading}
              className="w-full bg-[#2563EB] text-white text-[12px] rounded-full py-3 font-regular"
            >
              {loading ? 'Uploading...' : 'Continue'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
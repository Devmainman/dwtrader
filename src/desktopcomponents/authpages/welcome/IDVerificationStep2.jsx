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
      
      formData.append('documentType', 'national_id');

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await uploadIdDocument(formData);
      console.log('Upload response:', response);

      if (response && response.success) {
        setSuccess(true);
        setTimeout(() => {
          onContinue(response.data.documents || [response.data.document]);
        }, 1500);
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
  <div className="md:flex md:items-start md:gap-4 md:max-w-[1280px] md:mx-auto">

    {/* LEFT SIDE: Column 1 + Column 2 grouped */}
<div className="md:w-[866px] lg:h-[703px] rounded-[24px] md:p-6 lg:bg-[var(--card)] lg:border lg:border-white/[.07] md:flex md:flex-col gap-6">
  {/* Header (Above Columns) */}
  <div className="hidden md:block mb-1">
    <p className="text-[var(--fg)] text-[14px] font-regular mb-5">
      You're a few steps to completing your profile
    </p>
  </div>
    <div className="md:flex md:justify-between md:gap-6">

      {/* Column 1 - Text content and continue button */}
       <div className="md:w-[350px] lg:h-[500px] md:flex md:flex-col">

        <div>
          <h1 className="text-[17px] font-semibold tracking-[-0.02em] text-zinc-100">Verify your ID card</h1>

          {success ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-[12px] rounded-2xl text-emerald-400 p-3.5">
              ID document uploaded successfully
            </div>
          ) : (
            <p className="text-[var(--fg-4)] text-[12px] mb-4 md:mb-6 md:text-[14px]">
              We will need to authenticate your account credibility details with an additional ID verification
            </p>
          )}
        </div>

        {!success && (
          <div className="hidden md:block mt-6">
            {error && <p className="text-red-400 text-[12px] mt-1.5">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={!frontImage || loading}
              className="kyc-btn w-full"
            >
              {loading ? 'Uploading...' : 'Continue'}
            </button>
          </div>
        )}
      </div>

      {/* Column 2 - Upload buttons */}
      {!success && (
        <div className="md:w-[350px] md:flex-col">
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

           {!success && (
          <div className="md:hidden mt-6">
            {error && <p className="text-red-400 text-[12px] mt-1.5">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={!frontImage || loading}
              className="kyc-btn w-full"
            >
              {loading ? 'Uploading...' : 'Continue'}
            </button>
          </div>
        )}

          {/* Mobile instructions panel */}
          <div className="mt-6 dash-panel p-4 md:hidden">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] text-neutral-400">
                Thank you for registering with our platform! To ensure the 
                security of your account and provide you with a seamless 
                experience, we kindly request you to upload a scanned copy or 
                clear photograph of your government-issued identity card for 
                verification purposes.
              </p>
            </div>
            <p className="text-neutral-400 text-[11px] mb-3">
              The provided identity card should be one of the following:
            </p>

            {['Passport', 'National Identity Card', "Driver's License"].map((label) => (
              <div className="flex mb-2 items-center" key={label}>
                <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                <p className="text-neutral-400 text-[11px]">{label}</p>
              </div>
            ))}

            <p className="text-neutral-400 text-[11px] mb-3">
              Please make sure that the uploaded document clearly displays the following details:
            </p>

            {[
              'Your full name',
              'Date of birth',
              'Photograph',
              'ID number',
              'Issuing authority'
            ].map((item) => (
              <div className="flex mb-2 items-center" key={item}>
                <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                <p className="text-neutral-400 text-[11px]">{item}</p>
              </div>
            ))}

            <p className="text-neutral-400 text-[11px] mb-3">
              Rest assured that all information you provide will be handled with the utmost confidentiality and used solely for verification purposes in accordance with our privacy policy.
            </p>
          </div>
        </div>
      )}
    </div>
    </div>

    {/* RIGHT SIDE: Column 3 - Desktop instructions */}
    {!success && (
      <div className="hidden md:block md:h-[400px] md:w-[403px]">
        <div className="dash-panel p-4 sticky top-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-neutral-400">
              Thank you for registering with our platform! To ensure the 
              security of your account and provide you with a seamless 
              experience, we kindly request you to upload a scanned copy or 
              clear photograph of your government-issued identity card for 
              verification purposes.
            </p>
          </div>
          <p className="text-neutral-400 text-[11px] mb-3">
            The provided identity card should be one of the following:
          </p>

          {['Passport', 'National Identity Card', "Driver's License"].map((label) => (
            <div className="flex mb-2 items-center" key={label}>
              <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
              <p className="text-neutral-400 text-[11px]">{label}</p>
            </div>
          ))}

          <p className="text-neutral-400 text-[11px] mb-3">
            Please make sure that the uploaded document clearly displays the following details:
          </p>

          {[
            'Your full name',
            'Date of birth',
            'Photograph',
            'ID number',
            'Issuing authority'
          ].map((item) => (
            <div className="flex mb-2 items-center" key={item}>
              <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
              <p className="text-neutral-400 text-[11px]">{item}</p>
            </div>
          ))}

          <p className="text-neutral-400 text-[11px] mb-3">
            Rest assured that all information you provide will be handled with the utmost confidentiality and used solely for verification purposes in accordance with our privacy policy.
          </p>
        </div>
      </div>
    )}
  </div>
);

}
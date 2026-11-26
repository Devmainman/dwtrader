import { useState } from 'react';
import { uploadIdDocument } from '../../../api/verification';
import UploadImageButton from './UploadImageButton';
import { CheckCircle } from 'lucide-react';

export default function IDVerificationStep3({ onBack, onContinue }) {
  const [documentType, setDocumentType] = useState('passport');
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!document) {
      setError('Please upload a document');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('frontImage', document);
      formData.append('documentType', documentType);

      const response = await uploadIdDocument(formData);
      if (response.success) {
        onContinue(response.data.document);
      } else {
        setError(response.message || 'Upload failed');
      }
    } catch (error) {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="md:flex md:items-start md:justify-center md:gap-4">
    {/* LEFT PANEL */}
    <div className="md:w-[866px] lg:h-[603px] rounded-[24px] md:p-6 lg:bg-[var(--card)] lg:border lg:border-white/[.07] md:flex md:flex-col md:gap-6">
      
      {/* Header (on top of column 1 + 2) */}
      <div className="hidden md:block w-full mb-1">
        <p className="text-[var(--fg)] font-regular mb-6">
          You're a few steps to completing your profile
        </p>
      </div>

      {/* Columns 1 and 2 side-by-side */}
      <div className="md:flex md:justify-between md:gap-6">
        {/* Column 1 */}
        <div className="md:w-[350px] flex flex-col">
          <h1 className="text-[17px] font-semibold tracking-[-0.02em] text-zinc-100">Additional Verification</h1>
          <p className="text-[var(--fg-4)] text-[12px] mb-4 md:text-[14px]">
            Upload an additional identity document
          </p>

          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="kyc-field mb-4"
          >
            <option value="passport">Passport</option>
            <option value="national_id">National ID</option>
            <option value="driver_license">Driver's License</option>
          </select>

          {error && <p className="text-red-400 text-[12px] mt-1.5">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!document || loading}
            className="kyc-btn w-full"
          >
            {loading ? 'Uploading...' : 'Continue'}
          </button>
        </div>

        {/* Column 2 */}
        <div className="md:w-[350px] flex flex-col justify-start">
          <UploadImageButton
            label="Upload Document"
            onChange={setDocument}
            preview={document}
            onRemove={() => setDocument(null)}
          />
        </div>
      </div>
    </div>
  </div>
);

}

import { useState } from 'react';
import { uploadAddressProof } from '../../../api/verification';
import UploadImageButton from './UploadImageButton';
import { CheckCircle } from 'lucide-react';

export default function IDVerificationStep1({ onBack, onContinue }) {
  const [document, setDocument] = useState(null);
  const [documentType, setDocumentType] = useState('utility_bill');
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
      formData.append('document', document);
      formData.append('documentType', documentType);

      const response = await uploadAddressProof(formData);

      if (response.success) {
        onContinue({
          documentType,
          documentUrl: response.data.documentUrl,
        });
      } else {
        setError(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:flex md:items-center md:justify-center md:gap-6">
      {/* LEFT SIDE (Form + Upload) */}
      <div className="w-full md:w-[570px] md:h-[574px] rounded-[10px] md:p-6 md:bg-[#1D1D1F] md:flex md:flex-col space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-[18px] text-[#F3F3F3] font-medium">Proof of Address</h1>
          <p className="text-[#787878] text-[12px] mb-2">Upload a document that verifies your address</p>
        </div>

        {/* Centered Form Area */}
        <div className="md:flex md:items-center md:justify-center">
          <div className="w-full md:w-[350px] space-y-4">
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full bg-transparent border text-[12px] border-gray-700 rounded-md p-4 text-white"
            >
              <option value="utility_bill">Utility Bill</option>
              <option value="bank_statement">Bank Statement</option>
              <option value="government_letter">Government Letter</option>
            </select>

            <UploadImageButton
              label="Upload Document"
              onChange={setDocument}
              preview={document}
              onRemove={() => setDocument(null)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={onBack}
                className="w-1/2 border border-gray-700 text-white text-[12px] rounded-full py-3 font-regular"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!document || loading}
                className="w-1/2 bg-[#2563EB] text-white text-[12px] rounded-full py-3 font-regular"
              >
                {loading ? 'Uploading...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions (optional for later re-enable)
      <div className="hidden md:block md:w-[403px] md:h-full">
        <div className="bg-[#1D1D1F] rounded-[10px] p-4 overflow-y-auto h-full">
          {renderInstructions()}
        </div>
      </div> */}
    </div>
  );
}

import { useState } from 'react';
import { uploadAddressProof } from '../../../api/verification';
import UploadImageButton from './UploadImageButton';

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
  
      console.log('Submitting document:', {
        name: document.name,
        type: document.type,
        size: document.size
      });
  
      const response = await uploadAddressProof(formData);
      console.log('Upload response:', response);
      
      if (response.success) {
        onContinue({
          documentType,
          documentUrl: response.data.documentUrl
        });
      } else {
        setError(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error details:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-[18px] text-[#F3F3F3] font-medium">Proof of Address</h1>
      <p className="text-[#787878] text-[12px] mb-4">Upload a document that verifies your address</p>
      
      <select
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        className="w-full bg-transparent border text-[12px] border-gray-700 rounded-md p-4 text-white mb-4"
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
      
      <div className="flex gap-4 mt-6">
        <button
          onClick={onBack}
          className="w-1/2 border border-gray-700 text-white text-[12px] rounded-full py-3 font-regular
          "
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
  );
}
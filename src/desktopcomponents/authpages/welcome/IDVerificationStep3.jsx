import { useState } from 'react';
import { uploadIdDocument } from '../../../api/verification';
import UploadImageButton from './UploadImageButton';

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
    <div className="space-y-4">
      <h1 className="text-[18px] text-[#F3F3F3] font-medium">Additional Verification</h1>
      <p className="text-[#787878] text-[12px] mb-4">Upload an additional identity document</p>
      
      <select
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        className="w-full bg-transparent border text-[12px] border-gray-700 rounded-md p-4 text-white mb-4"
      >
        <option value="passport">Passport</option>
        <option value="national_id">National ID</option>
        <option value="driver_license">Driver's License</option>
      </select>
      
      <UploadImageButton
        label="Upload Document"
        onChange={setDocument}
        preview={document}
        onRemove={() => setDocument(null)}
      />
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <button
        onClick={handleSubmit}
        disabled={!document || loading}
        className="w-full bg-[#2563EB] text-white text-[12px] rounded-full py-3 font-regular"
      >
        {loading ? 'Uploading...' : 'Continue'}
      </button>
    </div>
  );
}
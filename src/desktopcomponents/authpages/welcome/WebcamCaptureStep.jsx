import { useCallback, useRef, useState } from 'react';
import { Camera, RotateCw, X, CheckCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import { uploadFaceImage } from '../../../api/verification';

export default function WebcamCaptureStep({ onBack, onContinue }) {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [isCaptured, setIsCaptured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setIsCaptured(true);
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
    setIsCaptured(false);
    setError('');
  };

  const switchCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleUpload = async () => {
    if (!imgSrc) return;
  
    setLoading(true);
    setError('');
    
    try {
      // Convert data URL to blob
      const blob = await fetch(imgSrc).then(res => res.blob());
      const file = new File([blob], 'face-image.jpg', { type: 'image/jpeg' });
  
      const formData = new FormData();
      formData.append('image', file);
  
      const response = await uploadFaceImage(formData);
      console.log('Upload response:', response); // Debug log
  
      if (response && response.success) {
        // Ensure we're passing the string filename, not the response object
        onContinue(response.data.faceImage);
      } else {
        throw new Error(response?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const videoConstraints = {
    facingMode,
    width: 1280,
    height: 720,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-[18px] font-medium text-[#F3F3F3]">Webcam Capture</h1>
      <p className="text-[#787878] text-[12px]">
      We will need to authenticate your account credibility details with a Face Capture
      </p>
      <div className="flex justify-center item-center">

      <div className="w-[242px] aspect-square bg-black relative overflow-hidden">
        {!isCaptured ? (
          <>
           <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
          />
           {/* Focus Frame */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 border-2 border-[#2563EB] rounded-[20px] shadow-md opacity-80" />
      </div>
          </>
         
        ) : (
          <img src={imgSrc} alt="Captured" className="w-[242px] h-[244] object-cover" />
        )}
      </div>


      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!isCaptured ? (
        <button
          onClick={capture}
          className="w-full bg-[#2563EB] text-white text-[12px] rounded-full py-3 font-medium flex items-center justify-center gap-2"
        >
          Capture Photo
        </button>
      ) : (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-green-500 text-white text-[12px] rounded-full py-3 font-medium flex items-center justify-center gap-2"
        >
          {loading ? 'Uploading...' : 'Upload and Verify'}
        </button>
      )}

      <div className="flex gap-4">
        {!isCaptured ? (
          <>
            <button
              onClick={switchCamera}
              className="w-1/2 border border-[#2563EB] text-white text-[12px] rounded-full py-3 font-medium flex items-center justify-center"
            >
              Switch Camera
            </button>
            <button
              onClick={onBack}
              className="w-1/2 bg-red-500 text-white text-[12px] rounded-full py-3 font-medium flex items-center justify-center"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={retake}
              className="w-1/2 border border-[#2563EB] text-white text-[12px] rounded-full py-3 font-medium flex items-center justify-center"
            >
              
              Retake
            </button>
            <button
              onClick={onBack}
              className="w-1/2 bg-red-500 text-white text-[12px] rounded-full py-3 font-medium flex items-center justify-center"
            >
              
              Cancel
            </button>
          </>
        )}
      </div>

      <div className="mt-6 bg-[#1D1D1F] rounded-[10px] p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-regular text-[#9F9F9F]">Welcome to our secure and advanced facial verification system! 
              To ensure the highest level of security and identity verification, 
              we kindly request you to undergo facial recognition. Our facial 
              verification process is designed to match your live image with the 
              photo in your identification document, providing a seamless and 
              reliable way to confirm your identity.</p>
            
          </div>
          <p className="text-[#9F9F9F] text-[10px] mb-3">To get started, please follow these steps:</p>
          
          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            Find a well-lit area with minimal shadows for the best results.
            </p>
          </div>

          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            Position your face within the frame provided, ensuring your entire face is visible.
            </p>
          </div>

          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            Keep your face straight and look directly into the camera.
            </p>
          </div>

         

          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            Take a clear and unobstructed photo.
            </p>
          </div>

          <p className="text-[#9F9F9F] text-[10px] mb-3">Rest assured that your facial data will be handled with the 
            utmost confidentiality and securely stored in compliance with 
            our strict privacy policies. This verification process allows us to 
            maintain a safe and trustworthy environment for all our users.</p>

            <p className="text-[#9F9F9F] text-[10px] mb-3">Thank you for your cooperation. Should you encounter any issues 
              or have any questions, our support team is available to assist you. 
              Get ready to experience the convenience and security of facial 
              verification with us!</p>
          
          
        </div>


    </div>
  );
}
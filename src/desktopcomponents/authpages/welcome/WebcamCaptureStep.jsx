import { useCallback, useRef, useState } from 'react';
import { Camera, RotateCw, X, CheckCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import { uploadFaceImage } from '../../../api/verification';
import { compressImage } from '../../../lib/compressImage';

// Why the camera could not start, in words a person can act on.
const cameraProblem = (err) => {
  const name = err?.name || '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'Camera access was blocked. Allow the camera for this site, or take a selfie with your phone camera below.';
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'No camera was found. Take a selfie with your phone camera below.';
  if (name === 'NotReadableError') return 'The camera is being used by another app. Close it and retry, or take a selfie below.';
  if (typeof navigator !== 'undefined' && !navigator.mediaDevices?.getUserMedia) return 'This browser cannot open the camera (apps like WhatsApp and Instagram block it). Take a selfie below, or open the site in Safari or Chrome.';
  return 'The camera could not start. Take a selfie with your phone camera below.';
};

export default function WebcamCaptureStep({ onBack, onContinue }) {
  const webcamRef = useRef(null);
  const fileRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [pickedFile, setPickedFile] = useState(null); // selfie taken with the phone's own camera
  const [facingMode, setFacingMode] = useState('user');
  const [isCaptured, setIsCaptured] = useState(false);
  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState(
    typeof navigator !== 'undefined' && !navigator.mediaDevices?.getUserMedia ? cameraProblem(null) : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError('The camera is not ready yet. Wait a moment and try again.');
      return;
    }
    setError('');
    setPickedFile(null);
    setImgSrc(imageSrc);
    setIsCaptured(true);
  }, [webcamRef]);

  // Fallback: the phone's own camera app (or a photo) through a file picker.
  const onPickSelfie = async (e) => {
    const picked = e.target.files?.[0];
    e.target.value = '';
    if (!picked) return;
    setError('');
    const file = await compressImage(picked, { max: 1280 });
    setPickedFile(file);
    setImgSrc(URL.createObjectURL(file));
    setIsCaptured(true);
  };

  const retake = () => {
    setImgSrc(null);
    setPickedFile(null);
    setIsCaptured(false);
    setError('');
    setCamReady(false);
  };

  const switchCamera = () => {
    setCamReady(false);
    setCamError('');
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleUpload = async () => {
    if (!imgSrc) return;

    setLoading(true);
    setError('');

    try {
      // Use the picked selfie as is, or turn the webcam snapshot (data URL) into a file.
      const file = pickedFile || new File([await fetch(imgSrc).then(res => res.blob())], 'face-image.jpg', { type: 'image/jpeg' });

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

  // `ideal`, not exact: phones that can't give 1280x720 still start the camera.
  const videoConstraints = {
    facingMode,
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  const renderInstructions = () => (
  <>
    <p className="text-[10px] font-regular text-[var(--fg-3)] mb-2">
      Welcome to our secure and advanced facial verification system! To ensure the highest level of security and identity verification, we kindly request you to undergo facial recognition.
    </p>
    <p className="text-[var(--fg-3)] text-[10px] mb-3">To get started, please follow these steps:</p>

    {[
      'Find a well-lit area with minimal shadows for the best results.',
      'Position your face within the frame provided, ensuring your entire face is visible.',
      'Keep your face straight and look directly into the camera.',
      'Take a clear and unobstructed photo.',
    ].map((item, idx) => (
      <div className="flex mb-2 items-center" key={idx}>
        <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
        <p className="text-[var(--fg-3)] text-[10px]">{item}</p>
      </div>
    ))}

    <p className="text-[var(--fg-3)] text-[10px] mb-3">
      Your facial data will be handled confidentially and securely stored in compliance with privacy policies.
    </p>
    <p className="text-[var(--fg-3)] text-[10px] mb-3">
      For any issues, our support team is available to assist you.
    </p>
  </>
);

  return (
  <div className="md:flex md:items-start md:justify-center md:gap-6">
    {/* LEFT PANEL (Camera + Actions) */}
    <div className="w-full md:w-[866px] lg:h-[603px] rounded-[10px] md:p-6 lg:bg-[var(--card)] flex flex-col md:flex-row md:gap-6">
      
      {/* Camera Section (Top on mobile, Right on desktop) */}
      <div className="w-[242px] aspect-square bg-black relative overflow-hidden self-center md:self-start mb-6 md:mb-0">
        {!isCaptured ? (
          camError ? (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
              <p className="text-[11px] leading-4 text-neutral-300">{camError}</p>
            </div>
          ) : (
          <>
            <Webcam
              key={facingMode}
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.9}
              mirrored={facingMode === 'user'}
              videoConstraints={videoConstraints}
              onUserMedia={() => { setCamReady(true); setCamError(''); }}
              onUserMediaError={(err) => { setCamReady(false); setCamError(cameraProblem(err)); }}
              className="w-full h-full object-cover"
            />
            {!camReady && (
              <div className="absolute inset-0 flex items-center justify-center text-[11px] text-neutral-400">Starting camera...</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-[var(--color-blue-600)] rounded-[20px] shadow-md opacity-80" />
            </div>
          </>
          )
        ) : (
          <img src={imgSrc} alt="Captured" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Buttons and Text Content */}
      <div className="flex-1 flex flex-col justify-start space-y-4">
        <h1 className="text-[18px] font-medium text-[var(--fg)]">Webcam Capture</h1>
        <p className="text-[var(--fg-4)] text-[12px]">
          We will need to authenticate your account credibility details with a Face Capture
        </p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input ref={fileRef} type="file" accept="image/*" capture="user" className="hidden" onChange={onPickSelfie} />

        {!isCaptured ? (
          <>
            {camError ? (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full bg-[var(--color-blue-600)] text-white text-[12px] rounded-full py-3 font-medium flex items-center justify-center gap-2"
              >
                Take a selfie
              </button>
            ) : (
              <button
                onClick={capture}
                disabled={!camReady}
                className="w-full bg-[var(--color-blue-600)] text-white text-[12px] rounded-full py-3 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {camReady ? 'Capture Photo' : 'Starting camera...'}
              </button>
            )}
            {!camError && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-[11px] text-neutral-400 underline underline-offset-2 self-center"
              >
                Camera not working? Take a selfie instead
              </button>
            )}
          </>
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
                className="w-1/2 border border-[var(--color-blue-600)] text-white text-[12px] rounded-full py-3 font-medium flex items-center justify-center"
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
                className="w-1/2 border border-[var(--color-blue-600)] text-white text-[12px] rounded-full py-3 font-medium flex items-center justify-center"
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
      </div>
    </div>

    {/* Desktop Instruction Panel */}
    <div className="hidden md:block md:w-[403px] md:h-[603px]">
      <div className="bg-[var(--card)] rounded-[10px] p-4 sticky top-4 overflow-y-auto h-full">
        {renderInstructions()}
      </div>
    </div>

    {/* Mobile Instruction Panel */}
    <div className="md:hidden mt-6 bg-[var(--card)] rounded-[10px] p-4">
      {renderInstructions()}
    </div>
  </div>
);


}
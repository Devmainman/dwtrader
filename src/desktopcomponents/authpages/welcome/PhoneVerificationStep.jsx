import { useState, useEffect } from 'react';
import { sendPhoneVerification, verifyPhoneOTP } from '../../../api/verification';

export default function PhoneVerificationStep({ onBack, onContinue, phoneNumber }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    try {
      await sendPhoneVerification();
      setOtpSent(true);
      setCountdown(60);
      startCountdown();
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  };

  useEffect(() => {
    const timerCleanup = startCountdown();
    return timerCleanup;
  }, []);

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
  
    setLoading(true);
    setError('');
    try {
      const response = await verifyPhoneOTP(otpCode);
      console.log('Verification response:', response); // Add this for debugging
      if (response && response.success) {
        onContinue({ otp: otpCode, verified: true });
      } else {
        setError(response?.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error); // Add this for debugging
      setError(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Verify your Phone Number</h1>
      <p className="text-gray-400">
        We will send you a verification OTP to your Phone number {phoneNumber}.
      </p>
      
      {otpSent && (
        <p className="text-gray-400">Enter the 6 digit code sent to your phone number</p>
      )}
      
      <button
        onClick={handleResend}
        disabled={countdown > 0 || loading}
        className="w-full bg-green-500 text-white rounded-md py-4 font-medium"
      >
        {loading ? 'Sending...' : 
         countdown > 0 ? `Resend code in 00:${countdown.toString().padStart(2, '0')}` : 
         'Request OTP'}
      </button>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Enter OTP below</h2>
        <div className="flex justify-between gap-2 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              className="w-full aspect-square bg-transparent border border-gray-700 rounded-md text-center text-white text-xl"
            />
          ))}
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-blue-500 text-white rounded-md py-4 font-medium"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  );
}
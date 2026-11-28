import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useUserAuth } from '../../../context/UserAuthContext';

export default function VerificationCompleteStep({ to = '/dashboard' }) {
  const navigate = useNavigate();
  const { updateUserProfile } = useUserAuth();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Mark user as verified
    updateUserProfile({ isVerified: true });

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(to);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, updateUserProfile, to]);

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
        <Check size={32} />
      </div>
      <h2 className="text-[22px] text-[var(--fg)] font-medium">Documents submitted</h2>
      <p className="text-[var(--fg-4)] text-[14px] mb-4 text-center">We’ll review them and update your verification status.</p>
      <p className="text-[var(--fg-4)] text-[10px] mb-4">Redirecting in {countdown} seconds...</p>
    </div>
  );
}
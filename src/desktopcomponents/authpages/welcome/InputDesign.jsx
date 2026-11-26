import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import WelcomeStep from './WelcomeStep';
import logo from "../../../assets/Group.svg";
import LanguageDropdown from "../../../components/navigation/LanguageDropdown";
import useBrand from "../../../lib/useBrand";
import PhoneVerificationStep from './PhoneVerificationStep';
import AddressVerificationStep from './AddressVerificationStep';
import IDVerificationStep1 from './IDVerificationStep1';
import IDVerificationStep2 from './IDVerificationStep2';
import IDVerificationStep3 from './IDVerificationStep3';
import WebcamCaptureStep from './WebcamCaptureStep';
import VerificationCompleteStep from './VerificationCompleteStep';

export default function InputDesign() {
  const brand = useBrand();
  const [step, setStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      country: '',
      gender: '',
      currency: ''
    },
    // phoneVerification: {},
    idDocuments: [],
    addressProof: {},
    faceImage: null
  });

  const updateVerificationData = (stepName, data) => {
    setVerificationData(prev => ({
      ...prev,
      [stepName]: data
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1: 
        return <WelcomeStep 
          onContinue={(data) => {
            updateVerificationData('profile', data);
            setStep(2); // move to phone verification step
          }} 
          initialData={verificationData.profile}
        />;
      // case 2: 
      //   return <PhoneVerificationStep 
      //     onBack={() => setStep(1)}
      //     onContinue={(otpData) => {
      //       updateVerificationData('phoneVerification', otpData);
      //       setStep(3);
      //     }}
      //     phoneNumber={verificationData.profile.phoneNumber}
      //   />;
      // return null;
      case 3: 
        return <IDVerificationStep2 
          onBack={() => setStep(2)}
          onContinue={(documents) => {
            updateVerificationData('idDocuments', documents);
            setStep(4);
          }}
        />;
      case 4: 
        return <IDVerificationStep3 
          onBack={() => setStep(3)}
          onContinue={(additionalDoc) => {
            updateVerificationData('idDocuments', [
              ...verificationData.idDocuments,
              additionalDoc
            ]);
            setStep(5);
          }}
        />;
      case 5: 
        return <WebcamCaptureStep 
          onBack={() => setStep(4)}
          onContinue={(faceImage) => {
            updateVerificationData('faceImage', faceImage);
            setStep(6);
          }}
        />;
      case 6: 
        return <AddressVerificationStep 
          onBack={() => setStep(5)}
          onContinue={(address) => {
            updateVerificationData('addressProof', address);
            setStep(7);
          }}
        />;
      case 7: 
        return <IDVerificationStep1 
          onBack={() => setStep(6)}
          onContinue={(proof) => {
            updateVerificationData('addressProof', {
              ...verificationData.addressProof,
              ...proof
            });
            setStep(8);
          }}
        />;
      case 8: 
        return <VerificationCompleteStep />;
      default: 
        return <WelcomeStep onContinue={() => setStep(2)} />;
    }
  };

  useEffect(() => {
    if (step === 2) setStep(3);
  }, [step]);
  

  // Visible steps (step 2, phone OTP, is skipped).
  const STEPS = [[1, 'Profile'], [3, 'ID card'], [4, 'Extra document'], [5, 'Selfie'], [6, 'Address'], [7, 'Proof of address'], [8, 'Done']];
  const idx = Math.max(0, STEPS.findIndex(([n]) => n === step));
  const back = () => setStep((p) => (p === 3 ? 1 : p - 1));

  return (
    <div className="kyc min-h-[100dvh] bg-[var(--page)] text-zinc-100">
      <header className="flex items-center justify-between px-5 sm:px-8 h-[68px]">
        <div className="flex items-center gap-2">
          <img src={logo} alt="" className="w-8 h-8 brand-logo" />
          {brand && <span className="text-[15px] font-semibold tracking-[-0.02em]">{brand}</span>}
        </div>
        <LanguageDropdown variant="icon" />
      </header>

      <div className="max-w-[920px] mx-auto px-5 sm:px-8 pb-12">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            {step > 1 && step < 8 && (
              <button type="button" data-no-busy onClick={back} className="mb-3 inline-flex items-center gap-1 text-[12px] font-medium text-neutral-400 hover:text-zinc-100"><ChevronLeft className="w-4 h-4" />Back</button>
            )}
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-400">Step {idx + 1} of {STEPS.length} · {STEPS[idx][1]}</p>
            <h1 className="mt-1.5 text-[26px] font-semibold tracking-[-0.03em] leading-tight">{step === 8 ? 'You’re all set' : 'Verify your account'}</h1>
            <p className="text-[13px] text-neutral-400 mt-1">{step === 8 ? 'We’ll review your documents and let you know.' : 'A few quick steps keep your account and your money safe.'}</p>
          </div>
          {step < 8 && <a href="/dashboard" className="shrink-0 text-[12px] font-medium text-neutral-400 hover:text-zinc-100">Do it later</a>}
        </div>

        <ol className="mt-6 mb-8 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))` }} aria-label="Progress">
          {STEPS.map(([n, label], i) => (
            <li key={n} className="min-w-0">
              <span className="block h-1.5 rounded-full bg-white/[.08] overflow-hidden"><span className="block h-full rounded-full bg-blue-500 transition-[width] duration-500 ease-out" style={{ width: i <= idx ? '100%' : '0%' }} /></span>
              <span className={`hidden sm:block mt-1.5 text-[10px] truncate ${i === idx ? 'text-zinc-100 font-semibold' : 'text-neutral-500'}`}>{label}</span>
            </li>
          ))}
        </ol>

        <div key={step} className="auth-rise">{renderStep()}</div>
      </div>
    </div>
  );
}

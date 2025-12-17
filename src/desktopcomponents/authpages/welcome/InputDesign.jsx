import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import WelcomeStep from './WelcomeStep';
import Logo from "../../../assets/image-2.svg";
import PhoneVerificationStep from './PhoneVerificationStep';
import AddressVerificationStep from './AddressVerificationStep';
import IDVerificationStep1 from './IDVerificationStep1';
import IDVerificationStep2 from './IDVerificationStep2';
import IDVerificationStep3 from './IDVerificationStep3';
import WebcamCaptureStep from './WebcamCaptureStep';
import VerificationCompleteStep from './VerificationCompleteStep';
import LanguageSelector from './LanguageSelector';

export default function InputDesign() {
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

  const renderStepIndicator = (currentStep, totalSteps) => (
    <div className="md:hidden w-full flex justify-between items-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div 
          key={index} 
          className={`h-1 flex-1 rounded-full ${index < currentStep ? "bg-white" : "bg-gray-600"}`}
        />
      ))}
    </div>
  );



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
  

  return (
    <>
     <div className="flex flex-col min-h-screen bg-neutral-900">   
      <header className="hidden md:flex justify-between items-center ">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" />
          <span className="text-2xl font-bold tracking-wide hidden md:inline">SKOTE</span>
        </div>
        <div className="flex">
          <LanguageSelector />
        </div>
      </header>
    <div className="text-white lg:rounded-[20px]  min-h-[calc(100vh-120px)] md:min-h-[500px] w-full mx-auto px-4 md:px-8 py-6 max-w-none">
      <header className="md:hidden justify-between items-center">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" />
          <span className="text-2xl font-bold tracking-wide hidden md:inline">SKOTE</span>
        </div>
        <div className="flex">
          <LanguageSelector />
        </div>
      </header>
      <div className="md:hidden flex justify-between items-center mb-2">
        {step > 1 && (
          <ChevronLeft className="text-white cursor-pointer" onClick={() => setStep(prev => prev - 1)} />
        )}
        {step === 1 && <div />}
        <div className="text-gray-400 text-sm ml-auto">Step {Math.min(step, 8)}/8</div>
      </div>

      {renderStepIndicator(step, 8)}
      {renderStep()}
    </div>
     </div>
    </>
  );
}

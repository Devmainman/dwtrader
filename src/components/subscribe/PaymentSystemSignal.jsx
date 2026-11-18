// /signal-payment: the shared payment UI for signal packages.
import { useSearchParams } from 'react-router-dom';
import PaymentFlow, { postProof } from '../payment/PaymentFlow';
import { useUserAuth } from '../../context/UserAuthContext';

const INSTRUCTIONS = {
  title: "Let's Proceed with Signal Upgrade",
  intro: 'To upgrade your signal package, please follow these simple steps:',
  steps: [
    'Initiate the payment by transferring the funds to the provided details.',
    'Upload the proof of payment in the section provided to ensure quick signal package activation.'
  ],
  outro: 'Once completed, our team will verify and activate your signal package. Need help? Contact support.'
};

export default function PaymentSystemSignal() {
  const { token } = useUserAuth();
  const [params] = useSearchParams();
  const packageId = params.get('packageId');
  return (
    <PaymentFlow
      purpose="Signal package"
      heading="Boost your signal strength"
      subheading="Your signal strength goes up as soon as this payment is approved."
      amount={params.get('amount') || undefined}
      showAmountOnPhone={false}
      instructions={INSTRUCTIONS}
      onSubmit={async ({ method, file }) => {
        if (!packageId) throw new Error('Missing signal package ID');
        await postProof('/signal-upgrade/upgrade', token, { packageId, paymentMethod: method.methodId, paymentProof: file });
        return 'Signal payment submitted. Awaiting approval.';
      }}
    />
  );
}

// Deposit page (/deposite): the shared payment UI with an amount the user types.
import PaymentFlow, { postProof } from '../../payment/PaymentFlow';
import { useUserAuth } from '../../../context/UserAuthContext';

const INSTRUCTIONS = {
  title: "Let's Proceed with that Deposit",
  intro: 'To make a deposit, please follow these simple steps:',
  steps: [
    'Payment Information: Initiate the payment by transferring the funds to the provided payment details.',
    'Proof of Payment: After making the payment, upload the proof of payment in the designated section. This ensures a seamless update to your account.'
  ],
  outro: 'Once completed, our team will verify the payment and credit the amount to your account promptly. For any assistance, our dedicated support team is available to help you.'
};

export default function PaymentSystem() {
  const { token } = useUserAuth();
  return (
    <PaymentFlow
      purpose="Deposit"
      heading="Deposit funds"
      subheading="Send money with any method below, then upload your receipt. It is added to your balance once we confirm it."
      editableAmount
      amountPlaceholder={(cur) => `Deposit Amount (${cur})`}
      instructions={INSTRUCTIONS}
      onSubmit={async ({ method, file, amount, currency }) => {
        await postProof('/payments/deposit', token, { paymentMethodId: method.methodId, amount, currency, paymentProof: file });
        return 'Deposit submitted. It is added to your balance once we confirm it.';
      }}
    />
  );
}

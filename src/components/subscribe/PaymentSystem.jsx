// /payment: the shared payment UI for account upgrades (default), card payments
// (?mode=card) and AI Smart Trader subscriptions (?mode=bot). The amount comes
// from the page that sent the user here; the server prices every payment itself.
import { useSearchParams } from 'react-router-dom';
import PaymentFlow, { postProof } from '../payment/PaymentFlow';
import { useUserAuth } from '../../context/UserAuthContext';

const UPGRADE_INSTRUCTIONS = {
  title: "Let's Proceed with that Upgrade",
  intro: 'To make a Upgrade, please follow these simple steps:'
};

export default function PaymentSystem() {
  const { token } = useUserAuth();
  const [params] = useSearchParams();
  const mode = params.get('mode');
  const amount = params.get('amount') || undefined;

  if (mode === 'card') {
    const which = params.get('stage') === 'activation' ? 'activation' : 'purchase';
    const id = params.get('cardRequest');
    return (
      <PaymentFlow
        purpose={which === 'purchase' ? 'Card purchase' : 'Card activation'}
        heading={which === 'purchase' ? 'Pay for your card' : 'Activate your card'}
        subheading={which === 'purchase' ? 'Once this payment is approved you can activate the card.' : 'Your card becomes active once this payment is approved.'}
        amount={amount}
        instructions={{ title: which === 'purchase' ? "Let's get your card" : "Let's activate your card", intro: 'To pay for your card, please follow these simple steps:' }}
        successRedirect="/cards"
        onSubmit={async ({ method, file }) => {
          if (!id) throw new Error('Missing card request');
          await postProof(`/card-requests/${id}/pay/${which}`, token, { paymentMethod: method.methodId, paymentProof: file });
          return which === 'purchase'
            ? 'Card payment submitted. You can activate the card once it is approved.'
            : 'Activation payment submitted. Your card becomes active once it is approved.';
        }}
      />
    );
  }

  if (mode === 'bot') {
    const id = params.get('botSubscription');
    return (
      <PaymentFlow
        purpose="AI Smart Trader"
        heading="Start your AI Smart Trader"
        subheading="Your bot starts trading as soon as this payment is approved."
        amount={amount}
        instructions={{ title: "Let's start your bot", intro: 'To subscribe, please follow these simple steps:' }}
        successRedirect="/ai-trader"
        onSubmit={async ({ method, file }) => {
          if (!id) throw new Error('Missing bot subscription');
          await postProof(`/smart-bots/subscriptions/${id}/pay`, token, { paymentMethod: method.methodId, paymentProof: file });
          return 'Payment submitted. Your bot starts trading once it is approved.';
        }}
      />
    );
  }

  // Account upgrade
  const packageId = params.get('packageId');
  return (
    <PaymentFlow
      purpose="Account upgrade"
      heading="Upgrade your account"
      subheading="Your account upgrades as soon as this payment is approved."
      amount={amount}
      editableAmount={!amount}
      amountPlaceholder={(cur) => `upgrade Amount (${cur})`}
      instructions={UPGRADE_INSTRUCTIONS}
      onSubmit={async ({ method, file, amount: amt, currency }) => {
        await postProof('/upgradeinvoices', token, {
          paymentMethod: method.methodId,
          amount: parseFloat(String(amt ?? '').replace(/[^\d.]/g, '')) || undefined,
          currency,
          packageId: packageId || undefined,
          paymentProof: file
        });
        return 'Payment submitted. Your account upgrades as soon as it is approved.';
      }}
    />
  );
}

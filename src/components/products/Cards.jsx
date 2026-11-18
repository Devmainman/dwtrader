// Cards: browse the cards the admin set up (Virtual / Physical), request one,
// pay the purchase price, then (once approved) pay the activation fee.
// Payments go through the platform's normal payment page (method + proof).
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CreditCard, Wifi, Check, Clock, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { cardRequestsApi } from '../../api/products';
import { STATIC_BASE_URL } from '../../api/config';
import { useUserAuth } from '../../context/UserAuthContext';
import {
  Page, Panel, Button, Badge, Modal, Field, inputClass, Tabs,
  Loading, ErrorState, Empty, useLoader, useAction, formatMoney, formatDate
} from './ui';

const fileUrl = (p) => (p ? (/^https?:/.test(p) ? p : `${STATIC_BASE_URL}${p}`) : '');
const PRESET = {
  midnight: 'bg-[linear-gradient(135deg,#1f2937_0%,#0b0f19_100%)] text-white',
  aurora: 'bg-[linear-gradient(135deg,#14b8a6_0%,#4338ca_100%)] text-white',
  gold: 'bg-[linear-gradient(135deg,#fcd34d_0%,#b45309_100%)] text-zinc-900',
  rose: 'bg-[linear-gradient(135deg,#fb7185_0%,#a21caf_100%)] text-white',
  silver: 'bg-[linear-gradient(135deg,#e4e4e7_0%,#71717a_100%)] text-zinc-900',
  emerald: 'bg-[linear-gradient(135deg,#34d399_0%,#065f46_100%)] text-white'
};
const NETWORK = { visa: 'VISA', mastercard: 'Mastercard', amex: 'AMEX', discover: 'Discover', unionpay: 'UnionPay', verve: 'Verve', jcb: 'JCB', other: '' };
const HOW = [
  ['Pick a card', 'Choose a virtual or physical card and see its purchase price and activation fee.'],
  ['Request it', 'Enter the cardholder details and pay the purchase price with any payment method.'],
  ['Purchase approved', 'We check your payment. Once approved, the card moves to activation.'],
  ['Activate', 'Pay the activation fee. When it is approved your card becomes active.']
];

/** The card picture: the admin's uploaded design, or a built-in look. */
export function CardArt({ product, holder, last4, expiry, dim }) {
  const p = product || {};
  if (p.design) {
    return (
      <div className={`relative w-full aspect-[1.586] max-w-sm rounded-xl overflow-hidden shadow-xl ${dim ? 'opacity-70' : ''}`}>
        <img src={fileUrl(p.design)} alt={p.name || 'Card'} className="w-full h-full object-cover" />
        {last4 && <p className="absolute left-4 bottom-4 font-mono text-sm tracking-widest text-white drop-shadow">•••• {last4}</p>}
      </div>
    );
  }
  return (
    <div className={`relative w-full aspect-[1.586] max-w-sm rounded-xl p-5 shadow-xl overflow-hidden ${PRESET[p.designPreset] || PRESET.midnight} ${dim ? 'opacity-70' : ''}`}>
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
      <div className="relative flex items-center justify-between">
        <span className="text-sm font-medium opacity-90 truncate">{p.name}</span>
        <Wifi className="w-5 h-5 rotate-90 opacity-80 shrink-0" />
      </div>
      <div className="relative w-10 h-7 rounded-md bg-amber-200/80 mt-5" />
      <p className="relative mt-4 font-mono text-base tracking-widest">{last4 ? `•••• •••• •••• ${last4}` : '•••• •••• •••• ••••'}</p>
      <div className="relative flex items-end justify-between mt-3 text-xs gap-2">
        <div className="min-w-0">
          <p className="opacity-60 text-[10px]">Card holder</p>
          <p className="font-medium tracking-wide truncate">{holder || 'YOUR NAME'}</p>
        </div>
        {expiry && <div><p className="opacity-60 text-[10px]">Expires</p><p className="font-medium">{expiry}</p></div>}
        <p className="text-base font-semibold italic">{NETWORK[p.network] || ''}</p>
      </div>
    </div>
  );
}

const STAGE = {
  purchase_unpaid: { badge: <Badge tone="warning">Payment needed</Badge>, text: 'Pay the purchase price to send your request.' },
  purchase_review: { badge: <Badge tone="info">Purchase in review</Badge>, text: 'We are checking your purchase payment.' },
  activation_unpaid: { badge: <Badge tone="warning">Ready to activate</Badge>, text: 'Your purchase is approved. Pay the activation fee to activate the card.' },
  activation_review: { badge: <Badge tone="info">Activation in review</Badge>, text: 'We are checking your activation payment.' },
  active: { badge: <Badge tone="success">Active</Badge>, text: 'Your card is active.' },
  rejected: { badge: <Badge tone="danger">Rejected</Badge>, text: 'This request was closed.' }
};

const payUrl = (r, which) => {
  const pay = r[which];
  return `/payment?mode=card&cardRequest=${r._id}&stage=${which}&amount=${encodeURIComponent(pay?.amount ?? '')}&currency=${encodeURIComponent(pay?.currency || '')}`;
};

/** Cardholder details form, then the request is saved and the user goes to pay. */
function RequestModal({ product, onClose }) {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const { busy, run } = useAction();
  const [f, setF] = useState({
    fullName: [user?.firstName, user?.lastName].filter(Boolean).join(' ').toUpperCase(),
    email: user?.email || '', phone: user?.phoneNumber || '', dateOfBirth: '',
    street: '', city: '', state: '', postalCode: '', country: user?.country || ''
  });
  const [error, setError] = useState('');
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: k === 'fullName' ? e.target.value.toUpperCase() : e.target.value }));
  const physical = product.type === 'physical';

  const submit = async () => {
    setError('');
    if (f.fullName.trim().length < 3) return setError('Enter the name to print on the card');
    if (physical && (!f.street.trim() || !f.city.trim() || !f.country.trim())) return setError('Enter the delivery address for your physical card');
    const r = await run(() => cardRequestsApi.create(product._id, {
      fullName: f.fullName, email: f.email, phone: f.phone, dateOfBirth: f.dateOfBirth,
      address: { street: f.street, city: f.city, state: f.state, postalCode: f.postalCode, country: f.country }
    }), 'Card requested. Now pay the purchase price.');
    if (r?._id) navigate(payUrl({ ...r, purchase: { amount: product.purchasePrice, currency: product.currency } }, 'purchase'));
  };

  return (
    <Modal open title={`Request ${product.name}`} onClose={onClose}
      footer={<Button className="w-full" busy={busy} onClick={submit}>Request card · pay {formatMoney(product.purchasePrice, product.currency)}</Button>}>
      <div className="space-y-3">
        <CardArt product={product} holder={f.fullName} />
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-neutral-800/60 p-3"><p className="text-neutral-400">Purchase price</p><p className="text-white font-medium mt-0.5">{formatMoney(product.purchasePrice, product.currency)}</p></div>
          <div className="rounded-xl bg-neutral-800/60 p-3"><p className="text-neutral-400">Activation fee (later)</p><p className="text-white font-medium mt-0.5">{formatMoney(product.activationFee, product.currency)}</p></div>
        </div>
        <Field label="Name on card"><input className={inputClass} value={f.fullName} onChange={set('fullName')} placeholder="JOHN DOE" /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Email"><input className={inputClass} type="email" value={f.email} onChange={set('email')} /></Field>
          <Field label="Phone"><input className={inputClass} type="tel" value={f.phone} onChange={set('phone')} /></Field>
        </div>
        <Field label="Date of birth"><input className={inputClass} type="date" value={f.dateOfBirth} onChange={set('dateOfBirth')} /></Field>
        {physical && (
          <>
            <p className="text-xs font-semibold text-zinc-100 pt-1">Delivery address</p>
            <Field label="Street"><input className={inputClass} value={f.street} onChange={set('street')} /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="City"><input className={inputClass} value={f.city} onChange={set('city')} /></Field>
              <Field label="State"><input className={inputClass} value={f.state} onChange={set('state')} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Postal code"><input className={inputClass} value={f.postalCode} onChange={set('postalCode')} /></Field>
              <Field label="Country"><input className={inputClass} value={f.country} onChange={set('country')} /></Field>
            </div>
          </>
        )}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </Modal>
  );
}

function Steps({ r }) {
  const done = (k) => r[k]?.status === 'approved';
  const step = (label, state) => (
    <div className="flex items-center gap-2 text-[11px]">
      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${state === 'done' ? 'bg-emerald-500/20 text-emerald-400' : state === 'now' ? 'bg-blue-600/20 text-blue-400' : 'bg-neutral-800 text-neutral-500'}`}>
        {state === 'done' ? <Check className="w-3 h-3" /> : state === 'now' ? <Clock className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      </span>
      <span className={state === 'todo' ? 'text-neutral-500' : 'text-zinc-200'}>{label}</span>
    </div>
  );
  return (
    <div className="space-y-1.5">
      {step('Card requested', 'done')}
      {step('Purchase payment approved', done('purchase') ? 'done' : r.stage.startsWith('purchase') ? 'now' : 'todo')}
      {step('Activation payment approved', done('activation') ? 'done' : r.stage.startsWith('activation') ? 'now' : 'todo')}
    </div>
  );
}

function RequestItem({ r, onChanged }) {
  const navigate = useNavigate();
  const { busy, run } = useAction();
  const s = STAGE[r.stage] || STAGE.rejected;
  const rejected = r.stage === 'purchase_unpaid' ? r.purchase?.status === 'rejected' && r.purchase?.note : r.stage === 'activation_unpaid' ? r.activation?.status === 'rejected' && r.activation?.note : null;
  return (
    <div className="rounded-xl border border-neutral-800 bg-[#1D1D1F] p-4 grid sm:grid-cols-[220px_1fr] gap-4">
      <CardArt product={r.product} holder={r.holder?.fullName} last4={r.card?.last4} expiry={r.card?.expiry} dim={r.stage !== 'active'} />
      <div className="min-w-0 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-100 truncate">{r.product?.name}</p>
            <p className="text-[11px] text-neutral-400 capitalize">{r.product?.type} card · requested {formatDate(r.createdAt)}</p>
          </div>
          {s.badge}
        </div>
        <Steps r={r} />
        <p className="text-xs text-neutral-400">{s.text}</p>
        {rejected && <p className="text-xs text-red-400">Your last payment was rejected: {rejected}</p>}
        <div className="flex flex-wrap gap-2">
          {r.stage === 'purchase_unpaid' && (
            <>
              <Button onClick={() => navigate(payUrl(r, 'purchase'))}>Pay {formatMoney(r.purchase?.amount, r.purchase?.currency)}</Button>
              <Button variant="secondary" busy={busy} onClick={() => run(() => cardRequestsApi.cancel(r._id), 'Request cancelled').then((x) => x && onChanged())}>Cancel request</Button>
            </>
          )}
          {r.stage === 'activation_unpaid' && (
            <Button onClick={() => navigate(`/cards/activate/${r._id}`)}>Activate card <ArrowRight className="w-3.5 h-3.5" /></Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Cards() {
  const [tab, setTab] = useState('virtual');
  const [picked, setPicked] = useState(null);
  const catalog = useLoader(() => cardRequestsApi.catalog(), []);
  const mine = useLoader(() => cardRequestsApi.list(), []);

  // Keep "My cards" current after the admin approves or rejects a payment.
  useEffect(() => {
    const t = setInterval(() => { if (document.visibilityState === 'visible') mine.reload(); }, 20000);
    return () => clearInterval(t);
  }, [mine.reload]);

  const requests = mine.data?.items || [];
  const openByProduct = useMemo(() => new Set(requests.filter((r) => !['active', 'rejected', 'cancelled'].includes(r.stage)).map((r) => String(r.productId))), [requests]);
  const toActivate = requests.filter((r) => r.stage === 'activation_unpaid').length;
  const items = (catalog.data?.items || []).filter((p) => p.type === tab);

  return (
    <Page title="Cards" subtitle="Virtual and physical cards for spending anywhere" icon={CreditCard}>
      {toActivate > 0 && tab !== 'mine' && (
        <button type="button" onClick={() => setTab('mine')} className="w-full mb-4 flex items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-600/10 p-3 text-left">
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-xs text-zinc-100 flex-1">{toActivate === 1 ? 'A card is ready to activate.' : `${toActivate} cards are ready to activate.`}</span>
          <ArrowRight className="w-4 h-4 text-blue-400" />
        </button>
      )}
      <Tabs value={tab} onChange={setTab} how={HOW} tabs={[
        { value: 'virtual', label: 'Virtual cards' },
        { value: 'physical', label: 'Physical cards' },
        { value: 'mine', label: `My cards${requests.length ? ` (${requests.length})` : ''}` }
      ]} />

      {tab === 'mine' ? (
        mine.error ? <ErrorState message={mine.error} onRetry={mine.reload} />
          : mine.loading && !mine.data ? <Loading />
            : !requests.length ? <Empty icon={CreditCard} title="No cards yet" text="Pick a virtual or physical card to get started." />
              : <div className="space-y-3">{requests.map((r) => <RequestItem key={r._id} r={r} onChanged={mine.reload} />)}</div>
      ) : catalog.error ? <ErrorState message={catalog.error} onRetry={catalog.reload} />
        : catalog.loading && !catalog.data ? <Loading />
          : !items.length ? <Empty icon={CreditCard} title={`No ${tab} cards available`} text="Check back soon." />
            : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((p) => {
                  const open = openByProduct.has(String(p._id));
                  return (
                    <div key={p._id} className="rounded-xl border border-neutral-800 bg-[#1D1D1F] p-4 space-y-3">
                      <CardArt product={p} />
                      <div>
                        <p className="text-sm font-semibold text-zinc-100">{p.name}</p>
                        <p className="text-[11px] text-neutral-400">{NETWORK[p.network] || p.network} · {p.type === 'physical' ? 'Delivered to you' : 'Ready to use online'}</p>
                        {p.description && <p className="text-xs text-neutral-400 mt-1">{p.description}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-neutral-800/60 p-2.5"><p className="text-neutral-400 text-[11px]">Purchase price</p><p className="text-white font-medium">{formatMoney(p.purchasePrice, p.currency)}</p></div>
                        <div className="rounded-lg bg-neutral-800/60 p-2.5"><p className="text-neutral-400 text-[11px]">Activation fee</p><p className="text-white font-medium">{formatMoney(p.activationFee, p.currency)}</p></div>
                      </div>
                      {open
                        ? <Button variant="secondary" className="w-full" onClick={() => setTab('mine')}>Continue your request</Button>
                        : <Button className="w-full" onClick={() => setPicked(p)}>Get this card</Button>}
                    </div>
                  );
                })}
              </div>
            )}
      {picked && <RequestModal product={picked} onClose={() => setPicked(null)} />}
    </Page>
  );
}

/** /cards/activate/:id : the card and its activation fee, then pay. */
export function CardActivation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mine = useLoader(() => cardRequestsApi.list(), []);
  const r = (mine.data?.items || []).find((x) => x._id === id);
  return (
    <Page title="Card activation" subtitle="One last step to start using your card" icon={ShieldCheck}>
      {mine.error ? <ErrorState message={mine.error} onRetry={mine.reload} />
        : mine.loading && !mine.data ? <Loading />
          : !r ? <Empty icon={CreditCard} title="Card not found" action={<Link to="/cards" className="text-xs text-blue-400">Back to cards</Link>} />
            : (
              <Panel>
                <div className="grid sm:grid-cols-[minmax(0,320px)_1fr] gap-6 items-start">
                  <CardArt product={r.product} holder={r.holder?.fullName} />
                  <div className="space-y-4">
                    <div>
                      <p className="text-base font-semibold text-zinc-100">{r.product?.name}</p>
                      <p className="text-xs text-neutral-400 capitalize">{r.product?.type} card · purchase approved</p>
                    </div>
                    {r.stage === 'activation_unpaid' ? (
                      <>
                        <div className="rounded-xl bg-neutral-800/60 p-4">
                          <p className="text-xs text-neutral-400">Activation fee</p>
                          <p className="text-2xl font-semibold text-white mt-1">{formatMoney(r.activation?.amount, r.activation?.currency)}</p>
                        </div>
                        {r.activation?.status === 'rejected' && r.activation?.note && <p className="text-xs text-red-400">Your last activation payment was rejected: {r.activation.note}</p>}
                        <Button className="w-full sm:w-auto" onClick={() => navigate(payUrl(r, 'activation'))}>Activate card</Button>
                      </>
                    ) : r.stage === 'activation_review' ? (
                      <p className="text-sm text-neutral-300 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" />Your activation payment is being reviewed.</p>
                    ) : r.stage === 'active' ? (
                      <p className="text-sm text-emerald-400 flex items-center gap-2"><Check className="w-4 h-4" />This card is active.</p>
                    ) : (
                      <p className="text-sm text-neutral-300 flex items-center gap-2"><X className="w-4 h-4 text-amber-400" />Your purchase payment must be approved before you can activate this card.</p>
                    )}
                    <Link to="/cards" className="inline-block text-xs text-neutral-400 hover:text-zinc-200">Back to cards</Link>
                  </div>
                </div>
              </Panel>
            )}
    </Page>
  );
}

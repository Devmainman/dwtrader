// Cards: browse the cards the admin set up (Virtual / Physical), request one,
// pay the purchase price, then (once approved) pay the activation fee.
// Payments go through the platform's normal payment page (method + proof).
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CreditCard, Wifi, Check, Clock, X, ArrowRight, ShieldCheck, Eye, EyeOff, Copy, KeyRound, Loader2 } from 'lucide-react';
import { cardRequestsApi, apiError } from '../../api/products';
import { toast } from '../../lib/toast';
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
export function CardArt({ product, holder, last4, expiry, dim, number, face }) {
  const p = product || {};
  if (p.design && face) {
    // Full card face over the admin's uploaded design (used in the card pop-up).
    return (
      <div className={`relative w-full aspect-[1.586] rounded-2xl overflow-hidden shadow-2xl ${dim ? 'opacity-70 grayscale-[40%]' : ''}`}>
        <img src={fileUrl(p.design)} alt={p.name || 'Card'} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-5 text-white drop-shadow">
          <p className="font-mono text-base sm:text-lg tracking-widest">{number || (last4 ? `•••• •••• •••• ${last4}` : '•••• •••• •••• ••••')}</p>
          <div className="flex items-end justify-between mt-3 text-xs gap-2">
            <div className="min-w-0"><p className="opacity-70 text-[10px]">Card holder</p><p className="font-medium tracking-wide truncate">{holder || 'YOUR NAME'}</p></div>
            {expiry && <div><p className="opacity-70 text-[10px]">Expires</p><p className="font-medium font-mono">{expiry}</p></div>}
            <p className="text-base font-semibold italic">{NETWORK[p.network] || ''}</p>
          </div>
        </div>
      </div>
    );
  }
  if (p.design) {
    return (
      <div className={`relative w-full aspect-[1.586] max-w-sm rounded-xl overflow-hidden shadow-xl ${dim ? 'opacity-70' : ''}`}>
        <img src={fileUrl(p.design)} alt={p.name || 'Card'} className="w-full h-full object-cover" />
        {last4 && <p className="absolute left-4 bottom-4 font-mono text-sm tracking-widest text-white drop-shadow">•••• {last4}</p>}
      </div>
    );
  }
  return (
    <div className={`relative w-full aspect-[1.586] ${face ? 'rounded-2xl shadow-2xl' : 'max-w-sm rounded-xl shadow-xl'} p-5 overflow-hidden ${PRESET[p.designPreset] || PRESET.midnight} ${dim ? 'opacity-70' : ''}`}>
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
      <div className="relative flex items-center justify-between">
        <span className="text-sm font-medium opacity-90 truncate">{p.name}</span>
        <Wifi className="w-5 h-5 rotate-90 opacity-80 shrink-0" />
      </div>
      <div className="relative w-10 h-7 rounded-md bg-amber-200/80 mt-5" />
      <p className={`relative mt-4 font-mono tracking-widest ${face ? 'text-base sm:text-lg' : 'text-base'}`}>{number || (last4 ? `•••• •••• •••• ${last4}` : '•••• •••• •••• ••••')}</p>
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
  active: { badge: <Badge tone="success">Active</Badge>, text: 'Your card is active. Open it to see the card details and set your PIN.' },
  frozen: { badge: <Badge tone="info">Frozen</Badge>, text: 'This card is frozen. Contact support to unfreeze it.' },
  terminated: { badge: <Badge tone="danger">Terminated</Badge>, text: 'This card was terminated and can no longer be used.' },
  rejected: { badge: <Badge tone="danger">Rejected</Badge>, text: 'This request was closed.' }
};

/** One status per card for the pop-up: pending, awaiting activation, active, frozen, terminated. */
const CARD_STATUS = (stage) => (
  stage.startsWith('purchase') ? { label: 'Pending', tone: 'warning', text: stage === 'purchase_review' ? 'We are checking your purchase payment.' : 'Pay the purchase price to send your request.' }
    : stage.startsWith('activation') ? { label: 'Awaiting activation', tone: 'info', text: stage === 'activation_review' ? 'We are checking your activation payment.' : 'Pay the activation fee to activate the card.' }
      : stage === 'active' ? { label: 'Active', tone: 'success', text: 'Your card is ready to use.' }
        : stage === 'frozen' ? { label: 'Frozen', tone: 'info', text: 'This card is frozen. Its details are hidden until it is unfrozen.' }
          : stage === 'terminated' ? { label: 'Terminated', tone: 'danger', text: 'This card was terminated and can no longer be used.' }
            : { label: 'Closed', tone: 'neutral', text: 'This request was closed.' }
);

function CopyButton({ value, label }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      toast.success(`${label} copied`);
      setTimeout(() => setDone(false), 1500);
    } catch {
      toast.error('Could not copy. Select the text and copy it instead.');
    }
  };
  return (
    <button type="button" onClick={copy} aria-label={`Copy ${label}`}
      className="w-7 h-7 rounded-full flex items-center justify-center bg-neutral-800 text-neutral-400 hover:text-white shrink-0">
      {done ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function DetailRow({ label, value, copy, mono, reveal }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-neutral-800 last:border-0">
      <div className="min-w-0">
        <p className="text-[11px] text-neutral-500">{label}</p>
        <p className={`text-sm text-zinc-100 truncate ${mono ? 'font-mono tracking-wider' : ''}`}>{value}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {reveal && (
          <button type="button" onClick={reveal.onToggle} disabled={reveal.busy}
            aria-label={`${reveal.shown ? 'Hide' : 'Show'} ${label}`} title={`${reveal.shown ? 'Hide' : 'Show'} ${label}`}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-60">
            {reveal.busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : reveal.shown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}
        {copy && <CopyButton value={copy} label={label} />}
      </div>
    </div>
  );
}

function PinInput({ label, value, onChange, autoFocus }) {
  return (
    <Field label={label}>
      <input className={`${inputClass} font-mono tracking-[0.6em] text-center`} type="password" inputMode="numeric" autoComplete="off" maxLength={4}
        autoFocus={autoFocus} value={value} placeholder="••••" onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 4))} />
    </Field>
  );
}

/** Set the first PIN, or change it (current PIN, then the new one twice). */
function PinPanel({ r, onChanged }) {
  const isSet = r.pin?.isSet;
  const [open, setOpen] = useState(!isSet);
  const [f, setF] = useState({ current: '', pin: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // { ok, text }
  const set = (k) => (v) => { setF((s) => ({ ...s, [k]: v })); setMsg(null); };
  const locked = r.pin?.lockedUntil && new Date(r.pin.lockedUntil) > new Date();

  const submit = async () => {
    setMsg(null);
    if (isSet && f.current.length !== 4) return setMsg({ ok: false, text: 'Enter your current 4-digit PIN' });
    if (f.pin.length !== 4) return setMsg({ ok: false, text: 'Enter a 4-digit PIN' });
    if (f.pin !== f.confirm) return setMsg({ ok: false, text: 'The two PINs do not match' });
    if (isSet && f.pin === f.current) return setMsg({ ok: false, text: 'The new PIN must be different from the current one' });
    setBusy(true);
    try {
      const next = isSet ? await cardRequestsApi.changePin(r._id, f.current, f.pin, f.confirm) : await cardRequestsApi.setPin(r._id, f.pin, f.confirm);
      const text = isSet ? 'Your card PIN was changed.' : 'Your card PIN is set.';
      toast.success(text);
      setMsg({ ok: true, text });
      setF({ current: '', pin: '', confirm: '' });
      setOpen(false);
      onChanged(next);
    } catch (err) {
      const text = apiError(err);
      toast.error(text);
      setMsg({ ok: false, text });
      if (err?.response?.status === 429) onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <KeyRound className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-100">Card PIN</p>
            <p className="text-[11px] text-neutral-500">{isSet ? `Set ${formatDate(r.pin.setAt)}` : 'Not set yet'}</p>
          </div>
        </div>
        {isSet && !open && <Button variant="secondary" onClick={() => { setOpen(true); setMsg(null); }}>Change PIN</Button>}
      </div>
      {msg?.ok && !open && <p className="mt-3 text-xs text-emerald-400 flex items-center gap-1.5"><Check className="w-3.5 h-3.5" />{msg.text}</p>}
      {open && (
        <div className="mt-4">
          {locked && <p className="mb-3 text-xs text-amber-400">Too many wrong attempts. You can try again after {new Date(r.pin.lockedUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</p>}
          {isSet && <PinInput label="Current PIN" value={f.current} onChange={set('current')} autoFocus />}
          <div className="grid grid-cols-2 gap-3">
            <PinInput label={isSet ? 'New PIN' : 'New 4-digit PIN'} value={f.pin} onChange={set('pin')} />
            <PinInput label="Confirm PIN" value={f.confirm} onChange={set('confirm')} />
          </div>
          {msg && <p className={`-mt-1 mb-3 text-xs ${msg.ok ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</p>}
          <div className="flex gap-2">
            <Button className="flex-1" busy={busy} disabled={locked} onClick={submit}>{isSet ? 'Change PIN' : 'Set PIN'}</Button>
            {isSet && <Button variant="secondary" disabled={busy} onClick={() => { setOpen(false); setF({ current: '', pin: '', confirm: '' }); setMsg(null); }}>Cancel</Button>}
          </div>
          <p className="mt-2 text-[10px] text-neutral-500">Avoid easy PINs like 1111 or 1234. Never share your PIN with anyone.</p>
        </div>
      )}
    </div>
  );
}

/** The card pop-up: the card face, its status, the details (revealed on request) and the PIN. */
function CardModal({ r: initial, onClose, onChanged }) {
  const [r, setR] = useState(initial);
  const [secret, setSecret] = useState(null);          // full number + CVV, kept only while something is shown
  const [shown, setShown] = useState({ pan: false, cvv: false });
  const [busy, setBusy] = useState(null);               // 'pan' | 'cvv' | 'all' while fetching
  const [error, setError] = useState('');
  const st = CARD_STATUS(r.stage);
  const c = r.card || {};
  const active = r.stage === 'active';
  const amex = r.product?.network === 'amex';
  const anyShown = shown.pan || shown.cvv;
  const allShown = shown.pan && shown.cvv;

  useEffect(() => setR(initial), [initial]);
  const hideAll = () => { setShown({ pan: false, cvv: false }); setSecret(null); };
  // Hide the full number and CVV again after a minute.
  useEffect(() => {
    if (!anyShown) return undefined;
    const t = setTimeout(hideAll, 60000);
    return () => clearTimeout(t);
  }, [anyShown]);
  useEffect(() => { if (!active) hideAll(); }, [active]);

  /** Show or hide one field ('pan' | 'cvv'), or both ('all'). Fetches the details the first time. */
  const reveal = async (which) => {
    const fields = which === 'all' ? ['pan', 'cvv'] : [which];
    const show = which === 'all' ? !allShown : !shown[which];
    if (!show) {
      const next = { ...shown };
      fields.forEach((f) => { next[f] = false; });
      if (!next.pan && !next.cvv) return hideAll();
      return setShown(next);
    }
    setError('');
    if (!secret) {
      setBusy(which);
      try {
        setSecret(await cardRequestsApi.details(r._id));
      } catch (err) {
        const text = apiError(err);
        setError(text);
        toast.error(text);
        return undefined;
      } finally {
        setBusy(null);
      }
    }
    setShown((s) => ({ ...s, ...Object.fromEntries(fields.map((f) => [f, true])) }));
    return undefined;
  };
  const canReveal = active && c.issued;
  const panShown = shown.pan && secret;
  const cvvShown = shown.cvv && secret;

  return (
    <Modal open title={r.product?.name || 'Your card'} onClose={onClose}>
      <div className="space-y-4">
        <CardArt face product={r.product} holder={c.holderName || r.holder?.fullName} last4={c.last4} expiry={c.expiry}
          number={panShown ? secret.panFormatted : undefined} dim={!active} />
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs text-neutral-400">{st.text}{r.statusNote && ['frozen', 'terminated'].includes(r.stage) ? ` ${r.statusNote}` : ''}</p>
          <Badge tone={st.tone}>{st.label}</Badge>
        </div>

        {c.issued ? (
          <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 px-4 py-1">
            <DetailRow label="Card number" mono value={panShown ? secret.panFormatted : c.maskedNumber} copy={panShown ? secret.pan : undefined}
              reveal={canReveal ? { shown: !!panShown, busy: busy === 'pan', onToggle: () => reveal('pan') } : undefined} />
            <div className="grid grid-cols-2 gap-x-4">
              <DetailRow label="Expiry" mono value={c.expiry} copy={canReveal ? c.expiry : undefined} />
              <DetailRow label="CVV" mono value={cvvShown ? secret.cvv : amex ? '••••' : '•••'} copy={cvvShown ? secret.cvv : undefined}
                reveal={canReveal ? { shown: !!cvvShown, busy: busy === 'cvv', onToggle: () => reveal('cvv') } : undefined} />
            </div>
            <DetailRow label="Card holder" value={c.holderName} copy={canReveal ? c.holderName : undefined} />
            <div className="grid grid-cols-2 gap-x-4">
              <DetailRow label="Network" value={NETWORK[r.product?.network] || r.product?.network || '—'} />
              <DetailRow label="Type" value={r.product?.type === 'physical' ? 'Physical' : 'Virtual'} />
            </div>
          </div>
        ) : (
          <p className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4 text-xs text-neutral-400">
            {active ? 'Your card details are being prepared. They will appear here shortly.' : 'Your card number, expiry and CVV appear here once the card is active.'}
          </p>
        )}

        {active && c.issued && (
          <>
            <Button variant={allShown ? 'secondary' : 'primary'} className="w-full" busy={busy === 'all'} disabled={!!busy} onClick={() => reveal('all')}>
              {allShown ? <><EyeOff className="w-3.5 h-3.5" />Hide details</> : <><Eye className="w-3.5 h-3.5" />Show details</>}
            </Button>
            {error && <p className="text-xs text-red-400 -mt-2">{error}</p>}
            {anyShown && <p className="text-[10px] text-neutral-500 -mt-2 text-center">Details hide again after 60 seconds. Don't share them with anyone.</p>}
            <PinPanel r={r} onChanged={(next) => { if (next?._id) setR(next); onChanged(); }} />
          </>
        )}
      </div>
    </Modal>
  );
}

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

function RequestItem({ r, onChanged, onOpen }) {
  const navigate = useNavigate();
  const { busy, run } = useAction();
  const s = STAGE[r.stage] || STAGE.rejected;
  const rejected = r.stage === 'purchase_unpaid' ? r.purchase?.status === 'rejected' && r.purchase?.note : r.stage === 'activation_unpaid' ? r.activation?.status === 'rejected' && r.activation?.note : null;
  return (
    <div className="rounded-xl border border-neutral-800 bg-[var(--card)] p-4 grid sm:grid-cols-[220px_1fr] gap-4">
      <button type="button" onClick={onOpen} aria-label={`Open ${r.product?.name || 'card'}`} className="block w-full text-left rounded-xl transition hover:scale-[1.01] active:scale-[0.99]">
        <CardArt product={r.product} holder={r.card?.holderName || r.holder?.fullName} last4={r.card?.last4} expiry={r.card?.expiry} dim={r.stage !== 'active'} />
      </button>
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
          {['active', 'frozen', 'terminated'].includes(r.stage) && (
            <Button variant={r.stage === 'active' ? 'primary' : 'secondary'} onClick={onOpen}><Eye className="w-3.5 h-3.5" />{r.stage === 'active' ? 'View card details' : 'View card'}</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Cards() {
  const [tab, setTab] = useState('virtual');
  const [picked, setPicked] = useState(null);
  const [viewing, setViewing] = useState(null);
  const catalog = useLoader(() => cardRequestsApi.catalog(), []);
  const mine = useLoader(() => cardRequestsApi.list(), []);

  // Keep "My cards" current after the admin approves or rejects a payment.
  useEffect(() => {
    const t = setInterval(() => { if (document.visibilityState === 'visible') mine.reload(); }, 20000);
    return () => clearInterval(t);
  }, [mine.reload]);

  const requests = mine.data?.items || [];
  const openByProduct = useMemo(() => new Set(requests.filter((r) => !['active', 'frozen', 'terminated', 'rejected', 'cancelled'].includes(r.stage)).map((r) => String(r.productId))), [requests]);
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
              : <div className="space-y-3">{requests.map((r) => <RequestItem key={r._id} r={r} onChanged={mine.reload} onOpen={() => setViewing(r._id)} />)}</div>
      ) : catalog.error ? <ErrorState message={catalog.error} onRetry={catalog.reload} />
        : catalog.loading && !catalog.data ? <Loading />
          : !items.length ? <Empty icon={CreditCard} title={`No ${tab} cards available`} text="Check back soon." />
            : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((p) => {
                  const open = openByProduct.has(String(p._id));
                  return (
                    <div key={p._id} className="rounded-xl border border-neutral-800 bg-[var(--card)] p-4 space-y-3">
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
      {viewing && requests.find((r) => r._id === viewing) && (
        <CardModal r={requests.find((r) => r._id === viewing)} onClose={() => setViewing(null)} onChanged={mine.reload} />
      )}
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

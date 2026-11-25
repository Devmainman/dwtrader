// One payment experience for everything that is paid with the platform's payment
// methods: deposits, account upgrades, signal packages, cards, AI bots...
// The page using it only says what is being paid for and how to submit it:
//
//   <PaymentFlow
//     heading="Deposit funds" purpose="Deposit"
//     amount={100}               // fixed amount, or leave out and pass editableAmount
//     editableAmount             // let the user type the amount
//     instructions={{ title, intro, steps: [...], outro }}
//     onSubmit={async ({ method, file, amount, currency }) => 'Success message'}
//     successRedirect="/cards"   // optional, after a successful submit
//   />
//
// One responsive layout: method, transfer details and proof, then a summary with submit
// (beside them on desktop, below on phones).
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Wallet as WalletIcon, Check, Copy, UploadCloud, X, ShieldCheck, Clock, Info } from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import { useBalance } from '../../context/BalanceContext';
import { API_BASE_URL, STATIC_BASE_URL } from '../../api/config';
import { compressImage } from '../../lib/compressImage';
import StatusModal from '../subscribe/StatusModal';
import { Page, Button, Loading, ErrorState, Empty } from '../products/ui';


const DEFAULT_INSTRUCTIONS = {
  title: "Let's Proceed with that Payment",
  intro: 'To make a payment, please follow these simple steps:',
  steps: [
    'Initiate the payment by transferring the funds to the provided details.',
    'Upload the proof of payment in the section provided to ensure quick account updates.'
  ],
  outro: 'Once completed, our team will verify and credit your account. Need help? Contact support.'
};

const iconUrlOf = (m) => (m?.icon ? `${STATIC_BASE_URL}${m.icon.replace(/^\/icons\//, '/icons/')}` : '/icons/default.png');
const fmt = (n, cur) => {
  const v = Number(String(n ?? '').replace(/[^\d.]/g, ''));
  if (!Number.isFinite(v)) return `${cur} ${n ?? ''}`;
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur || 'USD', maximumFractionDigits: 2 }).format(v); } catch { return `${cur} ${v.toLocaleString()}`; }
};

function MethodIcon({ method, className = 'h-6 w-6' }) {
  return method?.icon ? (
    <img src={iconUrlOf(method)} alt={method.title} className={`${className} object-contain`} onError={(e) => { e.target.onerror = null; e.target.src = '/icons/default.png'; }} />
  ) : <WalletIcon className="w-5 h-5 text-neutral-300" strokeWidth={1.8} />;
}

export default function PaymentFlow({
  heading = 'Make a payment',
  subheading = 'Pay with any of the methods below, then upload your proof of payment.',
  purpose = 'Payment',
  amount: fixedAmount,
  editableAmount = false,
  amountPlaceholder,
  instructions = DEFAULT_INSTRUCTIONS,
  onSubmit,
  successRedirect,
  successMessage,
  showAmountOnPhone = true
}) {
  const { user, token } = useUserAuth();
  const { currency } = useBalance();
  const navigate = useNavigate();

  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [preparing, setPreparing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);
  const [modal, setModal] = useState(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef(null);

  const hasFixed = fixedAmount !== undefined && fixedAmount !== null && fixedAmount !== '';
  const finalAmount = hasFixed ? fixedAmount : amount;
  const method = methods.find((m) => m.methodId === selectedId) || null;
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  const ins = { ...DEFAULT_INSTRUCTIONS, ...instructions };

  useEffect(() => {
    if (!token) { setLoading(false); setLoadError('Authentication required'); return; }
    let live = true;
    setLoading(true);
    axios.get(`${API_BASE_URL}/payments/methods`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        const data = r.data?.data || r.data;
        if (!Array.isArray(data)) throw new Error('Server returned invalid data format');
        if (live) { setMethods(data); setLoadError(''); }
      })
      .catch((err) => live && setLoadError(err.response?.data?.message || err.message))
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [token]);

  // Show the form straight away: preselect the first method.
  useEffect(() => { if (!selectedId && methods.length) setSelectedId(methods[0].methodId); }, [methods, selectedId]);

  const pickFile = async (picked) => {
    if (!picked) return;
    setError('');
    setPreparing(true);
    try { setFile(await compressImage(picked)); } finally { setPreparing(false); }
  };

  const copy = (text, key) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    setError('');
    if (!method) return setError('Choose a payment method');
    if (editableAmount && !hasFixed && !(Number(amount) > 0)) return setError('Enter the amount');
    if (!file) return setError('Please upload payment proof');
    setSubmitting(true);
    try {
      const msg = await onSubmit({ method, file, amount: finalAmount, currency });
      setModal({ type: 'success', message: msg || successMessage || 'Payment submitted. We will review it shortly.' });
      setFile(null);
      if (!hasFixed) setAmount('');
      if (successRedirect) setTimeout(() => navigate(successRedirect), 2200);
    } catch (err) {
      const m = err.response?.data?.message || err.message || 'Submission failed';
      setError(m);
      setModal({ type: 'error', message: `Submission failed: ${m}` });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || !token) {
    return (
      <Page title={heading} subtitle={subheading}>
        <ErrorState message="Please sign in to see payment methods." onRetry={() => { window.location.href = '/auth'; }} />
      </Page>
    );
  }

  const statusModal = modal && <StatusModal message={modal.message} type={modal.type} onClose={() => setModal(null)} />;
  const fileInput = <input type="file" ref={fileRef} onChange={(e) => { pickFile(e.target.files?.[0]); e.target.value = ''; }} className="hidden" id="payment-proof" accept="image/*" />;
  const canSubmit = method && file && (hasFixed || !editableAmount || Number(amount) > 0) && !submitting && !preparing;
  const Step = ({ n, title, right, children }) => (
    <section className="dash-panel p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-6 h-6 rounded-full bg-blue-600/15 text-blue-400 text-[11px] font-semibold flex items-center justify-center shrink-0">{n}</span>
          <h2 className="text-[13px] font-semibold tracking-[-0.01em] truncate">{title}</h2>
        </div>
        {right}
      </div>
      {children}
    </section>
  );

  return (
    <Page title={heading} subtitle={subheading}>
      {statusModal}
      {fileInput}
      {loading ? <Loading rows={3} /> : loadError ? <ErrorState message={loadError} onRetry={() => window.location.reload()} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-4 items-start">
          <div className="space-y-4 min-w-0">
            {/* 1. Method */}
            <Step n={1} title="Choose how to pay">
              {!methods.length ? (
                <Empty icon={WalletIcon} title="No payment methods yet" text="Payment options will appear here once support adds them." />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {methods.map((m) => {
                    const on = m.methodId === selectedId;
                    return (
                      <button key={m._id || m.methodId} type="button" data-no-busy onClick={() => { setSelectedId(m.methodId); setError(''); }}
                        className={`relative text-left rounded-2xl border px-3.5 py-3 transition ${on ? 'border-blue-500/70 bg-blue-600/10' : 'border-white/10 bg-white/[.02] hover:border-white/20'}`}>
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-white/[.06] flex items-center justify-center shrink-0"><MethodIcon method={m} className="h-5 w-5" /></span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium text-zinc-100 truncate">{m.title}</p>
                            <p className="text-[11px] text-neutral-500 truncate">{m.processingTime || 'Reviewed by our team'}</p>
                          </div>
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition ${on ? 'bg-blue-600 border-blue-600' : 'border-white/20'}`}>{on && <Check className="w-3 h-3 text-white" />}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </Step>

            {method && (
              <>
                {/* 2. Transfer details */}
                <Step n={2} title={`Send ${hasFixed ? fmt(finalAmount, currency) : 'the payment'} to`}
                  right={<span className="flex items-center gap-1.5 text-[11px] text-neutral-500 shrink-0"><MethodIcon method={method} className="h-4 w-4" />{method.title}</span>}>
                  {method.details?.length ? (
                    <dl className="divide-y divide-white/[.06] border-y border-white/[.06]">
                      {method.details.map((d, i) => (
                        <div key={i} className="flex items-center gap-3 py-2.5">
                          <dt className="w-28 sm:w-36 shrink-0 text-[11px] text-neutral-500">{d.label}</dt>
                          <dd className="flex-1 min-w-0 text-[13px] text-zinc-100 font-medium break-all">{d.isSensitive ? '••••••••' : d.value}</dd>
                          {!d.isSensitive && d.value && (
                            <button type="button" data-no-busy onClick={() => copy(d.value, `d${i}`)}
                              className={`shrink-0 inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11px] font-semibold transition ${copied === `d${i}` ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[.06] text-zinc-200 hover:bg-white/10'}`}>
                              {copied === `d${i}` ? <><Check className="w-3 h-3" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
                            </button>
                          )}
                        </div>
                      ))}
                    </dl>
                  ) : <p className="text-[12px] text-neutral-500">This method has no transfer details. Contact support if you need them.</p>}
                  {method.instructions && <p className="mt-3 flex gap-2 text-[11px] text-neutral-400 leading-relaxed"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-400" />{method.instructions}</p>}
                </Step>

                {/* 3. Proof */}
                <Step n={3} title="Upload your proof of payment">
                  {file ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.02] p-2.5">
                      <img src={preview} alt="Payment proof" className="w-14 h-14 rounded-xl object-cover bg-black/30" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] text-zinc-100 truncate">{file.name}</p>
                        <p className="text-[11px] text-neutral-500">{(file.size / 1024).toFixed(0)} KB · ready</p>
                      </div>
                      <button type="button" data-no-busy onClick={() => fileRef.current?.click()} className="h-8 px-3 rounded-full bg-white/[.06] hover:bg-white/10 text-[11px] font-semibold">Change</button>
                      <button type="button" data-no-busy onClick={() => setFile(null)} className="w-8 h-8 rounded-full bg-white/[.06] hover:bg-white/10 flex items-center justify-center" aria-label="Remove"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <button type="button" data-no-busy onClick={() => fileRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
                      onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files?.[0]); }}
                      className={`w-full rounded-2xl border border-dashed px-6 py-8 flex flex-col items-center gap-1.5 transition ${drag ? 'border-blue-500 bg-blue-600/10' : 'border-white/15 hover:border-white/25 bg-white/[.02]'}`}>
                      <span className="w-11 h-11 rounded-full bg-blue-600/12 text-blue-400 flex items-center justify-center mb-1"><UploadCloud className="w-5 h-5" /></span>
                      <p className="text-[13px] font-medium text-zinc-100">{preparing ? 'Preparing image…' : 'Add your receipt or screenshot'}</p>
                      <p className="text-[11px] text-neutral-500">Tap to choose · large photos are resized for you</p>
                    </button>
                  )}
                </Step>
              </>
            )}
          </div>

          {/* Summary + submit */}
          <aside className="space-y-4 lg:sticky lg:top-[84px]">
            <div className="dash-panel p-5">
              <p className="text-[11px] text-neutral-500">{purpose}</p>
              {hasFixed ? (
                <p className="text-[30px] font-light tracking-[-0.03em] tabular-nums leading-tight mt-1">{fmt(finalAmount, currency)}</p>
              ) : editableAmount ? (
                <div className="mt-2">
                  <label className="text-[11px] font-medium text-neutral-400" htmlFor="pf-amount">Amount ({currency})</label>
                  <input id="pf-amount" type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)}
                    placeholder={typeof amountPlaceholder === 'function' ? '0.00' : amountPlaceholder || '0.00'} min={method?.minAmount || 0} max={method?.maxAmount || undefined}
                    className="mt-1.5 w-full h-12 rounded-xl bg-white/[.04] border border-white/10 px-4 text-[20px] font-light tabular-nums text-zinc-100 outline-none focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition" />
                  {(method?.minAmount || method?.maxAmount) && <p className="text-[11px] text-neutral-500 mt-1.5">{method.minAmount ? `Min ${fmt(method.minAmount, currency)}` : ''}{method.minAmount && method.maxAmount ? ' · ' : ''}{method.maxAmount ? `Max ${fmt(method.maxAmount, currency)}` : ''}</p>}
                </div>
              ) : null}
              <dl className="mt-4 divide-y divide-white/[.06] border-y border-white/[.06] text-[12px]">
                <div className="flex justify-between gap-3 py-2.5"><dt className="text-neutral-500">Method</dt><dd className="text-zinc-100 truncate">{method?.title || 'Not chosen'}</dd></div>
                <div className="flex justify-between gap-3 py-2.5"><dt className="text-neutral-500">Proof</dt><dd className={file ? 'text-emerald-400' : 'text-neutral-400'}>{file ? 'Attached' : 'Not attached'}</dd></div>
                {method?.processingTime && <div className="flex justify-between gap-3 py-2.5"><dt className="text-neutral-500">Processing</dt><dd className="text-zinc-100">{method.processingTime}</dd></div>}
              </dl>
              {error && <p className="mt-3 rounded-xl bg-red-500/10 text-red-400 text-[12px] px-3 py-2.5">{error}</p>}
              <Button onClick={submit} busy={submitting} disabled={!canSubmit} className="mt-4 w-full h-12 !text-[13px]">
                {submitting ? 'Submitting…' : 'Submit payment'}
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500"><ShieldCheck className="w-3.5 h-3.5" />Reviewed by our team before it is applied</p>
            </div>
            <div className="dash-panel p-5">
              <p className="text-[13px] font-semibold tracking-[-0.01em]">{ins.title}</p>
              {ins.intro && <p className="text-[11px] text-neutral-500 mt-1">{ins.intro}</p>}
              <ol className="mt-3 space-y-3">
                {ins.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-[12px] text-neutral-400 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-white/[.06] text-neutral-300 text-[10px] font-semibold flex items-center justify-center shrink-0 mt-px">{i + 1}</span>{s}
                  </li>
                ))}
              </ol>
              <p className="mt-4 flex gap-2 text-[11px] text-neutral-500 leading-relaxed"><Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />{ins.outro}</p>
            </div>
          </aside>
        </div>
      )}
    </Page>
  );
}

/** Small helper for the common "multipart POST with the proof" submit. */
export const postProof = async (url, token, fields) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
  return axios.post(`${API_BASE_URL}${url}`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }, timeout: 60000 });
};

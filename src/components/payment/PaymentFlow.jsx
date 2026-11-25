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
// Phones keep the original two-step screens (pick a method, then the form).
// Desktop gets its own layout: methods, transfer details and proof on the left,
// a sticky summary with the submit button on the right.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Wallet as WalletIcon, Check, Copy, UploadCloud, X, ShieldCheck, Clock, Info } from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import { useBalance } from '../../context/BalanceContext';
import { API_BASE_URL, STATIC_BASE_URL } from '../../api/config';
import { compressImage } from '../../lib/compressImage';
import StatusModal from '../subscribe/StatusModal';

const COPY_ICON = 'https://cdn.builder.io/api/v1/image/assets/TEMP/2fd1f31c640e4a8bc61ad64aa34bd7d9e147f00417163c84ba0f049ad7bf2b6f?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8';
const UPLOAD_ICON = 'https://cdn.builder.io/api/v1/image/assets/TEMP/8893c6a2e312a965b276c0a79248829998e46f8d?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8';
const INFO_ICON = 'https://cdn.builder.io/api/v1/image/assets/TEMP/28f76ca51ab932c417ae5480603e7ceb025031fd?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8';
const STEP_ICON = 'https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8';

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
const truncate = (text, max = 10) => (!text ? '' : text.length > max ? `${text.slice(0, max)}...` : text);
const fmt = (n, cur) => {
  const v = Number(String(n ?? '').replace(/[^\d.]/g, ''));
  if (!Number.isFinite(v)) return `${cur} ${n ?? ''}`;
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur || 'USD', maximumFractionDigits: 2 }).format(v); } catch { return `${cur} ${v.toLocaleString()}`; }
};

function useIsDesktop() {
  const q = '(min-width: 1024px)';
  const get = () => typeof window !== 'undefined' && window.matchMedia?.(q).matches;
  const [on, setOn] = useState(get);
  useEffect(() => {
    const m = window.matchMedia?.(q);
    if (!m) return undefined;
    const f = () => setOn(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return on;
}

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
  const desktop = useIsDesktop();

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

  // Desktop shows the form straight away: preselect the first method there.
  useEffect(() => { if (desktop && !selectedId && methods.length) setSelectedId(methods[0].methodId); }, [desktop, methods, selectedId]);

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
      <div className="text-red-500 p-4">
        Please login to access payment methods
        <button onClick={() => { window.location.href = '/auth'; }} className="ml-2 bg-blue-500 px-3 py-1 rounded text-white">Login</button>
      </div>
    );
  }
  if (loading) return <div className="text-white p-4">Loading payment methods...</div>;
  if (loadError) {
    return (
      <div className="text-red-500 p-4">
        Error: {loadError}
        <button onClick={() => window.location.reload()} className="ml-2 bg-blue-500 px-3 py-1 rounded text-white">Retry</button>
      </div>
    );
  }

  const statusModal = modal && <StatusModal message={modal.message} type={modal.type} onClose={() => setModal(null)} />;
  const fileInput = <input type="file" ref={fileRef} onChange={(e) => { pickFile(e.target.files?.[0]); e.target.value = ''; }} className="hidden" id="payment-proof" accept="image/*" />;

  /* ======================= Desktop ======================= */
  if (desktop) {
    const canSubmit = method && file && (hasFixed || !editableAmount || Number(amount) > 0) && !submitting && !preparing;
    return (
      <div className="w-full max-w-[1180px] mx-auto px-8 py-8 text-white">
        {statusModal}
        {fileInput}
        <header className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{purpose}</p>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">{heading}</h1>
          {subheading && <p className="text-sm text-neutral-400 mt-1">{subheading}</p>}
        </header>

        <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          <div className="space-y-5 min-w-0">
            {/* 1. Method */}
            <section className="rounded-2xl bg-[var(--card)] border border-white/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-6 rounded-full bg-blue-600/15 text-blue-400 text-[11px] font-semibold flex items-center justify-center">1</span>
                <h2 className="text-[15px] font-semibold">Choose how to pay</h2>
              </div>
              {!methods.length ? (
                <div className="rounded-xl border border-neutral-800 px-4 py-8 text-center">
                  <p className="text-sm text-zinc-100">No payment methods yet</p>
                  <p className="text-xs text-neutral-500 mt-1">Payment options will appear here once support adds them.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                  {methods.map((m) => {
                    const on = m.methodId === selectedId;
                    return (
                      <button key={m._id || m.methodId} type="button" data-no-busy onClick={() => { setSelectedId(m.methodId); setError(''); }}
                        className={`relative text-left rounded-xl border p-4 transition-colors ${on ? 'border-blue-500 bg-blue-600/10' : 'border-white/10 bg-[var(--card-2)] hover:border-white/20'}`}>
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-full bg-neutral-700/70 flex items-center justify-center shrink-0"><MethodIcon method={m} /></span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-100 truncate">{m.title}</p>
                            <p className="text-[11px] text-neutral-500 truncate">{m.processingTime || 'Reviewed by our team'}</p>
                          </div>
                        </div>
                        {on && <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {method && (
              <>
                {/* 2. Transfer details */}
                <section className="rounded-2xl bg-[var(--card)] border border-white/5 p-6">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600/15 text-blue-400 text-[11px] font-semibold flex items-center justify-center">2</span>
                      <h2 className="text-[15px] font-semibold">Send {hasFixed ? fmt(finalAmount, currency) : 'the payment'} to</h2>
                    </div>
                    <span className="flex items-center gap-2 text-xs text-neutral-400"><MethodIcon method={method} className="h-5 w-5" />{method.title}</span>
                  </div>
                  {method.details?.length ? (
                    <div className="divide-y divide-white/5 rounded-xl border border-white/5 overflow-hidden">
                      {method.details.map((d, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-3 bg-[var(--card-2)]/60">
                          <span className="w-40 shrink-0 text-xs text-neutral-400">{d.label}</span>
                          <span className="flex-1 min-w-0 text-sm text-zinc-100 font-medium break-all">{d.isSensitive ? '••••••••' : d.value}</span>
                          {!d.isSensitive && d.value && (
                            <button type="button" data-no-busy onClick={() => copy(d.value, `d${i}`)}
                              className={`shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs transition-colors ${copied === `d${i}` ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-zinc-200 hover:bg-white/10'}`}>
                              {copied === `d${i}` ? <><Check className="w-3.5 h-3.5" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-neutral-400">This method has no transfer details. Contact support if you need them.</p>}
                  {method.instructions && <p className="mt-4 flex gap-2 text-xs text-neutral-400 leading-relaxed"><Info className="w-4 h-4 shrink-0 text-blue-400" />{method.instructions}</p>}
                </section>

                {/* 3. Proof */}
                <section className="rounded-2xl bg-[var(--card)] border border-white/5 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-6 h-6 rounded-full bg-blue-600/15 text-blue-400 text-[11px] font-semibold flex items-center justify-center">3</span>
                    <h2 className="text-[15px] font-semibold">Upload your proof of payment</h2>
                  </div>
                  {file ? (
                    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[var(--card-2)] p-3">
                      <img src={preview} alt="Payment proof" className="w-20 h-20 rounded-lg object-cover bg-black/30" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-zinc-100 truncate">{file.name}</p>
                        <p className="text-xs text-neutral-500">{(file.size / 1024).toFixed(0)} KB · ready to submit</p>
                      </div>
                      <button type="button" data-no-busy onClick={() => fileRef.current?.click()} className="h-9 px-4 rounded-full bg-white/5 hover:bg-white/10 text-xs">Change</button>
                      <button type="button" data-no-busy onClick={() => setFile(null)} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center" aria-label="Remove"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <button type="button" data-no-busy onClick={() => fileRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
                      onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files?.[0]); }}
                      className={`w-full rounded-xl border-2 border-dashed px-6 py-10 flex flex-col items-center gap-2 transition-colors ${drag ? 'border-blue-500 bg-blue-600/10' : 'border-white/10 hover:border-white/20 bg-[var(--card-2)]/50'}`}>
                      <UploadCloud className="w-8 h-8 text-blue-400" />
                      <p className="text-sm text-zinc-100">{preparing ? 'Preparing image...' : 'Drop your receipt or screenshot here'}</p>
                      <p className="text-xs text-neutral-500">or click to choose a file · large photos are resized for you</p>
                    </button>
                  )}
                </section>
              </>
            )}
          </div>

          {/* Summary */}
          <aside className="sticky top-24 space-y-4">
            <div className="rounded-2xl bg-[var(--card)] border border-white/5 p-6">
              <p className="text-xs text-neutral-400">{purpose}</p>
              {hasFixed ? (
                <p className="text-3xl font-semibold tracking-tight mt-1">{fmt(finalAmount, currency)}</p>
              ) : editableAmount ? (
                <div className="mt-2">
                  <label className="text-[11px] text-neutral-500" htmlFor="pf-amount">Amount ({currency})</label>
                  <input id="pf-amount" type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00" min={method?.minAmount || 0} max={method?.maxAmount || undefined}
                    className="mt-1 w-full h-12 rounded-xl bg-[var(--card-2)] border border-white/5 px-4 text-xl font-semibold text-white outline-none focus:border-blue-500" />
                  {(method?.minAmount || method?.maxAmount) && <p className="text-[11px] text-neutral-500 mt-1.5">{method.minAmount ? `Min ${fmt(method.minAmount, currency)}` : ''}{method.minAmount && method.maxAmount ? ' · ' : ''}{method.maxAmount ? `Max ${fmt(method.maxAmount, currency)}` : ''}</p>}
                </div>
              ) : null}
              <div className="mt-5 space-y-2.5 text-sm">
                <div className="flex justify-between gap-3"><span className="text-neutral-500">Method</span><span className="text-zinc-100 truncate">{method?.title || 'Not chosen'}</span></div>
                <div className="flex justify-between gap-3"><span className="text-neutral-500">Proof</span><span className={file ? 'text-emerald-400' : 'text-neutral-400'}>{file ? 'Attached' : 'Not attached'}</span></div>
                {method?.processingTime && <div className="flex justify-between gap-3"><span className="text-neutral-500">Processing</span><span className="text-zinc-100">{method.processingTime}</span></div>}
              </div>
              {error && <p className="mt-4 rounded-lg bg-red-500/10 text-red-400 text-xs p-3">{error}</p>}
              <button type="button" onClick={submit} disabled={!canSubmit}
                className="mt-5 w-full h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed">
                {submitting ? 'Submitting...' : 'Submit payment'}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500"><ShieldCheck className="w-3.5 h-3.5" />Reviewed by our team before it is applied</p>
            </div>
            <div className="rounded-2xl bg-[var(--card)] border border-white/5 p-6">
              <p className="text-sm font-semibold">{ins.title}</p>
              <ol className="mt-3 space-y-3">
                {ins.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-xs text-neutral-400 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-white/5 text-neutral-300 text-[10px] flex items-center justify-center shrink-0">{i + 1}</span>{s}
                  </li>
                ))}
              </ol>
              <p className="mt-4 flex gap-2 text-[11px] text-neutral-500 leading-relaxed"><Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />{ins.outro}</p>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  /* ======================= Phone (unchanged look) ======================= */
  return (
    <div className="min-h-screen lg:w-full lg:max-w-[1050px] lg:mx-auto text-white relative">
      {statusModal}
      <div className="w-full px-4 xl:px-0">
        {!method ? (
          <div className="py-6 mx-5 lg:mx-[0px] lg:w-[1060px]">
            <h2 className="text-base text-[var(--fg-2)] mb-6">Select Payment Method</h2>
            {methods.length ? (
              <div className="grid gap-4 text-[var(--fg-2)] text-sm sm:grid-cols-2 lg:grid-cols-3">
                {methods.map((m) => (
                  <div key={m._id || m.methodId} onClick={() => setSelectedId(m.methodId)}
                    className="p-4 rounded-xl h-[80px] border border-[var(--line-strong)] bg-[var(--card-2)] hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <div className="bg-gray-700 p-2 rounded-full"><MethodIcon method={m} /></div>
                      <div className="ml-3">
                        <p className="font-medium">{m.title}</p>
                        {m.processingTime && <p className="text-xs text-gray-400">{m.processingTime}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-[var(--card)] border border-neutral-800 px-4 py-8 text-center">
                <p className="text-sm text-zinc-100">No payment methods yet</p>
                <p className="text-xs text-neutral-500 mt-1">Payment options will appear here once support adds them.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full mt-2 grid grid-cols-1 xl:grid-cols-[889px_370px] gap-4 px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:bg-[var(--card)] lg:rounded-3xl p-6">
              <div className="space-y-6">
                <h2 className="text-base text-[var(--fg-2)] mb-6">Select Payment Method</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => { setSelectedId(null); setError(''); }} className="text-white" data-no-busy aria-label="Back">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <h1 className="text-[14px] font-semibold text-gray-300">{method.title || 'Payment Method'}</h1>
                  </div>
                  <div className="bg-gray-700 p-2 rounded-full"><MethodIcon method={method} /></div>
                </div>

                {method.details && (
                  <div className="space-y-4">
                    {method.details.map((d, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold text-neutral-400">{d.label}:</span>
                        {d.isSensitive ? <span className="text-white">••••••••</span> : (
                          <div className="flex items-center gap-2">
                            <div className="text-[10px] h-[36px] flex justify-between items-center rounded-md bg-[var(--card)] text-zinc-100 px-3 py-1.5 w-[243px] text-right truncate">
                              {truncate(d.value)}
                              <button onClick={() => copy(d.value, i)} data-no-busy className="flex items-center gap-1 text-[9px] text-blue-400">
                                <img src={COPY_ICON} alt={copied === i ? 'Copied' : 'Copy now'} className="object-contain w-3.5 aspect-square" />
                                <span>{copied === i ? 'Copied' : 'Copy now'}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {showAmountOnPhone && (hasFixed || editableAmount) && (
                  <div className="space-y-2">
                    <label className="text-gray-400 text-[10px]">Amount ({currency})</label>
                    {hasFixed ? (
                      <div className="w-full h-[52px] bg-[var(--card)] text-[10px] text-white p-4 rounded-lg flex items-center">
                        {currency} {Number(String(finalAmount).replace(/[^\d.]/g, '')).toLocaleString()}
                      </div>
                    ) : (
                      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                        placeholder={typeof amountPlaceholder === 'function' ? amountPlaceholder(currency) : amountPlaceholder || `Amount (${currency})`}
                        className="w-full h-[52px] bg-[var(--card-2)] text-[10px] text-white p-4 rounded-lg border-none outline-none placeholder-gray-500"
                        min={method.minAmount || 0} max={method.maxAmount || ''} required />
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-gray-400 text-[10px]">Upload payment proof</label>
                  <div className="bg-[var(--card)] p-5 rounded-[10px]">
                    <div className="bg-[var(--card-2)] rounded-[10px] p-4 text-center">
                      {fileInput}
                      <label htmlFor="payment-proof" className="cursor-pointer">
                        {file ? (
                          <div className="text-blue-500">
                            <div className="w-12 h-12 mx-auto mb-3 bg-gray-600 rounded-full flex items-center justify-center">
                              <img src={preview} className="object-contain aspect-square w-[47px] rounded" alt="Upload preview" />
                            </div>
                            <span className="text-blue-500 text-xs block truncate max-w-[200px] mx-auto">{file.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <img src={UPLOAD_ICON} className="object-contain aspect-square w-[47px]" alt="Upload icon" />
                            <div className="mt-1">
                              <p className="text-[12px] font-medium text-zinc-100">{preparing ? 'Preparing...' : 'Upload Image'}</p>
                              <p className="mt-1.5 text-[8px] text-neutral-400">Phone photos are fine, we resize them</p>
                            </div>
                          </div>
                        )}
                      </label>
                      <div className="flex justify-center mt-4">
                        <button onClick={() => fileRef.current?.click()} data-no-busy className="px-2.5 py-1 text-[10px] bg-blue-600 rounded-3xl text-zinc-100 w-[86px]">
                          {file ? 'Change' : 'Select Image'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-center text-xs">{error}</div>}
                <button onClick={submit} disabled={submitting || preparing || !file || (editableAmount && !hasFixed && !amount)}
                  className="w-full h-[42px] bg-blue-500 text-white rounded-full font-medium text-[10px] disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? 'Processing...' : 'Submit'}
                </button>
              </div>
            </div>

            <div className="flex justify-center items-start">
              <article className="overflow-hidden w-full lg:max-w-[290px] px-3 py-4 rounded-xl bg-[var(--card)]">
                <header className="font-medium">
                  <div className="flex gap-2.5 items-center text-[14px] text-zinc-100">
                    <h2 className="flex-1">{ins.title}</h2>
                    <img src={INFO_ICON} className="object-contain aspect-square w-[18px]" alt="Info icon" />
                  </div>
                  <p className="mt-3 text-[10px] text-neutral-500">{ins.intro}</p>
                </header>
                {ins.steps.map((s, i) => (
                  <div key={i} className={`flex gap-1.5 items-start ${i ? 'mt-4' : 'mt-1.5'} text-[10px] leading-4 text-neutral-400`}>
                    <img src={STEP_ICON} className="object-contain aspect-square w-[18px]" alt="Step" />
                    <p className="flex-1">{s}</p>
                  </div>
                ))}
                <p className="mt-4 text-[10px] text-neutral-400">{ins.outro}</p>
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Small helper for the common "multipart POST with the proof" submit. */
export const postProof = async (url, token, fields) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => { if (v !== undefined && v !== null) fd.append(k, v); });
  return axios.post(`${API_BASE_URL}${url}`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }, timeout: 60000 });
};

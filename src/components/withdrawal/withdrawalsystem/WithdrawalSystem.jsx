// /withdraw — pick a method the admin enabled, fill in its details and the withdrawal token.
// Same flow and endpoints as before (POST /withdrawals), in the app's shared design.
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpFromLine, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle, Info, KeyRound } from 'lucide-react';
import { useUserAuth } from '../../../context/UserAuthContext';
import { useBalance } from '../../../context/BalanceContext';
import { API_BASE_URL, STATIC_BASE_URL } from '../../../api/config';
import { Page, Panel, Button, Field, inputClass, Modal, Loading, ErrorState, Empty } from '../../products/ui';

const keyOf = (label) => label.toLowerCase().replace(/\s+/g, '_');
const iconOf = (m) => (m.icon ? `${STATIC_BASE_URL}${m.icon.replace(/^\/icons\//, '/icons/')}` : '/icons/default.png');
const fmt = (v, cur) => { try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(v); } catch { return `${cur} ${v}`; } };

const STEPS = [
  ['Enter your details', 'Choose a method and add the account details we should pay to.'],
  ['We verify it', 'Our team checks the request and the details you provided.'],
  ['You get paid', 'Once approved the money is sent; timing depends on the method.'],
  ['Confirmation', 'You get an email and the withdrawal shows in your history.']
];

function MethodIcon({ m, size = 36 }) {
  return (
    <span className="rounded-full bg-white/[.06] border border-white/[.08] flex items-center justify-center shrink-0 overflow-hidden" style={{ width: size, height: size }}>
      <img src={iconOf(m)} alt="" className="w-[70%] h-[70%] object-contain" onError={(e) => { e.currentTarget.src = '/icons/default.png'; }} />
    </span>
  );
}

function Steps() {
  return (
    <Panel title="How withdrawals work">
      <ol className="space-y-3">
        {STEPS.map(([t, d], i) => (
          <li key={t} className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-600/15 text-blue-400 text-[11px] font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
            <div className="min-w-0"><p className="text-[12px] font-semibold text-zinc-100">{t}</p><p className="text-[11px] text-neutral-500 leading-relaxed mt-0.5">{d}</p></div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[11px] text-neutral-500">Questions? Our support team can help at any step.</p>
    </Panel>
  );
}

const WithdrawalForm = ({ method, onBack }) => {
  const { token } = useUserAuth();
  const { balance, currency, updateBalance } = useBalance();
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState(() => ({
    amount: '', withdrawalToken: '', ...method.details.reduce((acc, d) => ({ ...acc, [keyOf(d.label)]: '' }), {})
  }));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const set = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const amount = parseFloat(formData.amount);
  const missing = !(amount > 0) || !formData.withdrawalToken.trim() || method.details.some((d) => !String(formData[keyOf(d.label)] || '').trim());
  const outOfRange = amount > 0 && ((method.minAmount && amount < method.minAmount) || (method.maxAmount && amount > method.maxAmount));
  const overBalance = amount > balance;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const details = method.details.map((d) => ({ label: d.label, value: formData[keyOf(d.label)] }));
      const response = await axios.post(`${API_BASE_URL}/withdrawals`, {
        methodId: method.methodId, amount, details, token: formData.withdrawalToken
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.data.success) throw new Error('Unexpected response');
      updateBalance(balance - amount);
      setSuccess(true);
      setModal({ type: 'success', title: 'Withdrawal submitted', message: 'Your request was received and is being processed. You can follow it in History.' });
    } catch (err) {
      setModal({ type: 'error', title: 'Could not submit', message: err.response?.data?.message || 'Something went wrong with your withdrawal.' });
    } finally {
      setLoading(false);
    }
  };

  const tone = modal?.type === 'success' ? 'text-emerald-400 bg-emerald-500/12' : modal?.type === 'warning' ? 'text-amber-400 bg-amber-500/12' : 'text-red-400 bg-red-500/12';
  const ModalIcon = modal?.type === 'success' ? CheckCircle2 : modal?.type === 'warning' ? KeyRound : AlertTriangle;

  return (
    <Page title="Withdraw" subtitle={`To ${method.title}`} icon={ArrowUpFromLine}
      actions={<Button variant="secondary" onClick={onBack}><ChevronLeft className="w-4 h-4" />Methods</Button>}>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-4 items-start max-w-[980px]">
        <form onSubmit={handleSubmit} className="dash-panel p-4 sm:p-5">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/[.06]">
            <MethodIcon m={method} size={40} />
            <div className="flex-1 min-w-0"><p className="text-[13px] font-semibold truncate">{method.title}</p><p className="text-[11px] text-neutral-500">Limits {fmt(method.minAmount, method.currency || currency)} – {fmt(method.maxAmount, method.currency || currency)}</p></div>
            <div className="text-right"><p className="text-[11px] text-neutral-500">Available</p><p className="text-[13px] font-medium tabular-nums">{fmt(balance, currency)}</p></div>
          </div>

          <Field label={`Amount (${currency})`} hint={overBalance ? undefined : outOfRange ? 'Outside this method’s limits' : undefined}>
            <div className="flex gap-2">
              <input type="number" inputMode="decimal" name="amount" value={formData.amount} onChange={set} min={method.minAmount} max={method.maxAmount}
                placeholder={`${method.minAmount} – ${method.maxAmount}`} className={inputClass} />
              <Button variant="secondary" className="h-11 shrink-0" onClick={() => setFormData((p) => ({ ...p, amount: String(Math.min(balance, method.maxAmount || balance)) }))}>Max</Button>
            </div>
            {overBalance && <span className="block text-[11px] text-red-400 mt-1">More than your available balance</span>}
          </Field>

          {method.details?.map((d) => (
            <Field key={d.label} label={d.label}>
              <input type="text" name={keyOf(d.label)} value={formData[keyOf(d.label)]} onChange={set} placeholder={`Enter ${d.label.toLowerCase()}`} className={inputClass} required />
            </Field>
          ))}

          <Field label="Withdrawal token">
            <input type="text" name="withdrawalToken" value={formData.withdrawalToken} onChange={set} placeholder="Enter your withdrawal token" className={`${inputClass} font-mono`} required />
            <button type="button" data-no-busy className="mt-1.5 text-[11px] font-medium text-blue-400 hover:text-blue-300"
              onClick={() => setModal({ type: 'warning', title: 'Need a withdrawal token?', message: 'Contact support and they will send you a withdrawal token for this request.' })}>
              Don&apos;t have a token?
            </button>
          </Field>

          <Button type="submit" busy={loading} disabled={missing || outOfRange || overBalance || success} className="w-full h-12 !text-[13px] mt-1">
            {success ? 'Submitted' : `Withdraw${amount > 0 ? ` ${fmt(amount, currency)}` : ''}`}
          </Button>
          <p className="mt-3 text-[11px] text-neutral-500 flex gap-1.5"><Info className="w-3.5 h-3.5 shrink-0" />Check the details carefully. Payouts to wrong details can&apos;t be reversed.</p>
        </form>
        <Steps />
      </div>

      <Modal open={!!modal} title={modal?.title || ''} onClose={() => setModal(null)}
        footer={<Button onClick={() => { const done = modal?.type === 'success'; setModal(null); if (done) onBack(); }}>{modal?.type === 'success' ? 'Done' : 'OK'}</Button>}>
        <div className="flex gap-3 items-start">
          <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tone}`}><ModalIcon className="w-5 h-5" /></span>
          <p className="text-[12px] text-neutral-400 leading-relaxed pt-1">{modal?.message}</p>
        </div>
      </Modal>
    </Page>
  );
};

const WithdrawalInterface = () => {
  const { token } = useUserAuth();
  const { balance, currency } = useBalance();
  const [methods, setMethods] = useState(null);
  const [error, setError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);

  const load = async () => {
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/withdrawal-methods`, { headers: { Authorization: `Bearer ${token}` } });
      setMethods(res.data.data?.filter((m) => m.isActive) || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load withdrawal methods');
      setMethods([]);
    }
  };
  useEffect(() => { if (token) load(); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (selectedMethod) return <WithdrawalForm method={selectedMethod} onBack={() => setSelectedMethod(null)} />;

  return (
    <Page title="Withdraw" subtitle="Send money from your balance to your account" icon={ArrowUpFromLine}>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-4 items-start max-w-[980px]">
        <div className="space-y-4">
          <section className="dash-panel p-5">
            <p className="text-[11px] text-neutral-500">Available to withdraw</p>
            <p className="mt-1 text-[30px] font-light tracking-[-0.03em] tabular-nums leading-none">{fmt(balance, currency)}</p>
            <p className="mt-2 text-[11px] text-neutral-500">Paid out from your {currency} balance</p>
          </section>
          <section className="dash-panel px-4 pt-4 pb-2">
            <p className="text-[13px] font-semibold tracking-[-0.01em]">Choose a method</p>
            {error && <div className="mt-3"><ErrorState message={error} onRetry={load} /></div>}
            {!methods ? <Loading rows={3} /> : !methods.length && !error ? (
              <Empty icon={ArrowUpFromLine} title="No withdrawal methods yet" text="Withdrawal methods will appear here once they are available. Contact support if you need help." />
            ) : (
              <ul className="divide-y divide-white/[.06] mt-1">
                {methods.map((m) => (
                  <li key={m._id}>
                    <button type="button" data-no-busy onClick={() => setSelectedMethod(m)} className="dash-row w-full flex items-center gap-3 py-3 text-left">
                      <MethodIcon m={m} />
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13px] font-medium text-zinc-100 truncate">{m.title}</span>
                        <span className="block text-[11px] text-neutral-500">{fmt(m.minAmount, m.currency || currency)} – {fmt(m.maxAmount, m.currency || currency)}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        <Steps />
      </div>
    </Page>
  );
};

export default WithdrawalInterface;

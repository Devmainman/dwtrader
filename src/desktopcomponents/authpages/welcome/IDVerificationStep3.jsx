import { useState } from 'react';
import { CheckCircle, IdCard, BookOpen, Car, Loader2 } from 'lucide-react';
import { uploadIdDocument } from '../../../api/verification';
import UploadImageButton from './UploadImageButton';

// ID Verification: pick a document type. ID card and driver's license need the front and
// back; a passport needs only the photo page.
const TYPES = [
  { value: 'national_id', label: 'ID card', icon: IdCard, sides: 2 },
  { value: 'driver_license', label: "Driver's license", icon: Car, sides: 2 },
  { value: 'passport', label: 'Passport', icon: BookOpen, sides: 1 }
];

export default function IDVerificationStep3({ onContinue }) {
  const [type, setType] = useState('national_id');
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cfg = TYPES.find((t) => t.value === type);
  const twoSided = cfg.sides === 2;
  const ready = front && (!twoSided || back);

  const pick = (v) => { if (v === type) return; setType(v); setFront(null); setBack(null); setError(''); };

  const submit = async () => {
    if (!front) return setError(twoSided ? 'Please upload the front of your document' : 'Please upload your passport photo page');
    if (twoSided && !back) return setError('Please upload the back of your document');
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('documentType', type);
      fd.append('frontImage', front);
      if (twoSided && back) fd.append('backImage', back);
      const res = await uploadIdDocument(fd);
      if (res?.success) onContinue(res.data?.document);
      else setError(res?.message || 'Upload failed. Please try again.');
    } catch (e) {
      setError(e?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tips = (
    <div className="dash-panel p-4">
      <p className="text-[11px] text-neutral-400 mb-3">Upload a clear photo or scan of a valid government-issued document. Make sure it shows:</p>
      {['Your full name', 'Date of birth', 'Photograph', 'ID number', 'Issuing authority'].map((item) => (
        <div className="flex mb-2 items-center" key={item}>
          <CheckCircle className="h-4 w-4 text-emerald-400 mr-2 flex-shrink-0" />
          <p className="text-neutral-400 text-[11px]">{item}</p>
        </div>
      ))}
      <p className="text-neutral-500 text-[11px] mt-3">Your documents are kept private and used only to verify your identity.</p>
    </div>
  );

  const button = (
    <button type="button" onClick={submit} disabled={!ready || loading} className="kyc-btn w-full inline-flex items-center justify-center gap-2">
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}{loading ? 'Uploading…' : 'Continue'}
    </button>
  );

  return (
    <div className="md:flex md:items-start md:gap-4 md:max-w-[1280px] md:mx-auto">
      <div className="md:flex-1 rounded-[24px] md:p-6 lg:bg-[var(--card)] lg:border lg:border-white/[.07]">
        <div className="md:flex md:justify-between md:gap-6">
          <div className="md:w-[350px] flex flex-col">
            <h1 className="text-[17px] font-semibold tracking-[-0.02em] text-zinc-100">ID Verification</h1>
            <p className="text-[var(--fg-4)] text-[12px] mb-4 md:text-[14px]">Choose the document you want to use.</p>

            <div className="grid grid-cols-3 gap-2 mb-4" role="radiogroup" aria-label="Document type">
              {TYPES.map(({ value, label, icon: Icon }) => {
                const on = value === type;
                return (
                  <button key={value} type="button" role="radio" aria-checked={on} data-no-busy onClick={() => pick(value)}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-[11px] font-medium transition ${on ? 'border-blue-500 bg-blue-600/12 text-blue-400' : 'border-white/10 bg-white/[.02] text-neutral-400 hover:border-white/20'}`}>
                    <Icon className="w-5 h-5" />{label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-neutral-500 mb-4">{twoSided ? `Upload both sides of your ${type === 'national_id' ? 'ID card' : 'driver’s license'}.` : 'Upload the photo page of your passport.'}</p>

            <div className="hidden md:block">
              {error && <p className="text-red-400 text-[12px] mb-2">{error}</p>}
              {button}
            </div>
          </div>

          <div className="md:w-[350px] space-y-4">
            <UploadImageButton key={`${type}-front`} label={twoSided ? 'Front side' : 'Photo page'} onChange={setFront} preview={front} onRemove={() => setFront(null)} />
            {twoSided && <UploadImageButton key={`${type}-back`} label="Back side" onChange={setBack} preview={back} onRemove={() => setBack(null)} />}
            <div className="md:hidden">
              {error && <p className="text-red-400 text-[12px] mb-2">{error}</p>}
              {button}
            </div>
            <div className="md:hidden">{tips}</div>
          </div>
        </div>
      </div>
      <div className="hidden md:block md:w-[340px] shrink-0">{tips}</div>
    </div>
  );
}

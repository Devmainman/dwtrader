// /forgot-password — email a 6-digit code, then set a new password with it.
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, ArrowRight, MailCheck, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { API_BASE_URL } from "../../../api/config";
import { toast } from "../../../lib/toast";
import AuthShell, { AuthField } from "../../../components/auth/AuthShell";

function CodeInput({ value, onChange, error }) {
  const refs = useRef([]);
  const digits = value.padEnd(6, " ").slice(0, 6).split("");
  const setAt = (i, d) => {
    const next = (value.padEnd(6, " ").slice(0, i) + d + value.padEnd(6, " ").slice(i + 1)).replace(/\s+$/, "");
    onChange(next.replace(/ /g, ""));
  };
  return (
    <div className="flex gap-2 justify-between" onPaste={(e) => { const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6); if (t) { e.preventDefault(); onChange(t); refs.current[Math.min(5, t.length)]?.focus(); } }}>
      {digits.map((d, i) => (
        <input key={i} ref={(el) => { refs.current[i] = el; }} inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"} maxLength={1} value={d.trim()}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(-1); setAt(i, v || " "); if (v) refs.current[i + 1]?.focus(); }}
          onKeyDown={(e) => { if (e.key === "Backspace" && !d.trim()) refs.current[i - 1]?.focus(); }}
          className={`w-full h-14 rounded-2xl text-center text-[22px] font-semibold tabular-nums bg-white/[.04] border outline-none transition focus:border-blue-500/70 focus:ring-4 focus:ring-blue-500/15 ${error ? "border-red-500/60" : "border-white/10"}`} />
      ))}
    </div>
  );
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [wait, setWait] = useState(0);
  useEffect(() => { if (!wait) return undefined; const t = setTimeout(() => setWait((w) => w - 1), 1000); return () => clearTimeout(t); }, [wait]);

  const send = async (ev) => {
    ev?.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Enter the email you signed up with"); return; }
    setBusy(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/users/forgot-password`, { email: email.trim() });
      toast.success("Check your email", { description: data.message });
      setStep("code");
      setWait(45);
    } catch (e) {
      setError(e.response?.data?.message || "We couldn’t send the code. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const reset = async (ev) => {
    ev.preventDefault();
    setError("");
    if (code.length !== 6) { setError("Enter all 6 digits"); return; }
    if (pw.length < 6) { setError("Your new password needs at least 6 characters"); return; }
    setBusy(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/users/reset-password`, { email: email.trim(), code, newPassword: pw });
      toast.success("Password updated", { description: data.message });
      navigate("/auth");
    } catch (e) {
      setError(e.response?.data?.message || "We couldn’t reset your password. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (step === "email") {
    return (
      <AuthShell title="Reset your password" subtitle="Enter your account email and we’ll send you a 6-digit code."
        footer={<Link to="/auth" className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300"><ChevronLeft className="w-4 h-4" />Back to sign in</Link>}>
        <form onSubmit={send} noValidate className="space-y-4">
          <AuthField label="Email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" error={error} />
          <button type="submit" disabled={busy} className="auth-btn">{busy ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : <>Send code<ArrowRight className="w-4 h-4" /></>}</button>
        </form>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Check your email" subtitle={`We sent a 6-digit code to ${email}. It expires in 15 minutes.`}
      footer={<button type="button" data-no-busy onClick={() => { setStep("email"); setCode(""); setError(""); }} className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300"><ChevronLeft className="w-4 h-4" />Use a different email</button>}>
      <div className="mb-6 flex justify-center"><span className="w-14 h-14 rounded-2xl bg-blue-600/15 text-blue-400 flex items-center justify-center"><MailCheck className="w-6 h-6" /></span></div>
      <form onSubmit={reset} noValidate className="space-y-5">
        <CodeInput value={code} onChange={(v) => { setCode(v); setError(""); }} error={!!error && code.length !== 6} />
        <AuthField label="New password" type={show ? "text" : "password"} autoComplete="new-password" value={pw} onChange={(e) => { setPw(e.target.value); setError(""); }} placeholder="At least 6 characters"
          right={<button type="button" data-no-busy onClick={() => setShow((v) => !v)} className="text-neutral-500 hover:text-zinc-100" aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}</button>} />
        {error && <p className="text-[12px] text-red-400 -mt-2" role="alert">{error}</p>}
        <button type="submit" disabled={busy} className="auth-btn">{busy ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : "Set new password"}</button>
        <p className="text-center text-[12px] text-neutral-500">
          Didn&apos;t get it? {wait ? <span>Resend in {wait}s</span> : <button type="button" onClick={send} className="font-semibold text-blue-400 hover:text-blue-300">Send a new code</button>}
        </p>
      </form>
    </AuthShell>
  );
}

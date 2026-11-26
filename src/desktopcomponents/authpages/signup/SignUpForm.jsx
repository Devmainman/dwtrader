// /signup — create an account (email, password, a quick human check), then sign in and
// continue to /welcome for verification. Same API calls as before.
import React, { useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Loader2, ArrowRight, Gift, RefreshCw, Check } from "lucide-react";
import { toast } from "../../../lib/toast";
import { playWelcome, queueOnboarding } from "../../../components/welcome/WelcomeExperience";
import { API_BASE_URL } from "../../../api/config";
import { useUserAuth } from "../../../context/UserAuthContext";
import AuthShell, { AuthField } from "../../../components/auth/AuthShell";

const rnd = () => Math.floor(Math.random() * 10) + 1;
const makeCaptcha = () => { const a = rnd(); const b = rnd(); return { question: `${a} + ${b}`, answer: a + b }; };

function strength(p) {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++;
  return s; // 0-4
}

const SignUpForm = () => {
  const navigate = useNavigate();
  const { login } = useUserAuth();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");
  const [f, setF] = useState({ email: "", password: "", confirmPassword: "" });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(makeCaptcha);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const s = useMemo(() => strength(f.password), [f.password]);

  const set = (e) => {
    const { name, value } = e.target;
    setF((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!f.email) e.email = "Enter your email address";
    else if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "That email doesn’t look right";
    if (!f.password) e.password = "Choose a password";
    else if (f.password.length < 6) e.password = "Use at least 6 characters";
    if (f.password !== f.confirmPassword) e.confirmPassword = "The passwords don’t match";
    if (parseInt(captchaAnswer, 10) !== captcha.answer) e.captcha = "That answer isn’t right. Try the new sum.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) { setCaptcha(makeCaptcha()); setCaptchaAnswer(""); return; }
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/users/signup`, { email: f.email.trim(), password: f.password, referralCode: referralCode || undefined });
      const ok = await login(f.email.trim(), f.password);
      if (ok) {
        queueOnboarding(f.email.trim());
        playWelcome({ kind: "new" });
        navigate("/welcome", { state: { email: f.email.trim() } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Sign-up failed. Please try again.");
      setCaptcha(makeCaptcha());
      setCaptchaAnswer("");
    } finally {
      setLoading(false);
    }
  };

  const eye = (
    <button type="button" data-no-busy onClick={() => setShow((v) => !v)} className="text-neutral-500 hover:text-zinc-100 transition" aria-label={show ? "Hide password" : "Show password"}>
      {show ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
    </button>
  );
  const bar = ["bg-red-500", "bg-red-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-400"][s];

  return (
    <AuthShell title="Create your account" subtitle="It takes a minute. You can verify your identity right after."
      footer={<>Already have an account? <Link to="/auth" className="font-semibold text-blue-400 hover:text-blue-300">Sign in</Link></>}>
      {referralCode && (
        <div className="mb-5 flex items-center gap-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 text-[12px] text-emerald-400">
          <Gift className="w-4 h-4 shrink-0" />You were invited · code <span className="font-mono font-semibold">{referralCode}</span>
        </div>
      )}
      <form onSubmit={submit} noValidate className="space-y-4">
        <AuthField label="Email" type="email" name="email" autoComplete="email" inputMode="email" value={f.email} onChange={set} placeholder="you@example.com" error={errors.email} />
        <div>
          <AuthField label="Password" type={show ? "text" : "password"} name="password" autoComplete="new-password" value={f.password} onChange={set} placeholder="At least 6 characters" error={errors.password} right={eye} />
          {f.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 grid grid-cols-4 gap-1">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-1 rounded-full transition-colors duration-300 ${i < s ? bar : "bg-white/10"}`} />)}</div>
              <span className="text-[11px] text-neutral-500 w-14 text-right">{["Too short", "Weak", "Okay", "Good", "Strong"][s]}</span>
            </div>
          )}
        </div>
        <AuthField label="Confirm password" type={show ? "text" : "password"} name="confirmPassword" autoComplete="new-password" value={f.confirmPassword} onChange={set} placeholder="Type it again" error={errors.confirmPassword}
          right={f.confirmPassword && f.confirmPassword === f.password ? <Check className="w-[18px] h-[18px] text-emerald-400" /> : null} />

        <div>
          <span className="block text-[12px] font-medium text-neutral-400 mb-1.5">Quick check: what is {captcha.question}?</span>
          <div className="flex gap-2">
            <span className={`auth-input flex-1 ${errors.captcha ? "is-error" : ""}`}>
              <input inputMode="numeric" value={captchaAnswer} onChange={(e) => { setCaptchaAnswer(e.target.value.replace(/\D/g, "")); if (errors.captcha) setErrors((p) => ({ ...p, captcha: undefined })); }}
                placeholder="Your answer" className="flex-1 min-w-0 bg-transparent outline-none text-[14px] text-zinc-100 placeholder:text-neutral-500" aria-label={`What is ${captcha.question}?`} />
            </span>
            <button type="button" data-no-busy onClick={() => { setCaptcha(makeCaptcha()); setCaptchaAnswer(""); }} className="topbar-btn !w-[50px] !h-[50px] !rounded-[14px]" aria-label="New sum"><RefreshCw className="w-4 h-4" /></button>
          </div>
          {errors.captcha && <span className="block text-[12px] text-red-400 mt-1.5">{errors.captcha}</span>}
        </div>

        <button type="submit" disabled={loading} className="auth-btn mt-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating your account…</> : <>Create account<ArrowRight className="w-4 h-4" /></>}
        </button>
        <p className="text-[11px] text-neutral-500 text-center leading-relaxed">By creating an account you accept our terms. Crypto prices are volatile; only invest what you can afford.</p>
      </form>
    </AuthShell>
  );
};

export default SignUpForm;

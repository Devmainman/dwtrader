// /auth — sign in. Same sign-in logic as before, in the shared auth frame.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, WifiOff, AlertTriangle, Loader2, ArrowRight } from "lucide-react";
import { playWelcome } from "../../../components/welcome/WelcomeExperience";
import { useUserAuth } from "../../../context/UserAuthContext";
import AuthShell, { AuthField } from "../../../components/auth/AuthShell";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [networkError, setNetworkError] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const { login } = useUserAuth();

  const validate = () => {
    const e = {};
    if (!formData.email) e.email = "Enter your email address";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = "That email doesn’t look right";
    if (!formData.password) e.password = "Enter your password";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
    if (loginError) setLoginError("");
  };

  const handleLogin = async (ev) => {
    ev?.preventDefault();
    if (!validate()) return;
    setLoginError("");
    setNetworkError(false);
    setLoading(true);
    try {
      const success = await login(formData.email.trim(), formData.password);
      if (success) {
        let name = "";
        try { name = JSON.parse(localStorage.getItem("user") || "{}").firstName || ""; } catch { /* ignore */ }
        playWelcome({ kind: "login", name });
        navigate("/dashboard");
      }
    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 450);
      if (err?.type === "credentials") setLoginError("Invalid email or password. Please try again.");
      else if (err?.type === "network" || !err?.response && !err?.type) { setNetworkError(true); setLoginError("No internet connection. Check your network and try again."); }
      else if (err?.type === "server") setLoginError("The server is temporarily unavailable. Please try again shortly.");
      else setLoginError(err?.response?.data?.message || err?.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to see your balance, trades and crypto."
      footer={<>New here? <Link to="/signup" className="font-semibold text-blue-400 hover:text-blue-300">Create an account</Link></>}>
      <form onSubmit={handleLogin} noValidate className={`space-y-4 ${shake ? "auth-shake" : ""}`}>
        <AuthField label="Email" type="email" name="email" autoComplete="email" inputMode="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} />
        <AuthField label="Password" type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" value={formData.password} onChange={handleChange} placeholder="Your password" error={errors.password}
          right={(
            <button type="button" data-no-busy onClick={() => setShowPassword((v) => !v)} className="text-neutral-500 hover:text-zinc-100 transition" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          )} />
        <div className="flex justify-end -mt-1">
          <Link to="/forgot-password" className="text-[12px] font-medium text-blue-400 hover:text-blue-300">Forgot password?</Link>
        </div>

        {loginError && (
          <div className={`flex items-start gap-2.5 rounded-2xl px-3.5 py-3 text-[13px] ${networkError ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`} role="alert">
            {networkError ? <WifiOff className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}<span>{loginError}</span>
          </div>
        )}

        <button type="submit" disabled={loading} className="auth-btn mt-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</> : <>Sign in<ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>
    </AuthShell>
  );
};

export default LoginScreen;

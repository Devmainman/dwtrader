import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LanguageSelector from "./LanguageSelector";
import Logo from "../../../assets/image-2.svg";
import { toast } from '../../../lib/toast';
import { playWelcome } from '../../../components/welcome/WelcomeExperience';
import { API_BASE_URL } from '../../../api/config';
import { useUserAuth } from '../../../context/UserAuthContext';
import { WifiOff, AlertTriangle } from "lucide-react";

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});
const [loginError, setLoginError] = useState('');
const [networkError, setNetworkError] = useState(false);
const [shake, setShake] = useState(false);

  const navigate = useNavigate();
  const { login } = useUserAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
  if (!validateForm()) return;

  setLoginError('');
  setNetworkError(false);
  setLoading(true);

  try {
    const success = await login(formData.email, formData.password);

    if (success) {
      let name = "";
      try { name = JSON.parse(localStorage.getItem("user") || "{}").firstName || ""; } catch { /* ignore */ }
      playWelcome({ kind: "login", name });
      navigate("/dashboard");
    }

} catch (err) {
  setShake(true);
  setTimeout(() => setShake(false), 400);

  // FIRST — HANDLE OUR CUSTOM ERROR TYPES
  if (err?.type === "credentials") {
    setLoginError("Invalid email or password. Please try again.");
    return;
  }

  if (err?.type === "network") {
    setNetworkError(true);
    setLoginError("No internet connection. Please check your network and try again.");
    return;
  }

  if (err?.type === "server") {
    setLoginError("Server is temporarily unavailable. Please try again later.");
    return;
  }

  // FALLBACK — REAL AXIOS NETWORK FAILURE (JUST IN CASE)
  if (!err?.response) {
    setNetworkError(true);
    setLoginError("No internet connection. Please check your network and try again.");
    return;
  }

  // DEFAULT
  setLoginError(err.message || "Login failed. Please try again.");

} finally {
  setLoading(false);
}

};


  return (
    <div className="flex flex-col min-h-screen bg-[#161617] text-white px-6 pt-8 md:px-12 md:pt-10">
      {/* Header with logo and language selector */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" />
          <span className="text-2xl font-bold tracking-wide hidden md:inline">SKOTE</span>
        </div>
        <div className="flex">
          <LanguageSelector />
        </div>
      </header>

      {/* Login Box */}
      <div className="md:flex md:items-center md:justify-center md:flex-1">
        <div className="w-full md:max-w-md md:bg-zinc-900 md:border md:border-zinc-800 md:rounded-2xl md:p-8">
          <section className="mb-6">
            <h1 className="text-4xl font-medium mb-1">Welcome</h1>
            <p className="text-sm text-neutral-400">We're so excited to have you again</p>
          </section>

          {/* Login Form */}
          <div className={`flex flex-col w-full transition-all ${shake ? "animate-shake" : ""}`}>
            {/* Email input */}
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`w-full bg-transparent border ${errors.email ? "border-red-500" : "border-zinc-700"} rounded-lg py-4 px-5 text-[12px]`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password input */}
            <div className="mb-2">
              <div className={`w-full bg-transparent border ${errors.password ? "border-red-500" : "border-zinc-700"} rounded-lg py-4 px-5 flex justify-between items-center`}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="bg-transparent outline-none w-full text-[12px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-4 text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Forget Password link */}
            <div className="flex justify-end mb-8">
              <Link to="/forgot-password" className="text-indigo-500 text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Login Error Message */}
{loginError && (
  <div className={`mb-4 p-3 rounded-lg text-sm flex items-center space-x-2
    ${networkError
      ? "bg-yellow-900/30 text-yellow-400 border border-yellow-500/30"
      : "bg-red-900/30 text-red-400 border border-red-500/30"
    }`}
  >
    <span className="text-lg">
      {networkError ? <WifiOff className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
    </span>
    <span>{loginError}</span>
  </div>
)}


            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full bg-blue-600 text-[12px] text-white py-4 rounded-full mb-6 font-medium ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Login"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-zinc-700"></div>
              <span className="mx-4 text-zinc-500">or</span>
              <div className="flex-1 h-px bg-zinc-700"></div>
            </div>

            {/* Sign Up button */}
            <Link to="/signup">
              <button className="w-full border text-[12px] border-blue-600 text-white py-4 rounded-full font-medium hover:bg-blue-600/10 transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
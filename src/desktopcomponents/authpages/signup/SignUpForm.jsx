import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LanguageSelector from "../loginpage/LanguageSelector";
import Logo from "../../../assets/image-2.svg";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";
import { API_BASE_URL } from '../../../api/config';
import { useUserAuth } from '../../../context/UserAuthContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { login } = useUserAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const correctCaptcha = "27";
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    if (captchaAnswer !== correctCaptcha) {
      newErrors.captcha = "Incorrect answer";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      // Sign up
      await axios.post(`${API_BASE_URL}/users/signup`, {
        email: formData.email,
        password: formData.password,
        referralCode: referralCode || undefined
      });

      // Log in separately
      const loginSuccess = await login(formData.email, formData.password);
      
      if (loginSuccess) {
        toast.success("Account created successfully!");
        navigate("/welcome", { state: { email: formData.email } });
      }
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.message || 
                     "Signup failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section className="flex flex-col min-h-screen bg-neutral-900">
      {/* Header with logo and language selector */}
      <header className="flex px-5 py-5 justify-between items-center">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" />
          <span className="text-2xl font-bold tracking-wide hidden md:inline">SKOTE</span>
        </div>
        <div className="flex">
          <LanguageSelector />
        </div>
      </header>
      
      {/* Main form */}
      <div className="flex flex-grow justify-center items-start pt-5 px-5 py-0 md:py-">
        <div className="flex flex-col w-full md:max-w-lg lg:max-w-xl md:bg-zinc-900 md:border md:border-neutral-800 md:rounded-3xl md:p-10">
          <header className="flex flex-col mb-6">
            <h1 className="text-4xl font-medium text-white">Welcome</h1>
            <p className="text-sm text-neutral-400">We're so excited to have you!</p>
          </header>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormInput
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              error={errors.email}
            />
            
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              error={errors.password}
            />
            
            <PasswordInput
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              error={errors.confirmPassword}
            />
            
            <div className="mt-10 mb-10">
              <div className="flex flex-col gap-3 w-full">
                <p className="text-[12px] text-amber-500 text-center">Confirm you are not a robot</p>
                <div className="flex w-full gap-3">
                  <div className="flex items-center justify-center px-4 py-3 rounded-lg border border-blue-700 bg-transparent w-1/2">
                    <span className="text-neutral-300 text-[12px]">18 +9</span>
                  </div>
                  <input
                    type="text"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="Enter Answer"
                    className={`w-1/2 px-4 py-3 text-[12px] rounded-lg bg-zinc-900 border ${
                      errors.captcha ? "border-red-500" : "border-neutral-700"
                    } text-neutral-300 focus:outline-none focus:border-blue-500`}
                  />
                </div>
                {errors.captcha && <p className="text-xs text-red-600 mt-1">{errors.captcha}</p>}
              </div>
            </div>
            
            <div className="flex flex-col gap-4 items-center w-full">
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-4 bg-blue-600 text-[12px] ${
                  loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                } text-white font-medium rounded-full transition-colors`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : "Sign Up"}
              </button>
              <Link to="/auth" className="text-[12px] text-blue-500 hover:text-blue-400">
                Already have an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;
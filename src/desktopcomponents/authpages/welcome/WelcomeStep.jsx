import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../../context/UserAuthContext';
import { completeProfile } from '../../../api/verification';
import { toast } from 'react-toastify';

export default function WelcomeStep({ onContinue, initialData = {} }) {
  const navigate = useNavigate();
  const { user, token, updateUserProfile, refreshToken } = useUserAuth();

  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: user?.email || initialData.email || '',
    phoneNumber: initialData.phoneNumber || '',
    country: initialData.country || '',
    gender: initialData.gender || '',
    currency: initialData.currency || '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid = (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.phoneNumber.trim() &&
      formData.country &&
      formData.gender &&
      formData.currency
    );
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value 
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.currency) newErrors.currency = 'Currency is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Verify we have a valid token
      let currentToken = token;
      if (!currentToken) {
        const refreshed = await refreshToken();
        if (!refreshed) throw new Error('Authentication required');
        currentToken = localStorage.getItem('token');
      }

      // Complete profile with the token
      const response = await completeProfile(formData, currentToken);

      if (response?.success) {
        // Update user context with new profile data
        updateUserProfile({
          ...formData,
        });

        toast.success('Profile completed successfully!');
        
        // Check if onContinue exists before calling it
        if (onContinue) {
          onContinue(formData);
        } else {
          console.warn('onContinue not provided, redirecting to dashboard');
          navigate('/'); // Fallback to dashboard if onContinue is not provided
        }
      } else {
        setErrors(response?.errors || { 
          general: response?.message || 'Profile update failed' 
        });
      }
    } catch (error) {
      console.error('Profile submission error:', error);

      let errorMessage;
      if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else {
        errorMessage = error.message || 'Failed to save profile. Please try again.';
      }

      setErrors({
        general: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-[35px] text-[#F3F3F3] font-medium mb-2">Welcome</h1>
      <p className="text-[#F3F3F3] font-regular mb-6">You're a few steps to completing your profile</p>

      <div className="bg-[#1D1D1F] flex justify-center items-center h-[37px] w-[204px] rounded-[8px] p-2 mb-6">
        <h2 className="text-[14px] ">Account Authentication</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your First Name"
            className={`w-full h-[50px] bg-transparent border ${
              errors.firstName ? 'border-red-500' : 'border-[#505050]'
            } rounded-[8px] p-4 text-[#505050] text-[12px] focus:outline-none focus:border-white`}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your Last Name"
            className={`w-full h-[50px] bg-transparent border ${
              errors.lastName ? 'border-red-500' : 'border-[#505050]'
            } rounded-[8px] p-4 text-[#505050] text-[12px] focus:outline-none focus:border-white`}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled
            className={`w-full bg-transparent border ${
              errors.email ? 'border-red-500' : 'border-[#505050]'
            } rounded-[8px] p-4 text-[#505050] text-[12px] focus:outline-none focus:border-white`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Country */}
        <div>
          <div className="w-full bg-transparent border border-[#505050] rounded-md p-4 text-gray-400 flex justify-between">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="bg-transparent rounded-[8px] text-[#505050] text-[12px] w-full focus:outline-none focus:border-white"
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="NG">Nigeria</option>
            </select>
          </div>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <div className="w-full bg-transparent border border-[#505050] rounded-md p-4 text-gray-400 flex">
            <span className="mr-2 text-[12px]">+234</span>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your Phone Number"
              className="bg-transparent rounded-[8px] text-[#505050] text-[12px] flex-1 focus:outline-none focus:border-white"
            />
          </div>
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>

        {/* Gender */}
        <div>
          <div className="w-full bg-transparent border border-[#505050] rounded-md p-4 text-gray-400 flex justify-between">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="bg-transparent text-[12px] text-[#505050] w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>

        {/* Currency */}
        <div>
          <div className="w-full bg-transparent border border-[#505050] rounded-md p-4 text-gray-400 flex justify-between">
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="bg-transparent text-[12px] text-[#505050] w-full"
            >
              <option value="">Select Currency</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="NGN">NGN</option>
            </select>
          </div>
          {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className={`w-full text-[12px] text-white rounded-full py-4 font-medium mt-10 ${
            loading || !isFormValid ? 'bg-blue-500 opacity-50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 transition-colors'
          }`}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>

        {errors.general && (
          <p className="text-red-500 text-sm text-center mt-2">
            {errors.general}
          </p>
        )}
      </form>
    </div>
  );
}
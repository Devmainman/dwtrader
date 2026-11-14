import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../../context/UserAuthContext';
import { completeProfile } from '../../../api/verification';
import { toast } from '../../../lib/toast';
import { API_BASE_URL } from '../../../api/config';

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
  const [currencies, setCurrencies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedDialCode, setSelectedDialCode] = useState('+');

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
  
        const res = await fetch(`${API_BASE_URL}/users/currencies`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        const json = await res.json();
        if (json?.data && Array.isArray(json.data)) {
          const sorted = json.data.sort((a, b) => a.code.localeCompare(b.code)); // or use a.title.localeCompare(b.title)
          setCurrencies(sorted);
        } else {
          setCurrencies([]);
        }        
      } catch (err) {
        console.error('Currency fetch error:', err);
        setCurrencies([]);
      }
    };
  
    fetchCurrencies();
  }, []);


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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
        
        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }
        
        const data = await res.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format - expected array');
        }
        
        const countryList = data
          .map((c) => ({
            name: c.name?.common || 'Unknown',
            code: c.cca2 || '',
            dialCode: c.idd?.root && c.idd?.suffixes?.length
              ? c.idd.root + c.idd.suffixes[0]
              : null,
          }))
          .filter((c) => c.code && c.dialCode && c.name)
          .sort((a, b) => a.name.localeCompare(b.name)); // ✅ sort alphabetically

          
        
        setCountries(countryList);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };
    
    fetchCountries();
  }, []);
  

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
  
    // Validate required fields
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
  
    // Prepare payload with correct field names
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber, // Map to backend's expected field name
      country: formData.country,
      gender: formData.gender.toLowerCase(),
      currency: formData.currency
    };
  
    // Debug: Log the payload before sending
    console.log('Submitting payload:', payload);
  
    setLoading(true);
  
    try {
      const response = await completeProfile(payload, token);
      
      if (response?.success) {
        updateUserProfile({
          ...formData,
          mobile: formData.phoneNumber // Update local state
        });
        toast.success('Profile completed successfully!');
        onContinue?.();
      } else {
        // Handle backend validation errors
        const backendErrors = response?.errors || {};
        setErrors(backendErrors);
        toast.error(response?.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile submission error:', error);
      // Enhanced error handling
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to save profile. Please try again.';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
  <div className="space-y-4 ">
    <h1 className="text-[35px] text-[#F3F3F3] font-medium mb-2">Welcome</h1>
    <p className="text-[#F3F3F3] font-regular mb-6">You're a few steps to completing your profile</p>

    <div className="bg-[#1D1D1F] flex justify-center items-center h-[37px] w-[204px] rounded-[8px] p-2 mb-6">
      <h2 className="text-[14px] ">Account Authentication</h2>
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* First Name */}
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your First Name"
            className={`w-full h-[50px] bg-transparent border ${errors.firstName ? 'border-red-500' : 'border-[#505050]'} rounded-[8px] p-4 text-[#505050] text-[12px] focus:outline-none focus:border-white`}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}

          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled
            className={`w-full bg-transparent border ${errors.email ? 'border-red-500' : 'border-[#505050]'} rounded-[8px] p-4 text-[#505050] text-[12px] focus:outline-none focus:border-white`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

          {/* Phone Number */}
          <div className="w-full bg-transparent border border-[#505050] rounded-md p-4 text-gray-400 flex items-center">
            <select
              value={selectedDialCode}
              onChange={(e) => setSelectedDialCode(e.target.value)}
              className="bg-transparent text-[12px] mr-2"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.dialCode}>
                  {c.dialCode}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber.replace(selectedDialCode, '')}
              onChange={(e) => {
                const fullNumber = selectedDialCode + e.target.value.replace(/\D/g, '');
                setFormData(prev => ({ ...prev, phoneNumber: fullNumber }));
              }}
              placeholder="1234567890"
              className="bg-transparent flex-1 text-[12px] focus:outline-none"
            />
          </div>
          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}

          {/* Currency */}
          <div className="w-full bg-transparent border border-[#505050] rounded-md p-4 text-gray-400 flex justify-between">
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="bg-transparent text-[12px] text-[#505050] w-full"
            >
              <option value="">Select Currency</option>
              {currencies.map((cur) => (
                <option key={cur.code} value={cur.code}>
                  {cur.code} - {cur.title}
                </option>
              ))}
            </select>
          </div>
          {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency}</p>}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Last Name */}
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your Last Name"
            className={`w-full h-[50px] bg-transparent border ${errors.lastName ? 'border-red-500' : 'border-[#505050]'} rounded-[8px] p-4 text-[#505050] text-[12px] focus:outline-none focus:border-white`}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}

          {/* Country */}
          <select
            name="country"
            value={formData.country}
            onChange={(e) => {
              const selected = countries.find(c => c.code === e.target.value);
              setSelectedDialCode(selected?.dialCode || '+1');
              handleChange(e);
            }}
            className="w-full bg-transparent border border-[#505050] rounded-md p-4 text-[#505050] text-[12px]"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dialCode})
              </option>
            ))}
          </select>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}

          {/* Gender */}
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
      </div>

      {/* Continue Button */}
      <div className="flex justify-center mt-10">
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className={`w-full md:w-[60%] text-[12px] text-white rounded-full py-4 font-medium ${
            loading || !isFormValid ? 'bg-blue-500 opacity-50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 transition-colors'
          }`}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </div>

      {errors.general && (
        <p className="text-red-500 text-sm text-center mt-2">
          {errors.general}
        </p>
      )}
    </form>

    {/* Step Indicator moved to bottom */}
    <div className="hidden md:flex mt-10 flex justify-center">
      <div className="w-full flex justify-between items-center">
        {Array.from({ length: 3 }).map((_, index) => (
          <div 
            key={index} 
            className={`h-1 flex-1 rounded-full ${index < 2 ? "bg-white" : "bg-gray-600"}`}
          />
        ))}
      </div>
    </div>
  </div>
);

}
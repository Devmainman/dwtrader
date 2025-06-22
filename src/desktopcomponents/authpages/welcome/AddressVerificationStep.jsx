import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { saveAddress } from '../../../api/verification'; // Changed import name

export default function AddressVerificationStep({ onBack, onContinue }) {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async () => {
    // Basic validation
    const newErrors = {};
    if (!formData.street) newErrors.street = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Use the correct imported function name
      const response = await saveAddress(formData);
      
      if (response.success) {
        onContinue(formData);
      } else {
        setErrors(response.errors || { general: response.message || 'Failed to save address' });
      }
    } catch (error) {
      console.error('Address verification error:', error);
      setErrors({ 
        general: error.response?.data?.message || 
                error.message || 
                'Address verification failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-[18px] text-[#F3F3F3] font-medium">Address Verification</h1>
      <p className="text-[#F3F3F3] text-[12px] mb-4">We will need to authenticate your account credibility details with Your Address</p>
      
      <div className="space-y-4">
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="Street Address"
          className={`w-full bg-transparent border ${errors.street ? 'border-red-500' : 'border-[#505050]'} rounded-[8px] p-4 w-[350px] h-[51px] text-[12px] text-[#9F9F9F]`}
        />
        {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
        
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className={`w-full bg-transparent border ${errors.city ? 'border-red-500' : 'border-[#505050]'} rounded-[8px] p-4 w-[350px] h-[51px] text-[12px] text-[#9F9F9F]`}
        />
        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State/Province"
          className={`w-full bg-transparent border ${errors.state ? 'border-red-500' : 'border-[#505050]'} rounded-[8px] p-4 w-[350px] h-[51px] text-[12px] text-[#9F9F9F]`}
        />
        {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
        
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="Postal/Zip Code"
          className={`w-full bg-transparent border ${errors.postalCode ? 'border-red-500' : 'border-[#505050]'} rounded-[8px] p-4 w-[350px] h-[51px] text-[12px] text-[#9F9F9F]`}
        />
        {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode}</p>}
        
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          className={`w-full bg-transparent border ${errors.country ? 'border-red-500' : 'border-[#505050]'} rounded-[8px] p-4 w-[350px] h-[51px] text-[12px] text-[#9F9F9F]`}
        >
          <option value="">Select Country</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="NG">Nigeria</option>
        </select>
        {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
      </div>
      
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#2563EB] text-[12px] text-white rounded-full py-4 font-medium"
        >
          {loading ? 'Verifying...' : 'Next'}
        </button>
      </div>

      <div className="mt-6 bg-[#1D1D1F] rounded-[10px] p-4">
          
         
          
          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            Thank you for registering with our platform! To ensure the 
            security of your account and provide you with a seamless 
            experience, we kindly request you to provide your address 
            and upload a scanned copy or clear proof of address for 
            verification purposes.
            </p>
          </div>


          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            The provided identity card should be one of the following:
            </p>
          </div>

          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            Please make sure that the uploaded document clearly displays your address:
            </p>
          </div>

          <div className="flex mb-2 item-center">
            <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-[#9F9F9F] text-[10px]">
            Rest assured that all information you provide will be 
            handled with the utmost confidentiality and used solely for 
            verification purposes in accordance with our privacy policy.
            </p>
          </div>

          
          
          
        </div>

    </div>
  );
}

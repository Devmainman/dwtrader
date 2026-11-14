import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { saveAddress } from '../../../api/verification';

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
      const response = await saveAddress(formData);
      if (response.success) {
        onContinue(formData);
      } else {
        setErrors(response.errors || { general: response.message || 'Failed to save address' });
      }
    } catch (error) {
      setErrors({
        general: error.response?.data?.message ||
          error.message ||
          'Address verification failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderInstructions = () => (
    <>
      {[
        `Thank you for registering with our platform! To ensure the 
        security of your account and provide you with a seamless 
        experience, we kindly request you to provide your address 
        and upload a scanned copy or clear proof of address for 
        verification purposes.`,
        'The provided identity card should be one of the following:',
        'Please make sure that the uploaded document clearly displays your address:',
        `Rest assured that all information you provide will be 
        handled with the utmost confidentiality and used solely for 
        verification purposes in accordance with our privacy policy.`
      ].map((text, index) => (
        <div className="flex mb-2 items-center" key={index}>
          <CheckCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
          <p className="text-[#9F9F9F] text-[10px]">{text}</p>
        </div>
      ))}
    </>
  );

 return (
  <div className="md:flex md:items-start md:justify-center md:gap-6">
    {/* LEFT PANEL */}
    <div className="w-full md:w-[820px] md:h-[574px] rounded-[10px] md:p-6 md:bg-[#1D1D1F] md:flex md:flex-col md:gap-4">
      
      {/* Desktop Header */}
      <div className="hidden md:block mb-1">
        <h1 className="text-[35px] text-[#F3F3F3] font-medium mb-2">Welcome</h1>
        <p className="text-[#F3F3F3] font-regular mb-4">
          You're a few steps to completing your profile
        </p>
        <div className="bg-[#242426] flex justify-center items-center h-[37px] w-[204px] rounded-[8px] p-2 mb-1">
          <h2 className="text-[14px] text-white">Account Authentication</h2>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 space-y-4">
        {/* Mobile Header */}
        <div className="md:hidden">
          <h1 className="text-[18px] text-[#F3F3F3] font-medium">Address Verification</h1>
          <p className="text-[#F3F3F3] text-[12px] mb-4">
            We will need to authenticate your account credibility details with Your Address
          </p>
        </div>

        {/* Desktop Subheading */}
        <div className="hidden md:block">
          <h2 className="text-[18px] text-[#F3F3F3] font-medium">Address Verification</h2>
          <p className="text-[#F3F3F3] text-[12px] mb-4">
            We will need to authenticate your account credibility details with Your Address
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'street', placeholder: 'Street Address' },
            { name: 'city', placeholder: 'City' },
            { name: 'state', placeholder: 'State/Province' },
            { name: 'postalCode', placeholder: 'Postal/Zip Code' }
          ].map(({ name, placeholder }) => (
            <div key={name}>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full bg-transparent border ${errors[name] ? 'border-red-500' : 'border-[#505050]'} rounded-[8px] p-4 text-[12px] text-[#9F9F9F]`}
              />
              {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
            </div>
          ))}

          {/* Country Select in one column */}
          <div>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full bg-transparent border ${errors.country ? 'border-red-500' : 'border-[#505050]'} rounded-[8px] p-4 text-[12px] text-[#9F9F9F]`}
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="NG">Nigeria</option>
            </select>
            {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
          </div>
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm">{errors.general}</p>
        )}

        {/* Mobile Button */}
        <div className="md:hidden flex gap-4 mt-6">
          <div className="w-full">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#E8742A] text-[12px] text-white rounded-full py-4 font-medium"
            >
              {loading ? 'Verifying...' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT COLUMN (Instructions - Desktop Only) */}
        <div className="hidden md:block md:w-[403px] md:h-full">
          <div className="bg-[#1D1D1F] rounded-[10px] p-4 overflow-y-auto h-full">
            {renderInstructions()}
          </div>
           <div className="flex gap-4 mt-6">
          <div className="w-full md:max-w-[350px]">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#E8742A] text-[12px] text-white rounded-full py-4 font-medium"
            >
              {loading ? 'Verifying...' : 'Next'}
            </button>
          </div>
        </div>

        </div>

    {/* Mobile Instructions */}
    <div className="md:hidden mt-6 bg-[#1D1D1F] rounded-[10px] p-4">
      {renderInstructions()}
    </div>
  </div>
);

}

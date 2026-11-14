import React, { useEffect, useState, useCallback } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { toast } from '../lib/toast';

export default function UserPopupHandler() {
  const { token, fetchWithAuth } = useUserAuth();
  const [assignments, setAssignments] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [copiedFields, setCopiedFields] = useState({});
  
  // Track completed assignments to prevent duplicates
  const [completedAssignments, setCompletedAssignments] = useState(new Set());

  // Assignment mapping function
  const mapAssignments = useCallback((popups) => {
    return popups.map(popup => ({
      _id: popup._id,
      type: `popup_${popup.type}`,
      status: popup.status,
      itemId: {
        _id: popup.itemId,
        title: popup.title,
        description: popup.description,
        ...(popup.type === 'invoice' && { amount: popup.amount, currency: popup.currency }),
        ...(popup.type === 'form' && { fields: popup.fields }),
        ...(popup.type === 'message' && { filePath: popup.filePath, acknowledged: popup.acknowledged }),
      },
      title: popup.title,
      blockProgress: popup.blockProgress,
    }));
  }, []);

  // Centralized assignment loader
  const loadAssignments = useCallback(async () => {
    setLoading(true);
    try {
      if (!token) return;
      
      const popupResponse = await fetchWithAuth('/users/popups/active');
      if (popupResponse.data.success) {
        if (popupResponse.data.popups?.length > 0) {
          // Filter out completed assignments
          const activeAssignments = popupResponse.data.popups
            .filter(popup => !completedAssignments.has(popup._id));
          
          const mappedAssignments = mapAssignments(activeAssignments);
          setAssignments(mappedAssignments);
          setCurrentAssignment(mappedAssignments[0] || null);
          
          if (mappedAssignments[0]?.type === 'popup_form') {
            initializeFormData(mappedAssignments[0].itemId);
          }
        } else {
          setAssignments([]);
          setCurrentAssignment(null);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
      toast.error(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [token, fetchWithAuth, mapAssignments, completedAssignments]);

  // Initial fetch and when completedAssignments changes
  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  // Fetch payment methods when invoice assignment appears
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetchWithAuth('/payments/methods');
        if (response.data.success) {
          const methods = Array.isArray(response.data.data) 
            ? response.data.data 
            : [];
          setPaymentMethods(methods);
        } else {
          console.warn('Payment methods response not successful:', response.data);
          setPaymentMethods([]);
        }
      } catch (err) {
        console.error('Failed to load payment methods:', err);
        toast.error('Failed to load payment methods');
        setPaymentMethods([]);
      }
    };

    if (currentAssignment?.type === 'popup_invoice') {
      fetchPaymentMethods();
    }
  }, [currentAssignment, fetchWithAuth]);

  // Reset payment selection when assignment changes
  useEffect(() => {
    if (currentAssignment?.type !== 'popup_invoice') {
      setSelectedPaymentMethod('');
      setPaymentProof(null);
      setCopiedFields({});
    }
  }, [currentAssignment]);

  // Initialize form data
  const initializeFormData = (form) => {
    const initialData = {};
    form?.fields?.forEach(field => {
      initialData[field.name] = field.defaultValue || '';
    });
    setFormData(initialData);
    setFormErrors({});
  };

  // Copy to clipboard function
  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedFields(prev => ({ ...prev, [fieldName]: true }));
    setTimeout(() => setCopiedFields(prev => ({ ...prev, [fieldName]: false }), 2000));
  };

  // Handle form field changes
  const handleFormChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setFormErrors(prev => ({ ...prev, [fieldName]: undefined }));
  };

  // Validate form
  const validateForm = (form) => {
    const errors = {};
    let isValid = true;

    form.fields.forEach(field => {
      const value = formData[field.name];
      
      // Check required fields
      if (field.required) {
        if (field.type === 'file') {
          if (!value || !(value instanceof File)) {
            errors[field.name] = 'File is required';
            isValid = false;
          } else if (value.size === 0) {
            errors[field.name] = 'File cannot be empty';
            isValid = false;
          }
        } else if (!value || value.toString().trim() === '') {
          errors[field.name] = 'This field is required';
            isValid = false;
        }
      }

      // Validate field types
      if (value && value.toString().trim() !== '') {
        if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
          errors[field.name] = 'Invalid email';
          isValid = false;
        } else if (field.type === 'number' && isNaN(value)) {
          errors[field.name] = 'Must be a number';
          isValid = false;
        } else if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(value)) {
          errors[field.name] = 'Invalid format';
          isValid = false;
        }
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !currentAssignment) return;
  
    setSubmitting(true);
    setError(null);
  
    try {
      // Create a simple object instead of FormData
      const payload = {
        assignmentId: currentAssignment._id,
        ...formData
      };
  
      // Create actual FormData only if we have files
      let formDataToSend;
      const hasFiles = Object.values(formData).some(value => value instanceof File);
      
      if (hasFiles) {
        formDataToSend = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value instanceof File) {
            formDataToSend.append(key, value);
          } else {
            formDataToSend.append(key, value.toString());
          }
        });
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/users/popup-forms/${currentAssignment.itemId._id}/submit`,
        hasFiles ? formDataToSend : payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': hasFiles ? 'multipart/form-data' : 'application/json'
          },
          timeout: 30000,
        }
      );
  
      if (response.data.success) {
        toast.success('Submitted successfully');
        // Immediately update UI state
      setAssignments(prev => {
        const updated = prev.filter(a => a._id !== currentAssignment._id);
        // Set next assignment if available
        setCurrentAssignment(updated[0] || null); 
        return updated;
      });
      
      // Mark as completed to prevent reload
      setCompletedAssignments(prev => new Set(prev).add(currentAssignment._id));
    }
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle invoice payment
  const handleInvoicePayment = async (e) => {
    e.preventDefault();
    if (submitting || !currentAssignment || !selectedPaymentMethod || !paymentProof) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(paymentProof.type)) {
      setError('Payment proof must be a JPEG, PNG, or PDF');
      toast.error('Invalid file type');
      return;
    }
    if (paymentProof.size > maxSize) {
      setError('Payment proof must be under 5MB');
      toast.error('File too large');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const invoice = currentAssignment.itemId;
      const formData = new FormData();
      formData.append('paymentMethodId', selectedPaymentMethod);
      formData.append('assignmentId', currentAssignment._id);
      formData.append('paymentProof', paymentProof);

      const response = await axios.post(
        `${API_BASE_URL}/users/popup-invoices/${invoice._id}/pay`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'multipart/form-data' 
          },
          timeout: 30000
        }
      );

      if (response.data.success) {
        toast.success('Payment submitted successfully');
        // Mark assignment as completed
        setCompletedAssignments(prev => new Set(prev).add(currentAssignment._id));
      }
    } catch (err) {
      // Handle duplicate submission on backend
      if (err.response?.status === 400 && err.response.data.message.includes('already')) {
        toast.warning('This invoice was already processed');
        setCompletedAssignments(prev => new Set(prev).add(currentAssignment._id));
      } else {
        setError(err.response?.data?.message || 'Payment submission failed');
        toast.error('Payment submission failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle message acknowledgment
  const handleMessageAck = async () => {
    if (submitting || !currentAssignment) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/popup-messages/${currentAssignment._id}/acknowledge`,
        {},
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000
        }
      );
      
      if (response.data.success) {
        toast.success('Message acknowledged');
        // Mark assignment as completed
        setCompletedAssignments(prev => new Set(prev).add(currentAssignment._id));
        
        // FIX: Immediately update UI to prevent duplicate popups
        setAssignments(prev => prev.filter(a => a._id !== currentAssignment._id));
        setCurrentAssignment(prev => {
          const nextAssignments = assignments.filter(a => a._id !== currentAssignment._id);
          return nextAssignments[0] || null;
        });
      }
    } catch (err) {
      // Handle duplicate acknowledgment
      if (err.response?.status === 400 && err.response.data.message.includes('already acknowledged')) {
        toast.warning('Message already acknowledged');
        setCompletedAssignments(prev => new Set(prev).add(currentAssignment._id));
        
        // FIX: Immediately update UI to prevent duplicate popups
        setAssignments(prev => prev.filter(a => a._id !== currentAssignment._id));
        setCurrentAssignment(prev => {
          const nextAssignments = assignments.filter(a => a._id !== currentAssignment._id);
          return nextAssignments[0] || null;
        });
      } else {
        setError(err.response?.data?.message || 'Failed to acknowledge message');
        toast.error('Message acknowledgment failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Render form field
  const renderFormField = (field) => {
    const fieldName = field.name;
    switch (field.type.toLowerCase()) {
      case 'textarea':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-stone-300 mb-1 text-xs">{field.label}{field.required && <span className="text-red-500">*</span>}</label>
            <textarea
              value={formData[fieldName] || ''}
              onChange={(e) => handleFormChange(fieldName, e.target.value)}
              className="w-full p-2 rounded bg-neutral-900 text-stone-300 border-2 border-zinc-900 focus:border-neutral-800 text-xs"
              placeholder={field.placeholder}
              required={field.required}
              readOnly={field.readonly}
              rows={4}
            />
            {formErrors[fieldName] && <p className="text-red-500 text-xs">{formErrors[fieldName]}</p>}
          </div>
        );
      case 'select':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-stone-300 mb-1 text-xs">{field.label}{field.required && <span className="text-red-500">*</span>}</label>
            <select
              value={formData[fieldName] || ''}
              onChange={(e) => handleFormChange(fieldName, e.target.value)}
              className="w-full p-2 rounded bg-neutral-900 text-stone-300 border-2 border-zinc-900 focus:border-neutral-800 text-xs"
              required={field.required}
              disabled={field.readonly}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {formErrors[fieldName] && <p className="text-red-500 text-xs">{formErrors[fieldName]}</p>}
          </div>
        );
      case 'checkbox':
        return (
          <div key={fieldName} className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={formData[fieldName] || false}
              onChange={(e) => handleFormChange(fieldName, e.target.checked)}
              className="mr-2"
              required={field.required}
              disabled={field.readonly}
            />
            <label className="text-stone-300 text-xs">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
            {formErrors[fieldName] && <p className="text-red-500 text-xs">{formErrors[fieldName]}</p>}
          </div>
        );
      case 'radio':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-stone-300 mb-1 text-xs">{field.label}{field.required && <span className="text-red-500">*</span>}</label>
            {field.options?.map(opt => (
              <div key={opt.value} className="flex items-center mb-1">
                <input
                  type="radio"
                  name={fieldName}
                  value={opt.value}
                  checked={formData[fieldName] === opt.value}
                  onChange={(e) => handleFormChange(fieldName, e.target.value)}
                  className="mr-2"
                  required={field.required}
                  disabled={field.readonly}
                />
                <span className="text-stone-300 text-xs">{opt.label}</span>
              </div>
            ))}
            {formErrors[fieldName] && <p className="text-red-500 text-xs">{formErrors[fieldName]}</p>}
          </div>
        );
      case 'file':
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-stone-300 mb-1 text-xs">{field.label}{field.required && <span className="text-red-500">*</span>}</label>
            <input
              type="file"
              onChange={(e) => handleFormChange(fieldName, e.target.files[0])}
              className="w-full p-2 rounded bg-neutral-900 text-stone-300 border-2 border-zinc-900 text-xs"
              required={field.required}
              disabled={field.readonly}
            />
            {formErrors[fieldName] && <p className="text-red-500 text-xs">{formErrors[fieldName]}</p>}
          </div>
        );
      default:
        return (
          <div key={fieldName} className="mb-4">
            <label className="block text-stone-300 mb-1 text-xs">{field.label}{field.required && <span className="text-red-500">*</span>}</label>
            <input
              type={field.type}
              value={formData[fieldName] || ''}
              onChange={(e) => handleFormChange(fieldName, e.target.value)}
              className="w-full p-2 rounded bg-neutral-900 text-stone-300 border-2 border-zinc-900 focus:border-neutral-800 text-xs"
              placeholder={field.placeholder}
              required={field.required}
              readOnly={field.readonly}
            />
            {formErrors[fieldName] && <p className="text-red-500 text-xs">{formErrors[fieldName]}</p>}
          </div>
        );
    }
  };

  if (loading) return <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><p className="text-stone-300">Loading...</p></div>;

  if (!assignments.length) return null;

  const isBlocking = currentAssignment?.blockProgress;

  // Render payment methods as cards in a grid
  const renderPaymentMethods = () => {
    const selectedMethod = paymentMethods.find(method => 
      method.methodId === selectedPaymentMethod
    );
    
    return (
      <div className="mb-4">
        <label className="block text-stone-300 mb-2 text-xs">Select Payment Method</label>
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.map(method => (
            <button
              key={method._id}
              type="button"
              onClick={() => setSelectedPaymentMethod(method.methodId)}
              className={`p-2 rounded-3xl border-2 flex flex-col items-left text-xs ${
                selectedPaymentMethod === method.methodId
                  ? 'border-neutral-800 bg-neutral-900'
                  : 'border-zinc-900'
              }`}
            >
              {method.icon && (
                <div className="mb-1">
                  {method.icon.startsWith('/') || method.icon.startsWith('http') ? (
                    <img 
                      src={method.icon} 
                      alt={method.title} 
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <div className="rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-[10px]">{method.icon}</span>
                    </div>
                  )}
                </div>
              )}
              <span className="text-stone-300">{method.title}</span>
            </button>
          ))}
        </div>
        
        {/* Payment method details section */}
        {selectedMethod && (
          <div className="mt-4 p-3 bg-neutral-900 rounded-lg border-2 border-zinc-900">
            <h4 className="font-medium text-stone-300 mb-2 text-xs">
              {selectedMethod.title} Payment Details
            </h4>
            
            <div className="space-y-2">
              {selectedMethod.details?.map((detail, index) => {
                const fieldKey = `${selectedMethod._id}-${index}`;
                return (
                  <div key={index} className="flex justify-between items-start">
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-stone-400 text-xs">{detail.name}:</span>
                        <button
                          onClick={() => copyToClipboard(detail.value, fieldKey)}
                          className="ml-2 text-blue-400 hover:text-blue-300 flex items-center text-[10px]"
                        >
                          {copiedFields[fieldKey] ? (
                            <span className="text-green-400">Copied!</span>
                          ) : (
                            <span>Copy</span>
                          )}
                        </button>
                      </div>
                      <div className="bg-zinc-900 p-2 rounded mt-1 break-words">
                        <p className="text-stone-300 text-xs">{detail.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {selectedMethod.minAmount && selectedMethod.maxAmount && (
              <div className="mt-2 text-xs text-stone-400">
                <p>Min: {selectedMethod.minAmount} {currentAssignment.itemId?.currency}</p>
                <p>Max: {selectedMethod.maxAmount} {currentAssignment.itemId?.currency}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Fallback when no payment methods */}
        {!paymentMethods.length && (
          <div className="text-center py-3">
            <p className="text-red-500 text-xs">No payment methods available</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1D1D1F] rounded-[20px] text-stone-300 p-4 w-full max-w-md border-2 border-zinc-900">
        {error && <div className="bg-red-500 p-2 mb-3 rounded text-xs">{error}</div>}
        {currentAssignment && (
          <>
            <h3 className="text-[16px] font-bold mb-3 text-[#8D6612] text-left">{currentAssignment.title}</h3>
            {currentAssignment.type === 'popup_form' && (
              <form onSubmit={handleFormSubmit}>
                <p className="text-stone-400 mb-3 text-xs text-center">{currentAssignment.itemId?.description}</p>
                {currentAssignment.itemId?.fields.map(renderFormField)}
                <div className="flex justify-center mt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-5 py-1 rounded-3xl border-2 border-solid min-w-auto border-neutral-800 text-xs"
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
            {currentAssignment.type === 'popup_invoice' && (
              <form onSubmit={handleInvoicePayment}>
                <p className="text-[#A3A0A4] mb-3 text-[10px] text-left">{currentAssignment.itemId?.description}</p>
                <p className="mb-3 text-[16px] font-semibold text-left">
                  Amount: {currentAssignment.itemId?.amount} {currentAssignment.itemId?.currency}
                </p>
                
                {/* Payment method grid */}
                {renderPaymentMethods()}
                
                <div className="mb-3">
                  <label className="block text-stone-300 mb-1 text-xs">Payment Proof</label>
                  <input
                    type="file"
                    onChange={(e) => setPaymentProof(e.target.files[0])}
                    className="w-full p-1 rounded bg-neutral-900 text-stone-300 border-2 border-zinc-900 text-xs"
                    required
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    JPEG, PNG, or PDF (max 5MB)
                  </p>
                </div>
                <div className="flex justify-center mt-3">
                  <button
                    type="submit"
                    disabled={submitting || !selectedPaymentMethod || !paymentProof}
                    className="inline-flex items-center gap-1.5 px-5 py-1 rounded-3xl border-2 border-solid min-w-auto border-neutral-800 text-xs"
                  >
                    {submitting ? 'Submitting...' : 'Pay Now'}
                  </button>
                </div>
              </form>
            )}
            {currentAssignment.type === 'popup_message' && (
              <>
                <p className="text-stone-400 mb-10 text-[10px] flex item-start">{currentAssignment.itemId?.description}</p>
                {currentAssignment.itemId?.filePath && (
                  console.log("Rendering message popup", submitting, currentAssignment.itemId?.acknowledged),
                  <p className="text-blue-400 mb-3 text-center">
                    <a 
                      href={currentAssignment.itemId?.filePath} 
                      className="text-xs underline"
                    >
                      View Attachment
                    </a>
                  </p>
                )}
                <div className="flex justify-end mt-3">
                <button
                  onClick={handleMessageAck}
                  disabled={submitting}
                  className="inline-flex text-right gap-1.5 px-5 py-3 rounded-full bg-[#E8742A] min-w-auto border-neutral-800 text-[12px]"
                >
                  {submitting ? 'Acknowledging...' : 'Acknowledge'}
                </button>
                </div>
              </>
            )}
            {isBlocking && <p className="text-red-500 mt-3 text-center text-xs">Complete this to proceed</p>}
          </>
        )}
      </div>
    </div>
  );
}
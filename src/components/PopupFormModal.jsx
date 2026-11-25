import React, { useState } from 'react';
import axios from 'axios';

export default function PopupFormModal({ popup, onComplete, onClose }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    // Clear error when user types
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validateField = (field, value) => {
    if (field.required && !value) {
      return 'This field is required';
    }
    
    if (field.validation) {
      if (field.validation.min && Number(value) < field.validation.min) {
        return `Value must be at least ${field.validation.min}`;
      }
      if (field.validation.max && Number(value) > field.validation.max) {
        return `Value must be at most ${field.validation.max}`;
      }
      if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
        return 'Invalid format';
      }
    }
    
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all fields
    const newErrors = {};
    popup.fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      await axios.post(
        `/api/user/popup-forms/${popup._id}/submit`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSubmitSuccess(true);
      setTimeout(() => {
        onComplete(popup._id);
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ form: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const fieldError = errors[field.name];
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            readOnly={field.readonly}
            placeholder={field.placeholder || field.label}
            className={`w-full p-3 rounded bg-gray-700 text-white ${fieldError ? 'border border-red-500' : ''}`}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            readOnly={field.readonly}
            placeholder={field.placeholder || field.label}
            rows={4}
            className={`w-full p-3 rounded bg-gray-700 text-white ${fieldError ? 'border border-red-500' : ''}`}
          />
        );
      
      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            className={`w-full p-3 rounded bg-gray-700 text-white ${fieldError ? 'border border-red-500' : ''}`}
          >
            <option value="">Select {field.label}</option>
            {field.options.map((opt, i) => (
              <option key={i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={field.name}
              checked={!!formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              className="mr-2"
            />
            <span>{field.label}</span>
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options.map((opt, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={formData[field.name] === opt.value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="mr-2"
                />
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        );
      
      case 'file':
        return (
          <input
            type="file"
            name={field.name}
            onChange={(e) => handleChange(field.name, e.target.files[0])}
            required={field.required}
            className={`w-full p-2 rounded bg-gray-700 text-white ${fieldError ? 'border border-red-500' : ''}`}
          />
        );
      
      default:
        return null;
    }
  };

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
        <div className="bg-[var(--card-2)] rounded-lg max-w-md w-full p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Success!</h3>
          <p className="text-gray-300 mb-6">
            {popup.successMessage || 'Your form has been submitted successfully.'}
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => onComplete(popup._id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-[var(--card-2)] rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">{popup.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>
        
        {popup.description && (
          <p className="text-gray-300 mb-6">{popup.description}</p>
        )}
        
        {errors.form && (
          <div className="bg-red-900 text-white p-3 rounded mb-4">
            {errors.form}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {popup.fields?.map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-300 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : popup.submitText || 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}